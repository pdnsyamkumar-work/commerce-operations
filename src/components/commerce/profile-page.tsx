import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { User } from "@/lib/store";
import { useClickOutside } from "./shared";

const countryOptions = [
  { value: "+1", label: "+1 United States" },
  { value: "+44", label: "+44 United Kingdom" },
  { value: "+61", label: "+61 Australia" },
  { value: "+91", label: "+91 India" },
];

type ProfileDetails = {
  countryCode: string;
  phone: string;
  title: string;
  avatar: string;
};

type ProfilePageProps = {
  user: User;
  profile: ProfileDetails;
  onSave: (updates: {
    name: string;
    email: string;
    profile: ProfileDetails;
  }) => void;
};

export function ProfilePage({ user, profile, onSave }: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [countryCode, setCountryCode] = useState(profile.countryCode);
  const [phone, setPhone] = useState(profile.phone);
  const [title, setTitle] = useState(profile.title);
  const [avatar, setAvatar] = useState(profile.avatar);

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataUrl(file);
    setAvatar(dataUrl);
    event.target.value = "";
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      profile: { countryCode, phone, title, avatar },
    });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-center shadow-sm sm:rounded-[1.75rem] sm:p-6">
        <label className="relative mx-auto block h-32 w-32 cursor-pointer">
          <span className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-4xl font-semibold text-white">
            {avatar ? (
              <img
                className="h-full w-full object-cover"
                src={avatar}
                alt={name}
              />
            ) : (
              name.slice(0, 1)
            )}
          </span>
          <span
            className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition duration-200 hover:bg-slate-100"
            aria-hidden="true"
          >
            <CameraIcon />
          </span>
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
          />
        </label>
        <h2 className="mt-5 text-2xl font-semibold">{name}</h2>
        <p className="mt-1 break-all text-sm text-[color:var(--muted)]">{email}</p>
        <p className="mt-3 rounded-full bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-semibold capitalize text-slate-700">
          {user.role}
        </p>
      </article>

      <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
        <h2 className="text-2xl font-semibold">Profile settings</h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          Update personal details and upload a profile picture for the commerce
          workspace.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={submitProfile}>
          <label className="grid gap-2 text-sm font-semibold">
            Full name
            <input
              className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Work email
            <input
              className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Country code
              <CountryCodeDropdown
                value={countryCode}
                onChange={setCountryCode}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Phone
              <input
                className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                placeholder="Example: 555 0100"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Job title
              <input
                className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                placeholder="Example: Store Admin"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
          </div>

          <button
            className="w-fit rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            type="submit"
          >
            Save Profile
          </button>
        </form>
      </article>
    </section>
  );
}

function CountryCodeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpen(false));
  const selected = countryOptions.find((option) => option.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-left font-normal transition duration-200 hover:bg-slate-50"
        type="button"
        aria-label="Country code"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="min-w-0 truncate">{selected?.label ?? value}</span>
        <span className="shrink-0" aria-hidden="true">v</span>
      </button>
      {open && (
        <div
          className="absolute inset-x-0 z-40 mt-2 rounded-2xl border border-[color:var(--border)] bg-white p-2 shadow-xl"
          role="listbox"
          aria-label="Country code options"
        >
          {countryOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition duration-200 hover:bg-slate-100 ${option.value === value ? "bg-slate-950 text-white hover:bg-slate-950" : ""}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="14" r="3" />
    </svg>
  );
}
