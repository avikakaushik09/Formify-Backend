require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/form");
const responseRoutes = require("./routes/response");

const app = express();

connectDB();

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.get("/test", (req, res) => {
  res.json({ message: "Test working" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});