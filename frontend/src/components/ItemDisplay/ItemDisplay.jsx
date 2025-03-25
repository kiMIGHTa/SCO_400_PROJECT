import React, { useContext } from "react";
import "./ItemDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import ItemCard from "../ItemCard/ItemCard";

const ItemDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext); 
  console.log("Food List:", foodList); 


  if (!foodList || foodList.length === 0) {
    return (
      <div className="item-display">
        <h2>Top dishes near you</h2>
        <p>No food items available.</p>
      </div>
    );
  }

  return (
    <div className="item-display" id="item-display">
      <h2>Top dishes near you</h2>
      <div className="item-display-list">
        {foodList
          .filter((item) => category === "" || category === item.category) // Filtering directly
          .map((item) => (
            <ItemCard
              key={item.id} 
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              restaurantName={item.restaurant.name}
            />
          ))}
      </div>
    </div>
  );
};

export default ItemDisplay;
