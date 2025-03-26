// OrderStatus.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, completeOrder } from '@/apiUtils/order';
import './OrderStatus.css';

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const orderData = await getOrderDetails(orderId);
        if (!orderData) {
          setError('Order not found. Please check your order ID and try again.');
          return;
        }
        setOrder(orderData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please log in to view your order status.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        if (err.response?.status === 403) {
          setError('You do not have permission to view this order.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        setError('Failed to fetch order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleConfirmDelivery = async () => {
    if (!window.confirm('Are you sure you have received your order?')) {
      return;
    }

    setConfirming(true);
    try {
      await completeOrder(orderId);
      // Refresh order details
      const updatedOrder = await getOrderDetails(orderId);
      setOrder(updatedOrder);
      alert('Delivery confirmed! Thank you for your order.');
    } catch (err) {
      setError('Failed to confirm delivery. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">No order found.</div>;

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
          <p><strong>Total Price:</strong> Ksh {order.total_price}</p>
          <p><strong>Delivery Address:</strong> {order.street}, {order.city}, {order.region}</p>
          <p><strong>Phone:</strong> {order.phone_number}</p>
        </div>

        <div className="order-items">
          <h4>Order Items</h4>
          <ul>
            {order.cart && order.cart.items && order.cart.items.map((item) => (
              <li key={item.id}>
                {item.quantity}x {item?.food?.name || 'Unknown Item'} - Ksh {(item?.food?.price || 0) * (item.quantity || 0)}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-actions">
          {order.status === 'out-for-delivery' && (
            <button
              onClick={handleConfirmDelivery}
              className="confirm-delivery-button"
              disabled={confirming}
            >
              {confirming ? 'Confirming...' : 'Confirm Delivery'}
            </button>
          )}
          <button onClick={handleGoHome} className="home-button">
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;

