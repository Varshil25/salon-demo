import React from "react";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom"; // Make sure to import Link for routing

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid>
          <Row>
          <Col sm={3}>{new Date().getFullYear()} © Shear Brilliance.</Col>
          <Col sm={3}><div className="text-sm-end d-none d-sm-block">
                <Link to="https://www.orionik.com/" target="_blank" rel="noopener noreferrer">Developed by Orionik</Link>
              </div>
              </Col>
            <Col sm={6} className="text-sm-end">
              <Link to="/termscondition" className="me-1">
                Terms and Conditions  &nbsp;  &nbsp;|
              </Link>
              <Link to="/pages-privacy-policy">&nbsp; Privacy Policy</Link>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
