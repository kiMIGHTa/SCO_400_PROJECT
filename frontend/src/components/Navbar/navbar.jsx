import React, { useState, useEffect, useContext } from 'react'
import './navbar.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'


const Navbar = ({setShowLogin}) => {

  const [navSelect, setNavSelect] = useState("home")
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { getTotalCartAmount} = useContext(StoreContext)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down, hide the navbar
        setIsNavbarVisible(false);
      } else {
        // Scrolling up or near the top, show the navbar
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  return (
    <div className={`navbar ${isNavbarVisible ? "visible" : "hidden"}`}>
      <Link to='/'><img src={assets.logo} alt="logo" className='logo'/></Link>
      <ul className="navbar-list">
        <Link to='/' onClick={()=> setNavSelect("home")} className={navSelect==="home"?"active":""}>home</Link>
        <a href='#explore-page' onClick={()=> setNavSelect("menu")} className={navSelect==="menu"?"active":""}>menu</a>
        <a href='' onClick={()=> setNavSelect("mobile app")} className={navSelect==="mobile app"?"active":""}>mobile app</a>
        <a href='#footer' onClick={()=> setNavSelect("contact us")} className={navSelect==="contact us"?"active":""}>contact us</a>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt='Search'/>
        <div className='navbar-basket-icon'>
          <Link to='/cart'><img src={assets.basket_icon} alt='Basket'/></Link>
          <div className={getTotalCartAmount()===0?'':'dot'}></div>
        </div>
        <button onClick={()=>setShowLogin(true)}>sign in</button>
      </div>
    </div>
  )
}

export default Navbar
