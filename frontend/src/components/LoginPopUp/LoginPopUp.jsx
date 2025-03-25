//LoginPopUp.jsx
import React, { useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../../downloads/assets/frontend_assets/assets'
import accountApis from '../../apiUtils/account'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const LoginPopUp = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState('Login')
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    password: "",
  })

  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await accountApis.login(credentials);
      console.log("Login Successful:", response);
      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => {
        setShowLogin(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error || "Login failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        first_name: credentials.firstName,  // Convert camelCase to snake_case
        last_name: credentials.lastName,
        contact: credentials.contact,
        email: credentials.email,
        password: credentials.password
    };

    const response = await accountApis.register(formattedData);
    console.log("Registration Successful:", response);
    toast.success("Account created! Please log in.");
    setCurrState("Login"); // Switch to login view
    } catch (error) {
      toast.error(error || "Registration failed. Please try again.");
    }
  };



  return (
    <div className='login-pop-up'>
      {/* <form className="login-content" onSubmit={handleLogin}> */}
      <ToastContainer position="top-right" theme="colored" />
      <form className="login-content" onSubmit={currState === "Login" ? handleLogin : handleRegister}>
        <div className="login-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === 'Login'
            ? <></> :
            <>
              <input type="text" placeholder='First Name' required
                value={credentials.firstName}
                onChange={(e) => setCredentials({ ...credentials, firstName: e.target.value })} />
              <input type="text" placeholder='Last Name' required
                value={credentials.lastName}
                onChange={(e) => setCredentials({ ...credentials, lastName: e.target.value })} />
              <input type="text" placeholder='Contact (254xxxxxxxxx)' required
                value={credentials.contact}
                onChange={(e) => setCredentials({ ...credentials, contact: e.target.value })} />
            </>}
          <input
            type="email"
            placeholder='email'
            required
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
          <input
            type="password"
            placeholder='password'
            required
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
        </div>
        <button type="submit">{currState === 'Sign Up' ? 'Create Your Account' : 'Log in to your account'}</button>
        <div className="login-terms-and-conditions">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and conditions of use and privacy policy.</p>
        </div>
        {currState === 'Login' ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p> : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Log in.</span></p>}
      </form>
    </div>
  )
}

export default LoginPopUp


