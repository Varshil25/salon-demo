import React from "react";
import { Link } from "react-router-dom";
import { AllAjaxBarbers } from "../../../common/data/pagesData";
import AboutusImage from "../../../assets/images/Gallery/Gallery_Bg.jpeg";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";

const Ajaxbarber = () => {
  return (
    <>
      <Navbar />
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
          src={AboutusImage}
          alt="AjaxBarber"
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
            Ajax Barber
          </h1>
        </div>
      </section>

      {/* Ajax Location Barbers */}
      <section
        className="team-section "
        style={{ backgroundColor: "#fff", padding: "0px" }}
      >
        <div className="containers">
          {/* <h2
            className="text-center mb-4"
            style={{
              backgroundColor: "#BE9342",
              padding: "20px 0",
              color: "#000000",
            }}
          >
            Our Team
          </h2> */}
          <div className="container">
            <div className="row mt-5">
              {AllAjaxBarbers.map((member, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <div className="card">
                    <img
                      src={member.image}
                      className="card-img-top"
                      alt={`Team Member ${index + 1}`}
                      style={{ height: "280px" }}
                    />
                    <div className="overlay">
                      <h5 className="text-white"><strong>{member.name}</strong></h5>
                      {member.profileLink && (
                        // <a href="/profile/:name" className="btn btn-light">
                        //   View Profile
                        // </a>
                        <div>
                          <Link
                            key={member.name} // Use a unique key for each barber
                            to={`/profile/${member.name}`} // Create the dynamic route
                            className="btn btn-light"
                          >
                            View Profile
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
    .card {
      position: relative;
      overflow: hidden;
      transition: transform 0.3s;
      border-radius: 0px;
    }

    .card:hover {
      transform: scale(1.05);
    }

    .card-img-top {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(190, 147, 66, 0.9);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .card:hover .overlay {
      opacity: 1;
    }
      .learn-more-btn {
      background-color: #be9342;
      border: none;
      color: #ffffff;
      width: 230px;
      height: auto;
      padding: 12px 24px;
      font-family: "Poppins", sans-serif;
      font-size: 16px;
      text-align: center;
      border-radius: 0;
      transition: background-color 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
    }

    .learn-more-btn:hover {
      background-color: #ffffff; /* Darker shade on hover */
      transform: scale(1.05); /* Slightly enlarge on hover */
    }
  `}</style>
      </section>

      <Footer />
    </>
  );
};

export default Ajaxbarber;
