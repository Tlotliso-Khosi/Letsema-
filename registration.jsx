import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/registration.css';

export default function RegistrationPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL = 'http://192.2.42.176:8000/api/borrowers/register/';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    const registrationData = {
      name,
      surname,
      email,
      dob,
      gender,
      idNumber,
      address,
      password,
    };

    console.log("Sending registration data to API:", registrationData);
    
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
      console.log("Registration successful:", data);
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
            <h3>Join Our Community</h3>
          </div>
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                  placeholder="First Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Last Name"
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
                placeholder="Email Address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
                className="input-field"
                placeholder="ID Number"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="input-field"
                placeholder="Full Address"
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
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}