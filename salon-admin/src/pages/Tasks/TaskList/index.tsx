import React from 'react';
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import AllTasks from './AllTasks';
import Widgets from './Widgets';


const TaskList = () => {
    document.title="Appointment List | Shear Brilliance - Admin Dashboard";
    return (
        <React.Fragment>
            <div className="page-content">
            
                <Container fluid>
                    <BreadCrumb title="Appointment List" pageTitle="Appointments" />
                    <Row>
                        <Widgets />
                    </Row>
                    <AllTasks />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TaskList;