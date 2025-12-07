import React, { useState, useEffect, useRef } from "react";
import logo from "../../Assests/logo1.png";
import defaultimage from "../../Assests/default profile.jpg";
import { FaOpencart } from "react-icons/fa6";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Cart from "./Cart";
import { FooditemsURL } from "./AllURLs";
import "../../Styles/ApplicationHeader.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import CartApi from "../../API/CartApi";
import { useNavigate } from "react-router-dom";

export default function ApplicationHeader() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const searchRef = useRef(null);

  // Load user
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("IsloggedInUser") === "true";
    setUserLoggedIn(isLoggedIn);

    const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
    setUser(storedUser);
  }, []);

  // Fetch cart from API
  useEffect(() => {
    if (!user) return;

    const fetchCartData = async () => {
      try {
        const cartData = await CartApi.getCartItemsByCustomer(user.id);

        const cartMap = {};
        cartData.forEach(item => {
          cartMap[item.itemId] = {
            id: item.itemId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice
          };
        });

        setCart(cartMap);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartData();
  }, [user]);

  // Fetch food items
  useEffect(() => {
    axios
      .get(FooditemsURL)
      .then(res => setFoodItems(res.data))
      .catch(err => console.error("Food fetch error:", err));
  }, []);

  // Filter search results
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFoods([]);
      return;
    }

    const filtered = foodItems
      .map(food => ({
        ...food,
        quantity: cart[food.id]?.quantity || 0
      }))
      .filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    setFilteredFoods(filtered);
  }, [searchQuery, foodItems, cart]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add/remove item from cart (API + UI update)
  const updateQuantity = async (item, change) => {
    if (!user) return;

    const currentQty = cart[item.id]?.quantity || 0;
    const newQty = currentQty + change;

    try {
      if (newQty > 0) {
        await CartApi.addCartItem(user.id, item.id);

        setCart(prev => ({
          ...prev,
          [item.id]: {
            ...prev[item.id],
            id: item.id,
            quantity: newQty
          }
        }));
      } else {
        await CartApi.removeCartItem(user.id, item.id);

        setCart(prev => {
          const updated = { ...prev };
          delete updated[item.id];
          return updated;
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-logo-search">
          <img src={logo} alt="logo" className="logo" />

          {/* ---------- SEARCH BAR ---------- */}
          <div className="header-search-bar" ref={searchRef}>
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <div className="search-results">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map(food => (
                    <div key={food.id} className="search-item">
                      <div className="items-all-details">
                        <img src={food.image} alt={food.name} className="search-item-image" />
                        <span className="search-item-detail">
                          <span>{food.name}</span>
                          <span>
                            <LiaRupeeSignSolid /> {food.price}
                          </span>
                        </span>
                      </div>

                      {cart[food.id]?.quantity > 0 ? (
                        <div className="search-counter">
                          <button
                            className="search-counter-btn"
                            onClick={() => updateQuantity(food, -1)}
                          >
                            -
                          </button>

                          <span className="search-counter-value">
                            {cart[food.id].quantity}
                          </span>

                          <button
                            className="search-counter-btn"
                            onClick={() => updateQuantity(food, 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div
                          className="search-item-add"
                          onClick={() => updateQuantity(food, 1)}
                        >
                          Add
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-results">No food found.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---------- CART & PROFILE ---------- */}
        <div className="header-btns-cart">
          <div className="food-cart" onClick={() => navigate("/cart")}>
            <FaOpencart />
          </div>

          {userLoggedIn ? (
            <NavLink to="/customeraccount">
              <img
                src={user.image || defaultimage}
                alt="user"
                className="loguser-image"
              />
            </NavLink>
          ) : (
            <NavLink to="/registrationform" className="login-btn">
              Login
            </NavLink>
          )}
        </div>
      </header>

    </>
  );
}
