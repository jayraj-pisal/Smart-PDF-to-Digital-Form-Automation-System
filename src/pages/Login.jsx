import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("Student"); // 🔹 role state
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, role, code }   // 🔹 send role and code to backend
      );

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      // 🔹 redirect based on role
      if(role === "Admin"){
        navigate("/admin-dashboard");
      }else{
        navigate("/dashboard");
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>{role === "Admin" ? "Admin Login" : "Student Login"}</h2>

        {/* 🔹 Role Toggle */}
        <div className="role-toggle">

          <button
            type="button"
            className={role === "Student" ? "active" : ""}
            onClick={() => setRole("Student")}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "Admin" ? "active" : ""}
            onClick={() => setRole("Admin")}
          >
            Admin
          </button>

        </div>

        <form onSubmit={handleLogin}>

          <div>
            <label>Email</label><br/>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>

            <label>Password</label><br/>

            <div className="password-wrapper">

              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <span
                className="toggle-password"
                onClick={() => setShow(!show)}
              >
                {show ? "🙈" : "👁"}
              </span>

            </div>

          </div>

          <div className="form-group">
          <label>{role} Code</label>
         <input type="code"  
          value={code}
          onChange={(e) => setCode(e.target.value)}
         />
         </div> 

          <button type="submit">
            Login as {role}
          </button>

        </form>

        {/* Sign Up */}
        <p className="signup-text">
          Don't have an account?
          <span
            className="signup-link"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>

      </div>

    </div>

  );
}

export default Login;