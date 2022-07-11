const jwt = require("jsonwebtoken");
const { fMsg } = require("./helper");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.KEY, (err, user) => {
      if (err) req.user = user;
      next();
    });
  } else {
    return next(new Error("You are not Authenticated"));
  }
};
const verifyTokenAndAuth = (req, res, next, verifyToken) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.parmas.id || req.user.isAdmin) {
      next();
    } else {
      return next(new Error("You are not Authenticated"));
    }
  });
};
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      // return next(new Error("You are not Admin."));
      return res.status(403).json("You are not allowed to do that!");
    }
  });
};
module.exports = { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuth };
