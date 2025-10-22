import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Spinner,
} from "reactstrap";
import { useGoogleLogin } from "@react-oauth/google";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { loginUser, resetLoginFlag, socialLogin } from "slices/thunks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CoverSignIn = () => {
  document.title = "Shear Brilliance Hair Studio";

  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const [loader, setLoader] = useState<boolean>(false);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      setLoader(true);
      try {
        dispatch(
          loginUser(values, (result: any) => {
            if (result.success) {
              toast.success("Login Successful!");
              localStorage.setItem("token", result.data.token); // Save token in local storage
              localStorage.setItem("user", JSON.stringify(result.data.user)); // Save user info in local storage
              navigate("/");
            } else {
              toast.error("Login Failed! Please check your credentials.");
            }
            setLoader(false); // Stop loader after processing the result
            setTimeout(() => {
              dispatch(resetLoginFlag());
            }, 3000);
          })
        );
      } catch (err) {
        console.error(err);
        setLoader(false);
      }
    },
  });

  const handleSuccess = (tokenResponse: any) => {
    // Dispatch the social login action and navigate to the homepage
    //dispatch(socialLogin(tokenResponse.access_token, navigate));

    dispatch(
      socialLogin(tokenResponse.access_token, (result: any) => {
        if (result.success) {
          toast.success("Login Successful!");
          localStorage.setItem("token", result.data.token); // Save token in local storage
          localStorage.setItem("user", JSON.stringify(result.data.user)); // Save user info in local storage
          navigate("/");
        } else {
          toast.error("Login Failed! ");
        }
        setLoader(false); // Stop loader after processing the result
        setTimeout(() => {
          dispatch(resetLoginFlag());
        }, 3000);
      })
    );

    toast.success("Login Successfully!");
    navigate("/"); // Redirect to homepage
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: (error) => console.error("Google login error:", error),
  });

  return (
    <React.Fragment>
      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={6} lg={5} className="justify-content-center">
                <Card className="overflow-hidden">
                  <Row className="g-0">
                    <Col lg={12}>
                      <div className="p-lg-5 p-4">
                        <div>
                          <h5 className="text-primary">Welcome Back!</h5>
                          <p className="text-muted">
                            Sign in to Shear Brilliance Hair Studio.
                          </p>
                        </div>

                        <div className="mt-4">
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                            }}
                            className="needs-validation"
                          >
                            <div className="mb-3">
                              <label htmlFor="useremail" className="form-label">
                                Email <span className="text-danger">*</span>
                              </label>
                              <Input
                                type="email"
                                className="form-control"
                                id="useremail"
                                placeholder="Enter email address"
                                name="email"
                                value={validation.values.email}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                invalid={
                                  validation.errors.email &&
                                  validation.touched.email
                                }
                              />
                              {validation.errors.email &&
                              validation.touched.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <div className="float-end">
                                <Link to="/forgotpassword"
                                  className="text-muted"
                                >
                                  Forgot password?
                                </Link>
                              </div>
                              <Label
                                className="form-label"
                                htmlFor="password-input"
                              >
                                Password
                              </Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Input
                                  type={passwordShow ? "text" : "password"}
                                  className="form-control pe-5 password-input"
                                  placeholder="Enter password"
                                  id="password-input"
                                  name="password"
                                  value={validation.values.password || ""}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.password &&
                                    validation.errors.password
                                  }
                                />
                                {validation.touched.password &&
                                validation.errors.password ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.password}
                                  </FormFeedback>
                                ) : null}
                                <button
                                  className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                  type="button"
                                  id="password-addon"
                                  onClick={() => setPasswordShow(!passwordShow)}
                                >
                                  <i className="ri-eye-fill align-middle"></i>
                                </button>
                              </div>
                            </div>

                            <div className="form-check">
                              <Input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="auth-remember-check"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="auth-remember-check"
                              >
                                Remember me
                              </Label>
                            </div>

                            <div className="mt-4">
                              <Button
                                color="success"
                                className="w-100"
                                type="submit"
                              >
                                {loader ? (
                                  <Spinner size="sm" className="me-2" />
                                ) : (
                                  "Sign In"
                                )}
                              </Button>
                            </div>
                            <div className="mt-4 text-center">
                              <div className="signin-other-title">
                                <h5 className="fs-13 mb-4 title">
                                  Sign In with
                                </h5>
                              </div>
                              <div>
                                {/* Google Login Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent event bubbling
                                    login(); // Trigger Google Login
                                  }}
                                  className="btn btn-danger btn-icon waves-effect waves-light me-1"
                                  type="button" // Ensure it's not treated as a form submission
                                >
                                  <i className="ri-google-fill fs-16"></i>
                                </button>

                                {/* Apple Login Placeholder */}
                                {/* <Button color="dark" className="btn-icon me-1">
                                <i className="ri-apple-fill fs-16"></i>
                              </Button> */}
                              </div>
                            </div>
                          </Form>
                        </div>

                        <div className="mt-5 text-center">
                          <p className="mb-0">
                            Don't have an account?{" "}
                            <Link to="/signup"
                              className="fw-semibold text-primary text-decoration-underline"
                            >
                              {" "}
                              Signup
                            </Link>{" "}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        <footer className="footer">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Shear Brilliance Hair
                    Studio.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default CoverSignIn;
