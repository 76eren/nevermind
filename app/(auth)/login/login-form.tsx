"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { signInAction } from "../../actions/auth";

export function LoginForm() {
  const [state, formAction, isSubmitting] = useActionState(signInAction, {
    message: null as string | null,
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="mt-10" action={formAction}>
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-xs font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="s.nevermind@mail.com"
          autoComplete="email"
          required
          disabled={isSubmitting}
          className="h-14 w-full rounded-xl border border-[#303436] bg-[#1c1c1c] px-4 text-sm text-white outline-none transition placeholder:text-[#55595c] focus:border-[#13b7b9] focus:ring-2 focus:ring-[#13b7b9]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="mb-2 block text-xs font-semibold">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            className="h-14 w-full rounded-xl border border-[#303436] bg-[#1c1c1c] px-4 text-sm text-white outline-none transition placeholder:text-[#55595c] focus:border-[#13b7b9] focus:ring-2 focus:ring-[#13b7b9]/20 disabled:cursor-not-allowed disabled:opacity-60 pr-12"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#697277] transition hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {!isSubmitting && state.message && (
        <p role="alert" aria-live="polite" className="mt-4 text-sm text-red-400">
          {state.message}
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
