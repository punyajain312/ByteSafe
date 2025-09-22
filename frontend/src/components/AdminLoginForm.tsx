import { useState } from "react";
import "./styles/LoginForm.css"; // reuse same CSS
import { adminLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: setAuth } = useAuth(); // store token + role
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await adminLogin(email, password); // ✅ API call
      setAuth(data.token, true); // true = admin
      toast.success("Admin login successful!");
      navigate("/admin-dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
      <label className="input-label">Admin Email</label>
      <input
        type="email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="input-label" >Password</label>
      <input
        type="password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" className="login-button">
        Login as Admin
      </button>
    </form>
  );
}