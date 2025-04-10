import { axiosInstance, anonAxiosInstance } from "../api";

const FOOD_API_URL = "/food"; // Adjust this if your endpoint is different

/**
 * Fetch the list of food items from the backend (Public).
 * @returns {Promise<Array>} - Returns an array of food items.
 */
export const getFoodList = async () => {
  try {
    const response = await anonAxiosInstance.get(`${FOOD_API_URL}/`);
    return response.data; // Assuming the response is an array of food items
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw error;
  }
};

/**
 * Fetch a single food item by ID (Public).
 * @param {string} foodId - The ID of the food item.
 * @returns {Promise<Object>} - Returns a food item object.
 */
export const getFoodItem = async (foodId) => {
  try {
    const response = await anonAxiosInstance.get(`${FOOD_API_URL}/${foodId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching food item:", error);
    throw error;
  }
};

/**
 * Create a new food item (Authenticated - For restaurant owners).
 * @param {FormData} foodData - The food item data as FormData.
 * @param {string} restaurantId - The ID of the restaurant.
 * @returns {Promise<Object>} - Returns the created food item.
 */
export const createFoodItem = async (foodData, restaurantId) => {
  try {
    // Always use FormData
    const formDataToSend = new FormData();

    // Add all fields from the input FormData
    for (let [key, value] of foodData.entries()) {
      formDataToSend.append(key, value);
      console.log(`Adding ${key}: ${value}`);
    }

    // Log all FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await axiosInstance.post(
      `${FOOD_API_URL}/${restaurantId}/menu/`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating food item:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    throw error;
  }
};

/**
 * Update a food item (Authenticated - Only restaurant owners).
 * @param {string} foodId - The ID of the food item.
 * @param {Object} foodData - The updated food data.
 * @returns {Promise<Object>} - Returns the updated food item.
 */
export const updateFoodItem = async (foodId, foodData) => {
  try {
    const response = await axiosInstance.put(
      `${FOOD_API_URL}/${foodId}/`,
      foodData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating food item:", error);
    throw error;
  }
};

/**
 * Delete a food item (Authenticated - Only restaurant owners).
 * @param {string} foodId - The ID of the food item.
 * @returns {Promise<void>}
 */
export const deleteFoodItem = async (foodId) => {
  try {
    await axiosInstance.delete(`${FOOD_API_URL}/${foodId}/`);
  } catch (error) {
    console.error("Error deleting food item:", error);
    throw error;
  }
};
