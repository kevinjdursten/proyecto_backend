const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(() => {
    console.log("MongoDB Connection Failed");
  });

const corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
