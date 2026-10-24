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
    pillars: [
      {
        title: "Hämta hos producenten",
        text: "Beställ på nätet och hämta på gården. Gratis, och du får se var maten kommer ifrån.",
      },
      {
        title: "Inga dolda avgifter",
        text: "Fri retur, alltid. Fri frakt över 395 kr. Priset du ser är priset du betalar.",
      },
      {
        title: "En människa bakom varje vara",
        text: "Varje produkt har en producent och en historia. Läs den innan du handlar.",
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
    dashboardSoon: "Orderhantering och produkter kommer i Fas 4.",
  },
  validation: {
    emailInvalid: "Ange en giltig e-postadress",
    passwordRequired: "Ange ditt lösenord",
  },
} as const;

export type Copy = typeof sv;
