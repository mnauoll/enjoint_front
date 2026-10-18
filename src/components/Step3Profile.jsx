import React, { useState } from "react";

const Step3Profile = ({ onNext, initialData }) => {
  const [profileData, setProfileData] = useState(
    initialData || { username: "", age: "", gender: "" },
  );

  const [errors, setErrors] = useState({
    username: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGenderSelect = (selectedGender) => {
    setProfileData((prev) => ({ ...prev, gender: selectedGender }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { username: "", age: "", gender: "" };
    let hasError = false;

    // 1. Валидация Username
    if (!profileData.username.trim()) {
      newErrors.username = "Username is required.";
      hasError = true;
    }

    // 2. Валидация Age (должно быть заполнено и содержать только цифры)
    if (!profileData.age.toString().trim()) {
      newErrors.age = "Age is required.";
      hasError = true;
    } else if (!/^\d+$/.test(profileData.age)) {
      newErrors.age = "Use a number.";
      hasError = true;
    }

    // 3. Валидация Gender
    if (!profileData.gender) {
      newErrors.gender = "Gender is required. Choose an option.";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onNext(profileData);
    }
  };

  const genderOptions = ["Woman", "Man", "Other"];

  return (
    <>
      {/* Заголовок шага */}
      <div className="mb-5 flex h-[90px] w-full flex-col items-center gap-1.5">
        <h1 className="m-0 text-center text-[56px] leading-[1.1] font-bold text-ink dark:text-white">
          Profile
        </h1>
        <p className="m-0 text-center text-base font-normal text-ink dark:text-white">
          Tell us a little about yourself.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-[465px] max-w-full flex-col items-center gap-3"
        noValidate
      >
        {/* Строка с полями Username и Age */}
        <div className="flex w-full max-w-full gap-4">
          {/* Поле Username */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <label className="text-[13px] font-normal text-muted dark:text-white">
              Username
            </label>
            <div
              className={`flex h-[50px] w-full items-center gap-3 rounded-full border bg-white px-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-colors dark:bg-dark-surface dark:border-white/[0.08] ${errors.username ? "border-danger" : "border-transparent"}`}
            >
              <span className="flex items-center justify-center">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <circle
                    cx="7"
                    cy="4"
                    r="3"
                    stroke="rgba(119, 119, 119, 1)"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M1 14C1 11.2386 3.68629 9 7 9C10.3137 9 13 11.2386 13 14"
                    stroke="rgba(119, 119, 119, 1)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                name="username"
                className="w-full border-0 bg-transparent text-[15px] font-normal text-ink outline-none dark:text-white"
                placeholder="Enter username"
                value={profileData.username}
                onChange={handleChange}
              />
            </div>
            <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
              {errors.username}
            </span>
          </div>

          {/* Поле Age */}
          <div className="flex w-[120px] flex-col gap-1">
            <label className="text-[13px] font-normal text-muted dark:text-white">
              Age
            </label>
            <div
              className={`flex h-[50px] w-[120px] items-center justify-center rounded-full border bg-white px-4 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-colors dark:bg-dark-surface dark:border-white/[0.08] ${errors.age ? "border-danger" : "border-transparent"}`}
            >
              <input
                type="text"
                name="age"
                className="w-full border-0 bg-transparent text-center text-[15px] font-normal text-ink outline-none dark:text-white"
                placeholder="26"
                value={profileData.age}
                onChange={handleChange}
              />
            </div>
            <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
              {errors.age}
            </span>
          </div>
        </div>

        {/* Выбор пола (Gender) */}
        <div className="flex w-[329px] max-w-full flex-col gap-1">
          <label className="text-[13px] font-normal text-muted dark:text-white">
            Gender
          </label>

          <div className="flex w-full flex-col gap-2">
            {genderOptions.map((option) => {
              const isSelected = profileData.gender === option;
              return (
                <button
                  key={option}
                  type="button"
                  className={`flex h-[50px] w-full max-w-full cursor-pointer items-center justify-between rounded-3xl border px-5 transition-all duration-200 hover:border-brand-pink/50 ${isSelected ? "border-transparent bg-brand-pink text-white shadow-[0_4px_15px_rgba(255,127,192,0.3)]" : "border-[#e8e6ea] bg-white text-ink dark:border-white/[0.08] dark:bg-dark-surface dark:text-white"}`}
                  onClick={() => handleGenderSelect(option)}
                >
                  <span className="text-[15px] leading-5 font-medium">
                    {option}
                  </span>
                  {isSelected && (
                    <span className="flex items-center justify-center">
                      <svg
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                      >
                        <path
                          d="M1.5 5L5 8.5L12.5 1.5"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
            {errors.gender}
          </span>
        </div>

        {/* Кнопка Next */}
        <div className="absolute inset-x-0 bottom-10 flex h-[86px] flex-col items-center justify-start">
          <button
            type="submit"
            className="flex h-14 w-[295px] max-w-full items-center justify-center rounded-3xl border-0 bg-[linear-gradient(90deg,#ff7fc0_0%,#ff813e_100%)] text-xl font-medium text-white transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-[0.98] dark:bg-[linear-gradient(135deg,#ff7fc0_0%,#ff813e_100%)] dark:text-[#141414]"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default Step3Profile;
