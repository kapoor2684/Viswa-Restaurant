import React, { useState } from "react";
import PartyHall from "./PartyHall";  // Import PartyHall component
import BookTable from "./BookTable";  // Import BookTable component
import "../../../Styles/BookingOptions.css";

export default function BookingOptions() {
    const [selectedOption, setSelectedOption] = useState("party");

    return (
        <div className="booking-options-page">
            <div className="booking-options-container">
                {/* Selection Buttons */}
                <div className="booking-option-buttons">
                    <button className={selectedOption === "party" ? "active" : ""} onClick={() => setSelectedOption("party")}>
                        Party Hall
                    </button>
                    <button className={selectedOption === "table" ? "active" : ""} onClick={() => setSelectedOption("table")}>
                        Book Table
                    </button>
                </div>

                {/* Display Selected Section */}
                <div className="booking-option-section">
                    {selectedOption === "party" && <PartyHall />}
                    {selectedOption === "table" && <BookTable />}
                    {!selectedOption && <p className="info-text">Please select an option above.</p>}
                </div>
            </div>
        </div>
    );
}
