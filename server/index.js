const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const bcrypt = require("bcrypt");
// const jwt = require("jwt-simple");
// const config = require("./config");

//Routes
const users = require("./routes/users");
const auth = require("./routes/auth");
const events = require("./routes/events");
const categories = require("./routes/categories");
//const settings = require("./routes/settings");

const app = express();
require("dotenv").config();

//mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/react/mongevents5"
);

app.use(bodyParser.json());

//Routes middleware
app.use("/api/users", users);
app.use("/api/users/id", users);
app.use("/api/users/defaults", users);
app.use("/api/auth", auth);
app.use("/api/events", events);
app.use("/api/events/byCity", events);
app.use("/api/events/id", events);
app.use("/api/events/update", events);
app.use("/api/categories", categories);
//app.use("/api/settings", settings);
//app.use("/api/settings/chgDefaultCity", settings);

//----------------------------
const port = process.env.PORT || 3002;

if (process.env.NODE_ENV === "production") {
  // Exprees will serve up production assets
  app.use(express.static("client/build"));

  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
