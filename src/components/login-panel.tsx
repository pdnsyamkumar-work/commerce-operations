"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppToast } from "@/components/commerce/app-toast";
import type { User } from "@/lib/store";

type LoginPanelProps = {
  onAuthenticated: (user: User) => void;
};

type AuthMode = "sign-in" | "sign-up" | "forgot-password";

type SignUpErrors = Partial<
  Record<"name" | "email" | "store" | "password" | "confirmPassword", string>
>;
type SignInErrors = Partial<Record<"email", string>>;
type ForgotPasswordErrors = Partial<Record<"email", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function InlineError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p  data-testid="error message-signin email" id={id} className="text-sm font-medium text-rose-700" role="alert">
      {message}
    </p>
  );
}

export function LoginPanel({ onAuthenticated }: LoginPanelProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("admin@commerce.test");
  const [password, setPassword] = useState("Commerce@123");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("admin@commerce.test");
  const [message, setMessage] = useState(
    "Use the demo admin account to enter the workspace.",
  );
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [signInErrors, setSignInErrors] = useState<SignInErrors>({});
  const [signUpErrors, setSignUpErrors] = useState<SignUpErrors>({});
  const [forgotPasswordErrors, setForgotPasswordErrors] =
    useState<ForgotPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isToastVisible) {
      return;
    }

    const toastTimer = window.setTimeout(() => setIsToastVisible(false), 3000);
    return () => window.clearTimeout(toastTimer);
  }, [isToastVisible, toastMessage]);

  function showToast(nextMessage: string) {
    setToastMessage(nextMessage);
    setIsToastVisible(true);
  }

  function switchMode(nextMode: AuthMode) {
    setAuthMode(nextMode);
    setIsSubmitting(false);
    setSignInErrors({});
    setSignUpErrors({});
    setForgotPasswordErrors({});
    setMessage(
      nextMode === "sign-in"
        ? "Use the demo admin account to enter the workspace."
        : nextMode === "sign-up"
          ? "Request a workspace account for a new commerce team member."
          : "Enter your work email to receive reset instructions.",
    );
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Signing in...");

    const nextErrors: SignInErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setSignInErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("Fix the highlighted email field before signing in.");
      setIsSubmitting(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      const data = (await response.json()) as { user?: User; message?: string };

      if (!response.ok || !data.user) {
        setMessage(data.message ?? "Could not sign in.");
        return;
      }

      setMessage(`Welcome back, ${data.user.name}.`);
      onAuthenticated(data.user);
    } catch {
      setMessage("Could not reach the server. Please try again.");
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  }

  async function submitSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SignUpErrors = {};

    if (!signUpName.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!signUpEmail.trim()) {
      nextErrors.email = "Work email is required.";
    } else if (!emailPattern.test(signUpEmail)) {
      nextErrors.email = "Enter a valid work email address.";
    }

    if (!storeName.trim()) {
      nextErrors.store = "Store or company name is required.";
    }

    if (!signUpPassword) {
      nextErrors.password = "Password is required.";
    } else if (signUpPassword.length < 8) {
      nextErrors.password = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (signUpPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setSignUpErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("Fix the highlighted fields before creating access.");
      return;
    }

    setIsSubmitting(true);
    setMessage("Creating account...");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signUpName,
        email: signUpEmail,
        storeName,
        password: signUpPassword,
      }),
    });
    const data = (await response.json()) as { user?: User; message?: string };

    if (!response.ok || !data.user) {
      setMessage(data.message ?? "Could not create account.");
      setIsSubmitting(false);
      return;
    }

    setEmail(signUpEmail);
    setResetEmail(signUpEmail);
    setMessage(`Account created for ${data.user.name}.`);
    onAuthenticated(data.user);
    setIsSubmitting(false);
  }

  function submitForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ForgotPasswordErrors = {};

    if (!resetEmail.trim()) {
      nextErrors.email = "Work email is required.";
    } else if (!emailPattern.test(resetEmail)) {
      nextErrors.email = "Enter a valid work email address.";
    }

    setForgotPasswordErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage(
        "Fix the highlighted email field before sending reset instructions.",
      );
      return;
    }

    const successMessage = `Password reset instructions were sent to ${resetEmail}.`;
    setEmail(resetEmail);
    setMessage(successMessage);
    showToast(successMessage);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1180px] items-center px-5 py-8 sm:px-8">
      <AppToast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        type="success"
      />
      <section className="grid w-full overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_24px_80px_rgba(78,52,35,0.14)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-10 bg-slate-950 p-8 text-white lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-200">
              Commerce Operations
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Secure access for daily storefront operations.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Sign in, request access, or recover an account before managing
              catalog, stock, cart, and reports.
            </p>
          </div>
          <div className="mx-auto grid w-full max-w-xl gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">Demo account</p>
            <p>Email: admin@commerce.test</p>
            <p>Password: Commerce@123</p>
          </div>
        </div>

        <div className="grid gap-5 p-8 lg:p-10">
          <div className="flex flex-wrap gap-2 rounded-full bg-[color:var(--surface-strong)] p-1">
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${authMode === "sign-in" ? "bg-slate-950 text-white hover:bg-slate-800" : "text-[color:var(--muted)] hover:bg-slate-100 hover:text-slate-900"}`}
              type="button"
              onClick={() => switchMode("sign-in")}
            >
              Sign in
            </button>
            <button
            data-testid ="tab-sign up"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${authMode === "sign-up" ? "bg-slate-950 text-white hover:bg-slate-800" : "text-[color:var(--muted)] hover:bg-slate-100 hover:text-slate-900"}`}
              type="button"
              onClick={() => switchMode("sign-up")}
            >
              Sign up
            </button>
            <button
            data-testid="tab-forgot password"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${authMode === "forgot-password" ? "bg-slate-950 text-white hover:bg-slate-800" : "text-[color:var(--muted)] hover:bg-slate-100 hover:text-slate-900"}`}
              type="button"
              onClick={() => switchMode("forgot-password")}
            >
              Forgot password
            </button>
          </div>

          {authMode === "sign-in" && (
            <form className="grid gap-5" onSubmit={submitLogin}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                  Admin login
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Welcome back</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Enter a valid demo user to unlock the dashboard.
                </p>
              </div>

              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Email address <span className="text-rose-600">*</span>
                </span>
                <input
                data-testid ="input-textfield-email"
                  className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (signInErrors.email) {
                      setSignInErrors((current) => ({ ...current, email: undefined }));
                    }
                  }}
                />
                <InlineError  id="sign-in-email" message={signInErrors.email} />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Password <span className="text-rose-600">*</span>
                </span>
                <PasswordField
                  value={password}
                  showPassword={showLoginPassword}
                  onChange={setPassword}
                  onToggleVisibility={() =>
                    setShowLoginPassword((current) => !current)
                  }
                />
              </label>

              <button
              data-testid ="button-sign in"
                className="cursor-pointer rounded-full bg-[color:var(--accent)] px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                Sign In
              </button>
            </form>
          )}

          {authMode === "sign-up" && (
            <form className="grid gap-4" onSubmit={submitSignUp}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                  Access request
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Create team access
                </h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Submit a new account request for storefront operations.
                </p>
              </div>

              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Full name <span className="text-rose-600">*</span>
                </span>
                <input
                data-testid="input-textfield-fullname"
                  className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                  autoComplete="name"
                  value={signUpName}
                  onChange={(event) => setSignUpName(event.target.value)}
                />
                <InlineError id="sign-up-name" message={signUpErrors.name} />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Work email <span className="text-rose-600">*</span>
                </span>
                <input
                data-testid="input-textfield-work email"
                  className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={signUpEmail}
                  onChange={(event) => setSignUpEmail(event.target.value)}
                />
                <InlineError id="sign-up-email" message={signUpErrors.email} />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Store or company name <span className="text-rose-600">*</span>
                </span>
                <input
                data-testid="input-textfield-companyname"
                  className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                  autoComplete="organization"
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                />
                <InlineError id="sign-up-store" message={signUpErrors.store} />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Password <span className="text-rose-600">*</span>
                </span>
                <PasswordField
                  value={signUpPassword}
                  showPassword={showSignUpPassword}
                  onChange={setSignUpPassword}
                  onToggleVisibility={() =>
                    setShowSignUpPassword((current) => !current)
                  }
                />
                <InlineError
                  id="sign-up-password"
                  message={signUpErrors.password}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Confirm password <span className="text-rose-600">*</span>
                </span>
                <PasswordField
                  value={confirmPassword}
                  showPassword={showConfirmPassword}
                  onChange={setConfirmPassword}
                  onToggleVisibility={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                />
                <InlineError
                  id="sign-up-confirm-password"
                  message={signUpErrors.confirmPassword}
                />
              </label>
              <button
              data-testid="button-create account"
                className="rounded-full bg-[color:var(--accent)] px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                Create Account
              </button>
            </form>
          )}

          {authMode === "forgot-password" && (
            <form className="grid gap-5" onSubmit={submitForgotPassword}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                  Account recovery
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Reset password</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  We will send reset instructions to your registered work email.
                </p>
              </div>

              <label className="grid gap-2 text-sm font-semibold">
                <span>
                  Work email <span className="text-rose-600">*</span>
                </span>
                <input
                data-testid="input-textfield-workemail"
                  className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                />
                <InlineError
                  id="reset-email"
                  message={forgotPasswordErrors.email}
                />
              </label>

              <button
              data-testid="button-send reset link"
                className="rounded-full bg-[color:var(--accent)] px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)]"
                type="submit"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <p  data-testid="error message-password-duplicatemail"className="rounded-2xl bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
            {message}
          </p>
        </div>
      </section>
    </main>
  );
}

function PasswordField({
  value,
  showPassword,
  onChange,
  onToggleVisibility,
}: {
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}) {
  return (
    <div className="relative">
      <input
      data-testid ="input-textfield-password"
        className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 pr-24 font-normal"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
      data-testid="button-view"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-slate-950"
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        onClick={onToggleVisibility}
      >
        {showPassword ? "Hide" : "View"}
      </button>
    </div>
  );
}
