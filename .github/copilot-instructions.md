# mrSandman - Figma Widget Development Guide

## Project Overview

This is a **Figma widget** (not a plugin) that renders interactive UI components directly in Figma files. Widgets are collaborative - everyone sees and interacts with the same instance simultaneously.

### Widget vs Plugin

**Critical distinctions**:

- **Widgets**: Collaborative, on-canvas objects visible to everyone; unlimited instances can run simultaneously
- **Plugins**: Single-user tools with off-canvas UI; only one per user at a time
- This project is widget-only but can optionally use Plugin API via `figma.*` for advanced features

### Key Architecture

- **Widget Code**: `widget-src/code.tsx` - Main widget logic using React-like JSX
- **UI Source**: `ui-src/` - React + Vite application for the iframe UI
- **Build Output**: `dist/code.js` (Widget) and `dist/index.html` (UI)
- **Manifest**: `manifest.json` - Widget configuration and permissions

## Critical Build & Development Workflow

### Setup Commands

```bash
npm install                    # Install dependencies (TypeScript, esbuild, type definitions)
npm run watch                  # Auto-rebuild on file changes (recommended during development)
npm run build                  # One-time build
npm run lint                   # ESLint check
npm run tsc                    # Type check without emitting files
```

**Quick Start**: Use `npm init @figma/widget` to scaffold a new widget project with all configuration.

### Build Chain

- **Widget**: TypeScript (`widget-src/`) → **esbuild** → JavaScript (`dist/code.js`)
- **UI**: React (`ui-src/`) → **Vite** → Single HTML File (`dist/index.html`)

**Important**: Always run `npm run watch` in VS Code via "Terminal > Run Build Task..." after opening the project. This must be done each time you reopen VS Code.

## Widget-Specific Conventions

### JSX Configuration (widget-src/tsconfig.json)

```typescript
"jsx": "react"
"jsxFactory": "figma.widget.h"                    // NOT React.createElement
"jsxFragmentFactory": "figma.widget.Fragment"     // NOT React.Fragment
```

**How JSX Compiles**: JSX like `<Text>Hello</Text>` becomes `figma.widget.h(Text, null, "Hello")` after compilation. Props work similarly: `<Text fontSize={20}>Hello</Text>` becomes `figma.widget.h(Text, { fontSize: 20 }, "Hello")`.

### Widget API Patterns (from code.tsx)

**Widget Registration** (required at end of file):

```tsx
widget.register(Widget);
```

**Hooks** - Similar to React, use from `figma.widget`:

```tsx
const { useEffect, Text, useSyncedState, useSyncedMap, Input } = widget;
```

**State Management** - All widget state is synced across clients:

```tsx
const [count, setCount] = useSyncedState("count", 0); // Key must be unique, value must be JSON-serializable
const map = useSyncedMap("data"); // For multiple related values
```

**When to Use Each State Hook**:

```tsx
// useSyncedState - For shared global state (theme, config, title)
const [theme, setTheme] = useSyncedState("theme", "light"); // All users see same value

// useSyncedMap - For user-specific data (votes, selections, presence)
const votes = useSyncedMap("votes");
votes.set(figma.currentUser.sessionId, userVote); // Each user has own value
```

**Undo/Redo Behavior**:

- Each user has their own undo/redo stack
- Tracks changes to `useSyncedState` and `useSyncedMap` automatically
- Use `useSyncedMap` for user-specific actions to prevent users from undoing each other
- Use `figma.commitUndo()` to add Plugin API changes to undo stack

```tsx
// Multi-user counter - correct approach with useSyncedMap
const countMap = useSyncedMap("countMap");
onClick={() => {
	const sessionId = figma.currentUser.sessionId.toString();
	const val = countMap.get(sessionId) || 0;
	countMap.set(sessionId, val + 1); // Each user's undo only removes their increment
}}

// Plugin API undo
onClick={async () => {
	const rect = figma.createRectangle();
	figma.currentPage.appendChild(rect);
	figma.commitUndo(); // Adds Plugin API changes to undo stack
}}
```

**Text Input** - Use Input component for user text entry:

```tsx
<Input
	value={text}
	placeholder="Type here"
	onTextEditEnd={(e) => setText(e.characters)} // Fires on blur, not every keystroke
	fontSize={64}
	width={500}
	inputFrameProps={{
		fill: "#fee2e2",
		stroke: "#b91c1c",
		cornerRadius: 16,
		padding: 20,
	}}
	inputBehavior="wrap" // or "truncate" for single line
/>
```

**Execution Model**:

- **Rendering code** runs synchronously and must only depend on widget state
- **State updating code** runs asynchronously and can access Plugin API, make network requests
- Widgets only run on the client that initiated interaction; others see updates via Multiplayer

**Event Handlers** - Use async or return Promise to keep widget running:

```tsx
// Simple click handler (widget terminates after)
onClick={() => console.log('Clicked')}

// Async handler (widget stays alive)
onClick={async () => {
  const fonts = await figma.listAvailableFontsAsync()
  // Do stuff
}}

// Promise handler (keeps iframe open)
onClick={() => new Promise((resolve) => {
  figma.showUI(__html__)  // __html__ is the bundled dist/index.html content
})}
```

**Click Event Coordinates** - Access click position:

```tsx
onClick={(event) => {
  // Relative to component
  console.log(event.offsetX, event.offsetY)

  // Relative to canvas
  console.log(event.canvasX, event.canvasY)
}}
```

**Property Menus** - Secondary actions when widget is selected:

```tsx
const { usePropertyMenu } = widget;

usePropertyMenu(
	[
		{ tooltip: "Settings", propertyName: "settings", itemType: "action" },
		{ tooltip: "Delete", propertyName: "delete", itemType: "action" },
	],
	(e) => {
		if (e.propertyName === "settings") {
			// Handle settings
		}
	}
);
```

**UI Communication** (widget ↔ iframe):

```tsx
// Widget side (code.tsx)
useEffect(() => {
	figma.ui.onmessage = (msg) => {
		if (msg.type === "data") {
			setData(msg.value);
			figma.closePlugin();
		}
	};
});

// UI side (ui-src)
parent.postMessage({ pluginMessage: { type: "data", value: "hello" } }, "*");
```

**Stickable Hooks** (FigJam only):

```tsx
const { useStickable, useStickableHost } = widget;

// Make widget stick to other nodes
useStickable();

// OR accept stickables attaching to this widget
useStickableHost(() => {
	// Runs when a stickable attaches
	setStickedCount(count + 1);
});

// Widget can be one or the other, NOT both
```

**List Rendering** - Use map() with key prop:

```tsx
const items = [
	{ id: "1", name: "Item 1" },
	{ id: "2", name: "Item 2" },
];

return (
	<AutoLayout direction="vertical">
		{items.map((item) => (
			<Text key={item.id}>{item.name}</Text> // key prop required for performance
		))}
	</AutoLayout>
);
```

**Images** - Display images with required width/height:

```tsx
<Image
	src="https://example.com/photo.jpg" // URL, data URI, or ImagePaint object
	width={100} // Required
	height={100} // Required
	cornerRadius={8} // Optional styling
/>

// Or use as fill on Frame/Rectangle
<Frame
	fill={{
		type: "image",
		src: figma.currentUser.photoUrl,
	}}
	width={100}
	height={100}
/>
```

**Hover States** - Add visual feedback to interactive components:

```tsx
// Basic hover with fill change
<AutoLayout
	onClick={() => console.log('clicked')}
	fill="#FFFFFF"
	hoverStyle={{ fill: "#000000" }}
>
	<Text fill="#000000" hoverStyle={{ fill: "#FFFFFF" }}>
		Hover me
	</Text>
</AutoLayout>

// Only fill, stroke, and opacity can be overridden in hoverStyle
<Text
	onClick={handler}
	hoverStyle={{
		fill: "#0066FF",    // Change background/text color
		stroke: "#0052CC",  // Change border color
		opacity: 0.8        // Change transparency
	}}
>
	Click me
</Text>

// Hover targets require onClick or onTextEditEnd handler
// hoverStyle applies recursively to all children
```

## Workbench Architecture & Patterns

### The "Fetch & Sync" Pattern (Critical)

The Widget API separates rendering (sync) from data access (async).

- **Constraint**: `figma.variables` and other Plugin APIs CANNOT be accessed in the main render body.
- **Pattern**: Use a "Source of Truth" model where Figma Variables are the truth, and Widget State is the cache.
- **Implementation**:
  1.  **Read**: Fetch variables in `useEffect` or `onClick` handlers.
  2.  **Store**: Save relevant data to `useSyncedState`.
  3.  **Render**: Render UI solely based on `useSyncedState`.

```tsx
// ✅ Correct Pattern
function ColorList() {
	const [colors, setColors] = useSyncedState("colors", []);

	useEffect(() => {
		// Async fetch in hook
		figma.variables.getLocalVariablesAsync().then((vars) => {
			const colorVars = vars.filter((v) => v.resolvedType === "COLOR");
			setColors(colorVars.map((v) => ({ id: v.id, name: v.name })));
		});
	});

	return (
		<AutoLayout>
			{colors.map((c) => (
				<Text key={c.id}>{c.name}</Text>
			))}
		</AutoLayout>
	);
}
```

### Domain-Split State Management

To prevent performance issues and conflicts, split state by domain rather than using one monolithic object.

- `useSyncedState("colors", ...)` - Color tokens
- `useSyncedState("typography", ...)` - Type tokens
- `useSyncedState("sizing", ...)` - Sizing tokens
- `useSyncedState("activeTab", "colors")` - Navigation state

### User-Specific UI State

Use `useSyncedMap` for transient UI state that shouldn't affect other users (e.g., which accordion is open, scroll position).

```tsx
const uiState = useSyncedMap("uiState");
const myState = uiState.get(figma.currentUser.sessionId) || {};
```

### Color Math & Manipulation

Figma uses RGB/RGBA natively. For LCH/OKLCH operations required by the Workbench:

- Perform all color math in event handlers **before** setting state.
- Store values in a format ready for rendering (e.g., Hex or RGB strings) to keep the render loop fast.
- Ensure external libraries (e.g., `culori`) are compatible with the Figma sandbox (no DOM dependency).

## Manifest Configuration

### Critical Fields in manifest.json

```json
{
	"containsWidget": true, // Required - identifies this as a widget
	"widgetApi": "1.0.0", // Widget API version
	"documentAccess": "dynamic-page", // Load pages on-demand (performance!)
	"editorType": ["figma"], // Or ["figjam"] for FigJam boards, or both: ["figma", "figjam"]
	"ui": "dist/index.html", // Bundled UI file
	"networkAccess": {
		"allowedDomains": ["none"], // Domain allowlist for network requests
		"reasoning": "", // Required if using "*" or dev servers
		"devAllowedDomains": [] // Local development URLs (e.g., "http://localhost:3000")
	}
}
```

**Performance Note**: `"documentAccess": "dynamic-page"` prevents loading entire document (20-30s delay in large files). Always use this unless you need full document access.

### Network Access Configuration

**Domain Patterns**:

- `["none"]` - Block all network access (default for widgets without external requests)
- `["domain.com"]` - Allow entire domain
- `["domain.com/endpoint"]` - Allow specific endpoint (more secure)
- `["*"]` - Allow all domains (requires `reasoning` explanation)

**Best Practice**: Use most restrictive access needed. Prefer endpoint-specific over domain-level access.

**CORS Requirement**: Widgets have `null` origin, so external APIs must return `Access-Control-Allow-Origin: *`

## Best Practices

### Performance

**Avoid expensive operations**:

- Blurs and shadows - Use sparingly, consider rasterizing complex effects as images
- Blend modes - Use `normal` or `passthrough` only (others are slow)
- Complex SVG - Keep SVGs simple or use rasterized images
- Always use `"documentAccess": "dynamic-page"` in manifest to prevent 20-30s load delays

### Design

**On-canvas interactions**:

- Keep primary actions on canvas, not in iframes
- Avoid making entire widget clickable - reserve non-clickable areas for selection
- Position iframes near widget using `position` property

**Property menu**:

- Keep simple with 2-4 actions max
- Don't duplicate canvas actions in property menu
- Use icons (40x40) with tooltips, not text buttons
- Put complex settings in iframe, not property menu

```tsx
// ✅ Good - Simple property menu
usePropertyMenu(
	[
		{ tooltip: "Settings", propertyName: "settings", itemType: "action" },
		{ tooltip: "Reset", propertyName: "reset", itemType: "action" },
	],
	handlePropertyMenu
);
```

### Error Handling

```tsx
// ✅ Good - Validate async operations
onClick={async () => {
	try {
		const node = await figma.getNodeByIdAsync(nodeId);
		if (!node) {
			figma.notify("Node not found");
			return;
		}
		// Process node
	} catch (error) {
		figma.notify("Operation failed");
		console.error(error);
	}
}}
```

## Project Structure Conventions

```
widget-src/code.tsx    → Main widget component (JSX + TypeScript)
ui-src/                → React UI source code (Vite project)
dist/                  → Build output (code.js + index.html)
manifest.json          → Widget metadata and permissions
```

**No separate plugin code** - This is widget-only. The widget can optionally use Plugin API via `figma.*` but doesn't require separate plugin logic.

### Using Plugin API

Plugin API can only be used in **event handlers and hooks**, not in rendering code:

```tsx
// ✅ Valid - in event handler
onClick={async () => {
  const selection = figma.currentPage.selection  // OK
}}

// ❌ Invalid - in rendering code
function Widget() {
  const page = figma.currentPage  // ERROR - rendering code can't access Plugin API
  return <Text>Widget</Text>
}
```

## ESLint Rules

Unused variables prefixed with `_` are ignored:

```typescript
const { _unusedProp, usedProp } = someObject; // No error for _unusedProp
```

## Common Patterns

### Opening Modal UI

```tsx
<Text onClick={() => new Promise(() => figma.showUI(__html__))}>Open IFrame</Text>
```

### Closing Widget/Iframe

```tsx
figma.closePlugin(); // From widget side
// or
parent.postMessage({ pluginMessage: { type: "close" } }, "*"); // From UI side
```

### Showing Notifications

```tsx
figma.notify("Message text");
```

### Making Network Requests

```tsx
<Text
	onClick={async () => {
		const response = await fetch("https://api.example.com/data");
		const json = await response.json();
		// Process data
		figma.closePlugin();
	}}
>
	Fetch Data
</Text>
```

**Requirements**:

- Must use async handler or return Promise
- API must support CORS with `Access-Control-Allow-Origin: *`
- Domain must be in `manifest.json` `networkAccess.allowedDomains`

## Testing in Figma

1. Run `npm run watch`
2. In Figma: Widgets menu → Development → Import widget from manifest
3. Select `manifest.json` from this project
4. Widget appears in file - click to test interactions

**Hot Reloading**: Selected widgets automatically re-render when code changes, preserving state
**Reset State**: Right-click widget → Widgets → Reset widget state
**Re-render**: Right-click widget → Widgets → Re-render widget

## Documentation Reference

- Widget API docs available at `/docs/devdocs/figma/widget-api/introduction.md`
- Official docs: https://www.figma.com/widget-docs/

## Documentation Workflow

### Adding New Reference Docs

Use the `.github/prompts/add-devdoc.prompt.md` workflow to create new documentation:

1. Provide a URL to fetch (e.g., Figma developer docs)
2. Specify destination path (e.g., `/docs/devdocs/figma/widget-api/topic-name.md`)
3. Documentation is generated using the template at `/.github/templates/devdoc_TEMPLATE.md`
4. New patterns or API information discovered should be added back to this file

**Template Structure**: All reference docs follow the same format:

- Header with title and date
- Table of contents with anchor links
- Overview → Detailed sections → Examples → Resources → Next steps
- Code examples with language tags
- Important callouts with ⚠️ format
- Community links and feedback footer

### Evergreen Documentation

The following files are considered "Evergreen" and must be kept up-to-date with any architectural, structural, or workflow changes. **Do not** modify files in `docs/devdocs/` as they are static reference material.

**Project Root**:

- `README.md` - Main entry point and overview
- `QUICKSTART.md` - Setup and daily workflow guide
- `WORKSPACE_SETUP.md` - Environment configuration status
- `.github/copilot-instructions.md` - This file (AI behavior rules)

**Planning & Architecture**:

- `docs/planning/ARCHITECTURE.md` - Technical design and patterns
- `docs/planning/FEATURES.md` - Feature specifications
- `docs/planning/ROADMAP.md` - Development phases and status
- `docs/testing/TEST_PLAN.md` - Testing strategy and cases

**Maintenance Rule**: When making significant changes to the codebase (e.g., changing build tools, moving directories, updating dependencies), always check and update these files to ensure they remain accurate.

## Safety & Archiving Protocol

**Destructive Changes**:

- Always avoid destructive changes where possible.
- For significant deletions or overwriting large code blocks, **YOU MUST** first archive the original file(s).
- **Archive Path**: `archive/YYYY-MM-DD_HHMM/<filename>`
- Example: Before deleting `ui.html`, copy it to `archive/2025-11-26_1430/ui.html`.
