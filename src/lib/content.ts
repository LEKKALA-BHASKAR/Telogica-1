/**
 * Site-wide marketing copy, transcribed from the approved content deck
 * (`content.text`, prepared August 2026).
 *
 * The positioning is three-sector: Telecom · Railways · Defence & Aerospace,
 * built on a test-and-measurement heritage. Every page's SEO title and meta
 * description lives here alongside its body copy so the two never drift.
 *
 * NOTE: items the deck marked `[confirm]` — year figures, the client roster,
 * certifications beyond ISO 9001:2015, CIN and the compliance officer — are
 * either omitted or left as empty strings below. Fill them in from company
 * records before go-live; nothing here fabricates a figure.
 */

/* ------------------------------------------------------------------ */
/* 1. Home                                                             */
/* ------------------------------------------------------------------ */

export const homeSeo = {
  title:
    "Telogica Limited | Telecom Test & Measurement, Railway Electronics and Defence RF Solutions",
  description:
    "Telogica Limited (BSE: 532975) designs and manufactures telecom test & measurement equipment, railway communication solutions, and defence-grade RF systems in India. ISO 9001:2015 certified. Trusted by BSNL, Indian Railways, DRDO and more.",
};

export const homeHero = {
  eyebrow: "Telecom · Railways · Defence",
  titleLines: ["Engineering the Networks", "That Keep India Moving,"],
  titleAccent: "Connected and Secure",
  intro:
    "For over two decades, Telogica has designed and manufactured mission-critical electronics for India's telecom operators, railways and defence forces — from fibre-optic test instruments to defence-grade RF power amplifiers.",
  primary: { label: "Explore Our Products", href: "/products" },
  secondary: { label: "Request a Quote", href: "/contact" },
};

/** Trust bar rendered directly beneath the hero. */
export const trustBar = [
  "ISO 9001:2015 Certified",
  "BSE Listed (532975)",
  "Made in India",
  "20+ Years of Engineering Excellence",
];

export const whoWeAre = {
  eyebrow: "Who we are",
  title: "Three sectors where failure is not an option.",
  body: [
    "Telogica Limited (formerly Aishwarya Technologies and Telecom Ltd) is a Hyderabad-based design and manufacturing company serving three sectors where failure is not an option: telecommunications, railways and defence.",
    "We build the instruments that test and maintain the nation's fibre and copper networks, the communication systems that keep trains running safely, and the RF power amplifiers behind radar, electronic warfare and secure military communications.",
  ],
};

/** Three columns on the home page, each linking to its industry page. */
export const whatWeDo = [
  {
    key: "telecom",
    icon: "Signal",
    title: "Telecom",
    text: "Test instruments that keep networks alive — OTDRs, cable fault locators, splicing machines, spectrum and network analyzers used daily by India's largest carriers.",
    href: "/solutions/telecommunication",
  },
  {
    key: "railways",
    icon: "Train",
    title: "Railways",
    text: "Communication and testing solutions for railway telecom and signalling infrastructure, supporting Indian Railways and RailTel's nationwide optical fibre network.",
    href: "/solutions/railway",
  },
  {
    key: "defence",
    icon: "Shield",
    title: "Defence & Aerospace",
    text: "Defence-grade RF power amplifiers and components from 100 MHz to 40 GHz, engineered for radar, electronic warfare, satellite and military communication platforms.",
    href: "/solutions/defence",
  },
] as const;

/** Why-Telogica pillars. */
export const whyTelogica = [
  {
    icon: "Factory",
    title: "Design-to-delivery in India",
    text: "Every product is designed, built and supported from our Hyderabad facility — with full control over quality and lead times.",
  },
  {
    icon: "ShieldCheck",
    title: "Proven with demanding customers",
    text: "Two decades supplying India's telecom operators, Indian Railways, and defence and space organisations.",
  },
  {
    icon: "Wrench",
    title: "Lifetime support",
    text: "Sales, calibration and repair support across India — instruments stay in the field, not in transit.",
  },
  {
    icon: "Award",
    title: "Listed and accountable",
    text: "BSE-listed with ISO 9001:2015 certified processes and transparent governance.",
  },
] as const;

/** Featured product families shown on the home page. */
export const featuredProducts = [
  { name: "RF Power Amplifiers", note: "100 MHz – 40 GHz", href: "/solutions/defence" },
  { name: "Optical Time-Domain Reflectometers", note: "Fibre characterisation", href: "/products" },
  { name: "Fusion Splicing Machines", note: "Low-loss fibre jointing", href: "/products" },
  { name: "Cable Fault Locators", note: "Fibre · data · copper", href: "/products" },
  { name: "Cable Route Locators", note: "Buried plant tracing", href: "/products" },
  { name: "Spectrum Analyzers", note: "RF monitoring", href: "/products" },
];

export const homeCta = {
  title: "Have a requirement in telecom, railway or defence electronics?",
  intro:
    "Talk to our engineering team about standard products, custom builds or tender support.",
};

/* ------------------------------------------------------------------ */
/* 2. About Us                                                         */
/* ------------------------------------------------------------------ */

export const aboutSeo = {
  title: "About Telogica Limited | Electronics Design & Manufacturing, Hyderabad, India",
  description:
    "Learn about Telogica Limited — a BSE-listed, ISO 9001:2015 certified designer and manufacturer of telecom test equipment, railway solutions and defence RF systems, headquartered in Hyderabad.",
};

export const aboutHero = {
  eyebrow: "Who we are",
  title: "Designed and manufactured in India, for India and the world.",
  intro:
    "A BSE-listed, ISO 9001:2015 certified designer and manufacturer of telecom test equipment, railway solutions and defence RF systems — headquartered in Hyderabad.",
};

export const ourStory = [
  "Telogica Limited began its journey as Aishwarya Technologies and Telecom Ltd (ATTL), building test and measurement instruments at a time when India's telecom revolution was gathering pace. As the country laid millions of kilometres of copper and optical fibre, our fault locators, OTDRs and splicing machines became everyday tools for the engineers maintaining those networks.",
  "Over the years, the same engineering discipline carried us into new territory. Indian Railways and RailTel adopted our instruments to maintain the optical fibre and communication backbone that runs alongside the nation's tracks. Defence laboratories and public sector undertakings brought us requirements that pushed our RF capabilities further — culminating in today's line of defence-grade RF power amplifiers operating from 100 MHz to 40 GHz.",
  "We became Telogica Limited: a new name reflecting a broader mission, built on the same foundation of designing and manufacturing in India, for India and the world. Telogica is listed on the Bombay Stock Exchange (BSE: 532975) and certified to ISO 9001:2015.",
];

export const missionVision = [
  {
    label: "Mission",
    text: "To design and manufacture reliable, precise and affordable electronic systems that keep critical national infrastructure — communication networks, railways and defence platforms — performing at their best.",
  },
  {
    label: "Vision",
    text: "To be India's most trusted partner for test & measurement and RF technology, and a recognised name in global markets for indigenously engineered electronics.",
  },
];

export const whatSetsUsApart = [
  {
    icon: "Factory",
    title: "Complete in-house cycle",
    text: "R&D, design, prototyping, manufacturing, testing, calibration and after-sales support under one roof in Hyderabad.",
  },
  {
    icon: "Users",
    title: "A multidisciplinary team",
    text: "RF, optical, embedded and production engineers drawn from India's leading telecom operators and institutions.",
  },
  {
    icon: "FileText",
    title: "Procurement fluency",
    text: "Deep familiarity with government and PSU procurement — tenders, inspections, acceptance testing and documentation.",
  },
  {
    icon: "Award",
    title: "Long-standing relationships",
    text: "Sustained partnerships across India's telecom carriers, railway organisations, and defence and space establishments.",
  },
] as const;

export const qualityCopy = {
  title: "Quality & Certifications",
  body: "Telogica operates an ISO 9001:2015 certified quality management system covering design, manufacture and servicing. Every instrument is calibrated and tested against documented acceptance criteria before dispatch, and our processes support the inspection and audit requirements of defence and railway customers.",
};

/**
 * Company milestones. `year` is intentionally blank for entries the content
 * deck flagged for confirmation — the timeline renders the marker without a
 * date rather than printing a guessed one.
 */
export const milestones: { year: string; title: string }[] = [
  { year: "", title: "Founded as Aishwarya Technologies and Telecom Ltd." },
  { year: "", title: "Listed on the Bombay Stock Exchange." },
  { year: "", title: "Instruments deployed across Indian telecom networks at scale." },
  { year: "", title: "Entered the railway telecom & signalling test segment with Indian Railways / RailTel." },
  { year: "", title: "Launched the defence-grade RF power amplifier line (100 MHz – 40 GHz)." },
  { year: "", title: "Renamed Telogica Limited." },
];

/* ------------------------------------------------------------------ */
/* 3. Products                                                         */
/* ------------------------------------------------------------------ */

export const productsSeo = {
  title: "Products | RF Amplifiers, OTDRs, Cable Fault Locators & Test Equipment — Telogica",
  description:
    "Browse Telogica's product range: RF power amplifiers (100 MHz–40 GHz), OTDRs, fusion splicers, cable fault locators, spectrum analyzers and railway test solutions. Designed and made in India.",
};

export const productsIntro =
  "Everything we sell, we engineer. Telogica's product range spans precision optical and copper test instruments, RF systems and manufacturing services — designed in-house, built in Hyderabad, and supported for life. Browse by category below, or contact us for custom configurations and OEM requirements.";

/** The six product categories from the content deck. */
export const productCategories = [
  {
    key: "rf",
    icon: "Waveform",
    title: "RF Power Amplifiers & Components",
    lead: "Defence-grade RF power amplifiers covering 100 MHz to 40 GHz, in benchtop and module form factors. Engineered for wide bandwidth, high linearity and high reliability in mission-critical applications: radar and sensing, electronic warfare and spectrum operations, satellite and military communications, missile and UAV platforms, and test & measurement systems.",
    items: [
      "Broadband solid-state power amplifiers (benchtop) for EMC testing, labs and integration",
      "Compact amplifier modules for airborne, shipborne and vehicular platforms",
      "Custom frequency bands, power levels and form factors on request",
    ],
    href: "/solutions/defence",
  },
  {
    key: "optical",
    icon: "Wave",
    title: "Optical Fibre Test & Measurement",
    lead: "Instruments for building, certifying and maintaining optical fibre across access, metro and long-haul networks.",
    items: [
      "Optical Time-Domain Reflectometers (OTDR) — characterise fibre links, locate breaks and certify installations",
      "Fusion Splicing Machines — field-ready splicers for fast, low-loss jointing in FTTH, backbone and railway OFC deployments",
      "Optical Power Meters & Light Sources — handheld source-and-meter sets for loss measurement and routine maintenance",
    ],
    href: "/solutions/telecommunication",
  },
  {
    key: "copper",
    icon: "Target",
    title: "Copper & Cable Network Testing",
    lead: "The buried-plant toolkit — the instruments that built our reputation.",
    items: [
      "Cable Fault Locators (fibre, data and copper) — pinpoint opens, shorts and insulation faults",
      "Cable Route Locators — trace buried cable paths and depths before excavation or maintenance",
      "Electronic Markers & Locating Systems — mark and later re-locate buried joints, splices and assets",
    ],
    href: "/products",
  },
  {
    key: "rftest",
    icon: "Radar",
    title: "RF, Transmission & Wireless Testing",
    lead: "Radio and transmission network commissioning, monitoring and maintenance.",
    items: [
      "Spectrum Analyzers — portable RF spectrum monitoring and interference hunting",
      "Vector Network Analyzers — component and antenna characterisation",
      "Signal Generators — stable RF sources for lab and production testing",
      "Site Analyzers — antenna and feeder line testing for tower sites",
      "BTS Testers and SDH/PDH Analyzers — base station and transmission network commissioning",
    ],
    href: "/products",
  },
  {
    key: "railway",
    icon: "Train",
    title: "Railway Solutions",
    lead: "Test and communication solutions supporting railway telecom, OFC and signalling maintenance — detailed on the Railways industry page.",
    items: [],
    href: "/solutions/railway",
  },
  {
    key: "ems",
    icon: "Factory",
    title: "Electronics Manufacturing Services (EMS)",
    lead: "Contract design and manufacturing for IoT and telecom electronics: PCB assembly, box build, testing and calibration. Partner with Telogica to build your product on proven, ISO 9001:2015 certified lines.",
    items: [],
    href: "/manufacturing",
  },
] as const;

/* ------------------------------------------------------------------ */
/* 4–6. Industries                                                     */
/* ------------------------------------------------------------------ */

export interface IndustryContent {
  seo: { title: string; description: string };
  eyebrow: string;
  heroTitle: string;
  heroIntro: string;
  challengeTitle: string;
  challenge: string;
  answerTitle: string;
  answer: string;
  whoWeServe: string;
  applications: string[];
  cta: {
    title: string;
    intro: string;
    primary: { label: string; href: string };
    /** Defaults to the industries index when omitted. */
    secondary?: { label: string; href: string };
  };
}

export const industries: Record<
  "telecommunication" | "railway" | "defence",
  IndustryContent
> = {
  telecommunication: {
    seo: {
      title: "Telecom Solutions | Fibre & Copper Network Test Equipment — Telogica",
      description:
        "Telogica equips India's telecom operators with OTDRs, splicers, fault locators and RF test instruments. Trusted by India's leading carriers and global OEMs for over two decades.",
    },
    eyebrow: "Industries · Telecom",
    heroTitle: "Keeping the Nation's Networks Alive",
    heroIntro:
      "From the first copper pair to today's dense fibre and 5G rollouts, Telogica's instruments have been in the tool kits of India's network engineers for over twenty years.",
    challengeTitle: "The Challenge",
    challenge:
      "India operates one of the world's largest and fastest-growing telecom networks. Every kilometre of fibre and copper must be installed, certified, monitored and repaired — often in harsh field conditions, on tight timelines, and at a price point imported instruments struggle to meet.",
    answerTitle: "Our Answer",
    answer:
      "Telogica designs and manufactures the complete field-testing toolkit: OTDRs and fusion splicers for fibre rollout and repair, fault and route locators for the buried plant, spectrum and site analyzers for the radio network, and BTS and SDH testers for transmission. Because we design and build in India, operators get instruments matched to Indian field conditions, backed by local calibration and repair — at a fraction of imported cost.",
    whoWeServe:
      "Public and private telecom operators, infrastructure providers, and global OEMs deploying networks in India.",
    applications: [
      "FTTH and backbone fibre rollout — splicing, certification and acceptance testing",
      "Fault location and restoration on copper and fibre routes",
      "Tower site installation and maintenance — antenna, feeder and BTS testing",
      "Spectrum monitoring and interference resolution",
    ],
    cta: {
      title: "Explore telecom products",
      intro: "Tell us your network, and we'll match the instruments to it — or arrange a demo.",
      primary: { label: "Request a demo", href: "/contact" },
    },
  },

  railway: {
    seo: {
      title: "Railway Solutions | Telecom, OFC & Signalling Test Equipment — Telogica",
      description:
        "Telogica supports Indian Railways and RailTel with test and communication solutions for railway OFC networks, telecom and signalling infrastructure. Designed and made in India.",
    },
    eyebrow: "Industries · Railways",
    heroTitle: "Technology for the Lifeline of the Nation",
    heroIntro:
      "Behind every safe train movement is a web of optical fibre, telecom circuits and signalling systems. Telogica builds the instruments and solutions that keep that web healthy.",
    challengeTitle: "The Challenge",
    challenge:
      "Indian Railways runs one of the world's largest rail networks, with tens of thousands of kilometres of optical fibre cable laid along its tracks and an expanding programme of signalling modernisation, station Wi-Fi and train communication systems. This infrastructure must be maintained around the clock, across every terrain in the country — and downtime directly affects safety and punctuality.",
    answerTitle: "Our Answer",
    answer:
      "Telogica's field instruments are used to install, certify and maintain railway communication infrastructure: OTDRs and fusion splicers for the trackside OFC backbone, cable fault and route locators for buried signalling and quad cables, and transmission analyzers for railway telecom circuits. Our equipment is engineered for the realities of trackside work — rugged, portable, battery-operated and serviceable within India.",
    whoWeServe:
      "Indian Railways zones and divisions, RailTel Corporation, railway PSUs, and contractors executing railway telecom and signalling projects.",
    applications: [
      "Trackside OFC installation, splicing and acceptance testing",
      "Fault location and restoration on signalling and telecom cables",
      "Maintenance of railway transmission and communication circuits",
      "Support for signalling modernisation and station connectivity projects",
    ],
    cta: {
      title: "Discuss your railway project",
      intro:
        "Talk to our engineers about trackside OFC, signalling cable and railway telecom test requirements.",
      primary: { label: "Contact our team", href: "/contact" },
    },
  },

  defence: {
    seo: {
      title: "Defence & Aerospace | RF Power Amplifiers 100 MHz–40 GHz — Telogica",
      description:
        "Defence-grade RF power amplifiers and components for radar, electronic warfare, satellite and military communications. Designed and manufactured in India by Telogica Limited.",
    },
    eyebrow: "Industries · Defence & Aerospace",
    heroTitle: "RF Power for Mission-Critical Platforms",
    heroIntro:
      "From radar to electronic warfare, Telogica delivers indigenously designed RF power amplifiers spanning 100 MHz to 40 GHz — wide bandwidth, high linearity, high reliability.",
    challengeTitle: "The Opportunity",
    challenge:
      "India's defence modernisation and the Atmanirbhar Bharat initiative demand indigenous sources for critical RF technology that has traditionally been imported. Telogica answers that demand with a growing line of solid-state RF power amplifiers and components, designed and manufactured entirely in India.",
    answerTitle: "Capabilities",
    answer:
      "Solid-state RF power amplifiers from 100 MHz to 40 GHz in benchtop and module form factors, with wide instantaneous bandwidth, high linearity and high-reliability designs for continuous mission-critical operation. Custom engineering covers frequency band, output power, cooling, form factor and interface — tailored to platform requirements, with environmental screening and testing aligned to defence standards.",
    whoWeServe:
      "Defence research laboratories, public sector undertakings and system integrators, along with private defence manufacturers.",
    applications: [
      "Radar and sensing systems",
      "Electronic warfare and spectrum operations",
      "Satellite and military communications",
      "Missile and UAV platforms",
      "Test & measurement and EMC systems",
    ],
    cta: {
      title: "Request the RF capability document",
      intro:
        "Talk to our RF engineering team about frequency bands, power levels and platform integration.",
      primary: { label: "Talk to an RF engineer", href: "/contact" },
      secondary: { label: "Full RF capabilities", href: "/capabilities" },
    },
  },
};

/* ------------------------------------------------------------------ */
/* 7. Manufacturing & R&D                                              */
/* ------------------------------------------------------------------ */

export const manufacturingSeo = {
  title: "Manufacturing & R&D | Telogica Limited, Hyderabad",
  description:
    "Inside Telogica's Hyderabad facility: in-house R&D, PCB assembly, testing and calibration on ISO 9001:2015 certified lines. Electronics manufacturing services for OEM partners.",
};

export const manufacturing = {
  eyebrow: "Manufacturing & R&D",
  heroTitle: "Designed and Built Under One Roof",
  heroIntro:
    "Telogica's Hyderabad facility houses the complete product lifecycle: research and development, hardware and firmware design, prototyping, production, testing, calibration and repair. This integration is why our instruments reach the field faster, cost less, and are supported for years after sale.",
  rnd: {
    title: "R&D",
    body: "Our engineering team spans RF, optical, analog, digital and embedded design, with experience drawn from India's leading telecom operators and technology institutions. Development is driven by field feedback — the engineers who repair instruments sit beside the engineers who design the next generation.",
  },
  production: {
    title: "Production & Quality",
    points: [
      "ISO 9001:2015 certified manufacturing and quality management system",
      "PCB assembly, integration and box build",
      "100% functional testing and calibration against documented acceptance criteria",
      "Inspection and documentation support for defence, railway and PSU procurement",
    ],
  },
  ems: {
    title: "Electronics Manufacturing Services",
    body: "We offer contract manufacturing for IoT and telecom electronics — from build-to-print assembly to full product development partnerships. If you need a reliable Indian manufacturing partner with genuine engineering depth, talk to us.",
    cta: { label: "Enquire about EMS partnership", href: "/contact" },
  },
};

/* ------------------------------------------------------------------ */
/* 8. Investors                                                        */
/* ------------------------------------------------------------------ */

export const investorsSeo = {
  title: "Investor Relations | Telogica Limited (BSE: 532975)",
  description:
    "Investor information for Telogica Limited (BSE: 532975): annual reports, financial results, shareholding pattern, corporate governance and announcements.",
};

export const investorsIntro =
  "Telogica Limited (formerly Aishwarya Technologies and Telecom Ltd) is listed on the Bombay Stock Exchange under scrip code 532975 (ISIN: INE778I01024). We are committed to transparent, timely disclosure and sound corporate governance. This section provides shareholders and prospective investors with statutory filings, financial results and company announcements.";

// The eight SEBI LODR document libraries — and the PDFs published under each —
// live in `@/lib/investor-documents`, next to the upload instructions.

/* ------------------------------------------------------------------ */
/* 9. Contact                                                          */
/* ------------------------------------------------------------------ */

export const contactSeo = {
  title: "Contact Telogica Limited | Hyderabad, India",
  description:
    "Contact Telogica Limited for product enquiries, quotes, support or investor questions. Registered office: Jubilee Hills, Hyderabad. Email sales@telogica.com.",
};

export const contactIntro =
  "Whether you need a quotation, a product demonstration, calibration support, or want to discuss a custom requirement — our team responds within one working day.";

/** "I'm interested in" options on the enquiry form. */
export const enquiryInterests = [
  "Telecom Products",
  "Railway Solutions",
  "Defence & RF",
  "EMS",
  "Investor Relations",
  "Other",
];

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footerTagline = "Engineering India's critical networks.";
