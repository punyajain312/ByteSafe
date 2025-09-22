import { Link } from "react-router-dom";
import "./styles/HomePage.css";

export default function HomePage() {
  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">FileVault</div>
        <div className="navbar-auth">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Your Secure File Vault</h1>
          <p className="hero-subtext">
            Store, manage, and share your files with enterprise-grade security
            and lightning-fast access — anywhere, anytime.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="hero-btn">Create Free Account</Link>
            <Link to="/login" className="hero-btn-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Why FileVault?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Bank-Grade Security</h3>
            <p>Your files are encrypted end-to-end and always safe from prying eyes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Access</h3>
            <p>Upload, organize, and retrieve files in seconds without delay.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Seamless Collaboration</h3>
            <p>Share files with your team and collaborate securely in real time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Access Anywhere</h3>
            <p>Your vault is available on any device, wherever you are.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Take Control of Your Files</h2>
        <p>Join thousands who trust FileVault to protect and simplify their digital life.</p>
        <Link to="/signup" className="cta-btn">Get Started Free</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-logo">FileVault</div>
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FileVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}