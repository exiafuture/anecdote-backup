"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  role: 'creator' | 'financer' | 'unauth';  // Track user's current role or null initially
  setRole: (role: 'creator' | 'financer' | 'unauth') => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string,planId: number) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [role, setRole] = useState<'creator' | 'financer' | 'unauth'>("unauth");

  useEffect(() => {
    // Check if user is authenticated on initial load (e.g., check local storage)
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt.decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem('token');
        setUser(null);
        setRole("unauth");
      } else {
        setUser(decodedToken);
      }
    }
  }, []);

  const register = async (
    username: string, email: string, password: string, planId: number
  ) => {
    if (role==="unauth") {
      console.log("role is not chosen.");
      return
    } else {
      try {
        const res = await axios.post(`/api/auth/${role}/register`, 
          { username, email, password, planId });
        if (res.status === 201) {
          const { token } = res.data; // Get the token from the response
          localStorage.setItem('token', token); // Store JWT in local storage
          setUser(jwt.decode(token)); // Decode the token and set user state
          router.push('/profile'); // Redirect after successful registration
        }
        console.log('Registration successful');
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  // Login function to handle user login
  const login = async (email: string, password: string) => {
    if (role==="unauth") {
      console.log("role is not chosen.");
      return
    } else {
      try {
        const res = await axios.post(`/api/auth/${role}/login`, { email, password });
        localStorage.setItem('token', res.data.token); // Store JWT in local storage
        setUser(jwt.decode(res.data.token));
        router.push('/profile'); // Redirect after successful login
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  // Logout function to clear the token
  const logout = async () => {
    try {
      await axios.post(`/api/auth/${role}/logout`);
      localStorage.removeItem('token'); // Clear token from local storage
      setUser(null);
      setRole("unauth");
      router.push('/auth'); // Redirect to auth page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Delete function to handle account deletion
  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      await axios.delete(`/api/auth/${role}/quit`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass JWT token in the request headers
        },
      });
      
      // Account successfully deleted
      localStorage.removeItem("token"); // Clear token from local storage
      setUser(null); // Clear user state
      setRole("unauth");
      router.push("/"); // Redirect to auth page after deletion
    } catch (error) {
      console.error("Delete account error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated: !!user, 
      role, setRole,
      login, logout, register, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
