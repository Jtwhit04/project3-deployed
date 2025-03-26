import React from "react";
import { EmployeeContext } from "../contexts/EmployeeContext";
import "./SignOutButton.css";

const SignOutButton = () => {
    const { setEmployee } = React.useContext(EmployeeContext);

    const handleSignOut = () => {
        setEmployee(null); // Clear the employee context
        window.location.href = "/login"; // Redirect to login page
    };

    return (
        <button onClick={handleSignOut} className="sign-out-button">
            Sign Out
        </button>
    );
}

export default SignOutButton;