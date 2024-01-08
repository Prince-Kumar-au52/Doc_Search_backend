import express from "express";
import { verifyToken } from "../helper/token_verify.js"

import { userSinupValidation } from "../validators/userSignup_login.js";
import {
  AddUser,
  DeleteUser,
  GetUserById,
  GetUsers,
  LoginUser,
  UpdateUser,
} from "../controllers/userSignup_login.js";

const router = express.Router();
const validateUsers = (req, res, next) => {
  const { error } = userSinupValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

router.post("/UserSignup", validateUsers, AddUser);
router.post("/Userlogin", LoginUser);
router.get("/getUsers",verifyToken, GetUsers);
router.delete("/deleteUser/:id",verifyToken, DeleteUser);
router.put("/updateUser/:id",verifyToken, UpdateUser);
router.get("/getUserById/:id",verifyToken, GetUserById);

export default router;
