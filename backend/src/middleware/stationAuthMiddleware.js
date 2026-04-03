import jwt from "jsonwebtoken";

export const stationAuthMiddleware = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); 

    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // 🔑 Extract token
    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token); // debug

    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); // debug

    
    req.station = {
      id: decoded.stationId,
      stationCode: decoded.stationCode
    };


    next();

  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};