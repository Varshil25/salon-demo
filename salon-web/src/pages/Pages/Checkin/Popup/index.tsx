import React, { useState } from "react";
import WaitlistPopup from "./WaitlistPopup";

const Popupindex: React.FC = () => {
  // State to manage the modal visibility
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the modal state
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      {/* Pass the required props to WaitlistPopup */}
      <WaitlistPopup isOpen={isOpen} toggle={toggle} />
    </React.Fragment>
  );
};

export default Popupindex;
