// ✅ FINAL FIXED Consultation.js
const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  email: String, // ✅ links consultation to the correct patient
  duration: String,
  pain: String,
  consulted: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Consultation", consultationSchema);
