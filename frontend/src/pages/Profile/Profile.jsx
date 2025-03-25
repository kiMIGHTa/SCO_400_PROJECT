import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import accountApis from "../../apiUtils/account";
import restaurantApis from "../../apiUtils/restaurant";
import RestaurantForm from "../../components/RestaurantForm/RestaurantForm";
import RestaurantDetails from "../../components/RestaurantDetails/RestaurantDetails";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    contact: "",
    has_restaurant: false,
  });
  const [formData, setFormData] = useState(null); // Separate form state for editing
  const [restaurant, setRestaurant] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingRestaurant, setIsCreatingRestaurant] = useState(false);
  const [error, setError] = useState("");

  // Fetch user profile and restaurant data on component mount
  useEffect(() => {
    fetchProfile();
    if (user.has_restaurant) {
      fetchRestaurant();
    }
  }, [user.has_restaurant]);

  const fetchProfile = async () => {
    try {
      const profileData = await accountApis.fetchProfile();
      console.log(profileData);
      setUser(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile data.");
    }
  };

  const fetchRestaurant = async () => {
    try {
      const restaurantData = await restaurantApis.getRestaurantDetails(user.restaurant.id);
      console.log(restaurantData);

      setRestaurant(restaurantData);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      setError("Failed to fetch restaurant data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await accountApis.updateProfile(user);
      setUser(updatedProfile);
      setIsEditingProfile(false);
      setError("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  const handleCreateRestaurant = async (restaurantData) => {
    try {
      const newRestaurant = await restaurantApis.createRestaurant(restaurantData);
      setRestaurant(newRestaurant);
      setUser({ ...user, has_restaurant: true });
      setIsCreatingRestaurant(false);
      setError("");
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setError("Failed to create restaurant.");
    }
  };

  const handleViewOrders = () => {
    if (user.has_restaurant) {
      navigate('/restaurant-orders');
    } else {
      setError("Restaurant information not available.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Orders Management Button for Restaurant Owners */}
      {user.has_restaurant && (
        <div className="orders-management-section">
          <button className="view-orders-btn" onClick={handleViewOrders}>
            View Restaurant Orders
          </button>
        </div>
      )}

      {/* Profile Details */}
      {isEditingProfile ? (
        <div className="edit-profile-form">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={user.contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" onClick={handleSaveProfile}>Save</button>
            <button type="button" onClick={() => setIsEditingProfile(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="profile-details">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>First Name:</strong> {user.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {user.last_name}
          </p>
          <p>
            <strong>Contact:</strong> {user.contact}
          </p>
          <div className="profile-actions">
            <button onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
          </div>
        </div>
      )}

      {/* Restaurant Section */}
      {user.has_restaurant ? (
        <RestaurantDetails restaurant={user.restaurant} />
      ) : (
        <div className="restaurant-section">
          <button onClick={() => setIsCreatingRestaurant(true)}>
            Create Restaurant
          </button>
          {isCreatingRestaurant && (
            <RestaurantForm
              onSubmit={handleCreateRestaurant}
              onCancel={() => setIsCreatingRestaurant(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;