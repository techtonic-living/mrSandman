# mrSandman Widget - Architecture

> Technical architecture and design decisions

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           Figma Canvas                  │
│  ┌───────────────────────────────────┐  │
│  │      mrSandman Widget             │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Widget Code (code.tsx)    │  │  │
│  │  │  - React-like JSX           │  │  │
│  │  │  - Widget API calls         │  │  │
│  │  │  - State management         │  │  │
│  │  └─────────────────────────────┘  │  │
│  │            │                       │  │
│  │            ▼                       │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Synced State Layer         │  │  │
│  │  │  - useSyncedState           │  │  │
│  │  │  - useSyncedMap             │  │  │
│  │  └─────────────────────────────┘  │  │
│  │            │                       │  │
│  │            ▼                       │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Optional UI (ui-src)       │  │  │
│  │  │  - React + Vite             │  │  │
│  │  │  - Tailwind CSS             │  │  │
│  │  │  - shadcn/ui components     │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  ┌─────────────┐      ┌─────────────┐
  │ Plugin API  │      │ Network API │
  │ (optional)  │      │ (optional)  │
  └─────────────┘      └─────────────┘
```

---

## Core Components

### Widget Entry Point

**File**: `widget-src/code.tsx`

```tsx
const { widget } = figma;
const { AutoLayout, Text, useSyncedState } = widget;

function Widget() {
	// Component logic
	return <AutoLayout>{/* UI structure */}</AutoLayout>;
}

widget.register(Widget);
```

**Responsibilities**:

- Main widget rendering
- Event handler registration
- State initialization
- Component composition
- Launching the UI iframe

### UI Entry Point

**File**: `ui-src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
```

**Responsibilities**:

- Rendering the React application
- Handling UI interactions
- Communicating with the Widget via `parent.postMessage`

---

### State Architecture

#### Global Shared State

**Use Case**: Configuration, settings, theme
**Implementation**: `useSyncedState`

```tsx
const [config, setConfig] = useSyncedState("config", {
	theme: "light",
	mode: "default",
});
```

**Characteristics**:

- Single source of truth for all users
- Undo affects all users
- Suitable for widget-wide settings

#### User-Specific State

**Use Case**: Votes, selections, user data
**Implementation**: `useSyncedMap`

```tsx
const userDataMap = useSyncedMap("userData");
const sessionId = figma.currentUser.sessionId;
userDataMap.set(sessionId, { vote: "yes" });
```

**Characteristics**:

- Per-user data storage
- Undo only affects current user
- Prevents user interference

---

### Component Structure

```
widget-src/
├── code.tsx                 # Entry point, main widget
├── components/
│   ├── Header.tsx          # Reusable header component
│   ├── Button.tsx          # Interactive button
│   ├── Card.tsx            # Card layout
│   └── List.tsx            # List rendering
├── utils/
│   ├── helpers.ts          # Utility functions
│   ├── validators.ts       # Input validation
│   └── formatters.ts       # Data formatting
└── types/
    ├── state.ts            # State type definitions
    ├── props.ts            # Component prop types
    └── api.ts              # API response types
```

**Design Principles**:

- **Modularity**: Small, focused components
- **Reusability**: Common patterns extracted
- **Type Safety**: Comprehensive TypeScript types
- **Separation**: Logic separated from presentation

---

### UI Architecture

The UI is built as a standard Single Page Application (SPA) using React, bundled by Vite into a single HTML file (`dist/index.html`) that is loaded by the Figma Widget API.

**Tech Stack**:

- **Framework**: React 19
- **Bundler**: Vite (with `vite-plugin-singlefile`)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

**Communication Pattern**:

1. **Widget -> UI**: `figma.showUI(__html__, { ... })` opens the UI. Data can be passed via `figma.ui.postMessage()`.
2. **UI -> Widget**: `parent.postMessage({ pluginMessage: { type: '...', payload: ... } }, '*')` sends data back to the widget.
3. **Widget Listener**: `figma.ui.onmessage` handles incoming messages from the UI.

---

## Data Flow

### User Interaction Flow

```
User Click
   │
   ▼
Event Handler (onClick)
   │
   ▼
Update State
(useSyncedState/Map)
   │
   ▼
Multiplayer Sync
   │
   ▼
Re-render Widget
   │
   ▼
Display Update
```

### Async Operation Flow

```
User Action
   │
   ▼
Event Handler (async)
   │
   ▼
API Call / Plugin API
   │
   ├─Success──────────┐
   │                  │
   ▼                  ▼
Error Handling    Update State
   │                  │
   ▼                  ▼
Show Error        Re-render
```

---

## State Management Patterns

### Pattern 1: Global Configuration

```tsx
// Shared setting for all users
const [theme, setTheme] = useSyncedState("theme", "light");

// User changes theme - affects everyone
setTheme("dark");
```

**When to Use**:

- Widget appearance settings
- Display modes
- Shared configuration

### Pattern 2: Per-User Data

```tsx
// Individual user data
const votes = useSyncedMap("votes");
const sessionId = figma.currentUser.sessionId.toString();

// User votes - doesn't affect others
votes.set(sessionId, "yes");
```

**When to Use**:

- User votes/likes
- Individual selections
- User presence

### Pattern 3: Aggregated Data

```tsx
// Aggregate per-user data for display
const votes = useSyncedMap("votes");
let yesCount = 0;
for (const vote of votes.values()) {
	if (vote === "yes") yesCount++;
}
```

**When to Use**:

- Displaying totals
- Statistics
- Combined views

---

## Performance Optimization

### Rendering Optimization

**Avoid**:

- ❌ Excessive blurs and shadows
- ❌ Non-standard blend modes
- ❌ Complex SVG with many paths
- ❌ Large clickable areas

**Prefer**:

- ✅ Rasterized images for effects
- ✅ `normal` or `passthrough` blend modes
- ✅ Simple SVGs or PNG images
- ✅ Specific clickable elements

### State Update Optimization

```tsx
// ❌ Bad - Multiple separate updates
onClick={() => {
  setState1(val1);
  setState2(val2);
  setState3(val3);
}}

// ✅ Good - Batch related updates
onClick(() => {
  setConfig({
    ...config,
    field1: val1,
    field2: val2,
    field3: val3
  });
}}
```

### Document Access

```json
{
	"documentAccess": "dynamic-page"
}
```

**Critical**: Prevents 20-30 second load delay in large files

---

## Error Handling Strategy

### Levels of Error Handling

1. **Input Validation** (Preventive)

   ```tsx
   if (!input || input.length === 0) {
   	figma.notify("Input required");
   	return;
   }
   ```

2. **Try-Catch** (Defensive)

   ```tsx
   try {
   	await asyncOperation();
   } catch (error) {
   	figma.notify("Operation failed");
   	console.error(error);
   }
   ```

3. **Graceful Degradation** (Resilient)
   ```tsx
   const data = loadData() || defaultData;
   ```

### Error Categories

| Category   | Handling     | User Feedback        |
| ---------- | ------------ | -------------------- |
| Validation | Prevent      | Inline error message |
| Network    | Retry        | "Please try again"   |
| API        | Log + notify | "Operation failed"   |
| State      | Reset        | "Widget reset"       |

---

## Security Considerations

### Network Access

- Minimize network calls
- Use allowlist in manifest
- Validate all external data
- Handle CORS properly

### State Security

- Validate all user input
- Sanitize data before storage
- Don't trust client data
- Use type validation

### User Privacy

- Don't store sensitive data
- Use sessionId, not user details
- Clear data when appropriate
- Respect user preferences

---

## Build & Deployment

### Build Process

**Widget**:

```
TypeScript (.tsx)
    │
    ▼
esbuild (transpile + bundle)
    │
    ▼
JavaScript (dist/code.js)
```

**UI**:

```
React Source (ui-src/)
    │
    ▼
Vite (bundle + inline)
    │
    ▼
HTML (dist/index.html)
```

### Development Workflow

1. **Development**: `npm run watch`
2. **Type Check**: `npm run tsc`
3. **Lint**: `npm run lint`
4. **Format**: `npm run format`
5. **Build**: `npm run build:prod`
6. **Test**: Manual testing in Figma

---

## Technology Stack

### Core Technologies

- **TypeScript** 5.3.2 - Type safety
- **Figma Widget API** 1.0.0 - Widget framework
- **esbuild** - Fast bundler
- **ESLint** - Code quality
- **Prettier** - Code formatting

### Development Tools

- **VS Code** - Recommended editor
- **Git** - Version control
- **npm** - Package management

---

## Design Decisions

### Decision Log

| Decision               | Rationale              | Alternatives Considered |
| ---------------------- | ---------------------- | ----------------------- |
| TypeScript             | Type safety, better DX | JavaScript              |
| useSyncedMap for votes | Per-user undo          | useSyncedState          |
| dynamic-page access    | Performance            | full access             |
| esbuild                | Fast, simple           | webpack, rollup         |
| No external deps       | Bundle size            | Using libraries         |

---

## Scalability Considerations

### State Scaling

- Monitor map sizes
- Implement cleanup for old data
- Consider pagination for large lists

### Performance Scaling

- Profile with many users
- Test with large datasets
- Optimize rendering paths

### Feature Scaling

- Keep components modular
- Document component APIs
- Maintain separation of concerns

---

## Future Architecture

### Potential Enhancements

- Component library extraction
- Shared utility package
- Automated testing framework
- Performance monitoring
- Error tracking service

---

**Last Updated**: November 26, 2025
**Architect**: [Your name]
**Review Cycle**: Monthly
