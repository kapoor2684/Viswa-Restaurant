import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Index.css";
import backgroundImg from "../../Assests/background-image.jpg"; // Add your background image
import deliveryIcon from "../../Assests/delivery.png"; // Add your delivery icon
import tableIcon from "../../Assests/table-icon.png"; // Add your table booking icon

export default function Index() {
    const navigate = useNavigate();

    return (
        <div className="index-container">
            {/* Background Floating Image */}
            <div className="background-overlay">
                <img src={backgroundImg} alt="Restaurant Background" className="floating-image" />
            </div>

            {/* Content */}
            <div className="index-content">
                <h1 className="index-title">Welcome to Viswa Restaurant</h1>
                <p className="index-subtitle">Choose your preferred service</p>

                {/* Options */}
                <div className="options-container">
                    <div className="option-card" onClick={() => navigate("/customer")}>
                        <img src={deliveryIcon} alt="Delivery" className="option-icon" />
                        <p>Delivery</p>
                    </div>

                    <div className="option-card" onClick={() => navigate("/bookingoption")}>
                        <img src={tableIcon} alt="Reservation" className="option-icon" />
                        <p>Reservation</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
