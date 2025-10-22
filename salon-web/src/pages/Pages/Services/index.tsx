import React, { useState, useEffect } from "react";
import Services from "./Services";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import Loaderpage from "../Loader/Loaderpage";

const Services_index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  document.title = "Service | Shear Brilliance";

  useEffect(() => {
    // Simulate a loading delay (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after the timer
    }, 2000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  window.onscroll = function () {
    scrollFunction();
  };

  const scrollFunction = () => {
    const element = document.getElementById("back-to-top");
    if (element) {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
  };

  const toTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Loaderpage /> // Show the loader until the page has finished loading
      ) : (
        <div className="layout-wrapper services">
          <Navbar />
          <Services />
          <button
            onClick={() => toTop()}
            className="btn btn-info btn-icon landing-back-top"
            style={{ backgroundColor: "#be9342", border: "none" }}
            id="back-to-top"
          >
            <i className="ri-arrow-up-line"></i>
          </button>
          <Footer />
        </div>
      )}
    </React.Fragment>
  );
};

export default Services_index;
