import { axiosInstance } from "../api";

const restaurantApis = {
  // Fetch all available restaurants
  getRestaurants: async () => {
    try {
      const response = await axiosInstance.get("/restaurant/");
      return response.data;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw error;
    }
  },

  // Fetch details of a specific restaurant
  getRestaurantDetails: async (restaurantId) => {
    try {
      const response = await axiosInstance.get(`/restaurant/${restaurantId}/`);
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching details for restaurant ${restaurantId}:`,
        error
      );
      throw error;
    }
  },

  // Create a new restaurant
  createRestaurant: async (data) => {
    try {
      const response = await axiosInstance.post("/restaurant/create/", data, {
        headers: {
          "Content-Type": "multipart/form-data", // For image uploads
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating restaurant:", error);
      throw error;
    }
  },

  // Update an existing restaurant
  updateRestaurant: async (restaurantId, data) => {
    try {
      const response = await axiosInstance.patch(
        `/restaurant/${restaurantId}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // For image uploads
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating restaurant ${restaurantId}:`, error);
      throw error;
    }
  },

  // Delete a restaurant
  deleteRestaurant: async (restaurantId) => {
    try {
      const response = await axiosInstance.delete(
        `/restaurant/${restaurantId}/`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting restaurant ${restaurantId}:`, error);
      throw error;
    }
  },

  // Fetch staff members for a specific restaurant
  getRestaurantStaff: async (restaurantId) => {
    try {
      const response = await axiosInstance.get(
        `/restaurant/${restaurantId}/staff/`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching staff for restaurant ${restaurantId}:`,
        error
      );
      throw error;
    }
  },

  // Add a staff member to a restaurant
  addStaffMember: async (restaurantId, data) => {
    try {
      const response = await axiosInstance.post(
        `/restaurant/${restaurantId}/staff/`,
        {
          email: data.email,
          role: data.role,
          is_staff: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a staff member's role
  updateStaffMember: async (staffId, data) => {
    try {
      const response = await axiosInstance.patch(
        `/restaurant/staff/${staffId}/`,
        {
          role: data.role,
          is_staff: data.is_staff,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating staff member ${staffId}:`, error);
      throw error;
    }
  },

  // Update a staff member's status
  updateStaffStatus: async (staffId, isStaff) => {
    try {
      const response = await axiosInstance.patch(
        `/restaurant/staff/${staffId}/`,
        {
          is_staff: isStaff,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating staff status ${staffId}:`, error);
      throw error;
    }
  },

  // Remove a staff member from a restaurant
  removeStaffMember: async (staffId) => {
    try {
      const response = await axiosInstance.delete(
        `/restaurant/staff/${staffId}/`
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing staff member ${staffId}:`, error);
      throw error;
    }
  },

  // Fetch a specific restaurant's menu (food items)
  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await axiosInstance.get(`/food/${restaurantId}/menu/`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching menu for restaurant ${restaurantId}:`,
        error
      );
      throw error;
    }
  },
};

export default restaurantApis;
