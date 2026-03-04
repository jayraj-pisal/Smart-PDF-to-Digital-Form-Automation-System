import { useLocation, useNavigate } from "react-router-dom";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function Preview(){
  
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>No Data Found</h2>
          <button onClick={() => navigate("/dashboard")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { formData, form } = location.state;
 

const generatePDF = async () => {
  console.log("FULL STATE:", location.state);

  if (!form || !form.filename) {
    alert("Form PDF not found");
    return;
  }

  const pdfUrl = `http://localhost:5000/uploads/${form.filename}`;

  const existingPdfBytes = await fetch(pdfUrl)
    .then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  page.drawText(`${formData.name || ""}`, { x: 200, y: 650, size: 12, font });
  page.drawText(`${formData.email || ""}`, { x: 200, y: 550, size: 12, font });
  page.drawText(`${formData.phone || ""}`, { x: 500, y: 620, size: 12, font });
  page.drawText(`${formData.campusAddress || ""}`, { x: 200, y: 620, size: 12, font });
  page.drawText(`${formData.homeAddress || ""}`, { x: 200, y: 585, size: 12, font });
  page.drawText(`${formData.internshipSemester || ""}`, { x: 450, y: 490, size: 12, font });
  page.drawText(`${formData.overallCGPA || ""}`, { x: 350, y: 435, size: 12, font });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  window.open(url);
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Preview & Download</h2>
        <button className="auth-btn" onClick={generatePDF}>
          Generate Filled PDF
        </button>
      </div>
    </div>
  );
}