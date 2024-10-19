"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on initial load (e.g., check local storage)
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt.decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem('token');
        setUser(null);
      } else {
        setUser(decodedToken);
      }
    }
    console.log(user);
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/register', 
        { username, email, password });
      if (res.status === 201) {
        const { token } = res.data; // Get the token from the response
        localStorage.setItem('token', token); // Store JWT in local storage
        setUser(jwt.decode(token)); // Decode the token and set user state
        router.push('/profile'); // Redirect after successful registration
      }
      console.log('Registration successful', res.data);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Login function to handle user login
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token } = res.data; // Get the token from the response
      localStorage.setItem('token', token); // Store JWT in local storage
      setUser(jwt.decode(token)); // Decode the token and set user state
      router.push('/profile'); // Redirect after successful login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Logout function to clear the token
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token'); // Clear token from local storage
      setUser(null);
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

      await axios.delete("/api/auth/quit", {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass JWT token in the request headers
        },
      });
      
      // Account successfully deleted
      localStorage.removeItem("token"); // Clear token from local storage
      setUser(null); // Clear user state
      router.push("/auth"); // Redirect to auth page after deletion
    } catch (error) {
      console.error("Delete account error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated: !!user, 
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
