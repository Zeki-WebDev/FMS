import React, { useState } from 'react';
import './Login.css';
import { supabase } from './supabaseClient.js';

export default function Login({ onLogin, onShowRegister }) {
  const [accountType, setAccountType] = useState('Admin');
  const [department, setDepartment] = useState('Administration');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Demo login accounts
    const accounts = {
      Admin: {
        username: 'admin',
        password: 'admin123',
        department: 'Administration',
      },
      Department: {
        username: 'department',
        password: 'dept123',
        department: department,
      },
    };

    const account = accounts[accountType];

    if (
      username === account.username &&
      password === account.password
    ) {
      setError('');

      // Send login information back to App.jsx
      onLogin({
        accountType,
        username,
        department:
          accountType === 'Admin'
            ? 'Administration'
            : department,
      });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LOGO */}
        <div className="login-logo">
          <div className="logo-icon">📁</div>
          <h1>File.org</h1>
        </div>

        <p className="login-subtitle">
          File Management System
        </p>

        <form onSubmit={handleLogin}>

          {/* ACCOUNT TYPE */}
          <div className="form-group">
            <label>Account Type</label>

            <select
              value={accountType}
              onChange={(e) => {
                setAccountType(e.target.value);
                setError('');
              }}
            >
              <option value="Admin">Administrator</option>
              <option value="Department">Department</option>
            </select>
          </div>

          {/* DEPARTMENT */}
          {accountType === 'Department' && (
            <div className="form-group">
              <label>Department</label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="IT Department">
                  IT Department
                </option>

                <option value="HR Department">
                  HR Department
                </option>

                <option value="Finance Department">
                  Finance Department
                </option>

                <option value="Marketing Department">
                  Marketing Department
                </option>

                <option value="Operations Department">
                  Operations Department
                </option>
              </select>
            </div>
          )}

          {/* USERNAME */}
          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-button"
          >
            LOGIN
          </button>
          
           <div className="register-link">
           <p>Don't have a department account?</p>
          <button
           type="button"
           className="register-link-button"
           onClick={() => {
           if (onShowRegister) {
           onShowRegister();
         }
         }}
         >
         Register here
         </button>
         </div>

         </form>

         <div className="login-footer">
          <p>File.org File Management System</p>
         </div>

      </div>
    </div>
  );
}