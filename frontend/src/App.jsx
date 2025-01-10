import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Navbar from './components/Navbar/navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home.jsx'
import Cart from './pages/Cart/cart.jsx'
import placeOrder from './pages/PlaceOrder/placeOrder.jsx'
function App() {  
  return (
    <div className='app'>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/placeOrder' element={<placeOrder/>} />
    </Routes>
    </div>
  )
}

export default App
