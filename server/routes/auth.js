const jwt = require("jwt-simple");
const config = require("../config");
const User = require("../models/users");

const router = require("express").Router();

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ id: user.id, username: user.username }, config.secret);
  // return jwt.sign(
  //   {
  //     id: user.id,
  //     username: user.username
  //   },
  //   config.secret
  // );
}

router.post("/", (req, res) => {
  const { identifier, password } = req.body;
  User.findOne({ email: identifier }, (err, user) => {
    if (!user)
      return res.status(401).send({
        error: "Login failed, email not found",
      });
    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch)
        return res.status(401).send({
          error: "Login failed, Wrong password",
        });

      // res.status(200).json({
      //   token: tokenForUser(user)
      // });
      user.generateToken((err, user) => {
        if (err) {
          return res.status(401).send({ error: "unonwn error" });
        }
        // res.cookie("w_auth", user.token).status(200).json({
        //   loginSuccess: true,
        // });
        let currentUser = {
          _id: user._id,
          email: user.email,
          username: user.username,
          timezone: user.timezone,
          defaultCity: user.defaultCity,
          defaultState: user.defaultState,
        };

        res
          .status(200)
          .json({ loginSuccess: true, user: currentUser, token: user.token });
      });
    });
  });
});

module.exports = router;
