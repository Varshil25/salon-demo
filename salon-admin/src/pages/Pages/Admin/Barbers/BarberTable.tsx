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
  fetchBarber,
  addBarber,
  deleteBarber,
  updateBarber,
} from "Services/barberService";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "Components/Common/Loader";

// Define the User type based on your database structure
interface Barber {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  mobile_number: string; // Allow undefined if that's the case in the imported type
  email: string;
  password: string;
  availability_status: string; // Add this line
  default_service_time: number;
  photo: string;
  cutting_since?: string;
  background_color?: string;
  organization_join_date?: string;
  SalonId: number;
  salon: any;
  default_start_time:string;
  default_end_time:string;
  UserId: number;
  user: any;
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

export const BARBER_ENDPOINT = "/barber";
export const SALON_ENDPOINT = "/salon";

const BarberTable: React.FC = () => {
  const [barberData, setBarberData] = useState<Barber[]>([]);
  const [filteredData, setFilteredData] = useState<Barber[]>([]);
  const [salonData, setSalonData] = useState<Salon[]>([]);
  const [modal, setModal] = useState(false);
  const [newBarber, setNewBarber] = useState<Barber | null>(null);

  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null); // State for the user to delete
  const [errors, setErrors] = useState<any>({});

  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedSalonId, setSelectedSalonId] = useState<number>();
  const [passwordShow, setPasswordShow] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // Track if we are editing
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState(true);
  const [barberId, setBarberId] = useState<number | null>(null);
  const [selectedCurrentPage, setCurrentPage] = useState<number | null>(0);
  const [selectedTotalItems, setTotalItems] = useState<number | null>(0);
  const [selectedTotalPages, setTotalPages] = useState<number | null>(0);
  const [selectedSearchText, selectedSearch] = useState<null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().split("T")[0];

  const limit = 10; // Items per page

  // Toggle modal visibility
  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    fetchBarbersList(1, null);

    const fetchSalons = async () => {
      try {
        const response: any = await axios.get(SALON_ENDPOINT);
        setSalonData(response);
      } catch (error) {
        console.error("Error fetching salon:", error);
      }
    };

    fetchSalons();
  }, []);

  const fetchBarbersList = async (page: any, search: any) => {

    try {
   
      const response: any = await fetchBarber(page === 0 ? 1 : page, limit, search ?? null);

      setTotalItems(response?.totalItems);
      setTotalPages(response?.totalPages);
      const barbers = response.barbers.map((barber: any) => {
        return {
          ...barber,
          displayName: `${barber.name} (${barber.availability_status})`,
        };
      });
      setBarberData(barbers);

      if (barberData?.length === 0) {
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
  }

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

  const handelColorChange = (e: any) => {
    formik.setFieldValue("background_color", e.target.value);
  };

  const barberSchema = (isEdit = false) =>
    Yup.object().shape({
      firstname: Yup.string().required("First name is required"), // Add this line
      lastname: Yup.string().required("Last name is required"), // Add this line
      mobile_number: Yup.string()
        .matches(
          /^(?:\(\d{3}\)\s?|\d{3}-?)\d{3}-?\d{4}$/,
          "Mobile number must be 10 digits"
        ) // Validation for digits only
        .required("Mobile number is required"), // Add this line
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: isEdit
        ? Yup.string()
        : Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"), // Add this line
      address: Yup.string().required("Address is required"), // Add this line
      availability_status: Yup.string().required("Status is required"),
      default_service_time: Yup.number()
        .min(1, "Service time must be at least 1 minute")
        .required("Default service time is required"),
      // created_at: Yup.date().required("Creation date is required"),
      cutting_since: Yup.date().required("Cutting since date is required"),
      organization_join_date: Yup.date().required(
        "Organization join date is required"
      ),
      SalonId: Yup.number().required("Salon is required"),
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: newBarber?.id || null,
      firstname: newBarber?.user?.firstname || "",
      lastname: newBarber?.user?.lastname || "",
      email: newBarber?.user?.email || "",
      mobile_number: newBarber?.user?.mobile_number || "",
      address: newBarber?.user?.address || "",
      password: newBarber?.user?.password ?? "",
      availability_status: newBarber?.availability_status || "",
      default_start_time: newBarber?. default_start_time || "",
      default_end_time: newBarber?.default_end_time || "",
      default_service_time: newBarber?.default_service_time || 0,
      cutting_since: newBarber?.cutting_since ? new Date(newBarber.cutting_since).toISOString().split("T")[0] : "",
      organization_join_date: newBarber?.organization_join_date ? new Date(newBarber.organization_join_date).toISOString().split("T")[0] : "",
      photo: newBarber?.photo ?? Profile,
      SalonId: newBarber?.SalonId ?? 0,
      background_color: newBarber?.background_color,
    },
    validationSchema: barberSchema(newBarber?.id ? true : false),
    onSubmit: (values) => {

      setShowSpinner(true);
      // Prepare FormData object
      if (values.id !== null) {
        handleUpdateBarber(values.id, values);
      } else {
        handleAddBarber(values);
      }
    },
  });

  // Search functionality
  // const searchList = (searchTerm: string) => {
  //   const filtered = barberData.filter(
  //     (barber) =>
  //       barber.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       barber.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredData(filtered);
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Save the file object directly
      // formik.setFieldValue('photo', file);
    }
  };

  // Add new user function
  const handlePageChange = (pageIndex: number) => {
    const total = pageIndex + 1;
    setCurrentPage(pageIndex);
    setShowLoader(true);
    fetchBarbersList(total, selectedSearchText);
    console.log('Current Page Index:', pageIndex);
    // Handle page change logic here
  };

  const handleSearchText = (search: any) => {
    selectedSearch(search);
    fetchBarbersList(selectedCurrentPage, search);
    // Handle page change logic here
  };

  const handleAddBarber = async (values: any) => {

    try {
      const formData = new FormData();

      // Append form values to FormData
      // formData.append("photo", selectedImage || Profile);
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("address", values.address);
      formData.append("email", values.email);
      formData.append("mobile_number", values.mobile_number);
      formData.append("password", values.password);
      formData.append("availability_status", values.availability_status);
      formData.append("default_start_time", values. default_start_time);
      formData.append("default_end_time", values.default_end_time);
      formData.append("default_service_time", String(values.default_service_time));
      formData.append("cutting_since", values.cutting_since || "");
      formData.append("organization_join_date", values.organization_join_date || "");
      formData.append("background_color", values.background_color);
      formData.append("photo", selectedImage ?? Profile); // If a new image is selected
      formData.append("SalonId", (values.SalonId ?? 0).toString());

      // API call to add barber
      const newAdded = await addBarber(formData);
      if (newAdded) {
        // Fetch and update the salon list
        const message = "Barber added successfully.";
        toast.success(message, { autoClose: 3000 });
        setShowSpinner(false);
        fetchBarbersList(1, null);
        // setTimeout(async () => {
        //   const updatedBarber = await fetchBarber(1, limit, selectedSearchText);
        //   const barbers = updatedBarber.barbers.map((item: any) => ({
        //     ...item,
        //     fullname: `${item.user.firstname} ${item.user.lastname}`,
        //   }));
        //   // Use the message from the backend response

        //   
        //   // const newBarber = newAdded.barber;
        //   // newBarber.fullname = `${newBarber.firstname} ${newBarber.lastname}`;

        //   setBarberData(barbers);
        // }, 500);

        toggleModal();
        formik.resetForm();
      }

    } catch (error: any) {
      // Use dynamic error message from the backend
      const errorMessage =
        error.response?.data?.message ||
        error?.message ||
        "Failed to add barber. Please try again.";
      toast.error(errorMessage, { autoClose: 3000 });

      console.error("Error adding barber:", error);
    }
  };



  const handleUpdateBarber = async (id: number, updatedBarberData: any) => {

    try {
      const formData = new FormData();

      formData.append("photo", selectedImage ?? Profile); // If a new image is selected
      formData.append("id", updatedBarberData.id.toString());
      formData.append("firstname", updatedBarberData.firstname);
      formData.append("lastname", updatedBarberData.lastname);
      formData.append("address", updatedBarberData.address);
      formData.append("email", updatedBarberData.email);
      formData.append("mobile_number", updatedBarberData.mobile_number);
      formData.append("password", updatedBarberData.password);
      formData.append("default_start_time", updatedBarberData.default_start_time);
      formData.append("default_end_time", updatedBarberData.default_end_time);

      formData.append("background_color", updatedBarberData.background_color);
      formData.append(
        "availability_status",
        updatedBarberData.availability_status
      );
      formData.append(
        "default_service_time",
        String(updatedBarberData.default_service_time)
      );
      formData.append("cutting_since", formatDate(updatedBarberData.cutting_since));
      formData.append("organization_join_date", formatDate(updatedBarberData.organization_join_date));

      formData.append(
        "SalonId",
        (updatedBarberData.SalonId ?? updatedBarberData.SalonId ?? 0).toString()
      );

      await updateBarber(id, formData);

      toast.success("Barber updated successfully", { autoClose: 3000 });

      // const response = await fetchBarber(1, limit, selectedSearchText);
      // const barbers = response.barbers.map((item: any) => ({
      //   ...item,
      //   fullname: `${item.user.firstname} ${item.user.lastname}`,
      // }));
      // setBarberData(barbers);
      setShowSpinner(false);
      fetchBarbersList(1, null);
      // 
      toggleModal();
      // const barber = updatedBarber.map((usr: any) => {
      //   return {
      //     ...usr,
      //     fullname: `${usr.firstname} ${usr.lastname}`, // Add fullname property
      //   };
      // });

      // setFilteredData(barber); // Update your barber state here
    } catch (error) {
      console.error("Error updating barber list:", error);
    }
  };

  // Set user data for editing
  const handleEditBarber = (barber: Barber) => {

    setSelectedSalonId(barber.SalonId);
    setSelectedImage(barber.photo ?? Profile); // Use user's profile image or default
    setNewBarber(barber); // Set the user to be updated
    setIsEditing(true); // Toggle edit mode
    toggleModal(); // Open the modal for editing
  };

  // Delete user function
  const handleDeleteBarber = async () => {
    setShowSpinner(true);
    if (selectedBarberId !== null) {
      try {
        await axios.delete(`${BARBER_ENDPOINT}/${selectedBarberId}`);

        // Remove the deleted user from the local state
        // setBarberData((prevData) =>
        //   prevData.filter((barber) => barber.id !== selectedBarberId)
        // );

        toast.success("Barber deleted successfully", { autoClose: 3000 });
        setShowSpinner(false);
        fetchBarbersList(1, null);
        setDeleteModal(false); // Close the delete confirmation modal
        setSelectedBarberId(null); // Reset selected user ID
      } catch (error) {
        console.error("Error deleting barber:", error);
      }
    }
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return ""; // Return an empty string if dateString is invalid

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return an empty string if date is invalid

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  
  const formatHours = (timeString: string) => {
    const padZero = (num: number) => String(num).padStart(2, "0");
    
    // Split the time string into hours, minutes, and seconds
    const [hoursStr, minutesStr] = timeString.split(":");
    
    let hours = parseInt(hoursStr, 10);
    const minutes = padZero(parseInt(minutesStr, 10));
    const ampm = hours >= 12 ? "PM" : "AM";
  
    // Convert to 12-hour format
    hours = hours % 12 || 12;
  
    return `${padZero(hours)}:${minutes} ${ampm}`;
  };
  
  
  const columns = useMemo(
    () => [
      {
        header: "Photo",
        accessorKey: "photo",
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
      {
        header: "Salon",
        accessorKey: "salon.name", // Add SalonId column for "Salon Name"
        enableColumnFilter: false,
      },
      {
        header: "Full Name",
        accessorKey: "name",
        enableColumnFilter: false,
      },

      // {
      //   header: "Last Name",
      //   accessorKey: "lastname",
      //   enableColumnFilter: false,
      // },
      {
        header: "Status",
        accessorKey: "availability_status",
        enableColumnFilter: false,
      },
      {
        header: "Default Service Time (min)",
        accessorKey: "default_service_time",
        enableColumnFilter: false,
      },
      {
        header: "Available Time",
        accessorKey: "availabe_time",
        enableColumnFilter: false,
        cell: ({ row }: { row: { original: {default_start_time: string; default_end_time: string } } }) => {
          const { default_start_time, default_end_time } = row.original; // Access start_time and end_time
          return `${default_start_time ? formatHours(default_start_time) : 'null'} - ${default_end_time ? formatHours(default_end_time) : 'null'}`; // Combine and display
        },
      },
      {
        header: "Color Code",
        accessorKey: "background_color",
        enableColumnFilter: false,

        cell: (cell: { getValue: () => number; row: { original: Barber } }) => (
          <div
            style={{
              backgroundColor: cell.row.original.background_color,
              height: "20px",
              width: "50px",
            }}
            onClick={() => handleEditBarber(cell.row.original)} // Pass the entire user object
          >
          </div>
        ),
      },
      {
        header: "Cutting Since",
        accessorKey: "cutting_since",
        enableColumnFilter: false,
        cell: (cell: { getValue: () => string }) => formatDate(cell.getValue()),
      },
      {
        header: "Join Date",
        accessorKey: "organization_join_date",
        enableColumnFilter: false,
        cell: (cell: { getValue: () => string }) => formatDate(cell.getValue()),
      },
      {
        header: "Actions",
        accessorKey: "id",
        enableColumnFilter: false,

        cell: (cell: { getValue: () => number; row: { original: Barber } }) => (
          <div>
            <i
              className="ri-edit-2-fill"
              style={{
                cursor: "pointer",
                marginRight: "20px",
                color: "grey",
                fontSize: "20px",
              }}
              onClick={() => handleEditBarber(cell.row.original)} // Pass the entire user object
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
    [barberData]
  );

  const handleAddButtonClick = () => {
    
    setNewBarber(null);
    setModal(true);
  };
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal); // Toggle the delete modal visibility
  };

  const onClickDelete = (user: Barber) => {

    setSelectedBarberId(user.id); // Set the selected role ID for deletion
    setDeleteModal(true); // Open the delete modal
  };

  const handleSalonChange = (event: any) => {
    if (event.target.value) {
      const salonId = Number(event.target.value);
      formik.setFieldValue("SalonId", salonId);
      // setSelectedSalonId(salonId);
      // // let selectedSalonData: Salon | null;
      // const selectedSalonData = salonData.find((salon) => salon.salon_id === salonId);
      // setSelectedSalon(selectedSalonData || null);
    }
    // Perform any additional logic here based on the selected option
  };
  //   const handleRoleChange = (event: any) => {
  //     if (event.target.value) {
  //       const roleId = Number(event.target.value);
  //       formik.setFieldValue('RoleId', roleId);
  //       // setSelectedRoleId(roleId);
  //       // // let selectedSalonData: Salon | null;
  //       // const selectedRoleData = roleData.find((role) => role.id === roleId);
  //       // setSelectedRole(selectedRoleData || null);
  //     }
  //     // Perform any additional logic here based on the selected option
  //   };

  return (
    <React.Fragment>
      <Row className="g-2 mb-4">
        <Col sm={4}>
          <div className="d-flex justify-content-between mb-4">
            <h5>Barber Management</h5>
          </div>
        </Col>
        <Col className="col-sm-auto ms-auto align-botto">
          <div className="list-grid-nav hstack gap-3">
            <Button color="success" onClick={handleAddButtonClick}>
              <i className="ri-add-fill me-1 align-bottom"></i> Add Barber
            </Button>
          </div>
        </Col>
      </Row>
      {showLoader ? (
        <Loader />
      ) : (
        <TableContainer
          columns={columns}
          data={barberData}
          isGlobalFilter={true}
          customPageSize={limit}
          totalPages={selectedTotalPages ?? 0}
          searchText={handleSearchText}
          totalItems={selectedTotalItems ?? 0}
          currentPageIndex={selectedCurrentPage ?? 0}
          divClass="table-responsive table-card"
          SearchPlaceholder="Search..."
          onChangeIndex={handlePageChange}
        />
      )}

      {/* Modal for adding/updating users */}
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        centered
        backdrop="static" // Prevents closing on outside click
      >
        <ModalHeader
          className="modal-title"
          id="myModalLabel"
          toggle={() => {
            toggleModal();
          }}
        >
          {isEditing ? "Update Barber" : "Add Barber"}
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
                          src={
                            selectedImage instanceof File
                              ? URL.createObjectURL(selectedImage)
                              : newBarber?.photo
                                ? newBarber?.photo
                                : Profile
                          }
                          alt="Profile"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Salon ID */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="salon" className="form-label">
                    Salon Name
                  </Label>
                  <select
                    className="form-select"
                    value={formik.values.SalonId}
                    onChange={handleSalonChange}
                  >
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
              </Col>

              {/* Username */}
              {/* <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="firstname" className="form-label">
                  First Name
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="Enter first name"
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
              </Col> */}

              {/* First Name */}
              <Col lg={6}>
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
                      {typeof formik.errors.firstname === "string"
                        ? formik.errors.firstname
                        : ""}
                    </div>
                  )}
                </div>
              </Col>

              {/* Last Name */}
              <Col lg={6}>
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
                      {typeof formik.errors.lastname === "string"
                        ? formik.errors.lastname
                        : ""}
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
                    className={
                      formik.touched.address && formik.errors.address
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.address && formik.errors.address && (
                    <div className="invalid-feedback">
                      {typeof formik.errors.address === "string"
                        ? formik.errors.address
                        : ""}
                    </div>
                  )}
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
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    className={
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {typeof formik.errors.email === "string"
                        ? formik.errors.email
                        : ""}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="open_time" className="form-label">
                   Start Time
                  </Label>
                  <Input
                    type="time"
                    className={`form-control ${formik.touched.default_start_time && formik.errors.default_start_time
                      ? "is-invalid"
                      : ""
                      }`}
                    id="default_start_time"
                    value={formik.values.default_start_time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.default_start_time && formik.errors.default_start_time && (
                    <div className="text-danger">{formik.errors.default_start_time}</div>
                  )}
                </div>
              </Col>

              {/* Closing Time */}
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="close_time" className="form-label">
                    End Time
                  </Label>
                  <Input
                    type="time"
                    className={`form-control ${formik.touched.default_end_time && formik.errors.default_end_time
                      ? "is-invalid"
                      : ""
                      }`}
                    id="default_end_time"
                    value={formik.values.default_end_time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.default_end_time && formik.errors.default_end_time && (
                    <div className="text-danger">
                      {formik.errors.default_end_time}
                    </div>
                  )}
                </div>
              </Col>


              {/* Mobile Number */}

              <Col lg={12}>
                {/* Availability Status Field */}
                <div className="mb-3">
                  <Label htmlFor="availability_status" className="form-label">
                    Availability Status
                  </Label>
                  <Input
                    type="select"
                    id="availability_status"
                    value={formik.values.availability_status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.availability_status &&
                        formik.errors.availability_status
                        ? "is-invalid"
                        : ""
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="running">Running</option>
                  </Input>
                  {formik.touched.availability_status &&
                    formik.errors.availability_status && (
                      <div className="invalid-feedback">
                        {typeof formik.errors.availability_status === "string"
                          ? formik.errors.availability_status
                          : ""}
                      </div>
                    )}
                </div>
              </Col>

              <Col lg={12}>
                {/* Default Service Time Field */}
                <div className="mb-3">
                  <Label htmlFor="default_service_time" className="form-label">
                    Default Service Time (in minutes)
                  </Label>
                  <Input
                    type="number"
                    id="default_service_time"
                    placeholder="Enter Default Service Time"
                    value={formik.values.default_service_time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.default_service_time &&
                        formik.errors.default_service_time
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.default_service_time &&
                    formik.errors.default_service_time && (
                      <div className="invalid-feedback">
                        {typeof formik.errors.default_service_time === "string"
                          ? formik.errors.default_service_time
                          : ""}
                      </div>
                    )}
                </div>
              </Col>

              {/* Password */}

              {!newBarber?.id && (
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="new-password"
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
                        {typeof formik.errors.password === "string"
                          ? formik.errors.password
                          : ""}
                      </div>
                    )}
                  </div>
                </Col>
              )}

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

                  <div className="invalid-feedback">
                    {typeof formik.errors.mobile_number === "string"
                      ? formik.errors.mobile_number
                      : ""}
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="background_color" className="form-label">
                    Backgound Color
                  </Label>
                  <Input
                    type="color"
                    id="background_color"
                    name="background_color"
                    value={formik.values.background_color}
                    onChange={handelColorChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.background_color &&
                        formik.errors.background_color
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.background_color &&
                    formik.errors.background_color && (
                      <div className="invalid-feedback">
                        {typeof formik.errors.background_color === "string"
                          ? formik.errors.background_color
                          : ""}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="cutting_since" className="form-label">
                    Cutting Since
                  </Label>
                  <Input
                    type="date"
                    id="cutting_since"
                    name="cutting_since"
                    value={formik.values.cutting_since}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    max={today} // Disable future dates
                    className={
                      formik.touched.cutting_since &&
                        formik.errors.cutting_since
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.cutting_since &&
                    formik.errors.cutting_since && (
                      <div className="invalid-feedback">
                        {typeof formik.errors.cutting_since === "string"
                          ? formik.errors.cutting_since
                          : ""}
                      </div>
                    )}
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Label
                    htmlFor="organization_join_date"
                    className="form-label"
                  >
                    Organization Join Date
                  </Label>
                  <Input
                    type="date"
                    id="organization_join_date"
                    name="organization_join_date"
                    value={formik.values.organization_join_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    max={today} // Disable future dates
                    className={
                      formik.touched.organization_join_date &&
                        formik.errors.organization_join_date
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.organization_join_date &&
                    formik.errors.organization_join_date && (
                      <div className="invalid-feedback">
                        {typeof formik.errors.organization_join_date ===
                          "string"
                          ? formik.errors.organization_join_date
                          : ""}
                      </div>
                    )}
                </div>
              </Col>

              {/* Role ID */}
              {/* <Col lg={6}>
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
        onDeleteClick={handleDeleteBarber}
        onCloseClick={toggleDeleteModal}
        recordId={
          selectedBarberId !== null ? selectedBarberId.toString() : undefined
        }
      // Convert to string or undefined
      />
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default BarberTable;
