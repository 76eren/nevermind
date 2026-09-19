"use client";

import { signOutAction } from "@/app/actions/auth";
import { ChevronDown, Home, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState } from "react";

type NavbarProps = {
  username: string;
  firstname: string;
  lastname: string;
};

export function Navbar({ username, firstname, lastname }: NavbarProps) {
  const [signOutState, signOutFormAction, isSigningOut] = useActionState(
    signOutAction,
    null,
  );

  const navigationItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Profile",
      href: `/profile/${username}`,
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const pathname = usePathname();

  const initials =
    firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-[#eceef0] bg-white px-5 py-7 text-[#15171a]">
      <Link href="/" className="mb-10 inline-flex items-center">
        <span className="text-2xl font-extrabold tracking-[-0.08em] text-[#ed145b]">
          Never
        </span>

        <span className="text-2xl font-extrabold tracking-[-0.08em] text-[#ff6b35]">
          mind
        </span>
      </Link>

      <Link
        href="/profile"
        className="mb-10 flex items-center gap-3 rounded-xl bg-[#f4f5f6] px-4 py-4 transition-colors hover:bg-[#edeff1]"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#15171a] text-sm font-semibold text-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {firstname} {lastname}
          </p>

          <p className="mt-0.5 truncate text-sm text-[#7a8087]">@{username}</p>
        </div>

        <ChevronDown className="size-4 shrink-0 text-[#7a8087]" />
      </Link>

      <nav>
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-tight">
          Navigation
        </p>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-13 items-center gap-4 rounded-lg px-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#f4f5f6] font-semibold text-[#15171a]"
                    : "text-[#727981] hover:bg-[#f7f7f8] hover:text-[#15171a]"
                }`}
              >
                <Icon
                  strokeWidth={1.7}
                  className={`size-5 ${
                    isActive ? "text-[#ed145b]" : "text-[#63707a]"
                  }`}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto border-t border-[#eceef0] pt-4">
        <form action={signOutFormAction}>
          <button
            type="submit"
            disabled={isSigningOut}
            className="flex h-13 w-full items-center gap-4 rounded-lg px-3 text-sm text-[#727981] transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut strokeWidth={1.7} className="size-5" />

            <span>{isSigningOut ? "Logging out..." : "Log out"}</span>
          </button>

          {signOutState?.message && (
            <p className="mt-2 px-3 text-xs text-red-600">
              {signOutState.message}
            </p>
          )}
        </form>
      </div>
    </aside>
  );
}
