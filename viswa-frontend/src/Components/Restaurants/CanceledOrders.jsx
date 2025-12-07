import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Customer_order_URL, Customer_URL } from '../commonComponents/AllURLs';
import defaultimage from "../../Assests/default profile.jpg"
import { FaRupeeSign } from 'react-icons/fa';
import { LiaRupeeSignSolid } from 'react-icons/lia';
import '../../Styles/PendingOrders.css';

const CanceledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]); // State to store customer data

  // Fetch orders and customers from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axios.get(Customer_order_URL);
        // Filter orders with "orderStatus": "Canceled"
        const canceledOrders = ordersResponse.data.filter(
          (order) => order.orderStatus === 'Canceled'
        );
        setOrders(canceledOrders);

        // Fetch customers
        const customersResponse = await axios.get(Customer_URL);
        setCustomers(customersResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get customer image by customerId
  const getCustomerImage = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.image : ''; // Assuming the customer object has an `image` field
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pending-orders-container">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className={`order-card ${order.orderStatus === 'Canceled' ? 'canceled-order' : ''}`}
          >
            <div className="order-card-row">
              <span className="order-id-no">Order ID: {order.id}</span>
              <span className="order-customer-img">
                <img
                  src={getCustomerImage(order.customerId) || defaultimage} // Fetch customer image
                  alt="customer"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/50'; // Fallback image if the URL is invalid
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

            <p>
              <strong>Address : </strong>
              {order.address}
            </p>
            <div className="items">
              <h4>Items:</h4>
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
                      <td>
                      ₹                        {item.price}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                      ₹                        {item.totalPrice}
                      </td>
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
          </div>
        ))
      ) : (
        <p>No canceled orders found.</p>
      )}
    </div>
  );
};

export default CanceledOrders;