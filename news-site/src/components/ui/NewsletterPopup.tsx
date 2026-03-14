"use client";

import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";

export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    const dismissed = localStorage.getItem("newsletter_dismissed");
    if (dismissed) return;

    // Show after 30 seconds of browsing
    const timer = setTimeout(() => setShow(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("newsletter_dismissed", Date.now().toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // In a real app, this would POST to an API
    setSubmitted(true);
    localStorage.setItem("newsletter_dismissed", "subscribed");
    setTimeout(() => setShow(false), 2500);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDismiss} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[var(--background)] border border-[var(--border)] shadow-2xl p-8">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[var(--surface)] text-muted"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Mail size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold">You&apos;re subscribed!</h3>
            <p className="text-muted mt-2">Check your inbox for a confirmation email.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Mail size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold">Stay Informed</h3>
              <p className="text-muted mt-2 text-sm">
                Get breaking news and daily highlights delivered straight to your inbox. No spam, unsubscribe anytime.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-center text-xs text-muted mt-3">
              By subscribing, you agree to our privacy policy.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
