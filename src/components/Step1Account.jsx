import React, { useState } from 'react';

const Step1Account = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || { email: '', password: '', confirmPassword: '' }
  );

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { email: '', password: '', confirmPassword: '' };
    let hasError = false;

    // Валидация
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail is required.';
      hasError = true;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid e-mail address.';
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      hasError = true;
    }

    setErrors(newErrors);

    // Передаем валидные данные родителю и переходим на шаг 2
    if (!hasError) {
      onNext(formData);
    }
  };

  return (
    <>
      <div className="introduction">
        <h1 className="introduction-heading">Welcome</h1>
        <p className="introduction-description">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="account-fields" noValidate>
        {/* E-mail */}
        <div className="field">
          <label className="field-label">E-mail</label>
          <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
            <span className="input-icon">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M2 2H16V12H2V2Z" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 2L9 8L16 2" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="alex.morgan@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <span className="field-feedback">{errors.email}</span>
        </div>

        {/* Password */}
        <div className="field">
          <label className="field-label">Password</label>
          <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
            <span className="input-icon">
              <svg width="13.5" height="15" viewBox="0 0 13.5 15" fill="none">
                <rect x="1.5" y="6.5" width="10.5" height="7" rx="1.5" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6"/>
                <path d="M4.25 6.5V4A2.5 2.5 0 0 1 9.25 4V6.5" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <span className="field-feedback">{errors.password}</span>
        </div>

        {/* Confirm password */}
        <div className="field">
          <label className="field-label">Confirm password</label>
          <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
            <span className="input-icon">
              <svg width="13.5" height="15" viewBox="0 0 13.5 15" fill="none">
                <rect x="1.5" y="6.5" width="10.5" height="7" rx="1.5" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6"/>
                <path d="M4.25 6.5V4A2.5 2.5 0 0 1 9.25 4V6.5" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              type="password"
              name="confirmPassword"
              className="input-field"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <span className="field-feedback">{errors.confirmPassword}</span>
        </div>

        <div className="auth-actions">
          <button type="submit" className="submit-btn">
            CREATE
          </button>
          <p className="signin-prompt">
            Do you have an account?
            <button type="button" className="signin-link">Sign In</button>
          </p>
        </div>
      </form>
    </>
  );
};

export default Step1Account;