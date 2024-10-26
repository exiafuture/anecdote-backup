"use client";
import Link from "next/link";
import "./home.css";
import React from "react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Home() {
  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Transform Your Experience</h1>
          <p className="hero-subtitle">
            Join a vibrant community and discover content that matters.
          </p>
          <div className="hero-buttons">
            <button className="hero-button primary">
              <Link href="/auth">
                Get Started
              </Link>
            </button>
            <button className="hero-button secondary">
              <Link href="/pricing-plans">
                Learn More
              </Link>
            </button>
          </div>
        </div>
      </section>

      <section className="media-player-section">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=MgsddFEe9Oc" 
          // Replace with actual video URL
          width="100%"
          height="100%"
          controls
          className="media-player"
        />
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <img src="/icons/feature1.svg" alt="Feature 1" />
            <h3>Feature One</h3>
            <p>Engage with unique content tailored just for you.</p>
          </div>
          <div className="feature">
            <img src="/icons/feature2.svg" alt="Feature 2" />
            <h3>Feature Two</h3>
            <p>Enjoy smooth playback and easy navigation.</p>
          </div>
          <div className="feature">
            <img src="/icons/feature3.svg" alt="Feature 3" />
            <h3>Feature Three</h3>
            <p>Connect with others and grow your network.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Join?</h2>
        <button className="cta-button">
          <Link href="/auth">
            Sign Up Now
          </Link>
        </button>
      </section>
    </main>
  );
}
