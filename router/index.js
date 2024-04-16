// routes.js

const {
  oAuth,
  signUp,
  signIN,
  logout,
  changePassword,
  forgetPassword,
  verifySign,
  signINVerifyed,
  authenticateToken,
} = require("../controller");
const { textToImageGen } = require("../controller/openAi/openAi");
const getGoogleAuthMiddleware = require("../middleware/googleOAuth");

const router = require("express").Router();

router.get("/googlesignIn", getGoogleAuthMiddleware());
router.get("/success", oAuth);
// =========================

router.post("/signUp", signUp);
router.get("/session", authenticateToken, (req, res) => {
  res.json({ message: "Protected endpoint accessed successfully" });
});
router.post("/signIn", signIN);
// router.post("/signInVerified", signINVerifyed);
router.post("/signInverify", verifySign);

router.get("/logout", logout);

router.post("/changePassword", changePassword);
router.post("/forgetPassword", forgetPassword);

router.post("/text-to-image", textToImageGen);

module.exports = router;
