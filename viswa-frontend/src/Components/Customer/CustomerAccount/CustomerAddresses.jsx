import React, { useEffect, useState } from "react"; 
import { ToastContainer, toast } from 'react-toastify';
import "../../../Styles/CustomerAddresses.css";
import CustomerApi from '../../../API/CustomerApi'; // Assuming your API abstraction
import AddressesApi from "../../../API/AddressesApi";

export default function CustomerAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false,
    });
    const [user, setUser] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [addressData, setAddressData] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
        setUser(storedUser);
    }, []);
    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = () => {
        CustomerApi.customerAllAddresses(user.id)
            .then(res => setAddresses(res))
            .catch(err => {
                toast("Failed to load addresses.");
                console.error(err);
            });
    };

    // Open Add Address Popup with empty fields
    const openAddPopup = () => {
        setNewAddress({
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: false,
        });
        setIsAddPopupOpen(true);
    };

    // Add New Address API call
    const handleAddAddress = async () => {
        if (!newAddress.addressLine1.trim()) {
            toast("Please enter Address Line 1");
            return;
        }
        if (!newAddress.city.trim() || !newAddress.state.trim() || !newAddress.postalCode.trim() || !newAddress.country.trim()) {
            toast("Please fill all required fields");
            return;
        }
        try {
            const addressToAdd = { ...newAddress, customerId: user.id };
            const res = await AddressesApi.addAddress(addressToAdd);
            setAddresses(prev => [...prev, res]);
            setIsAddPopupOpen(false);
            toast("Address added successfully!");
        } catch (error) {
            console.error("Add address failed:", error);
            toast("Failed to add address");
        }
    };

    // Open Edit Popup
    const handleEditAddress = (index) => {
        setEditingIndex(index);
        setAddressData({ ...addresses[index] });
        setIsPopupOpen(true);
    };

    // Save Edited Address API call
    const handleSaveAddress = async () => {
        if (!addressData.addressLine1.trim()) {
            toast("Address Line 1 cannot be empty!");
            return;
        }
        if (!addressData.city.trim() || !addressData.state.trim() || !addressData.postalCode.trim() || !addressData.country.trim()) {
            toast("Please fill all required fields");
            return;
        }
        try {
            const res = await AddressesApi.updateAddress(addressData.id, addressData);
            setAddresses(prev => {
                const updated = [...prev];
                updated[editingIndex] = res;
                return updated;
            });
            setIsPopupOpen(false);
            toast("Address updated successfully!");
        } catch (error) {
            console.error("Update address failed:", error);
            toast("Failed to update address");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeletePopupOpen(true);
    };

    // Delete Address API call
    const confirmDeleteAddress = async () => {
        try {
            await AddressesApi.deleteAddress(deleteId); // Assuming consistent API here
            setAddresses(prev => prev.filter(addr => addr.id !== deleteId));
            setIsDeletePopupOpen(false);
            toast("Address deleted successfully!");
        } catch (error) {
            console.error("Delete failed:", error);
            toast("Failed to delete address");
        }
    };

    return (
        <div className="addresses-container">
            <h3>Select Your Address</h3>
            <div className="addresses-grid">
                {addresses.filter(addr => addr && addr.addressLine1).map((addr, index) => (
                    <div key={addr.id || index} className="address-card">
                        <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p>{addr.country}</p>
                        <div className="button-group">
                            <button className="edit-btn" onClick={() => handleEditAddress(index)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDeleteClick(addr.id)}>Delete</button>
                        </div>
                    </div>
                ))}

                <div className="address-card add-new" onClick={openAddPopup}>
                    <h4>+ Add New Address</h4>
                </div>
            </div>

            {/* Edit Address Popup */}
            {isPopupOpen && addressData && (
                <div className="edit-popup-overlay" onClick={() => setIsPopupOpen(false)}>
                    <div className="edit-popup-content" onClick={e => e.stopPropagation()}>
                        <span className="edit-popup-title">Edit Address</span>

                        <input
                            type="text"
                            placeholder="Address Line 1"
                            value={addressData.addressLine1}
                            onChange={e => setAddressData({ ...addressData, addressLine1: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address Line 2"
                            value={addressData.addressLine2}
                            onChange={e => setAddressData({ ...addressData, addressLine2: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={addressData.city}
                            onChange={e => setAddressData({ ...addressData, city: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={addressData.state}
                            onChange={e => setAddressData({ ...addressData, state: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Postal Code"
                            value={addressData.postalCode}
                            onChange={e => setAddressData({ ...addressData, postalCode: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={addressData.country}
                            onChange={e => setAddressData({ ...addressData, country: e.target.value })}
                            required
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={addressData.isDefault}
                                onChange={e => setAddressData({ ...addressData, isDefault: e.target.checked })}
                            />
                            Set as default address
                        </label>

                        <div className="edit-popup-buttons">
                            <button onClick={handleSaveAddress}>Save</button>
                            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Address Popup */}
            {isAddPopupOpen && (
                <div className="edit-popup-overlay" onClick={() => setIsAddPopupOpen(false)}>
                    <div className="edit-popup-content" onClick={e => e.stopPropagation()}>
                        <span className="edit-popup-title">Add New Address</span>

                        <input
                            type="text"
                            placeholder="Address Line 1"
                            value={newAddress.addressLine1}
                            onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address Line 2"
                            value={newAddress.addressLine2}
                            onChange={e => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Postal Code"
                            value={newAddress.postalCode}
                            onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={newAddress.country}
                            onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                            required
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={newAddress.isDefault}
                                onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                            />
                            Set as default address
                        </label>

                        <div className="edit-popup-buttons">
                            <button onClick={handleAddAddress}>Add</button>
                            <button onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Popup */}
            {isDeletePopupOpen && (
                <div className="edit-popup-overlay" onClick={() => setIsDeletePopupOpen(false)}>
                    <div className="edit-popup-content" onClick={e => e.stopPropagation()}>
                        <span className="edit-popup-title">Confirm Deletion</span>
                        <p>Are you sure you want to delete this address?</p>
                        <div className="edit-popup-buttons">
                            <button onClick={confirmDeleteAddress} className="delete-confirm-btn">Yes, Delete</button>
                            <button onClick={() => setIsDeletePopupOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
