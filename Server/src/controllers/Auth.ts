import { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

export async function login(req: Request, res: Response) {
  try {
    const accessToken = req.headers["authorization"]?.replace("Bearer ", "");
    const { id, email } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    const payload = {
      accessToken: accessToken,
      id: id,
      email: email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "12h", // Token expiration time
    });

    const cookieOptions: CookieOptions = {
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: true,
      sameSite: "none",
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
}
