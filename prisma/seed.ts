/**
 * Idempotent seed. All producers are FICTIONAL placeholders —
 * replace with real producers (with their consent) before launch.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const PRODUCER_IMG = "/placeholders/producer.svg";
const PRODUCT_IMG = "/placeholders/product.svg";

const categories = [
  { slug: "kott-chark", name: "Kött & chark" },
  { slug: "mejeri-ost", name: "Mejeri & ost" },
  { slug: "brod-bakat", name: "Bröd & bakat" },
  { slug: "gront-rotfrukter", name: "Grönt & rotfrukter" },
  { slug: "skafferi", name: "Skafferi", description: "Sylt, honung, must och annat som håller." },
  { slug: "fisk", name: "Fisk" },
  { slug: "presentkorgar", name: "Presentkorgar" },
];

type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  story?: string;
  category: string;
  priceKr: number;
  vatRate: 12 | 25;
  unit: string;
  stock: number;
  isSeasonal?: boolean;
  isSubscriptionEligible?: boolean;
  weightGrams?: number;
};

type SeedProducer = {
  slug: string;
  name: string;
  shortDescription: string;
  longStory: string;
  address: string;
  latitude: number;
  longitude: number;
  stationNumber?: number;
  products: SeedProduct[];
};

const producers: SeedProducer[] = [
  {
    slug: "nasgardens-kott",
    name: "Näsgårdens Kött",
    shortDescription: "Gräsbetat nöt från strandängarna vid Vänern.",
    longStory: [
      "På Näsgården har korna gått på strandängarna vid Vänern i tre generationer. Djuren går ute från maj till oktober och äter det som växer där.",
      "Slakten sker på ett litet slakteri tjugo minuter bort, och köttet hängmörnas i minst tre veckor innan det styckas här på gården.",
      "Vi föder upp färre djur än vi skulle kunna. Det tar längre tid, men det är så vi vill ha det.",
    ].join("\n\n"),
    address: "Näsgården 1, 661 91 Säffle",
    latitude: 59.11,
    longitude: 12.97,
    stationNumber: 3,
    products: [
      {
        slug: "nasgarden-hogrev-1kg",
        name: "Högrev",
        description: "Hängmörad högrev för långkok.",
        category: "kott-chark",
        priceKr: 289,
        vatRate: 12,
        unit: "ca 1 kg",
        stock: 14,
        isSubscriptionEligible: true,
        weightGrams: 1000,
      },
      {
        slug: "nasgarden-notfars-500g",
        name: "Nötfärs",
        description: "Grovmalen färs av gräsbetat nöt, 15 % fett.",
        category: "kott-chark",
        priceKr: 89,
        vatRate: 12,
        unit: "500 g",
        stock: 40,
        isSubscriptionEligible: true,
        weightGrams: 500,
      },
      {
        slug: "nasgarden-entrecote",
        name: "Entrecôte",
        description: "Tre veckors hängmörning ger mörhet och djup smak.",
        category: "kott-chark",
        priceKr: 159,
        vatRate: 12,
        unit: "ca 300 g",
        stock: 0,
        weightGrams: 300,
      },
      {
        slug: "nasgarden-rokt-korv",
        name: "Rökt gårdskorv",
        description: "Grovkorv rökt över al, kryddad med enbär.",
        category: "kott-chark",
        priceKr: 79,
        vatRate: 12,
        unit: "4 st",
        stock: 25,
        weightGrams: 400,
      },
      {
        slug: "nasgarden-buljong",
        name: "Benbuljong",
        description: "Långkokt på märgben i tolv timmar.",
        category: "skafferi",
        priceKr: 69,
        vatRate: 12,
        unit: "500 ml",
        stock: 18,
        weightGrams: 550,
      },
    ],
  },
  {
    slug: "lillnas-mejeri",
    name: "Lillnäs Mejeri",
    shortDescription: "Gårdsost och smör av opastöriserad mjölk.",
    longStory: [
      "Lillnäs Mejeri startade i ett gammalt brygghus med en kittel och tolv kor. Idag är vi fler kor men samma kittel.",
      "Osten lagras i källaren under ladugården, där temperaturen håller sig jämn året runt.",
      "Varje ost vänds för hand. Det är långsamt, och det är därför den smakar som den gör.",
    ].join("\n\n"),
    address: "Lillnäs 4, 661 92 Säffle",
    latitude: 59.08,
    longitude: 12.88,
    stationNumber: 5,
    products: [
      {
        slug: "lillnas-lagrad-gardsost",
        name: "Lagrad gårdsost",
        description: "Lagrad i 14 månader, nötig och kristallig.",
        category: "mejeri-ost",
        priceKr: 119,
        vatRate: 12,
        unit: "ca 300 g",
        stock: 22,
        isSubscriptionEligible: true,
        weightGrams: 300,
      },
      {
        slug: "lillnas-farskost-ramslok",
        name: "Färskost med ramslök",
        description: "Krämig färskost med ramslök från gårdens skog.",
        category: "mejeri-ost",
        priceKr: 59,
        vatRate: 12,
        unit: "200 g",
        stock: 15,
        isSeasonal: true,
        weightGrams: 200,
      },
      {
        slug: "lillnas-smor",
        name: "Kärnat smör",
        description: "Handkärnat smör med flingsalt.",
        category: "mejeri-ost",
        priceKr: 65,
        vatRate: 12,
        unit: "250 g",
        stock: 30,
        isSubscriptionEligible: true,
        weightGrams: 250,
      },
      {
        slug: "lillnas-filmjolk",
        name: "Gårdsfil",
        description: "Tjock och syrlig fil, ohomogeniserad.",
        category: "mejeri-ost",
        priceKr: 35,
        vatRate: 12,
        unit: "1 l",
        stock: 12,
        weightGrams: 1050,
      },
    ],
  },
  {
    slug: "vanerns-bageri",
    name: "Vänerns Stenugnsbageri",
    shortDescription: "Surdeg och tunnbröd bakat i vedeldad stenugn.",
    longStory: [
      "Ugnen murades 1912 och eldas fortfarande med ved varje morgon klockan fyra.",
      "Mjölet mals av spannmål som odlas här på Näset. Surdegen är lika gammal som bageriets nuvarande ägare.",
      "Vi bakar det vi hinner, och när det är slut är det slut.",
    ].join("\n\n"),
    address: "Bagarbacken 2, 661 93 Säffle",
    latitude: 59.15,
    longitude: 12.92,
    stationNumber: 7,
    products: [
      {
        slug: "vanern-surdegslimpa",
        name: "Surdegslimpa",
        description: "Lantvete och råg, 48 timmars jäsning.",
        category: "brod-bakat",
        priceKr: 69,
        vatRate: 12,
        unit: "ca 900 g",
        stock: 20,
        isSubscriptionEligible: true,
        weightGrams: 900,
      },
      {
        slug: "vanern-tunnbrod",
        name: "Mjukt tunnbröd",
        description: "Bakat på stenhällen enligt värmländsk tradition.",
        category: "brod-bakat",
        priceKr: 49,
        vatRate: 12,
        unit: "6 st",
        stock: 35,
        weightGrams: 400,
      },
      {
        slug: "vanern-kanelbullar",
        name: "Kardemummabullar",
        description: "Smördeg, nymald kardemumma och pärlsocker.",
        category: "brod-bakat",
        priceKr: 79,
        vatRate: 12,
        unit: "6 st",
        stock: 10,
        weightGrams: 480,
      },
      {
        slug: "vanern-knackebrod",
        name: "Rågknäcke",
        description: "Tunt och knaprigt, håller i månader.",
        category: "brod-bakat",
        priceKr: 55,
        vatRate: 12,
        unit: "300 g",
        stock: 28,
        weightGrams: 300,
      },
      {
        slug: "vanern-julbrod",
        name: "Vörtbröd",
        description: "Med vört, pomerans och kryddor. Bakas bara inför jul.",
        category: "brod-bakat",
        priceKr: 75,
        vatRate: 12,
        unit: "ca 700 g",
        stock: 0,
        isSeasonal: true,
        weightGrams: 700,
      },
    ],
  },
  {
    slug: "ekenas-tradgard",
    name: "Ekenäs Trädgård",
    shortDescription: "Rotfrukter och säsongsgrönt odlat utan bekämpningsmedel.",
    longStory: [
      "Ekenäs Trädgård är fyra hektar mullrik jord vid Vänerns strand. Vi odlar det som trivs här.",
      "Allt sås, rensas och skördas för hand. Det som inte säljs blir kompost och går tillbaka till jorden.",
      "Utbudet följer säsongen. Det du hittar hos oss i juli finns inte i januari.",
    ].join("\n\n"),
    address: "Ekenäs gård, 661 94 Säffle",
    latitude: 59.19,
    longitude: 13.05,
    products: [
      {
        slug: "ekenas-potatis-mandel",
        name: "Mandelpotatis",
        description: "Fast och smakrik, skördad i september.",
        category: "gront-rotfrukter",
        priceKr: 45,
        vatRate: 12,
        unit: "2 kg",
        stock: 50,
        isSeasonal: true,
        isSubscriptionEligible: true,
        weightGrams: 2000,
      },
      {
        slug: "ekenas-morotter",
        name: "Morötter",
        description: "Söta morötter med blast.",
        category: "gront-rotfrukter",
        priceKr: 35,
        vatRate: 12,
        unit: "1 kg",
        stock: 40,
        isSubscriptionEligible: true,
        weightGrams: 1000,
      },
      {
        slug: "ekenas-rodbetor",
        name: "Rödbetor",
        description: "Mörka och jordiga. Goda att ugnsrosta.",
        category: "gront-rotfrukter",
        priceKr: 39,
        vatRate: 12,
        unit: "1 kg",
        stock: 30,
        weightGrams: 1000,
      },
      {
        slug: "ekenas-gronkal",
        name: "Grönkål",
        description: "Frostad grönkål, blir sötare efter första frosten.",
        category: "gront-rotfrukter",
        priceKr: 29,
        vatRate: 12,
        unit: "knippe",
        stock: 16,
        isSeasonal: true,
        weightGrams: 300,
      },
      {
        slug: "ekenas-aeppelmust",
        name: "Äppelmust",
        description: "Pressad på äpplen från gårdens gamla träd.",
        category: "skafferi",
        priceKr: 59,
        vatRate: 12,
        unit: "75 cl",
        stock: 24,
        isSeasonal: true,
        weightGrams: 1200,
      },
    ],
  },
  {
    slug: "bigarden-pa-naset",
    name: "Bigården på Näset",
    shortDescription: "Honung och bivax från 40 bisamhällen.",
    longStory: [
      "Bina flyger över rapsfält, klöverängar och lindallén vid kyrkan. Det smakar i honungen.",
      "Vi slungar honungen kallt och silar den bara grovt, så att pollen och smak blir kvar.",
      "Bivaxet som blir över gjuter vi till ljus under vintern.",
    ].join("\n\n"),
    address: "Biavägen 8, 661 95 Säffle",
    latitude: 59.06,
    longitude: 13.1,
    stationNumber: 11,
    products: [
      {
        slug: "bigarden-sommarhonung",
        name: "Sommarhonung",
        description: "Krämig honung från klöver och lind.",
        category: "skafferi",
        priceKr: 95,
        vatRate: 12,
        unit: "400 g",
        stock: 35,
        isSubscriptionEligible: true,
        weightGrams: 450,
      },
      {
        slug: "bigarden-ljunghonung",
        name: "Ljunghonung",
        description: "Mörk och kraftig, skördad i augusti.",
        category: "skafferi",
        priceKr: 125,
        vatRate: 12,
        unit: "400 g",
        stock: 8,
        isSeasonal: true,
        weightGrams: 450,
      },
      {
        slug: "bigarden-bivaxljus",
        name: "Bivaxljus",
        description: "Handgjutet ljus av rent bivax, brinner i ca 20 timmar.",
        category: "presentkorgar",
        priceKr: 149,
        vatRate: 25,
        unit: "2 st",
        stock: 20,
        weightGrams: 300,
      },
      {
        slug: "bigarden-presentkorg",
        name: "Presentkorg från Näset",
        description: "Honung, bivaxljus, rågknäcke och äppelmust i en flätad korg.",
        category: "presentkorgar",
        priceKr: 495,
        vatRate: 25,
        unit: "korg",
        stock: 6,
        weightGrams: 2500,
      },
    ],
  },
  {
    slug: "vanerfisk",
    name: "Vänerfisk",
    shortDescription: "Gös och sik från Vänern, rökt i eget rökeri.",
    longStory: [
      "Vi lägger näten före gryningen och är tillbaka i hamnen innan frukost.",
      "Fisken rensas samma morgon och röks över al och en i rökeriet bakom bryggan.",
      "Vänern ger vad den ger. Vissa veckor blir det mycket, andra inget alls.",
    ].join("\n\n"),
    address: "Hamnvägen 3, 661 96 Säffle",
    latitude: 59.22,
    longitude: 12.85,
    products: [
      {
        slug: "vanerfisk-varmrokt-sik",
        name: "Varmrökt sik",
        description: "Hel sik, varmrökt över al.",
        category: "fisk",
        priceKr: 129,
        vatRate: 12,
        unit: "ca 400 g",
        stock: 12,
        weightGrams: 400,
      },
      {
        slug: "vanerfisk-gosfile",
        name: "Gösfilé",
        description: "Färsk gösfilé, skinnfri och benfri.",
        category: "fisk",
        priceKr: 219,
        vatRate: 12,
        unit: "ca 400 g",
        stock: 6,
        weightGrams: 400,
      },
      {
        slug: "vanerfisk-kallrokt-sik",
        name: "Kallrökt sik",
        description: "Tunt skivad, mild röksmak.",
        category: "fisk",
        priceKr: 99,
        vatRate: 12,
        unit: "200 g",
        stock: 15,
        weightGrams: 200,
      },
    ],
  },
];

const openingHours = {
  mon: "10–18",
  tue: "10–18",
  wed: "10–18",
  thu: "10–18",
  fri: "10–18",
  sat: "10–14",
  sun: null,
};

async function main() {
  for (const [index, category] of categories.entries()) {
    await db.productCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description, sortOrder: index + 1 },
      create: { ...category, sortOrder: index + 1 },
    });
  }
  const categoryIds = Object.fromEntries(
    (await db.productCategory.findMany()).map((c) => [c.slug, c.id]),
  );

  for (const { products, ...producer } of producers) {
    const producerData = {
      ...producer,
      heroImageUrl: PRODUCER_IMG,
      galleryImages: [PRODUCER_IMG, PRODUCER_IMG, PRODUCER_IMG],
      isSkordefestStation: producer.stationNumber !== undefined,
    };
    const saved = await db.producer.upsert({
      where: { slug: producer.slug },
      update: producerData,
      create: producerData,
    });

    for (const { category, priceKr, ...product } of products) {
      const productData = {
        ...product,
        priceOre: priceKr * 100,
        images: [PRODUCT_IMG],
        categoryId: categoryIds[category],
        producerId: saved.id,
      };
      await db.product.upsert({
        where: { slug: product.slug },
        update: productData,
        create: productData,
      });
    }
  }

  const producerIds = Object.fromEntries((await db.producer.findMany()).map((p) => [p.slug, p.id]));
  const pickupLocations = [
    {
      id: "pickup-nasgarden",
      producerId: producerIds["nasgardens-kott"],
      name: "Näsgårdens gårdsbod",
      address: "Näsgården 1, 661 91 Säffle",
      latitude: 59.11,
      longitude: 12.97,
      instructions: "Parkera vid ladan. Gårdsboden ligger till vänster om boningshuset.",
    },
    {
      id: "pickup-lillnas",
      producerId: producerIds["lillnas-mejeri"],
      name: "Lillnäs Mejeri",
      address: "Lillnäs 4, 661 92 Säffle",
      latitude: 59.08,
      longitude: 12.88,
      instructions: "Ring på klockan vid mejeridörren.",
    },
    {
      id: "pickup-saffle-centrum",
      producerId: null,
      name: "Säffle centrum",
      address: "Storgatan 10, 661 30 Säffle",
      latitude: 59.1325,
      longitude: 12.9306,
      instructions: "Utlämning i butikslokalen vid torget. Ta med ordernumret.",
    },
  ];
  for (const location of pickupLocations) {
    await db.pickupLocation.upsert({
      where: { id: location.id },
      update: { ...location, openingHours },
      create: { ...location, openingHours },
    });
  }

  const boxes = [
    {
      slug: "nasets-manadslada",
      name: "Näsets månadslåda",
      description: "Det bästa från Näset varje månad: kött, ost, bröd och säsongens grönt.",
      monthlyPriceOre: 44900,
      contentsDescription: "Ca 5–7 varor från minst fyra producenter. Innehållet följer säsongen.",
    },
    {
      slug: "lilla-skafferiet",
      name: "Lilla skafferiet",
      description: "För den lilla familjen eller den som bor ensam.",
      monthlyPriceOre: 29900,
      contentsDescription: "Ca 3–4 varor: bröd, ost och något från skafferihyllan.",
    },
  ];
  for (const box of boxes) {
    await db.subscriptionBox.upsert({
      where: { slug: box.slug },
      update: { ...box, imageUrl: PRODUCT_IMG },
      create: { ...box, imageUrl: PRODUCT_IMG },
    });
  }

  const year = new Date().getFullYear();
  const lastSeptemberSaturday = lastWeekdayOfMonth(year, 8, 6);
  const festivalEnd = new Date(lastSeptemberSaturday);
  festivalEnd.setDate(festivalEnd.getDate() + 1);
  festivalEnd.setHours(18);
  const festival = {
    name: `Skördefesten ${year}`,
    description:
      "Förbeställ från stationerna och hämta på plats under Skördefesten på Värmlandsnäs.",
    type: "SKORDEFESTEN" as const,
    startsAt: lastSeptemberSaturday,
    endsAt: festivalEnd,
    isActive: false,
    heroImageUrl: PRODUCER_IMG,
  };
  await db.campaign.upsert({
    where: { slug: `skordefesten-${year}` },
    update: festival,
    create: { ...festival, slug: `skordefesten-${year}` },
  });

  const discount = {
    type: "PERCENTAGE" as const,
    value: 10,
    minOrderValueOre: 30000,
    validFrom: new Date(`${year}-01-01T00:00:00Z`),
    validUntil: new Date(`${year + 1}-12-31T23:59:59Z`),
  };
  await db.discountCode.upsert({
    where: { code: "VALKOMMEN10" },
    update: discount,
    create: { ...discount, code: "VALKOMMEN10" },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, passwordHash, name: "Administratör", role: "ADMIN" },
    });
  } else {
    console.warn("SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD saknas — ingen admin skapad.");
  }

  const counts = {
    categories: await db.productCategory.count(),
    producers: await db.producer.count(),
    products: await db.product.count(),
    pickupLocations: await db.pickupLocation.count(),
    adminUsers: await db.adminUser.count(),
  };
  console.log("Seed klar:", counts);
}

/** weekday: 0 = Sunday … 6 = Saturday; month is 0-based. */
function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const date = new Date(year, month + 1, 0, 10);
  while (date.getDay() !== weekday) date.setDate(date.getDate() - 1);
  return date;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
