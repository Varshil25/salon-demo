import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import {
  CreateBarberSession,
  GetBarbers,
  GetSalon,
  GetSalonId,
  GetServices,
} from "../../../Services/SalonServices"; // API function to fetch salon data
import {
  CeateAppointment,
  GetAppointmentById,
} from "../../../Services/appointment"; // Assuming you have this service function
import { useDispatch, useSelector } from "react-redux"; // Importing useSelector and useDispatch
import { createSelector } from "@reduxjs/toolkit";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderInner from "Components/Common/LoaderInner";
import { Spinner } from "reactstrap"; // Import Spinner component
import { debug } from "console";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { FaArrowLeft } from "react-icons/fa";

// Data interface for salons
interface Barber {
  barber_id: number;
  barber_name: string;
  service_time: number;
  cutting_since: string;
  organization_join_date: string;
  photo: string;
  estimated_wait_time: number;
  availability_status: string;
  start_time: string;
  end_time: string;
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
    pricing: any | null;
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
}

// Data interface for Appointment
interface Appointment {
  user_id: number;
  barber_id: number;
  salon_id: number;
  number_of_people: number;
  name: string;
  mobile_number: string;
  service_ids: number[];
  slot_id: any;
}

// Define the Service interface
interface Service {
  id: number;
  name: string;
  description: string;
  default_service_time: number; // Time in minutes
  isActive: boolean;
  createdAt: string; // Date string
  updatedAt: string; // Date string
}

const CheckinForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [barberList, setBarberList] = useState<Barber[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [isAgreed, setIsAgreed] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState(""); // State for selected barber
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [salons, setSalons] = useState<SalonData[]>([]);
  const [salonId, setSalonId] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const steps = ["Step 1", "Step 2", "Step 3"];
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [totalServiceTime, setTotalServiceTime] = useState<number>(0);
  const [serviceOptions, setServiceOptions] = useState<
    { value: any; label: any; time: any }[]
  >([]);
  const [isAppointmentAvailable, setIsAppointmentAvailable] =
    useState<boolean>(false);

  useEffect(() => {
    // Fetching services from the API
    const fetchServices = async () => {
      try {
        const response = await GetServices("");
        // Assuming the response contains an array of services
        if (response.data && Array.isArray(response.data)) {
          const activeServices =  response.data.filter((serv: any) => serv.isActive === true);
          const options = activeServices?.map((service: any) => ({
            value: service.id.toString(), // Adjust to match API response structure
            label: `${service.name} ($${service.min_price} - $${service.max_price}) (${
              service.default_service_time
            }min)`, // Adjust to match API response structure
            name: service.name, // Keep name separately for reference
            price: service.price,
            time: service.default_service_time,
          }));

          setServiceOptions(options);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceChange = (option: {
    value: any;
    label?: any;
    time: any;
  }) => {
    setSelectedServices((prevSelected) => {
     
      const isSelected = prevSelected.some(
        (item) => item.value === option.value
      );
      let updatedServices;

      if (isSelected) {
        // Remove the service if already selected
        updatedServices = prevSelected.filter(
          (item) => item.value !== option.value
        );
      } else {
        // Add the service if not selected
        updatedServices = [...prevSelected, option];
      }

      // Calculate the total service time based on updated services
      // const totalTime = updatedServices.reduce(
      //   (sum, service) => sum + (service.time || 0), // Sum up the `time` for selected services
      //   0
      // );
      const totalServiceTime = updatedServices?.reduce(
        (sum: any, item: any) => sum + item.time,
        0
      );
      // Update the total service time state
      setTotalServiceTime(totalServiceTime);
      if (totalServiceTime > 0) {
        onServiceSelect(selectedBarber, totalServiceTime);
      } else {
        toast.warning("Please first select atleast one service!!!");
      }

      return updatedServices; // Return the updated services
    });
  };

  const handleRemoveService = (value: string) => {
    setSelectedServices((prevServices) =>
      prevServices.filter((service) => service.value !== value)
    );
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Redux selector for getting user login data
  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state?.Login?.user, // Ensure state.Login holds user info after login
  }));

  // Fetching user data from Redux store
  const { user } = useSelector(loginpageData);
  const user_id = user?.data?.user?.id || ""; // Extracting user_id from Redux store

  useEffect(() => {
    // Check if the user's token is not available in localStorage
    const token = localStorage.getItem("token"); // Assuming the token is stored as "token" in localStorage

    if (!token) {
      navigate("/signin"); // Redirect to the signin page if token is not found
    }
  }, [navigate]);
  // Add this useEffect to populate the fullName field when the component mounts
  useEffect(() => {
    if (user?.data?.user) {
      const { firstname, lastname } = user.data.user;
      if (firstname && lastname) {
        setFullName(`${firstname} ${lastname}`);
      }
    }
  }, [user]);

  // Extract salon_id from URL and fetch barbers
  useEffect(() => {
    GetSalon({})
      .then((response) => {
        setSalons(response.data as SalonData[]);
        setLoading(false);
        const queryParams = new URLSearchParams(location.state);
        const step = parseInt(queryParams.get("step") || "0", 10);
        setActiveStep(step);
    
        const salonName = queryParams.get("salon"); // Retrieve salon_id
        const salonId = response.data.find((sa: any) => sa.salon_name === salonName)?.salon_id; // Retrieve salon_id
        setSalonId(salonId || null);
        const category = 2; // Set category to 2 (as per your requirement)
    
        if (salonId) {
          fetchBarbers(salonId, category); // Fetch barbers using salonId and category
        } else {
          setIsLoading(false); // Stop loader if no salonId is present
        }
      })
      .catch(() => {
        setError("Error fetching salons. Please try again later.");
        setLoading(false);
      });
   
  }, [location.state]);

  // Fetch barbers API function
  const fetchBarbers = async (salonId: any, category: 2) => {
   
    // Get today's date in DD-MM-YYYY format
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Add leading zero if day is single digit
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero if month is single digit
    const year = today.getFullYear();
    const date = `${day}-${month}-${year}`; // Format as DD-MM-YYYY

    try {
      const response = await GetBarbers(salonId, category, date); // Fetch barbers by salonId
      if (response.data && response.data.length > 0) {
        const barbers = response.data[0].barbers;

        // Filter the barbers for today's date based on the schedule date
        const formattedBarbers = barbers.flatMap((barberObj: any) =>
          barberObj.barber.schedule.map((session: any) => ({
            barber_id: barberObj.barber.id,
            barber_name: barberObj.barber.name,
            estimated_wait_time: barberObj.barber.estimated_wait_time, // Estimated wait time
            start_time: session.startTime,
            end_time: session.endTime,
            availability_status: barberObj.barber.availability_status,
          }))
        );

        // Set barber list
        setBarberList(formattedBarbers);

        // Log barber IDs to the console
        formattedBarbers.forEach((barber: any) => {
          console.log("Barber ID:", barber.barber_id);
        });
      }
    } catch (error) {
      console.error("Error fetching barbers:", error);
    }
  };

  // Function to handle barber selection
  const handleBarberChange = (e: any) => {
    const selectedBarberId = e.target.value;
    setSelectedBarber(selectedBarberId);
    if (totalServiceTime) {
      onServiceSelect(selectedBarberId, totalServiceTime);
    } else {
      toast.warning("Please first select atleast one service!!!");
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      navigate(-1);
    }
  };

  const handleNext = async () => {
    try {
      // Set loading to true
      setIsLoading(true);

      // Prepare the data for the API request
      const appointmentData: Appointment = {
        user_id: user_id, // Use user_id from Redux store
        barber_id: parseInt(selectedBarber),
        salon_id: parseInt(
          salonId || 0
        ),
        number_of_people: parseInt(numberOfPeople) || 1,
        name: fullName,
        mobile_number: `+1${phoneNumber.replace(/\D/g, "")}`, // Remove non-numeric characters
        service_ids: selectedServices.map((service) => parseInt(service.value)),
        slot_id: null,
      };

      // Call the API to create the appointment
      const response = await CeateAppointment(appointmentData);

      // Extract the `id` from the response data
      const stateId = response.data.id;

      console.log("Appointment successfully created!");
      toast.success("Appointment successfully created!", {
        position: "top-right",
        autoClose: 3000, // Close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Navigate to the confirmation page with the `id`
      // navigate(`/checkinconfirmation/${id}`);
      navigate(`/checkinconfirmation`, { state: { stateId } });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Error: Your appointment has already been scheduled");
    } finally {
      setIsLoading(false); // Stop loading after API call is complete
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    if (value.length > 0) {
      formattedValue += "(" + value.substring(0, 3);
    }
    if (value.length >= 4) {
      formattedValue += ") " + value.substring(3, 6);
    }
    if (value.length >= 7) {
      formattedValue += "-" + value.substring(6, 10);
    }
    setPhoneNumber(formattedValue);
  };

  const isFormValid = () => {
    return (
      fullName !== "" &&
      // numberOfPeople !== "" &&
      phoneNumber.length === 14 &&
      selectedBarber !== "" &&
      selectedServices.length > 0 && // At least one service must be selected
      isAgreed
    );
  };

  const onServiceSelect = async (
    selectedBarberId: any,
    selectedServiceTime: any
  ) => {
    if (selectedBarberId && selectedServiceTime) {
      const obj = {
        BarberId: selectedBarberId,
        service_time: selectedServiceTime,
      };

      try {
        const sessionResponse: any = await CreateBarberSession(
          selectedBarberId,
          obj
        );

        if (sessionResponse) {
          const { code, data, success } = sessionResponse;

          if (success && code === 200) {
            switch (data) {
              case "102":
                console.log(
                  "Session created successfully. Appointment is available."
                );
                setIsAppointmentAvailable(true);
                break;
              case "101":
                console.warn("Low remaining time. Proceed with caution.");
                setIsAppointmentAvailable(false);
                toast.warn("Low Remaining Time for the selected service.");
                break;
              case "100":
                console.error(
                  "Fully booked. Cannot proceed with the appointment."
                );
                setIsAppointmentAvailable(false);
                toast.error("Selected barber is fully booked.");
                break;
              case "103":
                console.warn("Your Session Expired");
                setIsAppointmentAvailable(false);
                toast.warn("Barber is not available.");
                break;
              default:
                console.warn("Unexpected data received:", data);
                setIsAppointmentAvailable(false);
                toast.warn("Unexpected response from the server.");
            }
          } else {
            console.error(
              "Unexpected response structure from CreateBarberSession API."
            );
            setIsAppointmentAvailable(false);
          }
        } else {
          console.error(
            "Invalid response structure from CreateBarberSession API."
          );
        }
      } catch (error) {
        console.error("Error occurred while creating barber session:", error);
      }
    } else {
      console.warn("Barber ID or service time is missing.");
    }
  };
  function convertTo12HourFormat(time24:any) {
    const [hours, minutes] = time24.split(':');
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? 'PM' : 'AM';
    const hours12 = hoursInt % 12 || 12; // Convert 0-23 to 1-12
    return `${hours12}:${minutes} ${suffix}`;
  }
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
            Form
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
      <Container className="mt-4 mb-4">
        <Row className="justify-content-center">
          <Col lg={8} className="mx-auto">
            <Form>
              <Row>
                <Col lg={12}>
                  <div className="mb-4">
                    <label htmlFor="fullName" className="form-label fs-13">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      id="fullName"
                      type="text"
                      className="form-control border-light"
                      placeholder="Your full name*"
                      required
                      value={fullName} // Pre-filled with Redux data or updated dynamically
                      onChange={(e) => setFullName(e.target.value)} // Editable by user
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={12}>
                  <div className="mb-4">
                    <label htmlFor="phoneNumber" className="form-label fs-13">
                      Phone Number
                    </label>
                    <div className="input-group ">
                      <div
                        className="input-group-prepend"
                        style={{ marginRight: "2px" }}
                      >
                        <span className="input-group-text">+1</span>
                      </div>
                      <input
                        name="phoneNumber"
                        id="phoneNumber"
                        type="tel"
                        className="form-control border-light"
                        placeholder="Your phone number*"
                        required
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              {/* Select Services */}
              <Row>
                <Col lg={12}>
                  <div className="mb-4">
                    <label
                      htmlFor="services"
                      className="form-label fs-13 border-light"
                    >
                      Services
                    </label>
                    {/* Dropdown with checkboxes */}
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle
                        caret
                        color="light"
                        className="form-control border-light w-100 d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: "white" }}
                      >
                        <span>
                          {selectedServices.length === 0
                            ? "Select Services"
                            : selectedServices.length > 3
                            ? selectedServices
                                .slice(0, 2)
                                .map((item) => item.label)
                                .join(", ") + ", ..."
                            : selectedServices
                                .map((item) => item.label)
                                .join(", ")}
                        </span>
                        <span className="dropdown-icon">
                          <i className="fa fa-chevron-down"></i>
                        </span>
                      </DropdownToggle>
                      <DropdownMenu
                        className="w-100"
                        style={{
                          maxHeight: "130px",
                          overflowY: "auto",
                        }}
                      >
                        {serviceOptions.map((option) => (
                          <DropdownItem key={option.value} toggle={false}>
                            <div
                              className="d-flex align-items-center w-100 justify-center"
                               onClick={() => handleServiceChange(option)} // Make row clickable
                              role="button" // Ensure the entire row is clickable
                            >
                              <Input
                                type="checkbox"
                                className="mt-0 me-1"
                                id={option.value}
                                checked={selectedServices.some(
                                  (item) => item.value === option.value
                                )}
                                disabled={
                                  selectedServices.length >= 3 &&
                                  !selectedServices.some(
                                    (item) => item.value === option.value
                                  )
                                } // Disable checkbox if limit reached
                              />
                              {/* <label
                                htmlFor={option.value}
                                className="ms-2 mb-0 border-light"
                                // onClick={(e) => {
                                //   e.stopPropagation(); // Prevent row click when label is clicked
                                //   handleServiceChange(option); // Ensure label click toggles checkbox
                                // }}
                              > */}
                              <span> {option.label} </span>
                              {/* </label> */}
                            </div>
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </Col>
              </Row>

              {/* Select Barber */}
              <Row>
                <Col lg={12}>
                  <div className="mb-4">
                    <label htmlFor="barber" className="form-label fs-13">
                      Barber
                    </label>
                    <select
                      name="barber"
                      id="barber"
                      className="form-control border-light"
                      required
                      value={selectedBarber}
                      onChange={handleBarberChange}
                    >
                      <option value="">Select Barber...</option>
                      {barberList?.map((barber) => (
                        <option
                          key={barber.barber_id}
                          value={barber.barber_id}
                          disabled={
                            barber.availability_status === "unavailable"
                          }
                        >
                          {barber.barber_name} - {convertTo12HourFormat(barber.start_time)} -{" "}
                          {convertTo12HourFormat(barber.end_time)}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={12}>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      id="agreement"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      required
                      style={{
                        backgroundColor: isAgreed ? "#BE9343" : "transparent",
                      }}
                      
                    />
                    <label className="form-check-label" htmlFor="agreement">
                      Get a text letting you know when to head to the salon
                    </label>
                  </div>
                </Col>
              </Row>
            </Form>
            <div className="stepper-container">
              <div className="buttons mt-3">
                <button onClick={handleBack} disabled={activeStep === 0}>
                  Back
                </button>
                {isAppointmentAvailable}
                <button
                  onClick={handleNext}
                  disabled={
                    !isFormValid() ||
                    activeStep === 0 ||
                    isLoading ||
                    !isAppointmentAvailable
                  }
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    "Proceed"
                  )}
                </button>
              </div>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default CheckinForm;
