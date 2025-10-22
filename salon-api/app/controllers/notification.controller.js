const { sendNotification } = require("../services/notificationService");

const sendNotificationController = async (req, res) => {
  const { title, body, image } = req.body;

  // Validate input data
  if (!title || !body) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: title or body",
    });
  }

  try {
    // Call the sendNotification service
    const { success, response, error } = await sendNotification(title, body, image);

    if (success) {
      return res.status(200).json({
        success: true,
        message: "Notification sent successfully",
        data: response,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send notification",
        error,
      });
    }
  } catch (error) {
    console.error("Error in sendNotificationController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { sendNotificationController };
