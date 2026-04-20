const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/forms");
const submitRoutes = require("./routes/submit");

const app = express();

// --- 1. ENHANCED CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173", // Default Vite port
  "http://localhost:3000", // Default React port
  process.env.FRONTEND_URL  // Your Netlify URL (set this in Railway Variables)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("netlify.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- 2. STATIC FILES ---
// Ensure these folders exist on your server or are handled by Railway volumes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/filled", express.static(path.join(__dirname, "filled")));

// --- 3. API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/submit", submitRoutes);

// --- 4. DEPLOYMENT SETTINGS ---
// Note: Since you are deploying Frontend on Netlify, 
// the code below (serving dist) is technically optional but good for backup.
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// Only use the SPA fallback if the request isn't an API call
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api/")) {
    res.sendFile(path.join(distPath, "index.html"));
  }
});

// --- 5. PORT CONFIGURATION ---
// Railway provides the PORT variable automatically. 
// Use 0.0.0.0 to ensure it binds to the network interface.
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
