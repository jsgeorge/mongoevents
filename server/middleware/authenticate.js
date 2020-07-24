//import jwt from "jwt-simple";
//import config from "../src/config";
const User = require("../models/users");

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
  }
  if (token) {
        User.findByToken(token, (err, user) => {
          if (err) {
            console.log("ERROR", err);
            res.status(400).json({ error: "Failed to authenticte" });
          }
          if (!user) res.status(401).json({ error: "no such user" });
         req.currentUser = user;
    next();
       });
  } else {
    res.status(403).json({ error: "No token provided" });
  }
};

module.exports = { authenticate };
