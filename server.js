const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Patient = require("./models/Patient");
const Doctor = require("./models/Doctor");
const Consultation = require("./models/Consultation");
require("dotenv").config();
const app = express();
const PORT = 3000;

// MongoDB Connection with clear error logging
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error("MongoDB connection failed. Is MongoDB running?");
    console.error("Error:", err.message);
    process.exit(1); // Stop the server if DB is not connected
  });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve HTML Pages
const servePage = (file) => (req, res) =>
  res.sendFile(path.join(__dirname, "views", file));

app.get("/", servePage("index.html"));
app.get("/patient-login.html", servePage("patient-login.html"));
app.get("/patient-register.html", servePage("patient-register.html"));
app.get("/doctor-login.html", servePage("doctor-login.html"));
app.get("/doctor-register.html", servePage("doctor-register.html"));
app.get("/questionnaire.html", servePage("questionnaire.html"));
app.get("/questions.html", servePage("questions.html"));
app.get("/response.html", servePage("response.html"));
app.get("/patient-dashboard.html", servePage("patient-dashboard.html"));
app.get("/patient-reports.html", servePage("patient-reports.html"));
app.get("/patient-queries.html", servePage("patient-queries.html"));
app.get("/doctor-dashboard.html", servePage("doctor-dashboard.html"));

// Patient Registration
app.post("/patient-register", async (req, res) => {
  const { name, email, password, age, gender } = req.body;
  try {
    const exists = await Patient.findOne({ email });
    if (exists) return res.send("⚠️ Email already registered.");

    const patient = new Patient({ name, email, password, age, gender });
    await patient.save();
    // console.log("Patient Saved:", patient);
    res.redirect("/questionnaire.html");
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).send("Server error");
  }
});

// Patient Login
app.post("/patient-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient || patient.password !== password) {
      return res.send(`
        <script>
          alert("Invalid email or password");
          window.location.href = "/patient-login.html";
        </script>
      `);
    }
    // console.log("Patient Logged In:", patient);
    res.send(`
  <script>
    localStorage.setItem('patientName', '${patient.name}');
    localStorage.setItem('patientEmail', '${patient.email}');
    localStorage.setItem('patientAge', '${patient.age}');
    localStorage.setItem('patientGender', '${patient.gender}');
    window.location.href='/patient-reports.html';
  s</script>
  `);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server Error");
  }
});


// Doctor Registration
app.post("/doctor-register", async (req, res) => {
  const { name, email, password, specialization, experience } = req.body;
  try {
    const exists = await Doctor.findOne({ email });
    if (exists) return res.send("⚠️ Doctor already registered.");
    const doctor = new Doctor({ name, email, password, specialization, experience });
    await doctor.save();
    // console.log("Doctor Registered:", doctor);
    res.send(`<script>
      localStorage.setItem('doctorEmail', '${email}');
      window.location.href = '/doctor-dashboard.html';
    </script>`);
  } catch (err) {
    console.error("❌ Doctor register error:", err);
    res.status(500).send("Server error");
  }
});

// Hardcoded doctor credentials
const FIXED_DOCTOR_EMAIL = "doctor@gmail.com";
const FIXED_DOCTOR_PASSWORD = "doctor123";

// Doctor Login
app.post("/doctor-login", (req, res) => {
  const { email, password } = req.body;

  if (email === FIXED_DOCTOR_EMAIL && password === FIXED_DOCTOR_PASSWORD) {
    // Store email in localStorage via script and redirect to dashboard
    res.send(`
      <script>
        localStorage.setItem('doctorEmail', '${FIXED_DOCTOR_EMAIL}');
        window.location.href='/doctor-dashboard.html';
      </script>
    `);
  } else {
    res.send(`
      <script>
        alert('Invalid credentials!');
        window.location.href='/doctor-login.html';
      </script>
    `);
  }
});


// Feedback Submission
app.post("/submit-feedback", async (req, res) => {
  const { reportId, feedback, prescription } = req.body;
  try {
    await Consultation.findByIdAndUpdate(reportId, { feedback, prescription });
    // console.log(`Feedback submitted for report ${reportId}`);
    res.redirect("/doctor-dashboard.html");
  } catch (err) {
    console.error("Feedback submission error:", err);
    res.status(500).send("Error saving feedback.");
  }
});

// Submit Consultation
app.post("/submit-questions", async (req, res) => {
  const { email, duration, pain, consulted, problemType } = req.body;
  try {
    const consultation = new Consultation({ email, duration, pain, consulted, problemType });
    await consultation.save();
    // console.log("Consultation saved:", consultation);
    res.redirect("/response.html");
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).send("Server error.");
  }
});

// Get All Consultations
app.get("/api/consultations", async (req, res) => {
  const email = req.query.email; // get patient email from query
  try {
    let consultations;
    if(email){
      consultations = await Consultation.find({ email }).sort({ createdAt: -1 });
    } else {
      consultations = await Consultation.find().sort({ createdAt: -1 });
    }
    res.json(consultations);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Doctor Profile API
app.get("/api/doctor-profile", async (req, res) => {
  const { email } = req.query;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json({
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience
    });
  } catch (err) {
    console.error("❌ Doctor profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});