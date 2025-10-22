import React, { useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar";
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import { Button, Col, Container, Row } from "reactstrap";
import Flatpickr from "react-flatpickr";
import "./selectDateandTime.css";
import Calender_icon from "../../../assets/images/Selectdate/Calender_icon.svg";
import { FaChevronUp, FaChevronDown, FaArrowLeft } from "react-icons/fa";
import Footer from "../HomePage/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { GetAvailableSlots } from "Services/SalonServices";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  clearSelectedSalon,
  clearSelectedService,
  setSelectedSalon,
  setSelectedService,
  setSelectedSlotId,
  setTotalPrice,
  clearTotalPrice,
} from "slices/dashboardProject/selectedSalonSlice";
import salon_service from "../../../assets/images/Salondetails/salon_service.jpg";
import default_salon_img from "../../../assets/images/Selectsalon/default_salon_img.png";

interface DropdownProps {
  label: string;
  slots: SlotData[];
  isOpen: boolean;
  toggleDropdown: (label: string) => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
}

type Slot = {
  end_time_formatted: string;
  end_time_seconds: number;
  id: number;
  is_booked: boolean;
  slot_date: string;
  start_time_formatted: string;
  start_time_seconds: number;
};

type SlotData = { time: string; isBooked: boolean; id: number };
type AvailableSlots = {
  Morning: SlotData[];
  Afternoon: SlotData[];
  Evening: SlotData[];
};

const SelectDate: React.FC = () => {
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlotVisible, setTimeSlotVisible] = useState(false);

  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<{
    [key: string]: string | null;
  }>({
    Morning: null,
    Afternoon: null,
    Evening: null,
  });
  // const [availableSlots, setAvailableSlots] = useState<{
  //   [key: string]: string[];
  // }>({});
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>({
    Morning: [],
    Afternoon: [],
    Evening: [],
  });

  // Access selectedSalon from Redux store
  const selectedSalon = useSelector((state: any) => state.selectedSalon);

  const selectedService = useSelector((state: any) => state.selectedService);

  const selectedBarber = useSelector(
    (state: any) => state.selectedSalon.selectedBarber
  );

  const selectedSalonName = useSelector(
    (state: any) => state.selectedSalon.selectedSalonName
  );

  const selectedAddress = useSelector(
    (state: any) => state.selectedSalon.selectedAddress
  );

  const totalPrice = useSelector(
    (state: any) => state.selectedSalon.totalPrice
  );

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
  const timePricedata = createSelector(selectLayoutState, (state) => ({
    totalPricing: state?.selectedSalon.totalPrice,
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
  const { barber } = useSelector(selectedBarberdata);
  const { totalPricing } = useSelector(timePricedata);
  const { salonName } = useSelector(selectedSalonNamedata);
  const { salonAddress } = useSelector(selectedSalonAddressdata);
  const { salonPhotos } = useSelector(setSelectedSalonPhotosdata);

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


    return {
      id: serviceItem.id,
      name: serviceItem.name,
      duration: parseInt(serviceItem.duration, 10),
      price: price, // Correct price from barberService
      count: serviceItem.count || 0,
    };
  });

  // console.log(barber);
  // console.log(services);

  // Calculate total duration (now with duration as number)
  const totalDuration = services.reduce((total: number, serviceItem: any) => {
    return total + serviceItem.duration * serviceItem.count; // duration is a number now
  }, 0);

  // This should be based on actual selected services, not hardcoded
  const serviceCounters = services.reduce(
    (acc: Record<number, number>, serviceItem: any) => {
      acc[serviceItem.id] = serviceItem.count || 0; // Default to 0 if count is undefined
      return acc;
    },
    {}
  );

  const totalPrices = Object.entries(serviceCounters).reduce(
    (total, [id, count]) => {
      const service = services.find((s: any) => s.id === parseInt(id));
      return total + (service ? service.price * (count as number) : 0);
    },
    0
  );

  // Helper function to format time from "HH:mm:ss" to "H:mm"
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":"); // Split the time into hours and minutes
    const formattedHour = parseInt(hour, 10); // Convert hour to number (removes leading zero)
    return `${formattedHour}:${minute}`; // Return the formatted time
  };

  // Assuming BarberId is available in the state or props
  const BarberId = selectedBarber?.id; // Replace with actual BarberId
  const slot_date = selectedDate ? selectedDate : ""; // Format date as YYYY-MM-DD

  // Redirection logic
  useEffect(() => {
    if (
      (!salonData?.salon_name && !salonName) || // Both salon name sources are missing
      (!salonData?.address && !salonAddress) || // Both salon address sources are missing
      !services || // Services are missing
      !selectedBarber
    ) {
      navigate("/select_salon"); // Redirect to /select_salon
    }
  }, [salonData, salonName, salonAddress, services, selectedBarber, navigate]);

  type SlotData = { time: string; isBooked: boolean; id: number };
  type AvailableSlots = {
    Morning: SlotData[];
    Afternoon: SlotData[];
    Evening: SlotData[];
  };

  useEffect(() => {
    if (selectedDate) {
      // Reset the selected slots when the date changes
      setSelectedSlots({
        Morning: null,
        Afternoon: null,
        Evening: null,
      });

      // Clear available slots to avoid showing old data
      setAvailableSlots({
        Morning: [],
        Afternoon: [],
        Evening: [],
      });

      GetAvailableSlots(BarberId, slot_date)
        .then((response) => {
          const slotsData = response?.data;

          if (Array.isArray(slotsData) && slotsData.length > 0) {
            const mappedSlots: AvailableSlots = {
              Morning: [],
              Afternoon: [],
              Evening: [],
            };

            slotsData[0].slots.forEach((slot: Slot) => {
              const startHour = slot.start_time_seconds / 3600;
              const formattedTime = formatTime(slot.start_time_formatted);

              const slotDetails = {
                id: slot.id,
                time: slot.is_booked ? formattedTime : formattedTime,
                isBooked: slot.is_booked,
              };

              if (startHour < 12) {
                mappedSlots.Morning.push(slotDetails);
              } else if (startHour >= 12 && startHour < 17) {
                mappedSlots.Afternoon.push(slotDetails);
              } else {
                mappedSlots.Evening.push(slotDetails);
              }
            });

            ["Morning", "Afternoon", "Evening"].forEach((period) => {
              if (
                mappedSlots[period as keyof typeof mappedSlots].length === 0
              ) {
                mappedSlots[period as keyof typeof mappedSlots].push({
                  time: `No ${period} slot available`,
                  isBooked: false,
                  id: 0,
                });
              }
            });

            setAvailableSlots(mappedSlots);
          } else {
            toast.warn("No slots data available.");
          }
        })
        .catch((error) => {
          toast.error("Error fetching available slots:", error);
        });
    }
  }, [slot_date, BarberId]);

  const handleToggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };
  const slotsRequired = totalDuration / 15; // Assuming each slot is 15 minutes

  const handleSlotSelection = (
    label: "Morning" | "Afternoon" | "Evening",
    slot: string | null
  ) => {
    if (!slot) return;

    // Update the selected slot, ensuring only one slot is selected across all categories
    setSelectedSlots({
      Morning: label === "Morning" ? slot : null,
      Afternoon: label === "Afternoon" ? slot : null,
      Evening: label === "Evening" ? slot : null,
    });
  };

  const handleContinue = () => {
    // Check if a date and at least one time slot is selected
    if (!selectedDate) {
      toast.warn("Please select a date.");
      return; // Stop the function if date is not selected
    }

    // Check if at least one time slot is selected
    const isTimeSlotSelected = Object.values(selectedSlots).some(
      (slot) => slot !== null
    );
    if (!isTimeSlotSelected) {
      toast.warn("Please select at least one time slot.");
      return; // Stop the function if no time slot is selected
    } else {
      navigate("/appointment_form"); // Use navigate to redirect
    }
  };

  const Dropdown: React.FC<DropdownProps> = ({
    label,
    slots,
    isOpen,
    toggleDropdown,
    selectedSlot, // The selected slot for this dropdown
    setSelectedSlot,
  }) => {
    const dispatch = useDispatch();

    return (
      <div className="dropdown-container">
        <div
          className="dropdown-header fs-16"
          onClick={() => toggleDropdown(label)}
        >
          {label}
          <span className="dropdown-icon">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        {isOpen && (
          <div className="dropdown-body">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`dropdown-itemm ${
                  selectedSlot === slot.time ? "selected" : ""
                }`}
                style={{
                  color:
                    slot.isBooked || slot.time.includes("No") == true
                      ? "gray"
                      : "black",
                  borderColor:
                    selectedSlot === slot.time ? "#be9342" : "#979797",
                  borderWidth: selectedSlot === slot.time ? "2px" : "1px",
                  borderStyle: "solid",
                  pointerEvents:
                    slot.isBooked || slot.time.includes("No") ? "none" : "auto", // Allow clicking on slots
                  cursor:
                    slot.isBooked || slot.time.includes("No")
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={(e) => {
                  if (!slot.isBooked) {
                    setSelectedSlot(slot.time);

                    dispatch(setSelectedSlotId(slot.id));
                  }
                  e.preventDefault(); // Prevent scroll reset
                  e.stopPropagation(); // Prevent further propagation of click event
                }}
              >
                {slot.time}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
            Select Date & Time
          </h1>
        </div>
      </section>

      <Container className="mt-5 mb-5 justify-content-center">
        <div className="d-flex align-items-center mb-2" >
        <button onClick={handleBack} className="btn" style={{paddingRight:"5px" , paddingLeft:"0px" }}>
        <FaArrowLeft className="fs-20 mb-1" /> <span className="text-dark text-bold pt-2 ps-1 card-title" >Select Date & Time</span>
        </button>
         </div>
        <Row>
          {/* Leftside code */}
          <Col md={7}>
            <div className="date-picker-wrapper">
              <Flatpickr
                className="form-control date_time_pick py-2"
                placeholder="Click Here Select Date & Time slot"
                options={{
                  dateFormat: "d M, Y", // Format for the date
                  disableMobile: true, // Disable mobile-friendly version
                  minDate: "today", // Disable past dates
                  defaultDate: new Date(), // Set the default date to today's date
                }}
                value={selectedDate} // Bind the Flatpickr to the selectedDate
                onChange={(date: Date[]) => {
                  setSelectedDate(date[0]);
                  setTimeSlotVisible(true);
                }}
              />

              <img
                src={Calender_icon}
                alt="Calendar Icon"
                className="calendar-icon"
              />
            </div>
            <div>
              {Object.entries(availableSlots)?.map(([label, slots]) => {
                // Ensure slots are an array to prevent runtime errors
                if (Array.isArray(slots)) {
                  return (
                    <Dropdown
                      key={label}
                      label={label as "Morning" | "Afternoon" | "Evening"}
                      slots={slots}
                      isOpen={openDropdown === label}
                      toggleDropdown={handleToggleDropdown}
                      selectedSlot={selectedSlots[label]}
                      setSelectedSlot={(slot) =>
                        handleSlotSelection(
                          label as "Morning" | "Afternoon" | "Evening",
                          slot
                        )
                      }
                    />
                  );
                } else {
                  console.warn(`Invalid slots for label ${label}:`, slots);
                  return null;
                }
              })}
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
              {services.length > 0 ? (
                <div>
                  <ul>
                    {services.map((serviceItem: any) => (
                      <li key={serviceItem.id} className="service-item">
                        <div className="service-details">
                          <span>
                            {serviceItem.name} x {serviceItem.count}
                          </span>
                          <p className="duration">{serviceItem.duration} min</p>
                        </div>
                        <div className="service-price">
                          {/* ${serviceItem.price} */}$
                          {serviceItem.price
                            ? Number(serviceItem.price).toFixed(2)
                            : "N/A"}
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

export default SelectDate;
