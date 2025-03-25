import React, { useEffect, useState } from "react";
import restaurantApis from "../../apiUtils/restaurant";
import { createFoodItem, updateFoodItem, deleteFoodItem } from "../../apiUtils/food";
import "./FoodList.css";

const FoodList = ({ restaurantId }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
    availability: true
  });

  useEffect(() => {
    fetchFoodItems();
  }, [restaurantId]);

  const fetchFoodItems = async () => {
    try {
      const menu = await restaurantApis.getRestaurantMenu(restaurantId);
      console.log('Fetched menu items:', menu);
      setFoodItems(menu);
    } catch (error) {
      console.error("Error fetching food items:", error);
      setError("Failed to fetch food items.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("availability", formData.availability);

    // Only append image if it exists
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editingItem) {
        await updateFoodItem(editingItem.id, formDataToSend);
      } else {
        await createFoodItem(formDataToSend, restaurantId);
      }
      setIsAdding(false);
      setEditingItem(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        availability: true,
        image: null,
      });
      fetchFoodItems();
    } catch (error) {
      console.error("Error saving food item:", error);
      setError(error.response?.data || "Failed to save food item");
    }
  };

  const handleDelete = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteFoodItem(foodId);
        fetchFoodItems();
      } catch (error) {
        console.error("Error deleting food item:", error);
        setError("Failed to delete food item.");
      }
    }
  };

  const handleEdit = (food) => {
    setEditingItem(food);
    setFormData({
      name: food.name,
      price: food.price,
      description: food.description || "",
      image: null,
      category: food.category || "",
      availability: food.availability
    });
    setIsAdding(true);
  };

  return (
    <div className="food-list">
      <div className="food-list-header">
        <h3>Menu</h3>
        <button
          className="add-button"
          onClick={() => {
            setIsAdding(true);
            setEditingItem(null);
            setFormData({
              name: "",
              price: "",
              description: "",
              image: null,
              category: "",
              availability: true
            });
          }}
        >
          Add New Item
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {(isAdding || editingItem) && (
        <form className="food-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="availability">Availability:</label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              required
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <span className="form-text">Optional: Upload an image for the food item</span>
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              {editingItem ? "Update Item" : "Add Item"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsAdding(false);
                setEditingItem(null);
                setFormData({
                  name: "",
                  price: "",
                  description: "",
                  image: null,
                  category: "",
                  availability: true
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="food-items-list">
        {foodItems.map((food) => (
          <li key={food.id} className="food-item">
            <div className="food-item-content">
              {food.image && (
                <img
                  src={food.image}
                  alt={food.name}
                  className="food-item-image"
                />
              )}
              <div className="food-item-details">
                <h4>{food.name}</h4>
                <p className="price">Ksh {food.price}</p>
                <p className="category">{food.category}</p>
                <p className="status">Status:</p>
                <p className={`availability ${food.availability ? 'available' : ''}`}>
                  {food.availability ? "Available" : "Unavailable"}
                </p>
                {food.description && (
                  <p className="description">{food.description}</p>
                )}
              </div>
            </div>
            <div className="food-item-actions">
              <button
                className="edit-button"
                onClick={() => handleEdit(food)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(food.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;