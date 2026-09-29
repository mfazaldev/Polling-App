import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");

  const updateOption = (i, val) => {
    const copy = [...options];
    copy[i] = val;
    setOptions(copy);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i) =>
    setOptions(options.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    if (cleaned.length < 2)
      return setError("Please provide at least 2 options");

    try {
      await api.post("/polls", { question, options: cleaned });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <div style={pageStyle}>
      <h2>Create a Poll</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <label style={{ fontSize: "0.9rem", color: "#555" }}>Options</label>
        {options.map((opt, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: "0.5rem", marginTop: 6 }}
          >
            <input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                style={removeBtn}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addOption} style={ghostBtn}>
          + Add Option
        </button>

        <button type="submit" style={primaryBtn}>
          Create Poll
        </button>
      </form>
    </div>
  );
}

const pageStyle = { maxWidth: 500, margin: "2rem auto", padding: "0 1rem" };
const primaryBtn = {
  width: "100%",
  padding: "0.6rem",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginTop: "0.75rem",
};
const ghostBtn = {
  padding: "0.4rem 0.8rem",
  background: "transparent",
  border: "1px dashed #999",
  borderRadius: 6,
  cursor: "pointer",
  marginTop: "0.5rem",
};
const removeBtn = {
  padding: "0 0.7rem",
  background: "#fee2e2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  borderRadius: 6,
  cursor: "pointer",
};