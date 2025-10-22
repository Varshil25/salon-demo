const db = require("../models");
const BarberSession =db.BarberSession;
const { Op } = require('sequelize');
const sendResponse = require('../helpers/responseHelper');
const Barber = db.Barber;
const User = db.USER;
const Salon = db.Salon;
const Service = db.Service;
const { MessageENUM } = require('../config/Enums');
const moment = require('moment-timezone');
const { calculateBarberWaitTime } = require('./salon.controller');
const { role } = require("../config/roles.config");


exports.create = async (req, res) => {
  try {
    // Extract required fields from the request body
    const { BarberId, SalonId, start_time, end_time } = req.body;

    if (!BarberId || !start_time || !end_time || !SalonId) {
      return sendResponse(res, false, 'All fields are required', null, 400); // Return a 400 error if any field is missing
    }

    // Convert the times to Date objects
    const today = new Date();
    const startTime = new Date(`1970-01-01T${start_time}Z`);
    const endTime = new Date(`1970-01-01T${end_time}Z`);

    // Initialize session_date to tomorrow
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate()); // Set to today

    // Check if the start time is today but in the past, and adjust to tomorrow
    if (startTime <= today) {
      startTime.setDate(startTime.getDate() + 1); // Set to the next day (tomorrow)
      endTime.setDate(endTime.getDate() + 1); // Set end_time to the next day as well
    }

    if (endTime <= startTime) {
      return sendResponse(res, false, 'End time must be after start time', null, 400);
    }

    // Calculate remaining time in minutes
    const remaining_time = Math.round((endTime - startTime) / 60000); // Difference in minutes

    // Create a new BarberSession
    const barberSession = await BarberSession.create({
      BarberId,
      SalonId,
      start_time: startTime.toISOString().slice(11, 19), // Formatting start_time as HH:MM:SS
      end_time: endTime.toISOString().slice(11, 19), // Formatting end_time as HH:MM:SS
      session_date: sessionDate.toISOString(), // Setting the session_date to tomorrow
      remaining_time
    });

    return sendResponse(res, true, 'Barber session created successfully', { barberSession }, 201);
  } catch (error) {
    console.error('Error creating barber session:', error);
    return sendResponse(res, false, error.message || 'An error occurred while creating the barber session', null, 500);
  }
};

exports.getAll = async (req, res) => {
  try {
    let { SalonId, BarberId } = req.query;
    
    const userRole = req.user.role;

    if (userRole == role.SALON_OWNER) {
      SalonId = req.user.salonId;
    }

    if (userRole == role.BARBER) {
      BarberId = req.user.barberId;
    }

    // Automatically calculate today's date range
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Define where clause for barber sessions
    const sessionWhereClause = {
      session_date: {
        [Op.between]: [todayStart.toISOString(), todayEnd.toISOString()] // Filter for today's session_date
      }
    };

      // If the user is a customer, add the current time filter
       if (userRole === role.CUSTOMER) {
        const currentTime = new Date().toTimeString().split(" ")[0]; // Get current time in HH:MM:SS format
        sessionWhereClause[Op.and] = [
          { start_time: { [Op.lte]: currentTime } }, // Current time is after or equal to start_time
          { end_time: { [Op.gte]: currentTime } }   // Current time is before or equal to end_time
        ];
      }

    // Define where clause for salon-related barbers (conditionally add SalonId and BarberId)
    const barberWhereClause = {};
    if (SalonId) barberWhereClause.SalonId = SalonId; // Add SalonId filter if provided
    if (BarberId) barberWhereClause.id = BarberId; // Add BarberId filter if provided

    // Fetch barber sessions
    const barberSessionsData = await BarberSession.findAll({
      where: sessionWhereClause,
      order: [['start_time', 'ASC']],
      include: [
        {
          model: Barber,
          as: 'barber',
          where: barberWhereClause, // Conditionally filter by SalonId and BarberId
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Salon,
              as: 'salon',
              attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] }
            }
          ]
        }
      ]
    });


   // Map over barber sessions and append estimated_wait_time
    let barberSessions = await Promise.all(
      barberSessionsData.map(async (session) => {
        const barberWaitTime = await calculateBarberWaitTime(session.BarberId); // Assuming session.id is the barber session ID
        return {
          ...session.toJSON(), // Convert the Sequelize model instance to a plain object
          estimated_wait_time: barberWaitTime.totalWaitTime
        };
      })
    );


    // Return response
    if (barberSessions.length === 0) {
      return sendResponse(res, false, 'No barber sessions found for today', null, 200);
    }

    return sendResponse(res, true, 'Barber sessions retrieved successfully', { barberSessions }, 200);
  } catch (error) {
    console.error('Error retrieving barber sessions:', error);
    return sendResponse(res, false, error.message || 'An error occurred while retrieving barber sessions', null, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { BarberId, SalonId, start_time, end_time } = req.body;

    // Fetch the barber session by ID
    const barberSession = await BarberSession.findByPk(id);

    if (!barberSession) {
      return sendResponse(res, false, 'Barber session not found', null, 404);
    }

    // Initialize remaining_time with the existing value
    let remaining_time = barberSession.remaining_time;

    // Parse the new start_time and end_time if provided
    if (end_time) {
      const currentEndTime = new Date(`1970-01-01T${barberSession.end_time}Z`);
      const newEndTime = new Date(`1970-01-01T${end_time}Z`);

      // Calculate the real-time difference in minutes
      const durationDelta = Math.round((newEndTime - currentEndTime) / 60000);

      // Increment or decrement remaining_time based on the delta
      remaining_time += durationDelta;

      // Ensure remaining_time is not negative
      remaining_time = Math.max(remaining_time, 0);
    }

    // Update the barber session with new values
    await barberSession.update({
      BarberId: BarberId || barberSession.BarberId,
      SalonId: SalonId || barberSession.SalonId,
      start_time: start_time || barberSession.start_time,
      end_time: end_time || barberSession.end_time,
      remaining_time,
    });

    // Return success response
    return sendResponse(res, true, 'Barber session updated successfully', { barberSession }, 200);
  } catch (error) {
    console.error('Error updating barber session:', error);
    return sendResponse(res, false, error.message || 'An error occurred while updating the barber session', null, 500);
  }
};




exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const barberSession = await BarberSession.findByPk(id);

    if (!barberSession) {
      return sendResponse(res, false, 'Barber session not found', null, 404);
    }

    await barberSession.destroy();

    return sendResponse(res, true, 'Barber session deleted successfully', null, 200);
  } catch (error) {
    console.error('Error deleting barber session:', error);
    return sendResponse(res, false, error.message || 'An error occurred while deleting the barber session', null, 500);
  }
};

exports.findByBarberId = async (req, res) => {
  try {
    const { BarberId, service_time } = req.body;

    if (!BarberId) {
      return sendResponse(res, false, 'BarberId is required', null, 400);
    }

    if (service_time === undefined || service_time <= 0) {
      return sendResponse(res, false, 'A valid service_time is required', null, 400);
    }

    // Calculate today's date range in IST
    const today = moment.tz('Asia/Kolkata'); // Current date in IST
    const todayStart = today.clone().startOf('day').toDate(); // Start of the day in IST
    const todayEnd = today.clone().endOf('day').toDate(); // End of the day in IST
    const currentTime = moment.tz(new Date(), 'Asia/Kolkata').toISOString(); // Current time in IST

    // Retrieve barber sessions for the given BarberId
    const barberSessions = await BarberSession.findAll({
      where: {
        BarberId,
        session_date: {
          [Op.between]: [todayStart, todayEnd], // Filter for today's session_date
        },
      },
      attributes: ['id', 'start_time', 'end_time', 'remaining_time'],
      order: [['start_time', 'ASC']],
      include: [
        {
          model: Barber,
          as: 'barber',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
    });

    if (barberSessions.length === 0) {
      return sendResponse(res, false, 'No barber sessions found for this barber', null, 200);
    }

    // Check if any session is fully booked or not available
    const sessionsWithAvailability = barberSessions.map((session) => {
      const sessionHasLowRemainingTime = session.remaining_time <= service_time;
      const sessionIsFullyBooked = session.remaining_time <= 0;
      const isAvailableForBooking = session.remaining_time >= service_time;

      // Construct sessionEndTime in IST
      const sessionEndTime = moment.tz(
        `${today.format('YYYY-MM-DD')} ${session.end_time}`,
        'Asia/Kolkata'
      ).toISOString();

      // Check if the session is expired
      const isSessionExpired = currentTime > sessionEndTime;

      return {
        ...session.toJSON(),
        isFullyBooked: sessionIsFullyBooked,
        isAvailableForBooking,
        isSessionExpired,
      };
    });

    // Check if all sessions are expired
    const allSessionsExpired = sessionsWithAvailability.every((session) => session.isSessionExpired);

    if (allSessionsExpired) {
      return sendResponse(res, true, MessageENUM.Session_Expired, '103', 200);
    }

    // If the barber is fully booked
    if (sessionsWithAvailability.some((session) => session.isFullyBooked)) {
      return sendResponse(res, true, MessageENUM.Fully_Booked, '100', 200);
    }

    // If the barber has low remaining time
    if (sessionsWithAvailability.some((session) => session.remaining_time <= service_time)) {
      return sendResponse(res, true, MessageENUM.Low_Remaining_Time, '101', 200);
    }

    // If the barber is available
    return sendResponse(res, true, MessageENUM.Available, '102', 200);
  } catch (error) {
    console.error('Error retrieving barber sessions:', error);
    return sendResponse(
      res,
      false,
      error.message || 'An error occurred while retrieving barber sessions',
      null,
      500
    );
  }
};