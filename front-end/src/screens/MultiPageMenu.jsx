import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';
import "./MultiPageMenu.css";

const MultiPageMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [menu_items, setMenuItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-menu-categories`);
      const formattedCategories = res.data.map(category => category.replace(/_/g, ' '));
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setErrorMessage("Error fetching categories. Please try again.");
      setDisplayErrorMessage(true);
    }
  };

  const fetchMenuItems = async (category) => {
    try {
      const res = await axios.get(`${API_URL}/get-menu-items`, {
        params: { category: category.replace(/ /g, '_') },
      });
      setMenuItems(res.data);
      setDisplayErrorMessage(false);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
      setErrorMessage("Error fetching menu items. Please try again.");
      setDisplayErrorMessage(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchMenuItems(categories[selectedCategoryIndex]);
    }
  }, [categories, selectedCategoryIndex]);

  const handlePrevious = () => {
    setSelectedCategoryIndex((previousIndex) =>
      previousIndex === 0 ? categories.length - 1 : previousIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedCategoryIndex((previousIndex) =>
      previousIndex === categories.length - 1 ? 0 : previousIndex + 1
    );
  };

  return (
    <div className="multi-page-menu">
      <header className="menu-header">
        <h3>MENU</h3>
        <div className="category-navigation">
          <button className="nav-button" onClick={handlePrevious}>
            Previous Category
          </button>
          <button className="nav-button" onClick={handleNext}>
            Next Category
          </button>
        </div>
      </header>

      <main className="menu-content">
        {displayErrorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="items-grid-container">
          <div className="items-grid">
            {menu_items && menu_items.length > 0 ? (
              menu_items.map((item) => (
                <button
                  key={item.id}
                  className="item-button"
                >
                  {item.name} ${item.cost}
                </button>
              ))
            ) : (<p className="no-items-message">No items found</p>)}
          </div>
        </div>
      </main>

      <footer className="menu-footer">
        <p>
          Currently displaying{" "} {categories.length > 0 ? categories[selectedCategoryIndex] : "Loading Menu..."} {" "}category
        </p>
      </footer>
    </div>
  );
};

export default MultiPageMenu;