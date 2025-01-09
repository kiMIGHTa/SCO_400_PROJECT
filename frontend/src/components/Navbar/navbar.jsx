import React from 'react'
import './navbar.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={assets.logo} alt="logo" />
      Hello world!
    </div>
  )
}

export default Navbar
