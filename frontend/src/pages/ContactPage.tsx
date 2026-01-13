// src/pages/ContactPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/LegalPages.css";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This form is a UI-only example. Replace with API call when ready.
    console.log({ name, email, message });
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="legal-page">
      <header className="legal-header">
        <h1>Contact ByteSafe</h1>
        <p className="legal-sub">We’d love to help — drop us a note.</p>
      </header>

      <section className="legal-section contact-form-wrapper">
        {sent ? (
          <div className="contact-sent">
            <p>Thanks — your message has been recorded. We will get back to you soon.</p>
            <Link to="/">Return Home</Link>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              <span>Message</span>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={6}
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="hero-btn">Send Message</button>
            </div>

            <p className="contact-alt">
              Or email us directly at <a href="mailto:support@bytesafe.example">support@bytesafe.example</a>
            </p>
          </form>
        )}
      </section>

      <footer className="legal-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </main>
  );
}