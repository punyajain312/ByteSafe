import { useState } from "react";
import "./styles/LoginForm.css";
import { adminLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuth(); // clearer naming
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const data: { token: string } = await adminLogin(email, password);

      setAuth(data.token, true); // true = admin
      toast.success("Admin login successful!");

      navigate("/admin-dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Admin login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      <label className="input-label" htmlFor="admin-email">
        Admin Email
      </label>
      <input
        id="admin-email"
        type="email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className="input-label" htmlFor="admin-password">
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login as Admin"}
      </button>
    </form>
  );
}