import React, { useState, useEffect, useMemo, useCallback } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import Select from "react-select";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import {
  fetchAppointments,
  createAppointment,
  deleteAppointment,
} from "../../../../Services/AppointmentService";

// Import Scroll Bar - SimpleBar
import SimpleBar from "simplebar-react";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import moment from "moment";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  Row,
  Label,
  Input,
  Button,
  ModalHeader,
  FormFeedback,
  Form,
  Spinner,
} from "reactstrap";

// import {
//   getTaskList,
//   addNewTask,
//   updateTask,
//   deleteTask,
// } from "../../../../slices/thunks";

import {
  UserID,
  BarberID,
  DeviceId,
  SalonId,
  NumberOfPeople,
  EstimatTime,
  CreatedDate,
  Status,
  Position,
} from "./AppointmentListCol";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../Components/Common/Loader";
import { createSelector } from "reselect";

import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../../assets/images/users/avatar-3.jpg";
import avatar5 from "../../../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../../../assets/images/users/avatar-8.jpg";
import avatar10 from "../../../../assets/images/users/avatar-10.jpg";
import axios from "axios";
import { fetchBarber } from "Services/barberService";
import { fetchServices } from "Services/Service";
import { Service } from "Services/type";
import { fetchBarberSession, getBarberSessionByBarber } from "Services/BarberSessionService";

const Assigned = [
  { id: 1, imgId: "anna-adame", img: avatar1, name: "Anna Adame" },
  { id: 2, imgId: "frank-hook", img: avatar3, name: "Frank Hook" },
  { id: 3, imgId: "alexis-clarke", img: avatar6, name: "Alexis Clarke" },
  { id: 4, imgId: "herbert-stokes", img: avatar2, name: "Herbert Stokes" },
  { id: 5, imgId: "michael-morris", img: avatar7, name: "Michael Morris" },
  { id: 6, imgId: "nancy-martino", img: avatar5, name: "Nancy Martino" },
  { id: 7, imgId: "thomas-taylor", img: avatar8, name: "Thomas Taylor" },
  { id: 8, imgId: "tonya-noble", img: avatar10, name: "Tonya Noble" },
];

export const APPOINTMENT_ENDPOINT = "/appointments";
export const BARBER_ENDPOINT = "/barber";
export const SALON_ENDPOINT = "/salon";

const AppointmentTable: React.FC = () => {
  const [appointmentData, setAppointmentData] = useState<[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [serviceData, setServiceData] = useState<Service[]>([]);
  const [serviceOptions, setServiceOptions] = useState<Service[]>([]);

  const [salonData, setSalonData] = useState<Salon[]>([]);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [selectedSearchText, selectedSearch] = useState<null>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  // const [newAppointment, setNewAppointment] = useState<Appointment | null>(null);

  const [showLoader, setShowLoader] = useState(true);
  const dispatch: any = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const selectLayoutState = (state: any) => state.Tasks;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    taskList: state.taskList,
    isTaskSuccess: state.isTaskSuccess,
    error: state.error,
    isTaskAdd: state.isTaskAdd,
    isTaskAddFail: state.isTaskAddFail,
    isTaskDelete: state.isTaskDelete,
    isTaskDeleteFail: state.isTaskDeleteFail,
    isTaskUpdate: state.isTaskUpdate,
    isTaskUpdateFail: state.isTaskUpdateFail,
  }));

  // Inside your component
  const { taskList, isTaskSuccess, error } = useSelector(
    selectLayoutProperties
  );

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [appointment, setAppointment] = useState<any>([]);
  const [barberSessionsData, setBarberSessionsData] = useState<any>(null);
  const [TaskList, setTaskList] = useState<any>([]);

  // Delete Task
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [isAppointmentAvailable, setIsAppointmentAvailable] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);
  const [selectedCurrentPage, setCurrentPage] = useState<number | null>(0);
  const [selectedTotalServiceTime, setTotalServiceTime] = useState<number | null>(0);
  const [selectedStartDate, setStartDate] = useState<any>(new Date());
  const [selectedEndDate, setEndDate] = useState<any>(new Date());
  const [selectedStatus, setStatus] = useState<any>("");
  const [selectedTotalItems, setTotalItems] = useState<number | null>(0);
  const [selectedTotalPages, setTotalPages] = useState<number | null>(0);

  const limit = 10; // Items per page
  const userRole = localStorage.getItem("userRole");
  let storeRoleInfo: any;
  if (userRole) {
    storeRoleInfo = JSON.parse(userRole);
  }
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setAppointment(null);
      setSelectedOptions([]);
      formik.resetForm();
    } else {
      setModal(true);
    }
  }, [modal]);

  const handleServiceChange = (selected: any) => {
    setSelectedOptions(selected);
    const totalServiceTime = selected?.reduce(
      (sum: any, item: any) => sum + item.default_service_time,
      0
    );
    setTotalServiceTime(totalServiceTime);
    const valuesArray = selected.map((serv: any) => parseInt(serv.value, 10));
    formik.setFieldValue("service_ids", valuesArray);
    if (totalServiceTime > 0) {
      getBarberScheduleData(selectedBarberId, totalServiceTime);
    } else {
      toast.warning("Please first select atleast one service!!!");
      setIsAppointmentAvailable(false);
    }
    console.log("Selected options:", selected);
  };

  // Custom styles for react-select
  const customStyles = {
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#cce5ff", // Change background color of selected options
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#0056b3", // Change text color of selected options
      fontWeight: "500",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#0056b3",
      ":hover": {
        backgroundColor: "#d1ecf1",
        color: "#004085",
      },
    }),
  };

  interface Salon {
    salon_id: number;
    salon_name: string;
    availability_status: string; // Field for availability status
    photos: number; // Field for default service time
    creappointment_countted_at: string;
    address: string; // Fixed typo here
    barbers?: object; // Add this line
  }

  interface BarberSessions {
    id: number;
    BarberId: number;
    SalonId: number;
    start_time: string; // Field for availability status
    end_time: string; // Field for default service time
    remaining_time: string;
    barber?: object; // Add this line
  }

  interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    address: string;
    mobile_number?: string;
    email: string;
    google_token?: string;
    apple_token?: string;
    password?: string;
    RoleId: number;
    created_at: string;
    SalonId: number;
    profile_photo?: string;
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return ""; // Return an empty string if dateString is invalid

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return an empty string if date is invalid

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  };

  const otherFormatDate = (dateString: any) => {
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

  useEffect(() => {
    fetchAppointmentList(
      1,
      selectedStartDate,
      selectedEndDate,
      selectedStatus,
      ""
    );

    // const fetchBarbersList = async () => {
    //   try {
    //     const response: any = await fetchBarber(1, 100, null);
    //     // const response: any = await axios.get(BARBER_ENDPOINT);
    //     const activeBarber = response.barbers.filter(
    //       (bar: any) => bar.availability_status === "available"
    //     );
    //     setBarberData(activeBarber);
    //     if (storeRoleInfo.role_name !== "Admin") {
    //       setSalonBarberData(response.barbers);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching barbers:", error);
    //   }
    // };

    // fetchBarbersList();

    const fetchSalons = async () => {
      try {
        const response: any = await axios.get(SALON_ENDPOINT);
        setSalonData(response);
      } catch (error) {
        console.error("Error fetching salon:", error);
      }
    };

    fetchSalons();
    fetchServiceList();
  }, []);

  const getBarberSessionsData = async (salonId: any) => {
    try {
      const response: any = await fetchBarberSession(salonId);
      if (response?.barberSessions?.length > 0) {
        let barberArray: any = [];
        response.barberSessions.map((brbr: any) => {
          const obj = { id: brbr.barber.id, name: brbr.barber.name, start_time: brbr.start_time, end_time: brbr.end_time };
          barberArray.push(obj);
        })
        setBarberSessionsData(barberArray);
        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 5000); // Hide loader after 5 seconds
        return () => clearTimeout(timer); // Clear timer if component unmounts or salonData changes
        // const barberArray = response.barberSessions.map((item: any) => item.barber);

      } else {
        setBarberSessionsData([]);
        setIsAppointmentAvailable(false);
        setShowLoader(false); // Immediately hide loader if data is available

      }
    } catch (error) {
      console.error("Error fetching barbers:", error);
    }
  }

  const fetchAppointmentList = async (
    page: any,
    startDate: any,
    endDate: any,
    status: any,
    search: any
  ) => {
    try {
      // const response: any = await axios.get(APPOINTMENT_ENDPOINT);
      const response: any = await fetchAppointments(
        page === 0 ? 1 : page,
        limit,
        otherFormatDate(startDate),
        otherFormatDate(endDate),
        status ? status : "",
        search
      );
      // setCurrentPage(response?.currentPage ? parseInt(response?.currentPage) : 1);
      const appointments = response.appointments.map((usr: any) => {
        usr.fullname = usr.User.firstname + " " + usr.User.lastname;
        return usr;
      });
      setTotalItems(response?.totalItems);
      setTotalPages(response?.totalPages);
      setAppointmentData(appointments);
      if (appointmentData?.length === 0) {
        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 500); // Hide loader after 5 seconds
        return () => clearTimeout(timer); // Clear timer if component unmounts or salonData changes
      } else {
        setShowLoader(false); // Immediately hide loader if data is available
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchServiceList = async () => {
    try {
      const response: any = await fetchServices();
      const activeServices = response?.filter(
        (serv: any) => serv.isActive === true
      );
      setServiceData(activeServices);
      if (activeServices?.length > 0) {
        const info = activeServices.map((ser: any) => ({
          value: ser.id.toString(), // Example: "apple"
          label: `${ser.name} - $${ser.price} (${ser.default_service_time} min.)`,
          price: ser.price,
          default_service_time: ser.default_service_time,
          // Example: "Apple"
        }));
        setServiceOptions(info);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  // Delete Data
  const handleDeleteTask = () => {
    if (appointment) {
      dispatch(deleteAppointment(appointment.id));
      setDeleteModal(false);
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

  // validation
  const formik = useFormik({
    initialValues: {
      salon_id: 0,
      service_ids: [],
      barber_id: 0,
      firstname: "",
      lastname: "",
      number_of_people: 1,
      email: "",
      mobile_number: "",
      address: "",
    },
    validationSchema: Yup.object({
      salon_id:
        storeRoleInfo?.role_name === "Admin"
          ? Yup.number()
          : Yup.number().required("Salon is required"), // Add this line
      barber_id:
        storeRoleInfo?.role_name === "Barber"
          ? Yup.number()
          : Yup.number().required("Barber is required"), // Add this line
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobile_number: Yup.string()
        .matches(
          /^(?:\(\d{3}\)\s?|\d{3}-?)\d{3}-?\d{4}$/,
          "Mobile number must be a valid 10-digit format"
        )
        .required("Mobile number is required"),
    }),
    onSubmit: (values) => {
      setShowSpinner(true);
      const processedValues = {
        ...values,
      };

      console.log("Submitted values:", processedValues);
      createAppointment(processedValues)
        .then((response) => {
          toast.success("Appointment created successfully", {
            autoClose: 3000,
          });
          setShowSpinner(false);
          toggle();
        })
        .catch((error) => {
          console.error("Error creating appointment:", error);
        });
    },
  });

  // Update Data
  const handleCustomerClick = useCallback(
    (arg: any) => {
      const appointment = arg;

      setAppointment({
        id: appointment.id,
        firstname: appointment.firstname,
        lastname: appointment.lastname,
        number_of_people: appointment.number_of_people,
        email: appointment.email,
        mobile_number: appointment.mobile_number,
        address: appointment.address,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // useEffect(() => {
  //   if (taskList && !taskList.length) {
  //     dispatch(getTaskList());
  //   }
  // }, [dispatch, taskList]);

  // useEffect(() => {
  //   setTaskList(taskList);
  // }, [taskList]);

  // useEffect(() => {
  //   if (!isEmpty(taskList)) {
  //     setTaskList(taskList);
  //     setIsEdit(false);
  //   }
  // }, [taskList]);

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".taskCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<any>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);

  const deleteMultiple = () => {
    const checkall: any = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element: any) => {
      dispatch(deleteAppointment(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".taskCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const columns = useMemo(
    () => [
      {
        header: "Full Name",
        accessorKey: "name",
        cell: (cell: any) => {
          return cell.getValue() ? cell.getValue() : "Unknown"; // Fallback if the barber is not found
        },
        enableColumnFilter: false,
      },
      {
        header: "Barber Name",
        accessorKey: "Barber.name",
        cell: (cell: any) => {
          return cell.getValue() ? cell.getValue() : "Unknown"; // Fallback if the barber is not found
        },
        enableColumnFilter: false,
      },
      {
        header: "Salon Name",
        accessorKey: "salon.name",
        enableColumnFilter: false,
      },
      {
        header: "Services",
        accessorKey: "services",
        enableColumnFilter: false,
        cell: ({ row }: any) => {
          return row.original.Services
            ?.map(
              (service: any) => `${service.name} (${service.default_service_time} min.)`
            )
            .join(", ");
        },
      },
      {
        header: "Available Time",
        accessorKey: "availabe_time",
        enableColumnFilter: false,
        cell: ({
          row,
        }: {
          row: { original: { Barber: any } };
        }) => {
          const { default_start_time, default_end_time } = row.original.Barber; // Access start_time and end_time
          return `${formatHours(default_start_time)} - ${formatHours(default_end_time)}`; // Combine and display
        },
      },
      {
        header: "Check In ",
        accessorKey: "check_in_time",
        cell: (cell: { getValue: () => string }) => formatDate(cell.getValue()),
        enableColumnFilter: false,
      },
      // {
      //   header: "Number Of People",
      //   accessorKey: "number_of_people",
      //   cell: (cell: any) => {
      //     return <NumberOfPeople {...cell} />;
      //   },
      //   enableColumnFilter: false,
      // },

      {
        header: "Status",
        accessorKey: "status",
        cell: (cell: any) => {
          return <Status {...cell} />;
        },
        enableColumnFilter: false,
      },

      // {
      //   header: "Queue Position",
      //   accessorKey: "queue_position",
      //   cell: (cell: any) => {
      //     return <Position {...cell} />;
      //   },
      //   enableColumnFilter: false,
      // },
    ],
    [handleCustomerClick, checkedAll]
  );

  const handleSalonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      const salonId = Number(event.target.value);
      setSelectedSalonId(salonId);
      formik.setFieldValue("salon_id", salonId);
      getBarberSessionsData(salonId);
    }
    console.log("Selected option:", event.target.value);
  };
  const handleBarberChange = async (event: any) => {
    if (event.target.value) {
      const selectedBarberId = Number(event.target.value);
      setSelectedBarberId(selectedBarberId);
      formik.setFieldValue("barber_id", selectedBarberId);
      if (selectedTotalServiceTime) {
        getBarberScheduleData(selectedBarberId, selectedTotalServiceTime);
      } else {
        formik.setFieldValue("barber_id", event.target.value);
        setIsAppointmentAvailable(false);
        toast.warning("Please first select atleast one service!!!");
      }
    }
  };

  const getBarberScheduleData = async (barberId: any, serviceTime: any) => {
    if (barberId && serviceTime) {
      const obj = {
        BarberId: barberId,
        service_time: serviceTime
      }
      const sessionResponse = await getBarberSessionByBarber(obj);
      if (sessionResponse) {
        if (parseInt(sessionResponse) === 102) {
          setIsAppointmentAvailable(true);
        } else {
          setIsAppointmentAvailable(false);
          // appointmentFormik.setFieldValue("barber_id", "")
          if (parseInt(sessionResponse) === 100) {
            toast.warning("Fully Booked!!!", {
              autoClose: 3000,
            });
          } else if (parseInt(sessionResponse) === 101) {
            toast.warning("Low Remaining Time!!!", {
              autoClose: 3000,
            });
          } else {
            toast.warning("Barber not available for longer!!!", {
              autoClose: 3000,
            });
          }
        }
      }
    }
  }

  const handleFilterData = (data: any) => {
    if (data) {
      setStartDate(data.dateRange[0]);
      setEndDate(data.dateRange[1]);
      setStatus(data.status);
    }
    fetchAppointmentList(
      selectedCurrentPage === 0 ? 1 : selectedCurrentPage,
      data?.dateRange[0],
      data?.dateRange[1],
      data?.status === "All" ? "" : data?.status,
      selectedSearchText ?? ""
    );
    console.log("Current Page Index:", data);
    // Handle page change logic here
  };
  const handlePageChange = (pageIndex: number) => {
    const total = pageIndex + 1;
    setCurrentPage(pageIndex);
    setShowLoader(true);
    fetchAppointmentList(
      total,
      selectedStartDate,
      selectedEndDate,
      selectedStatus,
      selectedSearchText ?? ""
    );
    console.log("Current Page Index:", pageIndex);
    // Handle page change logic here
  };

  const handleSearchText = (search: any) => {
    selectedSearch(search);
    fetchAppointmentList(
      selectedCurrentPage,
      selectedStartDate,
      selectedEndDate,
      selectedStatus,
      search
    );
    // Handle page change logic here
  };
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        showSpinner={showSpinner}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <div className="row">
        <Col lg={12}>
          <div className="card" id="tasksList">
            <div className="card-header border-0">
              <div className="d-flex align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">Appointments</h5>
                <div className="flex-shrink-0">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-primary add-btn me-1"
                      onClick={() => {
                        setIsEdit(false);
                        toggle();
                      }}
                    >
                      <i className="ri-add-line align-bottom me-1"></i> Create
                      Appointment
                    </button>
                    {isMultiDeleteButton && (
                      <button
                        className="btn btn-soft-danger"
                        onClick={() => setDeleteModalMulti(true)}
                      >
                        <i className="ri-delete-bin-2-line"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              {showLoader ? (
                <Loader />
              ) : (
                <TableContainer
                  columns={columns}
                  data={appointmentData || []}
                  isGlobalFilter={true}
                  customPageSize={limit}
                  totalPages={selectedTotalPages ?? 0}
                  totalItems={selectedTotalItems ?? 0}
                  currentPageIndex={selectedCurrentPage ?? 0}
                  selectedDateRange={[
                    selectedStartDate ?? new Date(),
                    selectedEndDate ?? new Date(),
                  ]}
                  selectedStatus={selectedStatus ?? ""}
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light text-muted"
                  isTaskListFilter={true}
                  SearchPlaceholder="Search by barber, salon or name"
                  filterData={handleFilterData}
                  searchText={handleSearchText}
                  onChangeIndex={handlePageChange}
                />
              )}
              <ToastContainer closeButton={false} limit={1} />
            </div>
          </div>
        </Col>
      </div>

      <Modal isOpen={modal} toggle={toggle} centered backdrop="static">
        <ModalHeader toggle={toggle}>Add Appointment</ModalHeader>
        <Form className="tablelist-form" onSubmit={formik.handleSubmit}>
          <ModalBody className="modal-body">
            <Row className="g-3">
              <Col lg={12}>
                <Label for="number_of_people-field" className="form-label">
                  Services
                </Label>
                <Select
                  isMulti
                  options={serviceOptions}
                  value={selectedOptions}
                  onChange={handleServiceChange}
                  styles={customStyles} // Apply custom styles
                  placeholder="Select services..."
                />
              </Col>

              {storeRoleInfo.role_name === "Admin" && (
                <Col lg={12}>
                  <div>
                    <Label htmlFor="salon" className="form-label">
                      Salon Name
                    </Label>
                    <select
                      className="form-select"
                      value={formik.values.salon_id}
                      onChange={handleSalonChange}
                    >
                      <option value="">Select a salon</option>
                      {salonData.map((salon) => (
                        <option key={salon.salon_id} value={salon.salon_id}>
                          {salon.salon_name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.salon_id && formik.errors.salon_id && (
                      <div className="invalid-feedback">
                        {formik.errors.salon_id}
                      </div>
                    )}
                  </div>
                </Col>
              )}
              {/* Barber ID */}
              {storeRoleInfo.role_name !== "Barber" && (
                <Col lg={12}>
                  <div>
                    <Label htmlFor="salon" className="form-label">
                      Barber Name
                    </Label>
                    <select
                      className="form-select"
                      value={formik.values.barber_id}
                      onChange={handleBarberChange}
                    >
                      <option value="">Select a barber</option>
                      {barberSessionsData?.map((barber: any) => (
                        <option key={barber.id} value={barber.id}>
                          {`${barber.name} - (${formatHours(barber.start_time)} to ${formatHours(barber.end_time)})`}
                        </option>
                      ))}
                    </select>
                    {formik.touched.barber_id && formik.errors.barber_id && (
                      <div className="invalid-feedback">
                        {formik.errors.barber_id}
                      </div>
                    )}
                  </div>
                </Col>
              )}

              {/* First Name */}
              <Col lg={12}>
                <Label for="firstname-field" className="form-label">
                  First Name
                </Label>
                <Input
                  name="firstname"
                  id="firstname"
                  className="form-control"
                  placeholder="Enter First Name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstname || ""}
                  invalid={
                    formik.touched.firstname && formik.errors.firstname
                      ? true
                      : false
                  }
                />
                {formik.touched.firstname && formik.errors.firstname ? (
                  <FormFeedback type="invalid">
                    {formik.errors.firstname}
                  </FormFeedback>
                ) : null}
              </Col>

              {/* Last Name */}
              <Col lg={12}>
                <Label for="lastname-field" className="form-label">
                  Last Name
                </Label>
                <Input
                  name="lastname"
                  id="lastname"
                  className="form-control"
                  placeholder="Enter Last Name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastname || ""}
                  invalid={
                    formik.touched.lastname && formik.errors.lastname
                      ? true
                      : false
                  }
                />
                {formik.touched.lastname && formik.errors.lastname ? (
                  <FormFeedback type="invalid">
                    {formik.errors.lastname}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col lg={12}>
                <Label for="email-field" className="form-label">
                  Email
                </Label>
                <Input
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter Email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email || ""}
                  invalid={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                />
                {formik.touched.email && formik.errors.email ? (
                  <FormFeedback type="invalid">
                    {formik.errors.email}
                  </FormFeedback>
                ) : null}
              </Col>

              {/* <Col lg={12}>
                <Label for="address-field" className="form-label">
                  Address
                </Label>
                <Input
                  name="address"
                  id="address"
                  className="form-control"
                  placeholder="Enter address"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address || ""}
                  invalid={
                    formik.touched.address && formik.errors.address
                      ? true
                      : false
                  }
                />
                {formik.touched.address && formik.errors.address ? (
                  <FormFeedback type="invalid">
                    {formik.errors.address}
                  </FormFeedback>
                ) : null}
              </Col> */}

              {/* Mobile Number */}
              <Col lg={12}>
                <Label for="mobile_number-field" className="form-label">
                  Mobile Number
                </Label>
                <Input
                  name="mobile_number"
                  id="mobile_number"
                  className="form-control"
                  placeholder="Enter Mobile Number"
                  type="text"
                  onChange={handlePhoneChange}
                  onKeyDown={handleKeyDown}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile_number || ""}
                  invalid={
                    formik.touched.mobile_number && formik.errors.mobile_number
                      ? true
                      : false
                  }
                />
                {formik.touched.mobile_number && formik.errors.mobile_number ? (
                  <FormFeedback type="invalid">
                    {formik.errors.mobile_number}
                  </FormFeedback>
                ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  toggle();
                }}
                className="btn-light"
              >
                Close
              </Button>
              {isAppointmentAvailable}
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                disabled={showSpinner || !isAppointmentAvailable} // Disable button when loader is active
              >
                {showSpinner && (
                  <Spinner size="sm" className="me-2">
                    Loading...
                  </Spinner>
                )}
                Save
              </button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AppointmentTable;
