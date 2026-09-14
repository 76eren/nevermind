"use client";

import { useState } from "react";

type AuthFieldProps = {
  autoComplete: string;
  disabled: boolean;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  type: "email" | "text";
};

type PasswordFieldProps = {
  autoComplete: string;
  disabled: boolean;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
};

type AuthSubmitButtonProps = {
  isSubmitting: boolean;
  idleLabel: string;
  submittingLabel: string;
};

export function AuthField({
  label,
  name,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold"
      >
        {label}
      </label>

      <input
        {...inputProps}
        id={name}
        name={name}
        className="h-14 w-full rounded-xl border border-[#303436] bg-[#1c1c1c] px-4 text-sm text-white outline-none transition placeholder:text-[#55595c] focus:border-[#13b7b9] focus:ring-2 focus:ring-[#13b7b9]/20 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

export function PasswordField({
  label,
  name,
  ...inputProps
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold"
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...inputProps}
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          className="h-14 w-full rounded-xl border border-[#303436] bg-[#1c1c1c] px-4 text-sm text-white outline-none transition placeholder:text-[#55595c] focus:border-[#13b7b9] focus:ring-2 focus:ring-[#13b7b9]/20 disabled:cursor-not-allowed disabled:opacity-60 pr-12"
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
  );
}

export function AuthFormError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" aria-live="polite" className="mt-4 text-sm text-red-400">
      {message}
    </p>
  );
}

export function AuthSubmitButton({
  idleLabel,
  isSubmitting,
  submittingLabel,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-8 h-14 w-full rounded-full bg-[#13aaad] text-sm font-bold uppercase transition hover:bg-[#16bec1] focus:outline-none focus:ring-2 focus:ring-[#13b7b9] focus:ring-offset-2 focus:ring-offset-[#111111] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? submittingLabel : idleLabel}
    </button>
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
