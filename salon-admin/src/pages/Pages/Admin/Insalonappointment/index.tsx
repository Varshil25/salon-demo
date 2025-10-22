import React from 'react'

import { Container } from 'reactstrap'
import BreadCrumb from 'Components/Common/BreadCrumb'
import Displayappointment from './salonappointment';





const Salonappointment = () => {

    document.title = "Appointments | ShearBrilliance";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Running appointment In Salon" pageTitle="Tasks" />
                    <Displayappointment />
                </Container>
            </div>
        </React.Fragment>


    )
}

export default Salonappointment