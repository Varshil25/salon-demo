import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Badge,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { AllBarbers } from "../../../common/data/pagesData";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import { FaMapMarkerAlt, FaStar, FaCut } from "react-icons/fa"; // Import icons
import galleryImage from "../../../assets/images/Gallery/Gallery_Bg.jpeg";

interface Barber {
  name: string;
  image: string;
  cuttingSince: string;
  cuttingAtShearBrilliancein: string;
  location: string;
  specialization: string;
  rating: number;
  experienceInYears: number;
  availableForAppointments: boolean;
  bio: string;
}

interface Params extends Record<string, string | undefined> {
  name?: string;
}

const Profile: React.FC = () => {
  const { name } = useParams<Params>();
  const barber: Barber | undefined = AllBarbers.find(
    (barber) => barber.name.toLowerCase() === name?.toLowerCase()
  );

  if (!barber) {
    return <div>Barber not found</div>;
  }

  return (
    <>
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
          src={galleryImage}
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
            {barber.name}'s Profile
          </h1>
        </div>
      </section>
      <Container className="mt-5" style={{ padding: "40px 0" }}>
        <Row className="d-flex justify-content-center">
          <Col sm="6">
            <Card className="shadow-lg rounded-3">
              <CardImg
                top
                width="100%"
                src={barber.image}
                alt="Barber Image"
                style={{ borderRadius: "0px" }}
              />
              </Card>
              </ Col>
              <Col>
              <Card>
              <CardBody>
                <CardTitle tag="h3" className="mb-3">
                 <strong className="text-dark me-1">Barber Name:</strong>{barber.name}
                </CardTitle>
                <CardText>
                  <FaCut /> <strong>Cutting Since:</strong> {barber.cuttingSince}
                </CardText>
                <CardText>
                  <FaStar className="text-warning" /> <strong>Rating:</strong> {barber.rating} / 5
                </CardText>
                <CardText>
                  <FaMapMarkerAlt className="text-danger" /><strong>Location: </strong> {barber.location}
                </CardText>
                <div className="d-flex justify-content-start my-3">
                  <strong>Availbale For Appointment:</strong>
                  <Badge className="ms-2"
                    color={barber.availableForAppointments ? "success" : "danger"}
                  >
                    {barber.availableForAppointments ? "Available for Appointments" : "Available for Checkin"}
                  </Badge>
                </div>
                <CardText>
                  <strong>Specialization:</strong> {barber.specialization}
                </CardText>
                <CardText>
                  <strong>Years of Experience:</strong> {barber.experienceInYears}
                </CardText>
                <CardText>
                  <strong>Bio:</strong> {barber.bio}
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Profile;
