import { Request, Response, NextFunction } from "express";
require("dotenv").config();

//@ts-ignore
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. No token provided.",
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof decoded === "object" && decoded !== null) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          accessToken: decoded.accessToken,
        };
      }
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Please log in.",
      error: error.message,
    });
  }
};
