import React, { useState, useEffect } from "react";
import serviceImage from "../../../assets/images/Services/Service-Bg.png";
import Navbar from "../HomePage/Navbar";
import { Container, Row, Col, Button } from "reactstrap";
import { FaShare, FaStar } from "react-icons/fa";
import { GetSalon } from "../../../Services/SalonServices"; // Import the API function to fetch salons
import { CeateFavoriteSalon } from "../../../Services/FavoriteSalon"; // Import the API function to update favorites
import { useSelector } from "react-redux";
import LoaderInner from "Components/Common/LoaderInner";
import { useNavigate } from "react-router-dom";

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
    google_url?: string;
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
}

interface FavoriteSalonData {
  id: number; // Unique identifier for the favorite entry
  UserId: number; // The user ID who favorited the salon
  SalonId: number; // The salon ID that was favorited
  status: "like" | "dislike"; // The favorite status (either 'like' or 'unlike')
  device_id: string | null; // The device ID (or null if not provided)
}
const Favourite: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<SalonData[]>([]); // State for favorite salons
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // New state to track button selection
  const [selectedSalon, setSelectedSalon] = useState<SalonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredSalons, setFilteredSalons] = useState<SalonData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Fetch the user ID from Redux store
  const user = useSelector((state: any) => state?.Login?.user);
  const userId = user?.data?.user?.id;

  // Fetch favorite salons on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteSalons = await GetSalonData({
          favorites: true,
          onlyfavorites: true,
        }); // Fetch only favorite salons

        setFavorites(favoriteSalons); // Store favorite salons in state
        setIsLoading(true);
      } catch (error) {
        console.error("Error fetching favorite salons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const GetSalonData = async (
    params: {
      searchName?: string;
      favorites?: boolean;
      onlyfavorites?: boolean;
    } = {}
  ): Promise<SalonData[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.onlyfavorites) {
        queryParams.append("onlyfavorites", String(params.onlyfavorites));
      }
      if (params.favorites) {
        queryParams.append("favorites", String(params.favorites));
      }
      const response = await GetSalon(queryParams.toString());
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching salons:", error);
      return [];
    }
  };

  // Fetch data for the selected salon when "Check In" button is clicked
  const fetchSelectedSalon = () => {
    if (!selectedSalon) return;

    GetSalon({ id: selectedSalon.salon.id })
      .then((response) => {
        const salonData = response.data as SalonData;
        setSelectedSalon(salonData);
      })
      .catch(() => {
        setError("Error fetching salon details. Please try again later.");
      });
  };

  // Function to toggle the favorite status of a salon
  // Function to toggle the favorite status of a salon
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

    setFavorites((prevSalons) =>
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

  // Function to handle salon card click
  const handleCardClick = (salon: SalonData) => {
    setSelectedSalon(salon === selectedSalon ? null : salon);
    const salonId = salon.salon_id;
    navigate(`/salon_information`, { state: { salonId } });
  };

  // Check if there are no favorite salons
  const noFavoritesMessage =
    favorites.length === 0 ? (
      <div className="no-favorites-message">
        <p>Please favorite your salon!</p>
      </div>
    ) : null;

  return (
    <React.Fragment>
      <Navbar />
      {isLoading && <LoaderInner />}
      <section
        className="d-flex justify-content-center align-items-center text-center text-white lg-{12} md-{12} sm-{12}"
        style={{
          height: "100px",
          marginTop: "72px",
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
              fontSize: window.innerWidth <= 768 ? "2rem" : "4rem",
              lineHeight: "0.9",
              letterSpacing: "0.1em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "25px 0 0",
            }}
          >
            Favourite
          </h1>
        </div>
      </section>
      <Container style={{ padding: "20px", maxWidth: "100vw" }}>
        <Row className="mb-4">
          <Col>
            <h1
              style={{
                fontWeight: "bold",
                marginBottom: "10px",
                textAlign: "center",
                color: "#000",
                fontSize: "2rem",
              }}
            >
              Your Favourite Salons
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#666",
                textAlign: "center",
                lineHeight: "1.5",
                marginBottom: "0px",
              }}
            >
              {favorites.length > 0
                ? "Select a salon to view estimated service times and make it your favorite!"
                : "You don't have any favorite salons yet. Please favorite a salon!"}
            </p>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center align-items-center">
          <Col xs={12} className="d-flex flex-column align-items-center">
            {favorites.map((salon, index) => (
              <Col
                xs={12}
                md={6}
                lg={4}
                key={index}
                className="mb-3 d-flex justify-content-center"
              >
                <div
                  onClick={() => handleCardClick(salon)}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    border:
                      selectedSalon &&
                      selectedSalon.salon_name === salon.salon_name
                        ? "2px solid #be9342"
                        : "none",
                    transform:
                      selectedSalon &&
                      selectedSalon.salon_name === salon.salon_name
                        ? "scale(1.02)"
                        : "scale(1)",
                    transition: "transform 0.2s ease, border 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2
                      style={{ marginBottom: "10px", color: "#333", flex: "1" }}
                    >
                      {salon.salon_name}
                    </h2>
                    <p
                      style={{
                        margin: "0 0 10px 10px",
                        color: "#be9342",
                        fontWeight: "normal",
                        fontSize: "20px",
                      }}
                    >
                      {salon.estimated_wait_time + " min"}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ color: "#333", margin: "0", flex: "1" }}>
                      {salon.address}
                      <a
                        href={salon?.salon?.google_url}
                        className="map-icon"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: "10px", color: "#000" }}
                      >
                        <FaShare />
                      </a>
                    </p>
                    <Button
                      color="link"
                      onClick={() => toggleFavorite(salon)}
                      style={{
                        color: salon.is_like ? "#be9243" : "#d3d3d3",
                      }}
                    >
                      <FaStar />
                    </Button>
                    <p
                      style={{
                        color: salon.salon.status === "open" ? "green" : "red",
                        margin: "0",
                      }}
                    >
                      {salon.salon.status}
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Col>
          <div className="stepper-container">
            <div className="buttons mt-3">
              {/* <button
                onClick={() => {
                  fetchSelectedSalon(); // Call the function to fetch selected salon data
                  if (selectedSalon) {
                    // Navigate to the salon check-in page if selectedSalon exists
                    window.location.href = `/checkin_information/${selectedSalon.salon.id}?step=1`;
                  }
                }}
                className="learn-more-btn submit-btn w-100 h-100 d-flex justify-content-center align-items-center"
              >
                <i className=" align-bottom "></i> Proceed
              </button> */}
            </div>
          </div>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Favourite;
