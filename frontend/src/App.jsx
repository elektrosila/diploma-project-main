import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import fakeData from "./data/data.js";
import Header from "./components/Header.jsx";
import Profile from "./pages/Profile.jsx";
import Test from "./pages/TestPage.jsx";
import Main from "./pages/MainPage.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateQuestionForm from "./components/CreateQuestionForm.jsx";
import { VariantProvider, useVariant } from "./contexts/VariantContext.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import CreateVariantForm from "./components/CreateVariantForm.jsx";

const AppRoutes = ({ variantsList }) => {
  const { customVariant } = useVariant();
  const { user, login } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Main variantsList={variantsList} />} />
      {variantsList.map((v) => (
        <Route
          key={v.id}
          path={`/test/${v.id}`}
          element={<Test variant={v} />}
        />
      ))}
      <Route path="/test/custom" element={<Test variant={customVariant} />} />

      <Route path="/profile" element={<Profile />} />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/profile" replace /> : <Login onSubmit={login} />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/createQuestion" element={<CreateQuestionForm />} />
      <Route path="/createVariant" element={<CreateVariantForm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const [variantsList, setVariantsList] = useState([]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await fetch("/api/variants");
        if (!response.ok) throw new Error("Network response was not ok");
        const variants = await response.json();
        setVariantsList(variants);
      } catch (e) {
        console.log("Error fetching tests:", e);
        setVariantsList(fakeData.variants);
      }
    };

    fetchVariants();
  }, []);

  return (
    <AuthProvider>
      <VariantProvider>
        <BrowserRouter>
          <Header />
          <AppRoutes variantsList={variantsList} />
          <Footer />
        </BrowserRouter>
      </VariantProvider>
    </AuthProvider>
  );
};

export default App;
