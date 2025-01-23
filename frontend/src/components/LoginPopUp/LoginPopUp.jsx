import React, { useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'

const LoginPopUp = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState('Login')

  return (
    <div className='login-pop-up'>
      <form className="login-content">
        <div className="login-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === 'Login' ? <></> : <input type="text" placeholder='Name' />}
          <input type="email" placeholder='email' required />
          <input type="password" placeholder='password' required />
        </div>
        <button>{currState === 'Sign Up' ? 'Create Your Account' : 'Log in to your account'}</button>
        <div className="login-terms-and-conditions">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and conditions of use and privacy policy.</p>
        </div>
        {currState === 'Login' ? <p>Create a new account? <span onClick={()=>setCurrState('Sign Up')}>Click here</span></p> : <p>Already have an account? <span onClick={()=>setCurrState('Login')}>Log in.</span></p>}
      </form>
    </div>
  )
}

export default LoginPopUp
