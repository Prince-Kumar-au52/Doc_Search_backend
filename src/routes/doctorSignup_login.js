import express from "express";
import { AddDocter, DoctorLogin } from "../controllers/doctorSignup_login.js";

const router = express.Router();

router.post("/signup", AddDocter);
router.post("/login", DoctorLogin);
// router.post("/addUserAppointment", AddUserAppointmentId);

export default router;
