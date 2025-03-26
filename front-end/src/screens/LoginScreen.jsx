import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import NumPadButton from "../components/NumPadButton";
import { useNavigate } from 'react-router-dom';
import "./LoginScreen.css";
import { EmployeeContext } from "../contexts/EmployeeContext";
import { TitleContext } from "../contexts/TitleContext";
import { API_URL } from "../apiConfig";

const LoginScreen = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [displayInvalidIDMessage, setDisplayInvalidIDMessage] = useState(false);

  const { employee, setEmployee } = useContext(EmployeeContext);
  const { setTitle } = useContext(TitleContext);
  setTitle("Employee Login");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        id: employeeID,
      });
      if (res.status === 200) {
        setEmployee(res.data);
        setDisplayInvalidIDMessage(false);
      }
    } catch (err) {
      setDisplayInvalidIDMessage(true);
    }
  };

  useEffect(() => {
    if (employee && employee.id !== null) {
      if (employee.position === "MANAGER") {
        navigate('/home');
      } else {
        // navigate('/cashier-screen'); // TODO uncomment this when cashier screen is implemented
      }
    }
  }, [employee, navigate]);

  const handleNumPadClick = (value) => {
    if (value === "Enter") {
      handleLogin();
    } else if (value === "←") {
      setEmployeeID(employeeID.slice(0, -1));
    } else {
      setEmployeeID(employeeID + value
      );
    }
  }

  return (
    <div className="login-screen">
      <h1>Login</h1>
      <input
        className="employee-id-input"
        type="text"
        value={employeeID}
        onChange={(e) => setEmployeeID(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
      />
      <div className="numpad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', 'Enter'].map((num) => (
          <NumPadButton key={num} value={num} onClick={handleNumPadClick} />
        ))}
      </div>
      {displayInvalidIDMessage && <p className="error-text">
        Employee with given ID not found, please try again
      </p>}
    </div>
  );
};

export default LoginScreen;
