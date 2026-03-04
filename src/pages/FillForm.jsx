import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import axios from "axios";
import "../styles/FillForm.css";

export default function FillForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  // 🔥 Fetch form from backend
  useEffect(() => {
    axios.get(`http://localhost:5000/api/forms/${id}`)
      .then(res => {
        setForm(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  if (!form) {
    return <h2>Loading...</h2>;
  }

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/submit",
        {
          form_id: id,   // 🔥 use dynamic id
          user_id: 1,
          data: formData
        }
      );

      navigate("/preview", {
        // state: { file: response.data.file }
        state: { 
        formData, 
        form   // send form also
  } 
      });

    } catch (err) {
      console.error("ERROR:", err);
      alert("Submission failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-FillForm">
        <h2>{form.title}</h2>

        <form onSubmit={submitForm}>
          <FormRenderer
            // fields={form.fields}
            fields={[
            {"label":"Full Name","name":"name",   "type":"text"},
            {"label":"Campus Address","name":"campusAddress","type":"text"},
            {"label":"Home Address","name":"homeAddress","type":"text"},
            {"label":"Email","name":"email","type":"email"},
            {"label":"Phone","name":"phone","type":"text"},
            {"label":"Internship Semester","name":"internshipSemester","type":"text"},
            {"label":"Overall CGPA","name":"overallCGPA","type":"text"}
            ]} 
            formData={formData}
            setFormData={setFormData}
          />

          <button type="submit" className="auth-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}