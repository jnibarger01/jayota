import { DEALER, formatAddress } from "@/lib/dealer";

export const SITE_NAME = DEALER.name;

export function pageTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
}

export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: pageTitle(title) },
      { name: "description", content: description },
    ],
  };
}

/** LocalBusiness/AutoDealer structured data — only verified public facts. */
export function autoDealerJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: DEALER.name,
    legalName: DEALER.legalName,
    url: DEALER.website,
    telephone: DEALER.phone.general,
    address: {
      "@type": "PostalAddress",
      streetAddress: DEALER.address.street,
      addressLocality: DEALER.address.city,
      addressRegion: DEALER.address.state,
      postalCode: DEALER.address.zip,
      addressCountry: DEALER.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: DEALER.geo.lat,
      longitude: DEALER.geo.lng,
    },
    openingHoursSpecification: DEALER.hours.sales.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.day,
      opens: row.opens,
      closes: row.closes,
    })),
    description: `${DEALER.name} digital showroom. ${formatAddress()}. Hours sourced from the Toyota.com dealer directory and should be confirmed before visiting.`,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path,
    })),
  };
}
