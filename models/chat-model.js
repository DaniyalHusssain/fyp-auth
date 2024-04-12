const mongoose = require("mongoose");

// Define schema for user login data
const userSchema = new mongoose.Schema({
  // Common fields for both Google and manual authentication
  email: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness of email
  },
  password: {
    type: String,
    required: function () {
      // Password is required only for manual authentication
      return this.authMethod === "manual";
    },
  },
  // Fields specific to Google authentication
  googleId: {
    type: String,
    unique: true, // Ensure uniqueness of Google ID
  },
  googleToken: String,
  // Field to indicate the authentication method used
  authMethod: {
    type: String,
    enum: ["google", "manual"],
    required: true,
  },
  // Additional fields as per your requirements
  name: {
    givenName: { type: String },
    familyName: { type: String },
  },

  otp: {
    code: Number,
    expiresAt: Date,
  },

  profilePicture: String,
  // Timestamps for creation and update
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Define a pre-save hook to concatenate givenName and familyName into the name field
// Define a pre-save hook to concatenate givenName and familyName into the name field
userSchema.pre("save", function (next) {
  if (this.authMethod === "google" && this.isModified("name")) {
    const fullName = `${this.name.givenName} ${this.name.familyName}`;
    this.name = fullName;
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
