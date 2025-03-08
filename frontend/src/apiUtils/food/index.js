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
 * @param {Object} foodData - The food item data.
 * @returns {Promise<Object>} - Returns the created food item.
 */
export const createFoodItem = async (foodData) => {
    try {
        const response = await axiosInstance.post(`${FOOD_API_URL}/`, foodData);
        return response.data;
    } catch (error) {
        console.error("Error creating food item:", error);
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
        const response = await axiosInstance.put(`${FOOD_API_URL}/${foodId}/`, foodData);
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
