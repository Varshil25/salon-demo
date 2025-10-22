import React, { useEffect, useState } from "react";
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import Navbar from "../HomePage/Navbar";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  TabPane,
  Button,
  Container,
} from "reactstrap";
import "./selectBarber.css";
import Footer from "../HomePage/Footer";
import Barberselection from "../../../assets/images/Barberselection/Barber_dafault.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetAllBarbers } from "Services/SalonServices";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  clearSelectedSalon,
  clearSelectedService,
  setSelectedSalon,
  setSelectedService,
  setSelectedSalonId,
  setTotalPrice,
} from "slices/dashboardProject/selectedSalonSlice";
import LoaderInner from "Components/Common/LoaderInner";
import { setSelectedBarber } from "slices/dashboardProject/selectedSalonSlice";
import salon_service from "../../../assets/images/Salondetails/salon_service.jpg";
import default_salon_img from "../../../assets/images/Selectsalon/default_salon_img.png";
import { FaArrowLeft } from "react-icons/fa";

interface Service {
  id: number;
  name: string;
  description: string;
  default_service_time: string;
  minPrice: number ;
  maxPrice: number ;
  barberPrice: number;
}

interface Barber {
  id: number;
  name: string;
  occupation: string;
  userImage: string | null;
  availability_status: string;
  cutting_since: string;
  salon: string;
  salonAddress: string;
  salonPhone: string;
  services: Service[]; // Add the services array here
  minprice: number ;
  maxprice: number ;
}

const SelectBarber = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberIndex, setSelectedBarberIndex] = useState<number | null>(
    null
  );
  // Set up the local state for the selected barber
  const [selectedBarber, setSelecteBarber] = useState<Barber | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access selectedSalon from Redux store
  const selectedSalon = useSelector((state: any) => state.selectedSalon);

  const selectedService = useSelector((state: any) => state.selectedService);

  const selectedSalonId = useSelector(
    (state: any) => state.selectedSalon.selectedSalonId
  );

  const selectedSalonName = useSelector(
    (state: any) => state.selectedSalon.selectedSalonName
  );

  const selectedAddress = useSelector(
    (state: any) => state.selectedSalon.selectedAddress
  );

  const selectLayoutState = (state: any) => state;
  const selectedSalondata = createSelector(selectLayoutState, (state) => ({
    salonData: state?.selectedSalon.selectedSalon, // Ensure state.Login holds user info after login
  }));

  const selectedServicesdata = createSelector(selectLayoutState, (state) => ({
    service: state?.selectedService.selectedServices,
  }));

  const selectedSalonIddata = createSelector(selectLayoutState, (state) => ({
    salonidd: state.selectedSalon.selectedSalonId,
  }));

  const selectedSalonNamedata = createSelector(selectLayoutState, (state) => ({
    salonName: state?.selectedSalon.selectedSalonName,
  }));

  const selectedSalonAddressdata = createSelector(
    selectLayoutState,
    (state) => ({
      salonAddress: state?.selectedSalon.selectedAddress,
    })
  );

  const setSelectedSalonPhotosdata = createSelector(
    selectLayoutState,
    (state) => ({
      salonPhotos: state?.selectedSalon.selectedPhotos,
    })
  );

  // Fetching user data from Redux store
  const { salonData } = useSelector(selectedSalondata);
  const { service } = useSelector(selectedServicesdata);
  const { salonidd } = useSelector(selectedSalonIddata);
  const { salonName } = useSelector(selectedSalonNamedata);
  const { salonAddress } = useSelector(selectedSalonAddressdata);
  const { salonPhotos } = useSelector(setSelectedSalonPhotosdata);

  const salonId = salonData?.salon.id || selectedSalonId; // Replace with dynamic salonId if needed
  const category = 1; // Replace with dynamic category if needed

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await GetAllBarbers(salonId, category);
        setIsLoading(true);
        if (response && response.data) {
          const barbersData = response.data.map((barber: any) => {
            // Extract min_price, max_price, and barber_price from servicesWithPrices array
            const servicePrices = barber.servicesWithPrices || [];
            const minPrice = Math.min(
              ...servicePrices.map((service: any) => service.min_price)
            );
            const maxPrice = Math.max(
              ...servicePrices.map((service: any) => service.max_price)
            );

            // Map servicesWithPrices to extract relevant details
            const services = servicePrices.map((service: any) => ({
              serviceId: service.id,
              name: service.name,
              description: service.description,
              defaultServiceTime: service.default_service_time,
              minPrice: service.min_price,
              maxPrice: service.max_price,
              barberPrice: service.barber_price,
            }));

            return {
              id: barber.id,
              name: barber.name,
              occupation: barber.position,
              userImage: barber.photo,
              availability_status: barber.availability_status,
              cutting_since: barber.cutting_since,
              salon: barber.salon.name,
              salonAddress: barber.salon.address,
              salonPhone: barber.salon.phone_number,
              minprice: minPrice, // Calculated min price across all services
              maxprice: maxPrice, // Calculated max price across all services
              services, // Array of services with detailed pricing
            };
          });
          setBarbers(barbersData);
        } else {
          toast.error("Invalid API response. Please try again.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching barbers:", error);
        toast.error("Failed to load barbers. Please try again.");
      }
    };

    fetchBarbers();
  }, [salonId, category]);

  const services = service?.map((serviceItem: any) => ({
    id: serviceItem.id,
    name: serviceItem.name,
    duration: serviceItem.duration,
    price: serviceItem.minprice,
    count: serviceItem.count || 0,
  }));

  // This should be based on actual selected services, not hardcoded
  const serviceCounters = services.reduce(
    (acc: Record<number, number>, serviceItem: any) => {
      acc[serviceItem.id] = serviceItem.count || 0; // Default to 0 if count is undefined
      return acc;
    },
    {}
  );

  // Redirection logic
  useEffect(() => {
    if (
      (!salonData?.salon?.id && !selectedSalonId) || // Both salonId sources are missing
      (!salonData?.salon_name && !salonName) || // Both salon name sources are missing
      (!salonData?.address && !salonAddress) || // Both salon address sources are missing
      !services // Services are missing
    ) {
      navigate("/select_salon"); // Redirect to /select_salon
    }
  }, [salonData, selectedSalonId, salonName, salonAddress, services, navigate]);

  // const totalPrice = Object.entries(serviceCounters).reduce(
  //   (total, [id, count]) => {
  //     const service = services.find((s: any) => s.id === parseInt(id));
  //     return total + (service ? service.price * (count as number) : 0);
  //   },
  //   0
  // );

  // Assuming selectedBarber contains the barber's service pricing
  const handleSelectBarber = (index: number) => {
    const barber = barbers[index]; // Get the barber's data based on the selected index
    // Toggle selected barber in local state
    setSelectedBarberIndex((prevSelectedBarber) =>
      prevSelectedBarber === index ? null : index
    );
    // Update the selected barber in the local state
    if (selectedBarberIndex !== index) {
      setSelecteBarber(barber); // Set the selected barber to local state
      dispatch(setSelectedBarber(barber));
    } else {
      setSelecteBarber(null); // If the barber is already selected, clear it
      dispatch(setSelectedBarber(barber));
    }
  };

  // Modify to access services and barber prices correctly using local state
  const servicesWithPrice = services.map((serviceItem: any) => {
    const selectedService = serviceItem;
    // Find the corresponding barber service using the service id from local selectedBarber
    const selectedBarberService = selectedBarber?.services?.find(
      (barberService: any) => barberService.serviceId === selectedService.id
    );
    // Get the barber price if available, otherwise default to 0
    const barberPrice =
    selectedBarberService?.barberPrice != null && selectedBarberService.barberPrice > 0
    ? selectedBarberService.barberPrice
    : selectedBarberService?.minPrice != null && selectedBarberService.minPrice > 0
    ? selectedBarberService.minPrice
    : selectedService.price != null && selectedService.price > 0
    ? selectedService.price
    : 0;

    // Calculate the total price for this service based on the count and barber price
    const totalServicePrice = barberPrice * selectedService.count;

    return {
      ...selectedService,
      barberPrice,
      totalServicePrice,
    };
  });
  const totalPrice = servicesWithPrice.reduce(
    (total: number, service: any) => total + service.totalServicePrice,
    0
  );

  useEffect(() => {
    dispatch(setTotalPrice(totalPrice));
  }, [totalPrice, dispatch]);

  const handleContinue = () => {
    if (selectedBarberIndex === null) {
      toast.warn("Please select at least one barber.");
      return;
    }
    navigate("/select_date_time");
  };

  const handleBack = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50); // Small delay to ensure scroll reset
    navigate(-1);
  };
  

  return (
    <React.Fragment>
      <Navbar />
      {isLoading && <LoaderInner />}
      <section
        className="d-flex justify-content-center align-items-center text-center text-white lg-{12} md-{12} sm-{12}"
        style={{
          height: "100px",
          marginTop: "97px",
          position: "relative",
          overflow: "hidden",
          fontSize: window.innerWidth <= 768 ? "4rem" : "5rem",
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
              fontSize: window.innerWidth <= 768 ? "2rem" : "2.5rem",
              lineHeight: "1.5",
              letterSpacing: "0.1em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
            Select Barbers
          </h1>
        </div>
      </section>

      <Container className="mt-2 mb-5 justify-content-center">
      <div className="d-flex align-items-center mb-2" >
      <button onClick={handleBack} className="btn" style={{paddingRight:"5px" , paddingLeft:"0px" }}>
              <FaArrowLeft className="fs-20 mb-1" /> <span className="text-dark text-bold pt-2 ps-1 card-title" >Select Your Barber</span>
            </button>
            </div>
        <TabPane id="steparrow-description-info" tabId={3}>
          <Row>
            <Col md={7} className="px-0 ps-3">
              <div className="barber-section">
                <div className="barber-grid">
                  {barbers.map((barber, index) => (
                    <div
                      className={`barber-card ${
                        selectedBarberIndex === index ? "selected" : ""
                      }`}
                      key={index}
                      onClick={() => {
                        if (barber.availability_status !== "unavailable") {
                          handleSelectBarber(index);
                        } else {
                          toast.warn(
                            `${barber.name} is currently unavailable.`
                          );
                        }
                      }}
                      style={{
                        cursor:
                          barber.availability_status === "unavailable"
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          barber.availability_status === "unavailable"
                            ? 0.6
                            : 1,
                      }}
                    >
                      <div className="barber-image">
                        <img
                          src={
                            barber.userImage
                              ? barber.userImage
                              : Barberselection
                          }
                          alt={barber.name}
                        />
                      </div>
                      <h3 className="barber-name">{barber.name}</h3>
                      <p className="barber-role">{barber.occupation}</p>
                      {barber.availability_status === "unavailable"}
                    </div>
                  ))}
                </div>
              </div>
            </Col>

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
                      {servicesWithPrice.map((serviceItem: any) => (
                        <li key={serviceItem.id} className="service-item">
                          <div className="service-details">
                            <span>
                              {serviceItem.name} x {serviceItem.count}
                            </span>
                            <p className="duration">{serviceItem.duration}</p>
                          </div>
                          <div className="service-price">
                            ${serviceItem.totalServicePrice.toFixed(2)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p style={{ marginTop: "10px" }}>No services selected</p>
                )}
                <hr />
                <p className="total">
                  <span className="total-label">Total</span>
                  <span className="total-price">${totalPrice.toFixed(2)}</span>
                </p>
                <Button className="continue-button" onClick={handleContinue}>
                  Continue
                </Button>
              </div>
            </Col>
          </Row>
        </TabPane>
        <ToastContainer />
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default SelectBarber;
