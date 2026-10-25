import { decideLeadAction } from "@/app/salj-hos-oss/actions";
import { Button } from "@/components/ui/button";
import { sv } from "@/lib/copy/sv";
import { formatSek } from "@/lib/money";
import { listLeads } from "@/lib/onboarding/service";

const copy = sv.adminLeads;
const date = new Intl.DateTimeFormat("sv-SE", {
  dateStyle: "medium",
  timeZone: "Europe/Stockholm",
});

type Profile = { address?: string; story?: string; phone?: string; website?: string };
type FirstProduct = { name?: string; price?: number; unit?: string; description?: string };

export async function LeadList() {
  const leads = await listLeads();

  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl font-semibold">{copy.title}</h2>
      {leads.length === 0 ? (
        <p className="mt-4 text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="mt-6 divide-y border-y">
          {leads.map((lead) => {
            const profile = (lead.profile ?? {}) as Profile;
            const product = (lead.firstProduct ?? {}) as FirstProduct;
            return (
              <li key={lead.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <p className="font-medium">
                    {lead.farmName}{" "}
                    <span className="font-normal text-muted-foreground">· {lead.sells}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lead.contactName}, <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </p>
                  <p className="mt-1 text-sm">
                    {copy.stages[lead.stage]} · {copy.since} {date.format(lead.stageChangedAt)}
                    {lead.unsubscribedAt ? ` · ${copy.unsubscribed}` : ""}
                  </p>
                  {lead.profile || lead.firstProduct ? (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer text-muted-foreground">
                        {copy.details}
                      </summary>
                      <div className="mt-2 space-y-2">
                        {profile.address ? <p>{profile.address}</p> : null}
                        {profile.story ? (
                          <p className="whitespace-pre-line">{profile.story}</p>
                        ) : null}
                        {product.name ? (
                          <p>
                            <span className="font-medium">{product.name}</span>
                            {product.unit ? `, ${product.unit}` : ""}
                            {product.price ? `, ${formatSek(product.price)}` : ""}
                            {product.description ? ` – ${product.description}` : ""}
                          </p>
                        ) : null}
                      </div>
                    </details>
                  ) : null}
                </div>
                {lead.stage === "SUBMITTED" ? (
                  <div className="flex gap-2">
                    <form action={decideLeadAction.bind(null, lead.id, true)}>
                      <Button type="submit" size="sm">
                        {copy.approve(lead.farmName)}
                      </Button>
                    </form>
                    <form action={decideLeadAction.bind(null, lead.id, false)}>
                      <Button type="submit" size="sm" variant="outline">
                        {copy.decline(lead.farmName)}
                      </Button>
                    </form>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
