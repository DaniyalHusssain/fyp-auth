// middleware/googleOAuth.js

const passport = require("passport");

// Import GoogleStrategy and other necessary modules here
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GOOGLE_CLIENT_ID = "api";

const GOOGLE_CLIENT_SECRET = "cs";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // null will be replaced with an error if there is any error while fetching data from the database
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Export a function that returns the Passport middleware
module.exports = () =>
  passport.authenticate("google", {
    scope: ["email", "profile"],
  });
