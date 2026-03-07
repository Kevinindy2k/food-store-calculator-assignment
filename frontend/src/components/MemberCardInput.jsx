import React from "react";

/**
 * Input field for the member card number.
 */
export default function MemberCardInput({ value, onChange }) {
  return (
    <div className="member-section">
      <label htmlFor="member-card">Member Card:</label>
      <input
        id="member-card"
        className="member-input"
        type="text"
        placeholder="Enter member card number (optional)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
