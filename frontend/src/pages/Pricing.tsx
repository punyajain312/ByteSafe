// src/pages/PricingPage.tsx
import { Link } from "react-router-dom";
import "./styles/LegalPages.css";

export default function PricingPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <h1>Pricing</h1>
        <p className="legal-sub">Simple and transparent</p>
      </header>

      <section className="legal-section">
        <p>
          ByteSafe currently offers free storage during early access.
          Paid plans will be announced later.
        </p>
      </section>

      <footer className="legal-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </main>
  );
}