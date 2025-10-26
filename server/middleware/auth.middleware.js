import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

//   // 🔧 Handle "Bearer <token>"
//   if (token.startsWith("Bearer ")) {
//     token = token.split(" ")[1];
//   }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = decoded.userID;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default protect;
