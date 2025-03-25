import React, { useState } from "react";
import StaffList from "../StaffList/StaffList";
import FoodList from "../FoodList/FoodList";
import RestaurantForm from "../RestaurantForm/RestaurantForm";
import "./RestaurantDetails.css";

const RestaurantDetails = ({ restaurant }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="restaurant-details">
      <h2>Restaurant Details</h2>
      {isEditing ? (
        <RestaurantForm
          initialData={restaurant}
          onSubmit={(data) => {
            // Handle restaurant update
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {restaurant.name}
          </p>
          <p>
            <strong>Description:</strong> {restaurant.description}
          </p>
          {restaurant.image && (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="restaurant-image"
            />
          )}
          <button onClick={() => setIsEditing(true)}>Edit Restaurant</button>
        </div>
      )}

      {/* Staff List */}
      <StaffList restaurantId={restaurant.id} />

      {/* Food List */}
      <FoodList restaurantId={restaurant.id} />
    </div>
  );
};

export default RestaurantDetails;