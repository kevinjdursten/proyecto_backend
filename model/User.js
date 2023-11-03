const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: function (v) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v);
      },
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z¡¿áéíóúÁÉÍÓÚÑñ\s]+$/.test(v);
      },
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
  },
  birthDate: {
    type: Date,
    required: true,
    get: function (v) {
      const date = new Date(v);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  createDate: {
    type: Date,
    default: Date.now,
    inmutable: true,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
