"use client";
import React from "react";
import "./about.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <section className="intro-section">
        <h1>About Us</h1>
        <p>
          Anecdote dedicates to provide exceptional 
          services and creating innovative solutions for our users. 
          Our journey is driven by a commitment to excellence, 
          creativity, and customer satisfaction.
        </p>
      </section>

      <section className="mission-vision-section">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            To empower creators and investors through our platform, 
            helping them connect and collaborate in a secure, 
            seamless, and rewarding environment.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            To be the leading platform for transformative content 
            and impactful partnerships, where creativity and 
            innovation meet meaningful investment.
          </p>
        </div>
      </section>

      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src="" alt="Team Member 1" />
            <h3>Member 1</h3>
            <p>CEO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 2" />
            <h3>Member 2</h3>
            <p>CTO</p>
          </div>
          <div className="team-member">
            <img src="" alt="Team Member 3" />
            <h3>Member 3</h3>
            <p>Head of Marketing</p>
          </div>
        </div>
      </section>

      <section className="call-to-action-section">
        <h2>Join Us</h2>
        <p>
          We invite you to be part of our community 
          and join us on our mission to revolutionize 
          content creation and investment.
        </p>
        <button className="cta-button">Get in Touch</button>
      </section>
    </div>
  );
};

export default AboutPage;
