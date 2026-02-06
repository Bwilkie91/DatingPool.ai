# DatingPool.ai — Enterprise Audit & Improvement Plan

**Audit date:** February 2026  
**Scope:** Production site (landing, hero, features, waitlist, GitHub Pages)  
**Standards:** Enterprise-grade; iOS/Android; accessibility (WCAG 2.1); performance; security; SEO.

---

## Overall score: **72 / 100**

Rating is against the highest bar: enterprise marketing site, mobile-first, accessible, fast, and secure. The product is in good shape for an MVP/landing with clear paths to reach 85+.

---

## Idea, theme & visuals rating (highest standards) — **77 / 100**

Rated 1–100 against top-tier consumer/marketing sites (concept clarity, brand coherence, art direction, polish).

| Pillar | Score | Notes |
|--------|-------|------|
| **Idea** | **82** | Strong, clear differentiator: event-first dating (“find something to do, then someone to do it with”). Chicago event copy and rotating “how we met” phrases are distinctive and shareable. Problem/solution (old way vs DatingPool way) and mission copy land well. Missing: social proof, real waitlist URL, stronger proof of traction. |
| **Theme** | **78** | Brand is coherent: DatingPool name, “pool” metaphor, “Real dates. Real people. Real places.” Tone is confident, warm, slightly witty. Single font (Outfit) and consistent voice. Could be bolder or more memorable (e.g. stronger tagline, more personality in nav/CTAs). |
| **Visuals** | **74** | Design system is professional: full tokens (color, space, motion, radius), dark slate + blue primary. Hero (video, phased copy, particles, parallax) is ambitious; section video backgrounds create immersion. How it works step cards have clear color coding; Features carousel has grey treatment. Motion is minimal and respects reduced motion. Gaps: no custom illustration or hero imagery; heavy video reliance; hero text contrast to confirm; no dedicated OG image. |

**Overall (weighted:** Idea 30%, Theme 25%, Visuals 45%): **77 / 100**

**To reach 85+:** Add social proof or early-access story; introduce one hero asset (illustration or key visual) beyond video; lock hero text contrast and add `og:image`; consider a bolder typographic or color moment for the hero.

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

## iPhone / mobile responsiveness & scroll (Feb 2026)

**Issue:** On iPhone 13 (and similar devices) the site was jerky and not flowing properly during scroll.

**Research:** iOS Safari scroll jank is often caused by (1) animating non-compositor properties (e.g. `width`) during scroll, (2) too many compositor layers from `will-change`, (3) undefined or conflicting scroll container (html/body), (4) rubber-band overscroll fighting with in-page scroll, (5) heavy DOM (e.g. many particles) on small viewports.

**Fixes applied:**
- **Scroll progress bar:** Switched from animating `width` to `transform: scaleX(progress)` so updates are compositor-only and don’t trigger layout; added `width: 100%` and `transform-origin: left` with a short linear transition.
- **Reduce compositor layers on mobile:** For viewports ≤768px, `.animate-on-scroll` no longer uses `will-change: transform, opacity`, avoiding excess GPU layers that can cause jank on iPhone.
- **Stable scroll container:** `html` and `body` both use `min-height: 100%`; `html` keeps `overflow-y: scroll` and `-webkit-overflow-scrolling: touch`. Body uses `overscroll-behavior-y: contain` so scroll is contained and rubber-band at document edges is reduced (smoother flow).
- **Fewer particles on mobile:** Particle count is 10 on viewports ≤768px (vs 30 on desktop) to reduce paint and compositing work during scroll.
- **Hero video wrap:** `contain: layout` on `.hero-video-wrap` so the hero’s layout is contained and doesn’t affect outside reflow.

Scroll listener already used `{ passive: true }` and `requestAnimationFrame` throttling; no change there. These updates improve scroll and responsiveness across devices, especially iPhone.

---

## Status bar & dynamic viewport (Feb 2026)

**Goal:** Reliable layout on iOS/Android when the status bar and browser UI show/hide on scroll; no content under the notch; no jump when the dynamic viewport changes.

**Changes:**
- **Scroll progress bar:** Positioned below the status bar with `top: var(--safe-top)` so the bar is never under the notch/status bar when scrolling.
- **Loading screen:** Uses `min-height: 100dvh` / `height: 100dvh` (with `100vh` fallback) and `padding-top: var(--safe-top)` so it fills the dynamic viewport and content stays in the safe area.
- **Full-height sections:** `.App`, hero, placeholder pages, partner sign-in, journey, CTA, mobile nav, and error boundary now use `100dvh` (with `100vh` fallback) where they use full viewport height, so iOS Safari’s collapsing toolbar doesn’t cause layout jumps.
- **Header** was already using `padding-top: max(var(--safe-top), ...)` and safe left/right; no change.

**Recommendation:** Keep `viewport-fit=cover` in `index.html` and use `env(safe-area-inset-*)` (or `--safe-*`) for any new fixed/sticky UI.

---

## Animations on iOS/Android (Feb 2026)

**Guideline:** For 60fps on mobile, prefer animating only **transform** and **opacity** (compositor-only). Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding` in hot paths (e.g. during scroll).

**Current state:**
- **Scroll progress bar:** Uses `transform: scaleX(progress)` (compositor-only). ✓
- **Scroll-triggered keyframes:** `slide-up`, `slide-down`, `fade-in`, particle/ripple/glow keyframes use `transform` and/or `opacity`. ✓
- **Transitions that affect layout:** Header uses `transition` on `padding` and `background` (on scroll class); mobile nav uses `transition: right`; a few UI elements use `transition: width` or `width/height`. These are not on the scroll path (they’re on class/open state changes), so acceptable. For new animations, prefer `transform`/`opacity` where possible.

---

## Scroll not working on MacBook / Android (Feb 2026)

**Symptom:** Page scrolled on iOS but not on MacBook (trackpad/wheel) or Android (touch).

**Cause:** (1) Setting `overflow-y: auto` on `html` and `body` made the body a scroll container; with `min-height: 100%` the body expanded with content so some browsers did not show a scrollbar or register wheel/touch as document scroll. (2) When the menu closed, JS set `document.body.style.overflow = 'auto'`, which kept body as the scroll container and could behave differently across Chrome/Safari/desktop.

**Fix:** (1) **CSS:** Removed `overflow-y: auto` from `html` and `body`; use only `overflow-x: hidden` so the **viewport** scrolls the document (native behavior). Added `height: auto` and kept `min-height: 100%` so the document grows. (2) **JS:** When the menu is closed, set `document.body.style.overflow = ''` (clear inline) instead of `'auto'`, so no forced scroll container; when the menu is open, set `'hidden'` to lock. (3) Kept `touch-action: pan-y` on main and sections for touch devices; desktop wheel is unaffected.

---

## Scroll lock fix (Feb 2026)

**Issue:** Page scrolled initially on load then stopped (mouse wheel, trackpad, touch); no console errors.

**Cause:** (1) In some browsers, `overflow-x: hidden` on `html`/`body` without explicit `overflow-y` can block vertical scroll. (2) **Main cause:** Multiple effects and handlers were toggling `document.body.style.overflow` and `menu-open`; effect order and cleanup could leave body stuck with `overflow: hidden` after re-renders (e.g. when loading finished or other state updated).

**Fix applied:**
- **Single source of truth:** One `useLayoutEffect` with dependency `[isMobileMenuOpen]` is the only code that sets body overflow and `menu-open`. When menu is closed we set `overflow: 'auto'`; when open we set `overflow: 'hidden'`. Cleanup always restores `'auto'`. So every commit re-syncs body to state and scroll cannot get stuck.
- **Menu effect:** Only adds/removes click-outside and Escape listeners; no longer touches body. Handlers only call `setIsMobileMenuOpen(false)` and focus; layout effect handles unlock.
- **scrollToSection / toggleMobileMenu:** No longer set body overflow or class; they only update state and focus.
- **CSS:** `overflow-y: auto` on `html` and `body` so vertical scroll is explicitly allowed.

---

## 1. Mobile (iOS & Android) — Score: 75/100

### What’s working
- **Viewport:** `viewport-fit=cover`, safe-area insets used in CSS (`--safe-*`).
- **Touch:** `-webkit-overflow-scrolling: touch`, `touch-action: manipulation`, `-webkit-tap-highlight-color` on key controls.
- **Video:** Hero/CTA use `muted`, `playsInline` (iOS autoplay).
- **Touch targets (Feb 2026):** All primary controls meet ≥44×44px (WCAG 2.5 / iOS HIG): skip link, logo button, nav links, mobile menu toggle, waitlist button & input, folder items, footer link; cover-flow prev/next 52px, dots 48px. `touch-action: manipulation` and tap-highlight on interactive elements.
- **Inputs:** Waitlist input uses ≥16px font, min-height 44px, and touch-friendly styles to avoid iOS zoom and improve tap.
- **Meta:** `theme-color`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `format-detection` added for status bar and link handling.

### Gaps and improvements
| Priority | Item | Action |
|----------|------|--------|
| High | **PWA / Add to Home Screen** | Add `manifest.webmanifest` (name, short_name, theme_color, icons 192/512). Link in `index.html`. |
| ~~High~~ Done | **Dynamic viewport on mobile** | Applied Feb 2026: loading screen, .App, hero, placeholder/partner pages, journey, CTA, mobile nav, error boundary use `100dvh` with `100vh` fallback; scroll progress bar uses `top: var(--safe-top)`. |
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
| ~~High~~ Done | **Lazy load below-fold video** | Applied Feb 2026: Journey, Mission, CTA, Features videos use `useInView` (or equivalent) and `preload="none"`; only hero preloads. |
| ~~High~~ Done | **Bundle size** | Applied Feb 2026: Removed unused Lottie; route-level lazy loading; manualChunks for vendor caching. |
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
| ~~High~~ Done | **Open Graph** | Applied Feb 2026: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` in index.html (og:image uses vite.svg until dedicated asset). |
| ~~High~~ Done | **Twitter Card** | Applied Feb 2026: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. |
| ~~Medium~~ Done | **Canonical URL** | Applied Feb 2026: `<link rel="canonical">` to production URL in index.html. |
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
| ~~Medium~~ Done | **Env and config** | Applied Feb 2026: Waitlist URL from `VITE_WAITLIST_URL`; `.env.example` added. |
| Medium | **Tests** | Add minimal E2E (e.g. Playwright) for: load home, hero plays, waitlist submit path; optional unit tests for hero state. |
| Low | **Types** | Consider TypeScript or JSDoc for props and key functions to reduce regressions. |

---

## Enterprise behavior & build pass (Feb 2026)

**Scope:** Stack (Vite 5, React 18, Framer Motion, React Router), functionality (hero, waitlist, videos, routes), and enterprise behaviors (config, resilience, performance, SEO).

**Research:** (1) **Vite:** `manualChunks` splits vendor code for better caching; route-level `React.lazy` + `Suspense` reduces initial JS. (2) **Video:** Below-the-fold videos should use Intersection Observer and `preload="none"`; only hero should preload. (3) **Env:** `import.meta.env.VITE_*` for config; `import.meta.env.DEV` in Vite (not `process.env.NODE_ENV`) for conditional UI. (4) **SEO:** Canonical, `og:url`, `og:image` (and `twitter:image`) improve sharing and indexing.

**Changes applied:**

| Area | Change |
|------|--------|
| **Config** | Waitlist URL from `import.meta.env.VITE_WAITLIST_URL` with fallback; `.env.example` added. |
| **Resilience** | ErrorBoundary uses `import.meta.env.DEV` for dev-only error details (Vite-compatible). |
| **Video** | Mission and CTA section videos lazy-load: `useInView` + `src` only when in view, `preload="none"`. Journey and Features already lazy-load. |
| **Code splitting** | Non-home routes lazy-loaded: PartnerSignIn, Contact, PrivacyPolicy, TermsOfService, PlaceholderLayout via `React.lazy()` and `<Suspense>` with a small loading fallback. |
| **Build** | Vite `build.rollupOptions.output.manualChunks`: react, react-dom, framer-motion, router, intersection-observer; `target: 'es2020'`, hashed asset names. |
| **Bundle** | Removed unused `lottie-react` dependency. |
| **SEO** | `index.html`: canonical URL, `og:url`, `og:image` and `twitter:image` (vite.svg placeholder until dedicated OG image exists). |

**Recommendations still open:** Replace `og:image`/twitter image with a dedicated 1200×630 asset when ready; add PWA manifest; consider CSP; run `npm audit` and E2E for critical paths.

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
