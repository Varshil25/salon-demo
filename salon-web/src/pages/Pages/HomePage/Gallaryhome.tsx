import React from "react";
import { Link } from "react-router-dom";
import Gallery from "../../../assets/images/home_page/Gallery_text.svg"; // Background SVG

// Import all gallery images
import GalleryImage1 from "../../../assets/images/home_page/home_1.jpg";
import GalleryImage2 from "../../../assets/images/home_page/home_2.jpg";
import GalleryImage3 from "../../../assets/images/home_page/home_3.jpg";
import GalleryImage4 from "../../../assets/images/home_page/home_4.jpg";
import GalleryImage5 from "../../../assets/images/home_page/home_5.jpg";
import GalleryImage6 from "../../../assets/images/home_page/home_6.jpg";

// Define types for GalleryItem props
interface GalleryItemProps {
  image: string; // The image path is a string
  altText: string; // The alt text is a string
  link?: string; // The link is optional, defaults to "/gallery"
}

// Reusable Component for a Single Gallery Item
const GalleryItem: React.FC<GalleryItemProps> = ({
  image,
  altText,
  link = "/gallery",
}) => (
  <div className="col-12 col-md-4 mb-4">
    <div className="gallery-image-wrapper">
      <img
        src={image}
        alt={altText}
        className="img-fluid"
        style={{ width: "100%", height: "auto" }}
      />
      <div className="overlay">
        <Link to={link} className="check-in-text">
          Check Out Gallery
        </Link>
      </div>
    </div>
  </div>
);

const Gallaryhome = () => {
  // Array of gallery images and alt texts
  const galleryData = [
    { image: GalleryImage1, altText: "Gallery Image 1" },
    { image: GalleryImage2, altText: "Gallery Image 2" },
    { image: GalleryImage3, altText: "Gallery Image 3" },
    { image: GalleryImage4, altText: "Gallery Image 4" },
    { image: GalleryImage5, altText: "Gallery Image 5" },
    { image: GalleryImage6, altText: "Gallery Image 6" },
  ];

  return (
    <section
      className="why-choose-us"
      style={{ marginTop: "90px", position: "relative" }}
    >
      {/* Background SVG */}
      <img
        src={Gallery}
        alt="Gallery Background"
        className="services-background d-none d-md-block"
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translate(-50%, -20%)",
          opacity: "1",
          width: "40%",
          height: "auto",
        }}
      />

      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h2
              className="fw-bold"
              style={{ color: "#000000", fontSize: "36px" }}
            >
              Awesome Gallery
            </h2>
            <p style={{ lineHeight: "1.5" }}>
              At our premium hair salon, we combine artistry and expertise to
              deliver exceptional grooming style. Explore our Awesome Gallery to
              see stunning transformations that inspire your next look, all
              crafted with meticulous attention to detail for your confidence
              and satisfaction.
            </p>
          </div>
        </div>

        {/* Responsive Gallery Section */}
        <div className="row">
          {galleryData.map((item, index) => (
            <GalleryItem
              key={index}
              image={item.image}
              altText={item.altText}
              link="/gallery"
            />
          ))}
        </div>

        {/* Responsive Button centered below all photos */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <Link to="/gallery">
              <button
                className="btn-lg learn-more-btn"
                style={{ marginTop: "20px" }} // Optional for spacing
              >
                Explore More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallaryhome;
