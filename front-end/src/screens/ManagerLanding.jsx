import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TitleContext } from "../contexts/TitleContext";
import "./ManagerLanding.css";


const ManagerLanding = () => {
    const { setTitle } = useContext(TitleContext);
    const navigate = useNavigate();

    setTitle("Manager Home");


    return (
        <>
        <div className="manager-container">
            <div className="button-container">
                <div className="button-row">
                <button onClick={() => navigate("/orderHistoryScreen")} className="round-button">Order History</button>
                <button onClick={() => navigate("/inventoryScreen")} className="round-button">Inventory</button>
                <button onClick={() => navigate("employeeDataScreen")} className="round-button">Employees</button>
                </div>
                <div className="button-row">
                <button onClick={() => navigate("menuChangeScreen")} className="round-button">View Menu</button>
                <button onClick={() => navigate("cashierScreen")} className="round-button">Cashier View</button>
                <button onClick={() => navigate("reportScreen")} className="round-button">Reports</button>
                </div>
            </div>

        </div>
        </>
    );
};

export default ManagerLanding;