const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  duration:  String,
  pain:      String,
  consulted: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Consultation", consultationSchema);
