const bcrypt = require("bcrypt");
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

    // Buscar el usuario existente
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Actualizar los campos del usuario
    user.name = name;
    user.lastName = lastName;
    user.birthDate = birthDate;
    user.email = email;
    user.role = role;
    user.updateDate = Date.now();

    // Si se proporcionó una nueva contraseña, cifrarla y actualizarla
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Guardar el usuario actualizado en la base de datos
    await user.save();

    res.status(200).json({ message: "User Update" });
  } catch (err) {
    console.log("Error to update User", err);
    res.status(500).json({ message: "Error Not Update" });
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
