import express, { Router } from "express";

import {
  AddDoctor,
  DeleteDoctor,
  GetDoctor,
  GetDoctorByAdmin,
  GetDoctorById,
  UpdateDoctor,
} from "../controllers/doctor.controller.js";
import { doctorValidation } from "../validators/doctorValidator.js";
import { verifyToken } from "../helper/token_verify.js";
const router = express.Router();

const validatedoctor = (req, res, next) => {
  const { error } = doctorValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

router.post("/addDoctor", validatedoctor, AddDoctor);
router.get("/getDoctor", GetDoctor);
router.delete("/deleteDoctor/:id", verifyToken, DeleteDoctor);
router.put("/updateDoctor/:id", verifyToken, UpdateDoctor);
router.get("/getDoctorById/:id", GetDoctorById);
// router.post("/login", LoginDoctor);
router.get("/getDoctorByAdmin", GetDoctorByAdmin);
export default router;
