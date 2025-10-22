import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import mobile from "../../../assets/images/home_page/mobile.png";

const Mobile = () => {
  return (
    <Container
      fluid
      style={{
        backgroundColor: "#F4F4F5",
      }}
    >
      <Container className="">
        <Row className="align-items-center justify-content-center text-center">
          {/* Left side - Mobile App Mockup */}
          <Col xs={12} md={6} className="text-center">
            <img src={mobile} alt="Mobile App Mockup" className="img-fluid" />
          </Col>

          {/* Right side - App Store & Play Store Links */}
          <Col xs={12} md={6}>
            <h3 className="text-black">Get Our App</h3>
            <p>Get the app now for easy access and exclusive features!</p>

            <div className="d-flex justify-content-center">
              {/* App Store Button */}
              <Button
                variant="link"
                href="https://apps.apple.com/in/app/shear-brilliance/id6739776925"
                className="d-flex align-items-center me-3"
              >
                <FaApple size={30} className="me-2" />
                <span>App Store</span>
              </Button>

              {/* Play Store Button */}
              <Button
                variant="link"
                href="https://play.google.com/store/apps/details?id=com.app.shearbrilliance"
                className="d-flex align-items-center"
              >
                <FaGooglePlay size={30} className="me-2" />
                <span>Google Play</span>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Mobile;
