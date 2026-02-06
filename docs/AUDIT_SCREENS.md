# Screen & code audit — CSS and consistency

**Audit date:** February 2026  
**Scope:** All screens (App, Contact, Privacy, Terms, Partner Sign In, placeholders), shared layout, ErrorBoundary, CSS.

---

## Fixes applied

| Issue | Fix |
|-------|-----|
| **ErrorBoundary had no styles** | Added `.error-boundary`, `.error-boundary-content`, `.error-reset-button`, `.error-details` to `index.css` so the error UI is readable when any route throws (App.css may not be loaded). |
| **Partner Sign In inputs** | `.partner-input` now uses `font-size: max(16px, var(--font-size-base))`, `-webkit-tap-highlight-color: transparent`, and `touch-action: manipulation` for iOS and touch consistency with the waitlist form. |
| **Broken partner links** | "Contact support" on Partner Sign In now links to `/contact`. Added routes for `/partner/forgot-password` and `/partner/signup` (placeholder pages) so "Forgot password?" and "Become a partner" no longer 404. |

---

## Screens checked

- **App.jsx (landing)** — Hero, journey carousel, mission, features carousel, CTA, footer. Uses `headerClass`, conditional nav/backdrop classes, waitlist form with label and `id`. No errors found.
- **Contact, PrivacyPolicy, TermsOfService** — Use `PlaceholderLayout`; consistent `placeholder-text` and `placeholder-title`. No errors.
- **PlaceholderLayout** — Uses `placeholder-page`, `placeholder-header`, `placeholder-main`, `placeholder-title`; all defined in App.css. Back link and logo use React Router `Link`. No errors.
- **PartnerSignIn** — Uses `partner-signin-page`, `partner-header`, `partner-signin-form`, `partner-input`, `partner-label`, `partner-error`, etc. Labels use `htmlFor` and inputs have `id`; aria and error IDs are consistent. No errors.
- **CoverFlowCarousel** — Uses `cover-flow-ipod`, `cover-flow-card-wrap`, `cover-flow-dot`; optional `ariaLabel` and `slideLabel`. No errors.
- **ErrorBoundary** — Uses `error-boundary`, `error-reset-button`, `error-details`; styles now in index.css. No errors.
- **Icons.jsx** — Exports `Icon` with `className` prop; used consistently across App and PartnerSignIn. No errors.

---

## CSS notes (no change required)

- **Dead / legacy CSS:** `.journey-step`, `.journey-steps`, `.step-connector`, `.journey-step-last`, and related rules (e.g. `.journey-step:hover .step-icon`, animation delays for `.journey-step:nth-child`) are left over from the pre-carousel “How it works” grid. They do not match any current DOM (journey section now uses `.journey-card` inside CoverFlowCarousel). They are harmless; you can remove them in a cleanup pass to reduce file size.
- **Design tokens:** `--color-text-primary`, `--safe-*`, `--space-*`, `--border-radius-*`, etc. are used consistently. No conflicting overrides found.
- **Focus and a11y:** `.nav-link:focus`, `.waitlist-button`, `.partner-input:focus`, `.cover-flow-nav:focus-visible`, `.cover-flow-dot:focus-visible` and similar are present. No missing focus styles identified.

---

## Routing summary

| Path | Component / content |
|------|----------------------|
| `/` | App (landing) |
| `/partner` | PartnerSignIn |
| `/partner/signin` | PartnerSignIn |
| `/partner/forgot-password` | PlaceholderLayout "Forgot password" |
| `/partner/signup` | PlaceholderLayout "Become a partner" |
| `/contact` | Contact (PlaceholderLayout) |
| `/privacy-policy` | PrivacyPolicy |
| `/terms-of-service` | TermsOfService |

All partner and placeholder links now resolve to a defined route.

---

## Optional follow-ups

1. **Remove dead journey-step CSS** — Search App.css for `.journey-step`, `.journey-steps`, `.step-connector`, `.journey-step-last` and delete those blocks to trim CSS size.
2. **Partner forgot/signup** — When real flows exist, replace the placeholder routes with dedicated components.
3. **ErrorBoundary copy** — Consider adding a “Go home” link that navigates to `/` (with basename) so users can leave the error screen without a full refresh.

This audit confirms no remaining CSS or code errors or inconsistencies across the screens listed above; the applied fixes address the only issues found.
