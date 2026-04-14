# Skena Coffee

Skena Coffee is a design-led cafe website built as a premium editorial experience rather than a conventional product landing page. It treats coffee not as inventory, but as culture: slow ritual, material warmth, and spatial composition translated into an interactive front-end.

The project is guided by a **Modern Heritage** philosophy and the creative north star of **The Artisanal Architect**. That means warm Indonesian coffee references expressed through precise typography, asymmetrical composition, tonal depth, and motion that feels deliberate instead of decorative.

This is also an intentionally experimental build. Skena Coffee pushes both visual and technical boundaries: custom text-flow layouts, sculpted image framing, gesture-driven interactions, and section transitions designed to feel closer to a monograph than a typical cafe site.

## Project Overview

Skena Coffee explores what happens when an artisanal brand is translated through an editorial, architecture-informed digital system.

- **Modern Heritage:** warm, tactile palettes and Indonesian coffee storytelling paired with sharp, contemporary structure.
- **Artisanal Architect:** a design language that balances organic masking, slow rhythm, and disciplined geometry.
- **Experimental by design:** this repo is a creative prototype as much as a product surface, using code to test ambitious layout and interaction ideas.

## Tech Stack

### React + Vite
Chosen for a fast modern front-end foundation, clean component composition, and a development loop that stays frictionless while exploring interaction-heavy UI.

### Tailwind CSS
Used for rapid visual iteration and tight control over spacing, typography, and responsive composition without fighting a heavy CSS architecture.

### Framer Motion
Powers the cinematic layer of the site: scroll transforms, card throw animations, accordion transitions, image drift, and subtle micro-staging throughout the experience.

### @chenglou/pretext
Used to compute text layout with far more control than normal browser flow. It enables routed editorial copy, obstacle-aware pull quotes, and measured content blocks that feel composed rather than merely rendered.

## Design System

The design rules originate from [`context/DESIGN.md`](../context/DESIGN.md) and are implemented as a tonal, editorial system rather than a UI kit.

### Core Rules

- **Intentional asymmetry:** layouts should breathe and avoid rigid symmetrical grids.
- **Whitespace as material:** spacing is used to create pause, rhythm, and separation.
- **Organic versus geometric:** soft image masks and floating forms are set against sharp typographic structure.
- **Editorial tension:** oversized serif headlines are paired with restrained sans-serif utility text.

### Color Palette

- **Surface:** `#fff9ee` for the primary canvas.
- **Surface low:** `#f9f3e8` for section shifts and quieter tonal transitions.
- **Surface container:** `#f3ede2` for secondary blocks and soft callouts.
- **Surface high:** `#ede8dd` for nested tonal depth.
- **Primary / Espresso:** `#0b0300` for headlines, anchors, and high-contrast actions.
- **Primary container / Roasted:** `#2b1a0e` for deep gradients and CTA richness.
- **On surface:** `#1d1c15` for readable body text with warmth instead of pure black.
- **Outline variant:** `#d2c4bc` for the faintest possible structural strokes when absolutely necessary.

### Typography

- **Newsreader:** the heritage voice. Used for display moments, pull quotes, prices, and section headlines.
- **Plus Jakarta Sans:** the modern counterweight. Used for body copy, labels, controls, and navigation.

This pairing is central to the brand: serif for atmosphere, sans-serif for control.

### The No-Line Rule

Hard dividers are avoided wherever possible. Sections are separated through color shifts, negative space, and tonal contrast rather than obvious rules or frames.

### Tonal Layering

Depth is created through stacked surfaces and soft ambient shadows, not heavy UI chrome. Cards sit on warmer adjacent tones, overlays use frosted translucency, and hierarchy is felt through layering instead of decoration.

## Component Structure

### Core Composition

- `App.jsx` - Composes the full page sequence from navigation to footer.
- `Navbar.jsx` - Sticky frosted navigation with smooth-scroll section jumps and a morphing mobile menu toggle.
- `Hero.jsx` - Four-part cinematic opening with scroll-driven image zoom, staged overlay gradients, and section counters.
- `MenuHighlights.jsx` - The project's main interactive showcase: category switching, swipe/drag/wheel deck cycling, hover fan-out, card flip behavior, and daily recommendation logic.
- `About.jsx` - Editorial story section with draggable floating coffee beans and custom text routed around moving obstacles.
- `BrewGuide.jsx` - Accordion-style brewing ritual sequence with measured expansion and restrained reveal motion.
- `PullQuote.jsx` - Large-format editorial quote that wraps around an image obstacle using computed line placement.
- `LocationHours.jsx` - Flagship location and service-hours panel using tonal contrast and masked imagery.
- `Footer.jsx` - Closing brand block with restrained utility links, newsletter input, and a monumental background wordmark.

### Supporting Components

- `CategoryToggleRail.jsx` - Animated segmented category rail with centered active pill and touch swipe support.
- `MenuDeckCard.jsx` - Motion-enabled menu card shell that handles drag, throw trajectories, wheel interaction, and flip states.
- `MenuCardFace.jsx` - Front face of each menu card with price, profile, description, and recommendation badge slot.
- `MenuPreviewImage.jsx` - Staged preview image with a subtle settle animation whenever the featured menu item changes.
- `RecommendedBadge.jsx` - Organic badge treatment that marks the daily highlighted item with a short entrance/exit motion.

### Layout and Interaction Hooks

- `useAboutOrbLayout.js` - Routes paragraph lines around moving bean overlaps.
- `useBrewGuidePretext.js` - Measures accordion body height and text width for composed expansion.
- `useMenuHighlightLayout.js` - Finds tight text widths for menu descriptions so cards stay balanced.
- `usePullQuoteLayout.js` - Splits pull-quote lines around a visual obstacle.
- `usePretext.js` - General-purpose measured text hook for width and line-count control.
- `useDeviceType.js` - Detects touch-style devices via media query.

## Getting Started

### Prerequisites

- Node.js `18+` recommended
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
skena-cofee/
|-- public/
|   |-- assets/images/        # Public image assets
|   |-- favicon.svg           # Browser icon
|   `-- icons.svg             # Shared SVG sprite/icons
|-- src/
|   |-- assets/
|   |   |-- hero.png          # Hero-related artwork
|   |   `-- images/           # Menu, coffee, and location imagery
|   |-- components/           # Page sections and supporting UI components
|   |-- data/
|   |   `-- menuItems.js      # Category and menu content model
|   |-- hooks/                # Layout measurement and interaction hooks
|   |-- lib/
|   |   `-- pretext-helpers.js # Thin wrapper around @chenglou/pretext
|   |-- App.jsx               # Root page composition
|   |-- index.css             # Global tokens, fonts, utilities, masks
|   `-- main.jsx              # React entry point
|-- index.html               # Vite HTML shell
|-- package.json             # Scripts and dependencies
|-- tailwind.config.js       # Tailwind configuration
`-- vite.config.js           # Vite configuration
```

## Notes

Skena Coffee is not trying to look safe, neutral, or template-driven. It is a premium front-end study in editorial coffee branding, spatial rhythm, and crafted interaction.
