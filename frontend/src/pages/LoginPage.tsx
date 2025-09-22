import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import "./styles/LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">FileVault</div>
        <div className="navbar-auth">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">Sign Up</Link>
        </div>
      </nav>

      <div className="login-container">
        {/* Left creative side */}
        <div className="login-left">
          <h2 className="creative-heading">Welcome Back to FileVault</h2>
          <p className="creative-text">
            Access your secure vault, manage your files with ease, and continue 
            collaborating anytime, anywhere.
          </p>
        </div>

        {/* Right login side */}
        <div className="login-right">
          <div className="login-card">
            <h1 className="login-title">Sign In to Your Account</h1>
            <LoginForm />
            <p className="login-footer">
              Don’t have an account?{" "}
              <Link to="/signup" className="signup-link">
                Create one
              </Link>
              <br />
              Admin user?{" "}
              <Link to="/admin-login" className="signup-link">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}