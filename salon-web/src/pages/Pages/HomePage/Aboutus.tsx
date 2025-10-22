import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.css"; // Import the CSS file
import aboutus from "../../../assets/images/home_page/Aboutus.jpg";
import about_text from "../../../assets/images/home_page/About_text.svg";

const Aboutus = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isSmallScreen = window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => {
      const component = document.querySelector(".aboutus");
      if (component) {
        const componentPosition = component.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;

        if (componentPosition < viewportHeight) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`aboutus ${isVisible ? "animate" : ""}`} // Fade-in effect
      style={{
        marginTop: "90px",
        backgroundColor: "#F4F4F5",
        paddingTop: "90px",
        paddingBottom: "90px",
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Left side: Image */}
          <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
            <img
              src={aboutus}
              alt="Left Side"
              className={`img-fluid w-100 ${isVisible ? "image-slide-in" : ""}`} // Apply image animation class
              style={{
                maxHeight: "400px",
                objectFit: "cover",
                paddingRight: isSmallScreen ? "0px" : "30px",
              }}
            />
          </div>

          {/* Right side: Title, SVG, and Description */}
          <div className="col-lg-6 col-md-12 position-relative">
            {/* Background SVG behind the title */}
            <img
              src={about_text}
              alt="Services Background"
              className="services-background d-none d-md-block"
              style={{
                position: "absolute",
                top: "0",
                left: "60%",
                transform: "translateX(-50%)",
                opacity: "1",
                width: "80%",
                height: "auto",
                zIndex: "1",
              }}
            />

            {/* Title with animation */}
            <h2
              className={`fw-bold position-relative ${
                isVisible ? "text-slide-in" : ""
              }`} // Apply text animation class
              style={{
                fontSize: "36px",
                color: "#000",
                zIndex: "2",
              }}
            >
              About Shear Brilliance
            </h2>

            {/* Description paragraphs */}
            <p
              className={`paragraph ${isVisible ? "text-slide-in" : ""}`} // Apply text animation class
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                marginTop: "40px",
                zIndex: "3",
                position: "relative",
              }}
            >
              Our commitment to quality and service ensures our clients are
              happy. With years of experience and continuing education, our
              dedicated staff is ready to serve your needs. We’re happy to help
              you decide on the best look and can take care of all your hair
              needs, from the freshest fades to beard line-ups and trims.
            </p>
            <p
              className={`paragraph ${isVisible ? "text-slide-in" : ""}`} // Apply text animation class
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                marginTop: "40px",
                zIndex: "3",
                position: "relative",
              }}
            >
              Our experts are waiting to assist you today! With 3 locations to
              serve you we can take care of all of your hair grooming needs.
            </p>

            {/* Responsive Button */}
            <div className="mt-4">
              <Link to="/aboutus">
                <button className="btn btn-lg learn-more-btn">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
