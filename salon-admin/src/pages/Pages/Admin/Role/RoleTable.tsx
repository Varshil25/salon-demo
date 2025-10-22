import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, Form, Row, Col, Input, Label, ModalHeader, Spinner } from 'reactstrap';
import TableContainer from 'Components/Common/TableContainer';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DeleteModal from "../../../../../src/Components/Common/DeleteModal";
import { fetchRoles, addRole, updateRole, deleteRole } from '../../../../Services/RoleService';
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from 'Components/Common/Loader';

interface Role {
  id: number;
  role_name: string;
  description: string;
  can_create_appointment: boolean;
  can_modify_appointment: boolean;
  can_cancel_appointment: boolean;
  can_view_customers: boolean;
  can_manage_staff: boolean;
  can_manage_services: boolean;
  can_access_reports: boolean;
  created_at: string;
}
export const ROLE_ENDPOINT = '/roles'
const RoleTable: React.FC = () => {
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null); // State for the role to delete
  const [newRole, setNewRole] = useState<Role | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedTotalItems, setTotalItems] = useState<number | null>(0);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showLoader, setShowLoader] = useState(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);


  useEffect(() => {
    fetchRoles();
  }, []);
  const fetchRoles = async () => {

    try {
      const response: any = await axios.get(ROLE_ENDPOINT);
      setRoleData(response);
      setTotalItems(response?.length);
      if (roleData?.length === 0) {
        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 5000); // Hide loader after 5 seconds
        return () => clearTimeout(timer); // Clear timer if component unmounts or salonData changes
      } else {
        setShowLoader(false); // Immediately hide loader if data is available
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      role_name: newRole?.role_name || '',
      description: newRole?.description || '',
      can_create_appointment: newRole?.can_create_appointment || false,
      can_modify_appointment: newRole?.can_modify_appointment || false,
      can_cancel_appointment: newRole?.can_cancel_appointment || false,
      can_view_customers: newRole?.can_view_customers || false,
      can_manage_staff: newRole?.can_manage_staff || false,
      can_manage_services: newRole?.can_manage_services || false,
      can_access_reports: newRole?.can_access_reports || false,
    },
    validationSchema: Yup.object({
      role_name: Yup.string().required("Please Enter Role Name"),
      description: Yup.string().required("Please Enter Description"),
    }),
    onSubmit: async (values) => {
      setShowSpinner(true);
      if (newRole) {
        // await handleUpdateRole(newRole.id, values);
        await handleUpdateRole(newRole.id, values);
      } else {
        await handleAddRole(values);
      }
      toggleModal();
    },
  });
  const handleAddRole = async (values: Omit<Role, 'id' | 'created_at'>) => {

    try {
      const newRole = await addRole({ ...values, created_at: new Date().toISOString() });
      toast.success("Role added successfully", { autoClose: 3000 });
      // setRoleData((prevData) => [...prevData, newRole]);
      fetchRoles();
      setShowSpinner(false);
      validation.resetForm();
    } catch (error: any) {
      // Check if the error response contains a message from the server
      const errorMessage = error.response?.data?.message || "Error adding role, please try again later";
      toast.error(errorMessage, { autoClose: 3000 });
      console.error("Error adding role:", error);
    }
  };

  const handleUpdateRole = async (id: number, values: Omit<Role, 'id' | 'created_at'>) => {
    try {
      // Find the existing role to retain the created_at value
      const existingRole = roleData.find((role) => role.id === id);

      if (!existingRole) {
        throw new Error("Role not found");
      }

      // Prepare the updated role data including created_at
      const roleDataToUpdate: Omit<Role, 'id'> = {
        ...values,
        created_at: existingRole.created_at, // Retain the existing created_at value
      };

      await updateRole(id, roleDataToUpdate);

      toast.success("Role updated successfully", { autoClose: 3000 });
      // setRoleData((prevData) =>
      //   prevData.map((role) => (role.id === id ? { ...role, ...values } : role))
      // );
      fetchRoles();
      setShowSpinner(false);
      validation.resetForm();
    } catch (error: any) {
      // Capture the error message from the API response
      const errorMessage = error.response?.data?.message || "Error updating role, please try again later";
      toast.error(errorMessage, { autoClose: 3000 });
      console.error("Error updating role:", error);
    }
  };

  const columns = useMemo(() => [
    {
      header: "Name",
      accessorKey: 'role_name',
      enableColumnFilter: false,
    },
    {
      header: "Description",
      accessorKey: 'description',
      enableColumnFilter: false,
    },
    {
      header: "Actions",
      accessorKey: 'actions',
      enableColumnFilter: false,
      cell: (cell: { row: { original: Role } }) => (
        <div>
          <i
            className="ri-edit-2-fill"
            style={{ cursor: "pointer", marginRight: "20px", color: "grey", fontSize: "20px" }}
            onClick={() => handleEdit(cell.row.original)}
          ></i>
          {/*<i
            className="ri-delete-bin-fill"
            style={{ cursor: "pointer", color: "grey", fontSize: "20px" }}
            onClick={() => onClickDelete(cell.row.original)} // Call the delete function
          />*/}
        </div>
      ),
    },
  ], []);

  const handleEdit = (role: Role) => {
    setNewRole(role);
    setModal(true);
  };

  const onClickDelete = (role: Role) => {
    setSelectedRoleId(role.id); // Set the selected role ID for deletion
    setDeleteModal(true); // Open the delete modal
  };

  const handleDeleteRole = () => {
    if (selectedRoleId !== null) {
      // setRoleData((prevData) => prevData.filter((role) => role.id !== selectedRoleId)); // Remove the selected role
      fetchRoles();
      setDeleteModal(false); // Close the modal
      setSelectedRoleId(null); // Reset selected role ID
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };
  const handleAddButtonClick = () => {
    setNewRole(null);
    setModal(true);
  };
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal); // Toggle the delete modal visibility
  };

  return (
    <React.Fragment>
      <Row className="g-2 mb-4">
        <Col sm={4}>
          <h5>Role Management</h5>
        </Col>
        <Col className="col-sm-auto ms-auto">
          <Button color="success" onClick={handleAddButtonClick}>
            <i className="ri-add-fill me-1 align-bottom"></i> Add Role
          </Button>
        </Col>
      </Row>
      {roleData?.length ? (
        <TableContainer
          columns={columns}
          data={roleData}
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

      {/* Role Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered
        backdrop="static" // Prevents closing on outside click
      >
        <ModalHeader className="modal-title"
          id="myModalLabel" toggle={() => {
            toggleModal();
          }}>
          {newRole ? 'Update Role' : 'Add Role'}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={validation.handleSubmit}>
            {/* Form Fields */}
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="role_name" className="form-label">Role Name</Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="role_name"
                    placeholder="Enter role name"
                    value={validation.values.role_name}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.role_name && validation.errors.role_name && (
                    <div className="text-danger">{validation.errors.role_name}</div>
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
              {/* Permissions checkboxes */}
              {/* <Col lg={12}>
                <Label className="form-label">Permissions</Label>
                <div className="mb-3"
                  onClick={() => validation.setFieldValue('can_create_appointment', !validation.values.can_create_appointment)}
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for clarity
                >
                  <Input
                    type="checkbox"
                    id="can_create_appointment"
                    checked={validation.values.can_create_appointment}
                    onChange={validation.handleChange}
                    onClick={(e) => e.stopPropagation()} // Prevent div click from triggering checkbox twice
                  /> Can Create Appointment
                </div>
                <div className="mb-3"
                  onClick={() => validation.setFieldValue('can_modify_appointment', !validation.values.can_modify_appointment)}
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for clarity
                >
                  <Input
                    type="checkbox"
                    id="can_modify_appointment"
                    checked={validation.values.can_modify_appointment}
                    onChange={validation.handleChange}
                    onClick={(e) => e.stopPropagation()} // Prevent div click from triggering checkbox twice
                  /> Can Modify Appointment
                </div>
                <div className="mb-3"
                  onClick={() => validation.setFieldValue('can_cancel_appointment', !validation.values.can_cancel_appointment)}
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for clarity
                >
                  <Input
                    type="checkbox"
                    id="can_cancel_appointment"
                    checked={validation.values.can_cancel_appointment}
                    onChange={validation.handleChange}
                    onClick={(e) => e.stopPropagation()} // Prevent div click from triggering checkbox twice
                  /> Can Cancel Appointment
                </div>
                <div className="mb-3"
                  onClick={() => validation.setFieldValue('can_view_customers', !validation.values.can_view_customers)}
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for clarity
                >
                  <Input
                    type="checkbox"
                    id="can_view_customers"
                    checked={validation.values.can_view_customers}
                    onChange={validation.handleChange}
                    onClick={(e) => e.stopPropagation()} // Prevent div click from triggering checkbox twice
                  /> Can View Customers
                </div>
                <div className="mb-3"
                  onClick={() => validation.setFieldValue('can_manage_staff', !validation.values.can_manage_staff)}
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for clarity
                >
                  <Input
                    type="checkbox"
                    id="can_manage_staff"
                    checked={validation.values.can_manage_staff}
                    onChange={validation.handleChange}
                    onClick={(e) => e.stopPropagation()} // Prevent div click from triggering checkbox twice
                  /> Can Manage Staff
                </div>
                <div className="mb-3"
                  onClick={() => validation.setFieldValue('can_manage_services', !validation.values.can_manage_services)}
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for clarity
                >
                  <Input
                    type="checkbox"
                    id="can_manage_services"
                    checked={validation.values.can_manage_services}
                    onChange={validation.handleChange}
                    onClick={(e) => e.stopPropagation()} // Prevent div click from triggering checkbox twice
                  /> Can Manage Services
                </div>
                <div className="mb-3"
                  onClick={() => validation.setFieldValue('can_access_reports', !validation.values.can_access_reports)}
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for clarity
                >
                  <Input
                    type="checkbox"
                    id="can_access_reports"
                    checked={validation.values.can_access_reports}
                    onChange={validation.handleChange}
                    onClick={(e) => e.stopPropagation()} // Prevent div click from triggering checkbox twice
                  /> Can Access Reports
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
        onDeleteClick={handleDeleteRole}
        onCloseClick={toggleDeleteModal}
        recordId={selectedRoleId !== null ? selectedRoleId.toString() : undefined} // Convert to string or undefined
      />
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default RoleTable;
