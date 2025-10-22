import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import BlogImage from "../../../assets/images/Blog/Blog.png";
import { Container } from "reactstrap";

type Blog = {
  id: string;
  image: string;
  title: string;
  description: string;
  htmlContent: string;
  date: string;
  content: string;
};

const BlogDetails: React.FC = () => {
  const { state } = useLocation(); // Get state from the previous page
  const { id } = useParams<{ id: string }>();
  const blog = state?.blog as Blog; // Retrieve the blog object passed in state

  // Optional: Fallback if state is not available
  if (!blog) {
    return <p>Blog not found. Please go back and try again.</p>;
  }

  return (
    <>
    <Navbar />
  
    {/* Hero Section */}
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
              margin: "20px ",
              padding: "20px 0",
            }}
          >
            Blog Details
          </h1>
        </div>
      </section>

   {/* Blog Content Section */}
  <Container>
    <section className="py-5 text-center">
      <h1 className="text-dark">{blog.title}</h1>
      
      <img
        src={blog.image}
        alt={blog.title}
        className="img-fluid"
        style={{ height: "500px",width: "750px" , objectFit: "cover" }}
      />
      {/* <div className="mt-4">
      <p className="mx-auto text-start" style={{ maxWidth: "90%", textAlign: "justify" }}>
          {blog.description}
        </p>
      </div> */}
      <div className="mt-4">
        <div
          className="mx-auto text-start"
          style={{ maxWidth: "90%", textAlign: "justify" }}
          dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
        />
      </div>
    </section>
  </Container>
  
    <Footer />
  </>
  
  );
};

export default BlogDetails;
