import React from "react";
import "./BackButton.css";
import { useNavigate } from "react-router-dom";

const BackButton = ({className}) => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }

    return (
        <button onClick={handleBack} className={`back-button ${className}`}>
            ← Back
        </button>
    );
}

export default BackButton;