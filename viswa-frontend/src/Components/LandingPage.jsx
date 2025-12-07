import React from "react";
import { NavLink } from "react-router-dom";

import "../Styles/LandingPage.css";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <NavLink to="/indexpage" className="nav-link">
                <div className="customer-section">
                    <h2>Customer</h2>
                    <p>Explore restaurants and order your favorite meals!</p>
                </div>
            </NavLink>

            <NavLink to="/restaurateur" className="nav-link">

                <div className="restaurateur-section">
                    <h2>Restaurateur</h2>
                    <p>Manage your restaurant and reach more customers!</p>
                </div>
            </NavLink>
        </div>
    );
};

export default LandingPage;
