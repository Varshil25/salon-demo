import React, { useState, useEffect, useMemo, useCallback } from "react";

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
  Form,
  Spinner,
} from "reactstrap";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../Components/Common/Loader";

import axios from "axios";
import { fetchBarber } from "Services/barberService";
import { addBarberSession, deleteBarberSession, fetchBarberSession, updateBarberSession } from "Services/BarberSessionService";
import TableContainer from "Components/Common/TableContainerReactTable";

export const BARBER_ENDPOINT = "/barber";
export const SALON_ENDPOINT = "/salon";

const BarberSessionsTable: React.FC = () => {
  const [barberSessionsData, setBarberSessionsData] = useState<any>(null);

  const [barberData, setBarberData] = useState<Barber[]>([]);
  const [salonBarberData, setSalonBarberData] = useState<any>([]);

  const [salonData, setSalonData] = useState<Salon[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const [showLoader, setShowLoader] = useState(true);
  const [existBarber, setExistBarber] = useState(true);

  const [newBarberSession, setNewBarberSession] = useState<BarberSessions | null>(null);


  // Delete Task 
  const [modal, setModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);

  const limit = 10; // Items per page
  const userRole = localStorage.getItem("userRole");
  let storeRoleInfo: any;
  if (userRole) {
    storeRoleInfo = JSON.parse(userRole);
  }
  let authSalonUser: any = localStorage.getItem("authSalonUser");
  if (authSalonUser) {
    authSalonUser = JSON.parse(authSalonUser);
  }
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setNewBarberSession(null);
      formik.resetForm();
    } else {
      setModal(true);
    }
  }, [modal]);

  interface Salon {
    salon_id: number;
    salon_name: string;
    availability_status: string; // Field for availability status
    photos: number; // Field for default service time
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

  // Define the Barber type based on your database structure
  interface Barber {
    id: number;
    name: string;
    firstname: string; // Add this line
    lastname: string; // Add this line
    mobile_number: string; // Add this line
    email: string; // Add this line
    address: string;
    password: string; // Add password field
    availability_status: string; // Field for availability status
    default_service_time: number; // Field for default service time
    profile_photo: string; // Fixed typo here
    cutting_since?: string; // Add this line
    organization_join_date?: string; // Add this line
    SalonId: number; // Add this line
    // salon: object | null; // Add this line
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
    getBarberSessionsData();
    if (storeRoleInfo.role_name === "Salon Owner") {
      formik.setFieldValue("SalonId", authSalonUser.id); 
    }
    const fetchBarbersList = async () => {
      try {
        const response: any = await fetchBarber(1, 100, null);
        // const response: any = await axios.get(BARBER_ENDPOINT);
        const activeBarber = response.barbers.filter(
          (bar: any) => bar.availability_status === "available"
        );
        setBarberData(activeBarber);
        if (storeRoleInfo.role_name !== "Admin") {
          setSalonBarberData(response.barbers);
        }
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };

    fetchBarbersList();

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

  const getBarberSessionsData = async () => {
    try {
      const response: any = await fetchBarberSession();
      setBarberSessionsData(response.barberSessions);
      if (barberSessionsData?.length === 0) {
        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 5000); // Hide loader after 5 seconds
        return () => clearTimeout(timer); // Clear timer if component unmounts or salonData changes
      } else {
        setShowLoader(false); // Immediately hide loader if data is available
      }
    } catch (error) {
      console.error("Error fetching barbers:", error);
    }
  }

  // validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: newBarberSession?.id ? newBarberSession?.id : 0,
      SalonId: newBarberSession?.SalonId ? newBarberSession?.SalonId : 0,
      BarberId: newBarberSession?.BarberId ? newBarberSession?.BarberId : 0,
      start_time: newBarberSession?.start_time ? newBarberSession?.start_time : "",
      end_time: newBarberSession?.end_time ? newBarberSession?.end_time : "",
    },
    validationSchema: Yup.object({
      SalonId:
        storeRoleInfo?.role_name === "Admin"
          ? Yup.number()
          : Yup.number().required("Salon is required"), // Add this line
      BarberId:
        storeRoleInfo?.role_name === "Barber"
          ? Yup.number()
          : Yup.number().required("Barber is required"), // Add this line
      start_time: Yup.string().required("Start time is required")
      .test(
        "start-less-than-end",
        "Start time must be less than End time",
        function (value) {
          const { end_time } = this.parent;
          if (!value || !end_time) return true;
          return !isTimeAfter(value, end_time);
        }
      ),
      end_time: Yup.string().required("End time is required")
      .test(
        "end-greater-than-start",
        "End time must be greater than Start time",
        function (value) {
          const { start_time } = this.parent;
          if (!value || !start_time) return true;
          return isTimeAfter(value, start_time);
        }
      ) 
    }),
    onSubmit: (values) => {
      setShowSpinner(true);
      const processedValues = {
        ...values,
      };

      console.log("Submitted values:", processedValues);
      if (isEditing) {
        updateBarberSession(values.id, processedValues).then((response) => {
          toast.success("Barber session updated successfully", {
            autoClose: 3000,
          });
          getBarberSessionsData();
          setShowSpinner(false);
          toggle();
        })
          .catch((error) => {
            console.error("Error updating Barber session:", error);
          });
      } else {
        addBarberSession(processedValues)
          .then((response) => {
            toast.success("Barber session created successfully", {
              autoClose: 3000,
            });
            getBarberSessionsData();
            setShowSpinner(false);
            toggle();
          })
          .catch((error) => {
            console.error("Error creating Barber session:", error);
          });
      }
    },
  });

  const columns = useMemo(
    () => [
      {
        header: "Salon Name",
        accessorKey: "barber.salon.name",
        enableColumnFilter: false,
      },
      {
        header: "Barber Name",
        accessorKey: "barber.name",
        cell: (cell: any) => {
          return cell?.getValue() ? cell?.getValue() : "Unknown"; // Fallback if the barber is not found
        },
        enableColumnFilter: false,
      },
      {
        header: "Available Time",
        accessorKey: "availabe_time",
        enableColumnFilter: false,
        cell: ({ row }: { row: { original: { start_time: string; end_time: string } } }) => {
          const { start_time, end_time } = row.original; // Access start_time and end_time
          return `${start_time ? formatHours(start_time) : 'null'} - ${end_time ? formatHours(end_time) : 'null'}`; // Combine and display
        },
      },
      {
        header: "Actions",
        accessorKey: 'actions',
        enableColumnFilter: false,
        cell: (cell: { row: { original: BarberSessions } }) => (
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
    ],
    [barberSessionsData]
  );

  const handleEdit = (info: BarberSessions) => {
    if (info.SalonId) {
      const filterBarber = barberData.filter(
        (sal: any) => sal.SalonId === info.SalonId
      );
      setSalonBarberData(filterBarber);
      setExistBarber(false);
    }
    setNewBarberSession(info);
    setIsEditing(true); // Toggle edit mode
    setModal(true);
  };

  const handleSalonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      const salonId = Number(event.target.value);
      setSelectedSalonId(salonId);
      formik.setFieldValue("SalonId", salonId);
      const filterBarber = barberData.filter(
        (sal: any) => sal.SalonId === salonId
      );
      setSalonBarberData(filterBarber);
      // const selectedSalonData = salonData.find(
      //   (salon) => salon.salon_id === salonId
      // );
      // setSelectedSalon(selectedSalonData || null);
    }
    console.log("Selected option:", event.target.value);
  };

  // Helper to compare times
  const isTimeAfter = (time1: any, time2: any) => {
    const t1 = new Date(`1970-01-01T${time1}`);
    const t2 = new Date(`1970-01-01T${time2}`);
    return t1 > t2;
  };

  const isCurrentTimeAfter = (time: any) => {
    const currentTime = new Date();
    const selectedTime = new Date(`1970-01-01T${time}`);
    return currentTime > selectedTime;
  };

  const handleBarberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      const barberId = Number(event.target.value);
      if (barberSessionsData?.length > 0) {
        const barberInfo = barberSessionsData.find((barbr: any) => barbr.BarberId === barberId);
        if (barberInfo && !isEditing) {
          setExistBarber(true);
          toast.warning("Barber session already exist!!!", {
            autoClose: 3000,
          });
        } else {
          setExistBarber(false);
          setSelectedBarberId(barberId);
          formik.setFieldValue("BarberId", barberId);
        }
      } else {
        setExistBarber(false);
        setSelectedBarberId(barberId);
        formik.setFieldValue("BarberId", barberId);
      }
      // const selectedSalonData = salonData.find(
      //   (salon) => salon.salon_id === salonId
      // );
      // setSelectedSalon(selectedSalonData || null);
    }
    console.log("Selected option:", event.target.value);
  };

  return (
    <React.Fragment>
      <div className="row">
        <Col lg={12}>
          <div className="card" id="tasksList">
            <div className="card-header border-0">
              <div className="d-flex align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">Barber Schedules</h5>
                <div className="flex-shrink-0">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-primary add-btn me-1"
                      onClick={() => {
                        toggle();
                      }}
                    >
                      <i className="ri-add-line align-bottom me-1"></i> Create
                      Barber Schedule
                    </button>

                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-3">
              {showLoader ? (
                <Loader />
              ) : (
                <TableContainer
                  columns={columns}
                  data={barberSessionsData || []}
                  isGlobalFilter={false}
                  customPageSize={limit}
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light text-muted"
                  SearchPlaceholder="Search by barber, salon or name"
                />
              )}
              <ToastContainer closeButton={false} limit={1} />
            </div>
          </div>
        </Col>
      </div>

      <Modal isOpen={modal} toggle={toggle} centered backdrop="static">
        <ModalHeader toggle={toggle}>
          {isEditing ? "Update Barber Session" : "Add Barber Session"}
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={formik.handleSubmit}>
          <ModalBody className="modal-body">
            <Row className="g-3">
              {storeRoleInfo.role_name === "Admin" && (
                <Col lg={12}>
                  <div>
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
                      value={formik.values.BarberId}
                      onChange={handleBarberChange}
                    >
                      <option value="">Select a barber</option>
                      {salonBarberData.map((barber: any) => (
                        <option key={barber.id} value={barber.id}>
                          {barber.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.BarberId && formik.errors.BarberId && (
                      <div className="invalid-feedback">
                        {formik.errors.BarberId}
                      </div>
                    )}
                  </div>
                </Col>
              )}
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="open_time" className="form-label">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    className={`form-control ${formik.touched.start_time && formik.errors.start_time
                      ? "is-invalid"
                      : ""
                      }`}
                    id="start_time"
                    value={formik.values.start_time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.start_time && formik.errors.start_time && (
                    <div className="text-danger">{formik.errors.start_time}</div>
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
                    className={`form-control ${formik.touched.end_time && formik.errors.end_time
                      ? "is-invalid"
                      : ""
                      }`}
                    id="end_time"
                    value={formik.values.end_time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.end_time && formik.errors.end_time && (
                    <div className="text-danger">
                      {formik.errors.end_time}
                    </div>
                  )}
                </div>
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
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                disabled={showSpinner || existBarber} // Disable button when loader is active
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

export default BarberSessionsTable;
