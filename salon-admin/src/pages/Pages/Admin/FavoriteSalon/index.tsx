import React from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import  FavoriteSalonTable from '../../Admin/FavoriteSalon/FavoriteSalon'

const ReactTable = () => {
  document.title = "FavSalon-Tables";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
               
                <CardBody>
                  <FavoriteSalonTable />
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