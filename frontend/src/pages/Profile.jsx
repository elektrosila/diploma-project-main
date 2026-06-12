import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./Profile.css";
import profileImg from "../assets/OrangeProfile.png";

const LABELS = {
  title: "\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
  backHome: "\u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e",
  logout: "\u0412\u044b\u0439\u0442\u0438",
  stats: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430",
  attempts: "\u041f\u043e\u043f\u044b\u0442\u043e\u043a",
  correct: "\u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e",
  successRate: "\u0423\u0441\u043f\u0435\u0448\u043d\u043e\u0441\u0442\u044c",
  history:
    "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043f\u043e\u043f\u044b\u0442\u043e\u043a",
  date: "\u0414\u0430\u0442\u0430",
  variantId: "ID \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u0430",
  result: "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442",
  correctAnswers:
    "\u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u043e\u0432",
  incorrectAnswers:
    "\u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u043e\u0432",
  totalQuestions:
    "\u0412\u0441\u0435\u0433\u043e \u0432\u043e\u043f\u0440\u043e\u0441\u043e\u0432",
  successful: "\u0423\u0441\u043f\u0435\u0448\u043d\u043e",
  unsuccessful: "\u041d\u0435\u0443\u0441\u043f\u0435\u0448\u043d\u043e",
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, stats, loading, logout } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{LABELS.title}</h1>
        <div className="header-buttons">
          <Link to="/" className="back-button">
            {LABELS.backHome}
          </Link>
          <button onClick={handleLogout} className="logout-button">
            {LABELS.logout}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <section className="user-info">
          <img src={profileImg} alt="avatar" className="avatar" />
          <div className="user-details">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        </section>

        <section className="stats-section">
          <h3>{LABELS.stats}</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.attempts}</span>
              <span className="stat-label">{LABELS.attempts}</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.correct}</span>
              <span className="stat-label">{LABELS.correct}</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.successRate}%</span>
              <span className="stat-label">{LABELS.successRate}</span>
            </div>
          </div>
        </section>

        <section className="history-section">
          <h3>{LABELS.history}</h3>
          <table className="attempts-table">
            <thead>
              <tr>
                <th>{LABELS.date}</th>
                <th>{LABELS.variantId}</th>
                <th>{LABELS.result}</th>
                <th>{LABELS.correctAnswers}</th>
                <th>{LABELS.incorrectAnswers}</th>
                <th>{LABELS.totalQuestions}</th>
              </tr>
            </thead>
            <tbody>
              {stats.history.map(
                (
                  {
                    date,
                    variantId,
                    successful,
                    correctAnswersCount,
                    incorrectAnswersCount,
                    totalQuestions,
                  },
                  index
                ) => (
                  <tr key={`${variantId}-${date}-${index}`}>
                    <td>{date}</td>
                    <td>{variantId}</td>
                    <td className={`result ${successful ? "correct" : "incorrect"}`}>
                      {successful ? LABELS.successful : LABELS.unsuccessful}
                    </td>
                    <td>{correctAnswersCount}</td>
                    <td>{incorrectAnswersCount}</td>
                    <td>{totalQuestions}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
