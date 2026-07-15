/**
 * Defense-tech repositioning content.
 * Telogica supplies RF power amplifiers (100 MHz–40 GHz) and RF components that
 * go INTO defense/aerospace systems — framed as a component & subsystem
 * supplier, not a builder of complete weapons systems.
 */

export const defenseHero = {
  eyebrow: "Defense & Aerospace RF",
  titleLines: ["Defense-Grade", "RF Power Amplifiers"],
  titleAccent: "100 MHz – 40 GHz",
  intro:
    "Telogica supplies benchtop and module RF power amplifiers, and the components that populate them, for radar, electronic warfare, satellite and military communications, and missile and UAV platforms — engineered for wide bandwidth, high linearity and high reliability.",
  primary: { label: "Explore Capabilities", href: "/capabilities" },
  secondary: { label: "Talk to an Engineer", href: "/contact" },
};

/** Homepage capability-snapshot strip. */
export const snapshot = [
  { value: "100 MHz–40 GHz", label: "Frequency coverage" },
  { value: "Benchtop · Module", label: "Form factors" },
  { value: "Multi-level", label: "Output power" },
  { value: "Wide-band · Linear", label: "High-reliability RF" },
];

/** The 13 applications grouped into four mission areas so buyers self-identify. */
export const missionAreas = [
  {
    key: "radar",
    title: "Radar & Sensing",
    icon: "Radar",
    blurb:
      "Wideband, linear, reliable RF that directly drives detection range and tracking accuracy.",
    apps: [
      "Radar Systems",
      "Modern Tracking Radar Seekers",
      "Solid-State Active Phased Array Systems with Electronic Beam Steering",
    ],
  },
  {
    key: "ew",
    title: "Electronic Warfare & Spectrum Dominance",
    icon: "Bolt",
    blurb:
      "Power and fidelity across broad, contested bandwidths for offensive and defensive spectrum operations.",
    apps: [
      "Electronic Warfare (EW) Systems",
      "RF Jammers",
      "Active Missile Decoy Systems",
      "Electronic Intelligence (ELINT)",
      "Signal Intelligence (SIGINT)",
    ],
  },
  {
    key: "comms",
    title: "Secure Communications & Connectivity",
    icon: "Satellite",
    blurb:
      "Linearity and reliability that protect link integrity across the full operational envelope.",
    apps: ["Satellite Communication (SATCOM)", "Military Communication Systems"],
  },
  {
    key: "platforms",
    title: "Platforms, Weapons & Test",
    icon: "Rocket",
    blurb:
      "RF for the platforms our amplifiers help enable — and the benches that qualify every subsystem.",
    apps: ["Missile Systems", "UAV & Aerospace Systems", "RF Test & Measurement"],
  },
] as const;

/** Why-Telogica pillars for the defense reposition. */
export const whyDefense = [
  {
    icon: "Layers",
    title: "Component to subsystem",
    text: "One partner across the RF chain — the amplifiers and the components that populate them, from a single accountable source.",
  },
  {
    icon: "Wave",
    title: "100 MHz – 40 GHz coverage",
    text: "Broad spectrum coverage in benchtop and module form factors means fewer suppliers to qualify.",
  },
  {
    icon: "Microscope",
    title: "Measured, not asserted",
    text: "A test-and-measurement foundation means performance is characterized and proven, not merely claimed.",
  },
  {
    icon: "Shield",
    title: "Built for the environment",
    text: "Wide bandwidth, high linearity and high reliability engineered for demanding defense and aerospace conditions.",
  },
] as const;

/** Capability snapshot table (capabilities page). */
export const capabilityTable: { attribute: string; detail: string }[] = [
  { attribute: "Offering", detail: "RF power amplifiers · RF components & subsystems" },
  { attribute: "Frequency range", detail: "100 MHz – 40 GHz" },
  { attribute: "Form factors", detail: "Benchtop · Module" },
  { attribute: "Output power", detail: "Multiple levels to suit the application" },
  { attribute: "Performance", detail: "Wide bandwidth · High linearity · High reliability" },
  {
    attribute: "Domains",
    detail: "Radar · EW · SATCOM · Military Comms · Missile / UAV · RF Test",
  },
];

/** The flagship RF power amplifier line (also injected into the product catalog). */
export const amplifier = {
  id: "rf-power-amplifiers",
  name: "RF Power Amplifiers (100 MHz – 40 GHz)",
  summary:
    "A comprehensive range of benchtop and module RF power amplifiers spanning 100 MHz to 40 GHz, in output-power levels to meet diverse defense, aerospace, communication, electronic-warfare and RF-test requirements.",
  performance: [
    "Wide instantaneous bandwidth",
    "Excellent linearity",
    "High output power, multiple levels",
    "High reliability for mission-critical use",
    "Benchtop and module form factors",
    "100 MHz to 40 GHz coverage",
  ],
};
