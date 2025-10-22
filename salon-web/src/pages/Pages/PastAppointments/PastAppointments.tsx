import React, { useState, useEffect } from "react";
import { Container, Row, Col, Accordion, AccordionItem, AccordionHeader, AccordionBody } from "reactstrap";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import { Getpastappointmnet } from "Services/appointment";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiClock, FiCalendar } from "react-icons/fi";

interface Appointment {
  id: number;
  UserId: number;
  BarberId: number;
  SalonId: number;
  SlotId: number;
  number_of_people: number;
  status: string;
  estimated_wait_time: number | null;
  queue_position: number | null;
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
  category: string;
}

interface Salon {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  open_time: string;
  close_time: string;
  photos: string;
  google_url: string;
  status: string;
  services: any | null;
  pricing: any | null;
  faq: any | null;
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
  non_working_days: any[];
}

const PastAppointments = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Added useNavigate hook
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<any >("0");
  // Getting user data from Redux store
  const user = useSelector((state: any) => state?.Login?.user);
  const user_id = user?.data?.user?.id || "";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await Getpastappointmnet(user_id);
        if (response?.data?.length > 0) {
          setAppointments(response.data);
        } else {
          setError("No appointments found");
        }
      } catch (err) {
        setError("Failed to fetch appointments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user_id]);

  const today = new Date();
  const todayWithoutTime = new Date(today.setHours(0, 0, 0, 0));
  // Filter and sort upcoming appointments
  const upcomingAppointments = appointments
    .filter((appointment) => {
      // Normalize appointment date to compare only the date
      const appointmentDate = new Date(appointment.appointment_date);
      return (
        appointmentDate >= today && // Compare exact date and time for upcoming appointments
        appointment.status.toLowerCase() !== "canceled"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime()
    );

  // Filter past appointments
  const pastAppointments = appointments.filter((appointment) => {
    // Normalize appointment date to compare only the date
    const appointmentDate = new Date(appointment.appointment_date);
    return (
      appointmentDate < today && // Compare exact date and time for past appointments
      appointment.status.toLowerCase() !== "canceled"
    );
  });

  // Filter canceled appointments
  const canceledAppointments = appointments.filter(
    (appointment) => appointment.status.toLowerCase() === "canceled"
  );

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
  
  // Common appointment card component to avoid repetition
  const AppointmentCard = ({
    appointment,
    isUpcoming,
  }: {
    appointment: Appointment;
    isUpcoming: boolean;
  }) => {
    const displayStatus =
      appointment.status.toLowerCase() === "checked_in"
        ? "Check In"
        : appointment.status.toLowerCase() === "appointment"
        ? "Appointment"
        : appointment.status;

    return (
      <Col
        xs={12}
        md={6}
        lg={4}
        key={appointment.id}
        className="mb-3 d-flex justify-content-center"
      >
        <div
          onClick={() => {
            if (isUpcoming) {
              // Only navigate if the appointment is in the "Upcoming Appointments" section
              navigate(`/appointment_confirmation/${appointment.id}`);
            }
          }}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            width: "100%",
            transition: "transform 0.2s ease, border 0.2s ease",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1" }}>
              <h5 style={{ marginBottom: "5px", color: "#333" }}>
                {appointment.Barber.name}
              </h5>
              <p
                className="mb-0"
                style={{ color: "#333", fontWeight: "normal" }}
              >
                {displayStatus}
              </p>
            </div>
            <div style={{ flex: "1", textAlign: "right" }}>
              <p className="mb-1" style={{ margin: "0", color: "#be9342" }}>
                <FiCalendar className="me-2" />
                {appointment.appointment_date}
              </p>
              {appointment.appointment_start_time && (
                <p className="mb-0">
                  <FiClock className="me-2" />
                  {formatTime(appointment.appointment_start_time)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Col>
    );
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id); // Toggle open/close
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
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
            Your Salon Journey
          </h1>
        </div>
      </section>

      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
  {/* Main Content */}
  <Container style={{ flex: 1,  padding: window.innerWidth <= 768 ? "25px" : "60px", maxWidth: "100vw" }}>
    <Accordion open={openAccordion} toggle={toggleAccordion}>
      {[
        {
          id: "0",
          title: "Upcoming Appointments",
          appointments: upcomingAppointments,
          isUpcoming: true,
        },
        {
          id: "1",
          title: "Past Appointments",
          appointments: pastAppointments,
          isUpcoming: false,
        },
        {
          id: "2",
          title: "Canceled Appointments",
          appointments: canceledAppointments,
          isUpcoming: false,
        },
      ].map(({ id, title, appointments, isUpcoming }) => (
        <AccordionItem key={id}>
          <AccordionHeader
            targetId={id}
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            {title}
          </AccordionHeader>
          <AccordionBody accordionId={id}>
            <Row className="d-flex justify-content-center align-items-center">
              {loading && <p>Loading...</p>}
              {!loading && appointments.length === 0 && (
                <p>No {title.toLowerCase()}</p>
              )}
              {!loading &&
                appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isUpcoming={isUpcoming}
                  />
                ))}
            </Row>
          </AccordionBody>
        </AccordionItem>
      ))}
    </Accordion>
  </Container>

  {/* Footer */}
  <Footer />
</div>

    </React.Fragment>
  );
};

export default PastAppointments;
