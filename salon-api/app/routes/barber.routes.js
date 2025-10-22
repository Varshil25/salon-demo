const express = require("express");
const path = require("path");
const barberController = require("../controllers/barber.controller");
const upload = require("../config/multer.config");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/auth.middleware");
const roles = require("../config/roles.config").role;

module.exports = (app) => {
  const apiPrefix = "/api/barber";

  /**
   * @swagger
   * tags:
   *   name: Barbers
   *   description: API for managing barbers
   */

 /**
 * @swagger
 * /api/barber:
 *   post:
 *     summary: Create a new barber
 *     tags: [Barbers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: Barber's first name
 *               lastname:
 *                 type: string
 *                 description: Barber's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Barber's email address (must be unique)
 *               mobile_number:
 *                 type: string
 *                 description: Barber's mobile number
 *               password:
 *                 type: string
 *                 description: Password for the barber's account
 *               availability_status:
 *                 type: string
 *                 description: Availability status of the barber (e.g., available, unavailable)
 *               default_service_time:
 *                 type: integer
 *                 description: Default service time in minutes
 *               cutting_since:
 *                 type: string
 *                 format: date
 *                 description: Date when the barber started cutting hair (YYYY-MM-DD)
 *               organization_join_date:
 *                 type: string
 *                 format: date
 *                 description: Date when the barber joined the organization (YYYY-MM-DD)
 *               SalonId:
 *                 type: integer
 *                 description: ID of the salon the barber belongs to
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Upload the barber's profile photo (optional)
 *               address:
 *                 type: string
 *                 description: Barber's address
 *               background_color:
 *                 type: string
 *                 description: Barber's background color
 *               default_start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time of the barber's work schedule (HH:mm format, 24-hour clock)
 *               default_end_time:
 *                 type: string
 *                 format: time
 *                 description: End time of the barber's work schedule (HH:mm format, 24-hour clock)
 *     responses:
 *       200:
 *         description: Barber created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Barber created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     barber:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *       400:
 *         description: Bad Request - Missing required fields or invalid data.
 *       409:
 *         description: Conflict - Email already exists.
 *       500:
 *         description: Internal server error - An error occurred while creating the barber.
 */
  app.post(
    `${apiPrefix}`,
    authenticateJWT,
    authorizeRoles(roles.ADMIN, roles.SALON_OWNER),
    upload.single("photo"),
    barberController.create
  );

  /**
   * @swagger
   * /api/barber:
   *   get:
   *     summary: Get all barbers
   *     tags: [Barbers]
   *     responses:
   *       200:
   *         description: A list of barbers
   *       500:
   *         description: Internal server error
   */
  app.get(`${apiPrefix}`, barberController.findAll);

  /**
   * @swagger
   * /api/barber/admin:
   *   get:
   *     summary: Retrieve a list of barbers
   *     description: Retrieve a list of barbers with pagination and optional filtering. Filters include salon ID, username, salon name, and status. The search query can be used to search across multiple fields.
   *     tags:
   *       - Barbers
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         required: false
   *         description: The page number for pagination. Default is 1.
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         required: false
   *         description: The number of results per page for pagination. Default is 10.
   *       - in: query
   *         name: salonId
   *         schema:
   *           type: integer
   *         required: false
   *         description: The salon ID to filter barbers by a specific salon.
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         required: false
   *         description: The search term to filter barbers based on username, salon name, or status. Partial matches are allowed.
   *     responses:
   *       200:
   *         description: A list of barbers along with salon and user information.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Barbers retrieved successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     totalItems:
   *                       type: integer
   *                       example: 20
   *                     totalPages:
   *                       type: integer
   *                       example: 2
   *                     currentPage:
   *                       type: integer
   *                       example: 1
   *                     barbers:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                             example: 1
   *                           name:
   *                             type: string
   *                             example: "John Doe"
   *                           salon:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: integer
   *                                 example: 1
   *                               name:
   *                                 type: string
   *                                 example: "Downtown Salon"
   *                           user:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: integer
   *                                 example: 1
   *                               username:
   *                                 type: string
   *                                 example: "johndoe"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Internal server error"
   */
  app.get(
    `${apiPrefix}/admin`,
    authenticateJWT,
    authorizeRoles(roles.ADMIN, roles.SALON_OWNER),
    barberController.adminBarberfindAll
  );

/**
 * @swagger
 * /api/barber/{id}:
 *   put:
 *     summary: Update a barber by ID
 *     description: Update barber details including associated user information and profile photo. If a new profile photo is uploaded, it replaces the existing photo. Updates include barber details, user details, and associated salon information.
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The barber's unique ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: Barber's first name
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: Barber's last name
 *                 example: Doe
 *               mobile_number:
 *                 type: string
 *                 description: Barber's mobile number
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 description: Barber's address
 *                 example: "123 Main Street, City, Country"
 *               availability_status:
 *                 type: string
 *                 description: Availability status of the barber (e.g., available, unavailable, running)
 *                 example: available
 *               default_service_time:
 *                 type: integer
 *                 description: Default service time in minutes
 *                 example: 30
 *               cutting_since:
 *                 type: string
 *                 format: date
 *                 description: Date when the barber started cutting hair (YYYY-MM-DD)
 *                 example: "2015-06-15"
 *               organization_join_date:
 *                 type: string
 *                 format: date
 *                 description: Date when the barber joined the organization (YYYY-MM-DD)
 *                 example: "2020-01-10"
 *               SalonId:
 *                 type: integer
 *                 description: ID of the salon the barber is associated with
 *                 example: 2
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Upload the barber's profile photo
 *               background_color:
 *                 type: string
 *                 description: Background color for the barber's profile
 *                 example: "#ff5733"
 *               default_start_time:
 *                 type: string
 *                 format: time
 *                 description: Barber's start time (HH:mm:ss)
 *                 example: "09:00:00"
 *               default_end_time:
 *                 type: string
 *                 format: time
 *                 description: Barber's end time (HH:mm:ss)
 *                 example: "17:00:00"
 *     responses:
 *       200:
 *         description: Barber updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Barber updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     barber:
 *                       type: object
 *                       description: Updated barber information
 *       404:
 *         description: Barber not found or associated user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Barber not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the barber"
 */

//update barber 
  app.put(
    `${apiPrefix}/:id`,
    authenticateJWT,
    authorizeRoles(roles.ADMIN, roles.SALON_OWNER, roles.BARBER),
    upload.single("photo"),
    barberController.update
  );


  

  /**
   * @swagger
   * /api/barber/{id}:
   *   delete:
   *     summary: Delete a barber by ID
   *     tags: [Barbers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The barber ID
   *     responses:
   *       200:
   *         description: Barber deleted successfully
   *       404:
   *         description: Barber not found
   *       500:
   *         description: Internal server error
   */
  app.delete(
    `${apiPrefix}/:id`,
    authenticateJWT,
    authorizeRoles(roles.ADMIN, roles.SALON_OWNER, roles.BARBER),
    barberController.delete
  );

  /**
   * @swagger
   * /api/barber/images/{filename}:
   *   get:
   *     summary: Get a barber's profile image by filename
   *     tags: [Barbers]
   *     parameters:
   *       - in: path
   *         name: filename
   *         required: true
   *         schema:
   *           type: string
   *         description: The name of the image file
   *     responses:
   *       200:
   *         description: Image retrieved successfully
   *       404:
   *         description: Image not found
   *       500:
   *         description: Internal server error
   */
  app.get(`${apiPrefix}/images/:filename`, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../../uploads", filename);

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(err.status).send({ message: "Image not found." });
      }
    });
  });

  /**
   * @swagger
   * /api/barber/status/{id}:
   *   put:
   *     summary: Manually update a barber's status
   *     tags: [Barbers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The barber ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [available, unavailable, running]
   *                 description: The new status for the barber
   *     responses:
   *       200:
   *         description: Barber status updated successfully
   *       400:
   *         description: Invalid status
   *       500:
   *         description: Internal server error
   */
  app.put(`${apiPrefix}/status/:id`, barberController.setBarberStatus);



/**
 * @swagger
 * /api/barber/user/{userId}/availability-status:
 *   patch:
 *     summary: Update a barber's availability status based on user ID
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID associated with the barber whose status needs to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, unavailable, running]
 *                 description: The new status for the barber
 *                 example: available
 *     responses:
 *       200:
 *         description: Barber availability status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Barber availability status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     barber:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         availability_status:
 *                           type: string
 *                           example: available
 *       400:
 *         description: Invalid status or missing required field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid status value. Allowed values are 'available', 'unavailable', or 'running'.
 *                 data:
 *                   type: null
 *       404:
 *         description: Barber not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Barber not found
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the barber's availability status
 *                 data:
 *                   type: null
 */

 // Patch API for updating barber's availability status based on user ID
app.patch(`${apiPrefix}/user/:userId/availability-status`, authenticateJWT, authorizeRoles(roles.BARBER), barberController.updateAvailabilityStatus);



};
