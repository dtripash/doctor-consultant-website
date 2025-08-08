const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  email: String,
  duration: String,
  pain: String,
  consulted: String,
  problemType: String,
  feedback: { type: String, default: "Pending" }, //  NEW
  prescription: { type: String, default: "Not Given" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Consultation", consultationSchema);
