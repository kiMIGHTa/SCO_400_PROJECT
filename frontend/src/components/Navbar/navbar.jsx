import React, { useState, useEffect, useContext } from 'react'
import './navbar.css'
import { assets } from '../../../../downloads/assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { FiMenu, FiX } from "react-icons/fi"; // Import icons
import accountApis from '@/apiUtils/account'



const Navbar = ({ setShowLogin }) => {

  const [navSelect, setNavSelect] = useState("home")
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const { getTotalCartAmount } = useContext(StoreContext)


  const isLoggedIn = !!localStorage.getItem("accessToken");

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

  const handleLogout = async () => {
    console.log("Logout button clicked"); // Debugging log
    try {
      await accountApis.logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  
  


  return (
    <div className={`navbar ${isNavbarVisible ? "visible" : "hidden"}`}>
      <Link to='/'><img src={assets.logo} alt="logo" className='logo' /></Link>
      <ul className="navbar-list">
        <Link to='/' onClick={() => setNavSelect("home")} className={navSelect === "home" ? "active" : ""}>home</Link>
        <a href='#explore-page' onClick={() => setNavSelect("menu")} className={navSelect === "menu" ? "active" : ""}>menu</a>
        <a href='' onClick={() => setNavSelect("mobile app")} className={navSelect === "mobile app" ? "active" : ""}>mobile app</a>
        <a href='#footer' onClick={() => setNavSelect("contact us")} className={navSelect === "contact us" ? "active" : ""}>contact us</a>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt='Search' />
        <div className='navbar-basket-icon'>
          <Link to='/cart'><img src={assets.basket_icon} alt='Basket' /></Link>
          <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
        </div>

        {/* Show Sign In if not logged in, else show Profile */}
        {!isLoggedIn ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="hamburger-menu" onClick={() => setIsSidebarOpen(true)}>
            <FiMenu size={30} /> {/* React Icons hamburger */}
          </div>
        )}
      </div>


      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
          <FiX size={30} /> {/* Close icon */}
        </button>
        <button onClick={() => { navigate("/profile"); setIsSidebarOpen(false); }}>Profile</button>
        <button onClick={handleLogout}>Logout</button>
        </div>

      {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}

    </div >
  )
}

export default Navbar
