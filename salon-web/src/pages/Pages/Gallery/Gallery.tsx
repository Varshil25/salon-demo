import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-component";
import { gallery } from "../../../common/data";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import galleryImage from "../../../assets/images/Gallery/Gallery_Bg.jpeg";
import LoaderInner from "Components/Common/LoaderInner";

const Gallery = () => {
  document.title = "Gallery | Shear Brilliance";

  const [displayCategory, setCategory] = useState<string>("All");
  const [index, setIndex] = useState<any>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data and check when images are fully loaded
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = gallery.map(({ img }) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = img;
          image.onload = resolve;
          image.onerror = reject;
        });
      });

      try {
        // Wait for all images to load
        await Promise.all(imagePromises);
        setIsLoading(false); // Stop loading
      } catch (error) {
        console.error("Error loading images:", error);
        setIsLoading(false); // Ensure loading stops even if there's an error
      }
    };

    loadImages();
  }, []);

  const filterGallery = ({ category }: any) => {
    return displayCategory === category || displayCategory === "All";
  };

  const filteredGallery = gallery.filter(({ category }: any) =>
    filterGallery({ category })
  );

  const slideGallery = filteredGallery.map((item) => ({ src: item.img }));

  if (isLoading) {
    // Render the loader while images are loading
    return <LoaderInner />;
  }

  return (
    <React.Fragment>
      {isLoading && <LoaderInner />}
      {/* Hero Section */}
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
          src={galleryImage}
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: "-1",
          }}
        />
        <div>
          <h1
            className="text-white custom-heading"
            style={{
              fontSize: window.innerWidth <= 768 ? "2rem" : "2.5rem",
              lineHeight: "1.5",
              letterSpacing: "0.1em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
            Gallery
          </h1>
        </div>
      </section>

      <div className="page-content" style={{ padding: "40px 12px" }}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="">
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <div className="text-center">
                        <ul
                          className="list-inline categories-filter animation-nav "
                          id="filter"
                        >
                          <li className="list-inline-item me-1 ">
                            <Link
                              to="#"
                              onClick={() => setCategory("All")}
                              className={
                                displayCategory === "All"
                                  ? "categories active"
                                  : "categories"
                              }
                              data-filter="*"
                            >
                              All
                            </Link>
                          </li>
                          <li className="list-inline-item me-1">
                            <Link
                              to="#"
                              onClick={() => setCategory("Project")}
                              className={
                                displayCategory === "Project"
                                  ? "categories active"
                                  : "categories"
                              }
                              data-filter=".project"
                            >
                              Ajax
                            </Link>
                          </li>
                          <li className="list-inline-item me-1">
                            <Link
                              to="#"
                              onClick={() => setCategory("Designing")}
                              className={
                                displayCategory === "Designing"
                                  ? "categories active"
                                  : "categories"
                              }
                              data-filter=".designing"
                            >
                              Pickering
                            </Link>
                          </li>
                          <li className="list-inline-item me-1">
                            <Link
                              to="#"
                              onClick={() => setCategory("Photography")}
                              className={
                                displayCategory === "Photography"
                                  ? "categories active"
                                  : "categories"
                              }
                              data-filter=".photography"
                            >
                              Oshawa
                            </Link>
                          </li>
                          <li className="list-inline-item me-1">
                            <Link
                              to="#"
                              onClick={() => setCategory("Development")}
                              className={
                                displayCategory === "Development"
                                  ? "categories active"
                                  : "categories"
                              }
                              data-filter=".development"
                            >
                              Studio
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <Masonry className="row gallery-wrapper justify-content-center">
                        {filteredGallery.map(
                          ({ img, title, auther, likes, comments }, key) => (
                            <Col
                              xl={4}
                              lg={4}
                              sm={6}
                              key={key}
                              className="mb-3"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Card
                                className="gallery-box"
                                style={{
                                  width: "100%",
                                  maxWidth: "318.4px",
                                  height: "auto",
                                  margin: "0 10px",
                                }}
                              >
                                <div className="gallery-container">
                                  <Link
                                    className="image-popup"
                                    to="#"
                                    title={title}
                                    onClick={() => setIndex(key)}
                                  >
                                    <img
                                      className="gallery-img img-fluid mx-auto"
                                      src={img}
                                      alt=""
                                      style={{ height: "350px" , width: "300px" }}
                                    />
                                    <div className="gallery-overlay">
                                      <h5 className="overlay-caption">
                                        {title}
                                      </h5>
                                    </div>
                                  </Link>
                                </div>

                                <div className="box-content">
                                  <div className="d-flex align-items-center mt-1">
                                    <div className="flex-grow-1 text-muted">
                                      {" "}
                                      <Link
                                        to="#"
                                        className="text-body text-truncate"
                                      >
                                        {auther}
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          )
                        )}
                      </Masonry>
                    </Col>
                  </Row>
                </CardBody>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* LightBox */}
      <Lightbox
        index={index}
        slides={slideGallery}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </React.Fragment>
  );
};

export default Gallery;
