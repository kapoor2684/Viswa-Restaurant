import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Customer_order_URL, Customer_URL } from '../commonComponents/AllURLs';
import defaultimage from '../../Assests/default profile.jpg';
import { FaRupeeSign } from 'react-icons/fa';
import { LuCookingPot } from 'react-icons/lu';
import { IoMdDoneAll } from 'react-icons/io';
import { ImCancelCircle } from 'react-icons/im';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmPopup from '../commonComponents/ConfirmPopup'; // Import the ConfirmPopup component
import '../../Styles/PendingOrders.css';

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Store the order ID for rejection

  // Fetch orders and customers from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get(Customer_order_URL);
        const pendingOrders = ordersResponse.data.filter(
          (order) => (order.orderStatus === 'Pending' || order.orderStatus === 'Preparing') &&  isCurrentDate(order.orderDate)
        );
        setOrders(pendingOrders);

        const customersResponse = await axios.get(Customer_URL);
        setCustomers(customersResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [orders]);

  function isCurrentDate(dateString) {
    const givenDate = new Date(dateString);
      const currentDate = new Date();
  
    return (
      givenDate.getFullYear() === currentDate.getFullYear() &&
      givenDate.getMonth() === currentDate.getMonth() &&
      givenDate.getDate() === currentDate.getDate()
    );
  }

  // Handle Reject button click
  const handleReject = async (orderId) => {
    setSelectedOrderId(orderId);  
    setShowPopup(true);  
  };

  // Handle confirmation from the popup
  const confirmRejection = async () => {
    if (!selectedOrderId) return;

    try {
      await axios.patch(`${Customer_order_URL}/${selectedOrderId}`, {
        orderStatus: 'Canceled',
      });
      toast.success("Order rejected successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, orderStatus: 'Canceled' } : order
        )
      );
    } catch (err) {
      console.error('Failed to reject the order:', err);
      toast.error("Failed to reject the order. Please try again.");
    } finally {
      setShowPopup(false);  
      setSelectedOrderId(null); 
    }
  };

  // Handle cancellation from the popup
  const cancelRejection = () => {
    setShowPopup(false); 
    setSelectedOrderId(null); 
  };

  // Handle Completed button click
  const handleCompleted = async (orderId) => {
    try {
      await axios.patch(`${Customer_order_URL}/${orderId}`, {
        orderStatus: 'Completed',
      });
      toast.success("Order completed successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: 'Completed' } : order
        )
      );
    } catch (err) {
      console.error('Failed to complete the order:', err);
      toast.error("Failed to complete the order. Please try again.");
    }
  };

  // Handle Preparing button click
  const handlePreparing = async (orderId) => {
    try {
      await axios.patch(`${Customer_order_URL}/${orderId}`, {
        orderStatus: 'Preparing',
      });
      toast.success("Order is started preparing!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: 'Preparing' } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  // Function to get customer image by customerId
  const getCustomerImage = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.image : '';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pending-orders-container">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className={`order-card ${
              order.orderStatus === 'Pending'
                ? 'pending-order'
                : order.orderStatus === 'Preparing'
                ? 'preparing-order'
                : ''
            }`}
          >
            <div className="order-card-row">
              <span className="order-id-no">Order ID: <span style={{color:"red"}}>#{order.id}</span></span>
              <span className="order-customer-img">
                <img
                  src={getCustomerImage(order.customerId) || defaultimage}
                  alt="C_img"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/50';
                  }}
                />
              </span>
            </div>

            <div className="order-card-row">
              <p>
                <strong>Customer: </strong>
                <br />
                {order.customerName}
              </p>
              <p>
                <strong>Phone:</strong>
                <br />
                {order.phone}
              </p>
              <p>
                <strong>Payment Method:</strong>
                <br />
                {order.paymentMethod}
              </p>
            </div>
            <div className="order-card-row">
              <p>
                <strong>Address : </strong>
                {order.address}
              </p>
            </div>
            <div className="items">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>₹ {item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₹ {item.totalPrice}</td>
                    </tr>
                  ))}
                  {/* Grand Total Row */}
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Grand Total:
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'red' }}>
                      <FaRupeeSign />
                      {order.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="actions">
              {/* Show Reject and Preparing spans for Pending orders */}
              {order.orderStatus === 'Pending' && (
                <>
                  <span className="rejection-btn" onClick={() => handleReject(order.id)}>
                    <ImCancelCircle />
                  </span>
                  <span className="preparing-btn" onClick={() => handlePreparing(order.id)}>
                    <LuCookingPot />
                  </span>
                </>
              )}
              {/* Show Preparing and Completed spans for Preparing orders */}
              {order.orderStatus === 'Preparing' && (
                <>
                  <span className="preparing-btn" onClick={() => handlePreparing(order.id)}>
                    <LuCookingPot />
                  </span>
                  <span className="complete-btn" onClick={() => handleCompleted(order.id)}>
                    <IoMdDoneAll />
                  </span>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No pending orders found.</p>
      )}

      {/* Confirmation Popup */}
      {showPopup && (
        <ConfirmPopup
          message="Are you sure you want to reject this order?"
          onConfirm={confirmRejection}
          onCancel={cancelRejection}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default PendingOrders;