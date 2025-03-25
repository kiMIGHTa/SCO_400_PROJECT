import React from 'react'
import './header.css'
import { useNavigate } from 'react-router-dom'
import { getOrders } from '../../apiUtils/order'

const Header = () => {
  const navigate = useNavigate();

  const handleTrackOrder = async () => {
    try {
      const orders = await getOrders();
      if (orders && orders.length > 0) {
        // Navigate to the most recent order's status page
        const mostRecentOrder = orders[0]; // Assuming orders are sorted by date, newest first
        navigate(`/orderStatus/${mostRecentOrder.id}`);
      } else {
        // If no orders, show a message
        alert('You have no orders to track. Place an order first!');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders. Please try again.');
    }
  };

  return (
    <div className='header'>
      <div className='header-content'>
        <h2>Order your food here</h2>
        <p>Choose from a diverse menu chef'd up how you'd like it at home</p>
        <div className="header-buttons">
          <button onClick={() => navigate('/restaurants')}>View Menu</button>
          <button onClick={handleTrackOrder}>Track Order</button>
        </div>
      </div>
    </div>
  )
}

export default Header
