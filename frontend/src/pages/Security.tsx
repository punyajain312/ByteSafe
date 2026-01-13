// src/pages/SecurityPage.tsx
import { Link } from "react-router-dom";
import "./styles/LegalPages.css";

export default function SecurityPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <h1>Security</h1>
        <p className="legal-sub">How we protect your data</p>
      </header>

      <section className="legal-section">
        <p>
          ByteSafe uses encryption, access controls, and secure infrastructure to
          protect your files.
        </p>
      </section>

      <section className="legal-section">
        <p>
          Files are private by default and only accessible by you unless you
          choose to share them.
        </p>
      </section>

      <footer className="legal-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </main>
  );
}