
import React, { useState } from 'react';
import './Register.css';
import { supabase } from './supabaseClient.js';

export default function Register({ onBackToLogin, onRegister }) {
  const [form, setForm] = useState({
    fullName: '',
    department: 'IT Department',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (form.password.length < 8) {
    setError('Password must be at least 8 characters long.');
    return;
  }

  if (form.password !== form.confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  if (!form.fullName.trim() || !form.department || !form.email.trim()) {
    setError('Please complete all required fields.');
    return;
  }

  setLoading(true);

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          department: form.department,
          role: 'department',
        },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    if (data.user) {
      alert(
        data.session
          ? 'Account created successfully! You can now log in.'
          : 'Account created. Please check your email for a confirmation link before logging in.'
      );

      onBackToLogin();
    }
  } catch (err) {
    setError(err.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">
          <div className="register-logo-icon">📁</div>
          <h1>File.org</h1>
        </div>

        <p className="register-subtitle">
          Department Account Registration
        </p>

        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="IT Department">IT Department</option>
              <option value="HR Department">HR Department</option>
              <option value="Finance Department">Finance Department</option>
              <option value="Marketing Department">Marketing Department</option>
              <option value="Operations Department">Operations Department</option>
            </select>
          </div>

          <div className="register-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your department email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account?</p>
          <button
            type="button"
            className="register-back-button"
            onClick={onBackToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
