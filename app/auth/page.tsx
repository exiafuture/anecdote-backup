"use client";
import React from "react"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from "axios";
import "./auth.css";
import { useRouter } from "next/navigation";

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

const AuthPage = () => {
  const [view, setView] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState<string>('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      if (view === 'signup') {
        const response = await axios.post('', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
        }, { withCredentials: true });
        console.log(`sign up response on axios: ${formData.name} ${formData.email}`);
        setMessage(response.data.message || 'Registration successful!');
        console.log(`sign up msg: ${message}`);
      } else {
        const response = await axios.post('', {
            email: formData.email,
            password: formData.password,
        }, { withCredentials: true });
        console.log(`sign in response on axios: ${formData.email}`);
        setMessage(response.data.message["email"] || 'Logged in successfully!');
        console.log(`sign in msg: ${message}`);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
      console.log(`authentication error: ${error.response?.data?.error}`);
    }
  };

  return (
    <div className="creator-page">
      <header className="creator-header">
        <h1>Anecdote</h1>
        <p>Come on and earn from new ideas</p>

        <div className="creator-toggle-assistance">
          <button className={view === "login" ? "active" : "inactive"}
            onClick={() => setView("login")}>
            Login
          </button>
          <button
            className={view === "signup" ? "active" : "inactive"}
            onClick={() => setView("signup")}
          >
            Sign Up
          </button>
        </div>
      </header>

      <section className="creator-card">
        {view === "signup" ? (
          <p>Register</p>
        ):(
          <p>Login</p>
        )}
        <form onSubmit={handleSubmit} className="checkin">
          {view === 'signup' && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required={view === 'signup'}
              />
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {view === 'signup' && (
            <div>
              <input
                  type="password"
                  name="password_confirmation"
                  placeholder="Confirm Password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required={view === 'signup'}
              />
            </div>
          )}
          <button type="submit">{view === 'signup' ? 'Signup' : 'Login'}</button>
        </form>
      </section>
    </div>
  );
}

export default AuthPage;
