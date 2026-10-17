import React, { useState } from 'react';

const Step3Profile = ({ onNext, initialData }) => {
  const [profileData, setProfileData] = useState(
    initialData || { username: '', age: '', gender: '' }
  );

  const [errors, setErrors] = useState({
    username: '',
    age: '',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleGenderSelect = (selectedGender) => {
    setProfileData((prev) => ({ ...prev, gender: selectedGender }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { username: '', age: '', gender: '' };
    let hasError = false;

    // 1. Валидация Username
    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required.';
      hasError = true;
    }

    // 2. Валидация Age (должно быть заполнено и содержать только цифры)
    if (!profileData.age.toString().trim()) {
      newErrors.age = 'Age is required.';
      hasError = true;
    } else if (!/^\d+$/.test(profileData.age)) {
      newErrors.age = 'Use a number.';
      hasError = true;
    }

    // 3. Валидация Gender
    if (!profileData.gender) {
      newErrors.gender = 'Gender is required. Choose an option.';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onNext(profileData);
    }
  };

  const genderOptions = ['Woman', 'Man', 'Other'];

  return (
    <>
      {/* Заголовок шага */}
      <div className="introduction">
        <h1 className="introduction-heading">Profile</h1>
        <p className="introduction-description">Tell us a little about yourself.</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-container" noValidate>
        
        {/* Строка с полями Username и Age */}
        <div className="profile-row">
          
          {/* Поле Username */}
          <div className="field username-field">
            <label className="field-label">Username</label>
            <div className={`input-wrapper ${errors.username ? 'error' : ''}`}>
              <span className="input-icon">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <circle cx="7" cy="4" r="3" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6"/>
                  <path d="M1 14C1 11.2386 3.68629 9 7 9C10.3137 9 13 11.2386 13 14" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Enter username"
                value={profileData.username}
                onChange={handleChange}
              />
            </div>
            <span className="field-feedback">{errors.username}</span>
          </div>

          {/* Поле Age */}
          <div className="field age-field">
            <label className="field-label">Age</label>
            <div className={`input-wrapper age-input-wrapper ${errors.age ? 'error' : ''}`}>
              <input
                type="text"
                name="age"
                className="input-field age-input"
                placeholder="26"
                value={profileData.age}
                onChange={handleChange}
              />
            </div>
            <span className="field-feedback">{errors.age}</span>
          </div>

        </div>

        {/* Выбор пола (Gender) */}
        <div className="field gender-group">
          <label className="field-label">Gender</label>
          
          <div className="gender-options-list">
            {genderOptions.map((option) => {
              const isSelected = profileData.gender === option;
              return (
                <button
                  key={option}
                  type="button"
                  className={`gender-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleGenderSelect(option)}
                >
                  <span className="gender-option-text">{option}</span>
                  {isSelected && (
                    <span className="gender-check-icon">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <path d="M1.5 5L5 8.5L12.5 1.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <span className="field-feedback">{errors.gender}</span>
        </div>

        {/* Кнопка Next */}
        <div className="auth-actions">
          <button type="submit" className="submit-btn">
            Next
          </button>
        </div>

      </form>
    </>
  );
};

export default Step3Profile;