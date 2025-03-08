import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import restaurantApis from "../../apiUtils/restaurant/index";
import ItemCard from "../../components/ItemCard/ItemCard";
// import "./RestaurantMenu.css"; // Add styles if necessary


const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await restaurantApis.getRestaurantMenu(restaurantId);
        setMenu(data);
        console.log(menu)
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  return (
    <div>
      <h2>Restaurant Menu</h2>
      <ul>
        {menu.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        ))}
      </ul>
    </div>
  );
};

export default RestaurantMenu;
