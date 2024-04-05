const bcrypt = require("bcryptjs");

const User = require("../models/chat-model");

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

    res.status(200).json({ message: "User authenticated successfully", user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.signUp = async (req, res) => {
  const { firstName, lastname, email, password } = req.body;

  try {
    const givenName = firstName;
    const familyName = lastname;

    const checkifexists = await User.findOne({ email: email });

    if (checkifexists) {
      return res.status(409).json({ message: "user already exists" });
    }

    const salt = bcrypt.genSaltSync(10); // 10 is the number of salt rounds
    const hashedPassword = bcrypt.hashSync(password, salt);

    // const isPasswordValid = await bcrypt.compareSync("password", hashedPassword);

    const new_user = new User({
      email: email,
      givenName: givenName,
      familyName: familyName,
      password: hashedPassword,
      authMethod: "manual",
    });

    await new_user.save();

    res.status(201).json({ message: `new user has been createad` });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

module.exports.signIN = async (req, res) => {
  const { email, password } = req.body;

  const findifexists = await User.findOne({ email: email });
  console.log(findifexists);

  if (!findifexists) {
    return res.status(401).send({ auth: false, message: "Email not found" });
  } else {
    // var isMatch = bcrypt.compare
    const isPasswordValid = await bcrypt.compareSync(
      password,
      findifexists.password
    );
    res.status(200).send({ auth: true, message: `user  has been sing in` });
  }
};
module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.send("See you later!");
    });
  });
};

module.exports.forgetPasword = async (req, res) => {
  const { email, password } = req.body;

  const findifexists = await User.findOne({ email: email });

  if (!findifexists) {
    return res.status(308).json({ message: "email does not exist" });
  } else {
    const salt = bcrypt.genSaltSync(10); // 10 is the number of salt rounds
    const hashedPassword = bcrypt.hashSync(password, salt);

    // const isPasswordValid = await bcrypt.compareSync("password", hashedPassword);
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    res.status(201).json({ message: `pasword has benn updated` });
  }
};