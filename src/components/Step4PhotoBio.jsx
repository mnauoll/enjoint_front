import React, { useState, useRef } from 'react';

const Step4PhotoBio = ({ onNext, initialData }) => {
  const [photo, setPhoto] = useState(initialData?.photo || null);
  const [photoName, setPhotoName] = useState(initialData?.photoName || '');
  const [bio, setBio] = useState(initialData?.bio || '');

  const [errors, setErrors] = useState({
    photo: '',
    bio: '',
  });

  const fileInputRef = useRef(null);

  // Открытие файлового диалога
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Выбор файла с компьютера
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, photo: 'Please select an image file.' }));
        return;
      }

      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result);
        setErrors((prev) => ({ ...prev, photo: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    if (errors.bio) {
      setErrors((prev) => ({ ...prev, bio: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { photo: '', bio: '' };
    let hasError = false;

    if (!photo) {
      newErrors.photo = 'Photo is required.';
      hasError = true;
    }

    if (!bio.trim()) {
      newErrors.bio = 'Bio is required.';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onNext({ photo, photoName, bio });
    }
  };

  return (
    <>
      <div className="introduction">
        <h1 className="introduction-heading">Photo & Bio</h1>
        <p className="introduction-description">Add your photo and introduce yourself.</p>
      </div>

      <form onSubmit={handleSubmit} className="photo-bio-container" noValidate>
        
        {/* Скрытый инпут загрузки файла */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Секция загрузки аватара */}
        <div className="avatar-upload-group">
          
          <div 
            className={`avatar-circle-wrapper ${errors.photo ? 'error' : ''}`}
            onClick={handleTriggerUpload}
          >
            {photo ? (
              <img src={photo} alt="Avatar Preview" className="avatar-preview-img" />
            ) : (
              /* Камера по параметрам Figma 26.67x21.33 */
              <svg width="27" height="22" viewBox="0 0 27 22" fill="none">
                <path 
                  d="M1 7C1 5.89543 1.89543 5 3 5H7L9 2H18L20 5H24C25.1046 5 26 5.89543 26 7V19C26 20.1046 25.1046 21 24 21H3C1.89543 21 1 20.1046 1 19V7Z" 
                  stroke="rgba(119, 119, 119, 1)" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle cx="13.5" cy="13" r="4.5" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6"/>
              </svg>
            )}

            {/* Синяя кнопка карандаша (30x30px из Figma) */}
            <button 
              type="button" 
              className="avatar-edit-badge"
              onClick={(e) => {
                e.stopPropagation();
                handleTriggerUpload();
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path 
                  d="M2.5 11.5L3.8 11.3L10.5 4.6C10.9 4.2 10.9 3.6 10.5 3.2L9.8 2.5C9.4 2.1 8.8 2.1 8.4 2.5L1.7 9.2L1.5 10.5L2.5 11.5Z" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Текстовая ссылка под аватаром */}
          <button 
            type="button" 
            className="photo-upload-link" 
            onClick={handleTriggerUpload}
          >
            {photo ? 'Change photo' : 'Upload photo'}
          </button>

          {/* Статус загрузки или ошибка */}
          <div className="photo-feedback-container">
            {errors.photo ? (
              <span className="field-feedback">{errors.photo}</span>
            ) : photoName ? (
              <span className="photo-uploaded-text">{photoName} · Uploaded</span>
            ) : null}
          </div>

        </div>

        {/* Блок Bio (329px x 92px) */}
        <div className="field bio-field-group">
          <label className="field-label">Bio</label>
          <div className={`textarea-wrapper ${errors.bio ? 'error' : ''}`}>
            <textarea
              className="textarea-field"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={handleBioChange}
              maxLength={250}
            />
          </div>
          <span className="field-feedback">{errors.bio}</span>
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

export default Step4PhotoBio;