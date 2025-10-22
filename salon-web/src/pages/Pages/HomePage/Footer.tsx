import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import LogoLight from "../../../assets/images/home_page/SHEAR BRILLIANCE.png";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="custom-footer bg-dark py-1 position-relative">
        <Container>
          <Row>
            <Col className="col-lg-4 mt-4 " sm={12} md={6}>
              <div>
                <div>
                  <img src={LogoLight} alt="logo light" height="100" />
                </div>
                <div className="mt-4 fs-13">
                  <p>Premium Hair Salons</p>
                  <p>
                    At Shear Brilliance, we prioritize customer satisfaction.
                    Explore our site to discover our services, and if you need
                    something specific, we're here to help!
                  </p>
                  <ul className="list-inline mb-0 footer-social-link">
                    <li className="list-inline-item">
                      <Link
                        to="https://www.facebook.com/shearbrilliancehairstudio/"
                        className="avatar-xs d-block"
                      >
                        <div className="avatar-title rounded-circle ">
                          <i className="ri-facebook-fill"></i>
                        </div>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link
                        to="https://www.instagram.com/shearbrilliancehairstudio/"
                        className="avatar-xs d-block"
                      >
                        <div className="avatar-title rounded-circle">
                          <i className="ri-instagram-fill"></i>
                        </div>
                      </Link>
                    </li>
                    {/* <li className="list-inline-item">
                  <Link to="#!" className="avatar-xs d-block">
                    <div className="avatar-title rounded-circle">
                      <i className="ri-linkedin-fill"></i>
                    </div>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#!" className="avatar-xs d-block">
                    <div className="avatar-title rounded-circle">
                      <i className="ri-google-fill"></i>
                    </div>
                  </Link>
                </li> */}
                    {/* <li className="list-inline-item">
                  <Link to="#!" className="avatar-xs d-block">
                    <div className="avatar-title rounded-circle">
                      <i className="ri-dribbble-line"></i>
                    </div>
                  </Link>
                </li> */}
                  </ul>
                </div>
              </div>
            </Col>

            <Col className="col-lg-8 ms-lg-auto">
              {/* Address Row */}
              <Row className="mt-5">
                <Col sm={12} md={12} lg={6} className="mb-4">
                  <h5 className="text-white mb-0">Ajax Location</h5>
                  <p className="text-muted">
                    <a
                      href="https://www.google.com/maps?q=145+Kingston+Road+East,+Ajax,+ON"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted"
                    >
                      <i className="ri-map-pin-line"></i> 145 Kingston Road
                      East, #5, Ajax, ON.
                    </a>
                    <br />
                    <a href="tel:+19054261200" className="text-muted">
                      <i className="ri-phone-line"></i> (905) 426-1200
                    </a>
                    <br />
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <i
                        className="ri-mail-line"
                        style={{ marginRight: "5px" }}
                      ></i>
                      <a
                        href="mailto:ajax@shearbrilliance.ca"
                        className="text-muted"
                      >
                        ajax@shearbrilliance.ca
                      </a>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0",
                      }}
                    >
                      {/* <i
                        className="ri-global-line"
                        style={{ marginRight: "5px" }}
                      ></i>
                      <Link
                        to="https://shearbrilliance.ca/ajax"
                        target="_blank"
                        className="text-muted"
                      >
                        shearbrilliance.ca/ajax
                      </Link> */}
                    </span>
                  </p>
                </Col>

                <Col sm={12} md={12} lg={6} className="mb-4">
                  <h5 className="text-white mb-0">Pickering Location</h5>
                  <p className="text-muted">
                    <a
                      href="https://www.google.com/maps?q=1550+Kingston+Road,+Pickering,+ON"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted"
                    >
                      <i className="ri-map-pin-line"></i> 1550 Kingston Road,
                      Pickering, ON.
                    </a>
                    <br />
                    <a href="tel:+19054924994" className="text-muted">
                      <i className="ri-phone-line"></i> (905) 492-4994
                    </a>
                    <br />
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <i
                        className="ri-mail-line"
                        style={{ marginRight: "5px" }}
                      ></i>
                      <a
                        href="mailto:pickering@shearbrilliance.ca"
                        className="text-muted"
                      >
                        pickering@shearbrilliance.ca
                      </a>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0",
                      }}
                    >
                      {/* <i
                        className="ri-global-line"
                        style={{ marginRight: "5px" }}
                      ></i>
                      <Link
                        to="https://shearbrilliance.ca/pickering"
                        target="_blank"
                        className="text-muted"
                      >
                        shearbrilliance.ca/pickering
                      </Link> */}
                    </span>
                  </p>
                </Col>

                <Col sm={12} md={12} lg={6} className="mb-4">
                  <h5 className="text-white mb-0">Oshawa Location</h5>
                  <p className="text-muted">
                    <a
                      href="https://www.google.com/maps?q=1251+Simcoe+Street+North,+Oshawa,+ON"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted"
                    >
                      <i className="ri-map-pin-line"></i> 1251 Simcoe Street
                      North, Oshawa, ON.
                    </a>
                    <br />
                    <a href="tel:+19057231832" className="text-muted">
                      <i className="ri-phone-line"></i> (905) 723-1832
                    </a>
                    <br />
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <i
                        className="ri-mail-line"
                        style={{ marginRight: "5px" }}
                      ></i>
                      <a
                        href="mailto:oshawa@shearbrilliance.ca"
                        className="text-muted"
                      >
                        oshawa@shearbrilliance.ca
                      </a>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0",
                      }}
                    >
                      {/* <i
                        className="ri-global-line"
                        style={{ marginRight: "5px" }}
                      ></i>
                      <Link
                        to="https://shearbrilliance.ca/oshawa"
                        target="_blank"
                        className="text-muted"
                      >
                        shearbrilliance.ca/oshawa
                      </Link> */}
                    </span>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="text-center text-sm-start align-items-center mt-5">
            <Col className="col-12 col-sm-6">
              <div>
                <p className="copy-rights mb-0">
                  {new Date().getFullYear()} © Shear brilliance
                </p>
              </div>
            </Col>
            <Col className="col-12 col-sm-6">
              <div className="text-sm-end mt-3 mt-sm-0">
                <ul className="list-inline mb-0 footer-list gap-4 fs-15">
                  <li className="list-inline-item">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="/term-conditions">Terms & Conditions</Link>
                  </li>
                  {/* <li className="list-inline-item d-block w-100">
          <Link to="/security">Security</Link>
        </li> */}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
