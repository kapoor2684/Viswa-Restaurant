import React, { useState, useEffect } from "react";
import ApplicationHeader from "../../commonComponents/ApplicationHeader";
import AllFoodCategory from "./AllFoodCategory";
import AllFoodItems from "./AllFoodItems";
import Footer from "../../commonComponents/Footer";
import "../../../Styles/CustomerDasboard.css";
import foodcategoriesAPI from "../../../API/foodcatogoriesAPI";
import foodItemAPI from "../../../API/foodItemAPI"; // Assuming you import this as well


export default function CustomerDashboard() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await foodItemAPI.getAllFoodItems();
        setFoodItems(response);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch food items. Please try again later.");
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await foodcategoriesAPI.getAllFoodCategories();
        const categories = response.data || response;
        setMenuItems(categories);
      } catch (error) {
        console.error("Error fetching food categories:", error);
      }
    };
    fetchData();
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const handleContainerClick = () => {
    if (isMenuOpen) setMenuOpen(false);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  // Function to handle category selection and filtering
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setMenuOpen(false);
  };

  // Filter food items based on selected category
  const filteredFoodItems = selectedCategory
    ? foodItems.filter(
      (item) =>
        item.category?.id === selectedCategory.id ||
        item.category === selectedCategory.id
    )
    : foodItems; // when selectedCategory is null, all items are shown

  return (
    <div className="customerd-dashboard-container" onClick={handleContainerClick}>
      <ApplicationHeader />
      <AllFoodCategory />
      <AllFoodItems foodItems={filteredFoodItems} />
      <Footer />

      <div className="floating-menu-container" onClick={handleMenuClick}>
        <button
          className={`menu-button ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? "×" : "≡"}
        </button>

        {isMenuOpen && (
          <div className="vertical-menu-scroll-container">
            <div className="vertical-menu-list">
              <button
                className="vertical-menu-item"
                onClick={() => handleCategoryClick(null)} // Pass null for "All"
              >
                All
              </button>
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="vertical-menu-item"
                  onClick={() => handleCategoryClick(item)}
                >
                  {item.name || item.label || item}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
