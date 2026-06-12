import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const emptyStats = {
  attempts: 0,
  correct: 0,
  successRate: 0,
  history: [],
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/profile");
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
        setStats(emptyStats);
      } finally {
        setLoading(false);
      }
    };

    bootstrapUser();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStats(emptyStats);
      return;
    }

    try {
      const res = await API.get("/attempts");
      const attemptsData = res.data;
      const totalAttempts = attemptsData.length;
      const successfulAttempts = attemptsData.filter((a) => a.successful).length;
      const successRate =
        totalAttempts > 0
          ? Math.round((successfulAttempts / totalAttempts) * 100)
          : 0;

      const history = attemptsData.map((attempt) => ({
        date: new Date(attempt.created_at).toLocaleDateString(),
        variantId: attempt.variant_id,
        successful: attempt.successful,
        correctAnswersCount: attempt.correct_questions,
        incorrectAnswersCount:
          attempt.total_questions - attempt.correct_questions,
        totalQuestions: attempt.total_questions,
      }));

      setStats({
        attempts: totalAttempts,
        correct: successfulAttempts,
        successRate,
        history,
      });
    } catch (error) {
      console.error("Error fetching attempts:", error);
      setStats(emptyStats);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    } else if (!loading) {
      setStats(emptyStats);
    }
  }, [user, loading]);

  const register = async ({ username, email, password }) => {
    const { data } = await API.post("/auth/register", {
      username,
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const login = async ({ email, password }) => {
    const { data } = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setStats(emptyStats);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        loading,
        fetchStats,
        register,
        login,
        logout,
        API,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
