import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Customer_URL } from "./AllURLs"
import "../../Styles/RegistrationForm.css";
import AuthenticateApi from '../../API/AuthenticateApi';

const RegistrationForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();


  // Registration Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(Customer_URL)
      .then((response) => {
        console.log("Fetched customers:", response.data);
        setCustomers(response.data);
      })
      .catch((err) => console.error("Error fetching customers:", err));
  }, [formData]);


  // Handle Registration
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Registration handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match!");
      return;
    }

    if (!formData.termsAccepted) {
      toast("Please accept the terms and conditions.");
      return;
    }

    try {
      const response = await AuthenticateApi.registerByEmail({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        // Include additional fields as needed (phone, gender, etc.)
      });
      console.log("Registration successful:", response);
      toast("Registration successful! Please log in.");
      setActiveTab('login');
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast("Registration failed: " + (error.response?.data || error.message));
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast("Please enter both email and password.");
      return;
    }

    try {
      const response = await AuthenticateApi.loginByEmail(email, password);
      console.log("Login successful:", response);
      toast("Login successful!");
      localStorage.setItem('CustomerInfo', JSON.stringify(response));
      localStorage.setItem('IsloggedInUser', true);

      // Navigate to dashboard page
      navigate('/customer');

    } catch (error) {
      console.error("Login failed:", error);
      toast("Login failed: " + (error.response?.data || error.message));
    }
  };


  return (
    <div className='registrationform-container'>
      <div className="auth-container">
        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`tab-link ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
            Login
          </button>
          <button className={`tab-link ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
            Register
          </button>
        </div>

        {/* Tab Content */}
        <div className="auth-content">
          {activeTab === 'login' ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={error}
              shake={shake}
              handleLogin={handleLogin}
            />
          ) : (
            <RegisterForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

// Login Form
const LoginForm = ({ email, setEmail, password, setPassword, error, shake, handleLogin }) => (
  <form className="auth-form" onSubmit={handleLogin}>
    {error && <p className={`error-message ${shake ? "shake" : ""}`}>{error}</p>}
    <input
      className="input-field"
      type="email"
      placeholder="Email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <input
      className="input-field"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <div className="auth-options">
      <label>
        <input type="checkbox" /> Remember me
      </label>
      <a href="#!">Forgot password?</a>
    </div>
    <button className="auth-btn" type="submit">
      Sign in
    </button>
  </form>
);


// Register Form
const RegisterForm = ({ formData, handleChange, handleSubmit }) => (
  <form className="auth-form" onSubmit={handleSubmit}>
    <input
      className="input-field"
      type="text"
      name="username"
      value={formData.username}
      placeholder="Username"
      onChange={handleChange}
      required
    />
    <input
      className="input-field"
      type="email"
      name="email"
      value={formData.email}
      placeholder="Email"
      onChange={handleChange}
      required
    />
    <input
      className="input-field"
      type="password"
      name="password"
      value={formData.password}
      placeholder="Password"
      onChange={handleChange}
      required
    />
    <input
      className="input-field"
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      placeholder="Confirm Password"
      onChange={handleChange}
      required
    />
    <div className="auth-options">
      <label>
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
        />
        I have read and agree to the terms
      </label>
    </div>
    <button className="auth-btn" type="submit">Sign up</button>
  </form>
);

export default RegistrationForm;
