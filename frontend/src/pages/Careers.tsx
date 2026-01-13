// src/pages/CareersPage.tsx
import { Link } from "react-router-dom";
import "./styles/LegalPages.css";

export default function CareersPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <h1>Careers</h1>
        <p className="legal-sub">Build secure technology with us</p>
      </header>

      <section className="legal-section">
        <p>
          We are currently a small team. Open positions will be posted here when
          available.
        </p>
      </section>

      <footer className="legal-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </main>
  );
}