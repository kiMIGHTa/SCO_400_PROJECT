// OrderStatus.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetails } from '@/apiUtils/order';
import './OrderStatus.css';

const OrderStatus = () => {
  const { orderId } = useParams(); // Get order ID from URL
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

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="order-status">
      <h2>Order Status</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Price:</strong> KES {order.total_price}</p>
      <p><strong>Delivery Address:</strong> {order.street}, {order.city}, {order.region}</p>
      <p><strong>Phone:</strong> {order.phone_number}</p>
    </div>
  );
};

export default OrderStatus;

