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
          <Link href="/terms-and-privacy" className="footer-nav-link">Terms and Privacy</Link>
        </div>

        <div className="footer-rights">© {currentYear} Ancedote. All rights reserved.</div>
      </div>

      <div className="footer-nav-links">
        <Link href="/" className="footer-nav-link">Home</Link>
        <Link href="/services" className="footer-nav-link">Services</Link>
        <Link href="/pricing-plans" className="footer-nav-link">Pricing</Link>
        <Link href="/about" className="footer-nav-link">About</Link>
        <Link href="/contact" className="footer-nav-link">Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;

