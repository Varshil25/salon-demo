import React from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import BarberSessionsTable from './BarberSessionsTable';

const ReactTable = () => {
  document.title = "Barber Schedules | ShearBrilliance";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className='data-section'>
          <Row>
            <Col lg={12}>
              <Card>

                <CardBody>
                  <BarberSessionsTable />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    </React.Fragment>
  );
};

export default ReactTable;