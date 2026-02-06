# DatingPool.ai — Enterprise Audit & Improvement Plan

**Audit date:** February 2026  
**Scope:** Production site (landing, hero, features, waitlist, GitHub Pages)  
**Standards:** Enterprise-grade; iOS/Android; accessibility (WCAG 2.1); performance; security; SEO.

---

## Overall score: **72 / 100**

Rating is against the highest bar: enterprise marketing site, mobile-first, accessible, fast, and secure. The product is in good shape for an MVP/landing with clear paths to reach 85+.

---

## Button & interaction UX (quick wins) — Applied Feb 2026

Enterprise-style, minimal-but-classy motion and feedback across all controls:

| Control | Change |
|--------|--------|
| **Logo** | Hover scale 1.05 → 1.02; design-token transition. |
| **Mobile menu toggle** | Hover 1.05 → 1.02, active 0.95 → 0.98; hamburger bars use `--duration-fast` + `--ease-in-out-smooth`. |
| **Nav CTA** | Softer hover shadow; active shadow reduced. |
| **Cover-flow prev/next** | Hover scale 1.08 → 1.04, active 0.96 → 0.98; lighter hover bg. |
| **Cover-flow dots** | Hover scale 1.1 → 1.06, active 1.2 → 1.12. |
| **Waitlist button** | Ripple 300px → 180px, opacity 0.2 → 0.12; lift -2px → -1px; arrow 4px → 2px; transition tokens. |
| **Folder items** | Hover translateX 3px → 2px; explicit transition on background + transform. |
| **Cards (Framer)** | whileHover scale 1.02/y -2 → 1.01/y -1; whileTap 0.99 → 0.995. |
| **Waitlist input** | whileFocus 1.02 → 1.01; spring → 0.2s ease. |
| **Global** | Generic `button:active` scale(0.95) removed to avoid overriding specific controls; hover lift in media query set to -1px. |

All transitions use design tokens (`--duration-fast`, `--ease-out-expo`, `--ease-in-out-smooth`) where applicable. Reduced motion and touch layouts unchanged.

---

## 1. Mobile (iOS & Android) — Score: 75/100

### What’s working
- **Viewport:** `viewport-fit=cover`, safe-area insets used in CSS (`--safe-*`).
- **Touch:** `-webkit-overflow-scrolling: touch`, `touch-action: manipulation`, `-webkit-tap-highlight-color` on key controls.
- **Video:** Hero/CTA use `muted`, `playsInline` (iOS autoplay).
- **Touch targets:** Mobile menu toggle and CTA meet ≥44px where required; nav links get adequate padding.
- **Inputs:** Waitlist input uses ≥16px font and touch-friendly styles to avoid iOS zoom and improve tap.
- **Meta:** `theme-color`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `format-detection` added for status bar and link handling.

### Gaps and improvements
| Priority | Item | Action |
|----------|------|--------|
| High | **PWA / Add to Home Screen** | Add `manifest.webmanifest` (name, short_name, theme_color, icons 192/512). Link in `index.html`. |
| High | **Dynamic viewport on mobile** | Use `100dvh` for full-height sections where appropriate (hero already uses `min-height: 100dvh` in places; audit other full-height blocks). |
| Medium | **Orientation / resize** | Handle `orientationchange` and `resize` for hero/carousel so layout doesn’t jump on rotate. |
| Medium | **Overscroll** | Consider `overscroll-behavior: none` on `body` to avoid pull-to-refresh/overscroll on hero. |
| Low | **Haptic (future)** | When adding native or WebView features, consider light haptic on primary actions. |

---

## 2. Accessibility (WCAG 2.1) — Score: 70/100

### What’s working
- **Reduced motion:** `prefers-reduced-motion` respected (animations shortened/disabled, hero transition and loading spinner).
- **Focus:** Visible focus styles (`--shadow-focus`), `:focus-visible` on carousel nav/dots.
- **Semantics:** Landmarks (`header`, `main`, `footer`), `aria-label` on sections and controls, `aria-live` on hero text.
- **Contrast:** Primary text on dark background meets contrast requirements; royal blue hero text should be checked on the actual background (see below).
- **Keyboard:** Focus management on mobile menu open/close; skip link or equivalent should be verified.

### Gaps and improvements
| Priority | Item | Action |
|----------|------|--------|
| High | **Hero text contrast** | Confirm royal blue (#4169E1) on dark overlay meets WCAG AA (4.5:1 for text). If not, lighten or use a lighter blue/white. |
| High | **Focus order and trap** | Ensure modal/mobile menu traps focus and returns focus to trigger on close; test with keyboard only. |
| High | **Form labels** | Waitlist and any other forms: associate visible labels with inputs (or `aria-label`) and surface errors with `aria-describedby` / `aria-invalid`. |
| Medium | **Video** | Hero/CTA videos: ensure no critical info is only in motion; provide pause or text alternative if needed. |
| Medium | **Carousel** | Cover flow: ensure “previous/next” and card count are announced (e.g. `aria-label` on buttons, optional `aria-live` for index). |
| Low | **Reduced motion and video** | Option to disable or shorten hero video for users who prefer reduced motion. |

---

## 3. Performance — Score: 65/100

### What’s working
- **Stack:** Vite, React 18, code-splitting via router.
- **Fonts:** Preconnect to Google Fonts, `display=swap`.
- **Assets:** Images (if any) and structure are suitable for further optimization.

### Gaps and improvements
| Priority | Item | Action |
|----------|------|--------|
| High | **Hero video payload** | Multiple large MP4s (e.g. home, pool, pool2–5) drive most of the weight. Use CDN, compress (e.g. two-pass H.264), and consider poster images + lazy load below-the-fold videos. |
| High | **Lazy load below-fold video** | Journey/CTA/pool videos: use `loading="lazy"` and/or Intersection Observer to load only when near viewport. |
| High | **Bundle size** | Run `vite build --mode analyze` (or similar); trim unused deps (e.g. Lottie if unused), consider lazy-loading Framer Motion for below-fold. |
| Medium | **Caching** | Ensure GitHub Pages / CDN sends long-lived cache headers for hashed JS/CSS and static assets. |
| Medium | **Core Web Vitals** | Measure LCP (hero video/image), INP/CLS (layout shifts from hero text/video). Target LCP <2.5s, CLS <0.1. |
| Low | **Preload LCP asset** | If hero LCP is a single image or one video, add `<link rel="preload">` for it. |

---

## 4. SEO & Shareability — Score: 60/100

### What’s working
- **Basics:** Semantic HTML, single `<h1>`, `lang="en"`, descriptive `<title>`.
- **Meta:** `description` added; suitable for snippets.

### Gaps and improvements
| Priority | Item | Action |
|----------|------|--------|
| High | **Open Graph** | Add `og:title`, `og:description`, `og:image`, `og:url`, `og:type` for link previews (Twitter/Facebook/LinkedIn). |
| High | **Twitter Card** | Add `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. |
| Medium | **Canonical URL** | Set canonical to production URL (e.g. `https://bwilkie91.github.io/DatingPool.ai/` or custom domain). |
| Medium | **Structured data** | Add JSON-LD (Organization, WebSite, maybe LocalBusiness if relevant) for rich results. |
| Low | **Sitemap / robots** | Add `sitemap.xml` and `robots.txt` if you want indexing control. |

---

## 5. Security & Resilience — Score: 78/100

### What’s working
- **Static site:** No server-side user data; GitHub Pages over HTTPS.
- **Forms:** Client-side validation; external form URL (e.g. Google Forms) used for waitlist.
- **Error boundary:** React ErrorBoundary prevents full-app crash.

### Gaps and improvements
| Priority | Item | Action |
|----------|------|--------|
| Medium | **CSP** | Add Content-Security-Policy (e.g. via GitHub Pages or headers) to restrict script/source origins. |
| Medium | **Subresource integrity** | If loading any third-party scripts, use SRI hashes. |
| Low | **Dependencies** | Run `npm audit` regularly; fix high/critical; keep React/Vite and deps updated. |

---

## 6. Code & Maintainability — Score: 74/100

### What’s working
- **Structure:** Clear separation (App, routes, placeholder pages, CoverFlow, Icons).
- **State:** Hero carousel and reduced-motion logic are centralized and readable.
- **CSS:** Design tokens (colors, spacing, motion); responsive breakpoints; safe-area and mobile considerations.

### Gaps and improvements
| Priority | Item | Action |
|----------|------|--------|
| Medium | **Env and config** | Move public URLs (e.g. waitlist form) to env (e.g. `import.meta.env.VITE_WAITLIST_URL`) so they’re configurable per environment. |
| Medium | **Tests** | Add minimal E2E (e.g. Playwright) for: load home, hero plays, waitlist submit path; optional unit tests for hero state. |
| Low | **Types** | Consider TypeScript or JSDoc for props and key functions to reduce regressions. |

---

## 7. Applied Optimizations (This Pass)

- **index.html:** `theme-color`, meta description, `mobile-web-app-capable` (replaced deprecated `apple-mobile-web-app-capable`), `apple-mobile-web-app-status-bar-style`, `format-detection`. OG and Twitter Card meta added.
- **Touch:** Mobile menu toggle given 44×44px minimum and `touch-action: manipulation` / `-webkit-tap-highlight-color: transparent`.
- **Inputs:** Waitlist input `font-size: max(16px, …)`, tap highlight and touch-action for better iOS/Android behavior. Waitlist has visible label, `aria-invalid`, `aria-describedby` for errors.
- **Scrollability:** Carousel viewport uses `touch-action: pan-y` so vertical page scroll works through the carousel; `body.menu-open` uses only `overflow: hidden` (no `position: fixed`) to avoid page getting stuck; App unmount cleanup restores `body` overflow and removes `menu-open` class.

---

## 8. Recommended order of work

1. **Quick wins (1–2 days)**  
   - Open Graph + Twitter meta tags.  
   - Hero text contrast check and fix if needed.  
   - Form labels and error association for waitlist.

2. **High impact (1–2 weeks)**  
   - Web app manifest and PWA basics.  
   - Hero/video optimization (compress, lazy load non-hero videos).  
   - Core Web Vitals measurement and LCP/CLS fixes.

3. **Ongoing**  
   - Dependency and security audits.  
   - Optional: TypeScript/JSDoc, E2E tests, CSP.

---

## Score summary

| Area              | Score | Notes                                      |
|-------------------|-------|--------------------------------------------|
| Mobile (iOS/Android) | 75  | Solid base; PWA and viewport polish will push higher. |
| Accessibility     | 70  | Good reduced-motion and focus; contrast and forms need checks. |
| Performance       | 65  | Dominated by video size and loading strategy. |
| SEO & Share       | 60  | Missing OG/Twitter and structured data.    |
| Security           | 78  | Appropriate for static site; CSP would strengthen. |
| Code & Maintainability | 74 | Clear structure; env and tests would help. |
| **Overall**       | **72** | Strong MVP; roadmap above can reach 85+.   |

This document should be updated after each major release and after addressing the high-priority items above.
