import { axiosInstance } from "../api";

// Get user's cart
export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/cart/");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error; // Propagate error for handling in UI
  }
};

// Add item to cart
export const addToCart = async (foodId, quantity) => {
  try {
    const response = await axiosInstance.post("/cart/add/", {
      food_item_id: foodId,
      quantity,
    });
    console.log("Added to cart:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await axiosInstance.patch(`/cart/update/${cartItemId}/`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await axiosInstance.delete(`/cart/remove/${cartItemId}/`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};
