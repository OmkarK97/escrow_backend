const mongoose = require("mongoose");
const { HOST } = require("../config/config");

if (!HOST) {
  throw new Error("Host is not defined in .env file");
}

mongoose
  .connect(HOST)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err);
    console.error("Detailed Error:", JSON.stringify(err, null, 2));
  });
