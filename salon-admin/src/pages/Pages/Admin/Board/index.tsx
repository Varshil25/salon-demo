import React from 'react'

import { Container } from 'reactstrap'
import BreadCrumb from 'Components/Common/BreadCrumb'
import Board from './Board'




const Kanbanboard = () => {

    document.title = "Board | ShearBrilliance";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Board" pageTitle="Tasks" />
                    <Board />
                </Container>
            </div>
        </React.Fragment>


    )
}

export default Kanbanboard