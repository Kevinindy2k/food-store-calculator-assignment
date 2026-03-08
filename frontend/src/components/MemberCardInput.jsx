
export default function MemberCardInput({ value, onChange }) {
  return (
    <div className="member-section">
      <label htmlFor="member-card">Card Member :</label>
      <input
        id="member-card"
        className="member-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
