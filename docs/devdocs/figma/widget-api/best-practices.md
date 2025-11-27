# Figma Widget API - Best Practices

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Performance](#performance)
3. [Design](#design)
4. [Using the Property Menu](#using-the-property-menu)
5. [Code Organization](#code-organization)
6. [State Management](#state-management)
7. [Error Handling](#error-handling)
8. [Resources](#resources)
9. [Next Steps](#next-steps)

---

## Overview

Building high-quality widgets requires attention to performance, design, and user experience. This guide covers essential best practices to help you create widgets that are fast, intuitive, and delightful to use.

### Why Best Practices Matter

- **Performance** - Widgets run directly on the canvas and must be responsive
- **Usability** - Good design makes widgets intuitive and easy to use
- **Collaboration** - Well-designed widgets enhance multiplayer experiences
- **Reliability** - Proper patterns prevent bugs and edge cases

### Key Principles

1. **Optimize for Performance** - Keep rendering fast, especially on lower-powered devices
2. **Design for Canvas** - Leverage on-canvas interactions over modal UIs
3. **Be Consistent** - Follow FigJam/Figma UI patterns users already know
4. **Handle Edge Cases** - Test with multiple users and various scenarios

---

## Performance

In order to build widgets that are fast for most users and scenarios, it's helpful to understand the things that could make them slow.

The following things are particularly expensive for FigJam to render, so they have the potential to slow down your widget if used excessively, **in particular for users on lower-powered computers**. Please use them sparingly:

### Expensive Operations

**Blurs and Shadows:**

If you want to keep the look of these effects, you can rasterize them as images and then render the images in your widget. However, rasterization is a lossy process, meaning some vector data will be lost during the conversion.

```tsx
// ❌ Expensive - Heavy blur effects
<AutoLayout
	effect={{
		type: "drop-shadow",
		color: { r: 0, g: 0, b: 0, a: 0.5 },
		offset: { x: 0, y: 10 },
		blur: 20,
	}}
>
	Content
</AutoLayout>

// ✅ Better - Use pre-rasterized image for complex effects
<Image
	src="https://example.com/shadow-background.png"
	width={200}
	height={200}
/>
```

**Blend Modes:**

Any blend mode that is not `normal` or `passthrough` can be slow. Our renderer is heavily optimized for `normal` and `passthrough` blend modes.

```tsx
// ❌ Expensive - Non-standard blend modes
<Frame blendMode="multiply">
	Content
</Frame>

// ✅ Better - Use normal blend mode
<Frame blendMode="normal">
	Content
</Frame>
```

**Complex SVG:**

These are expensive to render because we have to parse each SVG and create its individual layers.

```tsx
// ❌ Expensive - Large, complex SVGs with many paths
<SVG
	src={complexIconWithManyPaths}
	width={100}
	height={100}
/>

// ✅ Better - Use simple SVGs or rasterize complex graphics
<Image
	src="https://example.com/simple-icon.png"
	width={100}
	height={100}
/>
```

### Document Access Optimization

**Load Additional Pages Only as Needed:**

If a widget does not contain the manifest field `"documentAccess": "dynamic-page"`, the entire document will be loaded when a widget is interacted with. In large or complex files, loading the entire document the first time your widget runs can sometimes cause a delay of **20 to 30 seconds**.

⚠️ **Critical Performance Setting**

Always use `"documentAccess": "dynamic-page"` in your manifest.json to prevent loading the entire document upfront.

**manifest.json:**
```json
{
	"containsWidget": true,
	"widgetApi": "1.0.0",
	"documentAccess": "dynamic-page",
	"editorType": ["figma", "figjam"]
}
```

If your widget needs to access other pages in the document, only [load the pages the user needs](https://developers.figma.com/docs/plugins/accessing-document/), rather than the whole document:

```tsx
// ✅ Load pages on-demand
<Text
	onClick={async () => {
		// Only load specific page when needed
		const page = await figma.getNodeByIdAsync(pageId);
		if (page && page.type === "PAGE") {
			// Work with page
		}
	}}
>
	Load Page
</Text>
```

### Performance Checklist

- [ ] Minimize use of blurs and shadows
- [ ] Use `normal` or `passthrough` blend modes only
- [ ] Keep SVGs simple or use rasterized images
- [ ] Set `"documentAccess": "dynamic-page"` in manifest
- [ ] Load pages and nodes only when needed
- [ ] Test on lower-powered devices
- [ ] Profile widget rendering performance

---

## Design

Because widgets are effectively interactive applications, how you think about both the visual and UX design of your widget is really important. Keep the following best practices in mind when designing your widgets:

### On-Canvas Interactions

**Keep as much interaction on the canvas as possible:**

The magic of widgets is in their on-canvas, multiplayer interactions, so you should try to keep all user actions on the canvas and reserve the property menu for settings or property changes.

```tsx
// ✅ Good - Interactive buttons on canvas
<AutoLayout direction="horizontal" spacing={8}>
	<Text onClick={() => setVote("yes")}>👍 Yes</Text>
	<Text onClick={() => setVote("no")}>👎 No</Text>
	<Text onClick={() => setVote("maybe")}>🤷 Maybe</Text>
</AutoLayout>

// ❌ Bad - Hiding primary actions in iframe
<Text onClick={() => figma.showUI(__html__)}>
	Open voting panel
</Text>
```

### Clickable Areas

**Avoid making the entire widget clickable:**

Widgets with large clickable areas can be difficult to select without accidentally triggering a click handler. Try to reserve some empty space that is not clickable, especially if the widget has a property menu which requires selection to show.

```tsx
// ✅ Good - Specific clickable elements with padding
<AutoLayout padding={16}>
	<AutoLayout
		padding={12}
		fill="#0066FF"
		cornerRadius={8}
		onClick={handleClick}
	>
		<Text fill="#FFFFFF">Click here</Text>
	</AutoLayout>
	{/* Surrounding padding is not clickable */}
</AutoLayout>

// ❌ Bad - Entire widget is clickable
<AutoLayout padding={16} onClick={handleClick}>
	<Text>Everything is clickable</Text>
</AutoLayout>
```

### Iframe Positioning

**Position your iframe relative to your widget's position:**

If you are using an iframe to show settings on a widget, use the `position` property to show the iframe closer to your widget so it is easier to reach and doesn't cover up the widget.

```tsx
// ✅ Good - Position iframe near widget
<Text
	onClick={() => {
		return new Promise(() => {
			figma.showUI(__html__, {
				width: 300,
				height: 400,
				position: { x: 0, y: 0 }, // Relative to widget
			});
		});
	}}
>
	Open Settings
</Text>

// ❌ Bad - Default positioning (may be far from widget)
<Text
	onClick={() => {
		return new Promise(() => {
			figma.showUI(__html__);
		});
	}}
>
	Open Settings
</Text>
```

### Visual Design Principles

**Match FigJam/Figma Style:**

```tsx
// ✅ Good - Follows Figma design system
<AutoLayout
	padding={16}
	fill="#FFFFFF"
	stroke="#E0E0E0"
	strokeWidth={1}
	cornerRadius={8}
>
	<Text fontSize={14} fill="#333333">
		Content
	</Text>
</AutoLayout>
```

**Provide Visual Feedback:**

```tsx
// ✅ Good - Hover states for interactive elements
<AutoLayout
	padding={12}
	fill="#F5F5F5"
	cornerRadius={8}
	onClick={handleClick}
	hoverStyle={{ fill: "#E0E0E0" }}
>
	<Text>Clickable</Text>
</AutoLayout>
```

**Use Appropriate Spacing:**

```tsx
// ✅ Good - Consistent spacing (8px increments)
<AutoLayout direction="vertical" spacing={8} padding={16}>
	<Text fontSize={16} fontWeight={700}>Title</Text>
	<Text fontSize={14}>Description text</Text>
</AutoLayout>
```

---

## Using the Property Menu

The [property menu](https://developers.figma.com/docs/widgets/api/properties/widget-usepropertymenu/) appears when a widget is selected, providing secondary actions and settings.

### Keep the Property Menu Simple

Too many options will not only clutter the UI, but will also overwhelm users. If your widget requires a lot of complex settings, think about putting them in an iframe instead of the property menu.

```tsx
// ✅ Good - Simple, focused property menu
const { usePropertyMenu } = widget;

usePropertyMenu(
	[
		{ tooltip: "Change color", propertyName: "color", itemType: "action" },
		{ tooltip: "Reset", propertyName: "reset", itemType: "action" },
	],
	handlePropertyMenu
);

// ❌ Bad - Too many options
usePropertyMenu(
	[
		{ tooltip: "Option 1", propertyName: "opt1", itemType: "action" },
		{ tooltip: "Option 2", propertyName: "opt2", itemType: "action" },
		{ tooltip: "Option 3", propertyName: "opt3", itemType: "action" },
		{ tooltip: "Option 4", propertyName: "opt4", itemType: "action" },
		{ tooltip: "Option 5", propertyName: "opt5", itemType: "action" },
		{ tooltip: "Option 6", propertyName: "opt6", itemType: "action" },
		// ... many more options
	],
	handlePropertyMenu
);
```

### Avoid Duplicate Actions

**Do not repeat actions you can take on the widget in the property menu:**

Showing the same actions on the widget and its property menu can be confusing to users. Make sure your widget's actions are mutually exclusive to either surface.

```tsx
// ✅ Good - Different actions on canvas vs property menu
function Widget() {
	usePropertyMenu(
		[
			{ tooltip: "Settings", propertyName: "settings", itemType: "action" },
		],
		handleSettings
	);

	return (
		<AutoLayout>
			<Text onClick={handleVote}>Vote</Text>
			{/* Vote action on canvas, settings in property menu */}
		</AutoLayout>
	);
}

// ❌ Bad - Same action in both places
function Widget() {
	usePropertyMenu(
		[
			{ tooltip: "Vote", propertyName: "vote", itemType: "action" },
		],
		handleVote
	);

	return (
		<AutoLayout>
			<Text onClick={handleVote}>Vote</Text>
			{/* Confusing - vote appears twice */}
		</AutoLayout>
	);
}
```

### Use Icons + Tooltips

**Use icons + tooltips in the property menu whenever possible:**

All FigJam native objects use icons with tooltips in their property menus. Try using icons as much as possible and only fall back to text buttons when the actions are difficult to convey with icons.

```tsx
// ✅ Good - Icons with descriptive tooltips
usePropertyMenu(
	[
		{ tooltip: "Delete widget", propertyName: "delete", itemType: "action", icon: "🗑️" },
		{ tooltip: "Duplicate", propertyName: "duplicate", itemType: "action", icon: "📋" },
		{ tooltip: "Settings", propertyName: "settings", itemType: "action", icon: "⚙️" },
	],
	handlePropertyMenu
);

// ❌ Bad - Text-only menu items
usePropertyMenu(
	[
		{ tooltip: "Delete", propertyName: "delete", itemType: "action" },
		{ tooltip: "Copy", propertyName: "copy", itemType: "action" },
		{ tooltip: "Configure", propertyName: "config", itemType: "action" },
	],
	handlePropertyMenu
);
```

### Icon Sizing

**40x40 icons look best in the property menu:**

Keep these dimensions in mind when designing custom icons!

```tsx
// ✅ Optimal icon size for property menu
const CustomIcon = () => (
	<SVG
		src={`<svg width="40" height="40" viewBox="0 0 40 40">...</svg>`}
		width={40}
		height={40}
	/>
);
```

---

## Code Organization

### Component Structure

**Break down complex widgets:**

```tsx
// ✅ Good - Modular components
function Header({ title }: { title: string }) {
	return (
		<AutoLayout padding={16}>
			<Text fontSize={18} fontWeight={700}>
				{title}
			</Text>
		</AutoLayout>
	);
}

function VoteButton({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<AutoLayout
			padding={12}
			cornerRadius={8}
			fill="#0066FF"
			onClick={onClick}
			hoverStyle={{ opacity: 0.8 }}
		>
			<Text fill="#FFFFFF">{label}</Text>
		</AutoLayout>
	);
}

function Widget() {
	const [votes, setVotes] = useSyncedState("votes", 0);

	return (
		<AutoLayout direction="vertical" spacing={8}>
			<Header title="Vote Widget" />
			<VoteButton label="Vote" onClick={() => setVotes(votes + 1)} />
			<Text>Total: {votes}</Text>
		</AutoLayout>
	);
}
```

### Constants and Configuration

**Extract constants:**

```tsx
// ✅ Good - Centralized configuration
const COLORS = {
	primary: "#0066FF",
	secondary: "#F0F0F0",
	text: "#333333",
	border: "#E0E0E0",
};

const SPACING = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
};

function Widget() {
	return (
		<AutoLayout
			padding={SPACING.md}
			fill={COLORS.secondary}
			stroke={COLORS.border}
		>
			<Text fill={COLORS.text}>Styled content</Text>
		</AutoLayout>
	);
}
```

---

## State Management

### Choose the Right Hook

**User-specific data** → `useSyncedMap`
**Shared global state** → `useSyncedState`

```tsx
// ✅ Good - User-specific votes
const votes = useSyncedMap("votes");
votes.set(figma.currentUser.sessionId, userVote);

// ✅ Good - Shared configuration
const [theme, setTheme] = useSyncedState("theme", "light");
```

### Initialize State Properly

```tsx
// ✅ Good - Provide defaults
const [config, setConfig] = useSyncedState("config", {
	color: "#0066FF",
	size: "medium",
	enabled: true,
});

// ❌ Bad - Missing defaults
const [config, setConfig] = useSyncedState("config");
```

### Handle Missing Values

```tsx
// ✅ Good - Defensive programming
const votes = useSyncedMap("votes");
const userVote = votes.get(figma.currentUser.sessionId) || 0;

// ❌ Bad - Assumes value exists
const userVote = votes.get(figma.currentUser.sessionId);
```

---

## Error Handling

### Validate User Input

```tsx
// ✅ Good - Input validation
<Input
	value={text}
	onTextEditEnd={(e) => {
		const input = e.characters.trim();
		if (input.length === 0) {
			figma.notify("Text cannot be empty");
			return;
		}
		if (input.length > 100) {
			figma.notify("Text must be less than 100 characters");
			return;
		}
		setText(input);
	}}
/>
```

### Handle Async Errors

```tsx
// ✅ Good - Error handling
<Text
	onClick={async () => {
		try {
			const response = await fetch("https://api.example.com/data");
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			const data = await response.json();
			setData(data);
		} catch (error) {
			figma.notify("Failed to load data. Please try again.");
			console.error("Fetch error:", error);
		}
	}}
>
	Load Data
</Text>
```

### Check Node Existence

```tsx
// ✅ Good - Validate nodes exist
<Text
	onClick={async () => {
		const node = await figma.getNodeByIdAsync(nodeId);
		if (!node) {
			figma.notify("Node not found");
			return;
		}
		if (!("fills" in node)) {
			figma.notify("Node does not support fills");
			return;
		}
		// Safe to modify
		node.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
	}}
>
	Color Node
</Text>
```

---

## Resources

### Performance Documentation

- **[Accessing the Document](https://developers.figma.com/docs/plugins/accessing-document/)** - Load pages efficiently
- **[Manifest Configuration](https://developers.figma.com/docs/widgets/manifest/)** - documentAccess settings

### Design Resources

- **[Property Menu API](https://developers.figma.com/docs/widgets/api/properties/widget-usepropertymenu/)** - Complete reference
- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - onClick and interactions
- **[Adding Hover States](https://developers.figma.com/docs/widgets/adding-hover-states/)** - Visual feedback

### State Management

- **[Widget State and Multiplayer](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)** - State management guide
- **[Undo/Redo](https://developers.figma.com/docs/widgets/undo-redo/)** - Understanding undo behavior

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to test and deploy your widget? Here's what to explore next:

1. **Test Your Widget** - [Learn testing strategies →](https://developers.figma.com/docs/widgets/testing/)
2. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)
3. **Optimize Performance** - [Read performance guide →](https://developers.figma.com/docs/plugins/accessing-document/)
4. **Publish Your Widget** - [Publishing guidelines →](https://help.figma.com/hc/en-us/articles/360042786793)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
