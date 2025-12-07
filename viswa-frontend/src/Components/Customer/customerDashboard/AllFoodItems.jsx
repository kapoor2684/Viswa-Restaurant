import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import ViewSelectedFood from "../ViewSelectedFood";
import "../../../Styles/AllFoodItems.css";
import CartApi from "../../../API/CartApi";

export default function AllFoodItems({ foodItems }) {
  const [selectedFood, setSelectedFood] = useState(null);
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

  // Popup handlers
  const openPopup = (food) => setSelectedFood(food);
  const closePopup = () => setSelectedFood(null);

  if (!foodItems || foodItems.length === 0) {
    return <p className="loading">No food items available to display.</p>;
  }

  return (
    <div className="popular-food-items-container">
      <div className="popular-food-item-title">Our Food Items</div>

      <div className="popular-food-grid">
        {foodItems.map(item => {
          const qty = cart[item.id]?.quantity || 0;

          return (
            <div key={item.id} className="popular-food-card">
              <div className="popular-food-upper-details">
                {item.type && (
                  <div
                    className="popular-food-type"
                    style={{ background: item.type === "Veg" ? "green" : "red" }}
                  >
                    {item.type}
                  </div>
                )}

                <img
                  src={item.image}
                  alt={item.name || "Popular food item"}
                  className="popular-food-image"
                  onClick={() => openPopup(item)}
                />
              </div>

              <div className="popular-food-details">
                <span className="popular-food-name">{item.name}</span>
                <br />
                <span className="popular-food-ingredients">
                  {Array.isArray(item.ingredients)
                    ? item.ingredients.join(", ")
                    : "N/A"}
                </span>
                <br />
                <div className="popular-food-price">
                  <FaRupeeSign /> {item.price}
                </div>
                <div className="quantity-contrainer">
                  {qty > 0 ? (
                    <div className="counter">
                      <button
                        className="counter-btn"
                        onClick={() => updateQuantity(item, -1)}
                      >
                        -
                      </button>

                      <span className="counter-value">{qty}</span>

                      <button
                        className="counter-btn"
                        onClick={() => updateQuantity(item, 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => updateQuantity(item, 1)}>
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedFood && (
        <ViewSelectedFood selectedFood={selectedFood} closePopup={closePopup} />
      )}
    </div>
  );
}
