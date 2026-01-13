import AdminLoginForm from "../components/AdminLoginForm";
import { Link } from "react-router-dom";
import "./styles/LoginPage.css"; // reuse same CSS

export default function AdminLoginPage() {
  return (
    <div className="login-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div>
          <Link to="/" className="navbar-logo">ByteSafe</Link>
        </div>
        <div className="navbar-auth">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/login" className="nav-btn nav-btn-primary">
            User Login
          </Link>
        </div>
      </nav>

      <div className="login-container">
        {/* Left creative side */}
        <div className="login-left">
          <h2 className="creative-heading">Admin Access Portal</h2>
          <p className="creative-text">
            Secure administrative access to manage users, permissions,
            and platform operations with full control.
          </p>
        </div>

        {/* Right admin login side */}
        <div className="login-right">
          <div className="login-card">
            <h1 className="login-title">Admin Sign In</h1>

            <AdminLoginForm />

            <p className="login-footer">
              Not an admin?{" "}
              <Link to="/login" className="signup-link">
                Go to User Login
              </Link>
              <br />
              New user?{" "}
              <Link to="/signup" className="signup-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}