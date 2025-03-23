import { axiosInstance } from "../api";

// Get all orders for a user
export const getOrders = async () => {
  const response = await axiosInstance.get("/order/");
  return response.data;
};

// Create an order (Checkout)
export const createOrder = async (orderDetails) => {
  const response = await axiosInstance.post("/order/create/", orderDetails);
  console.log("Response:", response); // ✅ Correct logging
  console.log("Response Data:", response.data); // ✅ Access response body
  return response;
};

// Get order details
export const getOrderDetails = async (orderId) => {
  const response = await axiosInstance.get(`/order/${orderId}/`);
  console.log(response.data);

  return response.data;
};

// Mark order as delivered (clears cart)
export const completeOrder = async (orderId) => {
  const response = await axiosInstance.patch(`/order/${orderId}/complete/`);
  return response.data;
};
