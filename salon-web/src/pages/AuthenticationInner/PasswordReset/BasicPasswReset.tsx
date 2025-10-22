import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import ParticlesAuth from "../ParticlesAuth";
import logoLight from "../../../assets/images/home_page/SHEAR BRILLIANCE.png";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";
import { postForgetPwd } from "Services/AuthService";

const BasicPasswReset = () => {
  document.title = "Reset Password | Shear Brilliance";

  const [message, setMessage] = useState(""); // For feedback message after API call
  const [isError, setIsError] = useState(false); // For error handling

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Please include an @ in the email address"),
    }),
    onSubmit: async (values) => {
      
      try {
        const response =  postForgetPwd({ email: values.email });
        
        var data:any = await response;
        
        if (data && data.success) {
          setMessage(data.message || "Password reset link sent to your email.");
       
          setIsError(false);
        } else {
          // When success is false, use the response message or a fallback message
          setMessage(data.data?.message || "Something went wrong. Please try again.");
          setIsError(true);
        }
      } catch (error) {
        // Catch any network or unexpected errors
        setMessage("Failed to send password reset link. Please try again.");
        setIsError(true);
      }
    },
  });
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="100" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-semibold">
                  Shear Brilliance Hair Studio
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Forgot Password?</h5>
                      <p className="text-muted">Reset password with Velzon</p>
                      <i className="ri-mail-send-line display-5 text-success"></i>
                    </div>

                    <Alert
                      className={`border-0 ${isError ? 'alert-danger' : 'alert-success'} text-center mb-2 mx-2`}
                      role="alert"
                      isOpen={!!message}
                    >
                      {message}
                    </Alert>

                    <div className="p-2">
                      <Form onSubmit={validation.handleSubmit}>
                        <div className="mb-4">
                          <Label className="form-label">Email</Label>
                          <Input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter Email"
                            name="email"
                            value={validation.values.email}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.email &&
                              validation.touched.email
                                ? true
                                : false
                            }
                          />
                          {validation.errors.email &&
                          validation.touched.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="text-center mt-4">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Send Reset Link
                          </button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Wait, I remember my password...{" "}
                    <Link to="/signin"
                      className="fw-bold text-primary text-decoration-underline"
                    >
                      {" "}
                      Click here{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

      </ParticlesAuth>
    </React.Fragment>
  );
};

export default BasicPasswReset;
