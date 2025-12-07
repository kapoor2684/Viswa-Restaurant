import React, { useState } from "react";
import axios from "axios";
import { FooditemsURL } from "../commonComponents/AllURLs";
import { ToastContainer, toast } from 'react-toastify';
import "../../Styles/AddFood.css";

const AddFood = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "Veg", // Default to "Veg"
    price: "",
    image: "",
    description: "",
    ingredients: "",
    available: true,
    rating: "",
    reviews: "",
    likes: "",
    discount: "",
    calories: "",
    specialInstructions: "",
  });

  // State to manage loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Convert ingredients string to array
      const updatedData = {
        ...formData,
        ingredients: formData.ingredients.split(",").map((item) => item.trim()),
      };

      // Send POST request to add the new food item
      const response = await axios.post(FooditemsURL, updatedData);
      console.log("Food item added successfully:", response.data);

      // Reset form after successful submission
      setFormData({
        name: "",
        category: "",
        type: "Veg",
        price: "",
        image: "",
        description: "",
        ingredients: "",
        available: true,
        rating: "",
        reviews: "",
        likes: "",
        discount: "",
        calories: "",
        specialInstructions: "",
      });

      toast("Food item added successfully!");
    } catch (err) {
      console.error("Error adding food item:", err);
      setError("Failed to add food item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-food-container">
      <h2>Add New Food Item</h2>
      <form onSubmit={handleSubmit} className="add-food-form">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter food item name"
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category"
            required
          />
        </div>

        {/* Type */}
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </div>

        {/* Image URL */}
        <div className="form-group">
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

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
        </div>

        {/* Ingredients */}
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients:</label>
          <input
            type="text"
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Enter ingredients (comma-separated)"
            required
          />
        </div>

        {/* Available */}
        <div className="form-group">
          <label htmlFor="available">Available:</label>
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
        </div>

        {/* Rating */}
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Enter rating"
            required
          />
        </div>

        {/* Reviews */}
        <div className="form-group">
          <label htmlFor="reviews">Reviews:</label>
          <input
            type="number"
            id="reviews"
            name="reviews"
            value={formData.reviews}
            onChange={handleChange}
            placeholder="Enter number of reviews"
            required
          />
        </div>

        {/* Likes */}
        <div className="form-group">
          <label htmlFor="likes">Likes:</label>
          <input
            type="number"
            id="likes"
            name="likes"
            value={formData.likes}
            onChange={handleChange}
            placeholder="Enter number of likes"
            required
          />
        </div>

        {/* Discount */}
        <div className="form-group">
          <label htmlFor="discount">Discount:</label>
          <input
            type="text"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Enter discount"
          />
        </div>

        {/* Calories */}
        <div className="form-group">
          <label htmlFor="calories">Calories:</label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="Enter calories"
            required
          />
        </div>

        {/* Special Instructions */}
        <div className="form-group">
          <label htmlFor="specialInstructions">Special Instructions:</label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            placeholder="Enter special instructions"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Food Item"}
        </button>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddFood;