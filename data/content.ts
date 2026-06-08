/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH — all site copy, pulled verbatim from
 *  "Copy of Blueprint 2.pdf" (Xandrea Harshey Services Inc.).
 *
 *  Company names, taglines, service lists, and leadership bios are EXACT.
 *  Short connective microcopy (e.g. fleshed-out Company History) is marked
 *  with `// connective` and may be edited freely without touching facts.
 *
 *  Imagery uses Unsplash placeholders (themed: construction, Calgary,
 *  corporate, facility, trade, hospitality) — swap the IDs below to brand.
 * ============================================================================
 */

/** Build a consistent Unsplash placeholder URL from a photo id. */
const ux = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const site = {
  name: "Xandrea Harshey Services Inc.",
  shortName: "Xandrea Harshey",
  url: "https://www.xandreaharshey.com",
  tagline: "Building Businesses. Creating Opportunities. Delivering Excellence.",
  secondaryTagline: "Building Trust. Creating Value. Delivering Excellence.",
  description:
    "Xandrea Harshey Services Inc. is a diversified Canadian business group delivering innovative solutions across construction, facility services, hospitality, international trade, entertainment, and strategic business ventures.",
  city: "Calgary",
  region: "Alberta",
  regionCode: "AB",
  country: "Canada",
  countryCode: "CA",
  founded: "2018",
  email: "info@xandreaharshey.com",
  phone: "+1 (403) 000-0000", // connective placeholder — swap for real number
  hqLine: "Calgary, Alberta, Canada",
};

/** Full navigation — lives in the slide-out overlay menu. */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Companies", href: "/companies" },
  { label: "Leadership", href: "/leadership" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/** Minimal set of links kept visible in the top bar (logo links Home). */
export const primaryNav = [
  { label: "Companies", href: "/companies" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Social handles shown in the overlay menu footer (placeholders). */
export const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Facebook", href: "https://www.facebook.com" },
];

export const hero = {
  // Warm, human welcome line over the big serif headline.
  eyebrow: "Welcome to Xandrea Harshey",
  // Headline split into lines for the masked line-by-line reveal.
  headlineLines: ["Building Excellence.", "Delivering Results."],
  // One inviting sentence — warm, not jargon.
  subtext:
    "A Canadian company building beautiful spaces and lasting relationships — with craftsmanship, care, and a genuine commitment to the people we serve.",
  // One clear primary button + a couple of quiet text links.
  cta: { label: "Discover Our Work", href: "/companies" },
  links: [{ label: "Get in Touch", href: "/contact" }],
  // Hero media — self-hosted in /public/video for reliability (no hotlink/CORS
  // dependency). Swap for branded b-roll when available; keep poster matching
  // the first video frame so there's no jump if the video is still buffering.
  poster: "/video/hero-poster.jpg",
  video: "/video/hero.mp4",
};

/**
 * Three bold figures overlaid on the hero (the Carolwood stat-panel pattern).
 * Rendered as static gold numerals so they're instant and never flicker.
 */
export const heroStats = [
  { value: "4", label: "Operating Companies" },
  { value: "30+", label: "Service Capabilities" },
  { value: "$50M+", label: "Enterprise Scale" },
];

/**
 * Lean trust/credibility row (the Carolwood "Featured In" equivalent) — a
 * single elegant line of standards rather than a dense band.
 */
export const trustSignals = [
  "Fully Insured",
  "WCB Coverage",
  "Safety Certified",
  "Quality Assured",
];

/**
 * Full-bleed "welcome" image moment placed immediately after the hero video —
 * a breathtaking home/property still with a warm welcoming line overlaid.
 */
export const welcome = {
  eyebrow: "Who We Are",
  statement: "A Canadian enterprise built on people, craftsmanship, and trust.",
  image: ux("1568605114967-8130f3a36994", 1600),
  imageAlt:
    "Warm, sunlit modern home exterior at golden hour — the spaces Xandrea Harshey builds",
};

/** Large centered positioning statement on the homepage (warm editorial intro). */
export const statement = {
  eyebrow: "Our Story",
  lead: "We build homes, spaces, and businesses that people are proud to be part of —",
  rest:
    "bringing care and craftsmanship to construction, property, trade, and hospitality, and building relationships that last well beyond the work itself.",
};

export const overview = {
  eyebrow: "Corporate Overview",
  heading: "Who We Are",
  body: [
    "Xandrea Harshey Services Inc. is a Canadian-owned enterprise providing integrated business solutions across multiple industries.",
    "Our diversified portfolio allows us to create synergies between industries while delivering exceptional results through innovation, strategic partnerships, and operational excellence.",
  ],
  highlights: [
    "Diversified Business Portfolio",
    "Canadian-Owned Enterprise",
    "Multi-Industry Operations",
    "Experienced Leadership Team",
    "Scalable Growth Strategy",
    "Client-Focused Solutions",
  ],
  image: ux("1570129477492-45c003edd2be", 1400),
};

export const stats = [
  { value: 6, suffix: "", label: "Business Divisions" },
  { value: 50, suffix: "M+", prefix: "$", label: "Diversified Group Scale" },
  { value: 8, suffix: "", label: "Industry Sectors" },
  { value: 100, suffix: "%", label: "Canadian-Owned" },
];

export const about = {
  eyebrow: "About Xandrea Harshey Services Inc.",
  heading: "A diversified Canadian business group built on trust.",
  intro:
    "Xandrea Harshey Services Inc. is a diversified Canadian business group focused on building sustainable businesses, delivering exceptional services, and creating long-term value for clients, partners, employees, and communities.",
  intro2:
    "The company operates through multiple business divisions and strategic ventures while maintaining a commitment to quality, integrity, innovation, and operational excellence.",
  history: {
    heading: "Company History",
    // connective — blueprint says "Tell the story..."; facts kept neutral & true to positioning.
    body: [
      "Xandrea Harshey Services Inc. was founded in Calgary, Alberta, on a simple conviction: that disciplined leadership and operational excellence could build not one great business, but many. What began as a focused construction and property services operation has grown into a diversified enterprise spanning construction, facility services, hospitality, international trade, entertainment, and strategic ventures.",
      "Each stage of our growth has followed the same playbook — identify a real opportunity, build a capable team around it, and operate it to a standard that earns long-term client relationships. Today the group brings those divisions together under one set of values, creating synergies across industries that few single-sector companies can match.",
      "As we look to the future, our vision is unchanged: to keep building sustainable businesses, creating opportunities for the people and communities we serve, and delivering excellence in everything we do.",
    ],
  },
  mission: {
    heading: "Mission",
    body:
      "To develop and operate industry-leading businesses that create value, generate opportunities, and positively impact the communities we serve.",
  },
  vision: {
    heading: "Vision",
    body:
      "To become one of Canada's most respected diversified business groups recognized for excellence, innovation, and sustainable growth.",
  },
  values: {
    heading: "Core Values",
    items: [
      { name: "Integrity", blurb: "We do what is right, transparently, in every relationship and transaction." },
      { name: "Accountability", blurb: "We own our commitments and stand behind the results we deliver." },
      { name: "Excellence", blurb: "We hold every division to the highest standard of quality and craft." },
      { name: "Leadership", blurb: "We lead with vision, discipline, and respect for the people we serve." },
      { name: "Innovation", blurb: "We pursue better ways to build, operate, and create value." },
      { name: "Collaboration", blurb: "We create synergies across industries, partners, and teams." },
      { name: "Community Impact", blurb: "We build businesses that strengthen the communities around them." },
    ],
  },
  philosophy: {
    heading: "Leadership Philosophy",
    body:
      "Building organizations through strong leadership, operational discipline, strategic partnerships, and long-term thinking.",
  },
  image: ux("1600585154340-be6161a56a0c", 1400),
  imageAlt: "A warmly finished modern home — the kind of craftsmanship Xandrea Harshey is built on",
  historyImage: ux("1454165804606-c3d57bc86b40", 1400),
  historyImageAlt:
    "Leadership team reviewing plans together — building the enterprise across divisions",
};

/** Centralized hero imagery for interior pages (keeps page files clean). */
export const pageHeroImages = {
  companies: ux("1486304873000-235643847519", 1600),
  services: ux("1503387762-592deb58ef4e", 1600),
  leadership: ux("1497366216548-37526070297c", 1600),
};

export type Company = {
  slug: string;
  name: string;
  tagline: string;
  blurb?: string; // connective
  services: string[];
  extra?: { heading: string; items: string[] };
  image: string;
  imageAlt: string;
  /** Optional white, transparent division logo overlaid on the photo (e.g. on hover). */
  logo?: string;
};

export const companies: Company[] = [
  {
    slug: "g-pinoy-construction-development",
    name: "G-Pinoy Construction & Development Inc",
    tagline: "Building Today. Developing Tomorrow.",
    blurb:
      "Full-scope construction and development — from residential and commercial builds to mixed-use developments and turnkey project delivery.", // connective
    services: [
      "Residential Construction",
      "Commercial Construction",
      "Mixed-Use Developments",
      "Property Development",
      "Site Development",
      "Renovations & Rehabilitation",
      "Construction Management",
      "Turnkey Project Delivery",
    ],
    image: ux("1503387762-592deb58ef4e", 1400),
    imageAlt: "Construction site with tower crane against a clear sky",
    logo: "/logos/g-pinoy.png",
  },
  {
    slug: "xandrea-facility-services",
    name: "Xandrea Facility Services",
    tagline: "Reliable Solutions. Exceptional Standards.",
    blurb:
      "Dependable facility and building support services that keep commercial properties operating at their best.", // connective
    services: [
      "Commercial Cleaning",
      "Janitorial Services",
      "Facility Maintenance",
      "Property Support Services",
      "Building Operations",
      "Exterior Maintenance",
    ],
    image: ux("1581578731548-c64695cc6952", 1400),
    imageAlt: "Professional facility services team maintaining a commercial building",
    logo: "/logos/facility.png",
  },
  {
    slug: "primeport-commodity",
    name: "Primeport Commodity Inc.",
    tagline: "Connecting Markets. Delivering Opportunities.",
    blurb:
      "International trade and supply chain solutions connecting global markets through strategic partnerships.", // connective
    services: [
      "Commodity Trading",
      "Import & Export Operations",
      "International Procurement",
      "Global Distribution",
      "Supply Chain Solutions",
      "Strategic Trade Partnerships",
    ],
    image: ux("1494412574643-ff11b0a5c1c3", 1400),
    imageAlt: "Cargo containers at an international shipping port",
    logo: "/logos/primeport.png",
  },
  {
    slug: "construction-property-services",
    name: "Construction & Property Services Division",
    tagline: "Building Trust. Creating Value. Delivering Excellence.",
    blurb:
      "Xandrea Construction & Property Services specializes in construction, renovation, restoration, maintenance, and property improvement solutions for residential, commercial, and multi-family properties. We combine technical expertise, operational excellence, and hands-on experience to deliver exceptional results.",
    services: [
      "General Construction",
      "Renovations & Remodeling",
      "Painting Services",
      "Exterior Restoration",
      "Stucco Repair",
      "Concrete Repair",
      "Property Maintenance",
      "Commercial Improvements",
      "Multi-Family Property Services",
    ],
    extra: {
      heading: "Why Choose Xandrea",
      items: [
        "Experienced Leadership Team",
        "Skilled Multi-Trade Professionals",
        "Safety & Quality Driven",
        "On-Time Project Delivery",
        "Residential & Commercial Expertise",
        "Client-Focused Solutions",
      ],
    },
    image: ux("1562259929-b4e1fd3aef09", 1400),
    imageAlt: "Skilled tradesperson performing a property renovation",
  },
];

export type Leader = {
  slug: string;
  name: string;
  title: string;
  short: string; // connective one-liner
  image: string;
  bio: string[]; // verbatim from blueprint
};

export const leaders: Leader[] = [
  {
    slug: "alejandro-pagcaliwagan",
    name: "Alejandro Pagcaliwagan",
    title: "Chairman of the Board",
    short: "Entrepreneur, contractor, and community leader providing strategic vision across the group.",
    image: ux("1560250097-0b93528c311a", 1000),
    bio: [
      "Alejandro Pagcaliwagan is a Canadian entrepreneur, contractor, business executive, and community leader based in Calgary, Alberta. As Chairman of the Board of Xandrea Harshey Services Inc., he provides strategic leadership, corporate governance, and long-term vision across the organization's diverse business interests.",
      "With extensive experience in construction, business development, and entrepreneurship, Alejandro has built a reputation for identifying opportunities, fostering strategic partnerships, and driving sustainable growth. His leadership philosophy is rooted in integrity, accountability, innovation, and a commitment to operational excellence.",
      "In addition to his business achievements, Alejandro has established a significant digital presence, engaging a broad audience through content focused on entrepreneurship, business, leadership, and community development. His influence and professional accomplishments have positioned him as a respected voice among aspiring entrepreneurs and business professionals.",
      "Beyond the boardroom, Alejandro is also an accomplished chef whose creativity, discipline, and attention to detail reflect the same standards of excellence that guide his professional endeavors.",
      "As Chairman, he remains committed to building successful enterprises, creating opportunities for others, and generating long-term value for clients, partners, employees, and the communities served by Xandrea Harshey Services Inc.",
    ],
  },
  {
    slug: "ajit-hardasani",
    name: "Ajit Hardasani",
    title: "President",
    short: "Seasoned executive driving corporate growth, partnerships, and operational excellence.",
    image: ux("1507003211169-0a1dd7228f2d", 1000),
    bio: [
      "Ajit Hardasani is a seasoned business executive, entrepreneur, and corporate leader with extensive experience spanning healthcare, education, trading, consulting, and business development. As President of Xandrea Harshey Services Inc., he is responsible for driving corporate growth, strategic partnerships, operational excellence, and long-term business development initiatives across the organization.",
      "Prior to joining Xandrea Harshey Services Inc., Ajit held several senior leadership positions, including Chief Operating Officer of Forticare Health Systems International, where he played an instrumental role in strengthening operations, enhancing organizational performance, and supporting business expansion. He also served as President of Red Diamond Trading Corporation and President of Little Friends of St. Mary's Learning Center, demonstrating a proven track record in executive leadership, strategic planning, and institution building.",
      "In addition to his corporate achievements, Ajit has a creative background as a former songwriter and recording artist in the Philippines, reflecting a unique blend of creativity, innovation, and entrepreneurial thinking. This diverse experience has contributed to his ability to lead organizations with vision, adaptability, and a people-centered approach.",
      "Recognized for his results-driven leadership style and commitment to excellence, Ajit continues to champion innovation, sustainable growth, and value creation while helping position Xandrea Harshey Services Inc. as a respected and diversified Canadian enterprise.",
    ],
  },
  {
    slug: "harlem-pagcaliwagan",
    name: "Harlem Pagcaliwagan",
    title: "Chief Operating Officer",
    short: "Operations leader overseeing project execution and organizational performance.",
    image: ux("1472099645785-5658abf4ff4e", 1000),
    bio: [
      "Harlem Pagcaliwagan serves as Chief Operating Officer of Xandrea Harshey Services Inc., where he oversees day-to-day operations, project execution, workforce management, and organizational performance across the company's business divisions.",
      "With extensive hands-on experience across multiple construction trades and operational disciplines, Harlem brings a practical understanding of project management, field operations, and business execution. His technical expertise, combined with a strong commitment to quality, efficiency, and client satisfaction, has contributed significantly to the company's growth and operational success.",
      "As a member of the executive leadership team, Harlem plays a key role in implementing strategic initiatives, improving operational processes, and ensuring projects are delivered to the highest standards of safety, quality, and professionalism. His leadership approach is grounded in accountability, continuous improvement, and a commitment to building high-performing teams.",
      "Representing the next generation of business leadership, Harlem combines innovation, adaptability, and operational excellence to help drive the long-term success and growth of Xandrea Harshey Services Inc.",
    ],
  },
];

export const leadershipFeatures = [
  "Accountability-First Culture",
  "Long-Term Capital Stewardship",
  "Operational Discipline",
  "Community Investment",
  "People-Centered Leadership",
];

export type Capability = {
  title: string;
  blurb: string; // connective
  image: string;
};

export const capabilities: Capability[] = [
  {
    title: "Construction & Development",
    blurb:
      "Residential, commercial, and mixed-use construction, property and site development, and turnkey project delivery.",
    image: ux("1503387762-592deb58ef4e", 1200),
  },
  {
    title: "Facility Services",
    blurb:
      "Commercial cleaning, janitorial, facility maintenance, building operations, and property support services.",
    image: ux("1581578731548-c64695cc6952", 1200),
  },
  {
    title: "Hospitality & Restaurants",
    blurb:
      "Hospitality ventures and culinary experiences operated to the same standard of excellence as every division.",
    image: ux("1517248135467-4c7edcad34c4", 1200),
  },
  {
    title: "International Trade",
    blurb:
      "Commodity trading, import/export, global procurement, distribution, and supply chain solutions.",
    image: ux("1494412574643-ff11b0a5c1c3", 1200),
  },
  {
    title: "Entertainment & Events",
    blurb:
      "Entertainment and event ventures that bring creativity, production discipline, and audience engagement together.",
    image: ux("1492684223066-81342ee5ff30", 1200),
  },
  {
    title: "Strategic Business Ventures",
    blurb:
      "Opportunistic investments and new ventures that extend the group's reach and create cross-industry synergy.",
    image: ux("1449824913935-59a10b8d2000", 1200),
  },
  {
    title: "Property Services",
    blurb:
      "Renovation, restoration, painting, concrete and stucco repair, and ongoing property maintenance.",
    image: ux("1562259929-b4e1fd3aef09", 1200),
  },
  {
    title: "Project Management",
    blurb:
      "Professional project management ensuring safe, on-time, on-budget delivery across every division.",
    image: ux("1486304873000-235643847519", 1200),
  },
];

export type Project = {
  title: string;
  category:
    | "Commercial Projects"
    | "Residential Projects"
    | "Property Restoration"
    | "Facility Services Contracts"
    | "Hospitality Projects"
    | "Special Projects";
  value: string; // connective sample
  timeline: string; // connective sample
  scope: string; // connective sample
  objective: string; // connective sample
  outcome: string; // connective sample
  image: string;
  imageAlt: string;
};

export const projectCategories = [
  "All",
  "Commercial Projects",
  "Residential Projects",
  "Property Restoration",
  "Facility Services Contracts",
  "Hospitality Projects",
  "Special Projects",
] as const;

// Featured projects — figures and details are connective sample data.
export const projects: Project[] = [
  {
    title: "Downtown Mixed-Use Development",
    category: "Commercial Projects",
    value: "$12.4M",
    timeline: "18 months",
    scope: "Ground-up commercial & residential mixed-use build, site development, turnkey delivery.",
    objective: "Deliver a flagship mixed-use asset on a constrained downtown lot, on schedule.",
    outcome: "Completed on time with full occupancy at handover and zero lost-time incidents.",
    image: ux("1486406146926-c627a92ad1ab", 1200),
    imageAlt: "Downtown mixed-use development tower",
  },
  {
    title: "Executive Custom Residence",
    category: "Residential Projects",
    value: "$2.1M",
    timeline: "11 months",
    scope: "Custom residential construction with premium interior and exterior finishing.",
    objective: "Build a bespoke family residence to exacting design and quality standards.",
    outcome: "Delivered a turnkey home praised for craftsmanship and finish quality.",
    image: ux("1600585154340-be6161a56a0c", 1200),
    imageAlt: "Modern custom residential home exterior",
  },
  {
    title: "Heritage Exterior Restoration",
    category: "Property Restoration",
    value: "$680K",
    timeline: "5 months",
    scope: "Exterior restoration, stucco repair, concrete repair, and repainting.",
    objective: "Restore a weathered multi-family façade while keeping tenants in place.",
    outcome: "Restored building envelope and curb appeal with minimal tenant disruption.",
    image: ux("1448630360428-65456885c650", 1200),
    imageAlt: "Restored heritage building façade",
  },
  {
    title: "Corporate Campus Facility Contract",
    category: "Facility Services Contracts",
    value: "$1.3M / yr",
    timeline: "Multi-year",
    scope: "Commercial cleaning, janitorial, facility maintenance, and building operations.",
    objective: "Maintain a multi-building corporate campus to a premium operating standard.",
    outcome: "Sustained 99%+ service SLAs across the contract term.",
    image: ux("1497366811353-6870744d04b2", 1200),
    imageAlt: "Corporate campus interior maintained by facility services",
  },
  {
    title: "Boutique Restaurant Build-Out",
    category: "Hospitality Projects",
    value: "$1.6M",
    timeline: "7 months",
    scope: "Full hospitality build-out, kitchen fit-out, and front-of-house finishing.",
    objective: "Open a signature dining venue blending design and operational excellence.",
    outcome: "Opened on schedule to strong early reviews and steady covers.",
    image: ux("1517248135467-4c7edcad34c4", 1200),
    imageAlt: "Boutique restaurant interior build-out",
  },
  {
    title: "Strategic Trade Logistics Program",
    category: "Special Projects",
    value: "$4.8M",
    timeline: "Ongoing",
    scope: "International procurement, global distribution, and supply chain coordination.",
    objective: "Stand up a reliable cross-border supply program for key commodities.",
    outcome: "Established dependable trade lanes with strategic partners.",
    image: ux("1578575437130-527eed3abbec", 1200),
    imageAlt: "Global trade logistics and distribution operation",
  },
];

export const safety = {
  eyebrow: "Safety & Quality Standards",
  heading: "Safety and quality are integrated into every aspect of our operations.",
  standards: [
    { name: "Fully Insured Operations", blurb: "Comprehensive coverage protecting every project and client." },
    { name: "WCB Coverage", blurb: "Workers' Compensation Board coverage across our workforce." },
    { name: "Safety Training Programs", blurb: "Ongoing training that keeps crews current and protected." },
    { name: "Quality Control Systems", blurb: "Structured QC checkpoints at every project stage." },
    { name: "Professional Project Management", blurb: "Disciplined PM for safe, on-time delivery." },
    { name: "Regulatory Compliance", blurb: "Adherence to all applicable codes and regulations." },
    { name: "Site Audits & Inspections", blurb: "Routine audits that catch issues before they escalate." },
    { name: "Continuous Improvement Programs", blurb: "We learn from every project and raise the bar." },
  ],
  image: ux("1581094794329-c8112a89af12", 1400),
  imageAlt: "Site supervisor in safety gear inspecting a construction project",
};

export const careers = {
  eyebrow: "Careers",
  heading: "Build Your Future With Xandrea",
  body:
    "Join a diversified Canadian enterprise where strong leadership, operational excellence, and entrepreneurial vision create real opportunities to grow.", // connective
  features: [
    "Current Opportunities",
    "Online Applications",
    "Employee Benefits",
    "Training Programs",
    "Leadership Development",
    "Career Advancement Pathways",
  ],
  image: ux("1504307651254-35680f356dfd", 1400),
  imageAlt: "Skilled tradespeople building together — a warm, hands-on team at Xandrea Harshey",
};

export const inquiryCategories = [
  "General Inquiries",
  "Construction Projects",
  "Facility Services",
  "Partnership Opportunities",
  "Investor Relations",
  "Media Inquiries",
  "Career Applications",
];

export const contactFeatures = [
  "Online Consultation Booking",
  "Quote Request Forms",
  "Interactive Contact Forms",
  "Live Chat Support",
  "Office Location Map",
];

export const contact = {
  eyebrow: "Contact & Consultation",
  heading: "Let's Build Something Great Together",
  hqHeading: "Corporate Headquarters",
  hq: "Calgary, Alberta, Canada",
  inquiryCategories,
  contactFeatures,
};

export type PremiumFeature = {
  title: string;
  description: string;
  status: "Coming Soon";
};

// Premium features — described as marketing cards; backends stubbed for later.
export const premiumFeatures: PremiumFeature[] = [
  {
    title: "Executive Client Portal",
    description: "Secure access to project documents, reports, and communications.",
    status: "Coming Soon",
  },
  {
    title: "AI Business Assistant",
    description: "24/7 intelligent customer support and inquiry management.",
    status: "Coming Soon",
  },
  {
    title: "Live Quote Request System",
    description: "Instant service estimates and consultation scheduling.",
    status: "Coming Soon",
  },
  {
    title: "Interactive Service Maps",
    description: "Visual representation of service coverage and project locations.",
    status: "Coming Soon",
  },
  {
    title: "Project Tracking Dashboard",
    description: "Real-time project updates, milestones, and reporting.",
    status: "Coming Soon",
  },
  {
    title: "Multi-Language Support",
    description: "English, French, and additional languages for international clients.",
    status: "Coming Soon",
  },
  {
    title: "Digital Resource Center",
    description: "Corporate profiles, brochures, capability statements, and reports.",
    status: "Coming Soon",
  },
  {
    title: "Investor Portal",
    description: "Secure access to partnership and investment resources.",
    status: "Coming Soon",
  },
];

// "Client and partner recognition" marquee — connective placeholders.
export const recognition = [
  "Calgary Chamber of Commerce",
  "WCB Alberta",
  "Canadian Construction Association",
  "BBB Accredited",
  "Alberta Construction Safety",
  "Buildex Canada",
  "Procurement Canada",
  "Global Trade Partners",
];

export const footer = {
  name: "XANDREA HARSHEY SERVICES INC.",
  tagline: "Building Businesses. Creating Opportunities. Delivering Excellence.",
  blurb:
    "A Diversified Canadian Enterprise Focused on Construction, Property Services, Hospitality, International Trade, Entertainment, and Strategic Growth.",
  copyright: "© 2026 Xandrea Harshey Services Inc. All Rights Reserved.",
};
