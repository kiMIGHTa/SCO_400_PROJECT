import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Navbar from './components/Navbar/navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home.jsx'
import Cart from './pages/Cart/cart.jsx'
import PlaceOrder from './pages/PlaceOrder/placeOrder.jsx'
import Footer from './components/Footer/Footer.jsx'
import LoginPopUp from './components/LoginPopUp/LoginPopUp.jsx'
import Restaurant from './pages/Restaurant/restaurant'
import RestaurantMenu from './pages/RestaurantMenu/RestaurantMenu'

function App() {

  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
    return () => (document.body.style.overflow = "auto"); // Clean up on unmount
  }, [showLogin]);


  return (
    <>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/placeOrder' element={<PlaceOrder />} />
          <Route path="/restaurants" element={<Restaurant />} />
          <Route path="/restaurants/:restaurantId" element={<RestaurantMenu />} />
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App
