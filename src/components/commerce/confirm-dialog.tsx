type ConfirmDialogProps = {
  title: string;
  description: string;
  highlightText?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  title,
  description,
  highlightText,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const [beforeHighlight, afterHighlight] = highlightText
    ? description.split(highlightText)
    : [description, ""];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-4 sm:items-center sm:px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
    >
      <div className="my-auto w-full max-w-md rounded-[1.5rem] bg-white p-4 shadow-2xl sm:rounded-[1.75rem] sm:p-6">
        <h2 id="confirmation-dialog-title" className="text-2xl font-semibold">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          {beforeHighlight}
          {highlightText && (
            <strong className="font-semibold text-slate-950">
              {highlightText}
            </strong>
          )}
          {afterHighlight}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-rose-800 hover:shadow-lg"
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
