import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Login.css';
import {
  isValidEmailSyntax,
  getEmailSuggestion,
  validatePassword
} from '../contexts/Validator.jsx';

const Login = () => {
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: false }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {
      email: !isValidEmailSyntax(formValues.email),
      password: !validatePassword(formValues.password)
    };
    if (Object.values(newErrors).some(Boolean)) {
      setFieldErrors(newErrors);
      if (newErrors.email) setError('Введите корректный Email');
      else if (newErrors.password) setError('Пароль должен быть не менее 6 символов');
      return;
    }

    const suggestion = getEmailSuggestion(formValues.email);
    if (suggestion) {
      setFieldErrors(prev => ({ ...prev, email: true }));
      setError(`Возможно, вы имели в виду ${suggestion}?`);
      return;
    }

    try {
      await login({ email: formValues.email, password: formValues.password });
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка при входе');
    }
  };

  return (
    <form className="form-login" onSubmit={handleSubmit}>
      <h2>Вход</h2>

      <div className="text-field text-field_floating">
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder=" "
          value={formValues.email}
          onChange={handleChange}
          className={`text-field__input ${fieldErrors.email ? 'input-error' : ''}`}
          required
        />
        <label htmlFor="login-email" className="text-field__label">Email</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder=" "
          value={formValues.password}
          onChange={handleChange}
          className={`text-field__input ${fieldErrors.password ? 'input-error' : ''}`}
          required
        />
        <label htmlFor="login-password" className="text-field__label">Пароль</label>
      </div>

      {error && <p className="error-message-login">{error}</p>}

      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;
