import React from "react";
import { Link } from "react-router-dom";
import AboutusImage from "../../../assets/images/Pricing/Pricing-Bg.jpeg"; // Make sure to update this path
import { Pickering } from "../../../common/data/pagesData";
import { Oshawa } from "../../../common/data/pagesData";
import { Ajax } from "../../../common/data/pagesData";

const Aboutus = () => {
  document.title = "About | Shear Brilliance";

  return (
    <>
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
          alt="Gallery"
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
            About Us
          </h1>
        </div>
      </section>

      {/* About Us Section */}
      <section
        className="aboutus"
        style={{
          backgroundColor: "#F4F4F5",
          paddingTop: "90px",
          paddingBottom: "90px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* Left side: YouTube Embed */}
            <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
              <div className="embed-responsive embed-responsive-16by9">
                <iframe
                  className="embed-responsive-item"
                  src="https://www.youtube.com/embed/sm-r2KJ9Vj4?si=EQmI1AYcPK2u2Lja"
                  title="About Us Video"
                  style={{
                    width: "100%",
                    height: "400px",
                    border: "none",
                  }}
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Right side: Title, SVG, and Description */}
            <div className="col-lg-6 col-md-12 position-relative">
              <h2
                className="fw-bold position-relative"
                style={{
                  fontSize: "36px",
                  
                  zIndex: "2",
                  lineHeight: "1.5",
              fontWeight: "bold",
    
                }}
              >
                About Shear Brilliance
              </h2>

              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  marginTop: "40px",
                  zIndex: "3",
                  position: "relative",
                }}
              >
                Our commitment to quality and services ensure our clients happy.
                With years of experiences and continuing education, our
                dedicated staff is ready to serve your needs. We’re happy to
                help you decide the best look and can take care of all your hair
                needs from the freshest fades to beard line ups and trims.
              </p>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  marginTop: "40px",
                  zIndex: "3",
                  position: "relative",
                }}
              >
                Our experts are waiting to assist you today! With 2 locations to
                serve you we can take care of all of your hair grooming needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pickering Location Barbers */}
      <section
        className="team-section py-5"
        style={{ backgroundColor: "#fff", padding: "0 " }}
      >
        <div className="containers">
          <h2
            className="text-center mb-4"
            style={{
              fontSize: window.innerWidth <= 768 ? "2rem" : "2.5rem",
              lineHeight: "1.5",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
            }}
            
          >
            Pickering Location Barbers
          </h2>
          <div className="container">
            <div className="row mt-5">
              {Pickering.map((member, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card">
                    <img
                      src={member.image}
                      className="card-img-top"
                      alt={`Team Member ${index + 1}`}
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
              {/* Button for View All Pickering Barbers */}
              <div className="text-center mt-4">
                <Link to="/aboutus/Pickering-Barbers" className="learn-more-btn">
                  View All Pickering Barbers
                </Link>
              </div>
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
      border
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
  `}</style>
      </section>

      {/* Oshawa Location Barbers */}
      <section
        className="team-section py-5"
        // style={{ backgroundColor: "#fff", padding: "0 " }}
        style={{
          backgroundColor: "#F4F4F5",
          paddingTop: "90px",
          paddingBottom: "90px",
        }}
      >
        <div className="containers">
         <h2
          className="text-center mb-4"
          style={{
            fontSize: window.innerWidth <= 768 ? "2rem" : "2.5rem",
            lineHeight: "1.5",
            fontWeight: "bold",
            textTransform: "uppercase",
            margin: "0",
          }}
        >
          Oshawa Location Barbers
        </h2>
          <div className="container">
            <div className="row mt-5">
              {Oshawa.map((member, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card">
                    <img
                      src={member.image}
                      className="card-img-top"
                      alt={`Team Member ${index + 1}`}
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
              {/* Button for View All Oshawa Barbers */}
              <div className="text-center mt-4">
                <Link to="/aboutus/Oshawa-Barber" className="learn-more-btn">
                  View All Oshawa Barbers
                </Link>
              </div>
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
  `}</style>
      </section>

      {/* Ajax Location Barbers */}
      <section
        className="team-section py-5"
        style={{ backgroundColor: "#fff", padding: "0 " }}
      >
        <div className="containers">
          <h2
            className="text-center mb-4"
            style={{
              fontSize: window.innerWidth <= 768 ? "2rem" : "2.5rem",
              lineHeight: "1.5",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
            }}
          >
            Ajax Location Barbers
          </h2>
          <div className="container">
            <div className="row mt-5">
              {Ajax.map((member, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card">
                    <img
                      src={member.image}
                      className="card-img-top"
                      alt={`Team Member ${index + 1}`}
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
              {/* Button for View All Ajax Barbers */}
              <div className="text-center mt-4">
                <Link to="/aboutus/Ajax-Barbers" className="learn-more-btn">
                  View All Ajax Barbers
                </Link>
              </div>
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
    </>
  );
};

export default Aboutus;
