import React from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import { SearchTable, SortingTable } from './ReactTable'

const ReactTable = () => {
  document.title = "React Tables | Shear Brilliance - Admin Dashboard";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Search</h5>
                </CardHeader>
                <CardBody>
                  <SearchTable />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Sorting</h5>
                </CardHeader>
                <CardBody>
                  <SortingTable />
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