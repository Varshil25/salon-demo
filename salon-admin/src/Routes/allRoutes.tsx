import React, { Component } from "react";
import { Navigate } from "react-router-dom";

// //Forms
import BasicElements from "../pages/Forms/BasicElements/BasicElements";
import FormSelect from "../pages/Forms/FormSelect/FormSelect";
import FormEditor from "../pages/Forms/FormEditor/FormEditor";
import CheckBoxAndRadio from "../pages/Forms/CheckboxAndRadio/CheckBoxAndRadio";
import Masks from "../pages/Forms/Masks/Masks";
import FileUpload from "../pages/Forms/FileUpload/FileUpload";
import FormPickers from "../pages/Forms/FormPickers/FormPickers";
import FormRangeSlider from "../pages/Forms/FormRangeSlider/FormRangeSlider";
import Formlayouts from "../pages/Forms/FormLayouts/Formlayouts";
import FormValidation from "../pages/Forms/FormValidation/FormValidation";
import FormWizard from "../pages/Forms/FormWizard/FormWizard";

import Select2 from "../pages/Forms/Select2/Select2";

// //Tables
import CustomerTable from "pages/Pages/Admin/Customer";
import UserTable from "../pages/Pages/Admin/User";
import BarberTable from "pages/Pages/Admin/Barbers";
import SalonTable from "pages/Pages/Admin/Salon";
import RoleTable from "pages/Pages/Admin/Role";
import AppointmentTable from "pages/Pages/Admin/Appointments";
import BlogTable from "pages/Pages/Admin/Blog";
import FavoriteSalonTable from "pages/Pages/Admin/FavoriteSalon";
import Board from "pages/Pages/Admin/Board";
import HaircutDetail from "pages/Pages/Admin/HaircutDetail";
import OurService from "pages/Pages/Admin/OurService";

// //AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";
// //pages
import Starter from "../pages/Pages/Starter/Starter";

import Settings from "../pages/Pages/Profile/Settings/Settings";
import Team from "../pages/Pages/Team/Team";
import Timeline from "../pages/Pages/Timeline/Timeline";
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
import Cover401 from "../pages/AuthenticationInner/Errors/Cover401";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";


import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

// //APi Key
import APIKey from "../pages/APIKey/index";

// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";


// // User Profile
import UserProfile from "../pages/Authentication/user-profile";

import FileManager from "../pages/FileManager";
import ToDoList from "../pages/ToDo";
import DashboardEcommerce from "pages/DashboardEcommerce";
//import { components } from "react-select";


// //Task
import TaskDetails from "../pages/Tasks/TaskDetails";
import TaskList from "../pages/Tasks/TaskList";
import Kanbanboard from "pages/Tasks/KanbanBoard";
import PrivacyPolicy from "pages/Pages/PrivacyPolicy";
import TermsCondition from "pages/Pages/TermsCondition";
import Notification from "pages/Authentication/Notification";
import Salonappointment from "pages/Pages/Admin/Insalonappointment";
import BarberSessions from "pages/Pages/Admin/BarberSessions";


const authProtectedRoutes = [
  { path: "/apps-file-manager", component: <FileManager /> },
  { path: "/apps-todo", component: <ToDoList /> },


  // //Task
  { path: "/apps-tasks-kanban", component: <Kanbanboard /> },
  { path: "/apps-tasks-list-view", component: <TaskList /> },
  { path: "/apps-tasks-details", component: <TaskDetails /> },

  // //Api Key
  { path: "/apps-api-key", component: <APIKey /> },

  // // Forms
  { path: "/forms-elements", component: <BasicElements /> },
  { path: "/forms-select", component: <FormSelect /> },
  { path: "/forms-checkboxes-radios", component: <CheckBoxAndRadio /> },
  { path: "/forms-pickers", component: <FormPickers /> },
  { path: "/forms-masks", component: <Masks /> },

  { path: "/forms-range-sliders", component: <FormRangeSlider /> },
  { path: "/forms-validation", component: <FormValidation /> },
  { path: "/forms-wizard", component: <FormWizard /> },
  { path: "/forms-editors", component: <FormEditor /> },
  { path: "/forms-file-uploads", component: <FileUpload /> },
  { path: "/forms-layouts", component: <Formlayouts /> },
  { path: "/forms-select2", component: <Select2 /> },

  //Tables
  { path: "/customer-table", component: <CustomerTable />, allowedRoles: ["Admin", "Salon Owner"] },  // Only admins can access},
  { path: "/user-table", component: <UserTable />, allowedRoles: ["Admin"] },
  { path: "/barber-table", component: <BarberTable />, allowedRoles: ["Admin", "Salon Owner"] },
  { path: "/barber-schedule", component: <BarberSessions />, allowedRoles: ["Admin", "Salon Owner"] },
  { path: "/salon-table", component: <SalonTable />, allowedRoles: ["Admin"] },
  { path: "/role-table", component: <RoleTable />, allowedRoles: ["Admin"] },
  { path: "/appointment-table", component: <AppointmentTable />, allowedRoles: ["Admin", "Barber", "Salon Owner"] },
  { path: "/blog-table", component: <BlogTable />, allowedRoles: ["Admin"] },
  { path: "/Insalon-table", component: <Salonappointment />, allowedRoles: ["Admin", "Salon Owner"] },
  { path: "/favorite-salon-table", component: <FavoriteSalonTable /> },
  { path: "/board-table", component: <Board />, allowedRoles: ["Admin", "Barber", "Salon Owner"] },
  { path: "/haircut-details-table", component: <HaircutDetail /> },
  { path: "/service-table", component: <OurService />, allowedRoles: ["Admin"] },

  // //Pages
  { path: "/pages-starter", component: <Starter /> },
  { path: "/pages-profile-settings", component: <Settings />, allowedRoles: ["Admin", "Barber", "Salon Owner"] },
  { path: "/pages-team", component: <Team />, allowedRoles: ["Admin", "Barber", "Salon Owner"] },
  { path: "/pages-timeline", component: <Timeline /> },
  { path: "/pages-faqs", component: <Faqs /> },

  { path: "/pages-privacy-policy", component: <PrivacyPolicy />, allowedRoles: ["Admin", "Barber", "Salon Owner"]  },
  { path: "/termscondition", component: <TermsCondition /> , allowedRoles: ["Admin", "Barber", "Salon Owner"] },


  //User Profile
  { path: "/profile", component: <UserProfile />, allowedRoles: ["Admin", "Barber", "Salon Owner"] },
  { path: "/dashboard", component: <DashboardEcommerce />, allowedRoles: ["Admin", "Barber", "Salon Owner"] },
  { path: "/notification", component: < Notification/>, allowedRoles: ["Admin", "Barber", "Salon Owner"] },
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  { path: "/access-denied", component: <Cover401 /> },

  // //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
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
  { path: "/auth-401-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },


  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },

  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-coming-soon", component: <ComingSoon /> },
];

export { authProtectedRoutes, publicRoutes };
