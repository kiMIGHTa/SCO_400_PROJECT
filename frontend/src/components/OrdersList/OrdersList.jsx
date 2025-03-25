import React, { useState, useEffect } from 'react';
import './OrdersList.css';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/orders/restaurant/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/v1/orders/${orderId}/update-status/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // Refresh orders after successful update
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading orders...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="orders-list">
            <div className="orders-header">
                <h2>Orders Management</h2>
            </div>

            <div className="orders-grid">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
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
                            <p><strong>Total:</strong> ${order.total_price}</p>
                        </div>

                        <div className="order-items">
                            <h4>Order Items:</h4>
                            <ul>
                                {order.cart.items.map((item) => (
                                    <li key={item.id}>
                                        {item.quantity}x {item.food.name} - ${item.food.price * item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="order-actions">
                            <select
                                className="status-select"
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            >
                                <option value="paid-pending">Paid & Pending</option>
                                <option value="processing">Processing</option>
                                <option value="awaiting-pickup">Awaiting Pickup</option>
                                <option value="out-for-delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersList; 