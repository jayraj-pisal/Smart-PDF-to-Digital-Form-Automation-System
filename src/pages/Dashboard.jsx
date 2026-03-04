import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/forms")
      .then(res => setForms(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      <div>
      <h2>Welcome to Dashboard 🎉</h2>
    </div>
    <div>
      <h2>Available Forms</h2>
    </div>
      {forms.length === 0 ? (
        <p>No forms available</p>
      ) : (
        forms.map(form => (
          <div key={form.id} className="form-card">
            <p>{form.filename}</p>

            <button onClick={() => navigate(`/fill/${form.id}`)}>
              Fill Form
            </button>
          </div>
        ))
      )}
    </div>
  );
}