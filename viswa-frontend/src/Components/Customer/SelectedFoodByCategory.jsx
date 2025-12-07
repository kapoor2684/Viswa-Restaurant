import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import ApplicationHeader from "../commonComponents/ApplicationHeader";
import "../../Styles/SelectedFoodByCategory.css";
import foodItemAPI from "../../API/foodItemAPI";
import CartApi from "../../API/CartApi";

export default function SelectedFoodByCategory() {
  const location = useLocation();
  const { categoryid, categoryName } = location.state || {};

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
    setUser(storedUser);
  }, []);

  // Fetch cart items
  useEffect(() => {
    if (!user) return;

    const fetchCartItems = async () => {
      try {
        const cartData = await CartApi.getCartItemsByCustomer(user.id);

        const cartMap = {};
        cartData.forEach(item => {
          cartMap[item.itemId] = {
            id: item.itemId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
          };
        });

        setCart(cartMap);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user]);

  // Fetch food items by category
  useEffect(() => {
    const fetchFoodItemsByCategory = async (catId) => {
      setLoading(true);
      setError("");
      try {
        const response = await foodItemAPI.getFoodItemsByCategory(catId);
        setFoodItems(response);
      } catch (err) {
        setError("Failed to fetch food items. Please try again later.");
      }
      setLoading(false);
    };

    if (categoryid) fetchFoodItemsByCategory(categoryid);
    else {
      setLoading(false);
      setError("Category data not found.");
    }
  }, [categoryid]);

  const updateQuantity = async (item, delta) => {
    if (!user) return;

    if (delta > 0) {
      await addToCart(user.id, item.id, setCart);
    } else {
      await removeFromCart(user.id, item.id, setCart);
    }
  };

  const addToCart = async (userId, itemId, setCart) => {
    try {
      await CartApi.addCartItem(userId, itemId);

      setCart(prev => {
        const currentQty = prev[itemId]?.quantity || 0;

        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            id: itemId,
            quantity: currentQty + 1
          }
        };
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (userId, itemId, setCart) => {
    try {
      await CartApi.removeCartItem(userId, itemId);

      setCart(prev => {
        const currentQty = prev[itemId]?.quantity || 0;
        const newQty = currentQty - 1;

        if (newQty <= 0) {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        }

        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            id: itemId,
            quantity: newQty
          }
        };
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  return (
    <>
      <ApplicationHeader />

      <div className="selected-food-container">
        <h2 className="selected-food-title">Food Items in "{categoryName}"</h2>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="selected-food-grid">
            {foodItems.length > 0 ? (
              foodItems.map((item) => {
                const quantity = cart[item.id]?.quantity || 0;

                return (
                  <div key={item.id} className="selected-food-card">
                    <div className="selected-food-card-upper-details">
                      {item.type && (
                        <div
                          className="selected-food-card-type"
                          style={{ background: item.type === "Veg" ? "green" : "red" }}
                        >
                          {item.type}
                        </div>
                      )}
                      <img src={item.image} alt={item.name} className="selected-food-image" />
                    </div>

                    <div className="selected-food-details">
                      <span className="selected-food-name">{item.name}</span>
                      <br />
                      <span className="selected-food-ingredients">
                        {Array.isArray(item.ingredients)
                          ? item.ingredients.join(", ")
                          : "N/A"}
                      </span>
                      <br />
                      <span className="selected-food-price">
                        <FaRupeeSign /> {item.price}
                      </span>
                      <br />
                      <div className="quantity-contrainer">
                        {quantity > 0 ? (
                          <div className="counter">
                            <button
                              className="counter-btn"
                              onClick={() => updateQuantity(item, -1)}
                            >
                              -
                            </button>

                            <span className="counter-value">{quantity}</span>

                            <button
                              className="counter-btn"
                              onClick={() => updateQuantity(item, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="add-btn"
                            onClick={() => updateQuantity(item, 1)}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No items found in this category.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
