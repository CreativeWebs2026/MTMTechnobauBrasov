# Design

## Theme

Light-dominant with dark anthracite bands for contrast and drama (hero, stats, testimonials, footer). Not a dark-mode site — daylight, concrete, steel. Cool-neutral base (no cream/beige warmth); the orange accent carries all the "warm energy," never the background.

## Color

OKLCH throughout.

```
--ink-950: oklch(15% 0.012 255);   /* darkest anthracite — footer, deep overlays */
--ink-900: oklch(19% 0.014 255);   /* hero / nav / dark section surface */
--ink-800: oklch(24% 0.015 255);   /* elevated dark cards */
--ink-700: oklch(32% 0.014 255);   /* dark borders, secondary dark surface */
--ink-600: oklch(46% 0.012 255);   /* muted text on light bg */
--ink-500: oklch(58% 0.01 255);
--ink-300: oklch(80% 0.006 255);   /* borders on light bg */
--ink-100: oklch(93% 0.004 255);   /* subtle tint bg on light sections */
--paper:   oklch(98% 0.002 255);   /* light section background — cool near-white, not cream */
--white:   oklch(100% 0 0);

--orange-600: oklch(60% 0.19 42);  /* hover / pressed */
--orange-500: oklch(70% 0.19 45);  /* primary accent — CTAs, active states, icon fills */
--orange-400: oklch(76% 0.15 50);
--orange-100: oklch(94% 0.04 55);  /* accent-soft background tint */

--gold-500: oklch(80% 0.14 87);    /* review stars only — never used as UI accent */
```

Text on `--ink-900` uses `--white` / `oklch(85% 0.006 255)` for secondary — verified ≥4.5:1. Text on `--paper` uses `--ink-900` / `--ink-600` for secondary, never a light gray below 4.5:1. `--orange-500` on dark or light passes for large text/icons only; body copy is never set in orange.

## Typography

- **Display** (`h1`–`h3`, nav brand, stat numbers): Space Grotesk, self-hosted variable (500–700), includes Romanian diacritics (ș ț ă â î) in its own subset. Tight tracking (−0.02em), `text-wrap: balance`.
- **Body**: Manrope, self-hosted variable (400–800). `text-wrap: pretty` on paragraphs, max 70ch.
- Hero H1 clamps at `clamp(2.5rem, 6vw, 4.5rem)` — well under the 6rem ceiling.
- Both families already vendored in `assets/fonts/*.woff2` (latin + latin-ext) from prior work on this project — reuse, don't re-fetch from Google Fonts.

## Layout

- Container max-width 1280px, section vertical rhythm `clamp(4.5rem, 8vw, 8rem)`.
- Alternate light (`--paper`) / dark (`--ink-900`) section backgrounds to create rhythm and let photography breathe: Hero(dark) → About(light) → Services(light, cards) → Why-Us(dark band) → Testimonials(dark) → Gallery(light) → Contact(light) → Footer(dark).
- Services: category cards in `repeat(auto-fit, minmax(320px, 1fr))`, not a fixed 3-column grid, so the 9 categories reflow cleanly at every breakpoint.
- No side-stripe borders, no gradient text, no tiny tracked eyebrows above sections.

## Components

- **Buttons**: pill radius, two variants — solid orange (primary, dark ink text for contrast) and outline white/ink (secondary, "Sună acum"). Scale 1.03 + shadow lift on hover, respects reduced-motion.
- **Cards** (service category, review, gallery): 12px radius, 1px `--ink-100`/`--ink-700` border, hover = translateY(-6px) + soft shadow, no nested cards.
- **Icons**: custom outline SVG set (stroke-based, 24×24, 1.75px stroke, round joins) — one consistent family for category icons, why-us icons, and UI chrome (phone, pin, clock, arrows, socials, close/menu).
- **Nav**: fixed, transparent over hero, gains `--ink-900` background + blur + border once scrolled.

## Motion

- Reveal: IntersectionObserver-driven fade+slide (12–24px), staggered per grid (services, gallery, testimonials), never a uniform identical entrance on every section — hero counters get count-up, why-us icons get a small rotate/pop-in, testimonials use a slider.
- Content is visible by default in markup; the reveal class only adds the *entrance*, so no-JS / reduced-motion / headless renders still show full content.
- Easing: `cubic-bezier(0.16,1,0.3,1)` (ease-out-quart-ish), durations 350–700ms. No bounce/elastic.
- Full `prefers-reduced-motion: reduce` fallback: instant appearance, no parallax, no count-up (numbers render final value immediately).

## Imagery

Real jobsite/architecture photography carries the brand — no icon-illustration hero, no stock-cheerful-team photos. Hero: golden-hour aerial of a near-finished house under construction (from project assets). Gallery: mixed real project photos (foundation, concrete pour, structural framing, finished interiors). Dark gradient overlay (bottom-heavy) under all hero/section text for contrast, never a flat black scrim.
