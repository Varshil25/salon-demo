import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalBody,
  Button,
  Row,
  Col,
  Form,
  Input,
  Label,
  ModalHeader,
  Spinner,
} from "reactstrap";
import TableContainer from "Components/Common/TableContainer";
import Profile from "../../../../assets/images/users/avatar-8.jpg";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteModal from "../../../../../src/Components/Common/DeleteModal";
import {
  createUser,
  fetchUsers,
  updateUser,
} from "Services/UserService";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "Components/Common/Loader";

// Define the User type based on your database structure
interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  address: string;
  mobile_number: string | undefined; // Allow undefined if that's the case in the imported type
  email: string;
  google_token: string;
  apple_token: string;
  password: string; // Add this line
  RoleId: number;// Adjust to match the expected type
  created_at: string;
  // SalonId: number;
  profile_photo: string;
}

interface Salon {
  salon_id: number;
  salon_name: string;
  availability_status: string; // Field for availability status
  photos: number; // Field for default service time
  creappointment_countted_at: string;
  address: string; // Fixed typo here
  barbers?: object; // Add this line
}

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

export const USERS_ENDPOINT = "/users";
export const SALON_ENDPOINT = "/salon/admin";
export const ROLE_ENDPOINT = '/roles'

const UserTable: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [salonData, setSalonData] = useState<Salon[]>([]);
  const [modal, setModal] = useState(false);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);


  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // State for the user to delete
  const [errors, setErrors] = useState<any>({});

  // const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  // const [selectedSalonId, setSelectedSalonId] = useState<number>();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number>();
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedSearchText, selectedSearch] = useState<null>(null);
  const [selectedCurrentPage, setCurrentPage] = useState<number | null>(0);
  const [selectedTotalItems, setTotalItems] = useState<number | null>(null);
  const [selectedTotalPages, setTotalPages] = useState<number | null>(null);
  const limit = 10; // Items per page

  // Toggle modal visibility
  const toggleModal = () => setModal(!modal);

  useEffect(() => {

    getUsers(1, null);

    const fetchSalons = async () => {
      try {
        const response: any = await axios.get(SALON_ENDPOINT);
        setSalonData(response);
      } catch (error) {
        console.error("Error fetching salon:", error);
      }
    };

    fetchSalons();

    const fetchRoles = async () => {
      try {
        const response: any = await axios.get(ROLE_ENDPOINT);
        const roles = response.filter((role: any) => role.role_name.toLowerCase() === 'admin' || role.role_name.toLowerCase() === 'salon owner' || role.role_name.toLowerCase() === 'barber')
        setRoleData(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const getUsers = async (page: any, search: any) => {
    try {
      const response: any = await fetchUsers(null, 'user', page === 0 ? 1 : page, limit, search ?? null);
      // setCurrentPage(response?.currentPage ? parseInt(response?.currentPage) : 1);
      setTotalItems(response?.totalItems);
      setTotalPages(response?.totalPages);
      const users = response.users.map((usr: any) => {
        usr.fullname = usr.firstname + " " + usr.lastname;
        return usr;
      });
      setUserData(users);
      if (userData?.length === 0) {
        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 500); // Hide loader after 5 seconds
        return () => clearTimeout(timer); // Clear timer if component unmounts or salonData changes
      } else {
        setShowLoader(false); // Immediately hide loader if data is available
      }
    } catch (error) {
      console.error("Error fetching barbers:", error);
    }
  };

  const handlePhoneChange = (e: any) => {
    // Remove non-digit characters and limit to 10 digits
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);

    // Format the phone number
    const formattedPhone = formatPhoneNumber(cleaned);

    // Update the form state with the formatted phone number
    formik.setFieldValue("mobile_number", formattedPhone);
  };

  const formatPhoneNumber = (value: string): string => {
    // Match groups for the USA phone number pattern
    const match = value.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    // If incomplete, return unformatted
    return value;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only digit keys, backspace, delete, and navigation keys
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const userSchema = (isEdit = false) => Yup.object().shape({
    username: Yup.string().required("Username is required"),
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    mobile_number: Yup.string().required("Mobile number is required")
      .matches(/^(?:\(\d{3}\)\s?|\d{3}-?)\d{3}-?\d{4}$/, "Mobile number must be 10 digits"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isEdit ? Yup.string() : Yup.string()
      .min(8, "Password must be at least 8 characters").required("Password is required"),
    RoleId: Yup.number().required("Role ID is required"),
    // SalonId: Yup.number().required("Salon ID is required"),
    // profile_photo: Yup.string().url("Invalid URL")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: newUser?.id || null,
      username: newUser?.username ?? "",
      firstname: newUser?.firstname ?? "",
      lastname: newUser?.lastname ?? "",
      address: newUser?.address ?? "",
      email: newUser?.email ?? "",
      mobile_number: newUser?.mobile_number ?? "",
      password: newUser?.password ?? "",
      RoleId: newUser?.RoleId ?? 0,
      // SalonId: newUser?.SalonId ?? 0,
      profile_photo: newUser?.profile_photo ?? Profile
    },
    validationSchema: userSchema(newUser?.id ? true : false),
    onSubmit: (values) => {
      setShowSpinner(true);
      // Prepare FormData object 
      if (values.id !== null) {

        handleUpdateUser(values.id, values);
      } else {
        handleAddUser(values);
      }
    }
  });

  // // Search functionality
  // const searchList = (searchTerm: string) => {
  //   const filtered = userData.filter(
  //     (user) =>
  //       user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.username.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredData(filtered);
  // };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setSelectedImage(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Save the file object directly
      // formik.setFieldValue('profile_photo', file);
    }
  };

  const handlePageChange = (pageIndex: number) => {
    const total = pageIndex + 1;
    setCurrentPage(pageIndex);
    setShowLoader(true);
    getUsers(total, selectedSearchText);
    console.log('Current Page Index:', pageIndex);
    // Handle page change logic here
  };

  const handleSearchText = (search: any) => {
    selectedSearch(search);
    getUsers(selectedCurrentPage, search);
    // Handle page change logic here
  };
  // Add User (Create)
  // Add new user function
  const handleAddUser = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('RoleId', (values.RoleId ?? 0).toString());
      // formData.append('SalonId', (values.SalonId ?? 0).toString());
      formData.append('profile_photo', selectedImage || Profile); // Append file or fallback 
      formData.append('username', values.username);
      formData.append('firstname', values.firstname);
      formData.append('lastname', values.lastname);
      formData.append('address', values.address);
      formData.append('email', values.email);
      formData.append('mobile_number', values.mobile_number);
      formData.append('password', values.password);

      // Append all other fields
      // for (const key in values) {
      //   if (values[key] !== undefined) {
      //     formData.append(key, values[key]);
      //   }
      // }

      const tempUser = await createUser(formData);
      // const response = await axios.post(USERS_ENDPOINT, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });

      // let tempUser = response;
      tempUser.fullname = tempUser.firstname + " " + tempUser.lastname;
      toast.success("User added successfully", { autoClose: 3000 });
      // Add new user to the local state
      // const users = response.users.map((usr: any) => {
      //   usr.fullname = usr.firstname + " " + usr.lastname;
      //   return usr;
      // })
      getUsers(1, null);
      // setUserData((prevData) => [...prevData, tempUser]);
      setShowSpinner(false);
      // fetchUsers(null, 'user', 1, 100);
      toggleModal(); // Close the modal
      formik.resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  // const handleAddUser = async (values: any) => {
  //   try {
  //     values.RoleId = selectedRoleId ?? 0;
  //     values.SalonId = selectedSalonId ?? 0;
  //     values.profile_photo = selectedImage ?? Profile;
  //     const response = await axios.post(USERS_ENDPOINT, values);
  //     const newUser = response.data;

  //     // Add new user to the local state without re-fetching the entire list
  //     setUserData((prevData) => [...prevData, newUser]);

  //     formik.resetForm(); // Reset form after successful submission
  //   } catch (error) {
  //     console.error("Error adding user:", error);
  //   }
  // };

  const handleUpdateUser = async (id: number, updatedUserData: any) => {
    try {
      const formData = new FormData();

      formData.append('RoleId', (updatedUserData.RoleId ?? updatedUserData.RoleId ?? 0).toString());
      // formData.append('SalonId', (updatedUserData.SalonId ?? updatedUserData.SalonId ?? 0).toString());

      if (selectedImage) {
        formData.append('profile_photo', selectedImage); // If a new image is selected
      }
      formData.append('id', updatedUserData.id.toString());
      formData.append('username', updatedUserData.username);
      formData.append('firstname', updatedUserData.firstname);
      formData.append('lastname', updatedUserData.lastname);
      formData.append('address', updatedUserData.address);
      formData.append('email', updatedUserData.email);
      formData.append('mobile_number', updatedUserData.mobile_number);
      formData.append('password', updatedUserData.password);

      // for (const key in updatedUserData) {
      //   if (updatedUserData[key] !== undefined) {
      //     formData.append(key, updatedUserData[key]);
      //   }
      // }

      await updateUser(id, formData);

      toast.success("User updated successfully", { autoClose: 3000 });
      const updatedUsers = await fetchUsers(null, 'user', 1, limit, selectedSearchText);
      // const users = updatedUsers.users.map((usr: any) => {
      //   usr.fullname = usr.firstname + " " + usr.lastname;
      //   return usr;
      // })
      // // Make sure updatedUsers is of type User[]
      // setUserData(users); // Ensure this matches User[] type
      getUsers(1, null);
      setShowSpinner(false);
      toggleModal(); // Close the modal
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // const handleUpdateUser = async (id: number, updatedUserData: Partial<User>) => {
  //   try {
  //     const dataToUpdate: Partial<User> = {
  //       ...updatedUserData,
  //       RoleId: updatedUserData.RoleId !== undefined ? Number(updatedUserData.RoleId) : undefined,
  //     };

  //     await updateUser(id, dataToUpdate);
  //     // const updatedUsers = await fetchUsers();

  //     // Make sure updatedUsers is of type User[]
  //     // setUserData(updatedUsers); // Ensure this matches User[] type

  //     toggleModal();
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   }
  // };

  // Set user data for editing
  const handleEditUser = (user: User) => {
    // setSelectedSalonId(user.SalonId);
    setSelectedRoleId(user.RoleId);
    setSelectedImage(user.profile_photo ?? Profile); // Use user's profile image or default
    setNewUser(user); // Set the user to be updated
    setIsEditing(true); // Toggle edit mode
    toggleModal(); // Open the modal for editing
  };
  // const handleEditUser = (user: User) => {
  //   setSelectedSalonId(user.SalonId);
  //   setSelectedRoleId(user.RoleId);
  //   setNewUser(user); // Set the user to be updated
  //   setSelectedImage(newUser?.profile_photo ?? Profile); // Set the profile image (or the one in the user object)
  //   setIsEditing(true); // Toggle edit mode
  //   toggleModal(); // Open the modal for editing
  // };

  // Delete user function
  const handleDeleteUser = async () => {
    setShowSpinner(true);
    if (selectedUserId !== null) {
      try {
        await axios.delete(`${USERS_ENDPOINT}/${selectedUserId}`);

        // Remove the deleted user from the local state
        setUserData((prevData) =>
          prevData.filter((user) => user.id !== selectedUserId)
        );
        getUsers(1, null);
        toast.success("User deleted successfully", { autoClose: 3000 });
        setShowSpinner(false);
        setDeleteModal(false); // Close the delete confirmation modal
        setSelectedUserId(null); // Reset selected user ID
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Photo",
        accessorKey: "profile_photo",
        cell: (cell: { getValue: () => string }) => (
          <img
            src={cell.getValue() ? cell.getValue() : Profile}
            // src={Profile}
            alt="Profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
        enableColumnFilter: false,
      },
      // {
      //   header: "User",
      //   accessorKey: "username",
      //   enableColumnFilter: false,
      // },
      {
        header: "Full Name",
        accessorKey: "fullname",
        enableColumnFilter: false,
      },
      // {
      //   header: "Last Name",
      //   accessorKey: "lastname",
      //   enableColumnFilter: false,
      // },
      {
        header: "Address",
        accessorKey: "address",
        enableColumnFilter: false,
      },
      {
        header: "Mobile",
        accessorKey: "mobile_number",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Role",
        accessorKey: "role.role_name",
        enableColumnFilter: false,
      },
      // {
      //   header: "Salon",
      //   accessorKey: "salon.name", // Add SalonId column for "Salon Name"
      //   enableColumnFilter: false,
      // },
      {
        header: "Actions",
        accessorKey: "id",
        enableColumnFilter: false,

        cell: (cell: { getValue: () => number; row: { original: User } }) => (
          <div>
            <i
              className="ri-edit-2-fill"
              style={{
                cursor: "pointer",
                marginRight: "20px",
                color: "grey",
                fontSize: "20px",
              }}
              onClick={() => handleEditUser(cell.row.original)} // Pass the entire user object
            ></i>
            <i
              className=" ri-delete-bin-fill"
              style={{ cursor: "pointer", color: "grey", fontSize: "20px" }}
              onClick={() => onClickDelete(cell.row.original)} // Pass the user ID
            ></i>
          </div>
        ),
      },
    ],
    [userData]
  );

  const handleAddButtonClick = () => {
    setNewUser(null);
    setModal(true);
  };
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal); // Toggle the delete modal visibility
  };

  const onClickDelete = (user: User) => {
    setSelectedUserId(user.id); // Set the selected role ID for deletion
    setDeleteModal(true); // Open the delete modal
  };

  // const handleSalonChange = (event: any) => {
  //   if (event.target.value) {
  //     const salonId = Number(event.target.value);
  //     formik.setFieldValue('SalonId', salonId);
  //     // setSelectedSalonId(salonId);
  //     // // let selectedSalonData: Salon | null;
  //     // const selectedSalonData = salonData.find((salon) => salon.salon_id === salonId);
  //     // setSelectedSalon(selectedSalonData || null);
  //   }
  //   // Perform any additional logic here based on the selected option
  // };


  const handleRoleChange = (event: any) => {
    if (event.target.value) {
      const roleId = Number(event.target.value);
      formik.setFieldValue('RoleId', roleId);
      // setSelectedRoleId(roleId);
      // // let selectedSalonData: Salon | null;
      // const selectedRoleData = roleData.find((role) => role.id === roleId);
      // setSelectedRole(selectedRoleData || null);
    }
    // Perform any additional logic here based on the selected option
  };

  return (
    <React.Fragment>
      <Row className="g-2 mb-4">
        <Col sm={4}>
          <div className="d-flex justify-content-between mb-4">
            <h5>User Management</h5>
          </div>
        </Col>
        <Col className="col-sm-auto ms-auto align-botto">
          {/* <div className="list-grid-nav hstack gap-3">
            <Button
              color="success"
              onClick={handleAddButtonClick}
            >
              <i className="ri-add-fill me-1 align-bottom"></i> Add User
            </Button>
          </div> */}
        </Col>
      </Row>
      {showLoader ? (
        <Loader />
      ) : (
        <TableContainer
          divClass="table-responsive table-card"
          columns={columns}
          data={userData}
          isGlobalFilter={true}
          customPageSize={limit}
          totalPages={selectedTotalPages ?? 0}
          searchText={handleSearchText}
          totalItems={selectedTotalItems ?? 0}
          currentPageIndex={selectedCurrentPage ?? 0}
          SearchPlaceholder="Search..."
          onChangeIndex={handlePageChange}
        />
      )}

      {/* Modal for adding/updating users */}
      <Modal isOpen={modal} toggle={toggleModal} centered
        backdrop="static" // Prevents closing on outside click
      >
        <ModalHeader
          className="modal-title"
          id="myModalLabel"
          toggle={() => {
            toggleModal();
          }}
        >
          {isEditing ? "Update User" : "Add User"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={12}>
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <div className="position-absolute bottom-0 end-0">
                      <Label htmlFor="profile-image-input" className="mb-0">
                        <div className="avatar-xs">
                          <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                            <i className="ri-image-fill"></i>
                          </div>
                        </div>
                      </Label>
                      <Input
                        type="file"
                        className="form-control d-none"
                        id="profile-image-input"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={handleImageChange}
                      />
                    </div>
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
                          src={selectedImage instanceof File ? URL.createObjectURL(selectedImage) : newUser?.profile_photo ? newUser?.profile_photo : Profile}
                          alt="Profile"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Username */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="username" className="form-label">
                    User Name
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Enter User name"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.username && formik.errors.username
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="invalid-feedback">
                      {formik.errors.username}
                    </div>
                  )}
                </div>
              </Col>

              {/* First Name */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="firstname" className="form-label">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="Enter First Name"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.firstname && formik.errors.firstname
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <div className="invalid-feedback">
                      {formik.errors.firstname}
                    </div>
                  )}
                </div>
              </Col>

              {/* Last Name */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="lastname" className="form-label">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Enter Last Name"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.lastname && formik.errors.lastname
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <div className="invalid-feedback">
                      {formik.errors.lastname}
                    </div>
                  )}
                </div>
              </Col>

              {/* Address */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="address" className="form-label">
                    Address
                  </Label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Enter Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                </div>
              </Col>

              {/* Email */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="email" className="form-label">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    autoComplete="off"
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
              </Col>

              {/* Mobile Number */}
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="mobile_number" className="form-label">
                    Mobile Number
                  </Label>
                  <Input
                    type="tel"
                    id="mobile_number"
                    placeholder="Enter Mobile Number"
                    value={formik.values.mobile_number}
                    onChange={handlePhoneChange}
                    onKeyDown={handleKeyDown}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.mobile_number &&
                        formik.errors.mobile_number
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.mobile_number &&
                    formik.errors.mobile_number && (
                      <div className="invalid-feedback">
                        {formik.errors.mobile_number}
                      </div>
                    )}
                </div>
              </Col>

              {/* Password */}
              {!newUser?.id && (
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="password-input" className="form-label">
                      Password
                    </Label>
                    <div className="position-relative auth-pass-inputgroup mb-3">
                      <Input
                        type={passwordShow ? "text" : "password"}
                        className={`form-control ${formik.touched.password && formik.errors.password
                          ? "is-invalid"
                          : ""
                          }`}
                        id="password"
                        placeholder="Enter your password"
                        value={formik.values.password}
                        autoComplete="new-password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                        type="button"
                        onClick={() => setPasswordShow(!passwordShow)}
                      >
                        <i className="ri-eye-fill align-middle"></i>
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                </Col>
              )}
              {/* Role ID */}
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="role" className="form-label">
                    Role
                  </Label>
                  <select className="form-select"
                    value={formik.values.RoleId}
                    onChange={handleRoleChange}>
                    <option value="">Select a role</option>
                    {roleData.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.RoleId && formik.errors.RoleId && (
                    <div className="invalid-feedback">
                      {formik.errors.RoleId}
                    </div>
                  )}
                </div>
              </Col>

              {/* Salon ID */}
              {/* <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="salon" className="form-label">
                    Salon
                  </Label>
                  <select className="form-select"
                    value={formik.values.SalonId}
                    onChange={handleSalonChange}>
                    <option value="">Select a salon</option>
                    {salonData.map((salon) => (
                      <option key={salon.salon_id} value={salon.salon_id}>
                        {salon.salon_name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.SalonId && formik.errors.SalonId && (
                    <div className="invalid-feedback">
                      {formik.errors.SalonId}
                    </div>
                  )}
                </div>
              </Col> */}
            </Row>
            {/* Add/Update Buttons */}
            <div className="text-end">
              <Button color="light" onClick={toggleModal}>
                Cancel
              </Button>
              <Button type="submit" color="success" className="ms-2"
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
          </Form>
        </ModalBody>
      </Modal>
      <DeleteModal
        show={deleteModal}
        showSpinner={showSpinner}
        onDeleteClick={handleDeleteUser}
        onCloseClick={toggleDeleteModal}
        recordId={
          selectedUserId !== null ? selectedUserId.toString() : undefined
        }
      // Convert to string or undefined
      />
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default UserTable;
