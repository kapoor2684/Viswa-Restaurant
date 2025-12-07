import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Customer_address_URL } from "./AllURLs"
import "../../Styles/AddressPopup.css";

export default function AddressPopup({ onClose, onConfirm }) {
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    axios.get(`${Customer_address_URL}?customerId=${user.id}`)
      .then((res) => setSavedAddresses(res.data))
      .catch((error) => console.error("Error fetching addresses:", error));
  }, [user]);

  const handleConfirm = () => {
    const finalAddress = selectedAddress || address.trim();
    if (!finalAddress) {
      toast("Please enter an address!");
      return;
    }
    toast("Order placed sucessfully");
    onConfirm(finalAddress);
    onClose();
  };

  return (
    <div className="address-popup">
      <div className="address-popup-content">
        <span>Select or Enter Your Address</span>
        <div className="saved-addresses">
          {savedAddresses.length > 0 ? (
            savedAddresses.map((addr, index) => (
              <div
                key={addr.id}
                className={`address-option ${selectedAddress === addr.address ? "selectedaddress" : ""}`}
                onClick={() => {
                  setSelectedAddress(addr.address);
                  setAddress(addr.address);
                }}
              >
                {addr.address}
              </div>
            ))
          ) : (
            <p>No saved addresses found.</p>
          )}
        </div>

        <textarea
          placeholder="Enter new delivery address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setSelectedAddress(null); // Clear selection when typing a new address
          }}
          rows="3"
        />
        <div className="address-popup-buttons">
          <button className="confirm-btn" onClick={handleConfirm}>Confirm Address</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
