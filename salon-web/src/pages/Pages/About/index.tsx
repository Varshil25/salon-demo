import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/Navbar";
import Aboutus from "./Aboutus";
import Footer from "../HomePage/Footer";
import Loaderpage from "../Loader/Loaderpage"; // Import your loader component

const Index_Aboutus = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the loader after the timer
    }, 2000);

    // Cleanup the timer when component unmounts
    return () => clearTimeout(timer);
  }, []);

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
        <Loaderpage /> // Show the loader until the page is fully loaded
      ) : (
        <div className="layout-wrapper gallary">
          <Navbar />
          <Aboutus />
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

export default Index_Aboutus;
