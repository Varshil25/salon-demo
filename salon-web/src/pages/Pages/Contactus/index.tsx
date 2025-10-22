import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import Contactus from "./contactus";
import Loaderpage from "../Loader/Loaderpage"; // Import your Loader component

const Contactus_index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the loader after the timer
    }, 2000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      {isLoading ? (
        <Loaderpage /> // Show the loader until the page is fully loaded
      ) : (
        <div>
          <Navbar />
          <Contactus />
          <Footer />
        </div>
      )}
    </React.Fragment>
  );
};

export default Contactus_index;
