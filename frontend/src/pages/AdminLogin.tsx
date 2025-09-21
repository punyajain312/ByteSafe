import "./styles/LoginPage.css"; // reuse same CSS
import AdminLoginForm from "../components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="login-wrapper">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">FileVault Admin</div>
      </div>

      {/* Split container */}
      <div className="login-container">
        {/* Left creative */}
        <div className="login-left">
          <h2 className="creative-heading">Admin Access</h2>
          <p className="creative-text">
            Secure login for administrators to manage the platform.
          </p>
        </div>

        {/* Right form */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-title">Admin Login</h2>
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}