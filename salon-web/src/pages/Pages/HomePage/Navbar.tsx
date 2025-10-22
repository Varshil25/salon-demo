import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Scrollspy from "react-scrollspy";
import {
  Collapse,
  Container,
  NavbarToggler,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks to get state and dispatch actions
import LogoDark from "../../../assets/images/home_page/SHEAR BRILLIANCE.png";
import LogoLight from "../../../assets/images/home_page/SHEAR BRILLIANCE.png";
import "./homepage.css";
import { createSelector } from "@reduxjs/toolkit";
import { logoutUser } from "slices/auth/login/thunk";
import { UserAppointment } from "Services/appointment";
import { setAuthorization } from "helpers/api_helper";
import { Getappointmentscategory } from "Services/SalonServices";

interface Appointment {
  id: number;
  UserId: number;
  BarberId: number;
  SalonId: number;
  number_of_people: number;
  status: string;
  estimated_wait_time: number;
  queue_position: number;
  device_id: string;
  check_in_time: string;
  complete_time: string;
  mobile_number: string;
  name: string;
}

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [navClass, setNavClass] = useState<string>("");
  const [activeLink, setActiveLink] = useState<string>(location.pathname);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // For dropdown

  const dispatch: any = useDispatch(); // Dispatch hook for Redux actions

  const [isNavAppointmentActive, setNavAppointmentActive] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [showAppointment, setShowAppointment] = useState(false);
  const [buttonText, setButtonText] = useState("Book Now");   // Loading...

  // Redux selector for getting user login data
  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state?.Login?.user, // Ensure state.Login holds user info after login
  }));

  // Fetching user data from Redux store
  const { user } = useSelector(loginpageData);
  const firstName = user?.data?.user?.firstname || ""; // Get the first name if available

  // Toggle function for mobile menu
  const toggle = () => setIsOpenMenu(!isOpenMenu);

  // Toggle function for user dropdown
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleLogout = () => {
    // Remove user data from local storage
    // Optionally, reset the Redux store or update the state
    // This can be achieved by dispatching a specific action if needed
    dispatch(logoutUser()); // If you still want to use this to reset the Redux state

    // Redirect to the desired page after logout (e.g., home page or login page)
    window.location.href = "/"; // Redirect to sign-in page or another page as necessary
  };
  const [isAppointmentActive, setIsAppointmentActive] = useState(false);
  // Add/remove sticky class on scroll
  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
    return () => {
      window.removeEventListener("scroll", scrollNavigation, true);
    };
  }, []);

  // Update active link based on current route
  const [isLoading, setIsLoading] = useState(true);
  const category = 2;

  useEffect(() => {
    const fetchAppointmentStatus = async () => {
      setIsLoading(true);
      try {
        if (!user || !user.data || !user.data.user.id) {
          console.error("User data is not available yet.");
          setIsLoading(false);
          return;
        }

        const token = user.data.token || localStorage.getItem("authToken");
        if (!token) {
          console.error("Authentication token is missing.");
          setIsLoading(false);
          return;
        }

        // Set token in Axios headers
        setAuthorization(token);

        // Set category as 2 statically
        const category = 2;

        // Make the API call with the static category value of 2
        const response = await Getappointmentscategory(category);
        const data: any = response;

        if (data.success && data.data.length > 0) {
          const appointmentData = data.data[0]; // Get the first appointment

          if (appointmentData.status === "checked_in") {
            // If the appointment is checked-in, set button to "Check In"
            setIsAppointmentActive(true);
            setAppointmentData(appointmentData);
            setButtonText("View Checkin");
          }
        } else {
          // If no appointment found, show "Book Appointment"
          setIsAppointmentActive(false);
          setButtonText("Book Now");
        }
      } catch (error) {
        console.error("Error fetching appointment status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAppointmentStatus();
    }
  }, [user]);

  const scrollNavigation = () => {
    const scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setNavClass(" is-sticky");
    } else {
      setNavClass("");
    }
  };

  const isHomePage = location.pathname === "/";

  const handleButtonClick = () => {
    if (!user || !user.data || !user.data.token) {
      // If the user is not logged in, redirect to the login page
      // window.location.href = "/signin";
      navigate('/signin');
      return;
    }
    if (isAppointmentActive && appointmentData) {
      // If an active appointment exists, redirect to the check-in confirmation page
      const stateId = appointmentData.id;
      // window.location.href = `/checkinconfirmation/${appointmentId}`;
      navigate(`/checkinconfirmation`, { state: { stateId } });
    } else {
      // Redirect to the check-in page if no active appointment
      // window.location.href = "/select_salon";
      navigate('/select_salon');
    }
  };

  // const handleButtonClick = () => {
  //   if (!user || !user.data || !user.data.token) {
  //     // If the user is not logged in, redirect to the login page
  //     window.location.href = "/signin";
  //     return;
  //   }

  //   // Redirect to the salon selection page
  //   window.location.href = "/select_salon";
  // };

  const navItemLabels = {
    "/": "Home",
    "/services": "Services",
    "/price": "Pricing",
    "/gallery": "Gallery",
    "/contactus": "Contact Us",
    "/aboutus": "About Us",
    "/Blogs": "Blogs",
  } as const;

  return (
    <React.Fragment>
      <nav
        className={
          "navbar navbar-expand-lg navbar-landing fixed-top job-navbar" +
          (isHomePage ? navClass : " is-sticky")
        }
        id="navbar"
      >
        <Container fluid className="custom-container">
          <Link className="navbar-brand" to="/" style={{ padding: "0px" }}>
            <img
              src={LogoDark}
              className="card-logo card-logo-dark"
              alt="logo dark"
              height="50"
            />
            <img
              src={LogoLight}
              className="card-logo card-logo-light"
              alt="logo light"
              height="50"
            />
          </Link>

          {/* Navbar Toggler for mobile */}
          <NavbarToggler
            onClick={toggle}
            className="navbar-toggler py-0 fs-20 text-body"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="mdi mdi-menu"></i>
          </NavbarToggler>

          {/* Collapsible navbar content */}
          <Collapse
            className="navbar-collapse"
            id="navbarSupportedContent"
            isOpen={isOpenMenu}
          >
            <Scrollspy
              offset={-18}
              items={[
                "hero",
                "service",
                "price",
                "gallery",
                "aboutus",
                "contact",
                "Blogs",
              ]}
              currentClassName="active"
              className="navbar-nav mx-auto mt-2 mt-lg-0"
              id="navbar-example"
            >
              {(
                [
                  "/",
                  "/services",
                  "/price",
                  "/gallery",
                  "/contactus",
                  "/aboutus",
                  "/Blogs",
                ] as (keyof typeof navItemLabels)[]
              ).map((path, index) => (
                <li className="nav-item" key={index}>
                  <NavLink
                    className={`fs-16 mt-2 cursor-pointer ${
                      activeLink === path ? "active" : ""
                    }`}
                    activeClassName="active"
                    to={path}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent full page reload
                      navigate(path); // Use React Router's navigation
                      setActiveLink(path);
                    }}
                  >
                    {navItemLabels[path]}
                  </NavLink>
                </li>
              ))}
            </Scrollspy>

            <div className="nav_button ">
             {/* Render "Book Now" button only if the user is logged in */}
              {user && user.data && user.data.token && (
                <button
                  onClick={handleButtonClick}
                  className="navbar_btn me-2 rounded-3"
                >
                  {buttonText}
                </button>
              )}
              {/* Display appointment data if showAppointment is true */}
              {showAppointment && appointmentData && (
                <div className="appointment-details">
                  {/* Additional appointment details here */}
                </div>
              )}
            </div>

            {/* User section - Show first name with dropdown if logged in, otherwise Login/Register */}
            <div className="nav_button">
              {firstName ? (
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle className="navbar_btn" caret>
                    <i className="ri-user-3-line align-bottom me-1"></i>{" "}
                    {firstName}
                  </DropdownToggle>
                  <DropdownMenu>
                    <Dropdown>
                      <Link className="dropdown-item" to="/viewprofile">
                        View Profile
                      </Link>
                    </Dropdown>
                    <Dropdown>
                      <Link className="dropdown-item" to="/favourite">
                        Favorites
                      </Link>
                    </Dropdown>
                    <Dropdown>
                      <Link className="dropdown-item" to="/pastappointment">
                        View Appointments
                      </Link>
                    </Dropdown>
                    <DropdownItem
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Link to="/signin" className="navbar_btn">
                  <i className="ri-user-3-line align-bottom me-1"></i> Login &
                  Register
                </Link>
              )}
            </div>
          </Collapse>
        </Container>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
