import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Default to 'client'
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // API endpoints configuration
  const API_BASE_URL = 'http://192.2.42.176:8000/api';
  const API_ENDPOINTS = {
    client: `${API_BASE_URL}/borrowers/login/`,
    business: `${API_BASE_URL}/mfi/login/` // Assuming this is your business endpoint
  };
  const REFRESH_URL = `${API_BASE_URL}/token/refresh/`;

  // Store tokens securely
  const storeTokens = (tokenData) => {
    localStorage.setItem('access_token', tokenData.access);
    localStorage.setItem('refresh_token', tokenData.refresh);
    localStorage.setItem('user_role', role); // Store the user's role
  };

  // Handle token refresh
  const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    storeTokens(data);
    return data.access;
  };

  // Main login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Determine the appropriate endpoint based on role
      const loginEndpoint = API_ENDPOINTS[role];
      
      if (!loginEndpoint) {
        throw new Error('Invalid role selected');
      }

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error cases
        if (response.status === 401) {
          throw new Error(data.detail || "Invalid email or password");
        } else if (response.status === 400) {
          const errorMsg = data.email?.[0] || 
                          data.password?.[0] || 
                          data.non_field_errors?.[0] || 
                          "Invalid request format";
          throw new Error(errorMsg);
        }
        throw new Error(data.detail || "Login failed");
      }

      // Verify we received proper tokens
      if (!data.access || !data.refresh) {
        throw new Error("Authentication data incomplete");
      }

      storeTokens(data);
      
      // Redirect based on role
      navigate(role === 'business' ? '/business' : '/client');

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message);
      // Clear any existing tokens on error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSignUp = () => {
    // Clear any existing tokens when navigating to registration
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/registration');
  };

  const handleBusinessSignUp = () => {
    // Clear any existing tokens when navigating to registration
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/regbusiness');
  };

  return (
    <div className="body">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">🌱 Letsema</div>
          <h1>Letsema MicroFinance</h1>
        </div>
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Role selection dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
            className="role-select"
          >
            <option value="client">Client</option>
            <option value="business">Business</option>
          </select>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="signup-buttons-container">
            <button 
              type="button" 
              onClick={handleClientSignUp} 
              className="signup-button client"
              disabled={isLoading}
            >
              Sign Up as Client
            </button>
            <button 
              type="button" 
              onClick={handleBusinessSignUp} 
              className="signup-button business"
              disabled={isLoading}
            >
              Sign Up as Business
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;