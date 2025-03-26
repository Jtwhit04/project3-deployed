import React, { useContext, useState, useEffect } from 'react';
import "./OrderHistoryScreen.css";
import axios from 'axios';
import { API_URL } from '../apiConfig';
import { TitleContext } from "../contexts/TitleContext";


const OrderHistoryScreen = () => {
  const { setTitle } = useContext(TitleContext);
  setTitle("Order History");

  const [timeRange, setTimeRange] = useState("Today");
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderTotal, setOrderTotal] = useState();
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  useEffect(() => {
    loadOrderHistory(timeRange);
  }, [timeRange]);

  const loadOrderHistory = async (range) => {
    if (range === "All Time") {
      range = "All";
    }
    else if (range === "This Week") {
      range = "Week";
    }
    else if (range === "This Month") {
      range = "Month";
    }
    else {
      range = "Today";
    }
    try {
      const res = await axios.get(`${API_URL}/get-all-transactions`, { params: { range } });
      const data = res.data
      setOrders(data);
    } catch (error) {
      console.error("Error loading order history: ", error);
      setErrorMessage("Error fetching categories. Please try again.");
      setDisplayErrorMessage(true);
    }
  };

  useEffect(() => {
    let total = 0;
    orders.forEach(order => {
      total += parseFloat(order.total);
    });
    setOrderTotal(total.toFixed(2));
  }, [orders]);

  return (
    <>
      <div className="top-button-container">
        <div className="time-range-selector">
          <label>Time Range: </label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>
      <div className='order-history-screen'>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>SUBTOTAL</th>
                <th>TAX</th>
                <th>TIP</th>
                <th>TOTAL</th>
                <th>PAYMENT METHOD</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>${order.subtotal}</td>
                  <td>${order.tax}</td>
                  <td>${order.tip}</td>
                  <td>${order.total}</td>
                  <td>{order.payment_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-total">Overall Total: ${orderTotal}</div>
      </div>
    </>
  );
};

export default OrderHistoryScreen;