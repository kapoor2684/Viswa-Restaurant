import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/CustomerFoodCategory.css";
import foodcategoriesAPI from "../../../API/foodcatogoriesAPI"


export default function CustomerFoodCategory() {
    const [foodCategories, setFoodCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await foodcategoriesAPI.getAllFoodCategories();
                // Assuming array directly or adjust accordingly
                const categories = response.data || response;
                setFoodCategories(categories);
                console.log("Fetched food categories:", categories);
            } catch (error) {
                console.error("Error fetching food categories:", error);
                // optionally set an error state to show in UI
            }
        };
        fetchData();
    }, []);


    const handleCategoryClick = (categoryid, categoryName) => {
        navigate(`/selectedcategory`, { state: { categoryid, categoryName } });
    };


    return (
        <div className="food-categories-container">
            <span>What comes to your mind</span>
            <div className="all-food-category">
                {foodCategories.length > 0 ? (
                    foodCategories.map((category) => (
                        <div
                            key={category.id}
                            className="food-category-card"
                            onClick={() => handleCategoryClick(category.id, category.name)}
                            style={{ cursor: "pointer" }}
                        >
                            <img src={category.image} alt={category.name} className="food-category-img" />
                            <p>{category.name}</p>
                        </div>
                    ))
                ) : (
                    <p>Loading categories...</p>
                )}
            </div>
        </div>
    );
}
