import { useRef, useState } from "react";
import { useClickOutside } from "./shared";

const priorityOptions = ["Low", "Medium", "High"];

export function SupportPage() {
  const [priority, setPriority] = useState("Medium");

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Support center</h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          Use this page to practice support workflows, documentation links, and
          help request validation.
        </p>
        <form className="mt-6 grid gap-4">
          <input
            className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3"
            placeholder="Support subject"
          />
          <PriorityDropdown value={priority} onChange={setPriority} />
          <textarea
            className="min-h-32 rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3"
            placeholder="Describe the issue"
          />
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            type="button"
          >
            Submit Support Request
          </button>
        </form>
      </article>
      <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Help topics</h3>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="rounded-2xl bg-white p-4">
            <strong>Product imports</strong>
            <p className="mt-1 text-[color:var(--muted)]">
              Upload CSV files and validate inventory changes.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <strong>Cart operations</strong>
            <p className="mt-1 text-[color:var(--muted)]">
              Add, update, and remove products from cart flows.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <strong>Reports</strong>
            <p className="mt-1 text-[color:var(--muted)]">
              Review embedded previews and operational controls.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

function PriorityDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-left transition duration-200 hover:bg-slate-50"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{value}</span>
        <span>v</span>
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-white p-2 shadow-xl">
          {priorityOptions.map((option) => (
            <button
              key={option}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition duration-200 hover:bg-slate-100 ${option === value ? "bg-slate-950 text-white hover:bg-slate-950" : ""}`}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
