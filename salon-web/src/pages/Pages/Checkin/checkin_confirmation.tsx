import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  ListGroup,
  ListGroupItem,
  ModalFooter,
  ModalBody,
  Modal,
  ModalHeader,
} from "reactstrap";
import {
  BsGeoAltFill,
  BsStarFill,
  BsInfoCircleFill,
  BsTelephoneFill,
  BsXCircleFill,
} from "react-icons/bs";
import { GrShare } from "react-icons/gr"; // Import GrShare icon
import "./CheckInConfirmation.css"; // Import CSS for styling
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import WaitlistPopup from "./Popup/WaitlistPopup"; // Ensure path is correct
import { GetAppointmentById } from "../../../Services/appointment"; // Import your API method
import { CeateFavoriteSalon } from "../../../Services/FavoriteSalon"; // Import favorite toggle API
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { putCanselAppointment } from "Services/AuthService";
import { toast } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css";
import LoaderInner from "Components/Common/LoaderInner";
import { io, Socket } from "socket.io-client";
import config from "config";
const token = localStorage.getItem("token");
const { api } = config;

// Service data interface
interface Service {
  id: number;
  name: string;
  default_service_time: number;
}
// Appointment data interface
interface Appointment {
  id: number;
  user_id: number;
  barber_id: number;
  salon_id: number;
  number_of_people: number;
  status: string;
  estimated_wait_time: number;
  queue_position: number;
  mobile_number: string;
  name: string;
  is_like: boolean; // Track if the salon is liked
  salon: {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    open_time: string;
    close_time: string;
    photos: string;
    google_url: string | null;
    status: "open" | "close";
    services: string | null;
    pricing: string | null;
    faq: string | null;
    weekend_day: boolean;
    weekend_start: string | null;
    weekend_end: string | null;
  };
  Barber: {
    name: string;
  };
  Services: Service[]; // Array of services
}

const CheckInConfirmation: React.FC = () => {
  // const { id } = useParams<{ id: any }>(); // Get `id` from the route
  const location = useLocation();
  const { stateId } = location.state || {};
  const [modal, setModal] = useState(false);
  const [appointment, setAppointment] = useState<any>(null); // State to store appointment data
  const [isFavorite, setIsFavorite] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const toggle = () => setModal(!modal);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toggleConfirmModal = () => setConfirmModal(!confirmModal); // Toggle confirmation modal

  useEffect(() => {
    const fetchAndUpdateAppointment = async () => {
      try {
        const response = await GetAppointmentById(stateId);
        setIsLoading(true);
        const appointmentData = response.data;
        setAppointment(appointmentData); // Set the fetched appointment data in state

        if (appointmentData.is_like) {
          setIsFavorite(true); // Star will be active
        } else {
          setIsFavorite(false); // Star will not be active
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };
    // Fetch appointment data when component mounts
    fetchAndUpdateAppointment();
  }, [stateId, token]); // Only depend on `id` and `token`

  // useEffect(() => {
  //   const socket = io("https://shear-brilliance-api.onrender.com", {
  //     transports: ["websocket"],
  //     withCredentials: true,
  //     query: { token },
  //   });
  useEffect(() => {
    const socket = io(api.MAIN_URL, {
      transports: ["websocket"],
      withCredentials: true,
      query: { token },
    });

    // Listen for messages from the servers
    socket.on("waitTimeUpdate", (data) => {
      console.log("Message from server:", data);

      // Ensure appointment exists before updating
      setAppointment((prev: any) => {
        if (prev) {
          return {
            ...prev,
            estimated_wait_time: data.estimated_wait_time,
            status: data.status,
            queue_position: data.queue_position,
          };
        }
        return prev;
      });
    });
    // Cleanup function to avoid memory leaks
    return () => {
      socket.off("waitTimeUpdate"); // Clean up the socket event listener
    };
  }, [token]); // Only depend on id and token

  useEffect(() => {
    // Push the current state to the history stack to prevent back navigation
    window.history.pushState({}, "", window.location.href);

    const handlePopState = () => {
      navigate("/"); // Redirect to the home page
    };

    // Add an event listener for the "popstate" event
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Toggle favorite status for the salon
  const toggleFavorite = async () => {
    if (!appointment) return;

    const newStatus = isFavorite ? "dislike" : "like";
    const data = {
      UserId: appointment.user_id,
      SalonId: appointment.salon.id,
      status: newStatus,
      device_id: null,
    };

    try {
      await CeateFavoriteSalon(data); // Call API to update the favorite status
      setIsFavorite((prev) => !prev); // Toggle local favorite state
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Unable to update favorite status.");
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Check if it has a valid length for a US phone number (10 digits or 11 starting with '1')
    if (cleaned.length === 10) {
      // Format the phone number as +1 (XXX) XXX-XXXX
      return `+1 (${cleaned.substring(0, 3)}) ${cleaned.substring(
        3,
        6
      )}-${cleaned.substring(6)}`;
    }

    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      // Format the phone number as +1 (XXX) XXX-XXXX (removing the leading 1 if already present)
      return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(
        4,
        7
      )}-${cleaned.substring(7)}`;
    }

    return "Invalid Number"; // Return an error message for invalid numbers
  };

  // Cancel appointment function
  const cancelAppointment = async () => {
    if (!appointment) return;

    // Show warning for "in_salon" or "completed" status
    if (["in_salon", "completed"].includes(appointment.status)) {
      return; // Prevent further execution
    }

    try {
      const response = await putCanselAppointment(appointment.id);
      const data: any = response;

      if (data.success) {
        toast.success(data.message || "Appointment cancelled successfully");
        navigate("/");
      } else {
        toast.error("There was an error canceling your appointment");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("There was an error canceling your appointment.");
    }
  };

  function formatEstimatedWaitTime(minutes: number) {
    if (minutes === 0) {
      // Explicitly handle the case when minutes is 0
      return `${minutes} min`;
    } else if (minutes <= 59) {
      // If less than or equal to 59, show "10 min"
      return `${minutes} min`;
    } else {
      // Calculate hours and remaining minutes
      const hours = Math.floor(minutes / 60); // Integer division to get hours
      const remainingMinutes = minutes % 60; // Modulo to get remaining minutes

      // Return formatted string
      return `${hours} hr ${remainingMinutes.toString().padStart(2, "0")} min`;
    }
  }
  console.log(formatEstimatedWaitTime(0));

  return (
    <React.Fragment>
      <Navbar />
      {isLoading && <LoaderInner />}
      <section
        className="d-flex justify-content-center align-items-center text-center text-white"
        style={{
          height: "100px",
          marginTop: "97px",
          position: "relative",
          overflow: "hidden",
          fontSize: window.innerWidth <= 768 ? "4rem" : "6rem",
        }}
      >
        <img
          src={serviceImage}
          alt="Service Background"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: "-2",
          }}
        />
        <div>
          <h1
            className="text-white custom-heading"
            style={{
              fontSize: window.innerWidth <= 768 ? "1.6rem" : "2.5rem",
              lineHeight: "1.5",
              letterSpacing: "0.1em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
            You're Checked In
          </h1>
        </div>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "-1",
          }}
        />
      </section>

      <Container className="checkin-container  d-flex  align-items-center">
        <Row className="w-100 justify-content-center">
          {" "}
          {/* Center the row content */}
          {/* Left Section */}
          <Col
            lg={6} // Keep this responsive for larger screens
            md={12}
            className="text-center d-flex flex-column justify-content-center"
          >
            <h6 className="text-uppercase text-muted">Your Estimated Wait</h6>
            {/* <h1 className="display-1 fw-bold text-dark">
              {appointment?.estimated_wait_time} min
            </h1> */}
            <h1 className="display-1 fw-bold text-dark">
              {appointment?.estimated_wait_time !== undefined
                ? formatEstimatedWaitTime(appointment.estimated_wait_time)
                : "Loading..."}
            </h1>

            <p className="text-muted mb-0">
              Head to the salon and let us know you’re here
            </p>
            <p>
              You are{" "}
              <strong className="text-success">
                {appointment?.queue_position}
              </strong>{" "}
              in line
            </p>
            <div>
              <Button
                color="success"
                className="mt-3 learn-more-btn align-self-center"
                onClick={
                  appointment?.status === "completed" ||
                  appointment?.status === "canceled"
                    ? () => navigate("/") // Redirect to home if status is "completed" or "canceled"
                    : toggle // Toggle the modal otherwise
                }
              >
                {appointment?.status === "completed" ||
                appointment?.status === "canceled"
                  ? "Go To Home"
                  : "View Waitlist"}
              </Button>

              {/* Waitlist Popup */}
              <WaitlistPopup
                isOpen={modal}
                toggle={toggle}
                appointmentId={appointment?.id}
              />
            </div>
          </Col>
          {/* Right Section with Wider Card */}
          <Col lg={6} md={12} className="d-flex justify-content-center">
            <Card className="shadow-lg border-0 mt-4 mt-lg-0 card-custom-width">
              <CardBody style={{paddingBottom: "5px"}}>
              <span className="badge bg-success text-white mb-2 ms-2 py-2">
              Type:{" "}
                {(() => {
                  // Map the database values to display labels
                  const statusLabels: { [key: string]: string } = {
                    checked_in: "Checkin",
                    in_salon: "In salon",
                    completed: "Completed",
                    canceled: "Canceled",
                  };
                  return statusLabels[appointment?.status as string] || appointment?.status;
                })()}
              </span>

                <CardTitle tag="h4" className="mb-2 ms-2 text-muted fs-18">
                <strong className="text-dark">Barber:</strong> {appointment?.Barber?.name}
                </CardTitle>
               <CardTitle tag="h4" className="mb-2 ms-2 text-muted fs-18">
                <strong className="text-dark">Salon:</strong> {appointment?.salon.name}
                </CardTitle>
                <p className="text-muted ms-2 mb-2"><strong className="text-dark me-1">Address:</strong>
                 {appointment?.salon.address}
                </p>
                <p className="text-dark ms-2 mb-2"><strong className="me-1">Services:</strong>  
                {appointment?.Services?.map((service: any, index: number) => (
                    <span key={index} className="services_list mb-2">
                      {service.name}
                    </span>
                  ))}
                  <br />
                </p>

                <p className="text-success ms-2 mb-0">
                  {appointment?.salon.status} • Closes{" "}
                  {appointment?.salon.close_time}
                </p>

                <ListGroup flush>
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    <div className="d-flex align-items-center">
                      <BsGeoAltFill className="me-3 text-success" />
                      Get directions
                    </div>
                    <a
                      href={appointment?.salon?.google_url ?? ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark"
                    >
                      <GrShare className="text-success" />
                    </a>
                  </ListGroupItem>
                  <hr style={{ margin: "0px" }} />

                  {/* Add to Favorites Item */}
                  <ListGroupItem
                    className="d-flex align-items-center justify-content-between"
                    onClick={toggleFavorite}
                    style={{marginTop: "0px"}}
                  >
                    <div className="d-flex align-items-center">
                      <BsStarFill
                        className={`me-3 ${
                          isFavorite ? "text-success" : "text-muted"
                        }`}
                      />
                      <span className="text-dark">Add to favorites</span>
                    </div>
                  </ListGroupItem>

                  <hr style={{ margin: "0px" }} />
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    <div className="d-flex align-items-center">
                      <BsInfoCircleFill className="me-3 text-success" />
                      <Link to="/services" className="text-dark me-2 link-hover">
                        Services
                      </Link>
                      &
                      <Link to="/price" className="ms-2 text-dark link-hover">
                        Pricing
                      </Link>
                    </div>
                  </ListGroupItem>

                  <hr style={{ margin: "0px" }} />
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    <div className="d-flex align-items-center">
                      <BsTelephoneFill className="me-3 text-success" />
                      {appointment?.mobile_number
                        ? formatPhoneNumber(appointment.salon.phone_number)
                        : "N/A"}
                    </div>
                    <a
                      href={`tel:${appointment?.salon.phone_number || ""}`}
                      className="text-dark"
                    >
                      <GrShare className="text-success" />
                    </a>
                  </ListGroupItem>
                  <hr style={{ margin: "0px" }} />
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    <a onClick={toggleConfirmModal} className="text-dark">
                      <div className="d-flex align-items-center">
                        <BsXCircleFill
                          className="me-3 text-success"
                          onClick={toggleConfirmModal}
                        />{" "}
                        Cancel check-in
                      </div>
                    </a>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
      <Modal isOpen={confirmModal} toggle={toggleConfirmModal}>
        <ModalHeader toggle={toggleConfirmModal}>
          {appointment?.status &&
          ["in_salon", "completed"].includes(appointment.status)
            ? "Action Not Allowed"
            : "Confirm Cancellation"}
        </ModalHeader>
        <ModalBody>
          {appointment?.status &&
          ["in_salon", "completed"].includes(appointment.status) ? (
            <p>
              You cannot cancel an appointment with the status **In Salon** or
              **Completed**.
            </p>
          ) : (
            <p>Are you sure you want to cancel your appointment?</p>
          )}
        </ModalBody>
        <ModalFooter>
          {appointment?.status &&
          ["in_salon", "completed"].includes(appointment.status) ? (
            <Button color="success" onClick={toggleConfirmModal}>
              OK
            </Button>
          ) : (
            <>
              <Button color="success" onClick={cancelAppointment}>
                YES
              </Button>
              <Button color="success" onClick={toggleConfirmModal}>
                No
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default CheckInConfirmation;
