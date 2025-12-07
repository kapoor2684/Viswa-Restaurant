import React, { useState, useEffect } from "react";
import {
  FaUtensils, FaCalendarCheck, FaClipboardList,
  FaPlus, FaClock, FaCheckCircle, FaTimes, FaTable, FaBars
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { PiBowlFoodBold } from "react-icons/pi";
import logo from "../../Assests/logo1.png";
import AllOrders from "./AllOrders";
import AddCategory from "./AddCategory";
import ManageFoodItems from "./ManageFoodItems";
import ManageCategories from "./ManageCategories";
import AddFood from "./AddFood";
import PendingOrders from "./PendingOrders";
import CompletedOrders from "./CompletedOrders";
import CanceledOrders from "./CanceledOrders";
import "../../Styles/RestaurateurDashboard.css";

const RestaurateurDashboard = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "AllOrders"
  );
  const [openDropdown, setOpenDropdown] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to manage sidebar visibility

  // Save the activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Function to handle dropdown toggling
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? "" : dropdownName);
  };

  // Function to get the current date in DD/Mon/YYYY format
  const getCurrentDate = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const year = now.getFullYear();
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  // Function to get the current time in HH:MM:SS AM/PM format
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="restaurateur-dashboard-container">
      {/* Menu Icon */}
      <div className="menu-icon">
  {isSidebarVisible ? (
    <AiOutlineClose  onClick={() => setIsSidebarVisible(false)} /> // Close icon when sidebar is visible
  ) : (
    <FaBars onClick={() => setIsSidebarVisible(true)} /> // Menu icon when sidebar is hidden
  )}
</div>

      {/* Sidebar */}
      <aside className={`restaurateur-sidebar ${isSidebarVisible ? "active" : ""}`}>
        {/* Profile Section */}
        <div className="profile-section">
          <img src={logo} alt="logo" className="profile-icon" />
          <span>{currentTime}, {getCurrentDate()}</span>
        </div>

        {/* Sidebar Options */}
        <ul>
          {/* All Orders */}
          <li className={activeTab === "AllOrders" ? "active" : ""} onClick={() => setActiveTab("AllOrders")}>
            <FaClipboardList /> All Orders
          </li>

          {/* Today's Orders Dropdown */}
          <li className="dropdown">
            <div
              className={`dropdown-header ${openDropdown === "TodayOrders" ? "active" : ""}`}
              onClick={() => toggleDropdown("TodayOrders")}
            >
              <FaClipboardList /> Today’s Orders
            </div>

            {openDropdown === "TodayOrders" && (
              <ul className="dropdown-menu">
                <li className={activeTab === "PendingOrders" ? "active" : ""} onClick={() => setActiveTab("PendingOrders")}>
                  <FaClock /> Pending Orders
                </li>
                <li className={activeTab === "CompletedOrders" ? "active" : ""} onClick={() => setActiveTab("CompletedOrders")}>
                  <FaCheckCircle /> Completed Orders
                </li>
                <li className={activeTab === "CanceledOrders" ? "active" : ""} onClick={() => setActiveTab("CanceledOrders")}>
                  <FaTimes /> Canceled Orders
                </li>
              </ul>
            )}
          </li>

          {/* Add Item Dropdown */}
          <li className="dropdown">
            <div className={`dropdown-header ${openDropdown === "AddItem" ? "active" : ""}`} onClick={() => toggleDropdown("AddItem")}>
              <FaPlus /> Add Item
            </div>

            {openDropdown === "AddItem" && (
              <ul className="dropdown-menu">
                <li className={activeTab === "AddFood" ? "active" : ""} onClick={() => setActiveTab("AddFood")}>
                  <FaPlus /> New Food
                </li>
                <li className={activeTab === "AddCategory" ? "active" : ""} onClick={() => setActiveTab("AddCategory")}>
                  <FaPlus /> New Category
                </li>
              </ul>
            )}
          </li>

          {/* Manage Food Dropdown */}
          <li className="dropdown">
            <div className={`dropdown-header ${openDropdown === "ManageFood" ? "active" : ""}`} onClick={() => toggleDropdown("ManageFood")}>
              <FaUtensils /> Manage item
            </div>

            {openDropdown === "ManageFood" && (
              <ul className="dropdown-menu">
                <li className={activeTab === "ManageFoodItems" ? "active" : ""} onClick={() => setActiveTab("ManageFoodItems")}>
                  <PiBowlFoodBold /> Manage Foods
                </li>
                <li className={activeTab === "ManageCategories" ? "active" : ""} onClick={() => setActiveTab("ManageCategories")}>
                  <FaClipboardList /> Manage Categories
                </li>
              </ul>
            )}
          </li>

          {/* Reservation Dropdown */}
          <li className="dropdown">
            <div className={`dropdown-header ${openDropdown === "Reservation" ? "active" : ""}`} onClick={() => toggleDropdown("Reservation")}>
              <FaCalendarCheck /> Reservations
            </div>

            {openDropdown === "Reservation" && (
              <ul className="dropdown-menu">
                <li className={activeTab === "TableReservation" ? "active" : ""} onClick={() => setActiveTab("TableReservation")}>
                  <FaTable /> Table
                </li>
                <li className={activeTab === "PartyHallReservation" ? "active" : ""} onClick={() => setActiveTab("PartyHallReservation")}>
                  <FaCalendarCheck /> Party Hall
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content" onClick={()=>{setIsSidebarVisible(false)}}>
        {activeTab === "PendingOrders" && <PendingOrders />}
        {activeTab === "CompletedOrders" && <CompletedOrders />}
        {activeTab === "CanceledOrders" && <CanceledOrders />}
        {activeTab === "AllOrders" && <AllOrders />}
        {activeTab === "AddFood" && <AddFood />}
        {activeTab === "AddCategory" && <AddCategory />}
        {activeTab === "ManageFoodItems" && <ManageFoodItems />}
        {activeTab === "ManageCategories" && <ManageCategories />}
        {activeTab === "TableReservation" && <TableReservation />}
        {activeTab === "PartyHallReservation" && <PartyHallReservation />}
      </main>
    </div>
  );
};

// Dummy Components
const TableReservation = () => <div><h2>Table Reservations</h2><p>Manage table bookings.</p></div>;
const PartyHallReservation = () => <div><h2>Party Hall Reservations</h2><p>Manage party hall bookings.</p></div>;

export default RestaurateurDashboard;