import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import confirmationgirl from "../../assets/images/Confirmationloader/Confirmation_Girl.png";
import "./Confirmationloader.css";

const Confirmationloader: React.FC = () => {
  return (
    <Container
      className="confirmation-loader-container d-flex align-items-center justify-content-center"
      fluid
    >
      <Row className="text-center">
        <Col>
          <div className="confirmation-loader-jumbotron">
            <img
              src={confirmationgirl}
              alt="Confirmation"
              className="confirmation-loader-image"
            />
            <div className="confirmation-loader-text mt-4">
              <h2 className="confirmation-loader-text1">
                Your salon appointment is confirmed !!
              </h2>
              <p className="confirmation-loader-text2">
                We’re excited to serve you! Thank you for choosing us. See you
                soon!
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Confirmationloader;
