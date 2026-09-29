import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function PollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { data } = await api.get("/polls");
        setPolls(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const { data } = await api.post(`/polls/${pollId}/vote`, {
        optionIndex,
      });
      setPolls((prev) =>
        prev.map((p) => (p._id === pollId ? data.poll : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Vote failed");
    }
  };

  const hasVoted = (poll) =>
    user && poll.votedUsers.some((id) => id === user._id);

  if (loading) return <p style={styles.center}>Loading polls...</p>;
  if (polls.length === 0)
    return (
      <p style={styles.center}>
        No polls yet. {user ? "Create one!" : "Login to create one."}
      </p>
    );

  return (
    <div style={styles.container}>
      {polls.map((poll) => {
        const totalVotes = poll.options.reduce(
          (sum, o) => sum + o.votes,
          0
        );
        const voted = hasVoted(poll);

        return (
          <div key={poll._id} style={styles.card}>
            <h2 style={styles.question}>{poll.question}</h2>

            {poll.options.map((option, index) => {
              const percent =
                totalVotes === 0 ? 0 : (option.votes / totalVotes) * 100;

              return (
                <div key={index} style={styles.optionRow}>
                  {!voted ? (
                    <button
                      onClick={() => handleVote(poll._id, index)}
                      style={styles.voteBtn}
                      disabled={!user}
                      title={!user ? "Login to vote" : ""}
                    >
                      {option.text}
                    </button>
                  ) : (
                    <>
                      <div style={styles.resultHeader}>
                        <span>{option.text}</span>
                        <span>
                          {option.votes} · {percent.toFixed(1)}%
                        </span>
                      </div>
                      <div style={styles.barTrack}>
                        <div
                          style={{
                            ...styles.barFill,
                            width: `${percent}%`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <p style={styles.total}>Total votes: {totalVotes}</p>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "2rem auto", padding: "0 1rem" },
  center: { textAlign: "center", marginTop: "2rem", color: "#666" },
  card: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    padding: "1rem 1.25rem",
    marginBottom: "1.25rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  question: { marginBottom: "1rem", fontSize: "1.15rem" },
  optionRow: { marginBottom: "0.75rem" },
  voteBtn: {
    width: "100%",
    padding: "0.6rem",
    background: "#f5f5f5",
    border: "1px solid #ccc",
    borderRadius: 6,
    cursor: "pointer",
    textAlign: "left",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    marginBottom: 4,
  },
  barTrack: {
    width: "100%",
    height: 14,
    background: "#eee",
    borderRadius: 7,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "#4f46e5",
    transition: "width 0.4s ease",
  },
  total: { marginTop: "0.75rem", fontSize: "0.85rem", color: "#666" },
};