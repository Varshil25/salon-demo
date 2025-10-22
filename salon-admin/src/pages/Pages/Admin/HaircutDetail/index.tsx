import React from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import  HaircutDetailsTable from '../../Admin/HaircutDetail/HaircutDetailsTable'

const ReactTable = () => {
  document.title = "HaircutDetails-Table | ShearBrilliance";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
               
                <CardBody>
                  <HaircutDetailsTable />
                </CardBody>
              </Card>
            </Col>
          </Row>
          
         
          
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ReactTable;