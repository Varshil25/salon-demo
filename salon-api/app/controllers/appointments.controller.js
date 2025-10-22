const { AppointmentENUM } = require("../config/appointment.config");
const db = require("../models");
const Appointment = db.Appointment;
const Barber = db.Barber;
const Salon = db.Salon;
const Service = db.Service;
const User = db.USER;
const roles = db.roles;
const HaircutDetails =db.HaircutDetails;
const FavoriteSalon=db.FavoriteSalon;
const BarberSession = db.BarberSession;
const { Op, where } = require("sequelize");
const moment = require("moment");
const { role } = require("../config/roles.config");
const sendResponse = require('../helpers/responseHelper');  // Import the helper
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { INVITE_CUSTOMER_WITH_PASSWORD_TEMPLATE_ID } = require("../config/sendGridConfig");
const { sendEmail } = require("../services/emailService");
const { sendMessageToUser } = require('./socket.controller');
const { sendSMS } = require('../services/smsService');
const { Sequelize } = require('sequelize');
const { broadcastBoardUpdates } = require('../controllers/socket.controller');

let io; // Declare io in the controller's scope

// Initialize with the Socket.IO instance
exports.initialize = (socketIo) => {
    io = socketIo;
};

// Function to calculate estimated wait time for a particular barber
const getEstimatedWaitTimeForBarber = async (barberId) => {
    // Fetch all appointments for the barber that are 'checked_in' or 'in_salon'
    const appointments = await Appointment.findAll({
        where: { BarberId: barberId, status: ['checked_in', 'in_salon'] },
        order: [['queue_position', 'ASC']], // Order by queue position to process in order
        include: [{ 
            model: Service, 
            attributes: ['id', 'default_service_time'], // Fetch the 'estimated_service_time' from the Service model
            through: { attributes: [] } // Avoid extra attributes from the join table
        }],
    });

    let cumulativeQueuePosition = 0; // To track the cumulative number of people in the queue
    let cumulativeWaitTime = 0; // To track the cumulative wait time

    let applength = appointments.length;

    if(applength > 0){
         // Check if there is only one 'in_salon' user
         const inSalonUser = appointments.find(a => a.status === 'in_salon');
         const checkedInUsers = appointments.filter(a => a.status === 'checked_in');
        
         if (inSalonUser && checkedInUsers.length === 0) {
            const currentTime = new Date();

             // Calculate elapsed time since the user was marked 'in_salon'
             const inSalonTime = new Date(inSalonUser.in_salon_time); // Start time of `in_salon` status
             const elapsedTime = Math.floor((currentTime - inSalonTime) / 60000); // Elapsed time in minutes
 
             // Calculate remaining time for the `in_salon` user
             const totalServiceTime = inSalonUser.Services.reduce(
                 (sum, service) => sum + (service.default_service_time || 0),
                 0
             );
             const remainingServiceTime = Math.max(totalServiceTime - elapsedTime, 0);
 
             // Add the remaining service time to the cumulative wait time
             cumulativeWaitTime += remainingServiceTime;
             cumulativeQueuePosition = applength; // Set queue position based on total appointments
        } else {
            let lastApp = appointments[applength - 1];

            const totalServiceTime = lastApp?.Services?.length > 0
                ? lastApp.Services.reduce((sum, service) => sum + (service.default_service_time  || 0), 0) // Sum of estimated service times
                : 20; // If no services are selected, the wait time is zero


            cumulativeWaitTime = lastApp.estimated_wait_time + totalServiceTime;
            cumulativeQueuePosition = applength;
        }
    }
    return { 
        totalWaitTime: cumulativeWaitTime, // Total cumulative wait time for the next user
        numberOfUsersInQueue: cumulativeQueuePosition // Total number of people in the queue
    };
};

const recalculateWaitTimesAndQueuePositionsForBarber = async (barberId) => {
    // Fetch all appointments for the barber that are 'checked_in' or 'in_salon'
    const appointments = await Appointment.findAll({
        where: { BarberId: barberId, status: ['checked_in', 'in_salon'] },
        order: [['queue_position', 'ASC']], // Order by queue position to process in order
        include: [{ 
            model: Service, 
            attributes: ['id', 'default_service_time'], // Fetch the 'estimated_service_time' from the Service model
            through: { attributes: [] } // Avoid extra attributes from the join table
        }],
    });

    let cumulativeQueuePosition = 0; // Tracks cumulative queue position
    let cumulativeWaitTime = 0; // Tracks cumulative wait time
    let firstUserPendingTime  = 0;

    // Process 'in_salon' user first (if any)
    const inSalonAppointments = appointments.filter(a => a.status === 'in_salon');
    if (inSalonAppointments.length > 0) {
        const inSalonUser = inSalonAppointments[0]; // Only one user in 'in_salon' at a time
        inSalonUser.queue_position = 1;
        inSalonUser.estimated_wait_time = 0; // First user has no wait time
        const inSalonServiceTime = inSalonUser.Services?.reduce((sum, service) => sum + (service.default_service_time || 0), 0);
        
        // Update cumulative values based on the in_salon user
        cumulativeQueuePosition += inSalonUser.number_of_people;
        cumulativeWaitTime += inSalonUser.number_of_people * inSalonServiceTime;

        const inSalonTime = new Date(inSalonUser.in_salon_time); // Convert to a Date object
        const now = new Date(); // Get the current date and time
            
        // Calculate the difference in milliseconds
        const differenceInMs = now - inSalonTime;
            
        // Convert the difference to minutes
        const differenceInMinutes = Math.floor(differenceInMs / 60000);

        firstUserPendingTime = inSalonServiceTime - differenceInMinutes;
        
        await inSalonUser.save();
    }

    // Process 'checked_in' users and update their estimated wait times and queue positions
    const checkedInAppointments = appointments.filter(a => a.status === 'checked_in');

    for (let index = 0; index < checkedInAppointments.length; index++) {

        const appointment = checkedInAppointments[index];

        if(index == 0){
            if (inSalonAppointments.length > 0) {
                cumulativeQueuePosition += 1; // Increment queue position by 1 for each new user
                appointment.queue_position = cumulativeQueuePosition;
                appointment.estimated_wait_time = firstUserPendingTime;
                await appointment.save(); // Save updated appointment details
            }
            else{
                cumulativeQueuePosition += 1; // Increment queue position by 1 for each new user
                appointment.queue_position = cumulativeQueuePosition;
                appointment.estimated_wait_time = firstUserPendingTime;
                await appointment.save(); // Save updated appointment details
            }
        }
        else{
            let lastAppointment = checkedInAppointments[index-1];

            const totalServiceTime = lastAppointment?.Services?.length > 0
            ? lastAppointment.Services.reduce((sum, service) => sum + (service.default_service_time  || 0), 0) // Sum of estimated service times
            : 20; // If no services are selected, the wait time is zero
    
            cumulativeQueuePosition += 1; // Increment queue position by 1 for each new user
            appointment.queue_position = cumulativeQueuePosition;
            appointment.estimated_wait_time = lastAppointment.estimated_wait_time + totalServiceTime;
        
            console.log(`Processing index ${index}, appointment ID: ${appointment.id}`);
        
            await appointment.save(); // Save updated appointment details
        } 
    }
};

exports.create = async (req, res) => {
    try {
      let { user_id, salon_id, barber_id, number_of_people, name, mobile_number, service_ids } = req.body;
  
      user_id = req.user ? req.user.id : user_id;
  
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  
      // Check if the user already has an active appointment
      const activeAppointment = await Appointment.findOne({
        where: { UserId: user_id, status: [AppointmentENUM.Checked_in, AppointmentENUM.In_salon] }
      });
      if (activeAppointment) {
        return res.status(400).send({
          success: false,
          message: "You already have an active appointment. Please complete or cancel it before booking a new one.",
          data: null,
          code: 400,
        });
      }
  
      // Retrieve the barber session
      const barberSession = await BarberSession.findOne({
        where: {
          BarberId: barber_id,
          session_date: { [Op.between]: [todayStart, todayEnd] }
        },
        attributes: ['id', 'start_time', 'end_time', 'session_date', 'remaining_time']
      });
  
      if (!barberSession) {
        return sendResponse(res, false, 'Barber is not available for appointments today', null, 400);
      }
  
      // Check for existing appointments for the barber
      const activeBarberAppointments = await Appointment.findAll({
        where: {
          BarberId: barber_id,
          status: [AppointmentENUM.Checked_in, AppointmentENUM.In_salon]
        },
      });
  
      // Calculate remaining time based on active appointments or session end time
      let remainingTime;
      if (activeBarberAppointments.length > 0) {
        remainingTime = barberSession.remaining_time;
      } else {
        const now = new Date();
        const endTimeString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${barberSession.end_time}`;
        const sessionEndTime = new Date(endTimeString);
  
        if (isNaN(sessionEndTime)) {
          console.error("Invalid session end time format");
          return sendResponse(res, false, 'Invalid barber session configuration', null, 500);
        }
  
        remainingTime = Math.max(
          Math.round((sessionEndTime - now) / (1000 * 60)), // Convert milliseconds to minutes
          0
        );
      }
  
      // Calculate total service time
      const services = await Service.findAll({
        where: { id: service_ids },
        attributes: ['default_service_time'],
      });
  
      const totalServiceTime = services.reduce((sum, service) => sum + service.default_service_time, 0);
  
      // Ensure there's enough time left for the appointment
      if (remainingTime < totalServiceTime) {
        return sendResponse(res, false, 'Not enough remaining time for this appointment', null, 400);
      }
  
      // Update barber's remaining_time
      const newRemainingTime = remainingTime - totalServiceTime;
      await barberSession.update({ remaining_time: newRemainingTime });
  
      // Calculate estimated wait time and queue position
      const { totalWaitTime, numberOfUsersInQueue } = await getEstimatedWaitTimeForBarber(barber_id);
      const queuePosition = numberOfUsersInQueue + 1;
      const estimatedWaitTime = totalWaitTime;
  
      // Create the appointment
      const appointment = await Appointment.create({
        UserId: user_id,
        BarberId: barber_id,
        SalonId: salon_id,
        number_of_people: number_of_people,
        status: AppointmentENUM.Checked_in,
        estimated_wait_time: estimatedWaitTime,
        queue_position: queuePosition,
        check_in_time: new Date(),
        name: name,
        mobile_number: mobile_number,
      });
  
      if (service_ids && Array.isArray(service_ids) && service_ids.length > 0) {
        await appointment.addServices(service_ids);
      }
  
      await appointment.update({ updatedAt: null });
  
      const appointmentWithServices = await Appointment.findOne({
        where: { id: appointment.id },
        include: [
          {
            model: Service,
            attributes: ['id', 'name', 'default_service_time'],
            through: { attributes: [] },
          },
        ],
      });
  
      const salon = await db.Salon.findOne({ where: { id: salon_id } });
      const salonName = salon ? salon.name : 'the selected salon';
  
      const message = `Dear ${name}, your appointment has been successfully booked at ${salonName}. The estimated wait time is ${estimatedWaitTime} minutes. We look forward to serving you.`;
      try {
        await sendSMS(mobile_number, message);
        console.log("SMS sent successfully.");
      } catch (smsError) {
        console.error("Failed to send SMS:", smsError.message);
      }
  
      const updatedAppointments = await getAppointmentsByRole(false);
      broadcastBoardUpdates(updatedAppointments);
  
      return sendResponse(res, true, 'Appointment created successfully', appointmentWithServices, 201);
    } catch (error) {
      console.error("Error creating appointment:", error);
      return sendResponse(res, false, error.message || 'Internal Server Error', null, 500);
    }
  };
  

exports.updateStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      // Find the appointment with the associated Barber
      const appointment = await Appointment.findByPk(req.params.id, {
        include: [
          {
            model: Barber,
            as: 'Barber', // Alias for the association
          },
          {
            model: Service,
            attributes: ['id', 'default_service_time'], // Ensure service time is fetched
            through: { attributes: [] },
        },
        ],
      });
  
      if (!appointment) {
        return sendResponse(res, false, "Appointment not found", null, 404);
      }
  
      // Check if the salon is closed, if so cancel appointments
      const salon = await Salon.findByPk(appointment.SalonId);
      if (salon && salon.isClosed) {
        const cancellationResult = await cancelCheckedInOrInSalonAppointments(appointment.SalonId);
        if (!cancellationResult) {
          return sendResponse(res, false, "Error canceling appointments", null, 500);
        }
        console.log(`Appointments were canceled for Salon ID ${appointment.SalonId}`);
      }
  
      // Define valid status transitions
      const validTransitions = {
        checked_in: ['in_salon', 'canceled'],
        in_salon: ['completed'],
        completed: [], // No transitions allowed
        canceled: [], // No transitions allowed
      };
  
      // Check if the new status is valid for the current status
      if (!validTransitions[appointment.status]?.includes(status)) {
        return sendResponse(
          res,
          false,
          `Sorry..!  You can't go back `,
          null,
          400
        );
      }
  
      // Check if the Barber is already serving another appointment in the Salon
      if (status === 'in_salon') {
        const activeAppointment = await Appointment.findOne({
          where: {
            BarberId: appointment.BarberId,
            SalonId: appointment.SalonId,
            status: 'in_salon',
          },
        });
  
        if (activeAppointment) {
          return sendResponse(
            res,
            false,
            "Sorry, this Barber is already serving another appointment.",
            null,
            400
          );
        }
  
        // Update status and perform corresponding actions
        appointment.in_salon_time = new Date();
        appointment.queue_position = 1; // Set priority queue position
        appointment.estimated_wait_time = 0; // Immediate service
      } else if (status === 'completed') {
        appointment.complete_time = status === 'completed' ? new Date() : null;
        appointment.estimated_wait_time = 0;
        appointment.queue_position = 0;
      } else if ( status === 'canceled'){
        const canceledWaitTime = appointment.estimated_wait_time; // Initialize canceledWaitTime
        appointment.cancel_time = new Date();
 
        appointment.estimated_wait_time = 0;
        appointment.queue_position = 0;

          // Fetch the barber session
          const barberSession = await BarberSession.findOne({
            where: { BarberId: appointment.BarberId },
        });

        if (!barberSession) {
            return sendResponse(res, false, "Barber session not found", null, 404);
        }

        // Calculate the total service time to restore
        const totalServiceTime = appointment.Services.reduce((sum, service) => {
            return sum + (service.default_service_time || 0); // Ensure service time is not null
        }, 0);

        // Calculate the new remaining time
        let updatedRemainingTime = barberSession.remaining_time + totalServiceTime;

        // Cap remaining time to the barber's total available time
        const totalAvailableTime = barberSession.total_time;
        if (updatedRemainingTime > totalAvailableTime) {
            updatedRemainingTime = totalAvailableTime;
        }

        // Save the new remaining time to the database
        await barberSession.update({ remaining_time: updatedRemainingTime });
        // Save the updated canceled appointment
        await appointment.save();
      }
  
      appointment.status = status;
      await appointment.save();
  
      if (status === 'completed' || status === 'in_salon' || status === 'canceled'){
      // Recalculate wait times and queue positions
      await recalculateWaitTimesAndQueuePositionsForBarber(appointment.BarberId);
      }
  
      // Notify the user about the updated wait time or status
      sendMessageToUser(appointment.UserId, 'waitTimeUpdate', appointment);
  
      const appointments = await Appointment.findAll({
        where: {
          BarberId: appointment.BarberId,
          status: ['checked_in', 'in_salon'],
        },
        include: [
          {
            model: Barber,
            as: 'Barber', // Include associated Barber
          },
        ],
      });
  
      appointments.forEach((element) => {
        // Notify users about the updated wait time or status
        sendMessageToUser(element.UserId, 'waitTimeUpdate', element);
      });
  
      return sendResponse(res, true, "Appointment status updated", appointment, 200);
    } catch (error) {
      return sendResponse(res, false, error.message, null, 500);
    }
  };
  

// Cancel an appointment
exports.cancel = async (req, res) => {
    try {
        // Fetch the appointment by its ID with related services
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: Service,
                    attributes: ['id', 'default_service_time'], // Ensure service time is fetched
                    through: { attributes: [] },
                },
            ],
        });

        if (!appointment) {
            return sendResponse(res, false, "Appointment not found", null, 404);
        }

        if (appointment.status === 'canceled') {
            return sendResponse(res, false, "Appointment is already canceled", null, 400);
        }

        // Fetch the barber session
        const barberSession = await BarberSession.findOne({
            where: { BarberId: appointment.BarberId },
        });

        if (!barberSession) {
            return sendResponse(res, false, "Barber session not found", null, 404);
        }

        // Calculate the total service time to restore
        const totalServiceTime = appointment.Services.reduce((sum, service) => {
            return sum + (service.default_service_time || 0); // Ensure service time is not null
        }, 0);

        // Calculate the new remaining time
        let updatedRemainingTime = barberSession.remaining_time + totalServiceTime;

        // Cap remaining time to the barber's total available time
        const totalAvailableTime = barberSession.total_time;
        if (updatedRemainingTime > totalAvailableTime) {
            updatedRemainingTime = totalAvailableTime;
        }

        // Save the new remaining time to the database
        await barberSession.update({ remaining_time: updatedRemainingTime });

        // Update appointment status to canceled
        appointment.status = 'canceled';
        appointment.cancel_time = new Date();
        appointment.estimated_wait_time = 0;
        appointment.queue_position = 0;
        await appointment.save();

        // Recalculate wait times and queue positions for the barber
        await recalculateWaitTimesAndQueuePositionsForBarber(appointment.BarberId);

        // Fetch updated appointments and broadcast the updates
        const updatedAppointments = await getAppointmentsByRole(false);
        broadcastBoardUpdates(updatedAppointments);

        return sendResponse(res, true, "Appointment canceled successfully", null, 200);
    } catch (error) {
        console.error("Error canceling appointment:", error);
        return sendResponse(res, false, error.message || "Internal Server Error", null, 500);
    }
};


exports.findAll = async (req, res) => {
    const { page = 1, limit = 10, startDate, endDate, status, search } = req.query;
    const offset = (page - 1) * limit;

    try {
        if (!req.user) {
            return sendResponse(res, false, "User not authenticated", null, 401);
        }

        console.log("Authenticated user:", req.user);

        // Initialize appointment filter
        const appointmentFilter = {};

        const userRole = req.user.role;
        if (userRole === role.BARBER) {
            if (!req.user.barberId) {
                return sendResponse(res, false, "Unauthorized: Barber ID is missing.", null, 403);
            }
            appointmentFilter.BarberId = req.user.barberId;
        } else if (userRole === role.SALON_OWNER) {
            if (!req.user.salonId) {
                return sendResponse(res, false, "Unauthorized: Salon ID is missing.", null, 403);
            }
            appointmentFilter.SalonId = req.user.salonId;
        } else if (userRole !== role.ADMIN) {
            return sendResponse(res, false, "Unauthorized: Invalid role.", null, 403);
        }

        // Apply date filters if provided
        if (startDate || endDate) {
            appointmentFilter.createdAt = {};

            if (startDate) {
                appointmentFilter.createdAt[Sequelize.Op.gte] = new Date(`${startDate}T00:00:00Z`);
            }

            if (endDate) {
                appointmentFilter.createdAt[Sequelize.Op.lte] = new Date(`${endDate}T23:59:59Z`);
            }
        }

        // Apply status filter if provided
        if (status === null || status === "" || status === undefined) {
            // If no status is provided, fetch all appointments, regardless of status or date
            // No need to add any status or date filter in this case.
        }else{
            const allowedStatuses = [AppointmentENUM.In_salon,AppointmentENUM.Checked_in,AppointmentENUM.Canceled,AppointmentENUM.Completed];
            if (allowedStatuses.includes(status)) {
                appointmentFilter.status = status;
            } else {
                return sendResponse(res, false, 'Invalid status value. Allowed values are "in_salon", "checked_in", "canceled", "completed".', null, 400);
            }
        }

        // Add search functionality
        const searchConditions = [];
        if (search) {
            searchConditions.push(
                { '$Barber.name$': { [Sequelize.Op.iLike]: `%${search}%` } },
                { '$salon.name$': { [Sequelize.Op.iLike]: `%${search}%` } },
                // { '$User.username$': { [Sequelize.Op.iLike]: `%${search}%` } },
                {  name: { [Sequelize.Op.iLike]: `%${search}%` } }
            );
        }

        // Combine search filters
        if (searchConditions.length > 0) {
            appointmentFilter[Sequelize.Op.or] = searchConditions;
        }

        // Fetch appointments with filters and pagination
        const appointments = await Appointment.findAndCountAll({
            where: appointmentFilter,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                {
                    model: Barber,
                    as: 'Barber',
                    attributes: ['id', 'name', 'availability_status', 'default_service_time', 'cutting_since', 'organization_join_date', 'photo', 'default_start_time','default_end_time'],
                },
                {
                    model: Salon,
                    as: 'salon',
                    attributes: ['id', 'name', 'address', 'phone_number', 'open_time', 'close_time', 'photos'],
                },
                {
                    model: User,
                    as: 'User',
                    attributes: { exclude: ['password'] },
                },
                { 
                    model: Service, 
                    attributes: ['id','name', 'default_service_time'], // Fetch the 'estimated_service_time' from the Service model
                    through: { attributes: [] } // Avoid extra attributes from the join table
                },
            ]
        });

        // Calculate total pages
        const totalPages = Math.max(1, Math.ceil(appointments.count / limit));

        return sendResponse(res, true, 'Fetched all appointments successfully', {
            totalItems: appointments.count,
            totalPages,
            currentPage: page,
            appointments: appointments.rows,
        }, 200);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return sendResponse(res, false, error.message, null, 500);
    }
};


// Get an appointment by ID for customer side 
exports.findOne = async (req, res) => {
    try {
        const { role: userRole, id: userId } = req.user; // Extract role and user ID from token
        const appointmentId = req.params.id;

        if (!appointmentId) {
            return sendResponse(res, false, "Appointment ID is required", null, 400);
        }

        let whereCondition = { id: appointmentId }; // Default condition: fetch by appointment ID
        let barberId = null;

        // Role-specific logic
        if (userRole === role.BARBER) {
            // Fetch Barber ID for the logged-in user
            const barber = await Barber.findOne({ where: { UserId: userId } });
            if (!barber) {
                return sendResponse(
                    res,
                    false,
                    "No barber profile found for this user",
                    null,
                    404
                );
            }
            barberId = barber.id;
            whereCondition.BarberId = barberId; // Barbers can only access their own appointments
        } else if (userRole === role.CUSTOMER) {
            // Customers can only access their own appointments
            whereCondition.UserId = userId;
        } else if (userRole === role.SALON_OWNER) {
            // Salon Owners can access appointments related to their salon's barbers
            const salon = await Salon.findOne({ where: { UserId: userId } });
            if (!salon) {
                return sendResponse(
                    res,
                    false,
                    "No salon profile found for this user",
                    null,
                    404
                );
            }
            whereCondition.SalonId = salon.id;
        } else if (userRole !== role.ADMIN) {
            // For undefined roles, deny access
            return sendResponse(res, false, "Unauthorized access", null, 403);
        }

        // Fetch the appointment with Salon and Barber data
        const appointment = await Appointment.findOne({
            where: whereCondition,
            include: [
                {
                    model: Salon,
                    as: 'salon',
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
                {
                    model: Barber,
                    as: 'Barber',
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
                { 
                    model: Service, 
                    attributes: ['id','name', 'default_service_time'], // Fetch the 'estimated_service_time' from the Service model
                    through: { attributes: [] } // Avoid extra attributes from the join table
                }
            ],
        });

        if (!appointment) {
            return sendResponse(res, false, "Appointment not found", null, 404);
        }

        // Additional logic for customers: Check if the salon is liked
        let isLike = false;
        if (userRole === role.CUSTOMER) {
            const favoriteSalon = await FavoriteSalon.findOne({
                where: {
                    UserId: userId,
                    SalonId: appointment.SalonId,
                    status: "like",
                },
            });
            isLike = !!favoriteSalon;
        }

        return sendResponse(res, true, "Fetched appointment successfully", {
            ...appointment.toJSON(),
            is_like: isLike,
        }, 200);
    } catch (error) {
        console.error("Error fetching appointment:", error.message);
        return sendResponse(res, false, error.message || "Internal server error", null, 500);
    }
};


// Get an appointment by UserID
exports.findAppointmentUser = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return sendResponse(res, false, "Token is required", null, 400);
        }

        const appointments = await Appointment.findAll({
            where: {
                UserId: userId,
                status: {
                    [Op.or]: [AppointmentENUM.Checked_in, AppointmentENUM.In_salon],
                },
            },
            include: [
                {
                  model: Salon,
                  as: 'salon',
                  attributes: { exclude: ['createdAt', 'updatedAt'] } // Exclude timestamps from the salon data
                },
                {
                    model: Barber,   // This is the association you want to include
                    as: 'Barber',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps
                }
            ]
        });

        if (!appointments.length) {
            return sendResponse(res, false, "No checked-in appointments found for this user", null, 404);
        } else {
            return sendResponse(res, true, 'Fetched checked-in appointments successfully', appointments, 200);
        }
    } catch (error) {
        return sendResponse(res, false, error.message || 'Internal server error', null, 500);
    }
};

// Get the waitlist position with neighbors
exports.getWaitlistPositionWithNeighbors = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null; // Get user ID from the token
        const appointmentId = req.params.id;

        // Ensure user ID is available
        if (!userId) {
            return sendResponse(res, false, "Unauthorized access", null, 401);
        }

        // Find the current appointment
        const currentAppointment = await Appointment.findByPk(appointmentId, {
            attributes: ['id', 'queue_position', 'status', 'BarberId', 'number_of_people'],
            include: [{ model: User, as: 'User', attributes: ['id', 'firstname', 'lastname', 'username'] }]
        });

        // If the appointment is not found
        if (!currentAppointment) {
            return sendResponse(res, false, "Appointment not found", null, 404);
        }

        // Get the BarberId from the current appointment
        const barberId = currentAppointment.BarberId;

        // Find all appointments for the same barber with status 'checked_in' or 'in_salon'
        const appointments = await Appointment.findAll({
            where: {
                BarberId: barberId,
                status: [AppointmentENUM.Checked_in,AppointmentENUM.In_salon]
            },
            order: [['queue_position', 'ASC']],
            attributes: ['queue_position', 'status', 'number_of_people'],
            include: [{ model: User, as: 'User', attributes: ['id', 'firstname', 'lastname', 'username'] }]
        });

        // Format the response with the required structure
        const formattedAppointments = appointments.map((app) => {
            const isCurrentUser = app.User?.id === userId; // Check if the user is the current user
            const fullName = `${app.User?.firstname || ''} ${app.User?.lastname || ''}`.trim() || 'N/A'; // Full name for the current user
            const maskedName = `${(app.User?.firstname?.charAt(0) || '').toUpperCase()}${(app.User?.lastname?.charAt(0) || '').toUpperCase()}`.trim();
            // Masked name for others

            return {
                no: app.queue_position, // Use the actual queue position
                username: isCurrentUser ? fullName : maskedName || 'N/A',
                status: app.status,
                isCurrentUser,
                currentPosition: currentAppointment.queue_position,
                barberId: barberId,
                number_of_people: app.number_of_people // Add the number of people field
            };
        });

        // Return the formatted waitlist with highlighted current user
        return sendResponse(res, true, `Fetched appointment waitlist for Barber ID ${barberId} with current user highlighted`,formattedAppointments, 200);

    } catch (error) {
        return sendResponse(res, false, error.message || 'Internal server error', null, 500);
    }
};


// Get Appointment Details by ID (including related User, HaircutDetails, Barber, and Salon) // Admin side 

exports.getAppointmentDetails = async (req, res) => {
    try {
        // Get the appointment ID from the URL parameter
        const appointmentId = req.params.id;

        // Fetch the appointment along with related models (User, Barber, Salon)
        const appointment = await Appointment.findByPk(appointmentId, {
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: { exclude: ['password'] }, // Exclude password field
                },
                {
                    model: Barber,
                    as: 'Barber',
                },
                {
                    model: Salon,
                    as: 'salon',
                }
            ]
        });

        // If the appointment is not found, return an error
        if (!appointment) {
            return sendResponse(res, false, "Appointment not found", null, 404);
        }

        // Fetch HaircutDetails using user_id from the fetched appointment
        const userId = appointment.User.id;
        const haircutDetails = await HaircutDetails.findOne({
            where: { UserId: userId },
        });

        // Send response with the appointment details, including fetched HaircutDetails
        return sendResponse(res, true, "Appointment details fetched successfully", {
            appointment,
            haircutDetails,
        }, 200);
    } catch (error) {
        // Handle any errors that occur during the process
        return sendResponse(res, false, error.message || 'Internal server error', null, 500);
    }
};


// Add time to estimated wait time
exports.addTimeToEstimatedWaitTime = async (req, res) => {
    try {
        const { additionalTime } = req.body;
        const appointmentId = req.params.id;

        // Validate the additionalTime
        if (isNaN(additionalTime) || additionalTime <= 0) {
            return sendResponse(res, false, "Invalid additional time. Please provide a positive number.", null, 400);
        }

        // Find the appointment by ID
        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) {
            return sendResponse(res, false, "Appointment not found", null, 404);
        }

        // Add additional time to the estimated wait time for the current appointment
        appointment.estimated_wait_time += additionalTime;
        await appointment.save();

        // Fetch all appointments for the barber in queue order
        const appointments = await Appointment.findAll({
            where: { BarberId: appointment.BarberId, status: [AppointmentENUM.Checked_in,AppointmentENUM.In_salon] },
            order: [['queue_position', 'ASC']]
        });

        // Recalculate wait times for all appointments
        const barber = await Barber.findByPk(appointment.BarberId);
        if (!barber || !barber.default_service_time) {
            throw new Error("Barber or default service time not found");
        }

        const defaultServiceTime = barber.default_service_time;
        let previousEstimatedWaitTime = 0;

        // Update each appointment's wait time
        for (let i = 0; i < appointments.length; i++) {
            const currentAppointment = appointments[i];

            if (i === 0) {
                // The first appointment in the queue (this one has already been updated)
                currentAppointment.estimated_wait_time = previousEstimatedWaitTime;
            } else {
                // For subsequent appointments, add the first user's additional time
                currentAppointment.estimated_wait_time += additionalTime;
            }

            // Save the updated wait time (without changing the queue_position)
            await currentAppointment.save();

            // Update the previous estimated wait time
            previousEstimatedWaitTime = currentAppointment.estimated_wait_time;
        }

        // Send the response
        return sendResponse(res, true, "Estimated wait time updated successfully for all affected appointments", appointments, 200);

    } catch (error) {
        return sendResponse(res, false, error.message || 'Internal server error', null, 500);
    }
};

const getAppointmentsByRole = async (ischeckRole,user) => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        let whereCondition = {
            createdAt: {
                [Op.between]: [startOfToday, endOfToday]
            },
            status: [AppointmentENUM.Checked_in,AppointmentENUM.In_salon,AppointmentENUM.Completed,AppointmentENUM.Canceled]
        };

        if(ischeckRole){
            if(user.role === role.BARBER){
                whereCondition.BarberId = user.barberId;
            }else if(user.role === role.SALON_OWNER){
                whereCondition.SalonId = user.salonId;
            }
        }

         // Fetch appointments
        const appointments = await Appointment.findAll({
            where: whereCondition,
            attributes: ['id', 'number_of_people', 'status', 'estimated_wait_time', 'queue_position', 'mobile_number', 'name', 'check_in_time', 'in_salon_time', 'complete_time', 'cancel_time', 'BarberId','SalonId'],
            include: [
                { model: User, as: 'User', attributes: ['id','firstname','lastname', 'profile_photo'] },
                { model: Barber, as: 'Barber', attributes: ['name','background_color'] },
                { model: Salon, as: 'salon', attributes: ['name'] },
                { model: Service, attributes: ['id','name', 'default_service_time'] },
            ],
            order: [['check_in_time', 'ASC']] // Optional: order by check-in time
        });

        if (appointments.length === 0) {
            return;
        }

        // Ensure each appointment's User is valid before attempting to access haircut details
        const appointmentsWithHaircutDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const userId = appointment.User ? appointment.User.id : null;
    
                if (userId) {
                    const haircutDetails = await HaircutDetails.findAll({
                        where: { UserId: userId },
                    });
                    appointment.dataValues.haircutDetails = haircutDetails;
                }
    
                return appointment;
            })
        );
    
        return appointmentsWithHaircutDetails;
};

const getInSalonAppointmentsByRole = async (ischeckRole,user) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    let whereCondition = {
        createdAt: {
            [Op.between]: [startOfToday, endOfToday]
        },
        status: [ 'in_salon']
    };

    if(ischeckRole){
        if(user.role === role.BARBER){
            whereCondition.BarberId = user.barberId;
        }else if(user.role === role.SALON_OWNER){
            whereCondition.SalonId = user.salonId;
        }
    }

     // Fetch appointments
    const appointments = await Appointment.findAll({
        where: whereCondition,
        attributes: ['id', 'number_of_people', 'status', 'estimated_wait_time', 'queue_position', 'mobile_number', 'name', 'check_in_time', 'in_salon_time', 'complete_time', 'cancel_time', 'BarberId','SalonId'],
        include: [
            { model: User, as: 'User', attributes: ['id','firstname','lastname','profile_photo'] },
            { model: Barber, as: 'Barber', attributes: ['name','background_color'] },
            { model: Salon, as: 'salon', attributes: ['name'] },
        ],
        order: [['check_in_time', 'ASC']] // Optional: order by check-in time
    });

    if (appointments.length === 0) {
        return;
    }

    return appointments;
};

// Board find Data
exports.findAllBoardData = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        console.log("Authenticated user:", req.user);

             // Fetch appointments using the utility function
        const appointments = await getAppointmentsByRole(true,req.user);

        if (!appointments || appointments.length === 0) {
            return sendResponse(res, true, "No appointments booked yet!", null, 200);
        }

        // Send the response with the fetched appointments and their details
        return sendResponse(res, true, "Appointments fetched successfully", appointments, 200);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return sendResponse(res, false, error.message || 'Failed to fetch appointments', null, 500);
    }
};


//find InSalon Users
exports.findInSalonUsers = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        console.log("Authenticated user:", req.user);

             // Fetch appointments using the utility function
        const appointments = await getInSalonAppointmentsByRole(true,req.user);

        if (!appointments || appointments.length === 0) {
            return sendResponse(res, true, "No appointments booked yet!", null, 200);
        }

        // Send the response with the fetched appointments and their details
        return sendResponse(res, true, "Appointments fetched successfully", appointments, 200);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return sendResponse(res, false, error.message || 'Failed to fetch appointments', null, 500);
    }
};



exports.appointmentByBarber = async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        mobile_number,
        number_of_people,
        barber_id: barberIdFromBody,
        service_ids
    } = req.body;

    try {

        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        // Validate required fields
        if (!firstname || !lastname || !email || !mobile_number || !number_of_people || !Array.isArray(service_ids) || service_ids.length === 0) {
            return sendResponse(res, false, 'All fields are required, including valid services', null, 400);
        }

        // Get barber_id from request or use the one passed in the body
        const barber_id = req.user?.barberId || barberIdFromBody;

        // Fetch barber details and their associated salon
        const barber = await Barber.findOne({
            where: { id: barber_id },
            include: [{
                model: Salon,
                as: 'salon'
            }],
        });

        if (!barber || !barber.salon) {
            return sendResponse(res, false, "The barber does not belong to a salon.", null, 400);
        }

        const barberSession = await BarberSession.findOne({ where: { BarberId: barber_id } });
        if (!barberSession) {
            return sendResponse(res, false, 'Barber is not available for appointments', null, 400);
        }

        

        const salon_id = barber.salon.id;

        let user = null;

        // Check if the user already exists by email
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            user = userExists;
        } else {
            // Check if user role exists
            const userRole = await roles.findOne({ where: { role_name: role.CUSTOMER } });
            if (!userRole) {
                return sendResponse(res, false, "User role not found", null, 404);
            }

            // Automatically generate a unique username
            const baseUsername = `${firstname.toLowerCase()}_${lastname.toLowerCase()}`;
            let username = baseUsername;
            let userWithSameUsername = await User.findOne({ where: { username } });

            let counter = 1;
            while (userWithSameUsername) {
                username = `${baseUsername}${counter}`;
                userWithSameUsername = await User.findOne({ where: { username } });
                counter++;
            }

            // Generate a random password and hash it
            const generateRandomPassword = () => Math.random().toString(36).slice(-10);
            const plainPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Create the new user
            user = await User.create({
                username,
                firstname,
                lastname,
                email,
                google_token: "",
                profile_photo: null,
                password: hashedPassword,
                RoleId: userRole.id,
                address: "",
                mobile_number
            });

            // Send confirmation email to the customer
            const customerData = {
                email,
                password: plainPassword,
                company_name: 'Shear Brilliance',
                name: `${firstname} ${lastname}`
            };

            await sendEmail(email, "Added as a Customer", INVITE_CUSTOMER_WITH_PASSWORD_TEMPLATE_ID, customerData);
            console.log(`Generated password for user: ${plainPassword}`);
        }

        const activeBarberAppointments = await Appointment.findAll({
            where: {
                BarberId: barber_id,
                status: [AppointmentENUM.Checked_in, AppointmentENUM.In_salon]
            },
        });

        let remainingTime;
        if (activeBarberAppointments.length > 0) {
            // Use existing remaining_time from barberSession
            remainingTime = barberSession.remaining_time;
        } else {
            const now = new Date();
            const endTimeString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${barberSession.end_time}`;
            const sessionEndTime = new Date(endTimeString);
    
            if (isNaN(sessionEndTime)) {
                throw new Error("Invalid session end time format");
            }
    
            remainingTime = Math.max(
                Math.round((sessionEndTime - now) / (1000 * 60)), // Convert milliseconds to minutes
                0
            );
        }

        // Fetch selected services
        const services = await Service.findAll({
            where: { id: service_ids },
            attributes: ['default_service_time']
        });

  
      const totalServiceTime = services.reduce((sum, service) => sum + service.default_service_time, 0);
  
      // Ensure there's enough time left for the appointment
      if (remainingTime < totalServiceTime) {
        return sendResponse(res, false, 'Not enough remaining time for this appointment', null, 400);
      }
  
      // Update barber's remaining_time
      const newRemainingTime = remainingTime - totalServiceTime;
      await barberSession.update({ remaining_time: newRemainingTime });
  
        // Calculate estimated wait time and queue position for the barber
        const { totalWaitTime, numberOfUsersInQueue } = await getEstimatedWaitTimeForBarber(barber_id);

        // Check if the user already has an active appointment
        const activeAppointment = await Appointment.findOne({
            where: {
                UserId: user.id,
                status: [AppointmentENUM.Checked_in, AppointmentENUM.In_salon]
            }
        });

        if (activeAppointment) {
            return sendResponse(res, false, "You already have an active appointment. Please complete or cancel it before booking a new one.", null, 400);
        }

        // Create the appointment
        const appointment = await Appointment.create({
            BarberId: barber_id,
            SalonId: salon_id,
            UserId: user.id,
            number_of_people,
            status: AppointmentENUM.Checked_in, // Default status is 'checked_in' upon creation
            estimated_wait_time: totalWaitTime,
            queue_position: numberOfUsersInQueue + 1,
            check_in_time: new Date(),
            mobile_number,
            name: `${firstname} ${lastname}`,
        });

        // Add services to the appointment
        if (service_ids && Array.isArray(service_ids) && service_ids.length > 0) {
            await appointment.addServices(service_ids);
        }

        // Recalculate wait times and queue positions for all appointments of the barber
        // await recalculateWaitTimesAndQueuePositionsForBarber(barber_id);

        // Fetch the created appointment with associated services
        const appointmentWithServices = await Appointment.findOne({
            where: { id: appointment.id },
            include: [
                {
                    model: Service,
                    attributes: ['id', 'name', 'default_service_time'],
                    through: { attributes: [] },
                }
            ]
        });

        // Send success response with appointment details
        return sendResponse(res, true, 'Appointment created successfully', appointmentWithServices, 201);
    } catch (error) {
        console.error('Error creating appointment:', error);
        return sendResponse(res, false, error.message || 'An error occurred while creating the appointment', null, 500);
    }
};




exports.getAppointmentsByRoleExp = getAppointmentsByRole;

exports.getInSalonAppointmentsByRoleExp = getInSalonAppointmentsByRole;
