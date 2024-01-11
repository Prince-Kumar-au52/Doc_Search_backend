import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import Doctor from "../modles/doctorSignup_login.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "doc.helpsearch@gmail.com",
    pass: "ndtiavpjrvlkexnl",
  },
});
// ndtiavpjrvlkexnl;
const generateOTP = () => {
  const otpLength = 6;
  let otp = "";

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

// Function to send OTP via email
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: "doc.helpsearch@gmail.com",
    to: email,
    subject: "Doc Search OTP for Account",
    text: `${otp} is the OTP for Registration Valid for 10 mins. Do not share with anyone.
     Call 8809149036 if not requested by you - Doc Search`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send OTP via email");
  }
};

// Function to register a new user
export const adddoctor = asyncHandler(async (req, res) => {
  const { Email } = req.body;

  try {
    // Check if a doctor with the given email already exists
    let doctor = await Doctor.findOne({ Email });

    if (doctor) {
      // Doctor exists, update OTP and handle timeout logic
      const currentTime = new Date();
      const otpTimeout = 10 * 60 * 1000; // 5 minutes timeout

      // Check if OTP is still valid (within the timeout)
      if (doctor.OTPExpiration && currentTime < doctor.OTPExpiration) {
        res.status(400).json({
          success: false,
          message:
            "OTP is still valid. Please wait before requesting a new one.",
        });
        return;
      }

      // Generate a new OTP and update the expiration time
      const newOTP = generateOTP();
      const newExpiration = new Date(currentTime.getTime() + otpTimeout);

      // Update doctor data in the database
      doctor = await Doctor.findOneAndUpdate(
        { Email },
        { OTP: newOTP, OTPExpiration: newExpiration },
        { new: true }
      );
    } else {
      // Doctor does not exist, create a new one
      const otp = generateOTP();

      // Logic to create a doctor user in the database using your Doctor model goes here
      doctor = await Doctor.create({
        Email: Email,
        OTP: otp,
        OTPExpiration: new Date(new Date().getTime() + 10 * 60 * 1000), // Set OTP expiration time (5 minutes)
      });
    }

    // Send OTP to the doctor's email
    const send = await sendOTP(Email, doctor.OTP);

    res.status(201).json({
      success: true,
      data: doctor,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export const doctorLogin = asyncHandler(async (req, res) => {
  const { OTP } = req.body;

  try {
    // Find a user with the given OTP
    const doctor = await Doctor.findOne({ OTP });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // You may want to add additional checks here, depending on your use case

    // Generate an access token for the user
    const accessToken = jwt.sign(
      {
        doctorData: {
          Email: doctor.Email,
          id: doctor.id,
        },
      },
      process.env.secretKey,
      { expiresIn: process.env.Range }
    );

    res.status(200).json({
      success: true,
      token: accessToken,
      Email: doctor.Email,
      id: doctor.id,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
