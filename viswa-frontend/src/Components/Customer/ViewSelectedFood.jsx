import React, { useState, useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import "../../Styles/ViewSelectedFood.css";
import CartApi from "../../API/CartApi";

export default function ViewSelectedFood({ selectedFood, closePopup }) {
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);

  // Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
    setUser(storedUser);
  }, []);

  // Fetch cart
  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      try {
        const cartData = await CartApi.getCartItemsByCustomer(user.id);
        const cartMap = {};

        cartData.forEach(item => {
          cartMap[item.itemId] = {
            id: item.itemId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity
          };
        });

        setCart(cartMap);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCart();
  }, [user, selectedFood]);

  if (!selectedFood) return null;

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
    <div className="select-food-popup-overlay" onClick={closePopup}>
      <div className="select-food-popup-container" onClick={(e) => e.stopPropagation()}>

        <img
          src={selectedFood.image}
          alt={selectedFood.name}
          className="select-food-popup-image"
        />

        <div className="select-food-details">
          <span className="select-food-name">{selectedFood.name}</span>
          <br />

          <span className="select-food-ingredients">
            {Array.isArray(selectedFood.ingredients)
              ? selectedFood.ingredients.join(", ")
              : "No ingredients listed"}
          </span>

          <div className="select-food-description">
            <span>{selectedFood.description || "No description available."}</span>
          </div>

          <div className="select-food-price">
            <FaRupeeSign /> {selectedFood.price}
          </div>

          <div className="select-food-rating">
            <span>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  color={i < selectedFood.rating ? "#FFB100" : "#ddd"}
                />
              ))}
            </span>
            <span>{selectedFood.rating}</span>
          </div>

          {/* Quantity / Add button */}

          <div className="quantity-contrainer">
            {cart[selectedFood.id]?.quantity > 0 ? (
              <div className="counter">
                <button className="counter-btn" onClick={() => updateQuantity(selectedFood, -1)}>
                  -
                </button>
                <span className="counter-value">{cart[selectedFood.id].quantity}</span>
                <button className="counter-btn" onClick={() => updateQuantity(selectedFood, 1)}>
                  +
                </button>
              </div>
            ) : (
              <button className="add-btn" onClick={() => updateQuantity(selectedFood, 1)}>
                Add
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
