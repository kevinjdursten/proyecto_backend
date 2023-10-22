const express = require("express");
const router = express.Router();
const { createUser, updateUser, deleteUser } = require("../controller/User");
const { loginUser } = require("../controller/Auth");
const { logoutUser } = require("../controller/Auth");
const User = require("../model/User");

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/user", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

router.post("/user", createUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
// auth routes
router.post("/user/login", loginUser);
router.post("/user/logout", logoutUser);

module.exports = router;
