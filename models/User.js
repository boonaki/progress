const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, Default: ''},
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    followers: {type: Array, Default: []},
    following: {type: Array, Default: []},
    visits: {type: Number, default: 0},
    bio: {type: String, default: 'Customize your personal biography'},
    link: {type: String, default: ''},
    profilePic: {type: String, default: 'https://res.cloudinary.com/dbrsr8xju/image/upload/v1664744309/user_oljcub.jpg'},
    ppCloudinaryId: {type: String, default: ''},
    interests: {type: Array, default: []},
    isPublic: {type: Boolean, default: true},
    termsAndConditions: {type: Boolean, default: true},
});



// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
