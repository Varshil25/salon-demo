import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Button,
  Spinner,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// action
import { registerUser, resetRegisterFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";
import Profile1 from "../../assets/images/about.jpg"; // Replace with your default image path

import { Link, useNavigate } from "react-router-dom";

//import images
import smallest from "../../assets/images/smallest.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";

const Register = () => {
  const history = useNavigate();
  const dispatch: any = useDispatch();
  const [loader, setLoader] = useState<boolean>(false);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      address: "",
      mobile_number: "",
      password: "",
      confirm_password: "",
      role_name: "",
      profile_photo: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      first_name: Yup.string().required("Please Enter Your First Name"),
      last_name: Yup.string().required("Please Enter Your Last Name"),
      address: Yup.string().required("Please Enter Your Address"),
      mobile_number: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be 10 digits")
        .required("Please Enter Your Mobile Number"),
      password: Yup.string().required("Please Enter Your Password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm Password is required"),
      role_name: Yup.string().required("Please Enter Your Role"),
      profile_photo: Yup.string().required("Please Upload Your Profile Photo"),
    }),

    onSubmit: (values) => {
      //dispatch(registerUser(values)); // Pass the form values as an argument
      setLoader(true);
    },
  });

  const selectLayoutState = (state: any) => state.Account;
  const registerdatatype = createSelector(selectLayoutState, (account) => ({
    success: account.success,
    error: account.error,
  }));

  const { error, success } = useSelector(registerdatatype);

  useEffect(() => {
    if (success) {
      setTimeout(() => history("/login"), 3000);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, error, history]);

  document.title = " SignUp | Shear Brilliance ";
  const [profileImage, setProfileImage] = useState<string | File>(Profile1); // Default image

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
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
                      <img src={smallest} alt="" height="100" />
                    </Link>
                  </div>
                  <p className="mt-3 fw-medium fs-3">Shear Brilliance Admin</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Create New Account</h5>
                      <p className="text-muted">
                        Get your free Shear Brilliance account now
                      </p>
                    </div>
                    <div className="p-2 mt-4">
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
                            {toast("Your Redirect To Login Page...", {
                              position: "top-right",
                              hideProgressBar: false,
                              className: "bg-success text-white",
                              progress: undefined,
                              toastId: "",
                            })}
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">
                              Register User Successfully and Your Redirect To
                              Login Page...
                            </Alert>
                          </>
                        ) : null}

                        {error && error ? (
                          <Alert color="danger">
                            <div>
                              Email has been Registered Before, Please Use
                              Another Email Address...
                            </div>
                          </Alert>
                        ) : null}
                        <div className="mb-3 text-center">
                          {/* Avatar Section */}
                          <div className="position-relative d-inline-block">
                            <div className="avatar-lg">
                              <img
                                src={Profile1}
                                alt="Profile"
                                className="avatar-md rounded-circle"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />
                            </div>
                            <Label
                              htmlFor="profile-image-input"
                              className="position-absolute bottom-0 end-0 cursor-pointer"
                            >
                              <div
                                className="avatar-xs rounded-circle bg-white p-1 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
                                  cursor: "pointer",
                                }}
                              >
                                <i
                                  className="ri-image-fill"
                                  style={{ color: "#000" }}
                                ></i>
                              </div>
                            </Label>
                            <Input
                              type="file"
                              id="profile-image-input"
                              className="d-none"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="useremail" className="form-label">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email address"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.email}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="firstname" className="form-label">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="first_name"
                            type="text"
                            placeholder="Enter First Name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.first_name || ""}
                            invalid={
                              validation.touched.first_name &&
                              validation.errors.first_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.first_name &&
                          validation.errors.first_name ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.first_name}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="lastname" className="form-label">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="last_name"
                            type="text"
                            placeholder="Enter Last Name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.last_name || ""}
                            invalid={
                              validation.touched.last_name &&
                              validation.errors.last_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.last_name &&
                          validation.errors.last_name ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.last_name}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="address" className="form-label">
                            Address <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="address"
                            type="text"
                            placeholder="Enter Address"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.address || ""}
                            invalid={
                              validation.touched.address &&
                              validation.errors.address
                                ? true
                                : false
                            }
                          />
                          {validation.touched.address &&
                          validation.errors.address ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.address}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="mobile_number" className="form-label">
                            Mobile Number <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="mobile_number"
                            type="text"
                            placeholder="Enter Mobile Number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.mobile_number || ""}
                            invalid={
                              validation.touched.mobile_number &&
                              validation.errors.mobile_number
                                ? true
                                : false
                            }
                          />
                          {validation.touched.mobile_number &&
                          validation.errors.mobile_number ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.mobile_number}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="role_name" className="form-label">
                            Role <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="role_name"
                            type="text"
                            placeholder="Enter Role"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.role_name || ""}
                            invalid={
                              validation.touched.role_name &&
                              validation.errors.role_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.role_name &&
                          validation.errors.role_name ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.role_name}</div>
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="password" className="form-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <Button
                            color="primary"
                            className="w-100"
                            type="submit"
                          >
                            {loader ? <Spinner size="sm" /> : "Register"}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Register;
