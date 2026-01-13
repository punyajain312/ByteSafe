import { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import SharedInput from "./SharedInput";
import { useNavigate } from "react-router-dom";
import "./styles/LoginForm.css";

export default function LoginForm() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      setAuth(res.data.token);
      navigate("/dashboard"); 
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

   return (
    <form onSubmit={handleSubmit} className="login-form" >
      <SharedInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={setEmail}
        label="Email Address"
        className="input-field"
      />
      <SharedInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={setPassword}
        label="Password"
        className="input-field"
      />
      <button type="submit" className="login-button">
        Login
      </button>
    </form>
  );
}