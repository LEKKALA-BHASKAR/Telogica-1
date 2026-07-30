/**
 * Commerce overlay for the catalogue in src/data/products.json.
 *
 * The static site had no prices — it was quote-only throughout. These are
 * realistic INR placeholders so the storefront is usable from the first seed;
 * edit them here, or from Admin → Products once the app is running.
 *
 * `requiresQuote: true` keeps a line out of the cart entirely (defence RF,
 * bespoke monitoring systems) and routes buyers to the RFQ flow instead.
 */
export interface CommerceOverlay {
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  requiresQuote?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export const commerceOverlay: Record<string, CommerceOverlay> = {
  /* ── Quote-only: defence RF and bespoke systems ───────────────────────── */
  "rf-power-amplifiers": {
    sku: "TLG-RF-AMP-40G",
    price: 0,
    mrp: 0,
    stock: 0,
    requiresQuote: true,
    isFeatured: true,
    tags: ["rf", "amplifier", "defence", "radar", "ew", "satcom"],
  },
  "6a324bde5f4ee08b5af9f0d5": {
    sku: "TLG-ALM-FMS",
    price: 0,
    mrp: 0,
    stock: 0,
    requiresQuote: true,
    tags: ["fiber monitoring", "alm", "network"],
  },

  /* ── Fusion splicers ──────────────────────────────────────────────────── */
  "6a324be05f4ee08b5af9f105": {
    sku: "TLG-FS-60S",
    price: 145000,
    mrp: 172000,
    stock: 14,
    isFeatured: true,
    tags: ["fusion splicer", "ftth", "fiber"],
  },
  "6a324be05f4ee08b5af9f0fc": {
    sku: "TLG-FS-70S",
    price: 185000,
    mrp: 215000,
    stock: 9,
    tags: ["fusion splicer", "fiber"],
  },
  "6a324be05f4ee08b5af9f0ff": {
    sku: "TLG-FS-80S",
    price: 225000,
    mrp: 264000,
    stock: 7,
    tags: ["fusion splicer", "fiber"],
  },
  "6a324be05f4ee08b5af9f102": {
    sku: "TLG-FS-90R",
    price: 495000,
    mrp: 575000,
    stock: 4,
    isFeatured: true,
    tags: ["fusion splicer", "ribbon", "backbone"],
  },

  /* ── OTDRs ────────────────────────────────────────────────────────────── */
  "6a324be05f4ee08b5af9f0f6": {
    sku: "TLG-OTDR-321A",
    price: 165000,
    mrp: 195000,
    stock: 11,
    tags: ["otdr", "fiber", "testing"],
  },
  "6a324be05f4ee08b5af9f0f9": {
    sku: "TLG-OTDR-321J",
    price: 195000,
    mrp: 229000,
    stock: 8,
    isFeatured: true,
    tags: ["otdr", "fiber", "testing"],
  },
  "6a324bdf5f4ee08b5af9f0ea": {
    sku: "TLG-OTDR-ATL1315",
    price: 245000,
    mrp: 289000,
    stock: 6,
    tags: ["otdr", "atl", "fiber"],
  },
  "6a324bdf5f4ee08b5af9f0db": {
    sku: "TLG-OTDR-C6PRO",
    price: 325000,
    mrp: 379000,
    stock: 5,
    isFeatured: true,
    tags: ["otdr", "comet", "multifunction"],
  },
  "6a324bde5f4ee08b5af9f0cc": {
    sku: "TLG-OTDR-COMET1",
    price: 135000,
    mrp: 159000,
    stock: 12,
    tags: ["otdr", "comet", "fiber"],
  },

  /* ── Optical test accessories ─────────────────────────────────────────── */
  "6a324be05f4ee08b5af9f0f3": {
    sku: "TLG-OPT-LLS",
    price: 28500,
    mrp: 34000,
    stock: 40,
    tags: ["laser source", "optical", "testing"],
  },
  "6a324bdf5f4ee08b5af9f0f0": {
    sku: "TLG-OPT-OPM",
    price: 22500,
    mrp: 26500,
    stock: 52,
    isFeatured: true,
    tags: ["power meter", "optical", "testing"],
  },
  "6a324bdf5f4ee08b5af9f0ed": {
    sku: "TLG-OPT-PMVFL",
    price: 26900,
    mrp: 31500,
    stock: 36,
    tags: ["power meter", "vfl", "optical"],
  },
  "6a324bde5f4ee08b5af9f0cf": {
    sku: "TLG-VFL-04T",
    price: 3200,
    mrp: 4200,
    stock: 120,
    tags: ["vfl", "visual fault locator", "fiber"],
  },

  /* ── Cable & pipe location ────────────────────────────────────────────── */
  "6a324bdf5f4ee08b5af9f0e7": {
    sku: "TLG-LOC-AG309",
    price: 125000,
    mrp: 148000,
    stock: 10,
    tags: ["cable locator", "pipe locator", "utility"],
  },
  "6a324bdf5f4ee08b5af9f0e4": {
    sku: "TLG-CFL-FM111",
    price: 155000,
    mrp: 182000,
    stock: 7,
    tags: ["cable fault locator", "utility"],
  },
  "6a324bdf5f4ee08b5af9f0d8": {
    sku: "TLG-LOC-RTK",
    price: 395000,
    mrp: 459000,
    stock: 3,
    tags: ["cable locator", "rtk", "gnss", "survey"],
  },

  /* ── RFID route markers ───────────────────────────────────────────────── */
  "6a324bdf5f4ee08b5af9f0e1": {
    sku: "TLG-RFID-TL9000",
    price: 115000,
    mrp: 136000,
    stock: 9,
    tags: ["rfid", "route marker", "railway"],
  },
  "6a324bdf5f4ee08b5af9f0de": {
    sku: "TLG-RFID-RW",
    price: 4500,
    mrp: 5600,
    stock: 200,
    tags: ["rfid", "marker", "railway"],
  },
  "6a324bde5f4ee08b5af9f0d2": {
    sku: "TLG-MKR-TLD",
    price: 1850,
    mrp: 2400,
    stock: 340,
    tags: ["passive marker", "utility", "railway"],
  },

  /* ── Precision optical instrumentation (defence programmes) ───────────── */
  "6a0c3b71e22c1efb88e593f3": {
    sku: "TLG-OSA-HR",
    price: 0,
    mrp: 0,
    stock: 0,
    requiresQuote: true,
    tags: ["optical spectrum analyzer", "defence", "instrumentation"],
  },
  "6a0c3bfde22c1efb88e59421": {
    sku: "TLG-OCSA-HR",
    price: 0,
    mrp: 0,
    stock: 0,
    requiresQuote: true,
    tags: ["complex spectrum", "defence", "instrumentation"],
  },
  "6a0c3c71e22c1efb88e59455": {
    sku: "TLG-OFDR",
    price: 0,
    mrp: 0,
    stock: 0,
    requiresQuote: true,
    tags: ["ofdr", "reflectometer", "defence"],
  },
  "6a0c3cbae22c1efb88e59483": {
    sku: "TLG-TLS",
    price: 0,
    mrp: 0,
    stock: 0,
    requiresQuote: true,
    tags: ["tunable laser", "defence", "instrumentation"],
  },
  "6a0c400ae22c1efb88e594e7": {
    sku: "TLG-ASE-BB",
    price: 425000,
    mrp: 495000,
    stock: 3,
    tags: ["ase source", "broadband", "instrumentation"],
  },
  "6a0c4063e22c1efb88e59515": {
    sku: "TLG-POL-FC",
    price: 585000,
    mrp: 665000,
    stock: 2,
    tags: ["polarimeter", "fiber-coupled", "instrumentation"],
  },
  "6a0c40b1e22c1efb88e59543": {
    sku: "TLG-OMT-PLAT",
    price: 0,
    mrp: 0,
    stock: 0,
    requiresQuote: true,
    tags: ["multitest platform", "defence", "instrumentation"],
  },
};

/** Applied to any catalogue entry that has no explicit overlay above. */
export const defaultOverlay: Omit<CommerceOverlay, "sku"> = {
  price: 0,
  mrp: 0,
  stock: 0,
  requiresQuote: true,
};
