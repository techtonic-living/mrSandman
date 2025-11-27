---

# 🎨 **Sandman Design System — Foundations Workbench**

### *Documentation (Markdown)*

*File: `/docs/devdocs/features/foundations-workbench.md`*

---

## # Overview

The **Sandman Foundations Workbench** is an internal tool for creating, editing, and visualizing all design primitives used throughout the system.
It organizes core primitives into three structured domains:

- **Colors**
- **Typography**
- **Sizing**

Each domain includes creation tools, editors, ramp generators, semantic mapping surfaces, and variable-binding interfaces.

The goal:
**Provide a single cockpit for all tokens and foundational design logic.**

---

# ## 1. Colors

Colors are structured into three layers:

1. **Primitives** — atomic colors defined by numeric or hue-based origin values.
2. **Ramps** — full 050–950 scales derived from primitives using LCH/OKLCH interpolation.
3. **Semantic Tokens** — functional UI assignments (background, text, border, accents).

---

## ### 1.1 Color Primitives

Color primitives represent raw, unopinionated values.
They serve as the seeds for ramps and semantic roles.

**Properties**

- Name (slug): `color.teal.base`
- Formats: HEX, LCH, OKLCH
- Hue Family Tag (e.g., teal, amber, violet)
- Preview (light/dark modes)
- WCAG Contrast Metrics
- Variable Binding

**User Interface**

- Left: scrollable list of primitives
- Right: editor panel with:
  - Color input
  - LCH numeric fields
  - Light/Dark preview tiles
  - Variable assignment controls
  - Notes/metadata

---

## ### 1.2 Hue Ramps

Ramps define the full tonal range for each hue family using controlled LCH interpolation.

### **Ramp Steps**

`050, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`

### **Ramp Methods**

- **Smooth LCH**
- **Hard-Contrast**
- **UI-Friendly** (more middle contrast)
- **Vivid**

### **Editor Controls**

- Base color selector
- Ramp method dropdown
- Keypoint controls for:
  - Lightness (L)
  - Chroma (C)
  - Hue (H)

- Auto-generate toggle
- “Recompute Ramp” button

### **Visualization**

A horizontal swatch strip showing:

- color sample
- step labels
- HEX value
- LCH values
- contrast vs. black/white
- “Bind to variable” toggle

---

## ### 1.3 Semantic Tokens

Semantic tokens translate abstract color primitives into applied UI roles.

### **Token Groups**

- Background
- Surface
- Border
- Text
- Emphasis / Accent
- Interactive states (hover, focus, press, disabled)

Example mapping:

```
background.default → color.neutral.050
background.raised → color.neutral.100
text.primary      → color.neutral.900
accent.primary    → color.blue.500
border.subtle     → color.neutral.200
```

UI presents these as rows with dropdowns for choosing ramp steps.

---

# ## 2. Typography

Typography is organized into four panels:
**Font Families → Type Scales → Text Styles → Variable Mapping**

---

## ### 2.1 Font Families

Manage the system’s typefaces.

### **Properties**

- Family name
- Fallbacks
- Preview grid (100–900 weights)
- Tokens:
  - `font.family.base`
  - `font.family.mono`
  - `font.family.display`

### **UI**

List of font families + right-side editor panel.

---

## ### 2.2 Type Scales

A mathematical type scale builder.

### **Controls**

- Base size (default: 16px)
- Ratio (1.20, 1.25, 1.333, etc.)
- Naming pattern (sm, md, lg, xl)
- Accessibility lock (auto adjusts LH)

### **Output**

Display of generated styles:

```
XL — 48/56
L  — 40/48
M  — 32/40
S  — 24/32
... etc.
```

---

## ### 2.3 Text Styles

Literal text styles used across the system.

### **Editable Fields**

- Font family
- Weight
- Size
- Line height
- Tracking
- Case
- Paragraph spacing

Each style includes a preview block.

---

## ### 2.4 Typographic Variables

Bind semantic tokens to styles:

```
label.sm   → text-style.label-sm
body.md    → text-style.body-md
title.lg   → text-style.heading-lg
display.xl → text-style.display-xl
```

Ensures consistency across design system and code.

---

# ## 3. Sizing

Sizing consists of **spacing, dimensions, radii, and strokes**.

---

## ### 3.1 Spacing Scale

A consistent spacing system.

### **Controls**

- Base unit (4px or 8px)
- Step pattern (linear or geometric)
- Naming (xs, sm, md OR numeric OR 050–950)

### **Preview**

Horizontal ruler showing all spacing values.

---

## ### 3.2 Dimensions

Component-specific height primitives, e.g.:

```
component.input.height  = 40px
component.button.height = 36px
avatar.sm               = 24px
avatar.lg               = 48px
```

Preview rectangles displayed side-by-side.

---

## ### 3.3 Radii

Corner shape primitives.

Typical steps:

```
radius.xs = 2
radius.sm = 4
radius.md = 6
radius.lg = 8
radius.xl = 12
radius.full = 999
```

Preview circles rendered in-line.

---

## ### 3.4 Stroke Widths

Defines UI outline thickness.

Example primitives:

```
stroke.sm = 1
stroke.md = 1.5
stroke.lg = 2
stroke.xl = 3
```

Preview: horizontal rule displaying stroke variations.

---

# ## 4. Variable Architecture

All tokens follow the same structured taxonomy.

### **Color Primitives**

```
color/<hue>/<step>
e.g. color/teal/050
```

### **Semantic Colors**

```
color/role/<category>/<name>
color/role/background/default
color/role/text/primary
```

### **Typography**

```
font/family/base
font/size/md
font/line-height/md
text-style/body-md
```

### **Sizing**

```
space/050
radius/md
stroke/md
dim/button-height
```

This structure ensures predictable scaling and clean mapping between design & code.

---

# ## 5. Workbench Navigation Structure

```
Foundations Workbench
 ├── Colors
 │     ├── Primitives
 │     ├── Ramps
 │     └── Semantic Tokens
 ├── Typography
 │     ├── Font Families
 │     ├── Type Scales
 │     ├── Text Styles
 │     └── Variables
 └── Sizing
       ├── Spacing Scale
       ├── Dimensions
       ├── Radii
       └── Strokes
```

---

# ## 6. Versioning

Add a simple version footer:

```
Sandman Workbench v0.1.0
Last updated: YYYY-MM-DD
```

---

If you want, I can now generate **separate .md files**, e.g.:

- `colors.md`
- `typography.md`
- `sizing.md`
- `variable-taxonomy.md`
- `workbench-overview.md`

Or if you prefer a **developer-doc version** or a **designer-friendly version**, I can rewrite accordingly.
