import React from "react";
import "../../Styles/ConfirmPopup.css"; // Add styles for the popup

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-popup-overlay" >
      <div className="confirm-popup">
        <p>{message}</p>
        <div className="confirm-popup-buttons">
          <button onClick={onConfirm} className="confirm-btn">Yes</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;