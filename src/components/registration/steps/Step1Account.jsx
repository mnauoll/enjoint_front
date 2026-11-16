import { useState } from "react";
import { PrimaryButton, StepHeading } from "../RegistrationUI";

const Step1Account = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || { email: "", password: "", confirmPassword: "" },
  );

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { email: "", password: "", confirmPassword: "" };
    let hasError = false;

    // Валидация
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "E-mail is required.";
      hasError = true;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid e-mail address.";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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
      <StepHeading title="Welcome">
        Create your account
      </StepHeading>

      <form
        onSubmit={handleSubmit}
        className="flex w-[329px] max-w-full flex-col gap-1.5"
        noValidate
      >
        {/* E-mail */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-normal text-muted dark:text-white">
            E-mail
          </label>
          <div
            className={`flex h-[50px] w-full items-center gap-3 rounded-full border bg-white px-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-colors dark:bg-dark-surface dark:border-white/[0.08] ${errors.email ? "border-danger" : "border-transparent"}`}
          >
            <span className="flex items-center justify-center">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path
                  d="M2 2H16V12H2V2Z"
                  stroke="rgba(119, 119, 119, 1)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 2L9 8L16 2"
                  stroke="rgba(119, 119, 119, 1)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              className="w-full border-0 bg-transparent text-[15px] font-normal text-ink outline-none dark:text-white"
              placeholder="alex.morgan@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
            {errors.email}
          </span>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-normal text-muted dark:text-white">
            Password
          </label>
          <div
            className={`flex h-[50px] w-full items-center gap-3 rounded-full border bg-white px-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-colors dark:bg-dark-surface dark:border-white/[0.08] ${errors.password ? "border-danger" : "border-transparent"}`}
          >
            <span className="flex items-center justify-center">
              <svg width="13.5" height="15" viewBox="0 0 13.5 15" fill="none">
                <rect
                  x="1.5"
                  y="6.5"
                  width="10.5"
                  height="7"
                  rx="1.5"
                  stroke="rgba(119, 119, 119, 1)"
                  strokeWidth="1.6"
                />
                <path
                  d="M4.25 6.5V4A2.5 2.5 0 0 1 9.25 4V6.5"
                  stroke="rgba(119, 119, 119, 1)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              className="w-full border-0 bg-transparent text-[15px] font-normal text-ink outline-none dark:text-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
            {errors.password}
          </span>
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-normal text-muted dark:text-white">
            Confirm password
          </label>
          <div
            className={`flex h-[50px] w-full items-center gap-3 rounded-full border bg-white px-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-colors dark:bg-dark-surface dark:border-white/[0.08] ${errors.confirmPassword ? "border-danger" : "border-transparent"}`}
          >
            <span className="flex items-center justify-center">
              <svg width="13.5" height="15" viewBox="0 0 13.5 15" fill="none">
                <rect
                  x="1.5"
                  y="6.5"
                  width="10.5"
                  height="7"
                  rx="1.5"
                  stroke="rgba(119, 119, 119, 1)"
                  strokeWidth="1.6"
                />
                <path
                  d="M4.25 6.5V4A2.5 2.5 0 0 1 9.25 4V6.5"
                  stroke="rgba(119, 119, 119, 1)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border-0 bg-transparent text-[15px] font-normal text-ink outline-none dark:text-white"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
            {errors.confirmPassword}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-10 flex h-[86px] flex-col items-center justify-start">
          <PrimaryButton type="submit">CREATE</PrimaryButton>
          <p className="mt-2 text-center text-[15px] font-normal text-ink dark:text-white">
            Do you have an account?
            <button
              type="button"
              className="ml-1 cursor-pointer border-0 bg-transparent font-[inherit] text-inherit underline dark:text-white"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default Step1Account;
