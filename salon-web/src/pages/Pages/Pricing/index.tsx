import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import Pricing from "./Pricing";
import Loaderpage from "../Loader/Loaderpage"; // Import the Loaderpage component

const Pricing_index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  document.title = "Pricing | Shear Brilliance";

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
        <Loaderpage /> // Show the loader while the page is loading
      ) : (
        <div className="layout-wrapper pricing">
          <Navbar />
          <Pricing />
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

export default Pricing_index;
