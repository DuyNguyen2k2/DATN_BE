const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
      status: "ERROR",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Failed to authenticate token",
        status: "ERROR",
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: "You are not admin",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
      status: "ERROR",
    });
  }

  const token = authHeader.split(" ")[1];
  const userID = req.params.id;

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Failed to authenticate token",
        status: "ERROR",
      });
    }
    if (user.isAdmin || user.id === userID) {
      next();
    } else {
      return res.status(403).json({
        message: "You are not admin",
        status: "ERROR",
      });
    }
  });
};
module.exports = { authMiddleware, authUserMiddleware };
