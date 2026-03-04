import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password }
      );

      alert("Registered Successfully");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

 return (
  <div className="auth-container">
    <div className="auth-card">
      <h2>Student Sign Up</h2>

      <form onSubmit={handleRegister}>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <span
              className="toggle-password"
              onClick={() => setShow(!show)}
            >
              {show ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <button className="auth-btn" type="submit">
          Sign Up
        </button>

        <p className="switch-auth">
          Already have an account?
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </p>

      </form>
    </div>
  </div>
);
}

export default Register;