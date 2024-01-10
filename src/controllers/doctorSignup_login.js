import asyncHandler from "express-async-handler";
import { adddoctor, doctorLogin } from "../services/doctorSignup_login.js";

export const AddDocter = asyncHandler(async (req, res) => {
  const result = await adddoctor(req, res);
});

export const DoctorLogin = asyncHandler(async (req, res) => {
  const result = await doctorLogin(req, res);
});
