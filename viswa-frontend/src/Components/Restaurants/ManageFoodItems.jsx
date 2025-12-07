import React, { useState, useEffect } from "react";
import axios from "axios";
import { FooditemsURL } from "../commonComponents/AllURLs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import ConfirmPopup from "../commonComponents/ConfirmPopup"; // Import the ConfirmPopup component
import "../../Styles/ManageFoodItems.css";

const ManageFoodItems = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        type: "",
        price: 0,
        image: "",
        description: "",
        ingredients: [],
        available: true,
        rating: 0,
        reviews: 0,
        likes: 0,
        discount: "",
        calories: 0,
        specialInstructions: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false); // State to control confirm popup
    const [itemToDelete, setItemToDelete] = useState(null); // State to store the item to delete

    // Fetch all food items on component mount
    useEffect(() => {
        fetchFoodItems();
    }, []);

    // Fetch food items from the API
    const fetchFoodItems = async () => {
        try {
            const response = await axios.get(FooditemsURL);
            setFoodItems(response.data);
            setFilteredItems(response.data);
            extractCategories(response.data);
        } catch (error) {
            console.error("Error fetching food items:", error);
            toast.error("Failed to fetch food items. Please try again.");
        }
    };

    // Extract unique categories from food items
    const extractCategories = (items) => {
        const uniqueCategories = [...new Set(items.map((item) => item.category))];
        setCategories(["All", ...uniqueCategories]);
    };

    // Handle category filter change
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        if (category === "All") {
            setFilteredItems(foodItems);
        } else {
            const filtered = foodItems.filter((item) => item.category === category);
            setFilteredItems(filtered);
        }
    };

    // Handle editing an item
    const handleEdit = (item) => {
        setEditingItem(item.id);
        setFormData({
            name: item.name,
            category: item.category,
            type: item.type,
            price: item.price,
            image: item.image,
            description: item.description,
            ingredients: item.ingredients.join(", "),
            available: item.available,
            rating: item.rating,
            reviews: item.reviews,
            likes: item.likes,
            discount: item.discount,
            calories: item.calories,
            specialInstructions: item.specialInstructions,
        });
        setIsModalOpen(true);
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle form submission for updating an item
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...formData,
                ingredients: formData.ingredients.split(",").map((item) => item.trim()),
            };
            await axios.put(`${FooditemsURL}/${editingItem}`, updatedData);
            toast.success("Food item updated successfully!");
            setIsModalOpen(false);
            fetchFoodItems();
        } catch (error) {
            console.error("Error updating food item:", error);
            toast.error("Failed to update food item. Please try again.");
        }
    };

    // Handle delete confirmation
    const handleDeleteClick = (id) => {
        setItemToDelete(id); // Set the item to delete
        setShowConfirmPopup(true); // Show the confirmation popup
    };

    // Handle confirmed deletion
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${FooditemsURL}/${itemToDelete}`);
            toast.success("Food item deleted successfully!");
            fetchFoodItems(); // Refresh the list
        } catch (error) {
            console.error("Error deleting food item:", error);
            toast.error("Failed to delete food item. Please try again.");
        } finally {
            setShowConfirmPopup(false); // Close the confirmation popup
            setItemToDelete(null); // Reset the item to delete
        }
    };

    // Handle cancel deletion
    const handleCancelDelete = () => {
        setShowConfirmPopup(false); // Close the confirmation popup
        setItemToDelete(null); // Reset the item to delete
    };

    return (
        <div className="manage-food-items-container">
            <span className="manage-food-items-title">Manage Food Items</span>

            {/* Category Filter Dropdown */}
            <span className="filter-container">
                <label htmlFor="category-filter">Category:
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select> </label>
            </span>

            {/* List of food items in card layout */}
            <div className="manage-food-items-grid">
                {filteredItems.map((item) => (
                    <div key={item.id} className="manage-food-card">
                        <img src={item.image} alt={item.name} className="manage-food-image" />
                        <div className="manage-food-details">
                            <h3>{item.name}</h3>
                            <p>Category: {item.category}</p>
                            <p>Price: <LiaRupeeSignSolid />{item.price}</p>
                            <p>Available: {item.available ? "Yes" : "No"}</p>
                        </div>
                        <div className="manage-food-actions">
                            <button onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => handleDeleteClick(item.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="food-edit-overlay">
                    <div className="food-edit-container">
                        <div className="edit-manage-popup-row">
                            <span className="food-edit-title">Edit Food Item</span>
                            <span className="food-available-icon">
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleChange}
                                />
                                <label>Available </label>
                            </span>
                        </div>
                        <form onSubmit={handleUpdate} className="edit-form">
                            {/* Form fields for editing */}

                            <div className="edit-manage-popup-row">
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Food Name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category:</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Category"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Veg">Veg</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                    </select>
                                </div>
                            </div>

                            <div className="edit-manage-popup-row">
                                <div className="form-group">
                                    <label>Price:</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Price"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rating:</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        placeholder="Rating"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Reviews:</label>
                                    <input
                                        type="number"
                                        name="reviews"
                                        value={formData.reviews}
                                        onChange={handleChange}
                                        placeholder="Reviews"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="edit-manage-popup-row">
                                <div className="form-group">
                                    <label>Discount:</label>
                                    <input
                                        type="text"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        placeholder="Discount"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Calories:</label>
                                    <input
                                        type="number"
                                        name="calories"
                                        value={formData.calories}
                                        onChange={handleChange}
                                        placeholder="Calories"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL:</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Image URL"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Ingredients:</label>
                                <input
                                    type="text"
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleChange}
                                    placeholder="Ingredients (comma-separated)"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Popup */}
            {showConfirmPopup && (
                <ConfirmPopup
                    message="Are you sure you want to delete this item?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
            <ToastContainer />
        </div>
    );
};

export default ManageFoodItems;