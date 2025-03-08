import React from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurantCard.css";
import { assets } from "../../../downloads/assets/frontend_assets/assets";

const RestaurantCard = ({ id, name, description, image, rating }) => {
  const navigate = useNavigate();

  return (
    <div className="restaurant-card" onClick={() => navigate(`/restaurants/${id}`)}>
      <div className="restaurant-image-container">
        <img src={image} alt={name} className="restaurant-image" />
      </div>
      <div className="restaurant-card-info">
        <h3>{name}</h3>
        <p className="restaurant-description">{description}</p>
        <div className="restaurant-rating">
          <img src={assets.rating_starts} alt="rating" />
          <span>{rating} / 5</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
