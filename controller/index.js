const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const User = require("../models/chat-model");
const sendEmail = require("../services/email");
const jwt = require("jsonwebtoken");

const otpGenerator = require("otp-generator");
const secretKey = "thisismysecrettoken";
module.exports.oAuth = async (req, res, next) => {
  try {
    console.log(req.user);
    if (!req.user) {
      // Handle case where name is not provided
      console.error("Error: Name not provided in user object");
      return res.status(400).json({ error: "Name not provided" });
    }

    // Find user by googleId
    let user = await User.findOne({ googleId: req.user.sub });

    // If user not found, create a new one
    if (!user) {
      // Ensure that req.user.name exists and has the necessary properties
      if (!req.user.name.givenName || !req.user.name.familyName) {
        console.error(
          "Error: Given name or family name is missing in user object"
        );
        return res
          .status(400)
          .json({ error: "Given name or family name is missing" });
      }

      user = new User({
        email: req.user.email,
        googleId: req.user.sub,
        authMethod: "google",
        name: req.user.name,
        // name: {req.user._json.given_name , req.user._json.family_Name },
        profilePicture: req.user.picture,
      });
      await user.save();
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, secretKey, (err, data) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = data;
    return res.json(data);
    next();
  });
};

module.exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const givenName = firstName;
    const familyName = lastName;

    const checkifexists = await User.findOne({ email: email });

    if (checkifexists) {
      return res.status(409).json({ message: "user already exists" });
    }

    const salt = bcrypt.genSaltSync(10); // 10 is the number of salt rounds
    const hashedPassword = bcrypt.hashSync(password, salt);

    // const isPasswordValid = await bcrypt.compareSync("password", hashedPassword);

    const new_user = new User({
      email: email,
      firstName: givenName,
      lastName: familyName,
      password: hashedPassword,
      authMethod: "manual",
    });

    await new_user.save();

    res.status(201).json({ message: `new user has been createad` });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

module.exports.signIN = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ auth: false, message: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ auth: false, message: "Incorrect password" });
    }

    const otp = parseInt(Math.floor(1000 + Math.random() * 9000));

    sendEmail(email, "verify your otp", `Your OTP is ${otp}`)
      .then(async () => {
        // Assuming you have a User model imported and emailforverification contains the email
        const userEmail = email;
        const newOTP = otp; // Assuming otp is generated somewhere before this code
        try {
          const updatedUser = await User.findOneAndUpdate(
            { email: email }, // Find the document with the specified email
            { otp: newOTP }, // Update the OTP field with the new OTP
            { new: true } // Return the updated document
          );

          // req.userdata = email;
          // console.log("OTP updated successfully:");

          return res.status(200).send("opt has been send to your mail");
        } catch (error) {
          console.error("Failed to update OTP:", error);
        }
      })
      .catch((err) => console.error("Failed to send email:", err));
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports.verifySign = async (req, res, next) => {
  const { recivedOtp } = req.body;

  try {
    if (typeof recivedOtp !== "number") {
      return res
        .status(400)
        .json({ error: "Invalid OTP. OTP must be a number." });
    }

    const ifverifiedLogin = await User.findOne({ otp: recivedOtp });

    if (ifverifiedLogin) {
      const token = jwt.sign({ ifverifiedLogin }, secretKey, {
        expiresIn: "3h",
      });

      return res.json({ ifverifiedLogin, token });
    } else {
      res.status(403).send({
        auth: false,
        message:
          "Please verify your account first by entering the OTP sent on your registered Email Id.",
      });
    }
  } catch (error) {}
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return err;
    }
    req.session.destroy(function (err) {
      if (err) {
        return err;
      }
      res.send("See you later!");
    });
  });
};
module.exports.changePassword = async (req, res) => {
  const { email, oldpassword, newpassword, confirmpassword } = req.body;
  // const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(308).json({ message: "Email does not exist" });
    }

    if (user.authMethod === "google") {
      return res.json({
        message:
          "User signed in through Google account cannot change password.",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const isOldpasswordCorrect = await bcrypt.compareSync(
      oldpassword,
      user.password
    );

    if (isOldpasswordCorrect) {
      if (newpassword === confirmpassword) {
        const hashedPassword = bcrypt.hashSync(newpassword, salt);
        const updatedUser = await User.findOneAndUpdate(
          { email: email },
          { password: hashedPassword },
          { new: true }
        );

        res.send("password has been changed");
      } else {
        res.send("passord doesnt match");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

module.exports.forgetPassword = async (req, res) => {
  const { email, newpassword } = req.body;
  // Check if the email is provided
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (user.authMethod === "google") {
    return res.json({
      message: "User signed in through Google account cannot change password.",
    });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newpassword, salt);
  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true }
  );

  res.send("password has been changed");
};
