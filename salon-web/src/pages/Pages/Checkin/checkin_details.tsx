import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Container,
  CardImg,
} from "reactstrap";
import {
  BsCheckCircleFill,
  BsGeoAlt,
  BsClock,
  BsTelephone,
  BsInfoCircle,
} from "react-icons/bs";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import {
  Getappointmentscategory,
  GetSalonId,
} from "../../../Services/SalonServices"; // Import the API function
import { useParams } from "react-router-dom";
import LoaderInner from "Components/Common/LoaderInner";
import salondetails_1 from "../../../assets/images/Salondetails/salondetails_1.jpg";
import salondetails_2 from "../../../assets/images/Salondetails/salondetails_2.jpg";
import salondetails_3 from "../../../assets/images/Salondetails/salondetails_3.jpg";
import default_salon_img from "../../../assets/images/Selectsalon/default_salon_img.png";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { setAuthorization } from "helpers/api_helper";
import ScrollToTop from "Components/Common/ScrollToTop";

// Data interface for salons
interface Barber {
  barber_id: number;
  barber_name: string;
  service_time: number;
  cutting_since: string;
  organization_join_date: string;
  photo: string;
  estimated_wait_time: number;
}

// Main interface for Salon information
interface SalonData {
  salon: {
    id: number;
    name: string;
    address: string;
    photos: string; // Assuming photos is a JSON string array
    phone_number: string;
    open_time: string;
    close_time: string;
    google_url: string | null;
    status: "open" | "close";
    services: string | null;
    pricing: string | null;
    faq: string | null;
    weekend_day: boolean;
    weekend_start: string | null;
    weekend_end: string | null;
  };
  salon_id: number;
  salon_name: string;
  address: string;
  appointment_count: number;
  barbers: Barber[];
  photos: string; // Another JSON string array of photos at the top level
  estimated_wait_time: number;
  min_wait_time: number;
}

const Checkin_details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Step 1", "Step 2", "Step 3"];
  const [salonData, setSalonData] = useState<SalonData | null>(null); // Add state for salon data
  const location = useLocation();
  const { salonId } = location.state || {};
  const navigate = useNavigate(); // Initialize the navigate function
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState("Laoding...");
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [isAppointmentActive, setIsAppointmentActive] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  // Redux selector for getting user login data
  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state?.Login?.user, // Ensure state.Login holds user info after login
  }));

  // Fetching user data from Redux store
  const { user } = useSelector(loginpageData);
  const firstName = user?.data?.user?.firstname || ""; // Get the first name if available

  useEffect(() => {
    // Check if the user's token is not available in localStorage
    const token = localStorage.getItem("token"); // Assuming the token is stored as "token" in localStorage

    if (!token) {
      navigate("/signin"); // Redirect to the signin page if token is not found
    }
  }, [navigate]);

  // Fetch salon data on component mount
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const response = await GetSalonId(salonId); // API call to fetch salon details
        setIsLoading(true);
        const fetchedSalonData = response.data;

        setSalonData(fetchedSalonData); // Update salon data state
        setIsLoading(false);

        // Disable button if the salon is closed
        if (fetchedSalonData.salon.status === "close") {
          setIsButtonDisabled(true);
        } else {
          setIsButtonDisabled(false);
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setIsLoading(false);
      }
    };

    fetchSalonData();
  }, [salonId]);

  useEffect(() => {
    const fetchAppointmentStatus = async () => {
      setIsLoading(true);
      try {
        if (!user || !user.data || !user.data.user.id) {
          console.error("User data is not available yet.");
          setIsLoading(false);
          return;
        }

        const token = user.data.token || localStorage.getItem("authToken");
        if (!token) {
          console.error("Authentication token is missing.");
          setIsLoading(false);
          return;
        }

        // Set token in Axios headers
        setAuthorization(token);

        // Set category as 2 statically
        const category = 2;

        // Make the API call with the static category value of 2
        const response = await Getappointmentscategory(category);
        const data: any = response;

        if (data.success && data.data.length > 0) {
          const appointmentData = data.data[0]; // Get the first appointment

          if (appointmentData.status === "checked_in") {
            // If the appointment is checked-in, set button to "Check In"
            setIsAppointmentActive(true);
            setAppointmentData(appointmentData);
            setButtonText("View Checkin");
          }
        } else {
          // If no appointment found, show "Book Appointment"
          setIsAppointmentActive(false);
          setButtonText("Check In");
        }
      } catch (error) {
        console.error("Error fetching appointment status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAppointmentStatus();
    }
  }, [user]);

  // Handle Back navigation
  const handleBack = () => {
    navigate("/select_services"); // Navigate to the /checkin path
  };

  // Handle Next navigation
  const handleNext = () => {
    if (isButtonDisabled || isLoading) return;
    if (isLoading) return;

    if (!user?.data?.token) {
      // Redirect to sign-in if user is not logged in
      navigate("/signin");
      return;
    }

    if (appointmentData?.status === "checked_in") {
      // Navigate to the check-in confirmation page
      const stateId = appointmentData.id;
      navigate(`/checkinconfirmation`, { state: { stateId } });
      // navigate(`/checkinconfirmation/${appointmentId}`);
    } else {
      // Navigate to the check-in form page
      const nextStep = activeStep + 1;
      // navigate(`/checkinform?step=${nextStep}&salon=${salonData?.salon_name}`);
      navigate(`/checkinform`, { state: { step: nextStep, salon: salonData?.salon_name } });
      // Scroll to the top of the page after navigation
    }
  };

  const formatPhoneNumber = (phoneNumber: any) => {
    // Remove any non-numeric characters from the phone number
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");

    // Format the number if it's valid (length of 10 digits)
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return the original phone number if it doesn't match the expected format
  };

  // Opening Hours Section
  const OpeningHours = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Function to format time from 24-hour to 12-hour format
    const formatTime = (time: any) => {
      const [hours, minutes] = time.split(":");
      let formattedHours = parseInt(hours, 10);
      const formattedMinutes = minutes;
      const suffix = formattedHours >= 12 ? "PM" : "AM";

      // Convert 24-hour to 12-hour format
      if (formattedHours > 12) formattedHours -= 12;
      if (formattedHours === 0) formattedHours = 12; // Handle midnight as 12 AM

      return `${formattedHours}:${formattedMinutes} ${suffix}`;
    };

    // Get the current day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
    const currentDayIndex = new Date().getDay();
    const currentDay = daysOfWeek[currentDayIndex];

    return (
      <Row className="align-items-center mb-3 ms-2">
        <Col xs="auto">
          <BsClock size={20} />
        </Col>
        <Col>
          {/* <p className="text-success fw-bold mb-0">{salonData?.salon.status}</p> */}
          {daysOfWeek.map((day) =>
            day === currentDay ? (
              <Row key={day}>
                <Col className="text-dark text-primary">
                  <span className="text-success">
                    {salonData?.salon.status}
                  </span>{" "}
                  <span className="text-success">&nbsp;•&nbsp;</span> {day}{" "}
                  <span className="text-success">&nbsp;•&nbsp;</span>{" "}
                  {
                    salonData
                      ? `${formatTime(
                        salonData.salon.open_time
                      )} - ${formatTime(salonData.salon.close_time)}`
                      : `${formatTime("09:00:00")} - ${formatTime("17:00:00")}` // Default time if data isn't loaded yet
                  }
                </Col>
              </Row>
            ) : null
          )}
        </Col>
      </Row>
    );
  };

  return (
    <React.Fragment>
      <Navbar />
      {isLoading && <LoaderInner />}
      <ScrollToTop />
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
        {/* Overlay for Background */}
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
        <div>
          <h1
            className="text-white custom-heading"
            style={{
              fontSize: window.innerWidth <= 768 ? "2rem" : "2.5rem",
              lineHeight: "1.5",

              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
            {salonData?.salon_name}
          </h1>
        </div>
      </section>

      <Container className="mt-5 mb-5">
        <Row>
          <Col xs="12" sm="12" md="8" lg="8" xl="8" xxl="8">
            <Row className="image-container">
              {isLoading ? (
                <p>Loading...</p> // Show a loading indicator while data is being fetched
              ) : (
                (() => {
                  try {
                    const photos = salonData?.salon?.photos; // Get photos field
                    const parsedPhotos = Array.isArray(photos)
                      ? photos // Already an array
                      : JSON.parse(photos || "[]"); // Parse if it's a string

                    const photoCount = parsedPhotos.length;

                    if (photoCount === 0) {
                      // If no photos, show the default image
                      return (
                        <Col xs="12">
                          <Card className="default-image">
                            <img
                              src={default_salon_img} // Show default image
                              style={{ borderRadius: "6px", objectFit: "cover" }}
                              alt="Default Salon"
                            />
                          </Card>
                        </Col>
                      );
                    }

                    return (
                      <>
                        {/* If there's only one photo, show it full width */}
                        {photoCount === 1 && (
                          <Col xs="12">
                            <Card
                              className="full-width-image"
                              style={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              }}
                            >
                              <img
                                src={parsedPhotos[0]} // Show the first photo
                                style={{
                                  borderRadius: "6px",
                                  // width: window.innerWidth < 768 ? "100%" : "50%", // Set based on screen size
                                  width: "90%", // Set based on screen size
                                  height: window.innerWidth < 768 ? "150px" : "300px",
                                  margin: "auto",
                                }}
                                alt="Salon"
                              />
                            </Card>
                          </Col>
                        )}

                        {/* If there are two photos, show them side by side with a good design */}
                        {photoCount === 2 && (
                          <Col xs="12">
                            <Row>
                              <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6" style={{ padding: "0 10px" }}>
                                <Card className="small-image">
                                  <img
                                    src={parsedPhotos[0]} // First photo
                                    style={{
                                      borderRadius: "6px",
                                      objectFit: "cover",
                                      width: "100%",
                                      height: window.innerWidth < 768 ? "150px" : "300px",
                                    }}
                                    alt="Salon"
                                  />
                                </Card>
                              </Col>
                              <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6" style={{ padding: "0 10px" }}>
                                <Card className="small-image">
                                  <img
                                    src={parsedPhotos[1]} // Second photo
                                    style={{
                                      borderRadius: "6px",
                                      objectFit: "cover",
                                      width: "100%",
                                      height: window.innerWidth < 768 ? "150px" : "300px",
                                    }}
                                    alt="Salon"
                                  />
                                </Card>
                              </Col>
                            </Row>
                          </Col>
                        )}

                        {/* If there are three or more photos, show the existing design CUSTOM*/}
                        {photoCount >= 3 && (
                          <>
                            {/* Large Image */}
                            <Col xs="12" sm="12" md="12" lg="4" xl="4" xxl="4">
                              <Card className="large-image">
                                <img
                                  src={parsedPhotos[0]} // Show the first photo
                                  style={{
                                    borderRadius: "6px",
                                    objectFit: "cover",
                                  }}
                                  alt="Salon"
                                />
                              </Card>
                            </Col>

                            {/* Small Images */}
                            <Col xs="12" sm="12" md="12" lg="8" xl="8" xxl="8">
                              <Row>
                                {/* Small Image 1 */}
                                {photoCount >= 2 && (
                                  <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                                    <Card className="small-image">
                                      <CardImg
                                        top
                                        width="332px"
                                        src={parsedPhotos[1]} // Show the second photo
                                        alt="Small Image 1"
                                        style={{
                                          borderRadius: "6px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Card>
                                  </Col>
                                )}

                                {/* Small Image 2 */}
                                {photoCount >= 3 && (
                                  <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                                    <Card className="small-image">
                                      <CardImg
                                        top
                                        width="332px"
                                        src={parsedPhotos[2]} // Show the third photo
                                        alt="Small Image 2"
                                        style={{
                                          borderRadius: "6px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Card>
                                  </Col>
                                )}
                              </Row>
                            </Col>
                          </>
                        )}
                      </>
                    );
                  } catch (error) {
                    console.error("Error parsing photos:", error); // Debug parsing errors
                    return null; // Return nothing on error
                  }
                })()
              )}
            </Row>
          </Col>
          <Col xs="12" sm="12" md="4" lg="4" xl="4" xxl="4">
            <Card className="shadow-sm" style={{ borderRadius: "10px" }}>
              <CardBody
                style={{ border: "1px solid #be9342", borderRadius: "10px" }}
              >
                {/* Header with Estimated Wait Time */}
                {/* <Row className="text-center mb-4">
              <Col>
                <p className="text-muted mb-1">ESTIMATED WAIT</p>
                <h1 className="display-4 fw-bold text-success">
                  {salonData ? `${salonData.min_wait_time} min` : "Loading..."}
                </h1>
                <h5 className="fw-semibold text-dark">
                  {salonData?.salon_name || "Loading..."}
                </h5>
              </Col>
            </Row> */}

                <Row className="align-items-center mb-3 ms-2">
                  <Col xs="auto">
                    <BsGeoAlt size={20} />
                  </Col>
                  <Col>
                    {/* <p className="mb-0">
                  {salonData?.salon.address || "Loading..."}
                </p> */}
                    <p className="fs-15 mb-0">
                      {salonData?.salon_name || "Loading..."}
                    </p>
                  </Col>
                </Row>

                <hr />

                {/* Opening Hours Section */}
                <OpeningHours />

                <hr />

                {/* Phone Number Section */}
                <Row className="align-items-center mb-3 ms-2">
                  <Col xs="auto">
                    <BsTelephone size={20} />
                  </Col>
                  <Col>
                    <a
                      href={`tel:+${salonData?.salon.phone_number}`}
                      className="text-dark mb-0"
                    >
                      {salonData?.salon.phone_number
                        ? formatPhoneNumber(salonData.salon.phone_number)
                        : "Loading..."}
                    </a>
                  </Col>
                </Row>

                <hr />

                {/* Services and Pricing Section */}
                <Row className="align-items-center ms-2">
                  <Col xs="auto">
                    <BsInfoCircle size={20} />
                  </Col>
                  <Col>
                    <Link to="/services" className="text-dark">
                      Services
                    </Link>
                    &nbsp; & &nbsp;{""}
                    {/* This adds a separator between the two links */}
                    <Link to="/price" className="text-dark">
                      Pricing
                    </Link>
                  </Col>
                </Row>
              </CardBody>
            </Card>

        {/* Horizontal Stepper */}
        <div className="stepper-container">
          <div className="buttons mt-3">
            <button onClick={handleBack}>Appointment</button>

            <button
              onClick={handleNext}
              disabled={isButtonDisabled}>
              {isLoading ? "Loading..." : buttonText}
              {/* {buttonText} */}
            </button>
          </div>
        </div>
          </Col>
        </Row>
 
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default Checkin_details;
