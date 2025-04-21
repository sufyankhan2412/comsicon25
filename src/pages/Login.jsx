// Login.js
import React, { useState, useContext } from 'react'; // Added useContext import
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Debug: log current values
    console.log('Submitting:', { email, password, role });

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Login failed');

      // Use the login function from AuthContext to update state
      login(data.user, data.token);

      // Redirect based on role
      if (data.role === 'manager') {
        navigate('/manager-dashboard');
      } else if (data.role === 'team-member') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      alert(err.message);
    }
  };

  const handleAppleLogin = () => {
    console.log('Login with Apple clicked');
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google clicked');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="form-container">
      <p className="title">Welcome back</p>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <select
          className="input"
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="team-member">Team Member</option>
          <option value="manager">Manager</option>
        </select>

        <p className="page-link">
          <span className="page-link-label" onClick={handleForgotPassword}>
            Forgot Password?
          </span>
        </p>
        <button type="submit" className="form-btn">Log in</button>
      </form>

      <p className="sign-up-label">
        Don't have an account?
        <span className="sign-up-link" onClick={handleSignUp}>Sign up</span>
      </p>

      <div className="buttons-container">
        <div className="apple-login-button" onClick={handleAppleLogin}>
          {/* Apple SVG */}
          <span>Log in with Apple</span>
        </div>
        <div className="google-login-button" onClick={handleGoogleLogin}>
          {/* Google SVG */}
          <span>Log in with Google</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
