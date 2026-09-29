import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.9rem 1.5rem",
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Link to="/" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
        📊 PollingApp
      </Link>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {user ? (
          <>
            <Link to="/create">+ New Poll</Link>
            <span style={{ color: "#555" }}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={btnStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const btnStyle = {
  padding: "0.4rem 0.8rem",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};