const express = require("express");

const { sendNotificationController } = require("../controllers/notification.controller");
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');
const roles = require('../config/roles.config').role;

module.exports = (app) => {
  const apiPrefix = "/api/notification";

  /**
   * @swagger
   * components:
   *   schemas:
   *     Notification:
   *       type: object
   *       required:
   *         - title
   *         - body
   *       properties:
   *         title:
   *           type: string
   *           description: The title of the notification
   *         body:
   *           type: string
   *           description: The body content of the notification
   *         image:
   *           type: string
   *           description: URL of the image to include in the notification
   *       example:
   *         title: "New Notification"
   *         body: "You have a new notification!"
   *         image: "https://example.com/image.jpg"
   */

  /**
   * @swagger
   * /api/notification:
   *   post:
   *     summary: Send a notification to all users with an optional image
   *     tags: [Notification]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: The title of the notification
   *                 example: "New Blog Post"
   *               body:
   *                 type: string
   *                 description: The body content of the notification
   *                 example: "Check out our new blog post!"
   *               image:
   *                 type: string
   *                 description: URL of the image to include in the notification
   *                 example: "https://example.com/image.jpg"
   *     responses:
   *       200:
   *         description: Notification sent successfully to all users
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
   *                   example: "Notification sent successfully to all users"
   *                 response:
   *                   type: string
   *                   example: "Notification ID from Firebase"
   *       400:
   *         description: Missing required fields (title, body)
   *       500:
   *         description: Failed to send notification
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
   *                   example: "Failed to send notification"
   *                 error:
   *                   type: string
   *                   example: "Error details"
   */
  app.post(`${apiPrefix}`,  authenticateJWT, authorizeRoles(roles.ADMIN,),sendNotificationController);
};
