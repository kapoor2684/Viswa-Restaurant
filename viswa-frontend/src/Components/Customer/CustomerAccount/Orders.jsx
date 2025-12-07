import React, { useEffect, useState } from "react";
import axios from "axios";
import {Customer_order_URL} from "../../commonComponents/AllURLs";
import "../../../Styles/Orders.css";

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Load user from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setUser(storedUser);
        } else {
            setLoading(false); 
        }
    }, []);

    // Fetch orders only after user is loaded
    useEffect(() => {
        if (!user) return;   

        axios.get(Customer_order_URL)
            .then((res) => {
                const filteredOrders = res.data.filter(order => order.customerId === user.id);
                setOrders(filteredOrders);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });
    }, [user]); 

    return (
        <div className="orders-container">
            <div className="title">My Orders</div>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-grid">
                    {orders.map((order) => (
                        <div key={order.id} className="customer-order-card">
                            <div className="order-header">
                                <span className="order-id">Order #{order.id}</span>
                                <span className={`status ${order.orderStatus.toLowerCase()}`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <p><strong>Customer:</strong> {order.customerName}</p>
                            <p><strong>Phone:</strong> {order.phone}</p>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                            <p><strong>Payment:</strong> {order.paymentStatus}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
