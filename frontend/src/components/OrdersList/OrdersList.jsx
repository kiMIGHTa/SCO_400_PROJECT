import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurantOrders, updateOrderStatus } from '../../apiUtils/order';
import './OrdersList.css';

const OrdersList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getRestaurantOrders();
            console.log('Fetched orders:', data); // Debug log
            setOrders(data || []); // Ensure we always have an array
        } catch (err) {
            console.error('Error fetching orders:', err); // Debug log
            if (err.response && err.response.status === 403) {
                setError("You don't have permission to view these orders.");
                navigate('/profile');
                return;
            }
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // Refresh orders after successful update
            fetchOrders();
        } catch (err) {
            console.error('Error updating status:', err); // Debug log
            if (err.response && err.response.status === 403) {
                setError("You don't have permission to update this order.");
                return;
            }
            setError(err.message || 'Failed to update order status');
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
                <h2>Restaurant Orders</h2>
            </div>

            <div className="orders-grid">
                {!orders || orders.length === 0 ? (
                    <div className="no-orders">No orders found.</div>
                ) : (
                    orders.map((order) => (
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
                                <p><strong>Total:</strong> Ksh {order.total_price}</p>
                            </div>

                            <div className="order-items">
                                <h4>Order Items:</h4>
                                <ul>
                                    {order.cart && order.cart.items && order.cart.items.map((item) => (
                                        <li key={item.id}>
                                            {item.quantity}x {item?.food?.name || 'Unknown Item'} - Ksh {(item?.food?.price || 0) * (item.quantity || 0)}
                                        </li>
                                    ))}
                                    {(!order.cart || !order.cart.items || order.cart.items.length === 0) && (
                                        <li>No items found</li>
                                    )}
                                </ul>
                            </div>

                            <div className="order-actions">
                                <select
                                    className="status-select"
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
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
                    ))
                )}
            </div>
        </div>
    );
};

export default OrdersList; 