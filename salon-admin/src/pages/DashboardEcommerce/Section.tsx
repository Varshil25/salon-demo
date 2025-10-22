import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "flatpickr/dist/themes/material_blue.css"; // Flatpickr theme
import Loader from "Components/Common/Loader";
import { generatereport } from "Services/Insalonappointment";

const Section = (props: any) => {
  const [userInformation, setUserInformation] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>();
  const [greeting, setGreeting] = useState("");
  const [selectedStartDate, setStartDate] = useState<any>(new Date());
  const [selectedEndDate, setEndDate] = useState<any>(new Date());
  const [showLoader, setShowLoader] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const authUserData = JSON.parse(authUser);
      setUserInformation(authUserData);
      setUserRole(authUserData.user.role);
    }

    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good Morning");
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting("Good Afternoon");
      } else if (currentHour >= 17 && currentHour < 21) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const applyDateFilter = async () => {
    setShowSpinner(true);
    setShowLoader(true);
    try {
      const response = await generatereport(selectedStartDate, selectedEndDate);
      if (response) {
        const downloadLink = response.downloadLink;
        toast.success("PDF report generated successfully!");
        window.open(downloadLink, "_blank");
      } else {
        toast.error("Failed to generate PDF report.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setShowSpinner(false);
      setShowLoader(false);
    }
    setShowDatePicker(false);
  };

  return (
    <React.Fragment>
      <Row className="mb-3 pb-1">
        <Col xs={12}>
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">
                {greeting}, {userRole?.role_name}!
              </h4>
              <p className="text-muted mb-0">
                Here's what's happening with your store today.
              </p>
            </div>
            <div className="mt-3 mt-lg-0">
              <div className="d-flex justify-content-between align-items-center col-auto p-2 bg-light">
                <p className="text-uppercase fw-medium text-muted text-truncate mb-0 me-2">
                  Generate Report
                </p>
                <button
                  type="button"
                  className="btn btn-soft-info btn-icon waves-effect waves-light"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  title="Select Date Range"
                  aria-label="Select Date Range"
                >
                  <i className="ri-download-line"></i>
                </button>
              </div>
            </div>
          </div>

          {showDatePicker && (
            <div className="d-flex align-items-center mt-3">
              <Flatpickr
                className="form-control me-2"
                value={selectedStartDate}
                onChange={(dates: any) => setStartDate(dates[0])}
                options={{ dateFormat: "Y-m-d" }}
                placeholder="Select Start Date"
              />
              <Flatpickr
                className="form-control me-2"
                value={selectedEndDate}
                onChange={(dates: any) => setEndDate(dates[0])}
                options={{ dateFormat: "Y-m-d" }}
                placeholder="Select End Date"
              />
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center"
                onClick={applyDateFilter}
                disabled={
                  showSpinner
                } // Disable button when loader is active
              >
                {showSpinner && (
                  <Spinner
                    size="sm"
                    className="me-2"
                  >
                    Loading...
                  </Spinner>
                )}
                Apply
              </button>
            </div>
          )}
          <ToastContainer closeButton={false} limit={1} />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
