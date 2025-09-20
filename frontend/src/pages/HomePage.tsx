import { Link } from "react-router-dom";
import "./styles/HomePage.css";

export default function HomePage() {
  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">MyApp</div>
        <div className="navbar-auth">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Secure. Fast. Effortless. 🚀</h1>
          <p className="hero-subtext">
            The modern platform to manage your files, collaborate with your team,
            and stay connected anywhere in the world.
          </p>
          <Link to="/signup" className="hero-btn">Get Started</Link>
        </div>
        <div className="hero-graphic">
          {/* You can replace this with an SVG or Lottie animation */}
          <div className="graphic-placeholder">✨</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Why Choose MyApp?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure Storage</h3>
            <p>Your files are encrypted and stored safely in the cloud.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Lightning Fast</h3>
            <p>Access and share files instantly without delays.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤝</span>
            <h3>Collaboration</h3>
            <p>Work seamlessly with your team in real-time.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🌍</span>
            <h3>Global Access</h3>
            <p>Login anywhere, anytime — your data travels with you.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}