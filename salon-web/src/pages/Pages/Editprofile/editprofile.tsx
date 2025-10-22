import React, { useState, useEffect } from "react";
import { getProfile, postProfile } from "Services/AuthService";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Label,
  Form,
} from "reactstrap";

import DefaultProfilephoto from "../../../assets/images/viewprofile/defaultprofile.png";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import "./editprofile.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderInner from "Components/Common/LoaderInner";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "slices/auth/login/reducer";

const ViewProfile: React.FC = () => {
  const initialData = {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    profile_photo: "",
  };

  const [userData, setUserData] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);
  const [editField, setEditField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [profileImage, setProfilePhoto] = useState(DefaultProfilephoto);
  const [errors, setErrors] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state?.Login?.user, // Ensure state.Login holds user info after login
  }));
  const dispatch: any = useDispatch();

  // Fetching user data from Redux store
  const { user } = useSelector(loginpageData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        setIsLoading(true);
        if (response && response.data && response.data.mobile_number) {
          response.data.mobile_number = formatPhoneNumber(
            response.data.mobile_number
          );
        }
        setUserData(response.data);
        setIsLoading(false);
        // Set initial profile image from API if available
        setProfilePhoto(response.data.profile_photo || DefaultProfilephoto);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    setTempData(userData);
  }, [userData]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\(\d{3}\)) \d{3}-\d{4}$/; // US/Canada phone format (XXX) XXX-XXXX
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value: string | undefined) => {
    // Remove all non-numeric characters
    const numericValue = value?.replace(/\D/g, "") || "";

    // If there are no numbers, return an empty string
    if (numericValue?.length === 0) return "";

    // If the number starts with '1' (country code), format the local part
    if (numericValue?.startsWith("1")) {
      const localNumber = numericValue?.slice(1); // Remove the leading '1'

      // Format if the local number has enough digits
      if (localNumber?.length <= 3) return `(${localNumber}`;
      if (localNumber?.length <= 6)
        return `(${localNumber?.slice(0, 3)}) ${localNumber?.slice(3)}`;
      return `(${localNumber?.slice(0, 3)}) ${localNumber?.slice(
        3,
        6
      )}-${localNumber?.slice(6, 10)}`;
    }

    // Format the number without the leading '1' in the local number
    if (numericValue?.length <= 3) return `(${numericValue}`;
    if (numericValue?.length <= 6)
      return `(${numericValue?.slice(0, 3)}) ${numericValue?.slice(3)}`;
    return `(${numericValue?.slice(0, 3)}) ${numericValue?.slice(
      3,
      6
    )}-${numericValue?.slice(6, 10)}`;
  };

  const handleSave = async () => {
    if (!tempData.firstname.trim() || !tempData.lastname.trim()) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        firstname: !tempData.firstname.trim()
          ? "This field cannot be empty."
          : undefined,
        lastname: !tempData.lastname.trim()
          ? "This field cannot be empty."
          : undefined,
      }));
      return;
    }

    if (!validatePhoneNumber(tempData.mobile_number)) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        mobile_number:
          "Please enter a valid mobile number in the format (XXX) XXX-XXXX",
      }));
      return;
    }

    // Ensure the phone number starts with '+1' and is formatted correctly
    let formattedPhoneNumber = tempData.mobile_number?.replace(/\D/g, ""); // Remove non-numeric characters
    // Store the phone number with +1 prefix if it doesn't already have one
    if (
      !formattedPhoneNumber?.startsWith("1") &&
      formattedPhoneNumber?.length === 10
    ) {
      formattedPhoneNumber = `+1${formattedPhoneNumber}`;
    }
    // Format the phone number for display
    const displayPhoneNumber = formatPhoneNumber(formattedPhoneNumber);

    const formData = new FormData();
    formData.append("id", tempData.id);
    formData.append("firstname", tempData.firstname);
    formData.append("lastname", tempData.lastname);
    formData.append("email", tempData.email);
    formData.append("mobile_number", formattedPhoneNumber);

    // Add profile_photo if a file was selected
    if (selectedFile) {
      formData.append("profile_photo", selectedFile);
    }

    try {
      const res: any = await postProfile(tempData.id, formData);
      if (res && res.data && res.data.mobile_number) {
        res.data.mobile_number = formatPhoneNumber(res.data.mobile_number);
      }
      const updatedUserData = res.data;

      // Update Redux store and local state
      let tempUserData = structuredClone(user);
      tempUserData.data.user = updatedUserData;
      localStorage.setItem("authUser", JSON.stringify(tempUserData));
      dispatch(loginSuccess(tempUserData));

      setUserData(updatedUserData);
      setTempData(updatedUserData);

      // Update profile photo from server response
      if (updatedUserData.profile_photo) {
        setProfilePhoto(updatedUserData.profile_photo);
      }

      setEditField(null);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000, // Auto close after 5 seconds
            hideProgressBar: true,
          }
        );
        return; // Stop the upload process
      }
      // Check if the file size is greater than 2MB
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > MAX_SIZE) {
        // Show error message using Toastify if the file is too large
        toast.error(
          "The image file is too large. Please upload an image under 2MB.",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000, // Auto close after 5 seconds
            hideProgressBar: true,
          }
        );
        return; // Stop the upload process
      }

      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;

        // Update tempData and profileImage for preview
        setTempData((prevData: any) => ({
          ...prevData,
          profile_photo: previewUrl,
        }));

        setProfilePhoto(previewUrl);
      };

      reader.readAsDataURL(file);

      // Save file to selectedFile for backend submission
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };

  const toggleEditField = (field: any) => {
    setEditField(field);
  };

  const validate = () => {
  const newErrors: any = {};

  // Validate firstname
  if (!tempData.firstname) {
    newErrors.firstname = "First name is required";
  } else if (/\s/.test(tempData.firstname)) {
    newErrors.firstname = "First name should not contain spaces";
  }

  // Validate lastname
  if (!tempData.lastname) {
    newErrors.lastname = "Last name is required";
  } else if (/\s/.test(tempData.lastname)) {
    newErrors.lastname = "Last name should not contain spaces";
  }

  // Validate email
  if (!tempData.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(tempData.email)) {
    newErrors.email = "Email is invalid";
  } else if (/\s/.test(tempData.email)) {
    newErrors.email = "Email should not contain spaces";
  }

  // Validate mobile_number
  if (!tempData.mobile_number)
    newErrors.mobile_number = "Mobile number is required";
  else if (!validatePhoneNumber(tempData.mobile_number))
    newErrors.mobile_number = "Please enter a valid mobile number";

  setErrors(newErrors);
  return Object.keys(newErrors)?.length === 0;
};

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validate()) {
      handleSave();
    }
  };

  const handleMobileChange = (e: any) => {
    const rawValue = e.target.value || "";
    const formattedValue = formatPhoneNumber(rawValue);
    setTempData((prevData) => ({
      ...prevData,
      mobile_number: formattedValue,
    }));
  };

  return (
    <React.Fragment>
      {isLoading && <LoaderInner />}
      <Navbar />
      <Container
        style={{ marginTop: "90px", marginBottom: "40px" }}
        className="form-control"
      >
        <Row className="justify-content-center my-4">
          {/* <Col xs="12" md="12" className="text-center">
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={tempData?.profile_photo || DefaultProfilephoto}
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  ...(window.innerWidth <= 768
                    ? { width: "100px", height: "100px" }
                    : {}),
                }}
              />
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .heic, .heif"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="fileInput"
              />
              <Button
                onClick={() => document.getElementById("fileInput")?.click()}
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  padding: "6px 12px",
                }}
                className="profile-view-btn"
              >
                Upload New
              </Button> */}
              {/* <Button
                onClick={handleDeleteImage}
                style={{
                  marginTop: "5px",
                  fontSize: "14px",
                  padding: "6px 12px",
                }}
                className="delete-view-btn"
              >
                Delete Avatar
              </Button> */}
            {/* </div>
          </Col> */}
          <Col xs="12" md="12" className="text-center">
            <div className="text-center">
              {/* Profile image with upload button */}
              <div className="profile-user position-relative d-inline-block mx-auto">
                <img style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  ...(window.innerWidth <= 768
                    ? { width: "100px", height: "100px" }
                    : {}),
                }}
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : tempData?.profile_photo || DefaultProfilephoto
                  }
                  className="rounded-circle avatar-xl user-profile-image"
                  alt="Profile"
                />
                <div className="avatar-xs m-1 p-0 rounded-circle profile-photo-edit">
                  <Input
                    id="profile-img-file-input"
                    type="file"
                    className="profile-img-file-input"
                    onChange={handleImageUpload} // Handle image upload
                    accept="image/*" // Allow only images
                  />
                  <Label
                    htmlFor="profile-img-file-input"
                    className="profile-photo-edit avatar-xs"
                  >
                    <span className="avatar-title rounded-circle bg-light text-body">
                      <i className="ri-camera-fill"></i>
                    </span>
                  </Label>
                </div>
              </div>

              {/* User information */}
              <h5 className="fs-16 mb-1">
                {user?.firstname} {user?.lastname}
              </h5>
              <p className="text-muted mb-0">{user?.role?.role_name}</p>
            </div>
          </Col>
          {/* {Toast container to render notifications } */}
          <ToastContainer />

          <Col xs="12" md="6" className="mt-4">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="firstname">First Name</Label>
                    <Input
                      type="text"
                      id="firstname"
                      value={userData.firstname}
                      onChange={handleInputChange}
                      readOnly={editField !== "firstname"}
                      required
                      style={{ marginBottom: "10px", cursor: "pointer" }}
                      onFocus={() => toggleEditField("firstname")}
                    />
                    {errors.firstname && (
                      <small className="text-danger">{errors.firstname}</small>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      type="text"
                      id="lastname"
                      value={userData.lastname}
                      onChange={handleInputChange}
                      readOnly={editField !== "lastname"}
                      required
                      style={{ marginBottom: "10px", cursor: "pointer" }}
                      onFocus={() => toggleEditField("lastname")}
                    />
                    {errors.lastname && (
                      <small className="text-danger">{errors.lastname}</small>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      value={tempData.email}
                      onChange={handleInputChange}
                      required
                      disabled // Add this attribute to disable editing
                      style={{ marginBottom: "10px" }}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="input-group">
                      <div className="input-group-prepend"></div>
                      <Input
                        type="text"
                        id="mobile"
                        value={formatPhoneNumber(tempData.mobile_number)}
                        onChange={handleMobileChange} // Handle mobile input change
                        readOnly={editField !== "mobile"}
                        required
                        maxLength={14} // Adjusted to exclude the prefix
                        style={{ marginBottom: "10px", cursor: "pointer" }}
                        onFocus={() => toggleEditField("mobile")}
                      />
                    </div>
                    {errors.mobile_number && (
                      <small className="text-danger">
                        {errors.mobile_number}
                      </small>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-center">
                <Button
                  color="success"
                  type="submit"
                  style={{ width: "200px" }}
                >
                  Save Changes
                </Button>
                {isSaved && <div className="text-success mt-3">Saved!</div>}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default ViewProfile;
