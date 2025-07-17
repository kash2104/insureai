import express from "express";
const router = express.Router();

import { login } from "../controllers/Auth";
import { auth } from "../middlewares/auth";

router.post("/login", login);
router.get("/verify", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
  });
});

export default router;
