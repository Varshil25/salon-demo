import React from "react";
import { Navigate } from "react-router-dom";

// //AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";
// //pages
import Starter from "../pages/Pages/Starter/Starter";

import Faqs from "../pages/Pages/Faqs/Faqs";

import Maintenance from "../pages/Pages/Maintenance/Maintenance";
import ComingSoon from "../pages/Pages/ComingSoon/ComingSoon";

import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
import BasicLogout from "pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

//Landing Page
import JobLanding from "../pages/Pages/HomePage";

// // User Profile
import UserProfile from "../pages/Authentication/user-profile";
// Servies
import Services_index from "pages/Pages/Services";
// Gallery
import Gallery_index from "pages/Pages/Gallery";
// Pricing
import Pricing_index from "pages/Pages/Pricing";
// About Us
import Index_Aboutus from "pages/Pages/About";
// Ajax Barber
import Ajaxbarber from "pages/Pages/About/Ajaxbarber";
import Oshwabarber from "pages/Pages/About/Oshawa";
import Pickeringbarber from "pages/Pages/About/Pickeringbarber";
// Contact Us
import Contactus_index from "pages/Pages/Contactus";
// Check In
import Checkin_index from "pages/Pages/Checkin";

//Check In Information
import Checkin_details from "pages/Pages/Checkin/checkin_details";

// Check In Form
import Checkin_form from "pages/Pages/Checkin/checkin_form";
import Profile from "pages/Pages/About/Profile";

// Check In confirmation
import CheckInConfirmation from "pages/Pages/Checkin/checkin_confirmation";

// Waitlist Popup
import WaitlistPopup from "pages/Pages/Checkin/Popup/WaitlistPopup";
import Popupindex from "pages/Pages/Checkin/Popup";
import Blog_List from "pages/Pages/Blog/Blog_List";
import Blog_detail from "pages/Pages/Blog/Blog_detail";
import PrivacyPolicy from "pages/Pages/PrivacyPolicy/Privacy Policy";
import TermsCondition from "pages/Pages/TermsCondition/Terms&Condition";
import Favourite from "pages/Pages/Favourite/favourite";
import ViewProfile from "pages/Pages/Editprofile/editprofile";
import Errorpage from "pages/Pages/ErrorPage/errorpage";
import PastAppointments from "pages/Pages/PastAppointments/PastAppointments";
import SelectServices from "pages/Pages/Appointment/selectServices";
import SelectBarber from "pages/Pages/Appointment/selectBarber";
import SelectDate from "pages/Pages/Appointment/selectDateandTime";
import Appointment_form from "pages/Pages/Appointment/appointment_form";
import Confirmationloader from "Components/Common/Confirmationloader";
import Appointment_Confirmation from "pages/Pages/Appointment/appointment_confirmation";

const authProtectedRoutes = [
  // //Pages
  { path: "/pages-starter", component: <Starter /> },

  { path: "/pages-faqs", component: <Faqs /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  { path: "/", component: <JobLanding /> },
  // Services Page
  { path: "/services", component: <Services_index /> },
  // Gallery Page
  { path: "/gallery", component: <Gallery_index /> },
  // Pricing Page
  { path: "/price", component: <Pricing_index /> },
  // About Us
  { path: "/aboutus", component: <Index_Aboutus /> },
  // Ajax Barber
  { path: "/aboutus/Ajax-Barbers", component: <Ajaxbarber /> },
  // Oshawa Barber
  { path: "/aboutus/Oshawa-Barber", component: <Oshwabarber /> },
  // Pickering Barber
  { path: "/aboutus/Pickering-Barbers", component: <Pickeringbarber /> },
  // Contact Us
  { path: "/contactus", component: <Contactus_index /> },

  // Favourite
  { path: "/favourite", component: <Favourite /> },

  // PastAppointment
  { path: "/pastappointment", component: <PastAppointments /> },

  // Check In
  { path: "/select_salon", component: <Checkin_index /> },
  // View Profile
  { path: "/profile", component: <Profile /> },
  //Check In Information Page
  { path: "/salon_information", component: <Checkin_details /> },
  // Blog Page
  { path: "/Blogs", component: <Blog_List /> },
  // Blog Details
  { path: "/blog_details/:id", component: <Blog_detail /> }, // Use :id to indicate a dynamic parameter

  // Check In Form
  { path: "/checkinform", component: <Checkin_form /> },

  //Edit & View Profile
  { path: "/viewprofile", component: <ViewProfile /> },

  // Check In confirmation
  { path: "/checkinconfirmation", component: <CheckInConfirmation /> },

  // Waitlist Popup
  { path: "/waitlistpopup", component: <Popupindex /> },

  // Appointment Service Select
  { path: "/select_services", component: <SelectServices /> },

  //Appointment Select Barbers
  { path: "/select_barbers", component: <SelectBarber /> },

  //Appointment Select Time and Date
  { path: "/select_date_time", component: <SelectDate /> },

  //Appointment Form
  { path: "/appointment_form", component: <Appointment_form /> },

  //Appointment Confirmation
  {
    path: "/appointment_confirmation/:id?",
    component: <Appointment_Confirmation />,
  },

  //Appointment Loader
  { path: "/appointment_loader", component: <Confirmationloader /> },

  // Pricacy Policy
  { path: "/privacy-policy", component: <PrivacyPolicy /> },
  // Term & condition
  { path: "/term-conditions", component: <TermsCondition /> },

  // Error Page 404
  // { path: "/error-404", component: <Errorpage /> },

  // Catch-all route for 404 - must be last
  { path: "*", component: <Errorpage /> },

  { path: "/profile/:name", component: <Profile /> },

  // //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/signin", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/signup", component: <CoverSignUp /> },
  { path: "/reset-password", component: <BasicPasswCreate /> },

  { path: "/forgotpassword", component: <BasicPasswReset /> },
  { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },

  //

  { path: "/reset-password?token=", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },

  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-coming-soon", component: <ComingSoon /> },
];

export { authProtectedRoutes, publicRoutes };
