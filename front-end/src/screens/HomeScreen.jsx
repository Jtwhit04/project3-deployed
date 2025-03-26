import React, { useContext, useEffect } from "react";

import { EmployeeContext } from "../contexts/EmployeeContext";
import { TitleContext } from "../contexts/TitleContext";
import SignOutButton from "../components/SignOutButton";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

const HomeScreen = () => {
  const { employee } = useContext(EmployeeContext);
  const { setTitle } = useContext(TitleContext);

  setTitle("Home");

  const navigate = useNavigate();

  useEffect(() => {
    if (employee === null) {
      navigate("/login");      
    }
  }, [employee, navigate]);

  return (
  <>
  <button className = "home-screen" onClick={()=> navigate("/managerLanding")}>
    <div className="home-screen-text">
        {employee && <p>Hello, {employee.name}</p>}
        <img src="../../round-goob.webp" alt="logo" aria-label="logo displaying a round goober" />
        <p>Tap Anywhere to Initiate Session</p>
    </div>
  </button>
  </>
  );
};

export default HomeScreen;
