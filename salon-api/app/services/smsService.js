const { parsePhoneNumberFromString } = require("libphonenumber-js");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Use Twilio only if all required environment variables are present.
// Do not throw during module import — instead provide a non-fatal fallback
// so the app can run in environments where Twilio isn't configured (e.g. dev/test).
const useTwilio = Boolean(accountSid && authToken && twilioPhoneNumber);

let client = null;
if (useTwilio) {
  const twilio = require("twilio");
  client = twilio(accountSid, authToken);
} else {
  console.warn(
    "Twilio environment variables are missing. SMS messages will be logged but not sent."
  );
}

// Function to validate phone numbers
const validatePhoneNumber = (phoneNumber) => {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber);
  if (parsedNumber && parsedNumber.isValid()) {
    return parsedNumber.format('E.164');  // Format in E.164 international format
  }
  throw new Error('Invalid phone number.');
};

const sendSMS = async (to, message) => {
  try {
    // Validate phone number and ensure it's in the E.164 format
    const validatedPhoneNumber = validatePhoneNumber(to);
    // If Twilio isn't configured, log the message and return a harmless value.
    if (!useTwilio || !client) {
      console.info("[SMS stub] Twilio not configured. Message would be sent to:", validatedPhoneNumber);
      console.info("[SMS stub] Message:", message);
      // Return null to indicate no real SID was created. Callers should handle this gracefully.
      return null;
    }

    console.log("Sending SMS to:", validatedPhoneNumber);

    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: validatedPhoneNumber,
    });

    console.log("SMS sent successfully. SID:", response.sid);
    return response.sid;
  } catch (error) {
    console.error("Twilio SMS sending error:", error.message);
    throw error;
  }
};

module.exports = { sendSMS };
