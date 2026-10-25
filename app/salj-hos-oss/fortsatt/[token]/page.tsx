import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { unsubscribeAction } from "@/app/salj-hos-oss/actions";
import { FirstProductForm } from "@/components/onboarding/first-product-form";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { ProfileForm } from "@/components/onboarding/profile-form";
import { Button } from "@/components/ui/button";
import { sv } from "@/lib/copy/sv";
import { firstName, formatLongDate } from "@/lib/onboarding/emails";
import { completedSteps } from "@/lib/onboarding/sequence";
import { getLeadByToken, reviewDeadline } from "@/lib/onboarding/service";
import type { ProfileInput } from "@/lib/schemas/onboarding";

const copy = sv.onboarding;

export const metadata: Metadata = {
  title: copy.metaTitle,
  robots: { index: false, follow: false },
  // The token in the URL must not leak to other sites.
  referrer: "no-referrer",
};

export default function ContinuePage({ params }: PageProps<"/salj-hos-oss/fortsatt/[token]">) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12">
      <Suspense fallback={<p className="text-muted-foreground">{copy.loading}</p>}>
        <Onboarding params={params} />
      </Suspense>
    </section>
  );
}

async function Onboarding({ params }: Pick<PageProps<"/salj-hos-oss/fortsatt/[token]">, "params">) {
  const { token } = await params;
  const lead = await getLeadByToken(token);

  if (!lead) {
    return <Message title={copy.invalid.title} text={copy.invalid.text} cta={copy.invalid.cta} />;
  }
  if (lead.stage === "CLOSED") {
    return <Message title={copy.closed.title} text={copy.closed.text} cta={copy.closed.cta} />;
  }
  if (lead.stage === "DECLINED") {
    return <Message title={copy.declined.title} text={copy.declined.text} />;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold">
          {copy.greeting(firstName(lead.contactName))}
        </h1>
        <p className="mt-1 text-muted-foreground">{lead.farmName}</p>
        <div className="mt-6">
          <OnboardingProgress done={completedSteps(lead.stage)} />
        </div>
      </div>

      {lead.stage === "STARTED" ? (
        <Step title={copy.profile.title} text={copy.profile.text}>
          <ProfileForm token={token} />
        </Step>
      ) : null}
      {lead.stage === "PROFILE_DONE" ? (
        <Step title={copy.product.title} text={copy.product.text}>
          <FirstProductForm token={token} />
        </Step>
      ) : null}
      {lead.stage === "SUBMITTED" ? (
        <Step
          title={copy.submitted.title}
          text={copy.submitted.text(formatLongDate(reviewDeadline(lead.stageChangedAt)))}
        />
      ) : null}
      {lead.stage === "APPROVED" ? (
        <Step title={copy.approved.title} text={copy.approved.text} />
      ) : null}

      {lead.stage === "STARTED" || lead.stage === "PROFILE_DONE" ? (
        <EmailPreferences token={token} unsubscribed={!!lead.unsubscribedAt} />
      ) : null}
      {lead.stage === "PROFILE_DONE" && lead.profile ? (
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer">{copy.profile.edit}</summary>
          <div className="mt-4">
            <ProfileForm token={token} initial={lead.profile as Partial<ProfileInput>} />
          </div>
        </details>
      ) : null}
    </div>
  );
}

function Step({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <p className="mt-2 mb-6 text-muted-foreground">{text}</p>
      {children}
    </div>
  );
}

function EmailPreferences({ token, unsubscribed }: { token: string; unsubscribed: boolean }) {
  return (
    <div id="mejl" className="border-t pt-6 text-sm">
      <h2 className="font-medium">{copy.emailPrefs.title}</h2>
      {unsubscribed ? (
        <p className="mt-1 text-muted-foreground">{copy.emailPrefs.unsubscribed}</p>
      ) : (
        <>
          <p className="mt-1 text-muted-foreground">{copy.emailPrefs.text}</p>
          <form action={unsubscribeAction.bind(null, token)} className="mt-3">
            <Button type="submit" variant="outline" size="sm">
              {copy.emailPrefs.unsubscribe}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

function Message({ title, text, cta }: { title: string; text: string; cta?: string }) {
  return (
    <div className="text-center">
      <h1 className="font-heading text-3xl font-semibold">{title}</h1>
      <p className="mt-4 text-muted-foreground">{text}</p>
      {cta ? (
        <Button asChild className="mt-8" variant="outline">
          <Link href="/salj-hos-oss#anmalan">{cta}</Link>
        </Button>
      ) : null}
    </div>
  );
}
