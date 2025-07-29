const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  email: String,
  duration: String,
  pain: String,
  consulted: String,
  problemType: String,
  feedback: { type: String, default: "Pending" }, // ✅ NEW
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Consultation", consultationSchema);
