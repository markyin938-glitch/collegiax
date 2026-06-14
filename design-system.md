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

The aesthetic is **Modern Minimalist with a focus on Tonal Layering**. It draws inspiration from the organized density of Discord and the clean, block-based clarity of Notion. The UI should evoke a sense of calm intelligence, utilizing expansive whitespace, precise 1px borders, and a sophisticated cool-toned palette to reduce cognitive load during complex tasks.

## Colors

The palette is built on a foundation of ice and frost tones to create a refreshing, low-glare environment.

- **Primary (Denim):** Reserved for primary calls to action and high-priority interactive states.
- **Surface Strategy:** Use `surface` for the global application background and `surface-container-low` for persistent sidebars or secondary panels to create structural depth without heavy shadows.
- **Typography:** Use `on-background` for high-level hierarchy and `on-surface-variant` for softer body copy in dense academic views.

### Core Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `primary` | `#2a6089` | Primary buttons, key actions |
| `secondary` | `#326383` | Active states, supporting actions |
| `tertiary` | `#4c5e71` | Data accents, neutral emphasis |
| `background` | `#f7fafd` | App background |
| `surface-container-lowest` | `#ffffff` | Cards and primary panels |
| `surface-container-low` | `#f1f4f7` | Sidebars and secondary panels |
| `outline` | `#72787f` | Standard borders |
| `outline-variant` | `#c1c7cf` | Subtle separators |
| `error` | `#ba1a1a` | Error states |

### Full Color Tokens

#### Surface Tokens

| Token | Hex |
| --- | --- |
| `surface` | `#f7fafd` |
| `surface-dim` | `#d7dadd` |
| `surface-bright` | `#f7fafd` |
| `surface-container-lowest` | `#ffffff` |
| `surface-container-low` | `#f1f4f7` |
| `surface-container` | `#ebeef1` |
| `surface-container-high` | `#e5e8eb` |
| `surface-container-highest` | `#e0e3e6` |
| `surface-variant` | `#e0e3e6` |
| `surface-tint` | `#2d628b` |
| `background` | `#f7fafd` |

#### Text and Inverse Tokens

| Token | Hex |
| --- | --- |
| `on-surface` | `#181c1e` |
| `on-surface-variant` | `#41474e` |
| `on-background` | `#181c1e` |
| `inverse-surface` | `#2d3133` |
| `inverse-on-surface` | `#eef1f4` |

#### Brand and Interaction Tokens

| Token | Hex |
| --- | --- |
| `primary` | `#2a6089` |
| `on-primary` | `#ffffff` |
| `primary-container` | `#4679a3` |
| `on-primary-container` | `#fdfcff` |
| `inverse-primary` | `#9accfa` |
| `primary-fixed` | `#cde5ff` |
| `primary-fixed-dim` | `#9accfa` |
| `on-primary-fixed` | `#001d32` |
| `on-primary-fixed-variant` | `#0a4a72` |
| `secondary` | `#326383` |
| `on-secondary` | `#ffffff` |
| `secondary-container` | `#aadaff` |
| `on-secondary-container` | `#2e6080` |
| `secondary-fixed` | `#c9e6ff` |
| `secondary-fixed-dim` | `#9cccf1` |
| `on-secondary-fixed` | `#001e2f` |
| `on-secondary-fixed-variant` | `#134b6a` |
| `tertiary` | `#4c5e71` |
| `on-tertiary` | `#ffffff` |
| `tertiary-container` | `#64768a` |
| `on-tertiary-container` | `#fdfcff` |
| `tertiary-fixed` | `#d1e4fb` |
| `tertiary-fixed-dim` | `#b5c8df` |
| `on-tertiary-fixed` | `#091d2e` |
| `on-tertiary-fixed-variant` | `#36485b` |

#### Status Tokens

| Token | Hex |
| --- | --- |
| `error` | `#ba1a1a` |
| `on-error` | `#ffffff` |
| `error-container` | `#ffdad6` |
| `on-error-container` | `#93000a` |

## Typography

The system uses **Syne** for headings to inject a futuristic, academic-forward personality. Its geometry gives the interface distinction without feeling ornamental. For functional UI text and long-form reading, **DM Sans** provides a neutral, highly legible base across dashboards, forms, and dense data views.

- Use `label-sm` in uppercase for sidebar section labels, small metadata tags, and compact system labels.
- Keep line lengths moderate for reading-heavy screens such as collaboration, messages, and admin views.
- Favor strong heading contrast with restrained body styling to preserve a calm, research-oriented tone.

### Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing |
| --- | --- | --- | --- | --- | --- |
| `h1` | `Syne` | `40px` | `700` | `1.2` | `-0.02em` |
| `h1-mobile` | `Syne` | `32px` | `700` | `1.2` | `0` |
| `h2` | `Syne` | `32px` | `600` | `1.3` | `0` |
| `h3` | `Syne` | `24px` | `600` | `1.4` | `0` |
| `body-lg` | `DM Sans` | `18px` | `400` | `1.6` | `0` |
| `body-md` | `DM Sans` | `16px` | `400` | `1.6` | `0` |
| `label-md` | `DM Sans` | `14px` | `500` | `1.4` | `0.01em` |
| `label-sm` | `DM Sans` | `12px` | `600` | `1.2` | `0.03em` |

## Layout & Spacing

This design system uses a **Fixed Grid** approach for dashboard content to preserve a scholarly, organized feel while staying responsive enough for student workflows.

- **Desktop:** 12-column grid with a `1200px` max content width and `24px` gutters.
- **Sidebars:** Fixed at `280px` to support deep navigation and role-based information density.
- **Spacing Rhythm:** Follow a 4px baseline. Use `lg` (`24px`) as the default interior padding for most cards and sections.
- **Mobile Reflow:** Collapse to a single-column layout with `16px` side margins and maintain breathing room around high-priority actions.

### Spacing Tokens

| Token | Value |
| --- | --- |
| `base` | `4px` |
| `xs` | `8px` |
| `sm` | `12px` |
| `md` | `16px` |
| `lg` | `24px` |
| `xl` | `32px` |
| `xxl` | `48px` |
| `gutter` | `24px` |
| `margin` | `32px` |

## Elevation & Depth

Depth is communicated through **Tonal Layering and 1px Borders** rather than heavy drop shadows.

- **Level 0 (Background):** `background (#f7fafd)`.
- **Level 1 (Sidebars/Panels):** `surface-container-low (#f1f4f7)` with a 1px border using `outline-variant`.
- **Level 2 (Main Content Cards):** `surface-container-lowest (#ffffff)` with a 1px `outline-variant` border.
- **Level 3 (Popups/Modals):** `surface-container-lowest (#ffffff)` with a soft shadow such as `0 12px 24px rgba(44, 62, 80, 0.08)`.

The hierarchy should feel calm and structured, never flashy. Borders do most of the organizational work.

## Shapes

The system uses softened geometry rather than brutal sharp corners.

- **Standard Cards and Containers:** `rounded-lg` (`16px`).
- **Large Layout Containers:** `rounded-xl` (`24px`).
- **Buttons and Inputs:** `rounded-md` (`12px`) to keep controls crisp inside softer layouts.
- **Pills and Badges:** Use `rounded-full` only when the component is intentionally token-like or status-oriented.

### Radius Tokens

| Token | Value |
| --- | --- |
| `sm` | `0.25rem` |
| `DEFAULT` | `0.5rem` |
| `md` | `0.75rem` |
| `lg` | `1rem` |
| `xl` | `1.5rem` |
| `full` | `9999px` |

## Components

- **Buttons:** Primary buttons use `primary` with white text. Secondary buttons use light neutral surfaces with darker text. Add a subtle 1px inset top border to create a tactile, crafted feel.
- **Inputs:** Use white backgrounds with a 1px `outline-variant` border. On focus, shift the border to `primary` and add a soft outer glow.
- **Chips and Tags:** Use muted cool backgrounds with darker blue-gray text and restrained rounding.
- **Cards:** Use white surfaces, 1px borders, and `16px` to `24px` internal padding depending on density.
- **Navigation:** Active sidebar states should use a left-aligned visual indicator paired with stronger text contrast.
- **Data Visualization:** Favor monochromatic and adjacent cool-tone palettes derived from `primary`, `secondary`, and `tertiary`.

## Implementation Notes

- Prefer tonal separation before introducing stronger borders or shadows.
- Keep role-specific accents subtle so the interface still feels like one unified system.
- When in doubt, choose clarity and reading comfort over visual novelty.
