import React, { useEffect, useState } from "react";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import RestaurantAPI from "../../apiUtils/restaurant/index";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await RestaurantAPI.getRestaurants();
      setRestaurants(data);
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="restaurant-display" id="restaurant-display">
      <h2>Available Restaurants</h2>
      <div className="restaurant-display-list">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              description={restaurant.description}
              image={restaurant.image}
              rating={restaurant.rating}
            />
          ))
        ) : (
          <p>No restaurants available.</p>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
