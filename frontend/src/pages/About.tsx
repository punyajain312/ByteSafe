// src/pages/AboutPage.tsx
import { Link } from "react-router-dom";
import "./styles/LegalPages.css";

export default function AboutPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <h1>About ByteSafe</h1>
        <p className="legal-sub">Privacy-first file storage</p>
      </header>

      <section className="legal-section">
        <p>
          ByteSafe is a secure file storage and sharing platform designed to give
          users full control over their data.
        </p>
      </section>

      <section className="legal-section">
        <p>
          Our mission is to make file storage simple, fast, and private for
          everyone.
        </p>
      </section>

      <footer className="legal-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </main>
  );
}