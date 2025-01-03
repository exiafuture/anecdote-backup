"use client";
import React from "react"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import "./auth.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { validatePassword } from '@/utils/validationPassword';

interface AuthFormData {
  username?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

const AuthPage: React.FC = () => {
  const [view, setView] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const { user, login, register } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (view === "signup") {
      if (formData.password !== formData.password_confirmation) {
        setErrorMessage("Passwords do not match");
        return;
      }
      if (!validatePassword(formData.password)) {
        setErrorMessage(
          'Password must be at least 7 characters long, with at least one uppercase and one lowercase letter.');
        return;
      }
      try {
        await register(formData.username!, formData.email, formData.password, 1);
        router.push('/profile'); // Redirect to profile on success
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage("Registration failed. Try again.");
      }
    } else {
      try {
        await login(formData.email, formData.password);
        router.push('/profile'); // Redirect to profile on success
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("Login failed. Check your credentials.");
      }
    }
  };

  useEffect(()=>{
    if(user) {
      router.push("/profile");
    }
  },[user,router]);

  return (
    <div className="creator-page">
      <header className="creator-header">
        <h1>Anecdote</h1>
        <p>Come on and earn from new ideas</p>
{/* 
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
        </div> */}
      </header>

      <section className="creator-card">
        <div className="role-toggle">
          <p className={`rbtn ${view === "login" ? "active" : "inactive"}`}
            onClick={() => setView("login")}>
            Login
          </p>
          <p className="ororor">/</p>
          <p
            className={`rbtn ${view === "signup" ? "active" : "inactive"}`}
            onClick={() => setView("signup")}
          >
            Register
          </p>
        </div>
        <form className="checkin" onSubmit={handleSubmit}>
          {view === 'signup' && (
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
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
        {errorMessage && (<p>${errorMessage}</p>)}
      </section>
    </div>
  );
}

export default AuthPage;
