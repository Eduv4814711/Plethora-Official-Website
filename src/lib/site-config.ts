export const siteConfig = {
  name: "Plethora",
  legalName: "Plethora (Pty) Ltd",
  registrationNumber: "2026/747460/07",
  registrationDate: "16 September 2026",
  founder: "Aobakwe Dipitso",
  founderRole: "Founder & Active Director",
  bbbeeStatus: "Level 1 B-BBEE Exempted Micro Enterprise (EME) · 100% Black-owned",
  tagline: "AI workforce management software for private security companies.",
  description:
    "Connect guard deployment, rostering, attendance, payroll support, client billing, compliance, and operational workflows in one shared platform built for South African private security companies.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://plethoraqbs.co.za").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@plethoraqbs.co.za",
  appLoginUrl: process.env.NEXT_PUBLIC_APP_LOGIN_URL || "",
  location: "South Africa",
  operatingBaseNote:
    "Deployed internally within the Quick Bopha Security operating environment (88 guards and 103 platform users recorded in the 11 October 2026 operating plan).",
  navigation: [
    { label: "Product", href: "/product" },
    { label: "Solutions", href: "/solutions" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: {
    product: [
      { label: "Platform overview", href: "/product" },
      { label: "Workforce & rostering", href: "/product#rostering" },
      { label: "Attendance & WhatsApp", href: "/product#attendance" },
      { label: "Payroll & billing", href: "/product#payroll" },
      { label: "Staged AI roadmap", href: "/product#ai-roadmap" },
    ],
    solutions: [
      { label: "Operational workflows", href: "/solutions" },
      { label: "Multi-site guard operations", href: "/solutions#multi-site" },
      { label: "Roster-to-payroll chain", href: "/solutions#roster-to-payroll" },
      { label: "Role-based access & audit", href: "/solutions#governance" },
    ],
    company: [
      { label: "About Plethora", href: "/about" },
      { label: "Editorial & insights", href: "/blog" },
      { label: "Request a demo", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;
