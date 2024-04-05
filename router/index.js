// routes.js

const {
  oAuth,
  signUp,
  signIN,
  forgetPasword,
  logout,
} = require("../controller");
const getGoogleAuthMiddleware = require("../middleware/googleOAuth");

const router = require("express").Router();

// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

router.get("/googlesignIn", getGoogleAuthMiddleware());
router.get("/success", oAuth);
// =========================

router.post("/signUP", signUp);

router.post("/signIn", signIN);
router.get("/logout", logout);

router.post("/forgetpassword", forgetPasword);
module.exports = router;
