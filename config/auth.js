const express = require("express");
const session = require("express-session");
const passport = require("passport");

const morgan = require("morgan");

require("dotenv").config();
require("../config/auth");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(`<a href = "/auth/google">Authenticate with Google </a>`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/google/callback", async (req, res) => {
  if (req.user) {
    // User signed in with Google OAuth
    try {
      const checkIfalreadyExists = await User.findOne({
        email: req.user.email,
      });
      if (!checkIfalreadyExists) {
        const new_user = new User({
          email: req.user.email,
          name: req.user.displayName,
          profilePicture: req.user.picture,
        });
        await new_user.save();
      }
      res.redirect("/protected");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // User did not sign in with Google OAuth, handle accordingly
    res.status(401).send("Unauthorized");
  }
});

app.get("/auth/failure", (req, res) => {
  res.send(`Something went wrong`);
});
