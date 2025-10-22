import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Blog_text from "../../../assets/images/home_page/Blog_text.svg";
import { GetBlogs } from "../../../Services/BlogService";
import DefaultBlogImage from "../../../assets/images/Blog/blog_default_img.jpg"
type Blog = {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
};

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await GetBlogs();
        const sortedBlogs = response.data.blogs.sort((a: Blog, b: Blog) => {
          return parseInt(b.id) - parseInt(a.id);
        });
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
  
    fetchBlogs();
  }, []);
  

  return (
    <section
      className="why-choose-us"
      style={{ marginTop: "90px", position: "relative" }}
    >
      <img
        src={Blog_text}
        alt="Blog Text"
        className="services-background d-none d-md-block"
        style={{
          position: "absolute",
          top: "3%",
          left: "50%",
          transform: "translate(-50%, -20%)",
          opacity: "0.8",
          width: "20%",
          height: "auto",
        }}
      />

      <Container>
        <Row>
          <Col className="col-12 text-center mb-4">
            <h2
              className="fw-bold"
              style={{ color: "#000000", fontSize: "36px" }}
            >
              Our Latest Blogs
            </h2>
            <p style={{ lineHeight: "1.5" }}>
              At our salon, we believe that innovation goes hand in hand with
              impact. Explore our blogs for fresh ideas, expert tips, and trends
              that redefine style and confidence, all backed by thoughtful
              insights and real results.
            </p>
          </Col>
        </Row>

        <Row>
          {blogs.slice(0, 3).map((blog) => (
            <Col key={blog.id} className="col-lg-4 col-md-6 col-12">
              <Card className="h-100 d-flex flex-column">
              <CardBody>
  <img
    src={blog.image || DefaultBlogImage} // Use DefaultBlogImage if blog.image is falsy (null or empty)
    alt={blog.title}
    className="img-fluid"
    style={{
      width: "324px",
      height: "216px",
      objectFit: "cover",
    }}
  />
</CardBody>


                <CardBody
                  style={{
                    minHeight: "200px", // Adjust based on expected content height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <NavLink to={`/blog_details/${blog.title}`}>
                    <h5
                      className="text-truncate-two-lines"
                      style={{ color: "#000" }}
                    >
                      {blog.title}
                    </h5>
                  </NavLink>
                  <p className="text-muted fs-14">
                    {blog.description.length > 100
                      ? `${blog.description.substring(0, 100)}...`
                      : blog.description}
                  </p>
                  <div>
                    <NavLink
                      to={`/blog_details/${blog.id}`}
                      state={{ blog }}
                      className="link-success"
                    >
                      Learn More{" "}
                      <i className="ri-arrow-right-line align-bottom ms-1"></i>
                    </NavLink>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="row mt-4">
          <div className="col-12 text-center">
            <Link to="/Blogs">
              <button
                className="btn-lg learn-more-btn"
                style={{ marginTop: "0px", marginBottom: "70px" }}
              >
                More Blogs
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Blog;
