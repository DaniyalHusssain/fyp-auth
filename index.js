const express = require("express");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("./middleware/googleOAuth"); // Ensure this imports your passport configuration

const router = require("./router");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", router);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/success",
    failureRedirect: "/auth/failure",
  })
);

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after connecting to MongoDB
    app.listen(3000, () => {
      console.log(`Server is running on PORT: 3000`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
