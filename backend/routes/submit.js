const router=require("express").Router();
const db=require("../db");
const {PDFDocument,StandardFonts}=require("pdf-lib");
const fs=require("fs");

router.post("/", async (req, res) => {
  try {
    console.log("Submit route hit");
    console.log(req.body);

    const { form_id, user_id, data } = req.body;

    if (!form_id || !user_id) {
      return res.status(400).json({ message: "Missing data" });
    }

    // Check form exists
    const [forms] = await db.query(
      "SELECT * FROM forms WHERE id = ?",
      [form_id]
    );

    if (forms.length === 0) {
      return res.status(404).json({ message: "Form not found" });
    }

    const form = forms[0];
    const pdfPath = "uploads/" + form.filename;

    if (!require("fs").existsSync(pdfPath)) {
      return res.status(404).json({ message: "PDF file not found" });
    }

    // Insert submission
    await db.query(
      "INSERT INTO submissions (user_id, form_id, data) VALUES (?, ?, ?)",
      [user_id, form_id, JSON.stringify(data)]
    );

    return res.status(200).json({
      message: "Form submitted successfully"
    });

  } catch (error) {
    console.log("Submit Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports=router;