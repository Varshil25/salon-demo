const db = require("../models");
const fs = require('fs');
const path = require('path'); // Make sure path is imported
const { put } = require('@vercel/blob'); // Import 'put' directly if using Vercel's blob SDK upload method
const sendResponse = require('../helpers/responseHelper');  // Import the helper
const { where } = require("sequelize");
const bcrypt = require('bcrypt');
const { sendEmail } = require("../services/emailService");
const { INVITE_BARBER_TEMPLATE_ID } = require("../config/sendGridConfig");
const {role}= require('../config/roles.config');
const { Op } = require("sequelize");
const { AppointmentENUM } = require("../config/appointment.config");
const AppointmentService = db.AppointmentService;
const AWS = require('aws-sdk');

// Import necessary modules

const Barber = db.Barber;
const User = db.USER;
const Salon = db.Salon; 
const Appointment = db.Appointment;
const roles = db.roles;

// Function to update the barber's status based on appointments
async function updateBarberStatus(barberId) {
  try {
    const activeAppointments = await Appointment.findOne({
      where: {
        barber_id: barberId,
        status: [AppointmentENUM.In_salon, AppointmentENUM.Checked_in]  // Check if any ongoing or upcoming appointments
      }
    });

    let newStatus = activeAppointments ? 'running' : 'available';

    await Barber.update({ availability_status: newStatus }, { where: { id: barberId } });
  } catch (error) {
    console.error("Error updating barber status:", error);
  }
}
 

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('https://tor1.digitaloceanspaces.com'),
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
});

exports.create = async (req, res) => {
  try {
    // Validate required fields
    const { firstname, lastname, email, mobile_number, password, availability_status, default_service_time, cutting_since, organization_join_date, SalonId, address, background_color, default_start_time, default_end_time } = req.body;

    if (!firstname || !lastname || !email || !mobile_number || !password || !availability_status || !default_service_time || !cutting_since || !organization_join_date || !SalonId || !background_color || !default_start_time || !default_end_time) {
      return sendResponse(res, false, 'All fields are required', null, 400);  // Return a 400 error if any field is missing
    }

    let profile_photo = null;
    if (req.file) {
      const fileBuffer = req.file.buffer; // Get file buffer

      // Validate the file type (optional)
      if (!req.file.mimetype.startsWith('image/')) {
        return sendResponse(res, false, 'Only image files are allowed!', null, 400);  // Return an error if the file is not an image
      }

      // Upload to DigitalOcean Spaces
      const params = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: `barber-photo/${Date.now()}-${req.file.originalname}`, // Using 'barber-photo' folder
        Body: req.file.buffer,
        ACL: 'public-read',
        ContentType: req.file.mimetype,
      };

      try {
        const uploadResult = await s3.upload(params).promise();
        profile_photo = uploadResult.Location; // Obtain the URL after upload
      } catch (error) {
        console.error('Error uploading photo to DigitalOcean Spaces:', error);
        return sendResponse(res, false, 'Failed to upload photo', error.message, 500);
      }
    }

    // Check if the user already exists by email
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return sendResponse(res, false, "Email already exists", null, 409);
    }

    // Find the default user role
    const barberRole = await roles.findOne({ where: { role_name: role.BARBER } });
    if (!barberRole) {
      return sendResponse(res, false, "User role not found", "The default user role could not be found in the system. Please contact support.", 500);
    }

    // Check if barber with the same name exists in the salon
    const barberExists = await Barber.findOne({
      where: { name: `${firstname} ${lastname}`, SalonId }
    });
    if (barberExists) {
      return sendResponse(res, false, "Barber already exists in this salon", null, 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Automatically generate a unique username
    let baseUsername = `${firstname.toLowerCase()}_${lastname.toLowerCase()}`;
    let username = baseUsername;
    let userWithSameUsername = await User.findOne({ where: { username } });

    let counter = 1;
    while (userWithSameUsername) {
      username = `${baseUsername}${counter}`;
      userWithSameUsername = await User.findOne({ where: { username } });
      counter++;
    }

    const user = await User.create({
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      google_token: "",
      profile_photo: profile_photo,
      password: hashedPassword,
      RoleId: barberRole.id,
      address: address,
      mobile_number: mobile_number
    });

    if (user) {
      // Create the barber associated with the user
      let barber = await Barber.create({
        name: firstname + " " + lastname,
        availability_status,
        default_service_time,
        cutting_since,  // Expecting YYYY-MM-DD
        organization_join_date,  // Expecting YYYY-MM-DD
        photo: profile_photo,  // Use uploaded photo URL or null if no file uploaded
        SalonId,  // ID of the salon
        UserId: user.id,  // Link the barber to the user
        background_color,  // Link the barber to the user
        default_start_time,
        default_end_time
      });

      barber.user = user;

      // Reload the Barber instance to include the user
      barber = await Barber.findOne({
        where: { id: barber.id },
        include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
      });

      // Prepare email data for SendGrid
      const emailData = {
        barber_name: `${firstname} ${lastname}`,
        email: email,
        password: password,
        company_name: 'Shear Brilliance',
        url:process.env.ADMIN_URL
      };

      // Send confirmation email to the barber
      await sendEmail(email, "Added as a Barber", INVITE_BARBER_TEMPLATE_ID, emailData);

      return sendResponse(res, true, 'Barber created successfully', { barber }, 200);
    }

    // Return success response with the created data
    return sendResponse(res, true, 'Something is wrong', null, 500);

  } catch (error) {
    // Log the error for debugging
    console.error('Error creating barber:', error);

    // Return error response with a message
    return sendResponse(res, false, error.message || 'An error occurred while creating the barber', null, 500);
  }
};




// Get all barbers along with their salons
exports.findAll = async (req, res) => {
  try {
    const { salonId } = req.query; // Retrieve salonId from the query parameters

    // Build the where condition to include salonId only if it is provided
    const whereCondition = salonId ? { SalonId: salonId } : {}; 

    // Fetch barbers based on the condition
    const barbers = await Barber.findAll({
      where: whereCondition,
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps
      include: [
        {
          model: Salon,
          as: 'salon'
        },
        {
          model: User,   // This is the association you want to include
          as: 'user' ,         // Use the alias you defined in the association (if any)
          attributes: { exclude: ['password'] } // Exclude password from User
        }
      ]
    });

    return sendResponse(res, true, 'Barbers retrieved successfully', barbers, 200);
  } catch (error) {
    return sendResponse(res, false, error.message, null, 500);
  }
};

// Admin side API with pagination and a unified search query for username, salonName, and status


exports.adminBarberfindAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    // Get the user from the token (you already have the token verified, so you can access req.user)
    const user = req.user; // Assuming req.user contains the decoded JWT token data

    // Initialize whereCondition for the filters
    const whereCondition = {};

    // If the user is a Salon Owner, filter by their associated salonId
    if (user.role === role.SALON_OWNER) {
      whereCondition.SalonId = user.salonId;
    }

    // If search query is provided, filter by salonName, username, or availability status
    if (search) {
      // Validate and filter by availability status if present in the search query
      const allowedStatuses = ['available', 'unavailable', 'running']; // Enum values for availability status
      if (allowedStatuses.includes(search)) {
        whereCondition.availability_status = { [Op.eq]: search };
      } else {
        // Search for salon name and username if status is not provided or is invalid
        whereCondition[Op.or] = [
          {
            '$salon.name$': { [Op.iLike]: `%${search}%` } // Search for salon name
          },
          {
            '$user.username$': { [Op.iLike]: `%${search}%` } // Search for username
          }
        ];
      }
    }

    // Fetch barbers with pagination, filtering, and associations
    const barbers = await Barber.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps
      include: [
        {
          model: Salon,
          as: 'salon',
          attributes: ['id', 'name'] // Include only id and name of the salon
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] } // Exclude password from User
        }
      ],
      limit: parseInt(limit), // Apply pagination limit
      offset: parseInt(offset), // Apply pagination offset
      order: [['name', 'ASC']] // Optional: Sorting by barber name
    });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(barbers.count / limit);

    // Respond with the paginated barbers data
    sendResponse(res, true, 'Barbers retrieved successfully', {
      totalItems: barbers.count,
      totalPages: totalPages,
      currentPage: parseInt(page),
      barbers: barbers.rows
    }, 200);
  } catch (error) {
    return sendResponse(res, false, error.message, null, 500);
  }
};


// Get a barber by ID
exports.findOne = async (req, res) => {
  try {
    const barber = await Barber.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps
      include: [
        {
          model: Salon,
          as: 'salon'
        },
        {
          model: User,   // This is the association you want to include
          as: 'user',     // Use the alias you defined in the association (if any)
          attributes: { exclude: ['password'] } // Exclude password from User
        }
      ]
    });
    if (!barber) {
      return sendResponse(res,  false, "Barber not found", null, 404);
    }
    sendResponse(res,  true, 'Barber retrieved successfully', barber, 200);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};


// Update a barber by ID
exports.update = async (req, res) => {
  try {
    const { firstname, lastname, mobile_number, address, availability_status, default_service_time, cutting_since, organization_join_date, SalonId, background_color, default_start_time, default_end_time } = req.body;
    const updates = { ...req.body };

    // Find the barber record
    let barber = await Barber.findOne({ where: { id: req.params.id } });
    if (!barber) {
      return sendResponse(res, false, "Barber not found", null, 404);
    }

    // Check if a new profile photo is uploaded
    if (req.file) {
      const fileBuffer = req.file.buffer;

      // Upload to DigitalOcean Spaces or another cloud provider
      const params = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: `barber-photo/${Date.now()}-${req.file.originalname}`, // Upload under 'barber-photo' folder
        Body: fileBuffer,
        ACL: 'public-read',
        ContentType: req.file.mimetype,
      };

      try {
        const uploadResult = await s3.upload(params).promise();
        updates.photo = uploadResult.Location; // URL of the uploaded photo
      } catch (error) {
        console.error('Error uploading photo to cloud storage:', error);
        return sendResponse(res, false, 'Failed to upload photo', error.message, 500);
      }
    } else {
      // If no new photo is uploaded, retain the current barber photo
      updates.photo = barber.photo;
    }

    // Find and update the related user record
    const user = await User.findOne({ where: { id: barber.UserId } });
    if (!user) {
      return sendResponse(res, false, "User associated with barber not found", null, 404);
    }

    // Update the user name
    const updatedFirstname = firstname || user.firstname;
    const updatedLastname = lastname || user.lastname;

    // Construct new username and check for uniqueness
    let baseUsername = `${updatedFirstname.toLowerCase()}_${updatedLastname.toLowerCase()}`;
    let username = baseUsername;
    let userWithSameUsername = await User.findOne({ where: { username } });

    let counter = 1;
    while (userWithSameUsername && userWithSameUsername.id !== user.id) {
      username = `${baseUsername}${counter}`;
      userWithSameUsername = await User.findOne({ where: { username } });
      counter++;
    }

    // Update user with the new data
    await user.update({
      firstname: updatedFirstname,
      lastname: updatedLastname,
      username, // Updated username
      mobile_number: mobile_number || user.mobile_number,
      address: address || user.address,
    });

    // Update the barber record with the new data
    await barber.update({
      name: `${updatedFirstname} ${updatedLastname}`, // Updated barber name
      availability_status,
      default_service_time,
      cutting_since,
      background_color,
      organization_join_date,
      photo: updates.photo, // Updated photo URL
      SalonId: SalonId || barber.SalonId, // Update SalonId if provided
      background_color,
      default_start_time,
      default_end_time
    });

    // Reload the barber instance to include updated user data
    barber = await Barber.findOne({
      where: { id: barber.id },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });

    // Update barber status based on appointments after update
    await updateBarberStatus(barber.id);

    // Send response with updated barber and user data
    return sendResponse(res, true, "Barber updated successfully", { barber }, 200);

  } catch (error) {
    console.error('Error updating barber:', error);
    return sendResponse(res, false, error.message || 'An error occurred while updating the barber', null, 500);
  }
};




// Delete a barber by ID
exports.delete = async (req, res) => {
  try {
    console.log("BarberId:", req.params.id);

    // Find the barber and associated user
    const barber = await Barber.findOne({
      where: { id: req.params.id },
      include: [{ model: User, as: 'user' }],
    });

    // If barber not found, return error
    if (!barber) {
      return sendResponse(res, false, "Barber not found", null, 404);
    }

    // Delete associated appointments and related data
    const appointments = await Appointment.findAll({ where: { BarberId: req.params.id } });
    for (const appointment of appointments) {
      // Delete related records in AppointmentServices
      await AppointmentService.destroy({ where: { AppointmentId: appointment.id } });
      // Delete the appointment
      await Appointment.destroy({ where: { id: appointment.id } });
    }

    // Delete the associated user
    if (barber.user) {
      await User.destroy({ where: { id: barber.user.id } });
    }

    // Delete the barber
    await Barber.destroy({ where: { id: req.params.id } });

    // Return success response
    sendResponse(res, true, "Barber and associated data deleted successfully", null, 200);
  } catch (error) {
    console.error("Error deleting barber:", error);
    sendResponse(res, false, "Error deleting barber", error.message, 500);
  }
};


// Manually set barber status (useful for leave or unavailability)
exports.setBarberStatus = async (req, res) => {
  try {
    const { status } = req.body;  // Accept the new status from the request

    // Only allow valid statuses
    if (!['available', 'unavailable', 'running'].includes(status)) {
      return sendResponse(res, false, "Invalid status", null, 400);
    }

    await Barber.update({ availability_status: status }, { where: { id: req.params.id } });

    sendResponse(res,  true, "Barber status updated successfully", null, 200);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

// Complete an appointment
exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return sendResponse(res, false, "Appointment not found", null, 404);
    }

    // Update appointment status to completed
    appointment.status = 'completed';
    await appointment.save();

    // Update barber status based on remaining appointments
    await updateBarberStatus(appointment.barber_id);

    sendResponse(res,  true, "Appointment completed", null, 200);
  } catch (error) {
    sendResponse(res,  false, error.message, null, 500);
  }
};

//Barber status patch API
exports.updateAvailabilityStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate request body
    if (!status) {
      return sendResponse(res, false, "Status is required", null, 400);
    }

    // Normalize status to lowercase
    const normalizedStatus = status.toLowerCase();

    // Allowed statuses based on ENUM definition
    const allowedStatuses = ['available', 'unavailable', 'running'];
    if (!allowedStatuses.includes(normalizedStatus)) {
      return sendResponse(res, false, "Invalid status value. Allowed values are 'available', 'unavailable', or 'running'.", null, 400);
    }

    // Find the barber record by user ID
    const barber = await Barber.findOne({ where: { UserId: req.params.userId } });
    if (!barber) {
      return sendResponse(res, false, "Barber not found", null, 404);
    }

    // Update the barber's availability status
    barber.availability_status = normalizedStatus;
    await barber.save();

    // Optionally trigger additional logic when status changes to "running"
    if (normalizedStatus === 'running') {
      console.log(`Barber ID ${barber.id} associated with User ID ${req.params.userId} is now running`);
      // Add additional logic if necessary
    }

    // Return successful response
    return sendResponse(res, true, "Barber availability status updated successfully", { barber }, 200);

  } catch (error) {
    console.error('Error updating barber availability status:', error);
    return sendResponse(res, false, error.message || "An error occurred while updating the barber's availability status", null, 500);
  }
};


