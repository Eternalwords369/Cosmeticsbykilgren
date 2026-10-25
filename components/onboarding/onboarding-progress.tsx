import { sv } from "@/lib/copy/sv";
import { cn } from "@/lib/utils";

const copy = sv.onboarding;

export function OnboardingProgress({ done }: { done: number }) {
  const total = copy.stepNames.length;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{copy.progress(done, total)}</p>
      <ol className="mt-3 grid grid-cols-4 gap-2" aria-label={copy.progress(done, total)}>
        {copy.stepNames.map((name, index) => (
          <li key={name}>
            <div
              className={cn("h-1.5 rounded-full", index < done ? "bg-primary" : "bg-muted")}
              aria-hidden="true"
            />
            <span
              className={cn(
                "mt-2 block text-xs",
                index < done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {name}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
