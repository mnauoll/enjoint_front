import { useState, useRef } from "react";
import { PrimaryButton, StepHeading } from "../RegistrationUI";

const Step4PhotoBio = ({ onNext, initialData }) => {
  const [photo, setPhoto] = useState(initialData?.photo || null);
  const [photoName, setPhotoName] = useState(initialData?.photoName || "");
  const [bio, setBio] = useState(initialData?.bio || "");

  const [errors, setErrors] = useState({
    photo: "",
    bio: "",
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
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Please select an image file.",
        }));
        return;
      }

      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result);
        setErrors((prev) => ({ ...prev, photo: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    if (errors.bio) {
      setErrors((prev) => ({ ...prev, bio: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { photo: "", bio: "" };
    let hasError = false;

    if (!photo) {
      newErrors.photo = "Photo is required.";
      hasError = true;
    }

    if (!bio.trim()) {
      newErrors.bio = "Bio is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onNext({ photo, photoName, bio });
    }
  };

  return (
    <>
      <StepHeading title="Photo & Bio">
        Add your photo and introduce yourself.
      </StepHeading>

      <form
        onSubmit={handleSubmit}
        className="flex w-[329px] max-w-full flex-col items-center gap-3"
        noValidate
      >
        {/* Скрытый инпут загрузки файла */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Секция загрузки аватара */}
        <div className="flex flex-col items-center">
          <div
            className={`relative mb-1 flex size-20 cursor-pointer items-center justify-center rounded-full border bg-[#f4f4f4] transition-[border-color,transform] duration-150 hover:scale-[1.03] dark:border-white/[0.08] dark:bg-dark-surface ${errors.photo ? "border-danger" : "border-[#e8e6ea]"}`}
            onClick={handleTriggerUpload}
          >
            {photo ? (
              <img
                src={photo}
                alt="Avatar Preview"
                className="size-full rounded-full object-cover"
              />
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
                <circle
                  cx="13.5"
                  cy="13"
                  r="4.5"
                  stroke="rgba(119, 119, 119, 1)"
                  strokeWidth="1.6"
                />
              </svg>
            )}

            {/* Синяя кнопка карандаша (30x30px из Figma) */}
            <button
              type="button"
              className="absolute right-0 bottom-0 flex size-[30px] cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#52c3ff] p-0 shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition-transform duration-150 hover:scale-110 dark:border-dark-card"
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
            className="cursor-pointer border-0 bg-transparent p-0 text-[15px] leading-[18px] font-normal text-ink underline dark:text-white"
            onClick={handleTriggerUpload}
          >
            {photo ? "Change photo" : "Upload photo"}
          </button>

          {/* Статус загрузки или ошибка */}
          <div className="flex min-h-[18px] items-center justify-center">
            {errors.photo ? (
              <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
                {errors.photo}
              </span>
            ) : photoName ? (
              <span className="text-[12px] font-normal text-muted dark:text-white/70">
                {photoName} · Uploaded
              </span>
            ) : null}
          </div>
        </div>

        {/* Блок Bio (329px x 92px) */}
        <div className="flex w-[329px] flex-col gap-1">
          <label className="text-[13px] font-normal text-muted dark:text-white">
            Bio
          </label>
          <div
            className={`box-border h-[92px] w-full rounded-[20px] border bg-white px-[18px] py-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-colors dark:bg-dark-surface dark:border-white/[0.12] ${errors.bio ? "border-danger" : "border-transparent"}`}
          >
            <textarea
              className="size-full resize-none border-0 bg-transparent text-[14px] leading-5 font-normal text-ink outline-none placeholder:text-[#b4b4b4] dark:text-white dark:placeholder:text-white/40"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={handleBioChange}
              maxLength={250}
            />
          </div>
          <span className="block min-h-[18px] text-[13px] leading-[18px] text-danger">
            {errors.bio}
          </span>
        </div>

        {/* Кнопка Next */}
        <div className="absolute inset-x-0 bottom-10 flex h-[86px] flex-col items-center justify-start">
          <PrimaryButton type="submit">Next</PrimaryButton>
        </div>
      </form>
    </>
  );
};

// Список 14 интересов с иконками

export default Step4PhotoBio;
