import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    // Look for the "Authorization" header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - Token not found" });
    }

    // Extract the token (Remove "Bearer " from the string)
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export default isAuth;