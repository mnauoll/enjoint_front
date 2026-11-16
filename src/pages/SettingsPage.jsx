import { useState } from "react";
import {
  Check,
  Copy,
  LockKeyhole,
  MapPin,
  Shield,
  SlidersHorizontal,
  UserRound,
  UserRoundX,
  X,
} from "lucide-react";
import AppHeader from "../components/AppHeader";
import { CURRENT_USER_ID } from "../data/demoFriends";

const PROFILE_STORAGE_KEY = "enjoint-profile";
const PREFERENCES_STORAGE_KEY = "enjoint-preferences";
const INTERESTS = [
  "Photography",
  "Shopping",
  "Karaoke",
  "Cooking",
  "Yoga",
  "Tennis",
  "Run",
  "Art",
  "Drink",
  "Video games",
  "Extreme",
  "Music",
  "Swimming",
  "Traveling",
];
const PROFILE_DEFAULTS = {
  username: "alexmorgan",
  age: "26",
  gender: "Man",
  description: "Coffee, concerts and meeting new people. Always up for a good conversation!",
  interests: ["Shopping", "Run", "Music", "Traveling"],
  instagram: "@alexmorgan",
  photo: "",
};
const PREFERENCES_DEFAULTS = {
  pushNotifications: true,
  eventUpdates: true,
  city: "Poznań, Poland",
  showLocation: false,
};

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch (error) {
    console.error(`Unable to load ${key}:`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    throw new Error("Your changes could not be saved in this browser.");
  }
}

function SettingsDialog({ title, children, isDark, onClose, labelledBy }) {
  return (
    <div
      aria-labelledby={labelledBy}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section
        className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${
          isDark ? "border-[#29313b] bg-[#11161d] text-white" : "border-gray-200 bg-white text-[#262626]"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold" id={labelledBy}>{title}</h2>
          <button aria-label="Close dialog" className="rounded-full p-1.5 opacity-65 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function SettingsPanel({ title, children, isDark, className = "" }) {
  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 ${
        isDark ? "border-[#29313b] bg-[#11161d]" : "border-gray-200 bg-white"
      } ${className}`}
    >
      <h2 className="text-sm font-bold">{title}</h2>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, isDark, type = "text", hint, ...inputProps }) {
  return (
    <label className="grid min-w-0 gap-1.5 text-[10px] font-medium">
      {label}
      <input
        className={`h-10 w-full rounded-full border px-3 text-xs outline-none transition focus:border-[#ff7fc0] ${
          isDark ? "border-[#303843] bg-[#1b222c] text-white" : "border-gray-200 bg-gray-100 text-[#262626]"
        }`}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
        {...inputProps}
      />
      {hint && <span className="text-[9px] font-normal text-gray-500 dark:text-[#9ba3b0]">{hint}</span>}
    </label>
  );
}

function ActionButton({ children, primary = false, danger = false, className = "", type = "button", ...props }) {
  const styles = primary
    ? "border-transparent bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-[#171219] hover:brightness-105"
    : danger
      ? "border-[#d04760]/40 text-[#d04760] hover:bg-[#d04760]/10"
      : "border-current/15 hover:border-[#ff7fc0]";
  return (
    <button
      className={`flex h-9 items-center justify-center gap-1.5 rounded-full border px-4 text-[11px] font-semibold transition ${styles} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`relative h-5 w-10 shrink-0 rounded-full transition ${checked ? "bg-[#ff65ac]" : "bg-gray-300 dark:bg-[#343c47]"}`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export default function SettingsPage({ isDark, setIsDark, onTabChange }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [savedProfile, setSavedProfile] = useState(() => readStorage(PROFILE_STORAGE_KEY, PROFILE_DEFAULTS));
  const [profile, setProfile] = useState(savedProfile);
  const [savedPreferences, setSavedPreferences] = useState(() => readStorage(PREFERENCES_STORAGE_KEY, PREFERENCES_DEFAULTS));
  const [preferences, setPreferences] = useState(savedPreferences);
  const [profilePhoto, setProfilePhoto] = useState(() => readStorage(PROFILE_STORAGE_KEY, PROFILE_DEFAULTS).photo);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState("");
  const [email, setEmail] = useState(() => {
    try {
      return window.localStorage.getItem("enjoint-email") || "alex.morgan@gmail.com";
    } catch (storageError) {
      console.error("Unable to load saved email:", storageError);
      return "alex.morgan@gmail.com";
    }
  });
  const [emailDraft, setEmailDraft] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [instagramDraft, setInstagramDraft] = useState(profile.instagram);
  const [editingInstagram, setEditingInstagram] = useState(false);

  const isProfile = activeSection === "profile";
  const isAccount = activeSection === "account";
  const mutedText = isDark ? "text-[#aeb5c0]" : "text-gray-500";
  const inputClass = `h-10 w-full rounded-full border px-3 text-xs outline-none focus:border-[#ff7fc0] ${
    isDark ? "border-[#303843] bg-[#1b222c] text-white" : "border-gray-200 bg-gray-100 text-[#262626]"
  }`;

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setStatus("");
    setError("");
  };
  const updatePreference = (field, value) => {
    setPreferences((current) => ({ ...current, [field]: value }));
    setStatus("");
    setError("");
  };

  const handleThemeChange = (theme) => {
    const updatedPreferences = { ...preferences, theme };
    try {
      writeStorage(PREFERENCES_STORAGE_KEY, updatedPreferences);
      setPreferences(updatedPreferences);
      setSavedPreferences((current) => ({ ...current, theme }));
      setIsDark(theme === "dark");
      setStatus(`Switched to ${theme} theme.`);
      setError("");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const saveProfile = () => {
    if (profile.interests.length < 4) {
      setError("Select at least four interests before saving.");
      return;
    }
    try {
      const profileToSave = { ...profile, photo: profilePhoto };
      writeStorage(PROFILE_STORAGE_KEY, profileToSave);
      setSavedProfile(profileToSave);
      setStatus("Profile changes saved.");
      setError("");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const savePreferences = () => {
    try {
      writeStorage(PREFERENCES_STORAGE_KEY, preferences);
      setSavedPreferences(preferences);
      setIsDark(preferences.theme === "light" ? false : preferences.theme === "dark" ? true : isDark);
      setStatus("Preferences saved.");
      setError("");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const cancelChanges = () => {
    if (isProfile) {
      setProfile(savedProfile);
      setProfilePhoto(savedProfile.photo || "");
    }
    if (!isProfile && !isAccount) {
      setPreferences(savedPreferences);
      setIsDark(savedPreferences.theme === "dark");
    }
    setError("");
    setStatus("Changes discarded.");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setError("Profile photos must be 1 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result);
        setError("");
        setStatus("Photo selected. Save profile changes to keep it.");
      }
    };
    reader.onerror = () => setError("The selected photo could not be read.");
    reader.readAsDataURL(file);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(CURRENT_USER_ID);
      setStatus("Your account ID was copied.");
      setError("");
    } catch (copyError) {
      console.error("Unable to copy account ID:", copyError);
      setError("Could not copy the ID. Please select and copy it manually.");
      setStatus("");
    }
  };

  const handleEmailSave = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft)) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      window.localStorage.setItem("enjoint-email", emailDraft);
      setEmail(emailDraft);
      setStatus("Email updated in this demo. Email verification is not connected.");
      setError("");
    } catch (storageError) {
      console.error("Unable to save email:", storageError);
      setError("The email could not be saved in this browser.");
    }
  };

  const handlePasswordUpdate = (event) => {
    event.preventDefault();
    if (!currentPassword || newPassword.length < 8 || newPassword !== confirmPassword) {
      setError("Enter your current password, choose at least 8 characters, and make both new passwords match.");
      return;
    }
    setStatus("Password update is not connected to an authentication service in this demo.");
    setError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("Location access was granted by your browser.");
        setError("");
      },
      (locationError) => {
        console.warn("Unable to access location:", locationError.message);
        setError("Location access is unavailable. Check your browser permissions.");
      },
      { timeout: 10000 },
    );
  };

  const handleConfirmAccountAction = () => {
    setDialog("");
    setStatus(
      dialog === "delete"
        ? "Account deletion is not connected in this demo. No account data was deleted."
        : "Sign-out is not connected in this demo.",
    );
  };

  const tabs = [
    { id: "profile", label: "Profile and interests", icon: UserRound },
    { id: "account", label: "Account and security", icon: LockKeyhole },
    { id: "preferences", label: "Preferences and privacy", icon: SlidersHorizontal },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fa] font-rubik text-[#262626] transition-colors dark:bg-[#0b0f14] dark:text-white">
      <AppHeader activeTab="Settings" fixed isDark={isDark} onTabChange={onTabChange} />
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col gap-4 px-5 pb-10 pt-[98px] max-[560px]:px-3">
        <header>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className={`mt-1 text-xs ${mutedText}`}>
            {isProfile
              ? "Keep your profile feeling like you."
              : isAccount
                ? "Manage your sign-in details and your account."
                : "Choose how ENJOINT fits into your day."}
          </p>
        </header>

        <div aria-label="Settings sections" className="flex flex-wrap gap-2" role="tablist">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              aria-selected={activeSection === id}
              className={`flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[10px] font-medium transition ${
                activeSection === id
                  ? "border-[#e65a9c] bg-[#fce8f2] text-[#ad316b] dark:bg-[#2e2030] dark:text-[#ff87c2]"
                  : "border-gray-300 hover:border-[#e65a9c] dark:border-[#343c47]"
              }`}
              key={id}
              onClick={() => {
                setActiveSection(id);
                setStatus("");
                setError("");
              }}
              role="tab"
              type="button"
            >
              {activeSection === id && <Check size={12} />}
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {isProfile && (
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(230px,.78fr)]">
            <div className="grid gap-4">
              <SettingsPanel isDark={isDark} title="Personal information">
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#ffd4b5] to-[#e87665] text-[#59362e]">
                    {profilePhoto ? <img alt="Profile" className="size-full object-cover" src={profilePhoto} /> : <UserRound size={27} />}
                  </div>
                  <div className="mr-auto">
                    <p className="text-xs font-semibold">Profile photo</p>
                    <p className={`mt-1 text-[9px] ${mutedText}`}>Avatar.png · Uploaded</p>
                  </div>
                  <label className="flex h-9 cursor-pointer items-center rounded-full border border-current/15 px-4 text-[10px] font-semibold transition hover:border-[#ff7fc0]">
                    Change photo
                    <input accept="image/*" className="sr-only" onChange={handlePhotoChange} type="file" />
                  </label>
                  <button className="px-1 text-[10px] text-[#e65a9c] hover:underline" onClick={() => setProfilePhoto("")} type="button">
                    Remove
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <TextField isDark={isDark} label="Username" onChange={(value) => updateProfile("username", value)} value={profile.username} />
                  <TextField isDark={isDark} label="Age" onChange={(value) => updateProfile("age", value)} type="number" value={profile.age} />
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-medium">Gender</p>
                  <div className="flex flex-wrap gap-2">
                    {["Woman", "Man", "Other"].map((gender) => (
                      <button
                        aria-pressed={profile.gender === gender}
                        className={`flex h-8 items-center gap-1 rounded-full border px-3 text-[10px] transition ${
                          profile.gender === gender
                            ? "border-[#e65a9c] bg-[#fce8f2] text-[#ad316b] dark:bg-[#2e2030] dark:text-[#ff87c2]"
                            : "border-current/15 hover:border-[#ff7fc0]"
                        }`}
                        key={gender}
                        onClick={() => updateProfile("gender", gender)}
                        type="button"
                      >
                        {profile.gender === gender && <Check size={11} />}
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="mt-4 grid gap-1.5 text-[10px] font-medium">
                  Bio / description
                  <textarea
                    className={`min-h-[76px] resize-y rounded-xl border p-3 text-xs outline-none focus:border-[#ff7fc0] ${
                      isDark ? "border-[#303843] bg-[#1b222c] text-white" : "border-gray-200 bg-gray-100 text-[#262626]"
                    }`}
                    onChange={(event) => updateProfile("description", event.target.value)}
                    value={profile.description}
                  />
                </label>
              </SettingsPanel>

              <SettingsPanel isDark={isDark} title="Hobbies and interests">
                <p className={`mt-2 text-[10px] ${mutedText}`}>Select at least four interests to help people find common ground.</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {INTERESTS.map((interest) => {
                    const selected = profile.interests.includes(interest);
                    return (
                      <button
                        aria-pressed={selected}
                        className={`h-9 rounded-lg border px-2 text-left text-[10px] transition ${
                          selected
                            ? "border-[#ff7fc0] bg-[#ff7fc0] font-semibold text-[#24141d]"
                            : isDark
                              ? "border-[#252d37] bg-[#1b222c] hover:border-[#ff7fc0]"
                              : "border-gray-200 bg-gray-100 hover:border-[#ff7fc0]"
                        }`}
                        key={interest}
                        onClick={() => updateProfile(
                          "interests",
                          selected
                            ? profile.interests.filter((item) => item !== interest)
                            : [...profile.interests, interest],
                        )}
                        type="button"
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
                <p className={`mt-3 text-[10px] ${profile.interests.length >= 4 ? "text-emerald-500" : "text-amber-500"}`}>
                  {profile.interests.length} selected · Minimum four required
                </p>
              </SettingsPanel>

              <SettingsPanel isDark={isDark} title="Instagram · Optional">
                <p className={`mt-3 text-[10px] ${mutedText}`}>Connected Instagram account</p>
                {editingInstagram ? (
                  <input
                    aria-label="Instagram username"
                    className={`${inputClass} mt-2`}
                    onChange={(event) => setInstagramDraft(event.target.value)}
                    value={instagramDraft}
                  />
                ) : (
                  <div className={`mt-2 h-10 rounded-full border px-3 py-2.5 text-xs ${isDark ? "border-[#303843] bg-[#1b222c]" : "border-gray-200 bg-gray-100"}`}>
                    {profile.instagram || "Not connected"}
                  </div>
                )}
                <p className={`mt-2 text-[9px] ${mutedText}`}>Example connection · You can edit or disconnect this account.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButton
                    onClick={() => {
                      if (editingInstagram) {
                        updateProfile("instagram", instagramDraft.trim());
                        setEditingInstagram(false);
                      } else {
                        setInstagramDraft(profile.instagram);
                        setEditingInstagram(true);
                      }
                    }}
                  >
                    {editingInstagram ? "Save connection" : "Edit connection"}
                  </ActionButton>
                  <ActionButton onClick={() => {
                    updateProfile("instagram", "");
                    setInstagramDraft("");
                    setEditingInstagram(false);
                  }}>
                    Disconnect
                  </ActionButton>
                </div>
              </SettingsPanel>
            </div>

            <SettingsPanel isDark={isDark} title="Your profile">
              <p className="mt-4 text-sm font-bold">{profile.username || "Your username"}</p>
              <p className={`mt-2 text-[10px] ${mutedText}`}>{profile.age} · {profile.gender} · Poznań</p>
              <p className={`mt-4 border-t border-current/10 pt-3 text-[10px] leading-relaxed ${mutedText}`}>
                {profile.description || "Add a short bio to tell people a little about yourself."}
              </p>
              <p className="mt-3 text-[9px] leading-relaxed text-[#e65a9c]">{profile.interests.join(" · ")}</p>
              <p className={`mt-3 text-[9px] ${mutedText}`}>Changes appear on your profile after you save.</p>
            </SettingsPanel>
          </div>
        )}

        {isAccount && (
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(230px,1fr)]">
            <div className="grid gap-4">
              <SettingsPanel isDark={isDark} title="Email address">
                <form onSubmit={handleEmailSave}>
                  <TextField isDark={isDark} label="Email" onChange={setEmailDraft} type="email" value={emailDraft} />
                  <p className={`mt-2 text-[9px] ${mutedText}`}>Your verified registration email. A new address will need verification.</p>
                  <div className="mt-3 flex gap-2">
                    <ActionButton onClick={() => setEmailDraft(email)}>Cancel</ActionButton>
                    <ActionButton primary type="submit">Save email</ActionButton>
                  </div>
                </form>
              </SettingsPanel>

              <SettingsPanel isDark={isDark} title="Change password">
                <form className="mt-3 grid gap-3" onSubmit={handlePasswordUpdate}>
                  <TextField isDark={isDark} label="Current password" onChange={setCurrentPassword} type="password" value={currentPassword} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField isDark={isDark} label="New password" onChange={setNewPassword} placeholder="Enter a new password" type="password" value={newPassword} />
                    <TextField isDark={isDark} label="Confirm new password" onChange={setConfirmPassword} placeholder="Re-enter new password" type="password" value={confirmPassword} />
                  </div>
                  <p className={`text-[9px] ${mutedText}`}>Your password is never displayed. Authentication updates are demo-only.</p>
                  <div className="flex gap-2">
                    <ActionButton onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}>Cancel</ActionButton>
                    <ActionButton primary type="submit">Update password</ActionButton>
                  </div>
                </form>
              </SettingsPanel>

              <SettingsPanel isDark={isDark} title="Account actions">
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold">Sign out</p>
                    <p className={`mt-1 text-[9px] ${mutedText}`}>Leave this session without deleting your account.</p>
                  </div>
                  <ActionButton onClick={() => setDialog("signout")}>Sign out</ActionButton>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#d04760]">Delete account</p>
                    <p className={`mt-1 text-[9px] ${mutedText}`}>Permanently remove your account and profile.</p>
                  </div>
                  <ActionButton danger onClick={() => setDialog("delete")}>Delete account</ActionButton>
                </div>
              </SettingsPanel>
            </div>

            <SettingsPanel isDark={isDark} title="Account identification">
              <p className="mt-4 text-xs font-semibold">Alex Morgan · {profile.username}</p>
              <p className={`mt-3 text-[9px] ${mutedText}`}>Your ID</p>
              <p className="mt-2 select-all font-mono text-lg font-bold tracking-wide">{CURRENT_USER_ID}</p>
              <p className={`mt-2 text-[9px] leading-relaxed ${mutedText}`}>This ID is permanent and cannot be changed. Share it with friends so they can find your account.</p>
              <ActionButton className="mt-3" onClick={handleCopyId}><Copy size={12} /> Copy ID</ActionButton>
            </SettingsPanel>
          </div>
        )}

        {!isProfile && !isAccount && (
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(230px,1fr)]">
            <div className="grid gap-4">
              <SettingsPanel isDark={isDark} title="Notifications">
                {[
                  ["pushNotifications", "Push notifications", "Get notified about messages and event invitations."],
                  ["eventUpdates", "Event updates", "Stay informed when a joined event's details change."],
                ].map(([field, label, description]) => (
                  <div className="mt-4 flex items-center justify-between gap-4 first:mt-3" key={field}>
                    <div>
                      <p className="text-xs font-semibold">{label}</p>
                      <p className={`mt-1 text-[9px] ${mutedText}`}>{description}</p>
                    </div>
                    <Toggle checked={preferences[field]} label={label} onChange={(value) => updatePreference(field, value)} />
                  </div>
                ))}
                <p className="mt-3 text-[9px] text-emerald-500">
                  {preferences.pushNotifications || preferences.eventUpdates ? "Notification preferences enabled" : "All notification preferences are off"}
                </p>
                <p className={`mt-1 text-[9px] ${mutedText}`}>Notification delivery will be available when push services are connected.</p>
              </SettingsPanel>

              <SettingsPanel isDark={isDark} title="Location and privacy">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold">Location access · Managed by browser</p>
                    <p className={`mt-1 text-[9px] ${mutedText}`}>Allow access in browser settings to use your current location.</p>
                  </div>
                  <ActionButton onClick={handleAllowLocation}><MapPin size={12} /> Allow location</ActionButton>
                </div>
                <label className="mt-4 grid gap-1.5 text-[10px] font-medium">
                  Manual city
                  <input className={inputClass} onChange={(event) => updatePreference("city", event.target.value)} value={preferences.city} />
                </label>
                <p className={`mt-2 text-[9px] ${mutedText}`}>Using your manual city while geolocation is unavailable.</p>
                <p className={`mt-3 text-[9px] leading-relaxed ${mutedText}`}>Nearby recommendations are limited to your selected city. Your precise location is unavailable until you allow geolocation.</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold">Show my location</p>
                    <p className={`mt-1 text-[9px] ${mutedText}`}>Let other people see your city on your profile.</p>
                  </div>
                  <Toggle checked={preferences.showLocation} label="Show my location" onChange={(value) => updatePreference("showLocation", value)} />
                </div>
                <p className={`mt-2 text-[9px] ${mutedText}`}>{preferences.showLocation ? "Your city will be visible on your profile." : "Location hidden from your profile. Your manual city still helps find events."}</p>
              </SettingsPanel>

              <SettingsPanel isDark={isDark} title="Appearance">
                <p className={`mt-2 text-[10px] ${mutedText}`}>Choose your preferred theme.</p>
                <div className="mt-3 flex gap-2">
                  {["light", "dark"].map((theme) => (
                    <button
                      aria-pressed={(preferences.theme || (isDark ? "dark" : "light")) === theme}
                      className={`flex h-8 items-center gap-1 rounded-full border px-3 text-[10px] ${
                        (preferences.theme || (isDark ? "dark" : "light")) === theme
                          ? "border-[#e65a9c] bg-[#fce8f2] text-[#ad316b] dark:bg-[#2e2030] dark:text-[#ff87c2]"
                          : "border-current/15"
                      }`}
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      type="button"
                    >
                      {(preferences.theme || (isDark ? "dark" : "light")) === theme && <Check size={11} />}
                      {theme === "light" ? "Light" : "Dark"}
                    </button>
                  ))}
                </div>
              </SettingsPanel>
            </div>

            <SettingsPanel isDark={isDark} title="You're in control">
              <div className={`mt-3 space-y-3 text-[10px] leading-relaxed ${mutedText}`}>
                <p>You can keep your location private and still search for events by city.</p>
                <p>Browser permissions and your profile's location visibility are separate settings.</p>
                <p>Save your changes to apply your preferences.</p>
              </div>
            </SettingsPanel>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div aria-live="polite" className="min-h-5 text-[10px]">
            {error ? <span className="text-red-500">{error}</span> : status ? <span className="text-emerald-500">{status}</span> : (
              <span className={mutedText}>{isProfile || isAccount ? "Changes are ready to save." : "Unsaved preference changes"}</span>
            )}
          </div>
          {isAccount ? null : (
            <div className="flex gap-2">
              <ActionButton onClick={cancelChanges}>Cancel</ActionButton>
              <ActionButton onClick={isProfile ? saveProfile : savePreferences} primary>
                Save {isProfile ? "changes" : "preferences"}
              </ActionButton>
            </div>
          )}
        </footer>
      </div>

      {dialog && (
        <SettingsDialog
          isDark={isDark}
          labelledBy="account-action-title"
          onClose={() => setDialog("")}
          title={dialog === "delete" ? "Delete your account?" : "Sign out of ENJOINT?"}
        >
          <div className="mt-3 flex items-center gap-2 text-[#e65a9c]">
            {dialog === "delete" ? <UserRoundX size={22} /> : <Shield size={22} />}
            <p className="text-[10px]">{profile.username} · {CURRENT_USER_ID}</p>
          </div>
          <p className={`mt-4 text-xs leading-relaxed ${mutedText}`}>
            {dialog === "delete"
              ? "This action is permanent. Your profile, personal information, interests and friend connections would be removed. Account deletion is not available in this demo."
              : "Signing out ends this session. Authentication is not connected in this demo, so you will remain signed in."}
          </p>
          {dialog === "delete" && <p className="mt-3 text-[10px] text-[#d04760]">You won't be able to restore your account or its history.</p>}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <ActionButton onClick={() => setDialog("")}>{dialog === "delete" ? "Keep my account" : "Cancel"}</ActionButton>
            <ActionButton danger onClick={handleConfirmAccountAction}>
              {dialog === "delete" ? "Delete account" : "Sign out"}
            </ActionButton>
          </div>
        </SettingsDialog>
      )}
    </main>
  );
}
