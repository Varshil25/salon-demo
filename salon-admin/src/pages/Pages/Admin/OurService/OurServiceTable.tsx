import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, Form, Row, Col, Input, Label, ModalHeader, Spinner } from 'reactstrap';
import TableContainer from 'Components/Common/TableContainer';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { fetchServices, addService, updateService, updatePatchStatus } from '../../../../Services/Service';
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from 'Components/Common/Loader';

interface Service {
  id: number;
  name: string;
  description: string;
  price:number;
  default_service_time: number;
  isActive: boolean;
}
export const SERVICE_ENDPOINT = '/services'
const ServiceTable: React.FC = () => {
  const [serviceData, setServiceData] = useState<Service[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null); // State for the role to delete
  const [newService, setNewService] = useState<Service | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [showLoader, setShowLoader] = useState(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [setIsActive, setIsActiveInfo] = useState(true); // Initialize with default value

  const [selectedTotalItems, setTotalItems] = useState<number | null>(0);

  useEffect(() => {
    const fetchServices = async () => {

      try {
        const response: any = await axios.get(SERVICE_ENDPOINT);
        setServiceData(response);
        setTotalItems(response?.length);
        if (serviceData?.length === 0) {
          const timer = setTimeout(() => {
            setShowLoader(false);
          }, 5000); // Hide loader after 5 seconds
          return () => clearTimeout(timer); // Clear timer if component unmounts or salonData changes
        } else {
          setShowLoader(false); // Immediately hide loader if data is available
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchServices();
  }, []);

  // Handle change event
  const handleActiveChange = async (id: any, event: any) => {
    const isChecked = event; // Get the checkbox value
    const obj = {
      isActive: isChecked
    }
    const updatedUser = await updatePatchStatus(id, obj);
    setServiceData((prevData) =>
      prevData.map((service) => (service.id === id ? { ...service, ...updatedUser } : service))
    );
    toast.success("Status updated successfully", { autoClose: 3000 });
    fetchServices();
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: newService?.name || '',
      price:newService?.price || 0,
      description: newService?.description || '',
      default_service_time: newService?.default_service_time || 0,
      isActive: newService?.isActive || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Service Name"),
      price: Yup.number().required("Please Enter Price"),
      description: Yup.string().required("Please Enter Service Description"),
      default_service_time: Yup.number().required("Please Enter Description"),
    }),
    onSubmit: async (values) => {
      setShowSpinner(true);
      if (newService) {
        await handleUpdateService(newService.id, values);
      } else {
        await handleAddService(values);
      }
      toggleModal();
    },
  });
  const handleAddService = async (values: Omit<Service, 'id' | 'created_at'>) => {
    try {
      const newService = await addService({ ...values, created_at: new Date().toISOString(), isActive: setIsActive });
      toast.success("Service added successfully", { autoClose: 3000 });
      setServiceData((prevData) => [...prevData, newService]);
      setShowSpinner(false);
      validation.resetForm();
    } catch (error: any) {
      // Check if the error response contains a message from the server
      const errorMessage = error.response?.data?.message || "Error adding service, please try again later";
      toast.error(errorMessage, { autoClose: 3000 });
      console.error("Error adding service:", error);
    }
  };

  const handleUpdateService = async (id: number, values: Omit<Service, 'id'>) => {
    try {
      // Find the existing service to retain the created_at value
      const existingService = serviceData.find((service) => service.id === id);

      if (!existingService) {
        throw new Error("Service not found");
      }

      // Prepare the updated service data including created_at
      const serviceDataToUpdate: Omit<Service, 'id'> = {
        ...values,
        isActive: setIsActive
      };

      await updateService(id, serviceDataToUpdate);

      toast.success("Service updated successfully", { autoClose: 3000 });
      setShowSpinner(false);
      setServiceData((prevData) =>
        prevData.map((service) => (service.id === id ? { ...service, ...values } : service))
      );

      validation.resetForm();
    } catch (error: any) {
      // Capture the error message from the API response
      const errorMessage = error.response?.data?.message || "Error updating service, please try again later";
      toast.error(errorMessage, { autoClose: 3000 });
      console.error("Error updating service:", error);
    }
  };

  const columns = useMemo(() => [
    {
      header: "Name",
      accessorKey: 'name',
      enableColumnFilter: false,
    },
    {
      header: "Description",
      accessorKey: 'description',
      enableColumnFilter: false,
    },
    {
      header: "Service Time (In minutes)",
      accessorKey: 'default_service_time',
      enableColumnFilter: false,
    },
    {
      header: "Price",
      accessorKey: 'price',
      enableColumnFilter: false,
      cell: ({ getValue }: { getValue: () => number }) => (
        <span style={{ color: "#4CAF50", textAlign:"right", fontWeight: "bold", display: "block"}}>${getValue()}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: 'isActive',
      enableColumnFilter: false,
      cell: (cell: { row: { original: Service } }) => (
        <div className="form-check form-switch mb-3">
          <Input className="form-check-input" type="checkbox" role="switch" id="isActive"
            checked={cell.row.original.isActive} // Bind to state
            onChange={() => handleActiveChange(cell.row.original.id, !cell.row.original.isActive)} // Pass ID and new value
          />
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: 'actions',
      enableColumnFilter: false,
      cell: (cell: { row: { original: Service } }) => (
        <div>
          <i
            className="ri-edit-2-fill"
            style={{ cursor: "pointer", marginRight: "20px", color: "grey", fontSize: "20px" }}
            onClick={() => handleEdit(cell.row.original)}
          ></i>
        </div>
      ),
    },
  ], []);

  const handleEdit = (service: Service) => {
    setNewService(service);
    setIsActiveInfo(service.isActive);
    setModal(true);
  };

  const onClickDelete = (service: Service) => {
    setSelectedServiceId(service.id); // Set the selected service ID for deletion
    setDeleteModal(true); // Open the delete modal
  };

  const handleDeleteService = async () => {
    if (selectedServiceId !== null) {
      await axios.delete(`${SERVICE_ENDPOINT}/${selectedServiceId}`);

      // Remove the deleted user from the local state
      setServiceData((prevData) =>
        prevData.filter((barber) => barber.id !== selectedServiceId)
      );

      toast.success("Barber deleted successfully", { autoClose: 3000 });
      setShowSpinner(true);
      setDeleteModal(false); // Close the modal
      setSelectedServiceId(null); // Reset selected service ID
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };
  const handleAddButtonClick = () => {
    setNewService(null);
    setModal(true);
  };
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal); // Toggle the delete modal visibility
  };

  return (
    <React.Fragment>
      <Row className="g-2 mb-4">
        <Col sm={4}>
          <h5>Service Management</h5>
        </Col>
        <Col className="col-sm-auto ms-auto">
          <Button color="success" onClick={handleAddButtonClick}>
            <i className="ri-add-fill me-1 align-bottom"></i> Add Service
          </Button>
        </Col>
      </Row>
      {serviceData?.length ? (
        <TableContainer
          columns={columns}
          data={serviceData}
          isGlobalFilter={false}
          totalItems={selectedTotalItems ?? 0}
          customPageSize={50}
          divClass="table-responsive table-card"
          SearchPlaceholder="Search..."
        />
      ) : showLoader ? (
        <Loader />
      ) : (
        <div>No Data Available</div> // Optional: Show alternative content if no data
      )}

      {/* Service Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered
        backdrop="static" // Prevents closing on outside click
      >
        <ModalHeader className="modal-title"
          id="myModalLabel" toggle={() => {
            toggleModal();
          }}>
          {newService ? 'Update Service' : 'Add Service'}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={validation.handleSubmit}>
            {/* Form Fields */}
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="name" className="form-label">Service Name</Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter name"
                    value={validation.values.name}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.name && validation.errors.name && (
                    <div className="text-danger">{validation.errors.name}</div>
                  )}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="description" className="form-label">Description</Label>
                  <Input
                    type="textarea"
                    className="form-control"
                    id="description"
                    rows="3"
                    placeholder="Enter description"
                    value={validation.values.description}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.description && validation.errors.description && (
                    <div className="text-danger">{validation.errors.description}</div>
                  )}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="default_service_time" className="form-label">Default Service Time</Label>
                  <Input
                    type="number"
                    className="form-control"
                    id="default_service_time"
                    placeholder="Enter default_service_time"
                    value={validation.values.default_service_time}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.default_service_time && validation.errors.default_service_time && (
                    <div className="text-danger">{validation.errors.default_service_time}</div>
                  )}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="price" className="form-label">Price</Label>
                  
                 <div className="input-group">
      <span className="input-group-text">$</span>
      <Input
        type="number"
        className="form-control"
        id="price"
        placeholder="Enter Price"
        value={validation.values.price}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
      />
    </div>
                  {validation.touched.price && validation.errors.price && (
                    <div className="text-danger">{validation.errors.price}</div>
                  )}
                </div>
              </Col>
              {/* <Col lg={12}>
                <div className="form-check form-switch mb-3">
                  <Input className="form-check-input" type="checkbox" role="switch" id="isActive"
                    checked={setIsActive} // Bind to state
                    onChange={handleActiveChange} // Handle change
                  />
                  <Label className="form-check-label" htmlFor="isActive">Is Active?</Label>
                </div>

              </Col> */}
            </Row>

            <Row>
              <Col lg={12}>
                <div className="hstack gap-2 justify-content-end">
                  <Button color="light" onClick={toggleModal}>Cancel</Button>
                  <Button type="submit" color="success"
                    disabled={
                      showSpinner
                    } // Disable button when loader is active
                  >
                    {showSpinner && (
                      <Spinner
                        size="sm"
                        className="me-2"
                      >
                        Loading...
                      </Spinner>
                    )}
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModal}
        showSpinner={showSpinner}
        onDeleteClick={handleDeleteService}
        onCloseClick={toggleDeleteModal}
        recordId={selectedServiceId !== null ? selectedServiceId.toString() : undefined} // Convert to string or undefined
      />
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default ServiceTable;
