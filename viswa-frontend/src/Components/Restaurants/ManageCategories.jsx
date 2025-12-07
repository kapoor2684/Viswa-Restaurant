import React, { useState, useEffect } from "react";
import axios from "axios";
import { FoodCategoryURL } from "../commonComponents/AllURLs";
import { ToastContainer, toast } from "react-toastify";
import ConfirmPopup from "../commonComponents/ConfirmPopup"; // Import the ConfirmPopup component
import "../../Styles/ManageCategories.css";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(FoodCategoryURL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories. Please try again.");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle adding or updating a category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${FoodCategoryURL}/${editingCategory}`, formData);
        toast.success("Category updated successfully!");
      } else {
        await axios.post(FoodCategoryURL, formData);
        toast.success("Category added successfully!");
      }
      setIsModalOpen(false);
      fetchCategories();
      setFormData({ name: "", image: "" });
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category. Please try again.");
    }
  };

  // Handle editing a category
  const handleEdit = (category) => {
    setEditingCategory(category.id);
    setFormData({
      name: category.name,
      image: category.image,
    });
    setIsModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setShowConfirmPopup(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${FoodCategoryURL}/${categoryToDelete}`);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setShowConfirmPopup(false);
      setCategoryToDelete(null);
    }
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="manage-categories-container">
      <span className="manage-categories-title">Manage Categories</span>

      {/* Add Category Button */}
      <button className="add-category-button" onClick={() => setIsModalOpen(true)}>
        Add Category
      </button>

      {/* List of Categories */}
      <div className="manage-category-grid">
        {categories.map((category) => (
          <div key={category.id} className="manage-category-card">
            <img src={category.image} alt={category.name} className="manage-category-image" />
            <div className="manage-category-details">
              <h3>{category.name}</h3>
            </div>
            <div className="manage-category-actions">
              <button onClick={() => handleEdit(category)}>Edit</button>
              <button onClick={() => handleDeleteClick(category.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="manage-category-modal-overlay">
          <div className="manage-category-modal">
            <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} className="category-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Category Name"
                required
              />
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                required
              />
              <button type="submit">{editingCategory ? "Save" : "Add"}</button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({ name: "", image: "" });
                  setEditingCategory(null);
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Popup */}
      {showConfirmPopup && (
        <ConfirmPopup
          message="Are you sure you want to delete this category?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageCategories;