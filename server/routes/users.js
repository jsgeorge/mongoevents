const User = require("../models/users");
//const bcrypt = require("bcrypt");
// const jwt = require("jwt-simple");
//const jwt = require("jsonwebtoken");
const config = require("../config");

const router = require("express").Router();

// function tokenForUser(user) {
//   const timestamp = new Date().getTime();
//   return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
// }

router.post("/", (req, res) => {
  const { identifier, password, username, timezone, defaultCity } = req.body;

  User.findOne({ email: identifier }, function (err, existingUser) {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(401).send({ error: "Email already in use" });
    }
    const user = new User({
      email: identifier,
      password: password,
      username: username,
      timezone: timezone,
      defaultCity: defaultCity,
    });
    user.save(function (err) {
      if (err) {
        return res.status(422).send({ error: err });
      }
      res.json({
        //token: tokenForUser(user)
        regSuccess: true,
      });
    });
  });
});

router.get("/", (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(users);
  });
});

router.get("/id", (req, res) => {
  User.findOne({ _id: req.query.uid }, (err, user) => {
    if (err) return res.status(400).send(err);
    let currentuser = {
      email: user.email,
      defaultCity: user.defaultCity,
      timezone: user.timezone,
    };
    console.log("currentuser", currentuser);
    return res.status(200).json(currentuser);
  });
});

router.get("/defaults", (req, res) => {
  console.log(req.query.uid);
  User.findOne({ _id: req.query.uid }, (err, user) => {
    if (err) return res.status(400).send(err);
    if (!user) return res.status(401).send("User not found");
    return res.status(200).json({
      defaultCity: user.defaultCity,
      defaultState: user.defaultState,
    });
  });
});

router.post("/chgDefaultCity", (req, res) => {
  let id = req.query.uid;
  console.log(id, req.body);
  User.findOneAndUpdate(
    { uid: id },
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) return res.satus(402).json({ success: false, err });
      res.status(200).json({ success: true });
    }
  );
});

module.exports = router;
