const express = require("express");
const router = express.Router();
const Pago = require("../model/Pago");
const multer = require("multer");
const User = require("../model/User");
const Producto = require("../model/Producto");
const path = require("path");
const jwt = require("jsonwebtoken");

// Multer Storage
const storage = multer.diskStorage({
  destination: "public/image/pagos",
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
    const error = new Error("El archivo no es una imagen valida.");
    error.status = 400;
    cb(error);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);
    const producto = await Producto.findById(req.body.productoID);

    if (!producto) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    const payment = new Pago({
      total: producto.price,
      image: req.file.filename,
      userID: user._id,
      productoID: producto._id,
    });
    await payment.save();

    res.status(200).json({ message: "Imagen subida y guardada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/payments", async (req, res) => {
  try {
    const payments = await Pago.find({ verifiedPayment: false });
    res
      .status(200)
      .send({ meesage: "Pagos Obtenidos con exito!", pago: payments });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener los pagos" });
  }
});

router.get("/verifiedPayments", async (req, res) => {
  try {
    const payments = await Pago.find({ verifiedPayment: true });
    res
      .status(200)
      .send({ message: "Pagos Obtenidos con exito!", pago: payments });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener los pagos" });
  }
});

router.get("/payments/:pagoID", async (req, res) => {
  try {
    const payment = await Pago.findById(req.params.pagoID);
    const imagePath = path.join(
      __dirname,
      "../public/image/pagos",
      payment.image
    );

    res.sendFile(imagePath, (error) => {
      if (error) {
        console.error("Error al descargar el comprobante: ", error);
        res.status(301).send({ message: "Error al obtener la imagen" });
      } else {
        console.log("Comprobante descargado correctamente");
        res
          .status(200)
          .send({ message: "Comprobante descargado correctamente" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener el pago" });
  }
});

module.exports = router;
