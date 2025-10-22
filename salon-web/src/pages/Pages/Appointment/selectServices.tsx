import React, { useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar"; // Adjust if necessary
import Footer from "../HomePage/Footer"; // Adjust if necessary
import { Card, CardBody, Button, Container, Row, Col, Input } from "reactstrap";
import "./selectServices.css"; // Ensure path is correct
import serviceImage from "../../../assets/images/Services/Service-Bg.png"; // Ensure path is correct
import salon_service from "../../../assets/images/Salondetails/salon_service.jpg"; // Ensure path is correct
import default_salon_img from "../../../assets/images/Selectsalon/default_salon_img.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetServices } from "Services/SalonServices";
import LoaderInner from "Components/Common/LoaderInner";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearAllSelectedServices,
  clearSelectedSalon,
  clearSelectedService,
  setSelectedSalon,
  setSelectedService,
} from "slices/dashboardProject/selectedSalonSlice";
import { createSelector } from "@reduxjs/toolkit";
import { FaArrowLeft } from "react-icons/fa";

type Service = {
  id: number;
  name: string;
  duration: string;
  minprice: number;
  maxprice: number;
  count: number;
  price: number;
};

const SelectServices = () => {
  const [serviceCounters, setServiceCounters] = useState<{
    [key: number]: number;
  }>({});
  const [selectedServices, setSelectedServices] = useState<Service[]>([]); // Keep track of selected service ids
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Access selectedSalon from Redux store
  const selectedSalon = useSelector((state: any) => state.selectedSalon);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value); // Update search query
  };

  const selectedSalonName = useSelector(
    (state: any) => state.selectedSalon.selectedSalonName
  );

  const selectedAddress = useSelector(
    (state: any) => state.selectedSalon.selectedAddress
  );

  // Redux selector for getting user login data
  const selectLayoutState = (state: any) => state;
  const selectedSalondata = createSelector(selectLayoutState, (state) => ({
    salonData: state?.selectedSalon.selectedSalon, // Ensure state.Login holds user info after login
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
  const { salonName } = useSelector(selectedSalonNamedata);
  const { salonAddress } = useSelector(selectedSalonAddressdata);
  const { salonPhotos } = useSelector(setSelectedSalonPhotosdata);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true); // Start loading state
        const response = await GetServices(""); // Pass any query parameters if needed

        if (response && response.data) {
          const activeServices =  response.data.filter((serv: any) => serv.isActive === true);
          const apiServices = activeServices?.map((service: any) => ({
            id: service.id,
            name: service.name,
            duration: `${service.default_service_time} min`,
            minprice: service.min_price,
            maxprice: service.max_price,
          }));

          // Update state with the filtered and formatted services
          setServices(apiServices);
          setFilteredServices(apiServices); // Default to all services
          dispatch(clearAllSelectedServices());
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services. Please try again later.");
      } finally {
        setIsLoading(false); // Stop loading state
      }
    };

    fetchServices();
  }, [salonData]); // Run the effect only when salonData changes
  let selectedSalonCheck = salonData;
  

  useEffect(() => {
    // Check if both sets of data are missing
    if (
      (!salonData?.salon_name && !salonName) || // Check salon name
      (!salonData?.address && !salonAddress) // Check salon address
    ) {
      navigate("/select_salon"); // Redirect if data is missing
    }
  }, [salonData, salonName, salonAddress, navigate]);

  // Function to handle search button click
  const handleSearch = () => {
    const results = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on the search query
    );
    setFilteredServices(results); // Update the filtered services to display
  };
  const countUP = (serviceId: number) => {
    setSelectedServices((prevSelected) => {
      const service = prevSelected.find((s) => s.id === serviceId);

      if (service) {
        if (service.count >= 5) {
          toast.warn(`You cannot select more than 5 of ${service.name}.`);
          return prevSelected; // Return unchanged list
        }
        return prevSelected.map((s) =>
          s.id === serviceId ? { ...s, count: service.count + 1 } : s
        );
      } else {
        const serviceToAdd = services.find((s) => s.id === serviceId);
        if (serviceToAdd) {
          return [...prevSelected, { ...serviceToAdd, count: 1 }];
        }
        return prevSelected; // No changes if service not found
      }
    });

    setServiceCounters((prev) => {
      const currentCount = prev[serviceId] || 0;
      if (currentCount >= 5) {
        return prev; // Return unchanged counters
      }
      return { ...prev, [serviceId]: currentCount + 1 };
    });
  };

  const countDown = (serviceId: number) => {
    setSelectedServices(
      (prevSelected) =>
        prevSelected
          .map((service) =>
            service.id === serviceId
              ? { ...service, count: Math.max(service.count - 1, 0) }
              : service
          )
          .filter((service) => service.count > 0) // Remove if count reaches 0
    );
    setServiceCounters((prev) => ({
      ...prev,
      [serviceId]: Math.max((prev[serviceId] || 0) - 1, 0),
    }));
  };

  const handleCardClick = (serviceId: number) => {
    setSelectedServices((prevSelected) => {
      const existingService = prevSelected.find((s) => s.id === serviceId);

      if (existingService) {
        // If already selected, remove it
        const updatedServices = prevSelected.filter((s) => s.id !== serviceId);
        setServiceCounters((prev) => {
          const updatedCounters = { ...prev };
          delete updatedCounters[serviceId]; // Reset count
          return updatedCounters;
        });

        // Clear the selected service from the Redux store
        dispatch(clearSelectedService(serviceId));
        return updatedServices;
      } else {
        // Add new service with default count of 1
        const service = services.find((s) => s.id === serviceId);
        if (service) {
          const newService = { ...service, count: 1 };
          setServiceCounters((prev) => ({ ...prev, [serviceId]: 1 }));

          // Dispatch to Redux
          dispatch(setSelectedService(newService));
          return [...prevSelected, newService];
        }
        return prevSelected; // No changes if service not found
      }
    });
  };

  const handleContinue = () => {
    if (selectedServices.length === 0) {
      toast.warn("Please select at least one service");
      return;
    }

    navigate("/select_barbers");

    selectedServices.forEach((service) => {
      dispatch(setSelectedService(service)); // Dispatch full service object
    });
  };

  const totalPrice = selectedServices.reduce(
    (totals, service) => {
      totals.minTotal += service.minprice * service.count;
      totals.maxTotal += service.maxprice * service.count;
      return totals;
    },
    { minTotal: 0, maxTotal: 0 }
  );
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
            Select Services
          </h1>
        </div>
      </section>
            
      <Container className="mt-5 mb-5 justify-content-center">
        <div className="d-flex align-items-center mb-2" >
        <button onClick={handleBack} className="btn" style={{paddingRight:"5px" , paddingLeft:"0px" }}>
      <FaArrowLeft className="fs-20" />
    </button>
          <h2 className="text-dark text-bold pt-2 ps-1">Select Services</h2>
        </div>

        {/* Add search bar and search button */}
        <div className="search-container d-flex flex-column flex-md-row align-items-stretch align-items-md-center mb-4">
          <Input
            type="text"
            placeholder="Search for a service..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input flex-grow-1"
            onFocus={(e) => (e.target.style.borderColor = "#be9342")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
          <Button
            onClick={handleSearch}
            className="search-button d-flex align-items-center justify-content-center"
          >
            <i className="fas fa-search mr-2"></i>
            Search
          </Button>
        </div>

        <Row>
          <Col md={7}>
            <div className="services-list">
              {filteredServices.map((service) => (
                <Card
                  className="haircut-card"
                  key={service.id}
                  onClick={() => handleCardClick(service.id)}
                  style={{
                    borderColor: selectedServices.some(
                      (s) => s.id === service.id
                    )
                      ? "#be9342"
                      : "#ccc",
                    borderWidth: selectedServices.some(
                      (s) => s.id === service.id
                    )
                      ? "3px"
                      : "1px",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <CardBody className="d-flex flex-column justify-content-between">
                    <h3>{service.name}</h3>
                    <p className="duration">{service.duration}</p>
                    <p className="price" style={{ marginTop: "10px" }}>
                      ${service.minprice} - ${service.maxprice}
                    </p>
                  </CardBody>
                  <Row className="gy-4">
                    <Col sm={6}>
                      {selectedServices.some((s) => s.id === service.id) ? (
                        <div
                          className="input-step"
                          style={{ gap: "10px", border: "0px" }}
                        >
                          <button
                            type="button"
                            className="minus material-shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              countDown(service.id);
                            }}
                            disabled={(serviceCounters[service.id] || 1) === 1} // Disable if count is 1
                            style={{
                              backgroundColor:
                                (serviceCounters[service.id] || 1) === 1
                                  ? "#f1f1f1"
                                  : "#f2f2f2",
                              color: "#000",
                              cursor:
                                (serviceCounters[service.id] || 1) === 1
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            –
                          </button>
                          <Input
                            type="number"
                            className="product-quantity"
                            value={serviceCounters[service.id] || 1}
                            min="1"
                            max="5"
                            readOnly
                          />
                          <button
                            type="button"
                            className="plus material-shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              countUP(service.id);
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="plus-initial material-shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(service.id);
                          }}
                          style={{
                            background: "#F2F2F2",
                            border: "none",
                            color: "#000",
                            padding: "3px 8px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          +
                        </button>
                      )}
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
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
              {Object.entries(serviceCounters).length > 0 ? (
                <ul>
                  {Object.entries(serviceCounters).map(([id, count]) => {
                    const service = services.find((s) => s.id === parseInt(id));
                    if (service && count > 0) {
                      return (
                        <li key={id} className="service-item">
                          <div className="service-details">
                            {service.name} x {count}
                            <p className="duration">{service.duration}</p>
                          </div>

                          <div className="service-price">
                            ${(service.minprice * count).toFixed(2)} - ${(service.maxprice * count).toFixed(2)}
                          </div>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              ) : (
                <p style={{ marginTop: "10px" }}>No services selected</p>
              )}
              
              {/* <p className="total">
                <span className="total-label">Estimated Price</span>
                <span className="total-price">${totalPrice.minTotal.toFixed(2)} - ${totalPrice.maxTotal.toFixed(2)}</span>
              </p> */}
              <Button className="continue-button" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default SelectServices;
