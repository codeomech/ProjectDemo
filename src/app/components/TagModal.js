import React, { useState } from "react";

const TagModal = ({ isOpen, onClose, onSubmit }) => {
  const [tag, setTag] = useState("");

  const handleSubmit = () => {
    onSubmit(tag);
    setTag("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Tag</h2>
        <input
          className="modal-input"
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Enter tag"
        />
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagModal;
