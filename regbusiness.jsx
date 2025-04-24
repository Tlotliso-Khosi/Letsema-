import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/registration.css';

export default function BusinessRegistrationPage() {
  const [name, setBusinessName] = useState("");
  const [interest_rate, setInterestRate] = useState("");
  const [licenseID, setLicenseId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL = 'http://192.2.42.176:8000/api/mfi/register/'; 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    const registrationData = {
      name,
      interest_rate: parseFloat(interest_rate),
      licenseID,
      email,
      password,
    };

    console.log("Sending business registration data to API:", registrationData);
    
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })
    .then(response => {
      if (!response.ok) {
        return Promise.reject('Failed to register: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Business registration successful:", data);
      navigate("/");
    })
    .catch(error => {
      console.error('Error:', error);
      setErrorMessage("Registration failed. Please try again.");
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordsMatch(value === confirmPassword);
    if (value === confirmPassword) {
      setErrorMessage("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(password === value);
    if (password === value) {
      setErrorMessage("");
    }
  };

  return (
    <div className="registration-page">
      <div className="body">
        <div className="registration-container">
          <div className="form-header">
            <h3>Register Your Business</h3>
          </div>
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Business Name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  value={interest_rate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Interest Rate (%)"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={licenseID}
                  onChange={(e) => setLicenseId(e.target.value)}
                  required
                  className="input-field"
                  placeholder="License ID"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="Business Email"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="input-field"
                  placeholder="Password"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className="input-field"
                  placeholder="Confirm Password"
                />
                {!passwordsMatch && (
                  <span className="password-error">Passwords don't match</span>
                )}
              </div>
            </div>

            <button type="submit" className="submit-button">
              Register Business
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}