import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Alert,
  Container,
  Spinner,
  Row,
  Form,
  FormFeedback,
  Input,
  Button,
} from "reactstrap";
import { useGoogleLogin } from "@react-oauth/google";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// action
import { useDispatch } from "react-redux";
import { registerUser, resetRegisterFlag, socialLogin } from "slices/thunks";
//redux
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import ReCAPTCHA from "react-google-recaptcha";

const CoverSignUp = () => {
  const history = useNavigate();
  const dispatch: any = useDispatch();
  const [loader, setLoader] = useState<boolean>(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  document.title = "Shear Brilliance Hair Studio";

  const handleSuccess = (tokenResponse: any) => {
    dispatch(
      socialLogin(tokenResponse.access_token, (result: any) => {
        if (result.success) {
          toast.success("Login Successful!");
          localStorage.setItem("token", result.data.token); // Save token in local storage
          localStorage.setItem("user", JSON.stringify(result.data.user)); // Save user info in local storage
          history("/");
        } else {
          toast.error("Login Failed! ");
        }
        setLoader(false); // Stop loader after processing the result
        setTimeout(() => {
          dispatch(resetRegisterFlag());
        }, 3000);
      })
    );

    // toast.success("Login Successfully!");
    history("/"); // Redirect to homepage
  };

  const signup = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: (error) => console.error(error),
  });

  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Please Enter Your First Name").matches(/^\S+$/, "No spaces allowed"),
      lastname: Yup.string().required("Please Enter Your Last Name").matches(/^\S+$/, "No spaces allowed"),
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Please include an @ in the email address"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(RegExp("(.*[a-z].*)"), "At least lowercase letter")
        .matches(RegExp("(.*[A-Z].*)"), "At least uppercase letter")
        .matches(/[@$!%*?&]/, "At least one special character")
        .matches(RegExp("(.*[0-9].*)"), "At least one number")
        .matches(/^\S+$/, "No spaces allowed")
        .required("Please Enter Passward"),
    }),
    onSubmit: (values) => {
      if (isCaptchaVerified && validation.isValid) {
        localStorage.setItem("formSubmitted", "true"); // Store submission state
        dispatch(registerUser(values, (result: any) => {}));
        setLoader(true);
      } else {
        toast.error("Please verify the reCAPTCHA!");
      }
    },
  });

  const selectLayoutState = (state: any) => state.Account;
  const registerdatatype = createSelector(selectLayoutState, (account) => ({
    success: account.success,
    error: account.error,
  }));
  // Inside your component
  const { error, success } = useSelector(registerdatatype);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        history("/");
        setLoader(false); // Stop loader on success
      }, 3000);
    }

    if (error) {
      setLoader(false); // Stop loader on error
    }

    // Reset register flag after the response
    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, error, history]);

  const onCaptchaChange = (value: string | null) => {
    setIsCaptchaVerified(value !== null);
  };

  return (
    <React.Fragment>
      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={6} lg={5}>
                <Card className="overflow-hidden m-0">
                  <Row className="justify-content-center g-0">
                    <Col lg={12}>
                      <div className="p-lg-5 p-4">
                        <div>
                          <h5 className="text-primary">Register Account</h5>
                          <p className="text-muted">
                            Create your Shear Brilliance Hair Studio.
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
                            action="#"
                          >
                            {success && success ? (
                              <>
                                {toast("Your Redirect To Home Page...", {
                                  position: "top-right",
                                  hideProgressBar: false,
                                  className: "bg-success text-white",
                                  progress: undefined,
                                  toastId: "",
                                })}
                                <ToastContainer autoClose={2000} limit={1} />
                                <Alert color="success">
                                  Register User Successfully and Your Redirect
                                  To Home Page...
                                </Alert>
                              </>
                            ) : null}

                            {error && error ? (
                              <Alert color="danger">
                                <div>
                                  Email has been Register Before, Please Use
                                  Another Email Address...{" "}
                                </div>
                              </Alert>
                            ) : null}

                            <div className="mb-3">
                              <label htmlFor="firstname" className="form-label">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Input
                                type="text"
                                className="form-control"
                                id="firstname"
                                placeholder="Enter Firstname"
                                name="firstname"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firstname || ""}
                                invalid={
                                  validation.touched.firstname &&
                                  validation.errors.firstname
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.firstname &&
                              validation.errors.firstname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.firstname}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <label htmlFor="lastname" className="form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <Input
                                type="text"
                                className="form-control"
                                id="laststname"
                                placeholder="Enter Lastname"
                                name="lastname"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.lastname || ""}
                                invalid={
                                  validation.touched.lastname &&
                                  validation.errors.lastname
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.lastname &&
                              validation.errors.lastname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.lastname}
                                </FormFeedback>
                              ) : null}
                            </div>

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

                            <div className="mb-3">
                              <label
                                className="form-label"
                                htmlFor="password-input"
                              >
                                Password
                              </label>
                              <div className="position-relative auth-pass-inputgroup">
                                <Input
                                  type={passwordShow ? "text" : "password"}
                                  className="form-control pe-5 password-input"
                                  placeholder="Enter password"
                                  id="password-input"
                                  name="password"
                                  value={validation.values.password}
                                  onBlur={validation.handleBlur}
                                  onChange={validation.handleChange}
                                  invalid={
                                    validation.errors.password &&
                                    validation.touched.password
                                      ? true
                                      : false
                                  }
                                />
                                {validation.errors.password &&
                                validation.touched.password ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.password}
                                  </FormFeedback>
                                ) : null}
                                <Button
                                  color="link"
                                  onClick={() => setPasswordShow(!passwordShow)}
                                  className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                  type="button"
                                  id="password-addon"
                                >
                                  <i className="ri-eye-fill align-middle"></i>
                                </Button>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="mb-0 fs-12 text-muted fst-italic">
                                By registering you agree to the Shear brilliance{" "}
                                <Link to="/term-conditions"
                                  className="text-primary text-decoration-underline fst-normal fw-medium"
                                >
                                  Terms of Use
                                </Link>
                              </p>
                            </div>

                            <div
                              id="password-contain"
                              className="p-3 bg-light mb-2 rounded"
                            >
                              <h5 className="fs-13">Password must contain:</h5>
                              <p
                                id="pass-length"
                                className="invalid fs-12 mb-2"
                              >
                                Minimum <b>8 characters</b>
                              </p>
                              <p id="pass-lower" className="invalid fs-12 mb-2">
                                At <b>lowercase</b> letter (a-z)
                              </p>
                              <p id="pass-upper" className="invalid fs-12 mb-2">
                                At least <b>uppercase</b> letter (A-Z)
                              </p>
                              <p
                                id="pass-number"
                                className="invalid fs-12 mb-0"
                              >
                                A least <b>number</b> (0-9)
                              </p>
                            </div>

                            <div className="mt-4">
                              {/* reCAPTCHA will be shown after clicking Sign Up */}
                              {(
                                <ReCAPTCHA
                                  sitekey="6Ldnys4qAAAAANEgFIorhaQ4EncrEcIRzuzmIR4r"
                                  onChange={onCaptchaChange} 
                                />
                              )}
                              <div className="mt-4">
                                <Button
                                  color="success"
                                  className="w-100"
                                  type="submit"
                                  disabled={loader || !isCaptchaVerified || !validation.isValid}
                                >
                                  {loader && (
                                    <Spinner size="sm" className="me-2">
                                      {" "}
                                      Loading...{" "}
                                    </Spinner>
                                  )}
                                  Sign Up
                                </Button>
                              </div>
                            </div>

                            {/* Google Login Section */}
                            <div className="mt-4 text-center">
                              <div className="signin-other-title">
                                <h5 className="fs-13 mb-4 title text-muted">
                                  Create account with
                                </h5>
                              </div>

                              <div>
                                {/* Google Login Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent any undesired bubbling or default behavior
                                    signup(); // Call the Google signup function
                                  }}
                                  className="btn btn-danger btn-icon waves-effect waves-light me-1"
                                >
                                  <i className="ri-google-fill fs-16"></i>
                                </button>
                              </div>
                            </div>
                          </Form>
                        </div>

                        <div className="mt-5 text-center">
                          <p className="mb-0">
                            Already have an account ?{" "}
                            <Link to="/signin"
                              className="fw-semibold text-primary text-decoration-underline"
                            >
                              {" "}
                              Signin
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
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <p className="mb-0">
                    {new Date().getFullYear()} Shear Brilliance Hair Studio.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default CoverSignUp;
