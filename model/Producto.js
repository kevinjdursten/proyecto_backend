const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  price: {
    type: Number,
    required: true,
    minLength: 1,
    maxLength: 5,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 600,
  },
  image: {
    type: String,
    required: true,
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
const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
