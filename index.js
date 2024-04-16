const express = require("express");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors middleware

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

// Enable CORS for all routes
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Update this in production
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  next();
});

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
    app.listen(8000, () => {
      console.log(`Server is running on PORT: 8000`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
