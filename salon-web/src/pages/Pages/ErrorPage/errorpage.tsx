import React from "react";
import { Container, Button } from "reactstrap";
import { Link } from "react-router-dom";
import loaderBackground from "../../../assets/images/home_page/loader_background.jpg";

const Errorpage = () => {
  return (
    <React.Fragment>
      <Container
        fluid
        className="d-flex align-items-center justify-content-center vh-100"
        style={{
          backgroundImage: `url(${loaderBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "8rem", fontWeight: "bold", color: "#fff" }}>
            404
          </h1>
          <h3
            style={{
              fontSize: "1.5rem",
              textTransform: "uppercase",
              marginTop: "1rem",
              color: "#fff",
            }}
          >
            Sorry, Page not Found 😭
          </h3>
          <p style={{ color: "#fff", marginBottom: "1.5rem" }}>
            The page you are looking for is not available!
          </p>
          <Link to="/">
            <Button color="success">
              <i className="mdi mdi-home me-1"></i>Back to home
            </Button>
          </Link>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Errorpage;
