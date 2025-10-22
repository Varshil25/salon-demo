import React from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import CustomerTable from './CustomerTable';

const ReactCustomerTable = () => {
  document.title = "Customer-Table | ShearBrilliance ";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className='data-section'>
          <Row>
            <Col lg={12}>
              <Card>
                
                <CardBody>
                  <CustomerTable />
                </CardBody>
              </Card>
            </Col>
          </Row>
          
         
          
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ReactCustomerTable;




