import React, { useState, useEffect } from "react";
import Blog from "./Blog";
// import Candidates from "./Candidates";
// import Categories from "./Categories";
// import Features from "./Features";
// import FindJob from "./FindJob";
import Footer from "./Footer";
import Home from "./Home";
import Navbar from "./Navbar";
// import Process from "./Process";
import Ourservices from "./Ourservices";
import Aboutus from "./Aboutus";
import GalleryHome from "./Gallaryhome";
import Topnotch from "./Topnotch";
import Loaderpage from "../Loader/Loaderpage";
import Mobile from "./mobile";

const JobLanding: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Shear Brilliance";

    // Set a timer to hide the loader after a fixed time (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the duration (in ms) as per your need

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    const backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
      if (window.scrollY > 100) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    }
  };

  // Add the scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling to the top
    });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Loaderpage /> // You can replace Loaderpage with any custom loader component
      ) : (
        <div className="layout-wrapper landing">
          <Navbar />
          <Home />
          <Ourservices />
          <Aboutus />
          <GalleryHome />
          <Topnotch />
          <Blog />
          <Mobile />
          <Footer />

          <button
            onClick={toTop}
            className="btn btn-info btn-icon landing-back-top"
            style={{ backgroundColor: "#be9342", border: "none" }}
            id="back-to-top"
          >
            <i className="ri-arrow-up-line"></i>
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default JobLanding;
