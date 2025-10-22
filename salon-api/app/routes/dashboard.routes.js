// routes/dashboard.routes.js
const express = require('express');
const path = require('path');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/authenticate.middleware'); // Adjust the path as needed
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { role } = require('../config/roles.config');
const roles = require('../config/roles.config').role;

module.exports = app => {
    const apiPrefix = "/api/dashboard";

    /**
    * @swagger
    * tags:
    *   name: Dashboard
    *   description: API for managing Dashboard  
    */


    /**
     * @swagger
     * components:
     *   schemas:
     *     DashboardData:
     *       type: object
     *       required:
     *         - totalUsers
     *         - totalCustomers
     *         - totalSalons
     *         - totalAppointments
     *         - activeAppointmentsCount
     *         - completedAppointmentsCount
     *         - canceledAppointmentsCount
     *       properties:
     *         totalUsers:
     *           type: integer
     *           description: Total number of users
     *         totalCustomers:
     *           type: integer
     *           description: Total number of customers
     *         totalSalons:
     *           type: integer
     *           description: Total number of salons
     *         totalAppointments:
     *           type: integer
     *           description: Total number of appointments
     *         activeAppointmentsCount:
     *           type: integer
     *           description: Count of active appointments
     *         completedAppointmentsCount:
     *           type: integer
     *           description: Count of completed appointments
     *         canceledAppointmentsCount:
     *           type: integer
     *           description: Count of canceled appointments
     *       example:
     *         totalUsers: 100
     *         totalCustomers: 80
     *         totalSalons: 5
     *         totalAppointments: 200
     *         activeAppointmentsCount: 50
     *         completedAppointmentsCount: 120
     *         canceledAppointmentsCount: 30
     */

    /**
     * @swagger
     * /api/dashboard:
     *   get:
     *     summary: Retrieve the admin dashboard data
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Dashboard data for the admin
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/DashboardData'
     *       403:
     *         description: Unauthorized access
     *       500:
     *         description: Server error
     */
    // Route to fetch admin dashboard data
    app.get(`${apiPrefix}`, [authenticateToken],authenticateJWT, authorizeRoles(roles.ADMIN,roles.SALON_OWNER,roles.BARBER), dashboardController.getDashboardData);


    /**
 * @swagger
 * components:
 *   schemas:
 *     AppointmentDashboardData:
 *       type: object
 *       required:
 *         - totalAppointments
 *         - activeAppointments
 *         - completedAppointments
 *         - canceledAppointments
 *         - estimatedWaitTimes
 *       properties:
 *         totalAppointments:
 *           type: integer
 *           description: Total number of appointments
 *         activeAppointments:
 *           type: integer
 *           description: Count of active appointments
 *         completedAppointments:
 *           type: integer
 *           description: Count of completed appointments
 *         canceledAppointments:
 *           type: integer
 *           description: Count of canceled appointments
 *         estimatedWaitTimes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               salonId:
 *                 type: integer
 *                 description: ID of the salon
 *               waitTime:
 *                 type: string
 *                 description: Estimated wait time for the salon
 *       example:
 *         totalAppointments: 200
 *         activeAppointments: 50
 *         completedAppointments: 120
 *         canceledAppointments: 30

 */

    /**
    * @swagger
    * /api/dashboard/appointment-dashboard:
    *   get:
    *     summary: Retrieve appointment dashboard data
    *     tags: [Dashboard]
    *     responses:
    *       200:
    *         description: Appointment dashboard data for admin
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/AppointmentDashboardData'
    *       403:
    *         description: Unauthorized access
    *       500:
    *         description: Server error
    */
    app.get(`${apiPrefix}/appointment-dashboard`, [authenticateToken],authenticateJWT, authorizeRoles(roles.ADMIN, roles.SALON_OWNER,roles.BARBER), dashboardController.getAppointmentDashboardData);

   /**
 * @swagger
 * /api/dashboard/generate-report:
 *   get:
 *     summary: Generate a PDF report for appointments
 *     description: Generates a PDF report containing appointment data, including users, barbers, salons, and appointment statuses, with optional filtering by start and end dates. Accessible only to admins.
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for filtering appointments in the format YYYY-MM-DD (optional).
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for filtering appointments in the format YYYY-MM-DD (optional).
 *     responses:
 *       200:
 *         description: PDF report generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 message:
 *                   type: string
 *                   description: Message describing the operation result.
 *                 downloadLink:
 *                   type: string
 *                   description: URL to download the generated PDF report.
 *               example:
 *                 success: true
 *                 message: PDF Report generated successfully
 *                 downloadLink: /reports/Appointment_Report_20241203120000.pdf
 *       400:
 *         description: Bad request - Invalid date format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 code:
 *                   type: integer
 *                   description: Error code.
 *               example:
 *                 success: false
 *                 message: Invalid start date
 *                 code: 400
 *       401:
 *         description: Unauthorized access - Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 code:
 *                   type: integer
 *                   description: Error code.
 *               example:
 *                 success: false
 *                 message: No User ID found
 *                 code: 401
 *       403:
 *         description: User is not authorized to access this resource - Admin role required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 code:
 *                   type: integer
 *                   description: Error code.
 *               example:
 *                 success: false
 *                 message: Unauthorized User - Admin role required
 *                 code: 403
 *       500:
 *         description: Server error while generating the report.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 code:
 *                   type: integer
 *                   description: Error code.
 *               example:
 *                 success: false
 *                 message: Server Error
 *                 code: 500
 */
   app.get(`${apiPrefix}/generate-report`, [authenticateToken, authenticateJWT], dashboardController.generateAdminAppointmentReport);

};
