const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //verificar si el usuario existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email incorrect" });
    }
    //verificar si la contraseña es valida
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Password incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, user: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const role = user.role;

    res.status(200).json({
      message: "Login succesfull",
      token,
      role,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(401).json({ message: "Error in Data" });
    }
    console.log("Error in Login", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("info");
    res.status(200).json({ message: "Logout Succesfull" });
  } catch (err) {
    console.log("Error in Logout", err);
    res.status(500).json({ message: "Error in Logout" });
  }
};
