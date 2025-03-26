import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurantOrders, updateOrderStatus } from '../../apiUtils/order';
import './OrdersList.css';

const OrdersList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current'); // 'current' or 'past'

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            console.log('Fetching orders...'); // Debug log
            const data = await getRestaurantOrders();
            console.log('Raw API response:', data); // Debug log
            if (!data) {
                console.log('No data received from API'); // Debug log
            }
            setOrders(data || []);
        } catch (err) {
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            }); // Detailed error log
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

    // Filter orders based on status
    const currentOrders = orders.filter(order =>
        ['paid-pending', 'processing', 'awaiting-pickup', 'out-for-delivery'].includes(order.status)
    );
    const pastOrders = orders.filter(order =>
        ['delivered', 'cancelled'].includes(order.status)
    );

    console.log('Current orders:', currentOrders); // Debug log
    console.log('Past orders:', pastOrders); // Debug log

    const renderOrderItems = (order) => {
        console.log('Rendering items for order:', order); // Debug log
        // For active orders, use cart items
        if (['paid-pending', 'processing', 'awaiting-pickup', 'out-for-delivery'].includes(order.status)) {
            console.log('Using cart items:', order.cart_items); // Debug log
            return order.cart_items?.map((item) => (
                <li key={item.id}>
                    {item.quantity}x {item.food_item.name} - Ksh {item.food_item.price * item.quantity}
                </li>
            )) || [];
        }
        // For completed orders, use order items
        console.log('Using order items:', order.items); // Debug log
        return order.items?.map((item) => (
            <li key={item.id}>
                {item.quantity}x {item.food_item.name} - Ksh {item.price * item.quantity}
            </li>
        )) || [];
    };

    const renderOrderCard = (order) => (
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
                <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>

            <div className="order-items">
                <h4>Order Items:</h4>
                <ul>
                    {renderOrderItems(order)}
                </ul>
            </div>

            {activeTab === 'current' && (
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
            )}
        </div>
    );

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
                <div className="orders-tabs">
                    <button
                        className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Current Orders ({currentOrders.length})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Orders ({pastOrders.length})
                    </button>
                </div>
            </div>

            <div className="orders-grid">
                {activeTab === 'current' ? (
                    currentOrders.length > 0 ? (
                        currentOrders.map(renderOrderCard)
                    ) : (
                        <p>No current orders</p>
                    )
                ) : (
                    pastOrders.length > 0 ? (
                        pastOrders.map(renderOrderCard)
                    ) : (
                        <p>No past orders</p>
                    )
                )}
            </div>
        </div>
    );
};

export default OrdersList; 