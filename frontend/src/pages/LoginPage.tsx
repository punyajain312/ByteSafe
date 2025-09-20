import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import "./styles/LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">MyApp</div>
        <div className="navbar-auth">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">Sign Up</Link>
        </div>
      </nav>

      <div className="login-container">
        {/* Left creative side */}
        <div className="login-left">
          <h2 className="creative-heading">Welcome to MyApp 🚀</h2>
          <p className="creative-text">
            Manage your files securely, collaborate with ease, and access your
            dashboard anywhere.
          </p>
        </div>

        {/* Right login side */}
        <div className="login-right">
          <div className="login-card">
            <h1 className="login-title">Welcome Back</h1>
            <LoginForm />
            <p className="login-footer">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}