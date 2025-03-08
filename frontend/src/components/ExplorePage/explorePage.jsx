import React from "react";
import "./explorePage.css";
import { menu_list } from "../../../downloads/assets/frontend_assets/assets"; // Adjusted import path

const ExplorePage = ({ category, setCategory }) => {
  return (
    <div className="explore-page" id="explore-page">
      <h1>Explore the menu</h1>
      <p className="explore-page-text">Choose from our diverse menu</p>
      <div className="explore-page-list">
        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;

          return (
            <div
              onClick={() => setCategory(isActive ? "" : item.menu_name)}
              key={index}
              className={`explore-page-list-item ${isActive ? "active" : ""}`}
            >
              <img className={isActive ? "active" : ""} src={item.menu_image} alt="item-image" />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExplorePage;
