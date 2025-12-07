import { useEffect, useState } from "react";
import { Customer_order_URL } from "../commonComponents/AllURLs";
import "../../Styles/AllOrders.css";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterKey, setFilterKey] = useState("id"); // Column key to filter by
  const [filterValue, setFilterValue] = useState(""); // Value to filter by

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(Customer_order_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle filter input change
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  // Handle clicking on a table header to set the filter key
  const handleHeaderClick = (key) => {
    setFilterKey(key); // Set the column to filter by
    setFilterValue(""); // Reset the filter value
  };

  // Filter orders based on the selected column and filter value
  const filteredOrders = orders.filter((order) => {
    if (!filterKey || !filterValue) return true; // No filter applied
    const columnValue = order[filterKey].toString().toLowerCase();
    return columnValue.includes(filterValue.toLowerCase());
  });

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="all-orders-container">
      <div className="all-orders-title">All Orders : {filteredOrders.length} {/* Filter Input */}
        <span className="filter-input-container">
          <input
            type="text"
            placeholder={`Filter by ${filterKey}...`}
            value={filterValue}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </span>
      </div>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <>
          {/* Orders Table */}
          <table className="all-orders-table">
            <thead>
              <tr>
                <th onClick={() => handleHeaderClick("id")}>Order ID</th>
                <th onClick={() => handleHeaderClick("customerName")}>Customer</th>
                <th onClick={() => handleHeaderClick("phone")}>Phone</th>
                <th onClick={() => handleHeaderClick("orderDate")}>Order Date</th>
                <th onClick={() => handleHeaderClick("address")}>Address</th>
                <th onClick={() => handleHeaderClick("orderStatus")}>Order Status</th>
                <th onClick={() => handleHeaderClick("totalAmount")}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`all-orders-card ${order.orderStatus === "Completed"
                      ? "complete-orders"
                      : order.orderStatus === "Canceled"
                        ? "canceled-orders"
                        : "pending-orders"
                    }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString("en-GB")}</td>
                  <td>{order.address}</td>
                  <td>{order.orderStatus}</td>
                  <td>₹{order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Order Details Popup */}
      {selectedOrder && (
        <div className="order-popup">
          <div className="popup-all-content" onClick={() => setSelectedOrder(null)}>
            {/* Order Title */}
            <div className="order-popup-title">
              <span>Order Details</span>
              <span>
                {new Date(selectedOrder.orderDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Customer Details */}
            <div className="popup-customer-details">
              <span>
                <strong>Order ID: <br /></strong> {selectedOrder.id}
              </span>
              <span>
                <strong>Customer: <br /></strong> {selectedOrder.customerName}
              </span>
              <span>
                <strong>Phone: <br /></strong> {selectedOrder.phone}
              </span>
            </div>
            <span>
              <strong style={{ color: "rgb(251, 194, 82)" }}>Address:</strong> {selectedOrder.address}
            </span>

            {/* Food Details Table */}
            <div className="popup-food-details">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Amount */}
            <p style={{ color: "red", fontSize: "21px" }}>
              <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;