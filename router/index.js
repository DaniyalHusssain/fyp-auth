// routes.js

const {
  oAuth,
  signUp,
  signIN,
  logout,
  changePassword,
  forgetPassword,
  verifySign,
} = require("../controller");
const { textToImageGen } = require("../controller/openAi/openAi");
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
router.post("/signInverify", verifySign);

router.get("/logout", logout);

router.post("/changePassword", changePassword);
router.post("/forgetPassword", forgetPassword);

router.get("/text-to-image", textToImageGen);

module.exports = router;
