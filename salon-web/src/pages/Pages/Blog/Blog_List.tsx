import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import BlogImage from "../../../assets/images/Blog/Blog.png";
import DefaultBlogImage from "../../../assets/images/Blog/blog_default_img.jpg"; // Path to your default image
import { GetBlogs } from "../../../Services/BlogService";
import LoaderInner from "Components/Common/LoaderInner";

// Define the structure of each blog item
type Blog = {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
};

const Blog_List: React.FC = () => {
  document.title = "Blog | Shear Brilliance";
  const [blogs, setBlogs] = useState<Blog[]>([]); // Set the state to an array of Blog type
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await GetBlogs();

        // Access the 'blogs' array from the response data
        if (Array.isArray(response.data.blogs)) {
          setBlogs(response.data.blogs); // Set blogs if response.data.blogs is an array
        } else {
          console.error("Expected an array but received:", response.data.blogs);
          setBlogs([]); // Default to empty array if the structure is not as expected
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]); // Default to empty array in case of error
      } finally {
        setIsLoading(false); // Hide loader after fetching (whether successful or not)
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      {isLoading && <LoaderInner />}
      <Navbar />
      <section
        className="d-flex justify-content-center align-items-center text-center text-white"
        style={{
          height: "100px",
          marginTop: "97px",
          position: "relative",
          overflow: "hidden",
          fontSize: window.innerWidth <= 768 ? "4rem" : "6rem",
        }}
      >
        <img
          src={BlogImage}
          alt="Gallery"
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
              letterSpacing: "0.1em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: "0",
              padding: "20px 0",
            }}
          >
           Our Blogs
          </h1>
        </div>
      </section>
      <section
        className="why-choose-us py-5"
        style={{  position: "relative" }}
      >
        <Container>
          {/* <Row>
            <Col className="col-12 text-center mb-4">
              <h2
                className="fw-bold"
                style={{ color: "#000000", fontSize: "36px" }}
              >
                Our Latest Blogs
              </h2>
              <p style={{ lineHeight: "1.5" }}>
                We thrive when coming up with innovative ideas but also
                understand that smart concepts should be supported with
                measurable results.
              </p>
            </Col>
          </Row> */}

          <Row>
            {blogs.map((blog) => (
              <Col key={blog.id} className="col-lg-4 col-md-6 col-12 mb-4">
                <Card style={{ height: "100%" }}>
                  <CardBody>
                    <img
                      src={blog.image || DefaultBlogImage}
                      alt={blog.title}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "216px",
                        objectFit: "cover",
                      }}
                    />
                  </CardBody>
                  <CardBody
                    className="card-content"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "200px",
                    }}
                  >
                      <h5
                        className="text-truncate-two-lines"
                        style={{
                          color: "#000",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {blog.title}
                      </h5>
                    <p
                      className="text-muted fs-14 text-truncate-three-lines"
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {blog.description}
                    </p>
                    <NavLink
                      to={`/blog_details/${blog.title}`}
                      state={{ blog }}
                      className="link-success mt-auto"
                    >
                      Learn More{" "}
                      <i className="ri-arrow-right-line align-bottom ms-1"></i>
                    </NavLink>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Blog_List;
