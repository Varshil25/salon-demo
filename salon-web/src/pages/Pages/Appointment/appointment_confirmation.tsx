import React, { useEffect, useState } from "react";
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
import { FiCalendar, FiClock } from "react-icons/fi";
import { GrShare } from "react-icons/gr";
import "../Checkin/CheckInConfirmation.css"; // Import CSS for styling
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirmationloader from "Components/Common/Confirmationloader";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GetAppointmentById } from "Services/appointment";
import { Cancelappointmentbyyid } from "Services/AuthService";
import { useSelector } from "react-redux";
const token = localStorage.getItem("token");
interface AppointmentResponse {
  success: boolean;
  message: string;
  data: AppointmentData;
  code: number;
}

interface AppointmentData {
  id: number;
  UserId: number;
  BarberId: number;
  SalonId: number;
  SlotId: number;
  number_of_people: number;
  status: string;
  estimated_wait_time: string | null;
  queue_position: string | null;
  device_id: string | null;
  check_in_time: string | null;
  in_salon_time: string | null;
  complete_time: string | null;
  cancel_time: string | null;
  mobile_number: string;
  name: string;
  appointment_start_time: string;
  appointment_end_time: string;
  appointment_date: string;
  createdAt: string;
  updatedAt: string;
  salon: Salon;
  Barber: Barber;
  Services: Service[];
  is_like: boolean;
}

interface Salon {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  open_time: string;
  close_time: string;
  photos: string[];
  google_url: string;
  status: string;
  services: string | null;
  pricing: string | null;
  faq: string | null;
  weekend_day: boolean;
  weekend_start: string | null;
  weekend_end: string | null;
  UserId: number;
}

interface Barber {
  id: number;
  name: string;
  availability_status: string;
  cutting_since: string;
  organization_join_date: string;
  photo: string | null;
  background_color: string;
  default_start_time: string;
  default_end_time: string;
  category: number;
  position: string;
  SalonId: number;
  UserId: number;
  non_working_days: string[];
}

interface Service {
  id: number;
  name: string;
  default_service_time: number;
}

const Appointment_Confirmation: React.FC = () => {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null); // Store dynamic appointment data
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const appointmentId = id ? Number(id) : location.state?.appointmentId;

  useEffect(() => {
    const fetchAndUpdateAppointment = async () => {
      try {
        setLoading(true); // Start loading
        const response = await GetAppointmentById(appointmentId);
        const { data } = response; // Extract appointment data
        setAppointment(data); // Store appointment data
        setError(null); // Clear error
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setError("Failed to fetch appointment data.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAndUpdateAppointment();
  }, [appointmentId]);

  const openConfirmModal = () => {
    setConfirmModal(true);
  };
  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const totalPrice = useSelector(
    (state: any) => state.selectedSalon.totalPrice
  );

  // const toggleConfirmModal = async () => {
  //   try {
  //     if (id) {
  //       // Call the Cancelappointmentbyyid API
  //       await Cancelappointmentbyyid(id);
  //       alert("Appointment cancelled successfully");
  //       // Close the modal after successful API call
  //       navigate("/");
  //       setConfirmModal(false);
  //     } else {
  //       // Handle case where there is no appointment ID
  //       alert("No appointment to cancel");
  //     }
  //   } catch (error) {
  //     console.error("Error cancelling appointment:", error);
  //     alert("Failed to cancel the appointment");
  //   }
  // };

  const handleCancelAppointment = async () => {
    try {
      if (appointment?.status === "canceled") {
        // Show toast if the appointment is already canceled
        toast.info("Your Appointment is already Cancled");
        return; // Exit early as no further action is needed
      }

      if (appointment?.status === "completed") {
        toast.info("Your Appointment is Completed.");
        return;
      }

      if (appointmentId) {
        // Call the Cancelappointmentbyyid API
        await Cancelappointmentbyyid(appointmentId);
        toast.success("Appointment cancelled successfully");
        // Navigate to home page or desired location
        navigate("/");
      } else {
        // Handle case where there is no appointment ID
        toast.warn("No appointment to cancel");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel the appointment");
    } finally {
      setConfirmModal(false); // Close the modal after the operation
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+1 (${cleaned.substring(0, 3)}) ${cleaned.substring(
        3,
        6
      )}-${cleaned.substring(6)}`;
    }
    return "Invalid Number";
  };

  if (loading) {
    return <Confirmationloader />; // Show loader while fetching
  }

  if (error) {
    return (
      <div className="text-center">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  if (!appointment) {
    return null; // If no appointment data, return nothing
  }

  // Function to format time from 24-hour to 12-hour format
  const formatTime = (time: any) => {
    if (!time || typeof time !== "string" || !time.includes(":")) {
      return "N/A"; // Return a fallback if time is invalid
    }
    const [hours, minutes] = time?.split(":");
    let formattedHours = parseInt(hours, 10);
    const formattedMinutes = minutes;
    const suffix = formattedHours >= 12 ? "PM" : "AM";

    // Convert 24-hour to 12-hour format
    if (formattedHours > 12) formattedHours -= 12;
    if (formattedHours === 0) formattedHours = 12; // Handle midnight as 12 AM

    return `${formattedHours}:${formattedMinutes} ${suffix}`;
  };


  const groupedServices = appointment.Services.reduce((acc: any, service: any) => {
    const existingService = acc.find((s: any) => s.id === service.id);
    if (existingService) {
      existingService.count += 1;
    } else {
      acc.push({ ...service, count: 1 });
    }
    return acc;
  }, []);

  return (
    <React.Fragment>
      <Navbar />
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
              fontSize: window.innerWidth <= 768 ? "1.4rem" : "2.5rem",
              lineHeight: "1.5",
              letterSpacing: "0.1em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
            Appointment Confirmed
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
      <Container className="checkin-container d-flex align-items-center">
        <Row className="w-100 justify-content-center">
          <Col lg={6} md={12} className="d-flex justify-content-center">
            <Card className="shadow-lg border-0 mt-4 mt-lg-0 card-custom-width">
              <CardBody style={{paddingBottom: "5px"}}>
                <span className="badge bg-success text-white mb-2 ms-2 py-2">
                Type:{" "}
                  {appointment.status === "appointment"
                    ? "Appointment"
                    : appointment.status === "canceled"
                      ? "Canceled"
                      : appointment.status}
                </span>
                <CardTitle tag="h4" className="mb-2 ms-2 text-muted fs-18">
                <strong className="text-dark">Barber:</strong> {appointment.Barber.name}
                </CardTitle>
                <CardTitle tag="h4" className="mb-2 ms-2 text-muted fs-18">
                <strong className="text-dark">Salon:</strong> {appointment.salon.name}
                </CardTitle>
                <p className="text-muted ms-2 mb-2"><strong className="text-dark">Address:</strong> {appointment.salon.address}</p>
                <p className="text-dark ms-2 mb-2"><strong className="me-1">Services:</strong> 
                {groupedServices.map((service: any) => (
                  <span key={service.id} className="services_list mb-2 ms-1 ">
                    {service.name} - {service.count}
                  </span>
                ))}
                </p>
                <p className="ms-2 mb-2"><strong className="text-dark">Total Price:</strong> <b>${totalPrice.toFixed(2)}</b></p>
                <p className="text-dark ms-2 mb-1 d-flex align-items-center">
                  <FiCalendar className="me-2 mb-1" size={14} strokeWidth={3}/>
                  <span className="text-dark">{appointment.appointment_date}</span>
                </p>
                <p className="text-dark ms-2 mb-1 d-flex align-items-center">
                  <FiClock className="me-2" size={14} strokeWidth={3} />
                  <span className="text-dark">{formatTime(appointment.appointment_start_time)}-
                  {formatTime(appointment.appointment_end_time)}</span>
                </p>
                <ListGroup flush>
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    <div className="d-flex align-items-center">
                      <BsGeoAltFill className="me-3 text-success" />
                      Get directions
                    </div>
                    <a
                      href={
                        appointment.salon.google_url.startsWith("http")
                          ? appointment.salon.google_url
                          : "https://" + appointment.salon.google_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark"
                    >
                      <GrShare className="text-success hover-effect" />
                    </a>
                  </ListGroupItem>
                  <hr style={{ margin: "0px" }} />
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    <div className="d-flex align-items-center">
                      <BsInfoCircleFill className="me-3 text-success" />
                      <Link to="/services" className="text-dark me-2 link-hover">
                        Services
                      </Link>
                      &amp;
                      <Link to="/price" className="ms-2 text-dark link-hover">
                        Pricing
                      </Link>
                    </div>
                  </ListGroupItem>
                  <hr style={{ margin: "0px" }} />
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    <div className="d-flex align-items-center">
                      <BsTelephoneFill className="me-3 text-success" />
                      {formatPhoneNumber(appointment.salon.phone_number)}
                    </div>
                    <a
                      href={`tel:${appointment.salon.phone_number}`}
                      className="text-dark"
                    >
                      <GrShare className="text-success" />
                    </a>
                  </ListGroupItem>
                  <hr style={{ margin: "0px" }} />
                  <ListGroupItem className="d-flex align-items-center justify-content-between" style={{marginTop: "0px"}}>
                    {appointment?.status === "completed" ||
                      appointment?.status === "canceled" ? (
                      <div
                        className="text-muted"
                        title="Cannot cancel a completed or canceled appointment"
                      >
                        <div className="d-flex align-items-center">
                          <BsXCircleFill className="me-3 text-muted" />
                          Cancel Appointment
                        </div>
                      </div>
                    ) : (
                      <a onClick={toggleConfirmModal} className="text-dark">
                        <div className="d-flex align-items-center">
                          <BsXCircleFill className="me-3 text-success" />
                          Cancel Appointment
                        </div>
                      </a>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
      <Footer />
      <Modal isOpen={confirmModal} toggle={toggleConfirmModal}>
        <ModalHeader toggle={toggleConfirmModal}>
          Confirm Cancellation
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to cancel your Appointment?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleCancelAppointment}>
            Confirm
          </Button>
          <Button
            color="success"
            onClick={toggleConfirmModal}
            className="text-light"
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Appointment_Confirmation;
