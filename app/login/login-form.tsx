"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitEventHandler } from "react";

type LoginResponse = {
  message: string;
};

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(data.message);
        return;
      }
    } catch {
      setError("The server could not be reached. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username" className="mb-2 block text-xs font-semibold">
          Username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          placeholder="s.nevermimd"
          autoComplete="username"
          required
          disabled={isSubmitting}
          className="h-14 w-full rounded-xl border border-[#303436] bg-[#1c1c1c] px-4 text-sm text-white outline-none transition placeholder:text-[#55595c] focus:border-[#13b7b9] focus:ring-2 focus:ring-[#13b7b9]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="mt-2">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-semibold">
            Password
          </label>

          <Link
            href="/forgot-password"
            className="text-xs text-[#10bec1] transition hover:text-[#5be1e3]"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            className="h-14 w-full rounded-xl border border-[#303436] bg-[#1c1c1c] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-[#55595c] focus:border-[#13b7b9] focus:ring-2 focus:ring-[#13b7b9]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#697277] transition hover:text-white"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-4 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 h-14 w-full rounded-full bg-[#13aaad] text-sm font-bold uppercase transition hover:bg-[#16bec1] focus:outline-none focus:ring-2 focus:ring-[#13b7b9] focus:ring-offset-2 focus:ring-offset-[#111111] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="m4 4 16 16M10.6 7.1A10 10 0 0 1 12 7c6 0 9.5 5 9.5 5a15 15 0 0 1-2.1 2.4M6.2 8.2A15 15 0 0 0 2.5 12s3.5 5 9.5 5c1 0 2-.15 2.8-.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
