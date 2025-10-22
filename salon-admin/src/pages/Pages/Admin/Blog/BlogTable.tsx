import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  Form,
  Row,
  Col,
  Input,
  Label,
  ModalHeader,
  Spinner,
} from "reactstrap";
import TableContainer from "Components/Common/TableContainer";
import Blog1 from "../../../../assets/images/blog_default_img.jpg";
import Blog2 from "../../../../assets/images/illustrator-1.png";
import * as Yup from "yup";
import { Formik, Field, Form as FormikForm } from "formik";
import DeleteModal from "../../../../../src/Components/Common/DeleteModal";
import {
  fetchBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
} from "../../../../Services/BlogService"; // Adjust the import based on your structure
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "Components/Common/Loader";

// Define the Blog type based on your table structure
interface Blog {
  id: number;
  title: string;
  description: string;
  image: string; // This could be a URL to the image
}
export const BLOG_ENDPOINT = "/blogs";
const BlogTable: React.FC = () => {
  const [blogData, setBlogData] = useState<Blog[]>([]);
  const [modal, setModal] = useState(false);
  const [newBlog, setNewBlog] = useState<Blog | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | null>(null); // Allow selectedImage to be a File or null
  const [deleteModal, setDeleteModal] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [deletingBlogId, setDeletingBlogId] = useState<number | null>(null);
  const [recordId, setRecordId] = useState<string | undefined>(undefined); // Change to undefined
  const [loading, setLoading] = useState(true);
  const [selectedCurrentPage, setCurrentPage] = useState<number | null>(0);
  const [selectedTotalItems, setTotalItems] = useState<number | null>(0);
  const [selectedTotalPages, setTotalPages] = useState<number | null>(0);
  const [filteredData, setFilteredData] = useState<Blog[]>([]); // Filtered data
  const [selectedSearchText, selectedSearch] = useState<null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const limit = 10; // Items per page
  useEffect(() => {
    fetchBlogList(1, null);

  }, []);

  const fetchBlogList = async (page: any, search: any) => {

    try {
      // const response: any = await axios.get(APPOINTMENT_ENDPOINT);
      const response: any = await fetchBlogs(page === 0 ? 1 : page, limit, search ?? null);
      // setCurrentPage(response?.currentPage ? parseInt(response?.currentPage) : 1);
      setTotalItems(response?.totalItems);
      setTotalPages(response?.totalPages);
      // const totalLoadedAppointment = (totalLoadedAppointments ?? 0) + response.appointments?.length;
      // setTotalLoadedAppointments(totalLoadedAppointment);
      setBlogData(response.blogs);
      // setFilteredData(response.blogs); 
      if (blogData?.length === 0) {
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

  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       const response: any = await axios.get(BLOG_ENDPOINT);
  //       setBlogData(response);
  //       if (blogData?.length === 0) {
  //         const timer = setTimeout(() => {
  //           setShowLoader(false);
  //         }, 5000); // Hide loader after 5 seconds
  //         return () => clearTimeout(timer); // Clear timer if component unmounts or salonData changes
  //       } else {
  //         setShowLoader(false); // Immediately hide loader if data is available
  //       }
  //     } catch (error) {
  //       console.error("Error fetching barbers:", error);
  //     }
  //   };

  //   fetchBlogs();
  // }, []);

  const columns = useMemo(
    () => [
      {

        header: "Blogs",
        accessorKey: "image",
        enableColumnFilter: false,
        cell: (cell: { getValue: () => string }) => (
          <img
            src={cell.getValue() ? cell.getValue() : Blog1}
            // src={Profile}
            alt="Profile"
            style={{ width: "50px", height: "50px" }}
          />
        ),
        // cell: (cell: { getValue: () => string }) => {
        //   const imageUrl = cell.getValue(); // Get the image URL from cell value
        //   // const defaultImage = Blog1; // Path to your default image
        //   <img
        //     src={cell.getValue() ? cell.getValue() : Blog1}
        //     src={Profile}
        //     alt="Blog"
        //     style={{ width: "50px", height: "50px" }}
        //   />
        //   // return (
        //   //   <img
        //   //     src={imageUrl || Blog1} // Use the default image if the URL is empty or invalid
        //   //     alt="Blog"
        //   //     style={{ width: "100px", height: "auto" }}
        //   //   />
        //   // );
        // },
      },
      {
        header: "Title",
        accessorKey: "title",
        enableColumnFilter: false,
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
      },
      {
        header: "Actions",
        accessorKey: "actions",
        enableColumnFilter: false,
        cell: (cell: { row: { original: Blog } }) => (
          <div>
            <i
              className="ri-edit-2-fill"
              style={{
                cursor: "pointer",
                marginRight: "20px",
                color: "grey",
                fontSize: "20px",
              }}
              onClick={() => handleEdit(cell.row.original)}
            ></i>
            <i
              className="ri-delete-bin-fill"
              style={{ cursor: "pointer", color: "grey", fontSize: "20px" }}
              onClick={() => handleDelete(cell.row.original.id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  const handleEdit = (blog: Blog) => {
    setNewBlog(blog);

    // if (blog.image instanceof File) {
    setSelectedImage(blog.image); // If it's a file, just set it directly
    // } else {
    // setSelectedImage(null); // If it's a string (URL or path), set it as null or handle differently
    // }

    setModal(true);
  };
  const handleDelete = (id: number) => {
    setDeletingBlogId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowSpinner(true);
    if (deletingBlogId) {
      try {
        await deleteBlog(deletingBlogId); // Call delete API

        toast.success("Blog deleted successfully", { autoClose: 3000 });

        setShowSpinner(false);
        fetchBlogList(1, null);
        // setBlogData((prevData) =>
        //   prevData.filter((item) => item.id !== deletingBlogId)
        // );
        setDeletingBlogId(null);
        setDeleteModal(false);
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleAddButtonClick = () => {
    setNewBlog({
      id: 0,
      title: "",
      description: "",
      image: "",
    });
    setSelectedImage(null);
    setModal(true);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  // Function to handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Store the file in state
    } else {
      setSelectedImage(null); // Clear the selected image if no file is selected
    }
  };

  // Function to add a new blog post
  const handleAddBlog = async (values: Omit<Blog, "id">) => {

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (selectedImage instanceof File) {
        formData.append("image", selectedImage);
      }

      const newBlogData = await addBlog(formData);

      toast.success("Blog added successfully", { autoClose: 3000 });
      // Update the state with the new blog
      // setBlogData((prevData) => [...prevData, newBlogData]);
      fetchBlogList(1, null);
      setShowSpinner(false);

      // Optionally, fetch the latest blogs
      // const latestBlogs = await fetchBlogs();
      // setBlogData(latestBlogs); // Re-fetch blogs to ensure you're getting the updated list

      toggleModal();
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };
  const handleUpdateBlog = async (values: Omit<Blog, "id">) => {
    if (newBlog) {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);

        // Handle image upload logic
        if (selectedImage instanceof File) {
          console.log("Appending selectedImage to formData with key 'image':", selectedImage);
          formData.append("image", selectedImage);
        } else if (typeof newBlog.image === "string") {
          console.log("Appending existing photo URL to formData with key 'image':", newBlog.image);
          formData.append("image", newBlog.image);
        }

        // Update blog API call
        const updatedBlogData = await updateBlog(newBlog.id, formData);
        toast.success("Blog updated successfully", { autoClose: 3000 });
        setShowSpinner(false);
        console.log("Updated blog data from API:", updatedBlogData);

        // Fetch updated blogs filtered by title
        fetchBlogList(1, null);
        // const updatedBlogs = await fetchBlogs(1, limit, selectedSearchText); // Pass search text


        // // Update state with filtered blog data
        // setBlogData(updatedBlogs.blogs);
        toggleModal();

      } catch (error) {
        console.error("Error updating blog:", error);
        toast.error("Failed to update blog", { autoClose: 3000 });
      }
    }
  };


  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const handlePageChange = (pageIndex: number) => {
    const total = pageIndex + 1;
    setCurrentPage(pageIndex);
    setShowLoader(true);
    fetchBlogList(total, selectedSearchText);
    console.log('Current Page Index:', pageIndex);
    // Handle page change logic here
  };

  const handleSearchText = (search: any) => {

    selectedSearch(search);
    fetchBlogList(selectedCurrentPage, search);
    // Handle page change logic here
  };
  // const searchList = (searchTerm: string) => {

  //   const filtered = blogData.filter(

  //     function (blog) {
  //       return blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         blog.description.toLowerCase().includes(searchTerm.toLowerCase());
  //     }
  //   );
  //   setFilteredData(filtered);
  // };


  return (
    <React.Fragment>
      <Row className="g-2 mb-4">
        {/* Blog Management Header */}
        <Col sm={6}>
          <div className="d-flex justify-content-between mb-4">
            <h5>Blog Management</h5>
          </div>
        </Col>

        {/* Add Blog Button */}
        <Col sm={6} className="d-flex justify-content-end align-items-center">
          <Button color="success" onClick={handleAddButtonClick}>
            <i className="ri-add-fill me-1 align-bottom"></i> Add Blog
          </Button>
        </Col>
      </Row>

      {/* Search Bar Section */}
      {/* <Row className="mb-3">
    <Col sm={5}>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bx bx-search-alt"></i>
        </span>
     
     
        <input
          type="text"
          className="form-control"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </Col>
  </Row> */}
      {showLoader ? (
        <Loader /> // Display a loader while data is loading
      ) : (
        <TableContainer
          columns={columns} // Columns definition
          data={blogData} // Pass the filtered data here
          isGlobalFilter={true} // Disable global filter, since you're handling the filter manually
          customPageSize={limit} // Custom page size, adjust as needed
          totalPages={selectedTotalPages ?? 0} // Total number of pages
          totalItems={selectedTotalItems ?? 0} // Total number of items
          currentPageIndex={selectedCurrentPage ?? 0} // Current page index
          searchText={handleSearchText}
          divClass="table-responsive table-card"
          SearchPlaceholder="Search for Blogs..." // Adjusted search placeholder text
          onChangeIndex={handlePageChange} // Handle pagination page change
        />
      )}

      {/* Modal for adding/editing a blog */}
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
          {newBlog && newBlog.id ? "Update Blog" : "Add Blog"}
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              title: newBlog?.title || "",
              description: newBlog?.description || "",
              image: selectedImage || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setShowSpinner(true);
              if (newBlog && newBlog.id) {
                handleUpdateBlog(values);
              } else {
                handleAddBlog(values);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              values,
              handleSubmit,
              errors,
              touched,
            }) => (
              <FormikForm onSubmit={handleSubmit}>
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
                            // accept="image/png, image/gif, image/jpeg"
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
                                  ? URL.createObjectURL(selectedImage)  // If selectedImage is a File, create a URL
                                  : (newBlog?.image ? newBlog.image : Blog1)  // If newBlog has an image, use it; else fallback to Blog1
                              }
                              alt="Blog"
                              className="avatar-md rounded-circle"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="title" className="form-label">
                        Title
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                        invalid={touched.title && !!errors.title}
                      />
                      {touched.title && errors.title ? (
                        <div className="text-danger">{errors.title}</div>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="description" className="form-label">
                        Description
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        type="textarea"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        invalid={touched.description && !!errors.description}
                        style={{ height: '150px', width: '100%' }} // Adjust the height and width as needed
                      />
                      {touched.description && errors.description ? (
                        <div className="text-danger">{errors.description}</div>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <div className="modal-footer">
                  <Button color="secondary" onClick={toggleModal}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    className="btn btn-success"
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
              </FormikForm>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Delete confirmation modal */}
      <DeleteModal
        show={deleteModal}
        showSpinner={showSpinner}
        onDeleteClick={confirmDelete}
        onCloseClick={toggleDeleteModal}
        recordId={recordId}
      />
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default BlogTable;
