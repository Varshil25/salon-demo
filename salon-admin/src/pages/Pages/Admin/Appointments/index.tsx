import React, { useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import AppointmentTable from './AppointmentTable';
import Widgets from './Widgets';
import { fetchAppointmentDashboardData } from "Services/DashboardService";
export const DASHBOARD_ENDPOINT = "/dashboard";

const TaskList = () => {
    document.title="Appointments | ShearBrilliance";
       
  const [dashboardData, setDashboardData] = useState<any>(null);
  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const response: any = await fetchAppointmentDashboardData();
        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };

    getDashboardData();

  }, []);
    return (
        <React.Fragment>
            <div className="page-content">
            
                <Container fluid>
                    <BreadCrumb title="customer data" pageTitle="Appointments" />
                    <Row>
                        <Widgets dashboard={dashboardData}/>
                    </Row>
                    <AppointmentTable />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TaskList;