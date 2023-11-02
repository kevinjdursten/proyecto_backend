const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Producto = require("../model/Producto");

const storage = multer.diskStorage({
  destination: "public/image/productos",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    const error = new Error("El archivo no es una imagen valida");
    error.status = 400;
    cb(error);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/product", upload.single("image"), async (req, res) => {
  try {
    const producto = new Producto({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file.filename,
    });
    await producto.save();
    res.status(200).json({ message: "Imagen subida y producto guardado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/product", async (req, res) => {
  try {
    const products = await Producto.find({});
    res.json(products);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const product = await Producto.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Producto.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Delete Product" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.patch("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const product = await Producto.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Update Product" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
