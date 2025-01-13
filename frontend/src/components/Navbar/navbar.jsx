import React, { useState } from 'react'
import './navbar.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'

const Navbar = () => {

  const [navSelect, setNavSelect] = useState("home")


  return (
    <div className="navbar">
      <img src={assets.logo} alt="logo" className='logo'/>
      <ul className="navbar-list">
        <li onClick={()=> setNavSelect("home")} className={navSelect==="home"?"active":""}>home</li>
        <li onClick={()=> setNavSelect("menu")} className={navSelect==="menu"?"active":""}>menu</li>
        <li onClick={()=> setNavSelect("mobile app")} className={navSelect==="mobile app"?"active":""}>mobile app</li>
        <li onClick={()=> setNavSelect("contact us")} className={navSelect==="contact us"?"active":""}>contact us</li>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt='Search'/>
        <div className='navbar-basket-icon'>
          <img src={assets.basket_icon} alt='Basket'/>
          <div className="dot"></div>
        </div>
        <button>sign in</button>
      </div>
    </div>
  )
}

export default Navbar
