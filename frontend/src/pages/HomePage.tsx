import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/HomePage.css";

const FEATURES: string[] = [
  "Bank-Grade Secure File Storage",
  "Lightning-Fast Uploads & Downloads",
  "Private & Public File Sharing",
  "Access Anywhere, Anytime",
];

const HomePage: React.FC = () => {
  const [typedText, setTypedText] = useState<string>("");
  const [featureIndex, setFeatureIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const currentFeature = FEATURES[featureIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < currentFeature.length) {
      timeout = setTimeout(() => {
        setTypedText(currentFeature.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 80);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setTypedText(currentFeature.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 40);
    } else if (!isDeleting && charIndex === currentFeature.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setFeatureIndex((prev) => (prev + 1) % FEATURES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, featureIndex]);

  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">ByteSafe</div>
        <div>
          <Link to="/login" className="nav-btn">
            Login
          </Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          {/* Left Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              Your Secure <span className="brand">ByteSafe</span>
            </h1>

            <h2 className="typing-text">
              {typedText}
              <span className="cursor">|</span>
            </h2>

            <p className="hero-subtext">
              Store, manage, and share your files with enterprise-grade security
              and lightning-fast access — anywhere, anytime.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="hero-btn">
                Create Free Account
              </Link>
              <Link to="/login" className="hero-btn-secondary">
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hero-image">
            <img
              src="/images/image.png"
              alt="Secure file storage illustration"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="features-title">Why ByteSafe?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Bank-Grade Security</h3>
            <p>Your files are encrypted end-to-end.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">♻️</span>
            <h3>Smart Storage Optimization</h3>
            <p>
              Duplicate detection and intelligent file management.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Fast Performance</h3>
            <p>Upload and download without delays.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🤝</span>
            <h3>Easy Sharing</h3>
            <p>Control public and private access easily.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🌍</span>
            <h3>Access Anywhere</h3>
            <p>Available across all devices.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Usage Insights</h3>
            <p>
              Track file access, downloads, and storage usage with clear,
              real-time insights.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Take Control of Your Files</h2>
        <p>
          Join thousands who trust ByteSafe to protect and simplify their digital
          life.
        </p>
        <Link to="/signup" className="cta-btn">
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">

          {/* Brand */}
          <div className="footer-brand">
            <h3>ByteSafe</h3>
            <p>
              Secure, private, and lightning-fast file storage built
              for modern workflows.
            </p>
          </div>

          {/* Links */}
          <div className="footer-columns">

            <div className="footer-column">
              <h4>Product</h4>
              <a href="/">Features</a>
              <a href="/security">Security</a>
              <a href="/pricing">Pricing</a>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/careers">Careers</a>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ByteSafe. All rights reserved.</span>
          <span className="footer-tagline">Built with security in mind</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;