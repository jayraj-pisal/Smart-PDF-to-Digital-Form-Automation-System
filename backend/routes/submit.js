const router = require("express").Router();
const db = require("../db");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

// =============================
// Submit Form + Generate PDF
// =============================
router.post("/", async (req, res) => {
  try {
    const { form_id, user_id, data } = req.body;

    if (!form_id || !user_id || !data) {
      return res.status(400).json({ msg: "Missing data" });
    }

    // get form
    const [forms] = await db.query(
      "SELECT * FROM forms WHERE id = ?",
      [form_id]
    );

    if (forms.length === 0) {
      return res.status(404).json({ msg: "Form not found" });
    }

    const form = forms[0];

    const pdfPath = path.join(__dirname, "..", "uploads", form.filename);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ msg: "PDF not found" });
    }

    // load pdf
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // write data on pdf (you can adjust positions)
    page.drawText(`Name: ${data.name || ""}`, { x: 50, y: 700, size: 12, font });
    page.drawText(`Email: ${data.email || ""}`, { x: 50, y: 680, size: 12, font });
    page.drawText(`College: ${data.college || ""}`, { x: 50, y: 660, size: 12, font });
    page.drawText(`Branch: ${data.branch || ""}`, { x: 50, y: 640, size: 12, font });
    page.drawText(`Phone: ${data.phone || ""}`, { x: 50, y: 620, size: 12, font });

    const pdfBytes = await pdfDoc.save();

    // create filled folder if not exists
    const filledDir = path.join(__dirname, "..", "filled");
    if (!fs.existsSync(filledDir)) {
      fs.mkdirSync(filledDir);
    }

    const filename = `filled-${Date.now()}.pdf`;
    const filePath = path.join(filledDir, filename);

    fs.writeFileSync(filePath, pdfBytes);

    // save in DB
    await db.query(
      "INSERT INTO submissions (user_id, form_id, data, filled_pdf) VALUES (?, ?, ?, ?)",
      [user_id, form_id, JSON.stringify(data), filename]
    );

    res.json({
      msg: "Form submitted successfully",
      file: filename
    });

  } catch (err) {
    console.log("Submit Error:", err);
    res.status(500).json({ msg: "Submit failed" });
  }
});


// =============================
// Get Submissions
// =============================
router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.user_id,
        s.form_id,
        s.data,
        s.filled_pdf,
        s.created_at,
        f.filename
      FROM submissions s
      JOIN forms f ON s.form_id = f.id
      ORDER BY s.created_at DESC
    `);

    const parsed = rows.map(r => ({
      ...r,
      data: JSON.parse(r.data || "{}")
    }));

    res.json(parsed);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Fetch error" });
  }
});

module.exports = router;