import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "../../../Styles/BookTable.css";
import ReservationApi from "../../../API/ReservationApi";

const BookTable = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null)
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
        setUser(storedUser)
    }, []);


    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [bookingDates, setBookingDates] = useState([]);
    const [allReservations, setAllReservations] = useState([]);
    const [formData, setFormData] = useState({
        customerId: "",
        name: "",
        contact: "",
        email: "",
        bookingDate: "",
        time: "",
        guests: "1",
        selectedTable: null,
    });

    useEffect(() => {
        if (user && user.id !== formData.customerId) {
            setFormData(prev => ({
                ...prev,
                customerId: user.id
            }));
        }
    }, [user]);

    // Fetch all reservations when the component mounts
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const day = String(today.getDate()).padStart(2, "0");
                const formattedDate = `${year}-${month}-${day}`;
                const reservations = await ReservationApi.allBookedTables(formattedDate);
                setAllReservations(reservations);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };
        fetchReservations();
    }, []);

    // Generate the next 7 days
    useEffect(() => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i);
            const year = futureDate.getFullYear();
            const month = String(futureDate.getMonth() + 1).padStart(2, "0");
            const day = String(futureDate.getDate()).padStart(2, "0");
            dates.push(`${year}-${month}-${day}`); // Format: YYYY-MM-DD
        }
        setBookingDates(dates);
        setFormData((prev) => ({ ...prev, bookingDate: dates[0] })); // Set default date
    }, []);

    const isTableBooked = (tableNumber) => {
        return allReservations.some((reservation) => {
            if (reservation.selectedTable === tableNumber) {
                const reservationDateTime = new Date(`${reservation.bookingDate}T${reservation.time}:00`);
                const formDateTime = new Date(`${formData.bookingDate}T${formData.time}:00`);
                const threeHoursLater = new Date(reservationDateTime.getTime() + 3 * 60 * 60 * 1000);

                // Check if the selected date and time fall within the 3-hour window
                return formDateTime >= reservationDateTime && formDateTime <= threeHoursLater;
            }
            return false;
        });
    };

    // Handle table selection
    const handleTableSelect = (tableNumber) => {
        if (isTableBooked(tableNumber)) {
            toast("This table is already booked for the selected date and time.");
            return;
        }
        setSelectedTable(tableNumber);
        setFormData((prev) => ({ ...prev, selectedTable: tableNumber }));
        setPopupOpen(false);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.selectedTable) {
            toast("Please select a table before booking.");
            return;
        }
        if (user === null) {
            navigate("/registrationform");
            return;
        }

        if (isTableBooked(formData.selectedTable)) {
            toast("This table is already booked for the selected date and time.");
            return;
        }

        try {
             const result = await ReservationApi.reserveTable(formData);
            toast("Table booked successfully!");
            setFormData({
                customerId: user.id,
                name: "",
                contact: "",
                email: "",
                bookingDate: bookingDates[0],
                time: "",
                guests: "1",
                selectedTable: null,
            });
            setSelectedTable(null);
        } catch (error) {
            toast("Failed to book the table. Please try again.");
        }
    };


    return (
        <div className="book-table">
            <span>Book a Table</span>
            <br /><br />
            <form onSubmit={handleSubmit}>
                <div className="booking-info-row">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} placeholder="Enter name..." onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} placeholder="Enter email..." onChange={handleChange} required />
                </div>

                <div className="booking-info-row">
                    <label>Contact Number:</label>
                    <input type="tel" name="contact" value={formData.contact} placeholder="Enter no..." onChange={handleChange} required />

                    <label>Guests Number:</label>
                    <select name="guests" value={formData.guests} onChange={handleChange} required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                    </select>
                </div>

                <div className="booking-info-row">
                    <label>Date:</label>
                    <select name="bookingDate" value={formData.bookingDate} onChange={handleChange} required>
                        {bookingDates.map((date, index) => (
                            <option key={index} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>

                    <label>Time:</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>

                <button type="button" onClick={() => setPopupOpen(true)}>Select Table</button>
                {selectedTable && <p>Selected Table: {selectedTable}</p>}

                <button type="submit">Book Now</button>
            </form>

            {isPopupOpen && (
                <div className="restaurant-popup" onClick={() => setPopupOpen(false)}>
                    <div className="restaurant-layout">
                        <div className="item reception-counter">
                            <span>Counter</span>
                        </div>
                        <div className="item entry-point">
                            <span>Entry</span>
                        </div>
                        <div className="item washroom">
                            <span>Washroom</span>
                        </div>

                        <div className="item dining-area">
                            <span style={{ color: "#FFB100" }}>Dining area</span>

                            <div className="first-row">
                                <div key="1"
                                    className={`row-table ${selectedTable === 1 ? "selected" : ""} ${isTableBooked(1) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(1) && handleTableSelect(1)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">1</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>


                                <div key="2"
                                    className={`row-table ${selectedTable === 2 ? "selected" : ""} ${isTableBooked(2) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(2) && handleTableSelect(2)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table fourchair">2</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>
                                <div key="3"
                                    className={`row-table ${selectedTable === 3 ? "selected" : ""} ${isTableBooked(3) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(3) && handleTableSelect(3)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">3</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="4"
                                    className={`row-table ${selectedTable === 4 ? "selected" : ""} ${isTableBooked(4) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(4) && handleTableSelect(4)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table sixchair">4</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>
                                <div key="5"
                                    className={`row-table ${selectedTable === 5 ? "selected" : ""} ${isTableBooked(5) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(5) && handleTableSelect(5)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table fourchair">5</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>


                            </div>

                            <div className="first-row">

                                <div key="6"
                                    className={`row-table ${selectedTable === 6 ? "selected" : ""} ${isTableBooked(6) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(6) && handleTableSelect(6)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table fourchair">6</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="7"
                                    className={`row-table ${selectedTable === 7 ? "selected" : ""} ${isTableBooked(7) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(7) && handleTableSelect(7)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">7</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="8"
                                    className={`row-table ${selectedTable === 8 ? "selected" : ""} ${isTableBooked(8) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(8) && handleTableSelect(8)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table fourchair">8</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="9"
                                    className={`row-table ${selectedTable === 9 ? "selected" : ""} ${isTableBooked(9) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(9) && handleTableSelect(9)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">9</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="10"
                                    className={`row-table ${selectedTable === 10 ? "selected" : ""} ${isTableBooked(10) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(10) && handleTableSelect(10)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table sixchair">10</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>

                            </div>

                            <div className="first-row">
                                <div key="11"
                                    className={`row-table ${selectedTable === 11 ? "selected" : ""} ${isTableBooked(11) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(11) && handleTableSelect(11)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">11</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="12"
                                    className={`row-table ${selectedTable === 12 ? "selected" : ""} ${isTableBooked(12) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(12) && handleTableSelect(12)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table sixchair">12</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>
                                <div key="13"
                                    className={`row-table ${selectedTable === 13 ? "selected" : ""} ${isTableBooked(13) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(13) && handleTableSelect(13)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">13</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="14" className={`row-table ${selectedTable === 14 ? "selected" : ""} ${isTableBooked(14) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(14) && handleTableSelect(14)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table fourchair">14</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="15"
                                    className={`row-table ${selectedTable === 15 ? "selected" : ""} ${isTableBooked(15) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(15) && handleTableSelect(15)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">15</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="first-row">

                                <div key="16"
                                    className={`row-table ${selectedTable === 16 ? "selected" : ""} ${isTableBooked(16) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(16) && handleTableSelect(16)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table sixchair">16</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="17"
                                    className={`row-table ${selectedTable === 17 ? "selected" : ""} ${isTableBooked(17) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(17) && handleTableSelect(17)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table fourchair">17</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="18"
                                    className={`row-table ${selectedTable === 18 ? "selected" : ""} ${isTableBooked(18) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(18) && handleTableSelect(18)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">18</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="19"
                                    className={`row-table ${selectedTable === 19 ? "selected" : ""} ${isTableBooked(19) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(19) && handleTableSelect(19)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                    <div className="middle-side">
                                        <span className="table fourchair">19</span>
                                    </div>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                        <span className="chair"></span>
                                    </div>
                                </div>

                                <div key="20"
                                    className={`row-table ${selectedTable === 20 ? "selected" : ""} ${isTableBooked(20) ? "bookedtable" : ""}`}
                                    onClick={() => !isTableBooked(20) && handleTableSelect(20)}>
                                    <div className="left-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                    <span className="table twochair">20</span>
                                    <div className="right-side-chair">
                                        <span className="chair"></span>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div class="item kitchen-area">
                            <span>kitchen</span>
                        </div>
                        <div class="item party-hall">
                            <span>party hall</span>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default BookTable;