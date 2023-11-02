const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
    minLength: 1,
    maxLength: 5,
  },
  image: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productoID: {
    type: mongoose.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  verifiedPayment: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
    inmutable: true,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

const Pago = mongoose.model("Pago", pagoSchema);

module.exports = Pago;
