import React, { useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import { Button, Col, Container, Row, Spinner } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { CeateAppointment } from "Services/appointment";
import salon_service from "../../../assets/images/Salondetails/salon_service.jpg";
import default_salon_img from "../../../assets/images/Selectsalon/default_salon_img.png";
import {
  clearSelectedSalon,
  clearSelectedService,
  setSelectedSalon,
  setSelectedService,
  setSelectedSlotId,
  setTotalPrice,
  clearTotalPrice,
} from "slices/dashboardProject/selectedSalonSlice";
import { FaArrowLeft } from "react-icons/fa";

const selectLayoutState = (state: any) => state;
const selectedSalondata = createSelector(selectLayoutState, (state) => ({
  salonData: state?.selectedSalon.selectedSalon, // Ensure state.Login holds user info after login
}));

const selectedServicesdata = createSelector(selectLayoutState, (state) => ({
  service: state?.selectedService.selectedServices,
}));

const selectedBarberdata = createSelector(selectLayoutState, (state) => ({
  barber: state?.selectedSalon.selectedBarber,
}));

const selecteSlotdata = createSelector(selectLayoutState, (state) => ({
  barber: state?.selectedSalon.selectedSlotId,
}));

const selectedSalonIddata = createSelector(selectLayoutState, (state) => ({
  salonidd: state.selectedSalon.selectedSalonId,
}));

const selectedSalonNamedata = createSelector(selectLayoutState, (state) => ({
  salonName: state?.selectedSalon.selectedSalonName,
}));

const selectedSalonAddressdata = createSelector(selectLayoutState, (state) => ({
  salonAddress: state?.selectedSalon.selectedAddress,
}));

const setSelectedSalonPhotosdata = createSelector(
  selectLayoutState,
  (state) => ({
    salonPhotos: state?.selectedSalon.selectedPhotos,
  })
);

const timePricedata = createSelector(selectLayoutState, (state) => ({
  totalPricing: state?.selectedSalon.totalPrice,
}));

const Appointment_form: React.FC = () => {
  const navigate = useNavigate();
  // Redux state selectors
  const selectedSalon = useSelector((state: any) => state.selectedSalon);
  const selectedService = useSelector((state: any) => state.selectedService);
  const selectedBarber = useSelector(
    (state: any) => state.selectedSalon?.selectedBarber
  );
  const selectedSlotId = useSelector(
    (state: any) => state.selectedSalon?.selectedSlotId
  );
  const selectedSalonId = useSelector(
    (state: any) => state.selectedSalon.selectedSalonId
  );

  const totalPrice = useSelector(
    (state: any) => state.selectedSalon.totalPrice
  );

  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state?.Login?.user, // Ensure state.Login holds user info after login
  }));

  // Fetching user data from Redux store
  const { user } = useSelector(loginpageData);
  const userId = user?.data?.user?.id || "";
  const usermail = user?.data?.user?.email;
  const { salonidd } = useSelector(selectedSalonIddata);
  const { salonName } = useSelector(selectedSalonNamedata);
  const { salonAddress } = useSelector(selectedSalonAddressdata);
  const { salonPhotos } = useSelector(setSelectedSalonPhotosdata);
  const { service } = useSelector(selectedServicesdata);
  const { barber } = useSelector(selectedBarberdata);
  const { totalPricing } = useSelector(timePricedata);

  const salonData = selectedSalon?.selectedSalon || {}; // Default to empty object if undefined
  const services = service?.map((serviceItem: any) => {
    // Find the corresponding barber service based on serviceId
    const barberService = barber?.services?.find(
      (b: any) => b.serviceId === serviceItem.id
    );
    
    // Calculate the price using the barber price
    const price = barberService
    ? serviceItem.count *
      (barberService.barberPrice && barberService.barberPrice > 0
        ? barberService.barberPrice
        : barberService.minPrice && barberService.minPrice > 0
        ? barberService.minPrice
        : 0)
    : serviceItem.minprice && serviceItem.minprice > 0
    ? serviceItem.count * serviceItem.minprice
    : 0;
 // Fallback to the original price if barberService is not found
    return {
      id: serviceItem.id,
      name: serviceItem.name,
      duration: parseInt(serviceItem.duration, 10),
      price: price, // Correct price from barberService
      count: serviceItem.count || 0,
    };
  });

  // Calculate total duration and price
  const totalDuration = services.reduce((total: number, serviceItem: any) => {
    return total + serviceItem.duration * serviceItem.count;
  }, 0);

  const totalPrices = services.reduce((total: number, serviceItem: any) => {
    return total + serviceItem.price * serviceItem.count;
  }, 0);

  // Initialize the state for fullName, lastName, mobileNumber, and comment
  const [fullName, setFullName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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

    setMobileNumber(formattedValue);
  };
  const handleSubmitt = async () => {
    if (!fullName || !mobileNumber) {
      toast.warn("Please fill in all the fields before confirming.");
    } else {
      // Prepare the data in the required format
      const appointmentData = {
        user_id: userId, // Fetched from Redux user state
        barber_id: selectedBarber?.id || 0, // Barber ID from Redux
        salon_id: salonData?.salon_id || selectedSalonId, // Salon ID from Redux
        number_of_people: 1, // Default value
        name: fullName, // User's full name
        mobile_number: `+1${mobileNumber.replace(/\D/g, "")}`, // Formatted mobile number
       service_ids: services.flatMap(
    (service: { id: any; count: number }) =>
      Array(service.count).fill(service.id)
  ), // Repeat `serviceId` based on `currentCount
        slot_id: selectedSlotId || 0, // Slot ID from Redux
      };
      setIsLoading(true); // Show spinner when API call starts
      try {

        // Call the API with prepared data
        const response = await CeateAppointment(appointmentData);
        const appointmentId = response.data.id;

        // Navigate to confirmation page on success with dynamic ID
        navigate(`/appointment_confirmation`, {state: { appointmentId  }});
       
        toast.success("Appointment created successfully!");
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast.error("Failed to create appointment. Please try again.");
      } finally {
        setIsLoading(false); // Hide spinner when API call completes
      }
    }
  };

  // Redirection logic
  useEffect(() => {
    if (
      (!salonData?.salon?.id && !selectedSalonId) || // Both salonId sources are missing
      (!salonData?.salon_name && !salonName) || // Both salon name sources are missing
      (!salonData?.address && !salonAddress) || // Both salon address sources are missing
      !services || // Services are missing
      !selectedBarber ||
      !selectedSlotId
    ) {
      navigate("/select_salon"); // Redirect to /select_salon
    }
  }, [
    salonData,
    selectedSalonId,
    salonName,
    salonAddress,
    services,
    selectedBarber,
    selectedSlotId,
    navigate,
  ]);

  useEffect(() => {
    if (user?.data?.user) {
      const { firstname, lastname } = user.data.user;
      if (firstname && lastname) {
        setFullName(`${firstname} ${lastname}`);
      }
    }
  }, [user]);

  const handleBack = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50); // Small delay to ensure scroll reset
    navigate(-1);
  };

  return (
    <div>
      <React.Fragment>
        <Navbar />
        <section
          className="d-flex justify-content-center align-items-center text-center text-white lg-{12} md-{12} sm-{12}"
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
            alt="gallery"
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
                fontSize: window.innerWidth <= 768 ? "1.7rem" : "2.5rem",
                lineHeight: "1.5",
                letterSpacing: "0.1em",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0",
                padding: "20px 0",
              }}
            >
              Review and Confirm
            </h1>
          </div>
        </section>
        <Container className="mt-5 mb-5 justify-content-center">
           <div className="d-flex align-items-center mb-2" >
                        <button onClick={handleBack} className="btn" style={{paddingRight:"5px" , paddingLeft:"0px" }}>
                                <FaArrowLeft className="fs-20 mb-1" /> <span className="text-dark text-bold pt-2 ps-1 card-title" >Fillup Details</span>
                              </button>
                              </div>
         
          <Row>
            {/* Leftside code */}
            <Col md={7}>
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

                <Col lg={12}>
                  <div className="mb-4">
                    <label htmlFor="mobileNumber" className="form-label fs-13">
                      Mobile Number
                    </label>
                    <input
                      name="mobileNumber"
                      id="mobileNumber"
                      type="text"
                      className="form-control border-light"
                      placeholder="Your mobile number*"
                      required
                      value={mobileNumber}
                      onChange={handlePhoneChange} // Editable by user
                    />
                  </div>
                </Col>
              </Row>
            </Col>

            {/* Rightside code */}

            <Col md={5}>
              <div className="selected-services">
                <div className="service_img">
                  <img
                    src={(() => {
                      try {
                        return (
                          JSON.parse(
                            salonData?.salon.photos || salonPhotos
                          )?.[0] || default_salon_img
                        );
                      } catch {
                        return default_salon_img;
                      }
                    })()}
                    alt="Salon"
                  />
                  <div className="salon_detailss justify-content-center">
                    <h3 className="service_salon_name mb-0 ">
                      {salonData?.salon_name || salonName}
                    </h3>
                    <p className="service_salon_address fw-0 mb-0">
                      {salonData?.address || salonAddress}
                    </p>
                  </div>
                </div>
                {services.length > 0 ? (
                  <div>
                    <ul>
                      {services.map((serviceItem: any) => (
                        <li key={serviceItem.id} className="service-item">
                          <div className="service-details">
                            <span>
                              {serviceItem.name} x {serviceItem.count}
                            </span>
                            <p className="duration">
                              {serviceItem.duration} min
                            </p>
                          </div>
                          <div className="service-price">
                            ${Number(serviceItem.price).toFixed(2)}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="total-time">
                      Total Time: {totalDuration} min
                    </div>
                  </div>
                ) : (
                  <p style={{ marginTop: "10px" }}>No services selected</p>
                )}
                <hr />
                <p className="total">
                  <span className="total-label">Total</span>
                  <span className="total-price">${totalPrice?.toFixed(2)}</span>
                </p>
                <Button
                  className="continue-button"
                  onClick={handleSubmitt}
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
        <Footer />
      </React.Fragment>
    </div>
  );
};

export default Appointment_form;
