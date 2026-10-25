/**
 * All user-facing Swedish copy. Components must import text from here,
 * never hardcode Swedish strings.
 */
export const sv = {
  site: {
    name: "Värmlandsnäs Skafferi",
    tagline: "Mat från Näset, med namn och ansikte",
    description:
      "Handla direkt från gårdar och mathantverkare på Värmlandsnäs. Hämta hos producenten eller få det hemskickat. Alltid fri retur.",
  },
  nav: {
    shop: "Butik",
    producers: "Producenter",
    pickup: "Hämta lokalt",
    subscription: "Prenumeration",
    about: "Om oss",
    cart: "Varukorg",
    openMenu: "Öppna meny",
    menu: "Meny",
    home: "Till startsidan",
  },
  footer: {
    promisesTitle: "Ärlig handel",
    promises: [
      "Fri retur, alltid",
      "Fri frakt över 395 kr",
      "Inga dolda avgifter",
      "Hämta gratis hos producenten",
    ],
    infoTitle: "Information",
    terms: "Köpvillkor",
    privacy: "Integritet",
    contact: "Kontakt",
    newsletterTitle: "Nyhetsbrev",
    newsletterText: "Säsongens skörd och nya producenter, en gång i månaden.",
    newsletterSoon: "Anmälan öppnar snart.",
    copyright: (year: number) => `© ${year} Värmlandsnäs Skafferi`,
  },
  home: {
    heroTitle: "Mat från Näset, med namn och ansikte",
    heroText:
      "Vi samlar gårdar, bagerier och mathantverkare på Värmlandsnäs i en butik. Du vet alltid vem som gjort det du äter.",
    heroCta: "Gå till butiken",
    heroSecondary: "Möt producenterna",
    featuredTitle: "Just nu på Näset",
    featuredLink: "Se hela butiken",
    producersTitle: "Människorna bakom maten",
    producersLink: "Alla producenter",
    pillars: [
      {
        title: "Hämta hos producenten",
        text: "Beställ på nätet och hämta på gården. Gratis, och du får se var maten kommer ifrån.",
      },
      {
        title: "Inga dolda avgifter",
        text: "Fri retur, alltid. Fri frakt över 395 kr. Inga avgifter tillkommer i kassan.",
      },
      {
        title: "En människa bakom varje vara",
        text: "Varje produkt har en producent och en berättelse. Läs den innan du handlar.",
      },
    ],
  },
  comingSoon: {
    title: "Här bygger vi fortfarande",
    text: "Den här delen av skafferiet öppnar snart. Titta in igen om en tid.",
    back: "Tillbaka till startsidan",
  },
  notFound: {
    title: "Sidan finns inte",
    text: "Vi hittar inte det du letar efter. Kanske har den flyttat.",
  },
  admin: {
    loginTitle: "Logga in",
    loginText: "För administratörer och producenter.",
    email: "E-post",
    password: "Lösenord",
    submit: "Logga in",
    submitting: "Loggar in …",
    invalidCredentials: "Fel e-post eller lösenord. Kontrollera och försök igen.",
    genericError: "Något gick fel hos oss. Försök igen om en stund.",
    dashboardTitle: "Admin",
    welcome: (name: string) => `Välkommen, ${name}`,
    roleLabel: "Roll",
    roles: { ADMIN: "Administratör", PRODUCER: "Producent" },
    signOut: "Logga ut",
    loading: "Hämtar …",
    dashboardSoon: "Orderhantering och produktredigering kommer snart.",
  },
  shop: {
    title: "Butik",
    intro:
      "Allt kommer från gårdar och mathantverkare på Värmlandsnäs. Filtrera på det du är sugen på, eller på vem som gjort det.",
    allCategories: "Allt",
    categoryLabel: "Kategori",
    producerLabel: "Producent",
    allProducers: "Alla producenter",
    sortLabel: "Sortera",
    sort: {
      name: "Namn A–Ö",
      "price-asc": "Pris, lägst först",
      "price-desc": "Pris, högst först",
      newest: "Nyast",
    },
    resultCount: (count: number) => (count === 1 ? "1 vara" : `${count} varor`),
    emptyTitle: "Inga varor matchar",
    emptyText:
      "Det finns inget i den kombinationen just nu. Prova en annan kategori eller producent.",
    clearFilters: "Visa alla varor",
    loading: "Hämtar varor …",
  },
  product: {
    from: "Från",
    inclVat: "inkl. moms",
    soldOut: "Slutsåld",
    lowStock: "Få kvar",
    inStock: "I lager",
    seasonal: "Säsong",
    addToCart: "Lägg i varukorg",
    cartSoon: "Varukorgen öppnar inom kort. Då kan du beställa direkt här.",
    storyTitle: "Berättelsen",
    aboutProducer: (name: string) => `Om ${name}`,
    readProducerStory: "Läs hela berättelsen",
    moreFrom: (name: string) => `Mer från ${name}`,
    details: "Fakta",
    unit: "Förpackning",
    weight: "Vikt",
    category: "Kategori",
    vat: "Moms",
    grams: (g: number) => (g >= 1000 ? `${(g / 1000).toLocaleString("sv-SE")} kg` : `${g} g`),
    percent: (n: number) => `${n} %`,
  },
  producers: {
    title: "Producenter",
    intro:
      "Alla producenter finns på Värmlandsnäs. Hos flera av dem kan du hämta din beställning direkt på gården.",
    station: (n: number) => `Station ${n} på Skördefesten`,
    productCount: (count: number) =>
      count === 1 ? "1 vara i butiken" : `${count} varor i butiken`,
    visit: "Besök",
    contactTitle: "Hitta hit",
    website: "Webbplats",
    email: "E-post",
    phone: "Telefon",
    productsTitle: (name: string) => `Varor från ${name}`,
    noProducts: "Inga varor i butiken just nu. Titta in igen snart.",
    allProducers: "Alla producenter",
  },
  breadcrumbs: {
    label: "Brödsmulor",
    home: "Start",
  },
  validation: {
    emailInvalid: "Ange en giltig e-postadress",
    passwordRequired: "Ange ditt lösenord",
    required: "Fyll i det här fältet",
    tooLong: (max: number) => `Högst ${max} tecken`,
    storyTooShort: (min: number) => `Skriv minst ${min} tecken, så att kunderna lär känna er`,
    priceInvalid: "Ange ett pris i kronor, till exempel 89 eller 89,50",
    urlInvalid: "Ange en hel adress, till exempel https://minigard.se",
  },
  sell: {
    nav: "Sälj hos oss",
    metaTitle: "Sälj din mat hos Värmlandsnäs Skafferi",
    metaDescription:
      "För gårdar och mathantverkare på Värmlandsnäs. Ingen fast avgift, ingen bindningstid. Anmälan tar en minut, resten sköts på mejl.",
    eyebrow: "För producenter på Värmlandsnäs",
    heroTitle: "Du gör maten. Vi säljer den.",
    heroText:
      "Ingen fast avgift, ingen bindningstid och inga säljsamtal. Du anmäler dig här och tar resten i din egen takt, på mejl.",
    heroCta: "Anmäl din gård",
    heroNote: "Tar ungefär en minut",
    calculator: {
      title: "Räkna på det",
      label: "Om du säljer för så här mycket i månaden",
      unit: "kr",
      keepLabel: "Det får du behålla",
      feeLabel: "Vår provision",
      memberCheaper: (amount: string) =>
        `Med Medlem (495 kr i månaden och 6 %) skulle du behålla ${amount} mer. Vi säger till när det lönar sig, och du byter när du vill.`,
      zeroNote: "Säljer du inget en månad betalar du ingenting.",
      vatNote:
        "Beloppen är utan moms. På vår provision tillkommer moms, som du drar av om du är momsregistrerad.",
    },
    stepsTitle: "Så går det till",
    steps: [
      { title: "Anmäl dig", text: "Namn, gård, e-post och vad du säljer.", time: "1 minut" },
      {
        title: "Berätta om gården",
        text: "Var ni finns och vad som gör er mat till er. Texten blir din sida i butiken.",
        time: "5 minuter",
      },
      {
        title: "Lägg upp en vara",
        text: "Den du säljer mest av eller är stoltast över. Fler lägger du till senare.",
        time: "3 minuter",
      },
      {
        title: "Vi granskar",
        text: "Vi läser, tittar och svarar på mejlen inom två arbetsdagar.",
        time: "Vårt jobb",
      },
    ],
    weDoTitle: "Det sköter vi",
    weDo: [
      "Webbutiken och din egen producentsida",
      "Betalningar från kunderna",
      "Kundtjänst och returer",
      "Utbetalning till dig en gång i månaden",
    ],
    youDoTitle: "Det sköter du",
    youDo: ["Maten", "Att ordern är packad när kunden hämtar eller vi skickar"],
    faqTitle: "Vanliga frågor",
    faq: [
      {
        q: "Vad kostar det?",
        a: "15 % provision på det du säljer, plus moms på provisionen. Ingen startavgift och ingen månadsavgift. Säljer du mycket kan Medlem bli billigare: 495 kr i månaden och 6 %. Vi räknar på det åt dig och säger till.",
      },
      { q: "Måste jag binda mig?", a: "Nej. Du kan pausa eller sluta när du vill." },
      {
        q: "När får jag betalt?",
        a: "En gång i månaden, till ditt bankkonto. En order betalas ut när den är överlämnad och 14 dagar har gått, eftersom kunderna alltid har fri retur.",
      },
      {
        q: "Vem står för rabatter och frakt?",
        a: "Vi. Du får alltid betalt för fullt pris, även när vi har kampanj.",
      },
      {
        q: "Kan jag prata med någon?",
        a: "Ja, på mejl. Svara på vilket mejl som helst från oss, så svarar en människa inom en arbetsdag. Vi ringer bara om du ber om det.",
      },
      {
        q: "Vilka kan vara med?",
        a: "Gårdar och mathantverkare på Värmlandsnäs som säljer det de själva gör.",
      },
    ],
    form: {
      title: "Anmäl din gård",
      text: "Fyra fält. Sedan får du en länk till nästa steg i mejlen.",
      contactName: "Ditt namn",
      farmName: "Gårdens eller företagets namn",
      email: "E-post",
      sells: "Vad säljer du?",
      sellsHint: "Till exempel ost och smör, eller honung och bivax",
      consent:
        "Vi mejlar dig bara om din anslutning, högst ett mejl varannan dag. Du kan säga stopp när du vill.",
      privacyLink: "Så hanterar vi dina uppgifter",
      honeypot: "Lämna det här fältet tomt",
      submit: "Skicka anmälan",
      submitting: "Skickar …",
      successTitle: "Titta i din inkorg",
      successText: (email: string) =>
        `Vi har skickat en länk till ${email}. Första steget av fyra är klart.`,
      successHint: "Hittar du inget? Titta bland skräpposten, eller skicka anmälan igen.",
      genericError: "Något gick fel hos oss. Försök igen om en stund.",
    },
  },
  onboarding: {
    metaTitle: "Din anslutning",
    progress: (done: number, total: number) => `${done} av ${total} steg klara`,
    stepNames: ["Anmälan", "Gården", "Första varan", "Granskning"],
    greeting: (firstName: string) => `Hej ${firstName}!`,
    loading: "Hämtar din anslutning …",
    saveError: "Det gick inte att spara. Försök igen om en stund.",
    profile: {
      title: "Berätta om gården",
      text: "Det här blir din sida i butiken. Skriv som när du pratar med en kund i gårdsbutiken.",
      address: "Adress",
      addressHint: "Gatuadress, postnummer och ort. Visas för kunder som vill hämta.",
      phone: "Telefon (valfritt)",
      phoneHint: "Visas för kunder som hämtar. Vi ringer inte.",
      website: "Webbplats (valfritt)",
      story: "Er berättelse",
      storyHint:
        "Vem är ni, hur länge har ni hållit på, och vad gör er mat särskild? Minst 80 tecken.",
      pickup: "Kunder kan hämta hos oss",
      submit: "Spara och gå vidare",
      submitting: "Sparar …",
      edit: "Ändra uppgifterna om gården",
    },
    product: {
      title: "Din första vara",
      text: "Välj den du säljer mest av eller är stoltast över. Fler varor lägger du till när du är godkänd.",
      name: "Varans namn",
      price: "Pris inkl. moms (kr)",
      unit: "Förpackning",
      unitHint: "Till exempel 500 g, 1 liter eller 6 st",
      vat: "Moms",
      vatFood: "12 % (livsmedel)",
      vatOther: "25 % (övrigt)",
      description: "Kort beskrivning",
      submit: "Skicka in för granskning",
      submitting: "Skickar …",
    },
    submitted: {
      title: "Nu är det vår tur",
      text: (date: string) =>
        `Vi läser berättelsen och tittar på varan. Du får svar på mejlen senast ${date}. Du behöver inte göra något under tiden.`,
    },
    approved: {
      title: "Välkommen till Skafferiet",
      text: "Nästa steg är att koppla ditt bankkonto för utbetalningar. Vi mejlar dig när den delen öppnar.",
    },
    declined: {
      title: "Ansökan är avslutad",
      text: "Har du frågor? Svara på vårt senaste mejl.",
    },
    closed: {
      title: "Ansökan är stängd",
      text: "Vill du börja om? Anmäl dig igen, så öppnar vi den på nytt.",
      cta: "Till anmälan",
    },
    invalid: {
      title: "Länken fungerar inte",
      text: "Den kan ha kopierats ofullständigt. Anmäl dig igen med samma e-post, så skickar vi en ny länk.",
      cta: "Till anmälan",
    },
    emailPrefs: {
      title: "Mejl från oss",
      text: "Vi skickar en påminnelse om du fastnar i ett steg, aldrig mer än ett mejl varannan dag.",
      unsubscribe: "Sluta skicka påminnelser",
      unsubscribed:
        "Du får inga fler påminnelser. Svaret på din ansökan får du ändå, när den är inskickad.",
    },
  },
  onboardingEmails: {
    signOff: (senderName: string | undefined) =>
      senderName
        ? `Hälsningar\n${senderName}\nVärmlandsnäs Skafferi`
        : "Hälsningar\nVärmlandsnäs Skafferi",
    footer: (link: string) =>
      `Vill du inte ha fler påminnelser om anslutningen? Säg stopp längst ner på sidan:\n${link}`,
    replyNote: "Undrar du något? Svara på det här mejlet, så svarar en människa inom en arbetsdag.",
    welcome: {
      subject: (farm: string) => `Nästa steg för ${farm}`,
      body: (firstName: string, farm: string, link: string) =>
        `Hej ${firstName}!\n\nTack för att du anmälde ${farm}. Första steget är klart.\n\nNästa steg är att berätta om gården: var ni finns och vad som gör er mat till er. Det tar ungefär fem minuter, och texten blir din sida i butiken.\n\nFortsätt här:\n${link}`,
    },
    profile_reminder: {
      subject: (farm: string) => `${farm} är redan på väg`,
      body: (firstName: string, farm: string, link: string) =>
        `Hej ${firstName}!\n\nDu har redan gjort första steget. Innan vi kan granska ${farm} återstår två korta delar: berättelsen om gården, ungefär fem minuter, och din första vara, ungefär tre.\n\nEtt tips: skriv som du pratar med en kund i gårdsbutiken. Det säljer bättre än en reklamtext.\n\nFortsätt där du slutade:\n${link}`,
    },
    product_reminder: {
      subject: (farm: string) => `En vara kvar, sedan granskar vi ${farm}`,
      body: (firstName: string, farm: string, link: string) =>
        `Hej ${firstName}!\n\nBerättelsen om ${farm} är sparad. Nu saknas bara en vara: den du säljer mest av eller är stoltast över. Namn, pris och några rader räcker. Det tar ungefär tre minuter.\n\nFler varor lägger du till när du är godkänd.\n\nLägg upp varan här:\n${link}`,
    },
    last_call: {
      subject: (farm: string) => `Ska vi stänga ansökan för ${farm}?`,
      body: (firstName: string, farm: string, link: string) =>
        `Hej ${firstName}!\n\nVi har inte hört något på några dagar, och det är helt i sin ordning. Kanske är det mitt i skörden, eller så passar det inte just nu.\n\nOm vi inte hör något stänger vi ansökan om en vecka och slutar mejla. Du kan alltid anmäla dig igen senare.\n\nVill du fortsätta nu:\n${link}\n\nPassar det bättre efter säsongen? Svara "senare" på det här mejlet, så hör vi av oss då.`,
    },
    submitted: {
      subject: (farm: string) => `Vi har fått ${farm}`,
      body: (firstName: string, farm: string, link: string, replyBy: string) =>
        `Hej ${firstName}!\n\nAllt för ${farm} är inskickat. Vi läser berättelsen och tittar på varan, och du får svar senast ${replyBy}.\n\nDu behöver inte göra något under tiden. Här ser du alltid var ansökan står:\n${link}`,
    },
    approved: {
      subject: (farm: string) => `${farm} är godkänd`,
      body: (firstName: string, farm: string, link: string) =>
        `Hej ${firstName}!\n\nVälkommen! ${farm} är godkänd för Värmlandsnäs Skafferi.\n\nNästa steg är att koppla ditt bankkonto för utbetalningar. Vi mejlar dig länken så fort den delen öppnar. Under tiden kan du fundera på vilka varor du vill börja med och ta några foton i dagsljus. Bra bilder säljer mer än något annat.\n\nDin sida för anslutningen:\n${link}`,
    },
    declined: {
      subject: (farm: string) => `Om ansökan för ${farm}`,
      body: (firstName: string, farm: string) =>
        `Hej ${firstName}!\n\nTack för att du ville vara med. Just nu kan vi tyvärr inte ta in ${farm}.\n\nSvara på det här mejlet om du vill veta varför, så förklarar vi.`,
    },
  },
  adminLeads: {
    title: "Producenter på väg in",
    empty: "Inga anmälningar än.",
    farm: "Gård",
    contact: "Kontakt",
    sells: "Säljer",
    stage: "Steg",
    since: "Sedan",
    actions: "Åtgärd",
    stages: {
      STARTED: "Anmäld",
      PROFILE_DONE: "Gården klar",
      SUBMITTED: "Väntar på granskning",
      APPROVED: "Godkänd",
      DECLINED: "Avslagen",
      CLOSED: "Stängd",
    },
    approve: (farm: string) => `Godkänn ${farm}`,
    decline: (farm: string) => `Avslå ${farm}`,
    details: "Visa berättelse och vara",
    unsubscribed: "Vill inte ha påminnelser",
  },
} as const;

export type Copy = typeof sv;
