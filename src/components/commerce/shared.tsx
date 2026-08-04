import type { Product } from "@/lib/store";
import { useEffect, type ReactNode, type RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
) {
  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;
      if (
        !ref.current ||
        !(target instanceof Node) ||
        ref.current.contains(target)
      ) {
        return;
      }

      onOutsideClick();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [ref, onOutsideClick]);
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </article>
  );
}

export function StatusBadge({ status }: { status: Product["status"] }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "Active"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

export function InlineError({ id, message,dataTestId }: { id: string; message?: string,dataTestId?: string; }) {
  if (!message) {
    return null;
  }

  return (  
    <p 
    id={id}
    data-testid={dataTestId}
    className="text-sm font-medium text-rose-700" role="alert">
      {message}
    </p>
  );
}

export function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <span className="relative block">
      {children}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
        v
      </span>
    </span>
  );
}
