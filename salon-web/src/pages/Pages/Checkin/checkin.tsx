import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Ensure react-router-dom is installed
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import default_salon_img from "../../../assets/images/Selectsalon/default_salon_img.png";
import map_icon from "../../../assets/images/Selectsalon/map_icon.svg";
import {
  Container,
  Row,
  Col,
  Input,
  FormGroup,
  Button,
  Toast,
} from "reactstrap";
import "./checkin.css"; // Import your CSS file
import { FaShare, FaStar } from "react-icons/fa";
import "./stepper.css";
import { GetSalon } from "../../../Services/SalonServices"; // Import the API function
import { CeateFavoriteSalon } from "../../../Services/FavoriteSalon"; // Import the API function
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  clearSelectedSalon,
  setSelectedSalon,
} from "slices/dashboardProject/selectedSalonSlice";
import LoaderInner from "Components/Common/LoaderInner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Data interface for salons
interface Barber {
  barber_id: number;
  barber_name: string;
  service_time: number;
  cutting_since: string;
  organization_join_date: string;
  photo: string;
  estimated_wait_time: number;
}

// Main interface for Salon information
interface SalonData {
  salon: {
    id: number;
    name: string;
    address: string;
    photos: string; // Assuming photos is a JSON string array
    phone_number: string;
    open_time: string;
    close_time: string;
    google_url: string | null;
    status: "open" | "close";
    services: string | null;
    pricing: string | null;
    faq: string | null;
    weekend_day: boolean;
    weekend_start: string | null;
    weekend_end: string | null;
    isFavorite: boolean; // Add isFavorite to the salon
  };
  salon_id: number;
  salon_name: string;
  address: string;
  appointment_count: number;
  barbers: Barber[];
  photos: string; // Another JSON string array of photos at the top level
  is_like: boolean;
  estimated_wait_time: number;
  min_wait_time: number;
}

interface FavoriteSalonData {
  id: number; // Unique identifier for the favorite entry
  UserId: number; // The user ID who favorited the salon
  SalonId: number; // The salon ID that was favorited
  status: "like" | "dislike"; // The favorite status (either 'like' or 'unlike')
  device_id: string | null; // The device ID (or null if not provided)
}

const Checkin: React.FC = () => {
  const [salons, setSalons] = useState<SalonData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSalons, setFilteredSalons] = useState<SalonData[]>([]);
  // const [selectedSalon, setSelectedSalon] = useState<SalonData | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // New state to track button selection
  const [favorites, setFavorites] = useState<string[]>([]); // State for favorites
  const [activeButton, setActiveButton] = useState<"all" | "favorites" | null>(
    "all"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch: any = useDispatch(); // Dispatch hook for Redux actions
  const selectedSalon = useSelector(
    (state: any) => state.selectedSalon.selectedSalon
  ); // Access the selected salon from Redux state

  // Redux selector for getting user login data
  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state?.Login?.user, // Ensure state.Login holds user info after login
  }));

  // Fetching user data from Redux store
  const { user } = useSelector(loginpageData);
  const userId = user?.data?.user?.id || ""; // Get the first name if available
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user's token is not available in localStorage
    const token = localStorage.getItem("token"); // Assuming the token is stored as "token" in localStorage

    if (!token) {
      navigate("/signin"); // Redirect to the signin page if token is not found
    }
  }, [navigate]);

  // Fetch salon data on component mount
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const allSalons = await GetSalonData({ favorites: true }); // Fetch all salons
        setIsLoading(true);
        // Map each salon to add `is_like` based on `isFavorite`
        const updatedSalons = allSalons.map((salon: SalonData) => ({
          ...salon, // Set is_like based on isFavorite status
        }));
        setSalons(updatedSalons);
        setFilteredSalons(updatedSalons); // Initialize with all salons

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching salons:", error);
      }
    };
    fetchSalons();
  }, [user]);

  const handleAllClick = async () => {
    setActiveButton("all");
    try {
      // Fetch all salons without filtering
      const allSalons = await GetSalonData({ favorites: true });

      // Modify the data to set `isLike = true` for favorite salons
      const updatedSalons = allSalons.map((salon) => {
        if (salon.is_like === true) {
          // If the salon is a favorite, set `isLike = true`
          return { ...salon, is_like: true };
        }
        // Return non-favorite salons as they are
        return salon;
      });

      // Set the modified list of salons in the state
      setFilteredSalons(updatedSalons);
    } catch (error) {
      console.error("Error fetching all salons:", error);
    }
  };

  const handleCardClick = (salon: SalonData) => {
    if (salon.salon_name === selectedSalon?.salon_name) {
      // If the same salon is clicked again, clear it
      dispatch(clearSelectedSalon());
    } else {
      // Otherwise, select the new salon
      dispatch(setSelectedSalon(salon));
    }
  };

  const handleSuggestionClick = (salon: SalonData) => {
    setSelectedSalon(salon);
    setSearchTerm(salon.salon_name);
    setShowSuggestions(false);
    document.getElementById("salon-search")?.blur();
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      setFilteredSalons(salons); // Show all salons if no search term
    } else {
      try {
        const filtered = await GetSalonData({ searchName: searchTerm });
        setFilteredSalons(filtered);
      } catch (error) {
        console.error("Error fetching filtered salons:", error);
      }
    }
  };

  const handleFavoritesClick = async () => {
    setActiveButton("favorites");
    try {
      // Fetch only favorite salons from the backend
      const salons = await GetSalonData({
        favorites: true,
        onlyfavorites: true,
      });

      // Filter further to ensure each salon's `is_like` property is true
      const favoriteSalons = salons.filter((salon) => salon.is_like === true);

      // Update state to display only the favorite salons
      setFilteredSalons(favoriteSalons);
      setShowOnlyFavorites(true); // Mark state as showing only favorites
    } catch (error) {
      console.error("Error fetching favorite salons:", error);
    }
  };

  // Modified GetSalonData function to handle query parameters
  const GetSalonData = async (
    params: {
      searchName?: string;
      favorites?: boolean;
      onlyfavorites?: boolean;
    } = {}
  ): Promise<SalonData[]> => {
    try {
      // Prepare the query parameters
      const queryParams = new URLSearchParams();

      if (params.searchName) {
        queryParams.append("searchName", params.searchName);
      }
      if (params.favorites) {
        queryParams.append("favorites", String(params.favorites));
      }
      if (params.onlyfavorites) {
        queryParams.append("onlyfavorites", String(params.onlyfavorites));
      }

      const queryString = queryParams.toString();
      const response = await GetSalon(queryString); // Call the API method with the query string

      if (!response) {
        throw new Error("Error fetching salons");
      }

      return response.data; // Return array of SalonData
    } catch (error) {
      console.error("Error fetching salons:", error);
      throw error;
    }
  };

  const getSuggestions = () => {
    return salons.filter((salon) =>
      salon.salon_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const toggleFavorite = async (salon: SalonData) => {
    const newStatus = salon.is_like ? "dislike" : "like"; // Toggle favorite status
    const deviceId = null; // Set device_id to null if not used

    const data = {
      UserId: userId, // Replace with actual user ID if needed
      SalonId: salon.salon_id,
      status: newStatus,
      device_id: deviceId,
    };

    setFilteredSalons((prevSalons) =>
      prevSalons.map((s) =>
        s.salon_id === salon.salon_id
          ? {
              ...s,
              is_like: newStatus === "like", // Update is_like based on new status
            }
          : s
      )
    );

    try {
      // Call the API to update the favorite status
      const response = await CeateFavoriteSalon(data);

      // Directly access and map the response data to the FavoriteSalonData type
      const favoriteSalonData: FavoriteSalonData = response.data; // TypeScript will infer the type
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleNext = () => {
    if (!selectedSalon) {
      toast.warn("Please select a salon before proceeding.");
      return;
    }

    // Construct the URL with the selected salon ID and initial step
    const salonId = selectedSalon.salon_id;
    const step = 1;

    navigate(`/salon_information`, { state: { salonId } });
    // navigate(`/salon_information/${salonId}`);
  };

  const activeStyle = {
    backgroundColor: "#be9342", // Change background color to active color
    color: "#fff", // Change text color to white when active
  };

  return (
    <React.Fragment>
      {isLoading && <LoaderInner />}
      <section
        className="d-flex justify-content-center align-items-center text-center text-white lg-{12} md-{12} sm-{12}"
        style={{
          height: "100px",
          marginTop: "97px",
          position: "relative",
          overflow: "hidden",
          fontSize: window.innerWidth <= 768 ? "4rem" : "6rem",
        }}
      >
        <img
          src={serviceImage}
          alt="gallery"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: "-2",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "-1",
          }}
        />
        <div>
          <h1
            className="text-white custom-heading"
            style={{
              fontSize: window.innerWidth <= 768 ? "2rem" : "2.5rem",
              lineHeight: "1.5",

              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
            Select Your Salon
          </h1>
        </div>
      </section>

      <section>
        <Container style={{ padding: "20px", maxWidth: "100vw" }}>
          <Row className="mb-4">
            <Col>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#666",
                  textAlign: "center",
                  lineHeight: "1.5",
                  marginBottom: "0px",
                }}
              >
                Select a salon and see the estimated time for services
              </p>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={12} className="d-flex justify-content-center">
              <FormGroup
                className="position-relative d-flex align-items-center"
                style={{ width: "350px" }}
              >
                <Input
                  id="salon-search"
                  type="text"
                  placeholder="Search Salons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderRadius: "25px 0 0 25px",
                    padding: "10px 20px",
                    border: "1px solid #ccc",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    width: "100%",
                    height: "50px",
                  }}
                  onFocus={(e) =>
                    (e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)")
                  }
                  onBlur={(e) =>
                    (e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)")
                  }
                />
                <span
                  className="position-absolute"
                  style={{
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#aaa",
                  }}
                ></span>

                {showSuggestions &&
                  searchTerm &&
                  getSuggestions().length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        width: "100%",
                        backgroundColor: "#fff",
                        borderRadius: "5px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                        zIndex: 1000,
                        maxHeight: "150px",
                        overflowY: "auto",
                      }}
                    >
                      {getSuggestions().map((salon, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderBottom: "1px solid #ccc",
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handleSuggestionClick(salon)}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f0f0f0")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fff")
                          }
                        >
                          {salon.salon_name}
                        </div>
                      ))}
                    </div>
                  )}
              </FormGroup>
              <Button
                onClick={handleSearch}
                style={{
                  marginLeft: "-5px",
                  borderRadius: "0 25px 25px 0",
                  height: "50px",
                  padding: "0 20px",
                  backgroundColor: "#be9342",
                  border: "none",
                }}
              >
                Search
              </Button>
            </Col>
          </Row>

          {/* Filter Buttons Section */}
          <Row className="mb-4 justify-content-center">
            <Col md={3} className="d-flex justify-content-center">
              <Button
                style={{
                  border: "2px dotted #be9342",
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  color: "#be9342",
                  padding: "10px 20px",
                  margin: "0 10px",
                  ...(activeButton === "all" ? activeStyle : {}),
                }}
                onClick={handleAllClick} // Attach the "All" handler
              >
                All
              </Button>
              <Button
                style={{
                  border: "2px dotted #be9342",
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  color: "#be9342",
                  padding: "10px 20px",
                  margin: "0 10px",
                  ...(activeButton === "favorites" ? activeStyle : {}),
                }}
                onClick={handleFavoritesClick} // Attach the handler to the button click
              >
                Favorites
              </Button>
            </Col>
          </Row>
        </Container>
        <Container className="justify-content-center">
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12}>
              <div
                style={{
                  display: "grid",
                  gap: "30px",
                  justifyContent: "center",
                  gridTemplateColumns:
                    window.innerWidth <= 576
                      ? "0fr" // Mobile view
                      : window.innerWidth <= 768
                      ? "repeat(2, 1fr)" // Tablet view
                      : window.innerWidth <= 992
                      ? "repeat(2, 1fr)" // Large tablet/portrait desktop view
                      : "repeat(3, 1fr)", // Desktop view
                }}
              >
                {filteredSalons.map((salon, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      handleCardClick(salon);
                    }}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      height: "auto", // Fixed height
                      width: "322px", // Fixed width
                      border:
                        selectedSalon === salon
                          ? "3px solid #be9342"
                          : "3px solid transparent", // Brown border when selected
                    }}
                  >
                    {/* Image Section */}
                    <div
                      style={{
                        position: "relative",
                        width: "322px",
                        height: "181px",
                      }}
                    >
                      {salon.salon.photos &&
                      salon.salon.photos !== "[]" &&
                      salon.salon.photos.length > 0 ? (
                        // Parse the JSON string containing the photos if they exist
                        <img
                          src={JSON.parse(salon.salon.photos)[0]} // Access the first photo in the array
                          alt={salon.salon_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={default_salon_img} // Default image
                          alt="Default Salon"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: "15px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0px",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: "600",
                            lineHeight: "24px",
                            color: "#0d1619",
                            margin: "0",
                          }}
                        >
                          {salon.salon_name}
                        </h3>
                        <a
                          href={salon?.salon?.google_url ?? ""}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={map_icon} alt="Direction icon" />
                        </a>
                      </div>

                      <p
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "16px",
                          color: "#757676",
                          marginBottom: "10px",
                        }}
                      >
                        {salon.address}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {/* Button */}
                        <div
                          style={{
                            border: "1px solid #be9342",
                            borderRadius: "999px",
                            padding: "4px 12px",
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#be9342",
                            background: "none",
                          }}
                        >
                          {salon?.salon?.status}
                        </div>
                        <Button
                          color="link"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(salon);
                          }}
                          style={{
                            // position: "absolute",
                            // top: "10px",
                            // right: "10px",
                            fontSize: "20px",
                            padding: "0px",
                            color: salon.is_like ? "#be9243" : "#d3d3d3",
                            paddingRight: "3px",
                          }}
                        >
                          <FaStar />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            {/* Horizontal Stepper */}
            {/* <div className="stepper-container mt-4 mb-4">
              <div className="buttons">
                <button onClick={handleNext}>Continue</button>
              </div>
            </div> */}
            <div className="stepper-container mt-4 mb-4">
              {activeButton === "favorites" ? (
                filteredSalons.some((salon) => salon.is_like) ? (
                  <div className="buttons">
                    <button onClick={handleNext}>Continue</button>
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "#666", margin: "0 0 30px",
                    fontSize: "1.2rem"
                   }}>
                    No favorite salon found.
                  </p>
                )
              ) : (
                <div className="buttons">
                  <button onClick={handleNext}>Continue</button>
                </div>
              )}
            </div>
          </Row>
          <ToastContainer />
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Checkin;
