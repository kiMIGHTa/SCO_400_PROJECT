import { axiosInstance } from "../api";

const restaurantApis = {
  // Fetch all available restaurants
  getRestaurants: async () => {
    try {
      const response = await axiosInstance.get("/restaurants/");
      return response.data;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw error;
    }
  },

  // Fetch a specific restaurant's menu
  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await axiosInstance.get(`/food/${restaurantId}/menu/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching menu for restaurant ${restaurantId}:`, error);
      throw error;
    }
  },
};

export default restaurantApis;
