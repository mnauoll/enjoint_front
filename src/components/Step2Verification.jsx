import React, { useState, useEffect, useRef } from 'react';

const Step2Verification = ({ email, onSuccess }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeStatus, setCodeStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setCodeStatus('idle');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredCode = code.join('');

    if (enteredCode === '676767') {
      setCodeStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 300);
    } else {
      setCodeStatus('error');
    }
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(30);
      setCode(['', '', '', '', '', '']);
      setCodeStatus('idle');
      alert('Новый код отправлен на ваш e-mail!');
    }
  };

  return (
    <>
      <div className="introduction">
        <h1 className="introduction-heading">Almost There</h1>
        <p className="introduction-description">
          Please enter the 6-digit code sent to your email for verification.
        </p>
      </div>

      <form onSubmit={handleVerify} className="verification-container">
        
        {/* Этот оберточный блок выравнивает содержимое ровно по центру карточки */}
        <div className="verification-middle">
          <p className="target-email">{email || 'alex.morgan@gmail.com'}</p>

          {/* 6 ячеек кода */}
          <div className="code-inputs-grid">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                className={`code-digit-input ${codeStatus === 'error' ? 'error' : ''}`}
                value={digit}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>

          {/* Сообщения о статусе */}
          <div className={`verification-status ${codeStatus}`}>
            {codeStatus === 'success' && (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5"/>
                  <path d="M5 8L7 10L11 6" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>E-mail verified. You’re ready for the next step.</span>
              </>
            )}
            {codeStatus === 'error' && (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="rgba(214, 40, 40, 1)" strokeWidth="1.5"/>
                  <path d="M8 5V9M8 11V11.5" stroke="rgba(214, 40, 40, 1)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Incorrect code. Try again.</span>
              </>
            )}
          </div>

          {/* Таймер */}
          <p className="resend-timer">
            Request a new code in 00:{timer < 10 ? `0${timer}` : timer}s
          </p>
        </div>

        {/* Кнопка снизу */}
        <div className="auth-actions">
          <button type="submit" className="submit-btn">
            {codeStatus === 'error' ? 'Retry verification' : 'Next'}
          </button>

          <p className="signin-prompt">
            Didn't receive any code?
            <button 
              type="button" 
              onClick={handleResendCode} 
              className="signin-link"
              style={{ opacity: timer > 0 ? 0.5 : 1, cursor: timer > 0 ? 'default' : 'pointer' }}
            >
              Resend Again
            </button>
          </p>
        </div>

      </form>
    </>
  );
};

export default Step2Verification;