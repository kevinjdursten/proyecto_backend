const express = require("express");
const router = express.Router();
const Pago = require("../model/Pago");
const multer = require("multer");
const path = require("path");

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

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/pago", upload.single("image"), async (req, res) => {
  try {
    const payment = new Pago({
      total: req.body.total,
      image: req.file.filename,
      userID: req.body.userID,
      productoID: req.body.productoID,
    });
    await payment.save();

    res.status(200).json({ message: "Imagen subida y guardada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/unverified-payments", async (req, res) => {
  try {
    const unverifiedPayments = await Pago.aggregate([
      {
        $match: {
          verifiedPayment: false,
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "productoID",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userID",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          total: 1,
          image: 1,
          producto: {
            _id: 1,
            name: 1,
            price: 1,
          },
          user: {
            _id: 1,
            name: 1,
            lastName: 1,
            email: 1,
          },
          verifiedPayment: 1,
        },
      },
    ]);
    res.json(unverifiedPayments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error al obtener los pagos no verificados" });
  }
});

router.get("/verified-payments", async (req, res) => {
  try {
    const verifiedPayments = await Pago.aggregate([
      {
        $match: {
          verifiedPayment: true,
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "productoID",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userID",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          total: 1,
          image: 1,
          producto: {
            _id: 1,
            name: 1,
            price: 1,
          },
          user: {
            _id: 1,
            name: 1,
            lastName: 1,
            email: 1,
          },
          verifiedPayment: 1,
        },
      },
    ]);
    res.json(verifiedPayments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener los pagos verificados" });
  }
});

router.post("/payments/verify/:pagoID", async (req, res) => {
  const pagoID = req.params.pagoID;
  try {
    const payment = await Pago.findById(pagoID);

    if (!payment) {
      return res.status(404).send({ message: "Pago no encontrado" });
    }

    payment.verifiedPayment = true;

    await payment.save();

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al verificar el pago" });
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
