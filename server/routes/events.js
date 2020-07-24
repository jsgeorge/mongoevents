const { Event } = require("../models/events");
const { authenticate } = require("../middleware/authenticate");
const { Setting } = require("../models/settings");

const router = require("express").Router();

router.get("/", (req, res) => {
  Event.find({}, (err, events) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(events);
  });
});
// router.get("/byCity", (req, res) => {
//   console.log(req.query.city);
//   Event.find({ city: req.query.city }, (err, events) => {
//     if (err) return res.status(400).send(err);
//     return res.status(200).send(events);
//   });
// });
router.post("/byCity", authenticate, (req, res) => {
  console.log("post/events/byCity");
  console.log(req.body);
  const city = req.currentUser.defaultCity;
  const efilters = {};
  let srchStr, category;
  if (req.body.category) category = req.body.category;
  if (req.body.srchStr) srchStr = req.body.srchStr;

  // Setting.findOne({ uid: req.query.uid }, (err, setting) => {

  //  const city  = req.currentUser.defaultCity;
  // const state  = req.currentUser.defaulState;

  if (srchStr) {
    const str = `/${srchStr}/`;
    Event.find({ city: city, name: { $regex: str } }, (err, events) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(events);
    });
  } else if (category) {
    Event.find({ city: city, category: category }, (err, events) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(events);
    });
  } else {
    Event.find({ city: city }, (err, events) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(events);
    });
  }
});
//});
router.get("/id", (req, res) => {
  let id = req.query.id;

  Event.findOne({ _id: id }, (err, event) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(event);
  });
});
function validate(data) {
  console.log(data);
  let errors = {};
  if (data.name === "") errors.name = "Missing/Invalid name";
  const isValid = Object.keys(errors).length === 0;
  return { errors, isValid };
}
router.post("/", (req, res) => {
  console.log(req.body);
  const { errors, isValid } = validate(req.body);

  if (!isValid) {
    return res.status(401).json({ errors: { form: errors } });
  }
  const event = new Event(req.body);
  console.log(event);
  //res.status(201).json({ success: true });
  Event.findOne({ name: req.body.name }, function (err, existingUser) {
    if (err) {
      return res.status(401).json({ errors: { form: err } });
    }
    if (existingUser) {
      return res.status(422).json({ errors: { form: "Event already exists" } });
    }

    event.save(function (err) {
      if (err) {
        if (err) res.status(423).json({ errors: { form: err } });
      }
      res.status(200).json({ success: true });
    });
  });
});
router.post("/update", authenticate, (req, res) => {
  let id = req.query.id;
  console.log("updating record", id);

  const { errors, isValid } = validate(req.body);

  // if (!isValid) {
  //   console.log("error", "invalid name");
  //   return res.status(401).json({ success: false, errors });
  // }

  //res.status(201).json({ success: true });
  Event.findOne({ name: req.body.name }, function (err, existingUser) {
    if (err) {
      console.log("error", err);
      return res.status(421).json({ success: false, err });
    }
    if (existingUser) {
      console.log("error", "Event already exists");
      return res.status(422).send({ err: "Event already exists" });
    }
  });

  Event.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true },
    (err, doc) => {
      if (err) return res.satus(402).json({ success: false, err });
      res.status(200).json({ success: true });
    }
  );
});
module.exports = router;
