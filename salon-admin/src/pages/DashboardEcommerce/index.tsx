import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import Section from "./Section";
import { fetchDashboardData } from "Services/DashboardService";
import Loader from "Components/Common/Loader";

export const DASHBOARD_ENDPOINT = "/dashboard";

const DashboardEcommerce = () => {
  document.title = "Shear Brilliance Admin";
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  useEffect(() => {
    setShowLoader(true);
    const getDashboardData = async () => {
      try {
        const response: any = await fetchDashboardData();
        setDashboardData(response);
        setShowLoader(false);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };
      getDashboardData();    

  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className='data-section'>
          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                <Row>
                  {
                    showLoader ? (
                      <Loader />
                    ) : (
                      <Widget dashboard={dashboardData}/>
                    )
                  }
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
