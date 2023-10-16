const User = require("../model/User");

exports.createUser = async (req, res) => {
  try {
    const { name, lastName, birthDate, email, password, role } = req.body;

    const user = new User({
      name,
      lastName,
      birthDate,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User create" });
  } catch (err) {
    console.error("Error to create user ", err);
    res.status(500).json({ messsage: "Error not create user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, lastName, birthDate, email, password, role } = req.body;

    const user = await User.findByIdAndUpdate(id, {
      name,
      lastName,
      birthDate,
      email,
      password,
      role,
      updateDate: Date.now(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User Update" });
  } catch (err) {
    console.log("Error to update User", err);
    res.status(500).json({ messsage: "Error Not Update" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User no Found" });
    }

    res.status(200).json({ message: "Delete User" });
  } catch (err) {
    console.log("Error to delete User", err);
    res.status(500).json({ messsage: "Error Not Delete" });
  }
};
