"use client";
import "./footer.css";
import Link from 'next/link';
import React from 'react';

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-company">
        <div className="footer-logo-section">
          <img src="/images/logo.png" alt="Logo" className="footer-logo" />
          <span className="footer-brand">Ancedote</span>
        </div>

        <div className="footer-terms">
          <Link href="/terms" className="footer-nav-link">Terms</Link>
          <Link href="/privacy" className="footer-nav-link">Privacy</Link>
        </div>

        <div className="footer-rights">© {currentYear} Ancedote. All rights reserved.</div>
      </div>

      <div className="footer-nav-links">
        <Link href="/" className="footer-nav-link">Home</Link>
        <Link href="/pool" className="footer-nav-link">Ideas</Link>
        <Link href="/say-it" className="footer-nav-link">SayIt</Link>
        <Link href="/inker" className="footer-nav-link">Stories</Link>
        <Link href="/pricing-plans" className="footer-nav-link">Pricing</Link>
        <Link href="/about" className="footer-nav-link">About</Link>
      </div>
    </footer>
  );
};

export default Footer;

