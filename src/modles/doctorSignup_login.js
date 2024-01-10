import mongoose from "mongoose";

const doctorOTP = new mongoose.Schema({
  Email: { type: String },
  OTP: { type: String },
  OTPExpiration: { type: Date },
});

export default mongoose.model("DocterSigupLogin", doctorOTP);
