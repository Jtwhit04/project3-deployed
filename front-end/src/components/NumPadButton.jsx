import "./NumPadButton.css";

const NumPadButton = ({ value, onClick }) => {
    return (
        <button className="numpad-button" onClick={() => onClick(value)}>
            {value}
        </button>
    );
    };

export default NumPadButton;