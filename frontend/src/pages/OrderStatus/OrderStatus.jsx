// OrderStatus.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, completeOrder } from '@/apiUtils/order';
import './OrderStatus.css';

const OrderStatus = () => {
  const { orderId } = useParams(); // Get order ID from URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const orderData = await getOrderDetails(orderId);
        console.log(orderData);
        setOrder(orderData);
      } catch (err) {
        setError('Failed to fetch order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  const handleConfirmDelivery = async () => {
    try {
      await completeOrder(orderId);
      // Refresh order details after confirming delivery
      const updatedOrder = await getOrderDetails(orderId);
      setOrder(updatedOrder);
    } catch (err) {
      setError('Failed to confirm delivery. Please try again.');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="order-status">
      <h2>Order Status</h2>
      <div className="order-card">
        <div className="order-header">
          <h3>Order #{order.id}</h3>
          <span className={`status-badge ${order.status}`}>
            {order.status}
          </span>
        </div>

        <div className="order-details">
          <p><strong>Customer:</strong> {order.first_name} {order.last_name}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone_number}</p>
          <p><strong>Address:</strong> {order.street}, {order.city}, {order.region}</p>
          <p><strong>Total:</strong> Ksh {order.total_price}</p>
        </div>

        <div className="order-items">
          <h4>Order Items:</h4>
          <ul>
            {order.cart_items && order.cart_items.map((item) => (
              <li key={item.id}>
                {item.quantity}x {item.food_item.name} - Ksh {item.food_item.price * item.quantity}
              </li>
            ))}
            {(!order.cart_items || order.cart_items.length === 0) && (
              <li>No items found</li>
            )}
          </ul>
        </div>

        <div className="order-actions">
          {order.status !== 'delivered' && (
            <button
              className="confirm-delivery-btn"
              onClick={handleConfirmDelivery}
            >
              Confirm Delivery
            </button>
          )}
          <button
            className="go-home-btn"
            onClick={handleGoHome}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;

