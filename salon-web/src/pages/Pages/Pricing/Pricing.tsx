import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
// import BreadCrumb from '../../../Components/Common/BreadCrumb';
import classnames from "classnames";
import { pricing1, pricing2, pricing3 } from "../../../common/data";
import PricingImage from "../../../assets/images/Pricing/Pricing-Bg.jpeg";

const Pricing = () => {
  //Tab
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab: any) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  document.title = "Pricing | Shear Brilliance";

  return (
    <React.Fragment>
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
          src={PricingImage}
          alt="Pricing"
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
            backgroundColor: "rgba(0, 0, 0, 0.7)",
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
            Pricing
          </h1>
        </div>
      </section>

      <div className="page-content" style={{ padding: "40px 12px" }}>
        <Container>
          {/* <Row className="justify-content-center mt-5">
            <Col lg={4}>
              <div className="text-center mb-4 pb-2">
                <h4 className="fw-semibold fs-22">Simple Pricing Plan</h4>
                <p className="text-muted mb-4 fs-15">
                  Simple pricing. No hidden fees. Advanced features for you
                  business.
                </p>
              </div>
            </Col>
          </Row> */}

          <Row>
            {(pricing3 || []).map((price3: any, key: any) => (
              <Col lg={4} key={key}>
                <Card className="pricing-box ribbon-box ribbon-fill text-center justify-content-center">
                  {price3.ribbon === true ? (
                    <div className="ribbon ribbon-primary">New</div>
                  ) : (
                    ""
                  )}
                  <Row className="g-0 justify-content-center align-items-center">
                    <Col lg={12}>
                      <CardBody
                        className="h-100 d-flex flex-column justify-content-center align-items-center"
                        style={{ paddingBottom: "32px" }}
                      >
                        <div>
                          <h5 className="mb-1">{price3.type}</h5>
                          <p className="text-muted">{price3.purpose}</p>
                        </div>

                        <div className="py-4">
                          <h2>
                            <sup>
                              <small>$</small>
                            </sup>
                            {price3.rate}{" "}
                            <span className="fs-13 text-muted">
                              /Once cutting
                            </span>
                          </h2>
                        </div>

                        <div className="text-center plan-btn mt-2">
                          <Link to="/services" className=" learn-more-btn">
                            Services
                          </Link>
                        </div>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Pricing;
