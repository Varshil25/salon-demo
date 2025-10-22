import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import scissors from "../../../assets/images/home_page/scissors_homepage.svg";
import razor_barber from "../../../assets/images/home_page/razor_homepage.svg";
import hairdryer from "../../../assets/images/home_page/hairdryer_homepage.svg";
import Services from "../../../assets/images/home_page/SERVICE.svg";

const Ourservices = () => {
  const [visible, setVisible] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null); // Use HTMLDivElement type

  const handleScroll = () => {
    if (servicesRef.current) {
      // Check if servicesRef.current is not null
      const { top } = servicesRef.current.getBoundingClientRect();
      if (top < window.innerHeight) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll); // Remove listener after it becomes visible
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      className="why-choose-us"
      style={{ marginTop: "90px", position: "relative", overflow: "hidden" }}
      ref={servicesRef} // Reference for the scroll listener
    >
      {/* Background SVG */}
      <img
        src={Services}
        alt="Services Background"
        className="services-background d-none d-md-block"
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translate(-50%, -20%)",
          opacity: "1",
          width: "40%",
          height: "auto",
        }}
      />

      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h2
              className="fw-bold"
              style={{ color: "#000000", fontSize: "36px" }}
            >
              Our Expertise
            </h2>
            <p style={{ lineHeight: "1.5" }}>
              At our premium hair salon, we blend artistry and expertise for an
              exceptional grooming experience tailored to your unique style.
              Enjoy luxury hair services in Canada, where every detail is
              crafted for your confidence and satisfaction.
            </p>
          </div>
        </div>

        <div className="row text-center">
          {/* Service 1: Haircut */}
          <div className="col-md-4">
            <div
              className={`service-box d-flex flex-column align-items-center ${
                visible ? "visible" : ""
              }`}
            >
              <img
                src={scissors}
                alt="Haircut Icon"
                className="service-icon mb-3"
                style={{ width: "80px", height: "80px" }}
              />
              <h4 className="fw-bold" style={{ color: "#000000" }}>
                Haircut
              </h4>
              <p style={{ textAlign: "center" }}>
                Tailored cuts to enhance your style, leaving you refreshed and
                confident.
              </p>
            </div>
          </div>
          {/* Service 2: Shaving */}
          <div className="col-md-4">
            <div
              className={`service-box d-flex flex-column align-items-center ${
                visible ? "visible" : ""
              }`}
            >
              <img
                src={razor_barber}
                alt="Shaving Icon"
                className="service-icon mb-3"
                style={{ width: "80px", height: "80px" }}
              />
              <h4 className="fw-bold" style={{ color: "#000000" }}>
                Shaving
              </h4>
              <p style={{ textAlign: "center" }}>
                A meticulous straight razor shave for a smooth finish, leaving
                you invigorated and polished.
              </p>
            </div>
          </div>
          {/* Service 3: Hairstyle */}
          <div className="col-md-4">
            <div
              className={`service-box d-flex flex-column align-items-center ${
                visible ? "visible" : ""
              }`}
            >
              <img
                src={hairdryer}
                alt="Hairstyle Icon"
                className="service-icon mb-3"
                style={{ width: "80px", height: "80px" }}
              />
              <h4 className="fw-bold" style={{ color: "#000000" }}>
                Hairstyle
              </h4>
              <p style={{ textAlign: "center" }}>
                Customized styling that highlights your look, ensuring you look
                stunning for any occasion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Button centered below all photos */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <Link to="/services"
            className="btn  btn-lg learn-more-btn"
            style={{ margin: "0 auto", maxWidth: "100%", width: "auto" }} // Center the button and set width to auto
          >
            More Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Ourservices;
