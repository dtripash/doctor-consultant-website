const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  gender: String
});

module.exports = mongoose.model("Patient", patientSchema);
