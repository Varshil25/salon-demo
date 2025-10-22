import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button } from "reactstrap";
import { GetSalon } from "../../../Services/SalonServices"; // Adjust the import path accordingly
import { UserAppointment } from "Services/appointment";
import { setAuthorization } from "helpers/api_helper";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createSelector } from "@reduxjs/toolkit";
import {
  setSelectedSalonAddress,
  setSelectedSalonId,
  setSelectedSalonName,
  setSelectedSalonPhotos,
} from "slices/dashboardProject/selectedSalonSlice";
import { FiChevronDown } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

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

interface Salon {
  id: number;
  name: string;
  address: string;
  photos: string;
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
}

// Main interface for Salon information
interface SalonData {
  salon: Salon;
  salon_id: number;
  salon_name: string;
  address: string;
  appointment_count: number;
  barbers: Barber[];
  photos: string;
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [salons, setSalons] = useState<SalonData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SalonData[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<string>(""); // Updated type
  const [isLoading, setIsLoading] = useState(true);
  const [isAppointmentActive, setIsAppointmentActive] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selector for getting user login data
  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state?.Login?.user, // Ensure state.Login holds user info after login
  }));
  const { user } = useSelector(loginpageData);

  useEffect(() => {
    // Fetch all salons initially when the component mounts
    setLoading(true);
    GetSalon({})
      .then((response) => {
        setSalons(response.data as SalonData[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching salons. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const salonId = e.target.value;
    setSelectedSalon(salonId);

    dispatch(setSelectedSalonId(salonId));

    if (salonId) {
      const selected = salons.find(
        (salon) => salon.salon_id === Number(salonId)
      );
      if (selected) {
        setSearchTerm(selected.salon.name);
        // Dispatch salon name and address to Redux
        dispatch(setSelectedSalonName(selected.salon_name)); // Store salon name
        dispatch(setSelectedSalonAddress(selected.address)); // Store salon address
        dispatch(setSelectedSalonPhotos(selected.salon.photos));
      }
    }
  };

  const handleCheckInClick = () => {    
    if (!selectedSalon) {
      // If no salon is selected, show the toast message
      toast.error("Please First Select a Salon.");
      return;
    }

    if (!user || !user.data || !user.data.token) {
      // If the user is not logged in, redirect to the login page
      navigate("/signin");
      return;
    }

    // Redirect to the salon information page if a salon is selected
    // navigate(`/salon_information/${selectedSalon}`);
    const salonId = Number(selectedSalon);
    navigate(`/salon_information`, { state: { salonId } });
  };

  // Fetch data for the selected salon when "Check In" button is clicked
  const fetchSelectedSalon = () => {
    if (!selectedSalon) return;

    GetSalon({ id: selectedSalon })
      .then((response) => {
        const salonData = response.data as SalonData;
        setSelectedSalon(salonData.salon_id.toString());
      })
      .catch(() => {
        setError("Error fetching salon details. Please try again later.");
      });
  };

  return (
    <React.Fragment>
      <section
        className="section job-hero-section bg-light pb-0"
        id="hero"
        style={{
          height: "100vh",
          margin: "0",
          padding: "0",
          paddingTop: "0px",
        }}
      >
        <div className="position-relative h-100">
          <video
            autoPlay
            loop
            muted
            className="w-100 h-100 position-absolute"
            style={{ objectFit: "cover" }}
          >
            <source
              src={require("../../../assets/images/home_page/back.mp4")}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div
            className="overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          ></div>

          <Container className="h-100 d-flex align-items-center">
            <Row className="w-100 justify-content-between align-items-center">
              <Col lg={6}>
                <div className="homecomponent">
                  <h2 className="fs-3 text-white text-start">Welcome to</h2>
                  <h1 className="custom-heading">
                    Shear Brilliance <br /> Hair Studio
                  </h1>
                  <p className="lead lh-base mb-4" style={{ color: "#fff" }}>
                    At Shear Brilliance, we prioritize customer satisfaction.
                    Explore our site to discover our services, and if you need
                    something specific, we're here to help!
                  </p>
                  <Row className="g-2 justify-content-left">
                    {!isAppointmentActive && (
                      <Col md={6} lg={8} style={{ padding: "0px" }}>
                        <div style={{ position: "relative", width: "100%" }}>
                          <select
                            name="salon"
                            id="salon"
                            className="form-control border-light"
                            value={selectedSalon}
                            onChange={handleSearchChange}
                            style={{
                              height: "48px",
                              borderRadius: "0px",
                              appearance: "none", // Hides the default browser dropdown arrow
                              paddingRight: "40px", // Space for the custom icon
                              fontSize: "16px",
                            }}
                          >
                            <option value="">
                              <span> Select a Salon...</span>
                            </option>
                            {salons
                              // Filter salons with status "open"
                              .map((salon) => (
                                <option
                                  key={salon.salon.id}
                                  value={salon.salon.id}
                                >
                                  {salon.salon.name}
                                </option>
                              ))}
                          </select>
                          <FiChevronDown
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "10px",
                              transform: isDropdownOpen
                                ? "translateY(-50%) rotate(180deg)" // Rotate icon when dropdown is open
                                : "translateY(-50%) rotate(0deg)", // Default position
                              transition: "transform 0.3s ease", // Smooth rotation animation
                              pointerEvents: "none", // Prevent interaction with the icon
                              color: "#6c757d",
                            }}
                          />
                        </div>
                      </Col>
                    )}
                    <Col md={4} lg={4} style={{ padding: "0px" }}>
                      <button
                        className="learn-more-btn w-100"
                        onClick={handleCheckInClick}
                        style={
                          isAppointmentActive
                            ? { fontSize: "13px" } // Custom styles for "View Appointment"
                            : {}
                        }
                      >
                        Book Now
                      </button>
                      <ToastContainer />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Home;
