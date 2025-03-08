import { axiosInstance } from "../api";

// Get all orders for a user
export const getOrders = async () => {
  const response = await axiosInstance.get("/orders/");
  return response.data;
};

// Create an order (Checkout)
export const createOrder = async (cartId, totalPrice) => {
  const response = await axiosInstance.post("/orders/create/", {
    cart: cartId,
    total_price: totalPrice,
  });
  return response.data;
};

// Get order details
export const getOrderDetails = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}/`);
  return response.data;
};

// Mark order as delivered (clears cart)
export const completeOrder = async (orderId) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/complete/`);
  return response.data;
};
