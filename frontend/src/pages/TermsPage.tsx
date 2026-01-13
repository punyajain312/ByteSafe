// src/pages/TermsPage.tsx
import { Link } from "react-router-dom";
import "./styles/LegalPages.css";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <h1>Terms of Service</h1>
        <p className="legal-sub">Effective: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="legal-section">
        <h2>Acceptance</h2>
        <p>
          By using ByteSafe you agree to these Terms. Please do not use the
          service if you disagree.
        </p>
      </section>

      <section className="legal-section">
        <h2>Account Responsibilities</h2>
        <p>
          You are responsible for keeping your credentials secure and for
          any actions taken from your account. Do not share illegal content.
        </p>
      </section>

      <section className="legal-section">
        <h2>Content & Storage</h2>
        <p>
          You retain ownership of your files. ByteSafe provides storage and
          related features under these Terms. We may remove content that
          violates policies or law.
        </p>
      </section>

      <section className="legal-section">
        <h2>Limitation of Liability</h2>
        <p>
          ByteSafe will make reasonable efforts to keep the service available
          but is not liable for data loss except as separately agreed in writing.
        </p>
      </section>

      <footer className="legal-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </main>
  );
}