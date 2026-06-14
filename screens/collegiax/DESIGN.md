---
name: CollegiaX
colors:
  surface: '#f7fafd'
  surface-dim: '#d7dadd'
  surface-bright: '#f7fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f7'
  surface-container: '#ebeef1'
  surface-container-high: '#e5e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#181c1e'
  on-surface-variant: '#41474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f4'
  outline: '#72787f'
  outline-variant: '#c1c7cf'
  surface-tint: '#2d628b'
  primary: '#2a6089'
  on-primary: '#ffffff'
  primary-container: '#4679a3'
  on-primary-container: '#fdfcff'
  inverse-primary: '#9accfa'
  secondary: '#326383'
  on-secondary: '#ffffff'
  secondary-container: '#aadaff'
  on-secondary-container: '#2e6080'
  tertiary: '#4c5e71'
  on-tertiary: '#ffffff'
  tertiary-container: '#64768a'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cde5ff'
  primary-fixed-dim: '#9accfa'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#0a4a72'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#9cccf1'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#134b6a'
  tertiary-fixed: '#d1e4fb'
  tertiary-fixed-dim: '#b5c8df'
  on-tertiary-fixed: '#091d2e'
  on-tertiary-fixed-variant: '#36485b'
  background: '#f7fafd'
  on-background: '#181c1e'
  surface-variant: '#e0e3e6'
typography:
  h1:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system embodies a premium academic SaaS environment that balances the rigor of research with the fluidity of modern collaboration. It targets students, researchers, and institutional administrators who require a focused, "deep work" atmosphere. 

The aesthetic is **Modern Minimalist with a focus on Tonal Layering**. It draws inspiration from the organized density of Discord and the clean, block-based clarity of Notion. The UI should evoke a sense of calm intelligence—utilizing expansive whitespace, precise 1px borders, and a sophisticated cool-toned palette to reduce cognitive load during complex tasks.

## Colors
The palette is built on a foundation of "Ice" and "Frost" tones to create a refreshing, low-glare environment. 
- **Primary (Denim):** Reserved for primary call-to-actions and interactive states.
- **Surface Strategy:** Use `Ice` for the global application background and `Frost` for persistent sidebars or secondary panels to create structural depth without heavy shadows.
- **Typography:** `Midnight Blue` is strictly for high-level hierarchy (Headings), while `Slate` provides a softer, more readable contrast for body copy and long-form academic text.

## Typography
The system uses **Syne** for headings to inject a futuristic, academic-forward personality. Its unique geometry stands out in large formats. For all functional text and long-form reading, **DM Sans** provides an understated, geometric clarity that ensures legibility across dense data views. Use `label-sm` in uppercase for section headers within sidebars or small metadata tags.

## Layout & Spacing
This design system utilizes a **Fixed Grid** approach for dashboard content to maintain a scholarly, organized feel. 
- **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
- **Sidebars:** Fixed at 280px to allow for deep nested navigation.
- **Spacing Rhythm:** Use a 4px baseline. Components should primarily use `lg` (24px) padding to ensure the "large whitespace" requirement of the brand. Reflow logic for mobile transitions to a single column with 16px side margins.

## Elevation & Depth
Depth is communicated through **Tonal Layering and 1px Borders** rather than heavy drop shadows. 
- **Level 0 (Background):** `Ice (#F4F7FA)`.
- **Level 1 (Sidebars/Panels):** `Frost (#EEF3F8)` with a 1px right-border of `Steel Mist`.
- **Level 2 (Main Content Cards):** `Pure White (#FFFFFF)` with a 1px border of `Steel Mist`.
- **Level 3 (Popups/Modals):** `Pure White` with a very soft, diffused shadow (0px 12px 24px rgba(44, 62, 80, 0.08)).

## Shapes
In alignment with the modern SaaS aesthetic, the system uses generous rounding. 
- **Standard Cards/Containers:** 16px (`rounded-lg`).
- **Large Layout Containers:** 24px (`rounded-xl`).
- **Interactive Elements:** Buttons and Input fields use 8px (`rounded-md`) to maintain a professional edge amidst the softer layout containers.

## Components
- **Buttons:** Primary buttons use `Denim` with white text. Secondary buttons use `Silver Mist` background with `Slate` text. All buttons feature a subtle 1px inset top border for a "tactile" feel.
- **Inputs:** Use `Pure White` backgrounds with a `Steel Mist` 1px border. On focus, the border transitions to `Denim` with a 3px soft outer glow.
- **Chips/Tags:** Use `Silver Mist` backgrounds with `Steel Blue` text, utilizing a 4px border radius.
- **Cards:** White surfaces, 1px `Steel Mist` border, 16px-24px internal padding.
- **Navigation:** Active states in the sidebar should use a `Steel Blue` vertical pill indicator on the left side of the menu item, with the text shifting to `Midnight Blue`.
- **Data Visualization:** Use a palette derived from `Denim` and `Steel Blue`, utilizing monochromatic gradients to keep charts professional and integrated.