import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Topnotch_img from "../../../assets/images/home_page/Topnotch.jpg";
import Topnotch_text from "../../../assets/images/home_page/Topnotch_text.svg";

const Topnotch = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null); // Type for sectionRef

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        // Check if sectionRef.current is not null
        const { top } = sectionRef.current.getBoundingClientRect();
        const isInViewport = top < window.innerHeight && top > 0;

        if (isInViewport) {
          setIsVisible(true);
          window.removeEventListener("scroll", handleScroll);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="aboutus"
      style={{
        marginTop: "90px",
        backgroundColor: "#F4F4F5",
        paddingTop: "90px",
        paddingBottom: "90px",
      }}
      ref={sectionRef}
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Left side: Image */}
          <div className="col-lg-6 col-md-12 mt-4 mb-4 mb-lg-0 order-md-2">
            <img
              src={Topnotch_img}
              alt="Right Side"
              className={`img-fluid w-100 ${
                isVisible ? "slide-in-right" : "hidden"
              }`} // Apply animation class
              style={{
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Right side: Title, SVG, and Description */}
          <div className="col-lg-6 col-md-12 position-relative order-md-1">
            <img
              src={Topnotch_text}
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

            <h2
              className={`fw-bold position-relative ${
                isVisible ? "slide-in-left" : "hidden"
              }`} // Apply animation class
              style={{
                fontSize: "36px",
                color: "#000",
                zIndex: "2",
              }}
            >
              Top Notch
            </h2>

            {/* Description paragraphs */}
            <p
              className={`${isVisible ? "slide-in-left" : "hidden"}`} // Apply animation class
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                marginTop: "40px",
                zIndex: "3",
                position: "relative",
              }}
            >
              At our salon, we pride ourselves on being the best in the
              industry, setting the standard for quality and style. Our
              dedicated team of professionals combines artistry with the latest
              techniques to provide you with exceptional grooming experiences
              tailored to your individual needs.
            </p>
            <p
              className={`${isVisible ? "slide-in-left" : "hidden"}`} // Apply animation class
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                marginTop: "30px",
                zIndex: "3",
                position: "relative",
              }}
            >
              From luxurious hair services to personalized consultations, we
              focus on every detail to ensure your satisfaction. Experience the
              difference at our salon, where excellence is not just a promise;
              it’s our commitment to you.
            </p>

            {/* Responsive Button */}
            <div className="mt-4">
              <Link to="/contactus">
                <button
                  className="btn-lg learn-more-btn" // Use the class for styling
                >
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topnotch;
