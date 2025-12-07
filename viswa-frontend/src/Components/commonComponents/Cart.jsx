import React, { useState, useEffect } from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";
import "../../Styles/cart.css";
import CartApi from "../../API/CartApi";
import CustomerApi from "../../API/CustomerApi";
import WalletApi from "../../API/WalletApi";
import orderApi from "../../API/orderAPI";

export default function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const loadWallet = async () => {
    try {
      const money = await WalletApi.getWalletBalance(user.id);
      setWalletBalance(money);
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
  };

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
    setUser(storedUser);
  }, []);

  // Load Cart
  const loadCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await CustomerApi.getCartItems(user.id);
      setCartData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error loading cart:", error);
      setLoading(false);
    }
  };

  // Load Addresses
  const loadAddresses = async () => {
    try {
      if (!user) return;

      const response = await CustomerApi.customerAllAddresses(user.id);
      setAddresses(response);
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address before placing order.");
      return;
    }

    if (!cartData || cartData.foodItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      // CALCULATE FINAL AMOUNT
      const finalAmount =
        cartData.grandTotal +
        cartData.grandTotal * 0.025 +
        cartData.grandTotal * 0.025 -
        cartData.grandTotal * 0.10 +
        50;

      // CHECK WALLET BALANCE
      if (walletBalance < finalAmount) {
        alert("Insufficient Wallet Balance. Please add money!");
        return;
      }

      // DEDUCT WALLET MONEY FIRST

      // CREATE ORDER PAYLOAD
      const orderPayload = {
        customerId: user.id,
        customerName: user.username,
        phone: user.phone,
        orderDate: new Date(),
        addressId: selectedAddress,
        paymentMethod: "WALLET",
        paymentStatus: "PAID",
        totalAmount: finalAmount,
        status: "PENDING",
        deliveryInstructions: "",
        orderItems: cartData.foodItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log("ORDER PAYLOAD:", orderPayload);

      const response = await orderApi.createOrder(orderPayload);

      await WalletApi.deductMoney(user.id, finalAmount);

      alert("Order placed successfully using wallet money!");
      console.log("ORDER RESPONSE:", response);

    } catch (error) {
      console.error("Order placing error:", error);
      alert("Failed to place order!");
    }
  };

  // Run on user load
  useEffect(() => {
    if (user) {
      loadCart();
      loadAddresses();
      loadWallet();   // <-- MISSING LINE (IMPORTANT)
    }
  }, [user]);


  // Update quantity
  const updateQuantity = async (itemId, delta) => {
    try {
      if (delta > 0) {
        await CartApi.addCartItem(user.id, itemId);
      } else {
        await CartApi.removeCartItem(user.id, itemId);
      }
      loadCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  if (loading || !cartData) {
    return <p className="cart-loading">Loading cart...</p>;
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Your Cart</h2>

      {/* ====================== ADDRESS SECTION ===================== */}
      <div className="address-section">
        <h3>Select Delivery Address</h3>

        {addresses.length === 0 ? (
          <p className="no-address-text">No saved addresses found.</p>
        ) : (
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="address-dropdown"
          >
            <option value="">-- Select Address --</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.addressLine1}, {addr.addressLine2}, {addr.city}, {addr.state} - {addr.postalCode}  {addr.country}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ====================== SHOW WARNING IF NO ADDRESS ===================== */}
      {!selectedAddress && (
        <p className="select-address-warning">
          Please select an address to view your cart items.
        </p>
      )}

      {/* ====================== ONLY SHOW CART IF ADDRESS SELECTED ===================== */}
      {selectedAddress && (
        <>
          {/* Food Items */}
          <div className="cart-items">
            {cartData.foodItems.length === 0 ? (
              <p className="empty-cart-text">Your cart is empty!</p>
            ) : (
              cartData.foodItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>
                      <LiaRupeeSignSolid /> {item.price}
                    </p>
                  </div>

                  <div className="cart-qty-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ₹ {item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {/* Summary */}
          <div className="cart-summary">
            <div className="wallet-info">
              <h4>Your Wallet Balance: ₹ {walletBalance.toFixed(2)}</h4>
            </div>

            <div className="summary-row">
              <span>Total Items:</span>
              <b>{cartData.totalQuantity}</b>
            </div>

            <div className="summary-row">
              <span>Grand Total:</span>
              <b>₹ {cartData.grandTotal.toFixed(2)}</b>
            </div>

            {/* TAXES */}
            <div className="summary-row">
              <span>CGST (2.5%):</span>
              <b>₹ {(cartData.grandTotal * 0.025).toFixed(2)}</b>
            </div>

            <div className="summary-row">
              <span>SGST (2.5%):</span>
              <b>₹ {(cartData.grandTotal * 0.025).toFixed(2)}</b>
            </div>

            {/* DISCOUNT */}
            <div className="summary-row">
              <span>Discount (10%):</span>
              <b className="discount">- ₹ {(cartData.grandTotal * 0.10).toFixed(2)}</b>
            </div>

            {/* DELIVERY CHARGE */}
            <div className="summary-row">
              <span>Delivery Charge:</span>
              <b>₹ 50.00</b>
            </div>

            {/* FINAL PAY AMOUNT */}
            <div className="summary-row total-pay">
              <span>Pay Amount:</span>
              <b>
                ₹ {(
                  cartData.grandTotal +
                  cartData.grandTotal * 0.025 +
                  cartData.grandTotal * 0.025 -
                  cartData.grandTotal * 0.10 +
                  50
                ).toFixed(2)}
              </b>
            </div>

            <button className="order-now-btn" onClick={placeOrder}>
              Proceed to Checkout
            </button>
          </div>

        </>
      )}
    </div>
  );
}
