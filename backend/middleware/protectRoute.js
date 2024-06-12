import jwt from 'jsonwebtoken';
import User from "../models/user.model.js"; 

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // Debugging: Log the cookies
    console.log("token...:", token);  

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userID).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("Error in protect route middleware: " + err.message);
    res.status(500).send({ error: "Internal server error: " + err.message });
  }
};

export default protectRoute;
