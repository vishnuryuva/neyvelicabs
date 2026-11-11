import {SITE} from "./data";

const businessId = `${SITE.url}/#business`;
const businessSchema = {
  "@type": "LocalBusiness",
  "@id": businessId,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/drop-taxi-logo.png`,
  telephone: `+${SITE.phone}`,
  email: SITE.email,
  priceRange: "From ₹14/km",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Flat No. 1, Ashok Nagar, Vadakuthu",
    addressLocality: "Neyveli",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN"
  },
  areaServed: ["Neyveli", "Tamil Nadu", "Puducherry", "Bengaluru", "Kerala"],
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59"
  }],
  sameAs: [SITE.instagram]
};

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function updateSeo({title, description, noindex = false, pageSchema, locale = "en_IN"}) {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const canonical = new URL(pathname, SITE.url).href;
  const image = `${SITE.url}/drop-taxi-logo.png`;
  const robots = noindex ? "noindex,follow" : "index,follow";

  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", robots);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", SITE.name);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:image", image);
  setMeta("property", "og:image:alt", `${SITE.name} taxi service in Neyveli`);
  setMeta("property", "og:locale", locale);
  setMeta("name", "twitter:card", "summary");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", image);
  setLink("canonical", canonical);

  const graph = [
    {"@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.name, inLanguage: ["en-IN", "ta-IN"]},
    businessSchema
  ];
  if (pageSchema) {
    graph.push({...pageSchema, "@id": `${canonical}#service`, url: canonical});
  }
  let script = document.getElementById("seo-structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "seo-structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({"@context": "https://schema.org", "@graph": graph}).replace(/</g, "\\u003c");
}
