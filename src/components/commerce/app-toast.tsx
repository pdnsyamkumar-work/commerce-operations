type AppToastProps = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error" | "default";
};

export function AppToast({ message, isVisible, onClose, type = "default" }: AppToastProps) {
  if (!isVisible) {
    return null;
  }

  let bgClass = "bg-slate-950";
  if (type === "success") {
    bgClass = "bg-emerald-600";
  } else if (type === "error") {
    bgClass = "bg-rose-600";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-6 top-6 z-40 flex max-w-sm items-start gap-4 rounded-[1.25rem] ${bgClass} px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(15,23,42,0.3)]`}
    >
      <span>{message}</span>
      <button
        className="rounded-full px-2 text-lg leading-none text-white/80 transition duration-200 hover:bg-white/10 hover:text-white"
        type="button"
        aria-label="Close notification"
        onClick={onClose}
      >
        x
      </button>
    </div>
  );
}
