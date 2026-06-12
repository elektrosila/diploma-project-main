import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  isValidEmailSyntax,
  getEmailSuggestion,
  validatePassword,
  validateUsername,
  validateConfirmPassword
} from '../contexts/Validator.jsx';

const Register = () => {
  const { register } = useAuth();
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: false }));
    setError('');
  };

  const handleCheckbox = () => setAgreed(prev => !prev);

  const handleSubmit = async e => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formValues;

    const newErrors = {
      username: !validateUsername(username),
      email: !isValidEmailSyntax(email),
      password: !validatePassword(password),
      confirmPassword: !validateConfirmPassword(password, confirmPassword)
    };

    if (Object.values(newErrors).some(Boolean)) {
      setFieldErrors(newErrors);
      if (newErrors.username) return setError('Введите корректное имя пользователя (только буквы)');
      if (newErrors.email) return setError('Введите корректный email');
      if (newErrors.password) return setError('Пароль должен быть не менее 6 символов');
      if (newErrors.confirmPassword) return setError('Пароли не совпадают');
    }

    const suggestion = getEmailSuggestion(email);
    if (suggestion) {
      setFieldErrors(prev => ({ ...prev, email: true }));
      return setError(`Возможно, вы имели в виду ${suggestion}?`);
    }

    if (!agreed) {
      return setError('Необходимо согласиться с условиями');
    }

    try {
      await register({ username, email, password });
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <form className="form-register" onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

      <div className="text-field text-field_floating">
        <input
          id="reg-username"
          name="username"
          type="text"
          placeholder=" "
          value={formValues.username}
          onChange={handleChange}
          className={`text-field__input ${fieldErrors.username ? 'input-error' : ''}`}
          required
        />
        <label htmlFor="reg-username" className="text-field__label">Имя пользователя</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="reg-email"
          name="email"
          type="email"
          placeholder=" "
          value={formValues.email}
          onChange={handleChange}
          className={`text-field__input ${fieldErrors.email ? 'input-error' : ''}`}
          required
        />
        <label htmlFor="reg-email" className="text-field__label">Email</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="reg-password"
          name="password"
          type="password"
          placeholder=" "
          value={formValues.password}
          onChange={handleChange}
          className={`text-field__input ${fieldErrors.password ? 'input-error' : ''}`}
          required
        />
        <label htmlFor="reg-password" className="text-field__label">Пароль</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder=" "
          value={formValues.confirmPassword}
          onChange={handleChange}
          className={`text-field__input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
          required
        />
        <label htmlFor="confirm-password" className="text-field__label">Повторить пароль</label>
      </div>

      <div className="terms">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={agreed}
          onChange={handleCheckbox}
        />
        <label htmlFor="terms" className="terms-label">
          Я согласен(-на) с условиями пользовательского соглашения и обработкой данных.
        </label>
      </div>

      {error && <p className="error-message-reg">{error}</p>}

      <button type="submit" className="btn-register">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
