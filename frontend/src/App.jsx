import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PollsPage from "./pages/PollsPage";
import CreatePoll from "./pages/CreatePoll";
import { useAuth } from "./context/AuthContext";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PollsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create"
          element={
            <Protected>
              <CreatePoll />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}