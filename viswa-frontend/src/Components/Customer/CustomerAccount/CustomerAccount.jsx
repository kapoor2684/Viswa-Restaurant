import React, { useState, useEffect } from 'react';
import CustomerProfile from "./CustomerProfile";
import Orders from "./Orders";
import CustomerAddresses from "./CustomerAddresses";
import { ToastContainer, toast } from 'react-toastify';
import "../../../Styles/CustomerAccount.css";
import { NavLink, useNavigate } from 'react-router-dom';
import ConfirmPopup from '../../commonComponents/ConfirmPopup'; // Import the ConfirmPopup component

export default function CustomerAccount() {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // State to control popup visibility
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
    setUser(storedUser);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("IsloggedInUser");
    toast("Logged out successfully!");
    navigate("/customer");
  };

  const handleLogoutClick = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirmPopup(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="customer-account-container">
      <div className="customer-personal-details">
        <span>{user?.username}</span> <br />
        <span>{user?.email}</span>
      </div>

      <div className="customer-account-details-container">
        <div className='account-aside'>
          <NavLink className={selectedTab === "profile" ? "active-tab" : ""} onClick={() => setSelectedTab("profile")}>Profile</NavLink>
          <NavLink className={selectedTab === "orders" ? "active-tab" : ""} onClick={() => setSelectedTab("orders")}>Orders</NavLink>
          <NavLink className={selectedTab === "addresses" ? "active-tab" : ""} onClick={() => setSelectedTab("addresses")}>Addresses</NavLink>
          <NavLink className={selectedTab === "settings" ? "active-tab" : ""} onClick={() => setSelectedTab("settings")}>Settings</NavLink>
          <span onClick={handleLogoutClick} className='logout-btn'>Logout</span>
        </div>

        <div className='account-section'>
          {selectedTab === "profile" && <CustomerProfile />}
          {selectedTab === "orders" && <Orders />}
          {selectedTab === "addresses" && <CustomerAddresses />}
          {selectedTab === "settings" && <Settings />}
        </div>
      </div>

      {/* Confirm Popup */}
      {showConfirmPopup && (
        <ConfirmPopup
          message="Are you sure you want to logout?"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}

      <ToastContainer />
    </div>
  );
}

// Profile Component
const Settings = () => <div><h2>Account Settings</h2></div>;