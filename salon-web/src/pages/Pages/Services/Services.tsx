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
} from "reactstrap";
import serviceImage from "../../../assets/images/Services/Service-Bg.png"; // Adjust the path as necessary
import Haircutting from "../../../assets/images/Services/Hair_Cutting.png";
import Hairstyle from "../../../assets/images/Services/Hair_Style.jpg";
import Flattop from "../../../assets/images/Services/Flat-Top.jpg";
import Beardtrim from "../../../assets/images/Services/Beard-Trim.jpg";
import Outline from "../../../assets/images/Services/Outline.jpg";
import Lineup from "../../../assets/images/Services/Line-Up.jpg";

const Services = () => {
  return (
    <div>
      {/* Hero Section */}
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
          alt="services"
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
            Services
          </h1>
        </div>
      </section>

      {/* Services Section */}
      <section className="services py-5" style={{ backgroundColor: "#FFFFFF" }}>
        <Container>
          <Row>
            <Col md="4">
              <Card className="service-card" style={{ boxShadow: "none" }}>
                <CardImg
                  top
                  width="100%"
                  src={Haircutting}
                  alt="Normal Haircut"
                  style={{
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                  }}
                />
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  <CardTitle
                    className="d-flex justify-content-between align-items-center fs-20 fw-bold"
                    style={{ color: "#212529" }}
                  >
                    Haircut
                    <CardText>
                      <p className="text-success fs-20 "></p>
                    </CardText>
                  </CardTitle>
                  <CardText>
                    Our commitment to excellence and top-notch service ensures
                    our clients leave satisfied. With years of experience, our
                    skilled team is dedicated to meeting all your haircut needs.
                  </CardText>
                </CardBody>
              </Card>
            </Col>

            <Col md="4">
              <Card
                className="service-card"
                style={{
                  boxShadow: "none",
                  borderTopLeftRadius: "0",
                  borderTopRightRadius: "0",
                }}
              >
                <CardImg
                  top
                  width="100%"
                  src={Hairstyle}
                  alt="Hair Pump"
                  style={{
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                  }}
                />
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  <CardTitle
                    className="d-flex justify-content-between align-items-center fs-20 fw-bold"
                    style={{ color: "#212529" }}
                  >
                    Hairstyle <strong className="text-success"></strong>
                  </CardTitle>
                  <CardText>
                    We are dedicated to delivering top-quality service, ensuring
                    our clients leave satisfied every time. With years of
                    expertise, our passionate team is here to meet all your
                    hairstyling needs, helping you achieve the perfect look.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="service-card" style={{ boxShadow: "none" }}>
                <CardImg
                  top
                  width="100%"
                  src={Flattop}
                  alt="Hair Clean"
                  style={{
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                  }}
                />
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  <CardTitle
                    className="d-flex justify-content-between align-items-center fs-20 fw-bold"
                    style={{ color: "#212529" }}
                  >
                    <strong>Flat Top</strong>{" "}
                    <strong className="text-success"></strong>
                  </CardTitle>
                  <CardText>
                    At Flat Top, we are dedicated to providing exceptional
                    quality and service, ensuring our clients' satisfaction
                    every step of the way. With years of experience, our skilled
                    team is committed to meeting all your grooming and styling
                    needs with precision and care.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md="4">
              <Card className="service-card" style={{ boxShadow: "none" }}>
                <CardImg
                  top
                  width="100%"
                  src={Beardtrim}
                  alt="Beard Styling"
                  style={{
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                  }}
                />
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  <CardTitle
                    className="d-flex justify-content-between align-items-center fs-20 fw-bold"
                    style={{ color: "#212529" }}
                  >
                    <strong>Beard Trim</strong>{" "}
                    <strong className="text-success"></strong>
                  </CardTitle>
                  <CardText>
                    We prioritize excellence in our Beard Trim services,
                    ensuring our clients leave satisfied every time. With
                    extensive experience in the grooming industry, our skilled
                    team is dedicated to meeting all your beard care needs with
                    precision and style.
                  </CardText>
                </CardBody>
              </Card>
            </Col>

            <Col md="4">
              <Card className="service-card" style={{ boxShadow: "none" }}>
                <CardImg
                  top
                  width="100%"
                  src={Outline}
                  alt="New Haircut"
                  style={{
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                  }}
                />
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  <CardTitle
                    className="d-flex justify-content-between align-items-center fs-20 fw-bold"
                    style={{ color: "#212529" }}
                  >
                    <strong>Outline</strong>{" "}
                    <strong className="text-success"></strong>
                  </CardTitle>
                  <CardText>
                    At Beard Outline, we prioritize excellence and customer
                    satisfaction. With years of experience in the industry, our
                    dedicated team is here to cater to all your grooming needs,
                    ensuring you look and feel your best.
                  </CardText>
                </CardBody>
              </Card>
            </Col>

            <Col md="4">
              <Card className="service-card" style={{ boxShadow: "none" }}>
                <CardImg
                  top
                  width="100%"
                  src={Lineup}
                  alt="Hair Treatment"
                  style={{
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                  }}
                />
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  <CardTitle
                    className="d-flex justify-content-between align-items-left fs-20 fw-bold"
                    style={{ color: "#212529" }}
                  >
                    Line Up <strong className="text-success"></strong>
                  </CardTitle>
                  <CardText>
                    Our dedication to excellence and customer satisfaction
                    guarantees a remarkable experience for every client. With
                    years of expertise, our skilled team is here to meet all
                    your beard grooming needs, ensuring you leave looking sharp
                    and stylish.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Services;
