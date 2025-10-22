import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import defaultImage from "../../assets/images/blog_default_img.jpg";
import axios from "axios";
import { post } from "Services/api";


export const NOTIFICATION_ENDPOINT = "/notification";

const Notification = () => {
  const [modal, setModal] = useState(false); // State to manage modal visibility
  const [selectedImage, setSelectedImage] = useState<any | null>(null); 
  const toggleModal = () => setModal(!modal); // Function to toggle the modal

  const handleAddButtonClick = () => {
    toggleModal(); // Show the modal on button click
  };

  

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const title = (e.target as HTMLFormElement).username.value;
    const body = (e.target as HTMLFormElement).description.value;
  
    const payload = {
      title,
      body,
      image: selectedImage
        ? URL.createObjectURL(selectedImage) // If an image is selected
        : null,
    };
  
    try {
      // API Call using axios
      const response = await axios.post(NOTIFICATION_ENDPOINT, payload);
  
      if (response.status === 200 || response.status === 201) {
        console.log("Notification sent successfully!", response.data);
      } else {
        console.error("Failed to send notification:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      toggleModal(); // Close the modal after submission
    }
  };
  
  



  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Store the file in state
    } else {
      setSelectedImage(null); // Clear the selected image if no file is selected
    }
  };

  return (
    <React.Fragment>
      <Container fluid>
        <div className="page-content mt-lg-5">
          <Row className="g-2 mb-4">
            <Col sm={4}>
              <div className="d-flex justify-content-between mb-4">
                <h5>Send Notification All App Users</h5>
              </div>
            </Col>
            <Col className="col-sm-auto ms-auto align-botto">
              <div className="list-grid-nav hstack gap-3">
                <Button color="success" onClick={handleAddButtonClick}>
                  <i className="ri-add-fill me-1 align-bottom"></i> Send Notification
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Modal */}
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader
          className="modal-title"
          id="myModalLabel"
          toggle={() => {
            toggleModal();
          }}
        >
          Send Notification
        </ModalHeader>
          <Form onSubmit={handleFormSubmit}>
            <ModalBody>
            <FormGroup>
            <Label for="imageUpload">Image</Label>
            <div className="text-center mb-3">
              <div className="position-relative d-inline-block">
                {/* File Upload Button */}
                <div className="position-absolute bottom-0 end-0">
                  <Label htmlFor="imageUpload" className="mb-0">
                    <div className="avatar-xs">
                      <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                        <i className="ri-image-fill"></i>
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Avatar Image Display */}
                <div className="avatar-lg">
                  <div
                    className="avatar-title bg-light rounded-circle"
                    style={{
                      width: "100px",
                      height: "100px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        selectedImage instanceof File
                          ? URL.createObjectURL(selectedImage) // Preview for selected file
                          : defaultImage // Use a default image
                      }
                      alt="Avatar"
                      className="avatar-md rounded-circle"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
              {/* Hidden Input for File Upload */}
              <Input
                type="file"
                id="imageUpload"
                name="image"
                className="d-none"
                onChange={handleImageChange}
              />
            </FormGroup>
              <FormGroup>
                <Label for="username">Title</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter title"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  rows="3"
                  required
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit" className="btn btn-success">
                Send
              </Button>
             
            </ModalFooter>
          </Form>
          
        </Modal>
      </Container>
    </React.Fragment>
  );
};

export default Notification;
