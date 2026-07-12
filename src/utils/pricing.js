// ---------------------------------------------------------------------------
// Pricing configuration — EDIT AMOUNTS HERE.
// Three market tiers, auto-selected from the visitor's country (see useCurrency):
//   MA = Morocco (DH / MAD), EU = Europe (€ / EUR), US = United States ($ / USD).
// All figures are starting prices ("from"), non-binding.
// ---------------------------------------------------------------------------

export const PRICING = {
  MA: {
    code: "MA",
    label: "DH",
    base: 3500,
    perPage: 400,
    addons: {
      form: 400,
      cms: 1500,
      multilang: 1200,
      logo: 1000,
      chatbot: 2500,
      ecommerce: 3500,
    },
  },
  EU: {
    code: "EU",
    label: "€",
    base: 990,
    perPage: 120,
    addons: {
      form: 120,
      cms: 450,
      multilang: 250,
      logo: 600,
      chatbot: 700,
      ecommerce: 900,
    },
  },
  US: {
    code: "US",
    label: "$",
    base: 1100,
    perPage: 130,
    addons: {
      form: 130,
      cms: 500,
      multilang: 280,
      logo: 650,
      chatbot: 800,
      ecommerce: 1000,
    },
  },
};

// Order of add-on cards in the calculator.
export const ADDON_ORDER = ["form", "cms", "multilang", "logo", "chatbot", "ecommerce"];

// Map an ISO country code to a pricing/currency tier.
export const regionFromCountry = (country) => {
  if (!country) return "EU";
  const c = country.toUpperCase();
  if (c === "MA") return "MA";
  if (c === "US" || c === "CA") return "US";
  return "EU";
};

// Format an amount for a given region.
//   MA -> "3 500 DH"   EU -> "€990"   US -> "$1,100"
export const formatPrice = (region, amount) => {
  if (region === "MA") {
    const n = amount.toLocaleString("fr-FR").replace(/ /g, " ");
    return `${n} DH`;
  }
  const symbol = region === "US" ? "$" : "€";
  const n = amount.toLocaleString("en-US");
  return `${symbol}${n}`;
};
