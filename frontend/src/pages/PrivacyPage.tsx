// src/pages/PrivacyPage.tsx
import { Link } from "react-router-dom";
import "./styles/LegalPages.css";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <h1>Privacy Policy</h1>
        <p className="legal-sub">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="legal-section">
        <h2>Overview</h2>
        <p>
          FileVault is committed to protecting your privacy. This policy explains
          what data we collect, why we collect it, and how you can control it.
        </p>
      </section>

      <section className="legal-section">
        <h2>Information We Collect</h2>
        <ul>
          <li>Account information (email, username)</li>
          <li>Files and metadata you upload</li>
          <li>Usage and diagnostic data to improve service</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>How We Use Your Data</h2>
        <p>
          We use your data to provide and improve FileVault, secure your files,
          and communicate important account information. We do not sell your
          personal data.
        </p>
      </section>

      <section className="legal-section">
        <h2>Your Choices</h2>
        <p>
          You can access, update, and delete your account data via your account
          settings. For data removal requests, contact us on the Contact page.
        </p>
      </section>

      <footer className="legal-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </main>
  );
}