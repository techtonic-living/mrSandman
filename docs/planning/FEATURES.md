# mrSandman Widget - Features

> Sandman Design System Foundations Workbench — Comprehensive feature list and specifications

---

## Core Features

### 1. Color Management System

**Status**: 🟡 Planning
**Priority**: High
**Target**: Phase 2

**Description**:
Complete color token management with three layers: primitives (atomic HEX/LCH values), ramps (050-950 tonal scales via LCH interpolation), and semantic tokens (functional UI roles like background.default, text.primary). Includes visual editors, WCAG contrast checking, and Figma variable binding.

**User Story**:

> As a design systems designer, I want a visual interface for creating and managing color primitives, generating consistent tonal ramps, and mapping them to semantic UI roles so that my design tokens stay organized and accessible.

**Acceptance Criteria**:

- [ ] Create/edit color primitives with HEX and LCH inputs
- [ ] Generate 11-step ramps (050-950) using configurable LCH interpolation methods
- [ ] Map semantic tokens (background, surface, text, border, accent) to ramp steps
- [ ] Display WCAG contrast ratios for accessibility validation
- [ ] Bind tokens to Figma variables for design-to-code handoff
- [ ] Light/dark mode preview for all tokens

**Technical Requirements**:

- State management: useSyncedState (shared: primitives, ramps, semantic mappings)
- Components needed: `ColorPrimitiveEditor`, `RampGenerator`, `SemanticTokenMapper`, `ContrastChecker`, `VariableBindingPanel`
- API calls: None (local variable binding via Plugin API)
- Math libraries: LCH/OKLCH color space interpolation

**Design Considerations**:

- Performance impact: Medium (color calculations, real-time preview updates)
- Multiplayer support: Yes (shared token library)
- Mobile compatibility: Partial (complex editors better suited for desktop)

---

### 2. Typography System

**Status**: ⚪ Not Started
**Priority**: High
**Target**: Phase 2

**Description**:
Complete typographic token management covering font families, type scales (mathematical size/line-height generation), text styles (weight, tracking, case), and semantic variable mapping. Supports fallback stacks, accessibility-locked line heights, and preview rendering.

**User Story**:

> As a design systems designer, I want to define font families, generate consistent type scales, create reusable text styles, and map them to semantic tokens so that typography remains consistent across all designs.

**Acceptance Criteria**:

- [ ] Manage font families with fallback stacks and weight previews (100-900)
- [ ] Generate type scales using base size + ratio (1.2, 1.25, 1.333, etc.)
- [ ] Create/edit text styles with font, weight, size, line-height, tracking, case
- [ ] Map semantic tokens (label.sm, body.md, title.lg) to text styles
- [ ] Live preview of all text styles with sample content
- [ ] Bind to Figma text styles and variables

**Technical Requirements**:

- State management: useSyncedState (shared: families, scales, styles, semantic mappings)
- Components needed: `FontFamilyManager`, `TypeScaleGenerator`, `TextStyleEditor`, `SemanticTypeMapper`, `TypePreview`
- API calls: Plugin API for text style creation/binding
- Calculations: Mathematical scale generation, accessibility line-height ratios

**Design Considerations**:

- Performance impact: Low (mostly data display, minimal calculations)
- Multiplayer support: Yes (shared type system)
- Mobile compatibility: Partial (complex form inputs)

---

### 3. Sizing & Spacing System

**Status**: ⚪ Not Started
**Priority**: Medium
**Target**: Phase 3

**Description**:
Comprehensive spatial token management covering spacing scales (consistent intervals), dimensions (component heights/widths), corner radii, and stroke widths. Supports base-unit systems (4px/8px), linear/geometric progressions, and visual preview rulers.

**User Story**:

> As a design systems designer, I want to define spacing scales, component dimensions, corner radii, and stroke widths in a structured way so that spatial consistency is maintained across all components.

**Acceptance Criteria**:

- [ ] Create spacing scales with configurable base unit (4px/8px) and progression pattern
- [ ] Define component-specific dimensions (input.height, button.height, avatar sizes)
- [ ] Manage corner radius primitives (xs, sm, md, lg, xl, full)
- [ ] Define stroke width primitives for borders and outlines
- [ ] Visual preview rulers showing all spacing/sizing values side-by-side
- [ ] Bind to Figma variables for design token export

**Technical Requirements**:

- State management: useSyncedState (shared: spacing scales, dimensions, radii, strokes)
- Components needed: `SpacingScaleGenerator`, `DimensionEditor`, `RadiusEditor`, `StrokeEditor`, `SizingPreview`
- API calls: Plugin API for variable binding
- Calculations: Linear/geometric progression algorithms

**Design Considerations**:

- Performance impact: Low (minimal computation, static previews)
- Multiplayer support: Yes (shared sizing system)
- Mobile compatibility: Yes (simpler UI than color/type)

---

## Feature Priority Matrix

### Must Have (Phase 1-2)

Features critical for MVP functionality:

- [ ] Color Management System
- [ ] Typography System
- [ ] Basic error handling
- [ ] Multi-user token library support

### Should Have (Phase 3)

Important features that enhance usability:

- [ ] Sizing & Spacing System
- [ ] Export/import token JSON
- [ ] Hover states and visual feedback
- [ ] Property menu actions
- [ ] Keyboard shortcuts

### Could Have (Phase 4+)

Nice-to-have features for future releases:

- [ ] Theme preset library
- [ ] Token version history
- [ ] Integration with token build tools (Style Dictionary, Theo)
- [ ] Usage analytics dashboard

### Won't Have (Current Scope)

Features explicitly out of scope:

- ❌ Component library management (separate from tokens)
- ❌ Real-time collaboration chat
- ❌ Asset/icon management

---

## User Experience Features

### Interaction Design

- **On-Canvas Actions**: Primary interactions happen directly on widget
- **Property Menu**: Settings and configuration only
- **Keyboard Support**: Common shortcuts (Copy, Delete, etc.)
- **Touch Support**: Works on iPad and touch devices

### Visual Design

- **Consistent Styling**: Follows Figma design system
- **Responsive Layout**: Adapts to widget size
- **Hover States**: Visual feedback for interactive elements
- **Loading States**: Clear indicators for async operations

### Accessibility

- **Keyboard Navigation**: Tab through interactive elements
- **Screen Reader**: Semantic HTML in iframe UI
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states

---

## Technical Features

### State Management

- **Per-User State**: useSyncedMap for user-specific data
- **Global State**: useSyncedState for shared settings
- **Undo/Redo**: Automatic tracking of state changes
- **Persistence**: State saved across sessions

### Performance

- **Optimized Rendering**: Minimal re-renders
- **Dynamic Loading**: Load pages on-demand
- **Efficient State Updates**: Batch updates where possible
- **Image Optimization**: Use rasterized images for complex effects

### Error Handling

- **Validation**: Input validation with clear error messages
- **Async Errors**: Try/catch with user-friendly notifications
- **Graceful Degradation**: Widget remains functional on errors
- **Debug Mode**: Console logging for development

### Multi-User Support

- **Real-Time Sync**: Instant state synchronization
- **Conflict Resolution**: Proper use of useSyncedMap
- **User Identification**: Track actions by sessionId
- **Collaborative Features**: Multiple users can interact simultaneously

---

## API Integration

### Network Requests

**Enabled**: [ ] Yes [x] No (all token operations are local; future phases may add export integrations)

If enabled:

- **Endpoints**: [list allowed domains]
- **Authentication**: [method]
- **Error Handling**: [strategy]
- **Rate Limiting**: [approach]

### Plugin API Usage

**Features using Plugin API**:

- [x] Variable creation and binding (colors, typography, sizing)
- [x] Text style creation (typography system)
- [ ] Page access (if needed for cross-page token application)
- [ ] Selection handling (future: apply tokens to selected nodes)

**Undo Handling**: Use `figma.commitUndo()` for Plugin API changes (variable/style creation)

---

## Feature Dependencies

```
Color Management System (Phase 2)
  ├── ColorPrimitiveEditor
  ├── RampGenerator (LCH interpolation utils)
  ├── SemanticTokenMapper
  ├── ContrastChecker (WCAG utils)
  └── VariableBindingPanel (Plugin API)

Typography System (Phase 2)
  ├── FontFamilyManager
  ├── TypeScaleGenerator (math utils)
  ├── TextStyleEditor
  ├── SemanticTypeMapper
  └── Depends on: Plugin API for text style binding

Sizing & Spacing System (Phase 3)
  ├── SpacingScaleGenerator
  ├── DimensionEditor
  ├── RadiusEditor
  ├── StrokeEditor
  └── Depends on: Variable binding infrastructure from Phase 2
```

---

## Feature Testing

Each feature must pass:

- [ ] Single-user testing
- [ ] Multi-user testing
- [ ] Undo/redo testing
- [ ] Error scenario testing
- [ ] Performance testing
- [ ] Accessibility testing

---

## Future Feature Ideas

**Brainstorm** - Not committed:

- Token diffing (compare versions, track changes over time)
- Preset theme packages (Material, Tailwind-inspired, etc.)
- Advanced color science tools (APCAcontrast, color blindness simulation)
- Animation/motion token management
- Token usage analytics (which tokens are applied where)

**User Requests** - Track in separate issue tracker

---

**Last Updated**: November 27, 2025
**Owner**: Core Maintainer
**Reviewers**: Design Team, Engineering
