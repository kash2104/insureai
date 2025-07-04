require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    // console.log(req.headers);
    const accessToken = req.headers["authorization"]?.replace("Bearer ", "");
    // console.log(accessToken);
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

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "12h", // Token expiration time
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
