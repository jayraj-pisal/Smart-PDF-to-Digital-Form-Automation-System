const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");

// Storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =============================
// Upload PDF
// =============================
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    await db.query(
      "INSERT INTO forms (filename) VALUES (?)",
      [req.file.filename]
    );

    res.status(200).json({
      msg: "File uploaded successfully",
      filename: req.file.filename
    });

  } catch (err) {
    console.log("Upload Error:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

// =============================
// Get All Forms
// =============================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, filename FROM forms");
    res.status(200).json(rows);
  } catch (err) {
    console.log("Fetch Error:", err);
    res.status(500).json({ msg: "Error fetching forms" });
  }
});

// =============================
// Get Single Form by ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM forms WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Form not found" });
    }

    res.status(200).json(rows[0]);

  } catch (err) {
    console.log("Single Fetch Error:", err);
    res.status(500).json({ msg: "Error fetching form" });
  }
});

module.exports = router;