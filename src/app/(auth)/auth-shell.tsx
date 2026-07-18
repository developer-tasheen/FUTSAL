import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const perks = [
  "Your details filled in automatically when booking",
  "Track upcoming games and booking history",
  "Cancel or rebook in a couple of taps",
];

type AuthShellProps = {
  heading: string;
  subheading: string;
  children: React.ReactNode;
};

export function AuthShell({ heading, subheading, children }: AuthShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="animate-fade-up grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-black/10 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Brand panel */}
        <div className="relative hidden text-white lg:block">
          <Image
            alt="Naikabula Futsal Court"
            className="object-cover"
            fill
            quality={95}
            sizes="(min-width: 1024px) 40vw, 0vw"
            src="/auth-court.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
          <div className="relative flex h-full flex-col justify-end p-10">
            <div>
              <h2 className="text-2xl font-extrabold leading-snug tracking-tight">
                Your home of futsal in{" "}
                <span className="text-accent">Lautoka</span>
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-white/90">
                {perks.map((perk) => (
                  <li className="flex items-start gap-2.5" key={perk}>
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-accent"
                      size={17}
                    />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="p-6 sm:p-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {heading}
            </h1>
            <p className="mt-2 text-sm text-muted">{subheading}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
