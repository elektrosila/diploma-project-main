import { useState, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import logoSrc from "../assets/logo.png";
import peterSrc from "../assets/peter.png";
import bookSrc from "../assets/book.png";
import profile from "../assets/OrangeProfile.png";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const Header = () => {
  const { user, stats } = useAuth();
  const [openForm, setOpenForm] = useState(null);

  useEffect(() => {
    setOpenForm(null);
  }, [user]);

  const handleToggle = (form) => {
    setOpenForm((prev) => (prev === form ? null : form));
  };

  return (
    <header className={`header ${openForm ? "expanded" : ""}`}>
      <div className="logo-container">
        <Link to="/">
          <img src={logoSrc} alt="ОГЭ по русскому языку" className="logo" />
        </Link>
      </div>

      {!user ? (
        <>
          <div className="auth-buttons">
            <button className="btn-login" onClick={() => handleToggle("login")}>
              Войти
            </button>
            <button
              className="btn-register"
              onClick={() => handleToggle("register")}
            >
              Регистрация
            </button>
          </div>

          <div className="header-panel">
            {openForm === "login" && <Login />}
            {openForm === "register" && <Register />}
          </div>
        </>
      ) : (
        <div className="stats-container">
          <table className="stats-table">
            <thead>
              <tr>
                <th colSpan="3" className="stats-header-cell">
                  <Link to="/profile" className="profile-btn stats-button">
                    <img src={profile} alt="Профиль" className="profile-icon" />
                    <span className="profile-text">Профиль</span>
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Попытки</th>
                <th>Правильно</th>
                <th>Успех</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stats.attempts}</td>
                <td>{stats.correct}</td>
                <td>{stats.successRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="photo-container">
        <img src={bookSrc} alt="Книги" className="books" />
        <img src={peterSrc} alt="Иллюстрация" className="photo" />
      </div>
    </header>
  );
};

export default Header;
