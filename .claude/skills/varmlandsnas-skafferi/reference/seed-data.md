# Seed-data

> **UTKAST.** Originaltexten saknades. Alla producenter nedan är **fiktiva
> platshållare** — byt mot riktiga producenter med deras godkännande innan
> lansering. Koordinater ligger på Värmlandsnäs men pekar inte på verkliga gårdar.

## Kategorier (sortOrder)
1. Kött & chark · 2. Mejeri & ost · 3. Bröd & bakat · 4. Grönt & rotfrukter
5. Skafferi (sylt, honung, must) · 6. Fisk · 7. Presentkorgar

## Producenter (6 st, fiktiva)
| slug | Namn | Inriktning | Station |
|---|---|---|---|
| `nasgardens-kott` | Näsgårdens Kött | Gräsbetat nöt, chark | 3 |
| `lillnas-mejeri` | Lillnäs Mejeri | Gårdsost, smör | 5 |
| `vanerns-bageri` | Vänerns Stenugnsbageri | Surdeg, tunnbröd | 7 |
| `ekenas-grönt` | Ekenäs Trädgård | Rotfrukter, säsongsgrönt | – |
| `bigardet-nas` | Bigården på Näset | Honung, bivax | 11 |
| `vanerfisk` | Vänerfisk | Rökt gös, sik | – |

Varje producent: `shortDescription` (1 mening), `longStory` (3–5 stycken
i varumärkestonen), `heroImageUrl` och 3 `galleryImages` (platshållarbilder),
lat/long inom ca 59.05–59.25 N, 12.80–13.15 E.

## Produkter
- 4–6 produkter per producent, totalt ~30
- Moms: 12 % livsmedel. 25 % för icke-livsmedel (bivaxljus, presentkorgar
  med icke-livsmedel)
- Minst 5 med `isSeasonal`, minst 6 med `isSubscriptionEligible`
- Varierat `stock`, varav minst en med `stock = 0` (testar slutsåld-läget)

## Övrigt
- 3 `PickupLocation`: två hos producenter, en i Säffle centrum
- 2 `SubscriptionBox`: "Näsets månadslåda" 449 kr, "Lilla skafferiet" 299 kr
- 1 `Campaign` SKORDEFESTEN (inaktiv, datum sista helgen i september)
- 1 `DiscountCode`: `VALKOMMEN10`, 10 %, min 300 kr
- 1 `AdminUser` ADMIN från env (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`),
  bcrypt-hashat. Aldrig hårdkodat lösenord.

Seeden ska vara idempotent (`upsert` på `slug`/`code`/`email`).
