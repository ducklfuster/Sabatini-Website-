# Sabatini Pro Painting — SEO & AEO Technical Requirements

For: Claude Code build of the new custom website (no WordPress/plugins)

Context: This site is being built from scratch, so none of the SEO infrastructure that Yoast/RankMath normally provide on WordPress exists by default. Everything below needs to be built into the architecture directly — not bolted on after launch. Read this before scaffolding page templates, since several items (meta tag system, schema, URL structure) shape how templates should be built.

## 1. Sitemap & robots.txt

- Generate an XML sitemap dynamically (not hand-maintained) so it auto-updates when service pages or location pages are added.
- Include robots.txt at the root, referencing the sitemap.
- Every page must be explicitly indexable unless there's a specific reason to noindex it (see Known Issues below — this bit the old site).

## 2. Per-page meta tag system

- Every page needs its own `<title>` and `<meta name="description">` — no site-wide defaults inherited across pages.
- Build this as a config/data field per page (frontmatter, CMS field, or JSON entry), not hardcoded per file, so it's editable without touching markup.
- Title format convention: `Page Topic | Sabatini Pro Painting | [City], PA` (or similar — lock in one convention across all page types before generating location pages at scale).

## 3. Canonical tags

- Every page gets a self-referencing canonical tag by default.
- Location/city pages that share template structure must each get correct, unique canonical URLs — this is the direct fix for the duplicate city-page content issue found in the audit.

## 4. Schema markup (JSON-LD)

Minimum required, built into templates so it auto-populates per page rather than being hand-written each time:

- LocalBusiness schema on homepage/contact page — name, address, phone, hours, service area, geo coordinates.
- Service schema on each service page.
- FAQPage schema wherever FAQ content exists (this also directly feeds AEO — AI answer engines lean on structured FAQ data to decide what to cite/quote).
- BreadcrumbList schema on interior pages once the site has nested structure (service > location, etc.).

## 5. Open Graph / Twitter Card tags

- `og:title`, `og:description`, `og:image`, `og:url` on every page — controls how links look when shared in texts, Facebook, etc.
- Use a real image per page where possible (not one generic site-wide image).

## 6. URL structure

- Clean, semantic, lowercase, hyphenated: `/services/interior-painting`, `/locations/folsom-pa`, not query strings or auto-generated IDs.
- Lock the pattern for service pages and location pages before generating them at scale — changing URL structure later means redirects for every page.

## 7. Image requirements

- Descriptive alt text on every image (not filenames).
- WebP format with compression.
- Lazy loading on below-the-fold images.

## 8. Performance / Core Web Vitals

- This is where a custom build should beat the old WordPress site — no plugin bloat. Keep it that way: minimize JS payload, optimize image delivery, avoid render-blocking scripts.

## 9. NAP consistency (Name, Address, Phone)

- One single source of truth for business name, address, and phone number, referenced everywhere (footer, contact page, schema, GBP-matching format) — not retyped per page. NAP inconsistency was flagged directly in the audit of the current site.

## 10. Known issues from the current site — do NOT rebuild these in

Pulled directly from the SEO/AEO audit of sabatinipropainting.com:

- FAQ page was accidentally noindexed — verify indexability explicitly per page, don't assume default.
- Broken `tel:` links — test click-to-call on every device type.
- NAP inconsistency across pages.
- Duplicate content across city/location pages using the same template — this is why unique canonical tags and genuinely differentiated content per location matter (see hybrid service page template in the build spec).

## 11. Migration: 301 redirect map (do this before launch, not after)

- Build a full map: every old URL → its new equivalent.
- Implement as real 301 redirects (not 302s, not a single blanket redirect to the homepage).
- Keep the old Google Search Console property accessible post-launch to monitor crawl errors.
- Rick: this step needs the current site's full URL list/sitemap as an input — pull that from the current site or GSC before this step.

## 12. Search Console & Analytics hooks

- Build in a clean way to add the GSC verification tag and GA4 tracking snippet without hardcoding into every page template individually (e.g., a shared layout/head component).

---

## Launch-week checklist (for later, keep for reference)

1. Submit new sitemap to Google Search Console.
2. Verify new domain property in GSC.
3. Confirm Google Business Profile still points to the right URL.
4. Spot-check that redirects actually fire in production, not just in code.
5. Monitor rankings/crawl errors for 2–4 weeks — some dip during migration is normal if redirects and schema are solid.
