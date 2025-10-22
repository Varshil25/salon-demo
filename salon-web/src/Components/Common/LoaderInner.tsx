import React, { useEffect, useState } from "react";
import "./LoaderInner.css";

const LoaderInner: React.FC = () => {
  const messages = [
    "Preparing your stylish look...",
    "Setting up your perfect haircut...",
    "Getting ready for a fresh fade...",
    "Loading the best salon experience...",
    "Crafting your custom hairstyle...",
    "Almost ready to style you up!",
  ];

  const [currentMessage, setCurrentMessage] = useState<string>(messages[0]);
  let index = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(messages[index]);
      index = (index + 1) % messages.length;
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="overlay-innerloader">
      <div className="innerloader-container">
        <div className="innerspinner"></div>
        <div className="innerloader-text">{currentMessage}</div>
      </div>
    </div>
  );
};

export default LoaderInner;
