import React, { useState } from "react";
import axios from "axios";
import { FoodCategoryURL } from "../commonComponents/AllURLs";
import { ToastContainer, toast } from 'react-toastify';
import "../../Styles/AddCategory.css";

const AddMenu = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  // State to manage loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Send POST request to add the new menu item
      const response = await axios.post(FoodCategoryURL, formData);
      console.log("Menu item added successfully:", response.data);

      // Reset form after successful submission
      setFormData({
        name: "",
        image: "",
      });

      toast("Menu item added successfully!");
    } catch (err) {
      console.error("Error adding menu item:", err);
      setError("Failed to add menu item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-menu-container">
      <h2>Add New Menu Item</h2>
      <form onSubmit={handleSubmit} className="add-menu-form">
        {/* Name Input */}
        <div className="add-menu-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter menu item name"
            required
          />
        </div>

        {/* Image URL Input */}
        <div className="add-menu-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Menu Item"}
        </button>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddMenu;