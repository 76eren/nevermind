import Link from "next/link";
import type { ReactNode } from "react";

type AuthPageProps = {
  children: ReactNode;
  title: string;
  alternateAction: {
    href: string;
    label: string;
    prompt: string;
  };
};

export function AuthPage({ children, title, alternateAction }: AuthPageProps) {
  return (
    <main className="grid min-h-dvh bg-[#111111] text-white lg:grid-cols-2">
      <section
        className="relative hidden min-h-dvh bg-cover bg-center lg:block"
        style={{
          backgroundImage: "url('/grape-hyacinth.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/75" />

        <div className="absolute bottom-[12%] left-[7%] z-10 max-w-lg">
          <h1 className="font-serif text-7xl font-bold tracking-tight">
            Nevermind
          </h1>

          <p className="mt-3 max-w-md text-xl leading-8 text-white/90">
            A very social social media platform.
          </p>
        </div>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-6 py-16 sm:px-10">
        <div className="relative w-full max-w-[430px]">
          <span
            aria-hidden="true"
            className="absolute -left-5 -top-7 h-4 w-4 border-l-2 border-t-2 border-[#13b7b9]"
          />

          <span
            aria-hidden="true"
            className="absolute -right-1 -top-7 h-4 w-4 border-r-2 border-t-2 border-[#13b7b9]"
          />

          <h2 className="font-serif text-4xl font-bold tracking-tight">
            {title}
          </h2>

          {children}

          <p className="mt-7 text-center text-xs text-[#8c979d]">
            {alternateAction.prompt}{" "}
            <Link
              href={alternateAction.href}
              className="text-[#10bec1] transition hover:text-[#5be1e3]"
            >
              {alternateAction.label}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
