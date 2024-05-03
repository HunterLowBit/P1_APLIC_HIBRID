const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "HLBDEV", (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Token is not valid" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

const checkUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "HLBDEV", async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Token is not valid" });
      } else {
        let user = await User.findById(decodedToken.id);
        if (!user) {
          res.status(404).json({ message: "User not found" });
        } else {
          res.locals.user = user;
          next();
        }
      }
    });
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = { requireAuth, checkUser };
// middleware/authMiddleware.js