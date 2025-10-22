import React, { useState, FormEvent, ChangeEvent } from "react";
import { Col, Container, Form, Row } from "reactstrap";
import contactus from "../../../assets/images/Contactus/contactus.png";
import { CeateContactus } from "../../../Services/ContactServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  name: string;
  email: string;
  subject: string;

  message: string;
}
const Contactus = () => {
  document.title = "Contact | Shear Brilliance";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // Ensure this is defined here

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submit
  // Handle form submit
  // Handle form submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await CeateContactus(formData);
      const data: any = await response;

      // Display success or error toast based on the API response
      if (data.success) {
        toast.success("Message sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(
          data.message || "Failed to send message. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (error) {
      console.error("API call error:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
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
          src={contactus}
          alt="gallery"
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
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
            Contact Us
          </h1>
        </div>
      </section>

      <section>
        <div className="container mt-5 mb-3">
          <div className="row">
            {/* Card 1 */}
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="salon-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "20px",
                }}
              >
                {loading && <div className="shimmer-effect"></div>}{" "}
                {/* Shimmer effect */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2876.7042697950133!2d-79.01993798449546!3d43.861957879114634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4e007be5af0a7%3A0xe07d1cd872adac29!2s145+Kingston+Rd+E+%235%2C+Ajax%2C+ON+L1S+7J4!5e0!3m2!1sen!2sca!4v1515684197700"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setLoading(false)} // Set loading to false when the iframe loads
                  style={{ width: "100%", height: "300px", border: "none" }}
                ></iframe>
                <div className="salon-card-body" style={{ padding: "15px" }}>
                  <h5
                    className="salon-title"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    Ajax Location
                  </h5>
                  <p
                    className="salon-subtitle"
                    style={{
                      color: "#666",
                      fontSize: "1rem",
                      marginBottom: "15px",
                    }}
                  >
                    145 Kingston Road East unit 5. Ajax, Ontario
                  </p>
                  <a href="https://www.google.com/maps/place/145+Kingston+Rd+E+%235,+Ajax,+ON+L1S+7J4,+Canada/@43.86195,-79.01775,1409m/data=!3m1!1e3!4m5!3m4!1s0x89d4e00794ebb52f:0xe87dd9a0e728fe7e!8m2!3d43.86195!4d-79.01775?hl=en-GB&entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D">
                    <button className="check-in-btn w-100 learn-more-btn">
                      View Location
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="salon-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "20px",
                }}
              >
                {loading && <div className="shimmer-effect"></div>}{" "}
                {/* Shimmer effect */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.574072934204!2d-79.08359598449606!3d43.84392867911515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4df1be26d608f%3A0x3b31868429315e14!2s1550+Kingston+Rd%2C+Pickering%2C+ON+L1V+1X6!5e0!3m2!1sen!2sca!4v1502127611609"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setLoading(false)} // Set loading to false when the iframe loads
                  style={{ width: "100%", height: "300px", border: "none" }}
                ></iframe>
                <div className="salon-card-body" style={{ padding: "15px" }}>
                  <h5
                    className="salon-title"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    Pickering Location
                  </h5>
                  <p
                    className="salon-subtitle"
                    style={{
                      color: "#666",
                      fontSize: "1rem",
                      marginBottom: "15px",
                    }}
                  >
                    1550 Kingston Road, Pickering,
                    <br /> Ontario
                  </p>
                  <a href="https://www.google.com/maps/place/1550+Kingston+Rd+%23202,+Pickering,+ON+L1V+6W9,+Canada/@43.84398,-79.081894,1409m/data=!3m1!1e3!4m5!3m4!1s0x89d4df195063a5e1:0xce9714f5800af996!8m2!3d43.8437309!4d-79.0819887?hl=en-GB&entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D">
                    <button className="check-in-btn w-100 learn-more-btn">
                      View Location
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="salon-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "20px",
                }}
              >
                {loading && <div className="shimmer-effect"></div>}{" "}
                {/* Shimmer effect */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2873.3777993915073!2d-78.87928258491438!3d43.93085427911267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d51c821ff9a0bf%3A0xa45726157a301b2b!2s1251+Simcoe+St+N%2C+Oshawa%2C+ON+L1G+4W2!5e0!3m2!1sen!2sca!4v1517059920072"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setLoading(false)} // Set loading to false when the iframe loads
                  style={{ width: "100%", height: "300px", border: "none" }}
                ></iframe>
                <div className="salon-card-body" style={{ padding: "15px" }}>
                  <h5
                    className="salon-title"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    Oshawa Location
                  </h5>
                  <p
                    className="salon-subtitle"
                    style={{
                      color: "#666",
                      fontSize: "1rem",
                      marginBottom: "15px",
                    }}
                  >
                    1251 Simcoe St N. Oshawa,
                    <br /> Ontario
                  </p>
                  <a href="https://www.google.com/maps/place/1251+Simcoe+St+N,+Oshawa,+ON+L1G+4X1,+Canada/@43.930469,-78.876769,1407m/data=!3m1!1e3!4m6!3m5!1s0x89d51c8210837563:0x90fbd93cd5985ce9!8m2!3d43.9310146!4d-78.8772061!16s%2Fg%2F11ckqrx46b?hl=en-GB&entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D">
                    <button className="check-in-btn w-100 learn-more-btn">
                      View Location
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center mb-5">
                <h3 className="mb-3 fw-semibold" style={{ color: "#000" }}>
                  Get In Touch
                </h3>
                <p className="mb-4 ff-secondary" style={{ color: "#000" }}>
                  We’re here to help you look and feel your best. Reach out to
                  us with your questions, feedback, or appointment requests!
                  we’d love to hear from you!
                </p>
              </div>
            </Col>
          </Row>

          <Row className="gy-4">
            <Col lg={4}>
              <div>
                <div className="mt-4">
                  <h5 className="fs-13 text-muted text-uppercase">
                    Oshawa Location
                  </h5>
                  <div className="fw-semibold">
                    1251 Simcoe Street North, Oshawa, <br />
                    Ontario
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="fs-13 text-muted text-uppercase">
                    Pickering Location
                  </h5>
                  <div className="fw-semibold">
                    1550 Kingston Road, Pickering, <br />
                    Ontario
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="fs-13 text-muted text-uppercase">
                    Ajax Location
                  </h5>
                  <div className="fw-semibold">
                    145 Kingston Road East unit 5. Ajax, <br />
                    Ontario
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={8}>
              <div>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-4">
                        <label htmlFor="name" className="form-label fs-13">
                          Name
                        </label>
                        <input
                          name="name"
                          id="name"
                          type="text"
                          className="form-control border-light"
                          placeholder="Your name*"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-4">
                        <label htmlFor="email" className="form-label fs-13">
                          Email
                        </label>
                        <input
                          name="email"
                          id="email"
                          type="email"
                          className="form-control border-light"
                          placeholder="Your email*"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="mb-4">
                        <label htmlFor="subject" className="form-label fs-13">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="form-control border-light"
                          id="subject"
                          name="subject"
                          placeholder="Your Subject.."
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="mb-3">
                        <label htmlFor="message" className="form-label fs-13">
                          Message
                        </label>
                        <textarea
                          name="message"
                          id="message"
                          rows={3}
                          className="form-control border-light"
                          placeholder="Your message..."
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="text-end">
                      <input
                        type="submit"
                        id="submit"
                        name="send"
                        className="submitBnt btn btn-primary learn-more-btn"
                        value="Send Message"
                      />
                    </Col>
                  </Row>
                </Form>
                <ToastContainer />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Contactus;
