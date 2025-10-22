import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
  UncontrolledDropdown,
  DropdownItem,
  ButtonGroup,
} from "reactstrap";

//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";
import logonobackground from "../assets/images/logo-no-background.svg";
import {
  fetchSalons
} from "../Services/SalonService";
//import Components
import FullScreenDropdown from "../Components/Common/FullScreenDropdown";
import NotificationDropdown from "../Components/Common/NotificationDropdown";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import SalonStatusDropdown from "../Components/Common/StatusChange";
import BarberStatusDropdown from "../Components/Common/BarberChange";
import LightDark from "../Components/Common/LightDark";

import { changeSidebarVisibility } from "../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const Header = ({ onChangeLayoutMode, layoutModeType, storeRoleInfo, headerClass, userInfo, salonUserInfo,barberUserInfo, changeShowLoader }: any) => {
  const dispatch: any = useDispatch();
  const [isSalonOpen, setIsSalonOpen] = useState<boolean>(true);
  const [isBarberStatus, setBarberStatus] = useState<boolean>(true);

  const isSalonOwner = true;
  const isBarber = true;


  const selectDashboardData = createSelector(
    (state: any) => state.Layout,
    (sidebarVisibilitytype: any) => sidebarVisibilitytype.sidebarVisibilitytype
  );
  // Inside your component
  const sidebarVisibilitytype = useSelector(selectDashboardData);

  const [search, setSearch] = useState<boolean>(false);
  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;
    dispatch(changeSidebarVisibility("show"));

    if (windowSize > 767) humberIcon.classList.toggle("open");

    //For collapse horizontal menu
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.contains("menu")
        ? document.body.classList.remove("menu")
        : document.body.classList.add("menu");
    }

    //For collapse vertical and semibox menu
    if (
      sidebarVisibilitytype === "show" &&
      (document.documentElement.getAttribute("data-layout") === "vertical" ||
        document.documentElement.getAttribute("data-layout") === "semibox")
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.contains("twocolumn-panel")
        ? document.body.classList.remove("twocolumn-panel")
        : document.body.classList.add("twocolumn-panel");
    }
  };
  const toggleSalonStatus = () => {
    setIsSalonOpen(!isSalonOpen); // Toggle between Open and Closed
  };

  // const handleStatusChange = async (newStatus: string) => {
  //   setStatus(newStatus); // Update status locally

  //   if (isSalonOwner) {
  //     setLoading(true); // Start loading while API is fetching salon data

  //     try {
  //       // Call the fetchSalons API with pagination and search params
  //       const response = await fetchSalons(1, 10, ""); // Example: page = 1, limit = 10, no search term
  //       console.log("Salons fetched successfully:", response);

  //       // Handle the response (e.g., update the UI with fetched salons)
  //     } catch (error) {
  //       console.error("Error fetching salons:", error);
  //     } finally {
  //       setLoading(false); // Stop loading after the API call completes
  //     }
  //   }
  // };
  return (
    <React.Fragment>
      <header id="page-topbar" className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex align-items-center">
              <div className="navbar-brand-box horizontal-logo">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <h3 className="mt-4 mb-4">Shear Brilliance</h3>
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <h3 className="text-white mt-4 mb-4">Shear Brilliance</h3>
                  </span>
                </Link>
              </div>

              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon"
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
              <h3>Welcome {storeRoleInfo?.role_name}</h3>
            </div>

            <div className="d-flex align-items-center">
              <Dropdown
                isOpen={search}
                toggle={toogleSearch}
                className="d-md-none topbar-head-dropdown header-item"
              >
                <DropdownToggle
                  type="button"
                  tag="button"
                  className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                >
                  <i className="bx bx-search fs-22"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                  <Form className="p-3">
                    <div className="form-group m-0">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search ..."
                          aria-label="Recipient's username"
                        />
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify"></i>
                        </button>
                      </div>
                    </div>
                  </Form>
                </DropdownMenu>
              </Dropdown>
              {/* <div className="d-flex align-items-center justify-content-end mb-6">
                <label htmlFor="statusDropdown" className="mt-4 mb-4">
                  Status &nbsp; &nbsp;
                </label>
               
                <UncontrolledDropdown>
                  <DropdownToggle
                    tag="button"
                    className="btn btn-light"
                    style={{
                      color: status === "Open" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {status} <i className="mdi mdi-chevron-down"></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => handleStatusChange("Open")}>
                      Open
                    </DropdownItem>
                    <DropdownItem onClick={() => handleStatusChange("Close")}>
                      Close
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div> */}
              {storeRoleInfo?.role_name === 'Salon Owner' && (
                <SalonStatusDropdown isSalonOwner={isSalonOwner} userInfo={userInfo} salonUserInfo={salonUserInfo} showLoader={changeShowLoader} />
              ) }
               {/* {storeRoleInfo?.role_name === 'Barber' && (
                <BarberStatusDropdown isBarber={isBarber}
                 userInfo={userInfo}
                 barberUserInfo={barberUserInfo}
                   showLoader={changeShowLoader} />
              ) } */}
              {/* FullScreenDropdown */}
              <FullScreenDropdown />

              {/* Dark/Light Mode set */}
              <LightDark
                layoutMode={layoutModeType}
                onChangeLayoutMode={onChangeLayoutMode}
              />

              {/* NotificationDropdown */}
              <NotificationDropdown />

              {/* ProfileDropdown */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
