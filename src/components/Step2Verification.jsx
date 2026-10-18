import React, { useState, useEffect, useRef } from "react";

const Step2Verification = ({ email, onSuccess }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeStatus, setCodeStatus] = useState("idle"); // 'idle' | 'success' | 'error'
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
    setCodeStatus("idle");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredCode = code.join("");

    if (enteredCode === "676767") {
      setCodeStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 300);
    } else {
      setCodeStatus("error");
    }
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(30);
      setCode(["", "", "", "", "", ""]);
      setCodeStatus("idle");
      alert("Новый код отправлен на ваш e-mail!");
    }
  };

  return (
    <>
      <div className="mb-5 flex h-[90px] w-full flex-col items-center gap-1.5">
        <h1 className="m-0 text-center text-[56px] leading-[1.1] font-bold text-ink dark:text-white">
          Almost There
        </h1>
        <p className="m-0 text-center text-base font-normal text-ink dark:text-white">
          Please enter the 6-digit code sent to your email for verification.
        </p>
      </div>

      <form
        onSubmit={handleVerify}
        className="flex w-full flex-1 flex-col items-center"
      >
        {/* Этот оберточный блок выравнивает содержимое ровно по центру карточки */}
        <div className="my-auto flex w-full flex-col items-center justify-center">
          <p className="mb-4 text-[15px] font-medium text-ink dark:text-white">
            {email || "alex.morgan@gmail.com"}
          </p>

          {/* 6 ячеек кода */}
          <div className="mb-2.5 flex justify-center gap-2.5">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                className={`box-border size-[57px] rounded-[5px] border bg-[#f4f4f4] text-center text-[28px] font-medium text-ink outline-none transition-colors focus:border-brand-pink focus:bg-white dark:bg-dark-surface dark:focus:bg-dark-surface dark:text-white dark:border-white/[0.08] ${codeStatus === "error" ? "border-danger" : "border-[#e8e6ea]"}`}
                value={digit}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>

          {/* Сообщения о статусе */}
          <div
            className={`mb-1.5 flex min-h-[18px] items-center justify-center gap-1.5 text-center text-[13px] leading-[18px] font-normal text-ink dark:text-white ${codeStatus === "success" ? "text-success" : ""} ${codeStatus === "error" ? "text-danger" : ""}`}
          >
            {codeStatus === "success" && (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="rgba(50, 129, 70, 1)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 8L7 10L11 6"
                    stroke="rgba(50, 129, 70, 1)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>E-mail verified. You’re ready for the next step.</span>
              </>
            )}
            {codeStatus === "error" && (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="rgba(214, 40, 40, 1)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5V9M8 11V11.5"
                    stroke="rgba(214, 40, 40, 1)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Incorrect code. Try again.</span>
              </>
            )}
          </div>

          {/* Таймер */}
          <p className="text-center text-[13px] font-normal text-muted dark:text-white/70">
            Request a new code in 00:{timer < 10 ? `0${timer}` : timer}s
          </p>
        </div>

        {/* Кнопка снизу */}
        <div className="absolute inset-x-0 bottom-10 flex h-[86px] flex-col items-center justify-start">
          <button
            type="submit"
            className="flex h-14 w-[295px] max-w-full items-center justify-center rounded-3xl border-0 bg-[linear-gradient(90deg,#ff7fc0_0%,#ff813e_100%)] text-xl font-medium text-white transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-[0.98] dark:bg-[linear-gradient(135deg,#ff7fc0_0%,#ff813e_100%)] dark:text-[#141414]"
          >
            {codeStatus === "error" ? "Retry verification" : "Next"}
          </button>

          <p className="mt-2 text-center text-[15px] font-normal text-ink dark:text-white">
            Didn't receive any code?
            <button
              type="button"
              onClick={handleResendCode}
              className={`ml-1 border-0 bg-transparent font-[inherit] text-[inherit] text-ink underline dark:text-white ${timer > 0 ? "cursor-default opacity-50" : "cursor-pointer"}`}
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
