/**
 * PORTFOLIO DATA — CENTRAL CONFIG
 * ================================
 * This is the single source of truth for all case studies and interview challenges.
 *
 * HOW TO ADD A NEW CASE STUDY:
 *   1. Append a new object to the CASE_STUDIES array below
 *   2. Copy an existing case-study-X.html, rename it (e.g. case-study-3.html)
 *   3. Edit the <!-- EDIT: --> sections in the new HTML file
 *   4. Done — the card appears on the homepage automatically
 *
 * HOW TO REMOVE A CASE STUDY:
 *   1. Delete (or comment out) its object from the array below
 *   2. The card disappears from the homepage automatically
 *
 * FIELD REFERENCE:
 *   id          — unique slug (used for internal linking, keep lowercase-hyphenated)
 *   type        — "delivery-hero" | "interview-challenge"
 *   title       — card headline
 *   subtitle    — company + domain tag shown below title
 *   summary     — 1–2 sentence description shown on the card
 *   metrics     — array of up to 3 key metric strings shown as badges
 *   tags        — array of skill/domain tags
 *   file        — relative path to the HTML detail page
 *   color       — hex color for the card's top accent bar
 *   featured    — true = shown in "Featured Work" section on homepage
 *   status      — "published" | "coming-soon" (coming-soon shows a placeholder card)
 */

const CASE_STUDIES = [
  // ── DELIVERY HERO CASE STUDIES ──────────────────────────────────────────────

  {
    id: "homogeneous-navigation",
    type: "delivery-hero",
    title: "Homogeneous Category Navigation",
    subtitle: "Delivery Hero · Quick Commerce · Global",
    summary: "Rebuilt category navigation across 7 Quick Commerce platforms to eliminate fragmented browsing experiences. Introduced a standardised tree framework, ran controlled experiments across APAC, MENA, and Europe, and scaled globally.",
    metrics: [">10% Category ATC", "€100M+ GMV", "120k+ partners"],
    tags: ["Consumer Experience", "Global Rollout", "A/B Testing", "Quick Commerce"],
    file: "case-study-1.html",
    color: "#1a3a6b",
    image: "nav_backdrop.png",
    featured: true,
    status: "published"
  },

  {
    id: "ai-categorization",
    type: "delivery-hero",
    title: "AI-Powered Product Categorisation",
    subtitle: "Delivery Hero · ML + LLMs · Ops Automation",
    summary: "Built an automated FE category recommendation system using Gemini LLMs and prototype-based ML to replace manual product tagging across 5 global brands, reducing time-to-market and driving incremental GMV.",
    metrics: [">20% Accuracy", "€10M+ GMV", "2 brands live · 5 planned"],
    tags: ["AI/ML", "LLMs", "Automation", "GTM Strategy"],
    file: "case-study-2.html",
    color: "#0f2351",
    image: "ai_backdrop.svg",
    featured: true,
    status: "published"
  },

  // ── INTERVIEW CHALLENGES ─────────────────────────────────────────────────────

  {
    id: "experimentation-at-scale",
    type: "interview-challenge",
    title: "Experimentation: Building for Impact at Scale",
    subtitle: "Dream11 · Product Strategy",
    summary: "Take-home challenge from a PM interview at a leading sports platform. I designed an end-to-end experimentation platform strategy — from three foundational pillars to a phased NOW/NEXT/LATER roadmap culminating in AI-powered experiment intelligence.",
    metrics: ["3-Pillar Framework", "NOW/NEXT/LATER Roadmap", "AI-Powered Vision"],
    tags: ["Experimentation", "A/B Testing", "Platform Strategy", "Roadmap"],
    file: "interview-challenge-1.html",
    color: "#E1261C",
    image: "exp_backdrop.svg",
    featured: true,
    status: "published"
  },
];

// Do not edit below this line
if (typeof module !== "undefined") module.exports = { CASE_STUDIES };
