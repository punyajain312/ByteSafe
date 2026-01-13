import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "./styles/LoginPage.css";

type Props = {
  mode: "login" | "signup";
};

export default function AuthPage({ mode }: Props) {
  const isLogin = mode === "login";

  return (
    <div className={`login-wrapper ${mode}`}>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-logo">ByteSafe</Link>
        <div className="navbar-auth">
          <Link to="/" className="nav-btn">Home</Link>
          {isLogin ? (
            <Link to="/signup" className="nav-btn nav-btn-primary">Sign Up</Link>
          ) : (
            <Link to="/login" className="nav-btn nav-btn-primary">Login</Link>
          )}
        </div>
      </nav>

      {/* Sliding Container */}
      <div className="login-container">
        
        {/* TEXT PANEL */}
        <div className="login-panel text-panel">
          {isLogin ? (
            <>
              <h2 className="creative-heading">Welcome Back to ByteSafe</h2>
              <p className="creative-text">
                Access your secure vault, manage files, and collaborate anytime.
              </p>
            </>
          ) : (
            <>
              <h2 className="creative-heading">Join ByteSafe</h2>
              <p className="creative-text">
                A secure, fast, and reliable vault for your digital world.
              </p>
            </>
          )}
        </div>

        {/* FORM PANEL */}
        <div className="login-panel form-panel">
          <div className="login-card">
            <h1 className="login-title">
              {isLogin ? "Sign In to Your Account" : "Create Your Account"}
            </h1>

            {isLogin ? <LoginForm /> : <SignupForm />}

            <p className="login-footer">
                {isLogin ? (
                    <>
                    Don’t have an account?{" "}
                    <Link to="/signup" className="signup-link">Create one</Link>
                    <br />
                    Admin user?{" "}
                    <Link to="/admin-login" className="signup-link">Login here</Link>
                    </>
                ) : (
                    <>
                    Already have an account?{" "}
                    <Link to="/login" className="signup-link">Log in</Link>
                    </>
                )}              
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}