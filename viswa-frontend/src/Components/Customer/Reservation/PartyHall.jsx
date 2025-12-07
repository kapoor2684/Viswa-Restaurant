import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "../../../Styles/PartyHall.css";
import ReservationApi from "../../../API/ReservationApi";

const PartyHall = () => {
    const navigate = useNavigate();

    function convertDateFormat(dateStr) {
        const parts = dateStr.split("-");
        if (parts.length !== 3) {
            throw new Error("Invalid date format, expected DD-MM-YYYY");
        }
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    const [user, setUser] = useState(null)
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
        setUser(storedUser)
    }, []);


    const [formData, setFormData] = useState({
        customerId: "",
        bookingName: "",
        bookingDate: "",
        eventType: "",
        startTime: "",
        endTime: "",
        totalHours: "",
        guests: "",
        specialRequests: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
    });

    useEffect(() => {
        if (user && user.id !== formData.customerId) {
            setFormData(prev => ({
                ...prev,
                customerId: user.id
            }));
        }
    }, [user]);

    const [bookingDates, setBookingDates] = useState([]);

    useEffect(() => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i); // Increment day

            const day = String(futureDate.getDate()).padStart(2, "0");
            const month = String(futureDate.getMonth() + 1).padStart(2, "0");
            const year = futureDate.getFullYear();

            dates.push(`${day}-${month}-${year}`);
        }
        setBookingDates(dates);
        setFormData((prev) => ({ ...prev, bookingDate: dates[0] }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === "startTime" || name === "totalHours") {
            calculateEndTime(name === "startTime" ? value : formData.startTime,
                name === "totalHours" ? value : formData.totalHours);
        }
    };

    const calculateEndTime = (startTime, totalHours) => {
        if (startTime && totalHours) {
            let [hours, minutes] = startTime.split(":").map(Number);
            hours += Number(totalHours);

            if (hours >= 24) hours -= 24; // Handle day rollover

            const formattedEndTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
            setFormData((prev) => ({ ...prev, endTime: formattedEndTime }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                bookingDate: convertDateFormat(formData.bookingDate)
            };
            const response = await ReservationApi.reservePartyHall(submitData);
            console.log("Party hall booked successfully:", response.data);
            toast.success("Party hall booked successfully!");
            navigate("/customer");
        } catch (error) {
            console.error("Error booking party hall:", error);
            toast.error("Failed to book party hall. Please try again.");
        }
    };


    return (
        <div className="party-hall-container">
            <h2>Book a Party Hall</h2>
            <form onSubmit={handleSubmit} className="party-hall-form">
                <label> Booking Name: </label>
                <input type="text" name="bookingName" value={formData.bookingName} onChange={handleChange} required />

                <div className="time-inputs">
                    <label> Event Type: </label>
                    <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                        <option value="">Select Event Type</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Event Date: </label>
                    <select name="bookingDate" value={formData.bookingDate} onChange={handleChange} required>
                        {bookingDates.map((date, index) => (
                            <option key={index} value={date}>{date}</option>
                        ))}
                    </select>
                </div>

                <label> Estimated Number of Guests: </label>
                <select name="guests" value={formData.guests} onChange={handleChange} required>
                    <option value="">Select Guests</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                </select>

                <div className="time-inputs">
                    <label> Start Time: </label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />

                    <label> Total Hours: </label>
                    <select name="totalHours" value={formData.totalHours} onChange={handleChange} required>
                        <option value="">Select Hours</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                    </select>
                </div>

                <label> Emergency Contact info: </label>
                <div className="emergency-info">
                    <input type="text" name="emergencyContactName" value={formData.emergencyContactName} placeholder="Emergency name..." onChange={handleChange} required />

                    <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} placeholder="Emergency phone..." onChange={handleChange} required />

                </div>

                <label> Special Requests: </label>
                <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} placeholder="Any additional requests..." />

                <button type="submit">Book Now</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default PartyHall;
