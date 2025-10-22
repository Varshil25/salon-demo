const express = require("express");
const barberSessionsController = require('../controllers/barbersession.contoller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { authenticateToken } = require('../middleware/authenticate.middleware');
const { role } = require("../config/roles.config");

module.exports = (app) => {
    const apiPrefix = "/api/barber-sessions";

   /**
   * @swagger
   * tags:
   *   name: BarberSessions
   *   description: Barber session management API
   */


    /**
     * @swagger
     * /api/barber-sessions/create:
     *   post:
     *     summary: Create a new barber session
     *     tags: [BarberSessions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               BarberId:
     *                 type: integer
     *                 description: ID of the barber for the session
     *               SalonId:
     *                 type: integer
     *                 description: ID of the salon where the session will take place
     *               start_time:
     *                 type: string
     *                 format: time
     *                 description: Start time of the session (in HH:mm format)
     *               end_time:
     *                 type: string
     *                 format: time
     *                 description: End time of the session (in HH:mm format)
     *     responses:
     *       201:
     *         description: Barber session created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 barberSession:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                       description: The ID of the barber session
     *                     BarberId:
     *                       type: integer
     *                       description: ID of the barber
     *                     SalonId:
     *                       type: integer
     *                       description: ID of the salon
     *                     start_time:
     *                       type: string
     *                       format: time
     *                       description: Start time of the session
     *                     end_time:
     *                       type: string
     *                       format: time
     *                       description: End time of the session
     *                     remaining_time:
     *                       type: integer
     *                       description: Remaining time in minutes for the session
     *       400:
     *         description: Bad request, e.g., missing fields or invalid time
     *       500:
     *         description: Internal server error
     */ 
   // Create a new barber session
    app.post(`${apiPrefix}/create`, authenticateToken, authorizeRoles(role.ADMIN, role.SALON_OWNER, role.BARBER), barberSessionsController.create);

    /**
     * @swagger
     * /api/barber-sessions:
     *   get:
     *     summary: Get all barber sessions for a salon (filtered by today's date)
     *     tags: [BarberSessions]
     *     parameters:
     *       - in: query
     *         name: SalonId
     *         required: false
     *         schema:
     *           type: integer
     *         description: ID of the salon to filter barber sessions by
     *     responses:
     *       200:
     *         description: Barber sessions retrieved successfully
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
     *                   example: Barber sessions retrieved successfully
     *                 data:
     *                   type: object
     *                   properties:
     *                     barberSessions:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: integer
     *                             example: 1
     *                           start_time:
     *                             type: string
     *                             format: date-time
     *                             example: "2024-12-14T10:00:00Z"
     *                           end_time:
     *                             type: string
     *                             format: date-time
     *                             example: "2024-12-14T11:00:00Z"
     *                           barber:
     *                             type: object
     *                             properties:
     *                               id:
     *                                 type: integer
     *                                 example: 2
     *                               name:
     *                                 type: string
     *                                 example: "John Doe"
     *                               salon:
     *                                 type: object
     *                                 properties:
     *                                   id:
     *                                     type: integer
     *                                     example: 3
     *                                   name:
     *                                     type: string
     *                                     example: "Modern Cuts"
     *                               user:
     *                                 type: object
     *                                 properties:
     *                                   id:
     *                                     type: integer
     *                                     example: 5
     *                                   email:
     *                                     type: string
     *                                     example: "johndoe@example.com"
     *       400:
     *         description: SalonId is required
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
     *                   example: SalonId is required
     *       404:
     *         description: No barber sessions found for today
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
     *                   example: No barber sessions found for today
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
     *                   example: An error occurred while retrieving barber sessions
     */
    // Get all barber sessions (filtered by today's date, optionally filtered by BarberId)
    app.get(
      `${apiPrefix}/`,
      authenticateToken,
      authorizeRoles(role.ADMIN, role.SALON_OWNER, role.BARBER,role.CUSTOMER),
      barberSessionsController.getAll
    );
 

    /**
 * @swagger
 * /api/barber-sessions/{id}:
 *   put:
 *     summary: Update an existing barber session
 *     tags: [BarberSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the barber session to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BarberId:
 *                 type: integer
 *                 description: ID of the barber
 *               SalonId:
 *                 type: integer
 *                 description: ID of the salon
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time of the session (in HH:mm format)
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time of the session (in HH:mm format)
 *     responses:
 *       200:
 *         description: Barber session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Barber session updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     BarberId:
 *                       type: integer
 *                       example: 1
 *                     SalonId:
 *                       type: integer
 *                       example: 5
 *                     start_time:
 *                       type: string
 *                       example: "09:00"
 *                     end_time:
 *                       type: string
 *                       example: "12:00"
 *                     remaining_time:
 *                       type: integer
 *                       description: Remaining time in minutes
 *                       example: 180
 *       400:
 *         description: Bad request, e.g., invalid times or missing fields
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
 *                   example: "End time must be after start time"
 *       404:
 *         description: Barber session not found
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
 *                   example: "Barber session not found"
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
 *                   example: "An error occurred while updating the barber session"
 */

    // Update an existing barber session
    app.put(`${apiPrefix}/:id`, authenticateToken, authorizeRoles(role.ADMIN,role.SALON_OWNER,role.BARBER), barberSessionsController.update);

    /**
     * @swagger
     * /api/barber-sessions/{id}:
     *   delete:
     *     summary: Delete an existing barber session
     *     tags: [BarberSessions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the barber session to be deleted
     *     responses:
     *       200:
     *         description: Barber session deleted successfully
     *       404:
     *         description: Barber session not found
     *       500:
     *         description: Internal server error
     */
        // Delete a barber session
    app.delete(`${apiPrefix}/:id`, authenticateToken, authorizeRoles(role.ADMIN,role.SALON_OWNER,role.BARBER), barberSessionsController.delete);

    /**
     * @swagger
     * /api/barber-sessions/barber/{BarberId}:
     *   post:
     *     summary: Get barber sessions by BarberId and service time
     *     tags: [BarberSessions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               BarberId:
     *                 type: integer
     *                 description: ID of the barber to filter sessions by
     *               service_time:
     *                 type: integer
     *                 description: The minimum service time required for booking the session (in minutes)
     *                 example: 30
     *     responses:
     *       200:
     *         description: Barber sessions retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 sessions:
     *                   type: array
     *                   items:
     *                     type: object
     *                     description: Barber session data with availability check
     *                     properties:
     *                       id:
     *                         type: integer
     *                         description: ID of the session
     *                       start_time:
     *                         type: string
     *                         format: date-time
     *                         description: Start time of the session
     *                       remaining_time:
     *                         type: integer
     *                         description: Remaining time available in the session (in minutes)
     *                       isFullyBooked:
     *                         type: boolean
     *                         description: Indicates if the session is fully booked
     *                       isAvailableForBooking:
     *                         type: boolean
     *                         description: Indicates if the session has enough remaining time for the requested service
     *                       service_time:
     *                         type: integer
     *                         description: The requested minimum service time
     *       400:
     *         description: Invalid input data (e.g., missing or invalid BarberId or service_time)
     *       404:
     *         description: Barber sessions not found for the specified BarberId
     *       500:
     *         description: Internal server error
     */
    app.post(`${apiPrefix}/barber/:BarberId`, authenticateToken, authorizeRoles(role.ADMIN, role.SALON_OWNER, role.BARBER,role.CUSTOMER), barberSessionsController.findByBarberId);
};
