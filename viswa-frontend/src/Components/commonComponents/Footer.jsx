import React from "react";
import logo from "../../Assests/logo1.png";

import "../../Styles/Footer.css"; // Importing the CSS file

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">

                <div className="footer-section logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="footer-section about">
                    <h3>About us</h3>
                    <p>
                    "At Viswa Restaurant, we blend rich flavors with heartfelt hospitality to create an unforgettable dining experience. From traditional recipes to modern delights, every dish is crafted with passion and perfection. Come, savor the taste of excellence!" 🍽️✨

                    </p>
                </div>

                {/* Section 2: Address */}
                <div className="footer-section address">
                    <h3>Our Address</h3>
                    <p>123 XXXXXX Street</p>
                    <p>XXXXXXX City, FL 56789</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Email: contact@viswa.com</p>
                </div>

                {/* Section 3: Opening Hours */}
                <div className="footer-section hours">
                    <h3>Opening Hours</h3>
                    <p>Monday - Friday: 10 AM - 10 PM</p>
                    <p>Saturday - Sunday: 11 AM - 12 AM</p>
                </div>
            </div>
        </footer>
    );
}
