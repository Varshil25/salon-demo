import React from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import  UserTable from '../../Admin/User/UserTable'

const ReactUserTable = () => {
  document.title = "User-Table | ShearBrilliance ";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className='data-section'>
          <Row>
            <Col lg={12}>
              <Card>
                
                <CardBody>
                  <UserTable />
                </CardBody>
              </Card>
            </Col>
          </Row>
          
         
          
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ReactUserTable;




