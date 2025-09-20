import { useState } from "react";
import { signup, login } from "../api/auth";
import SharedInput from "./SharedInput";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./styles/LoginForm.css";

export default function SignupForm() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      const res = await login(email, password);
      setAuth(res.data.token);
      toast.success("Signup successful! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Signup failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <SharedInput
        type="text"
        placeholder="Name"
        value={name}
        onChange={setName}
        label="Full Name"
        className="input-field"
      />
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
        Sign Up
      </button>
    </form>
  );
}