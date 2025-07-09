const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Patient = require("./models/Patient");
const Doctor = require("./models/Doctor");

const app = express();
const PORT = 3000;

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/amitdb")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// ✅ Consultation Schema & Model
const consultationSchema = new mongoose.Schema({
  duration: String,
  pain: String,
  consulted: String,
  createdAt: { type: Date, default: Date.now }
});

const Consultation = mongoose.model("Consultation", consultationSchema);

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve HTML Pages Manually
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/patient-login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "patient-login.html"));
});

app.get("/patient-register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "patient-register.html"));
});

app.get("/doctor-login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "doctor-login.html"));
});

app.get("/doctor-register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "doctor-register.html"));
});

app.get("/questionnaire.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "questionnaire.html"));
});

app.get("/questions.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "questions.html"));
});

app.get("/response.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "response.html"));
});

app.get("/patient-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "patient-dashboard.html"));
});

app.get("/patient-reports.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "patient-reports.html"));
});

app.get("/patient-queries.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "patient-queries.html"));
});

app.get("/doctor-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "doctor-dashboard.html"));
});

// ✅ Patient Registration
app.post("/patient-register", async(req, res) => {
  const { name, email, password, age, gender } = req.body;
  try {
    const exists = await Patient.findOne({email});
    if (exists) return res.send("⚠️ Email already registered.")

    const patient = new Patient({ name, email, password, age, gender});
    await patient.save();
    console.log("Patient Saved: ", patient);
    res.redirect("/questionnaire.html");
  } catch (err) {
    console.log("❌ Registration error:", err);
    res.status(500).send("Server error");
  }
});

// Patient Login
app.post("/patient-login", async (req, res) =>{
  const { email, password } = req.body;

  try{
    const patient = await Patient.findOne({ email });
    if (!patient || patient.password !== password) {
      return res.send("Invalid email or password");
    }
    console.log("✅ Patient logged in: ", email);
    res.redirect("/patient-dashboard.html");
  }catch(err){
    console.log("❌ Login error: " +err);
    res.status(500).send("Server Error");
  }
});

// ✅ Doctor Registration
app.post("/doctor-register", (req, res) => {
  const { name, email, password, specialization, experience } = req.body;
  console.log("📥 Doctor Registered:", { name, email, password, specialization, experience });
  res.redirect("/doctor-dashboard.html");
});

// ✅ Submit Consultation (Question Form)
app.post("/submit-questions", async (req, res) => {
  const { duration, pain, consulted } = req.body;

  try {
    const consultation = new Consultation({ duration, pain, consulted });
    await consultation.save();
    console.log("✅ Consultation saved:", consultation);
    res.redirect("/response.html");
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).send("Server error.");
  }
});

// ✅ Get All Consultations (Reports)
app.get("/api/consultations", async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
