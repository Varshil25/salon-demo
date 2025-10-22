import React from "react";
import { Container } from "reactstrap";
import "./Loader.css";
import Loaderlogo from "../../../assets/images/home_page/SHEAR BRILLIANCE.png";

const Loaderpage: React.FC = () => {
  return (
    <Container fluid className="loader-fullscreen">
      <img src={Loaderlogo} alt="Logo" className="loader-logo" />
    </Container>
  );
};

export default Loaderpage;
