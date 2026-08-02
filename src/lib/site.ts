export const site = {
  name: "Telogica Limited",
  shortName: "Telogica",
  legalNote: "Formerly Aishwarya Technologies and Telecom Ltd",
  tagline: "Telecom Test & Measurement, Railway Electronics and Defence RF Solutions",
  description:
    "Telogica Limited (BSE: 532975) designs and manufactures telecom test & measurement equipment, railway communication solutions, and defence-grade RF systems in India. ISO 9001:2015 certified.",
  url: "https://telogica.com",
  bse: "BSE: 532975",
  iso: "ISO 9001:2015 Certified",
  email: {
    sales: "sales@telogica.com",
    support: "support@telogica.com",
    investors: "investors@telogica.com",
  },
  phones: ["+91 93966 10682", "+91-40-2753 1324 to 26", "+91-40-2753 5423"],
  address: {
    line1: "Empire Square, Plot No 233-A, 234 & 235",
    line2: "3rd Floor, Road No 36, Jubilee Hills",
    city: "Hyderabad – 500 033, Telangana, India",
  },
  hours: "Mon – Sat: 10:00 AM – 6:00 PM IST",
  social: {
    linkedin: "https://www.linkedin.com/company/telogica-limited/",
    facebook: "https://www.facebook.com/aishwaryatechtele",
    youtube: "https://www.youtube.com/user/aishwaryatechtele",
  },
  maps:
    "https://maps.google.com/maps?ll=17.430595,78.409771&z=15&q=Jubilee%20Hills%20Hyderabad%2C%20Telangana",
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/solutions" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Investors", href: "/investors" },
  { label: "Contact", href: "/contact" },
];

/** Signed-in customer menu, rendered from the header account dropdown. */
export const accountNav = [
  { label: "My orders", href: "/account/orders" },
  { label: "Quote requests", href: "/account/quotes" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Profile", href: "/account" },
];

export const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Quotes", href: "/admin/quotes" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Customers", href: "/admin/users" },
];

export const stats = [
  { value: "3", label: "Sectors served" },
  { value: "100 MHz–40 GHz", label: "RF spectrum coverage" },
  { value: "20+", label: "Years of engineering" },
  { value: "ISO 9001", label: "2015 certified quality" },
];
