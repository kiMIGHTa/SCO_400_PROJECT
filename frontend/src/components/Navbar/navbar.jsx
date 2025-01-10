import React from 'react'
import './navbar.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={assets.logo} alt="logo" className='logo'/>
      <ul className="navbar-list">
        <li className="navbar-item">home</li>
        <li className="navbar-item">menu</li>
        <li className="navbar-item">mobile app</li>
        <li className="navbar-item">contact us</li>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt='Search'/>
        <div className='navbar-search-icon'>
          <img src={assets.basket_icon} alt='Basket'/>
          <div className="dot"></div>
        </div>
        <button>sign in</button>
      </div>
    </div>
  )
}

export default Navbar
