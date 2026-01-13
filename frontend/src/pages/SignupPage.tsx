import SignupForm from "../components/SignupForm";
import { Link } from "react-router-dom";
import "./styles/LoginPage.css";

export default function SignupPage() {
  return (
    <div className="login-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div>
          <Link to="/" className="navbar-logo">ByteSafe</Link>
        </div>
        <div className="navbar-auth">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/login" className="nav-btn nav-btn-primary">Login</Link>
        </div>
      </nav>

      <div className="login-container">
        {/* Left creative side */}
        <div className="login-left">
          <h2 className="creative-heading">Join ByteSafe</h2>
          <p className="creative-text">
            A secure, fast, and reliable vault for your files.  
            Sign up today and take control of your digital world.
          </p>
        </div>

        {/* Right signup form */}
        <div className="login-right">
          <div className="login-card">
            <h1 className="login-title">Create Your Account</h1>
            <SignupForm />
            <p className="login-footer">
              Already have an account?{" "}
              <Link to="/login" className="signup-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}