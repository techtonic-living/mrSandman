# Figma Widget API - Undo/Redo for Widgets

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [How Undo/Redo Works](#how-undoredo-works)
3. [Counter Widget Example](#counter-widget-example)
4. [When to Use useSyncedMap vs useSyncedState](#when-to-use-usesyncedmap-vs-usesyncedstate)
5. [Undoing Plugin API Methods](#undoing-plugin-api-methods)
6. [Best Practices](#best-practices)
7. [Resources](#resources)
8. [Next Steps](#next-steps)

---

## Overview

Undo/Redo works differently for widgets compared to regular FigJam/Figma objects because ultimately, a widget is simply a **rendered version of its synced state**. When a user performs an undo/redo action, the widget's state is updated accordingly and the widget re-renders to reflect the new state.

### Key Differences from Regular Objects

- **Widgets** - Undo/redo operates on synced state variables (`useSyncedState`, `useSyncedMap`)
- **Regular Objects** - Undo/redo operates on direct object properties (position, color, etc.)
- **Per-User Stacks** - Each user has their own independent undo/redo stack
- **State-Based** - Widget rendering is purely derived from synced state

### Why This Matters

Understanding undo/redo behavior is critical for building correct multi-user widgets. Improper state management can lead to:

- Users accidentally undoing each other's actions
- Inconsistent widget state across users
- Confusing user experience in collaborative scenarios

---

## How Undo/Redo Works

Each user has their own **undo/redo stack**, which keeps track of changes to [`useSyncedState`](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/) and [`useSyncedMap`](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/) variables. You can think of these synced variables as stored in one big mapping.

### State Mapping Example

For example, if your widget uses the following hooks:

```tsx
const { widget } = figma;
const { AutoLayout, useSyncedState, useSyncedMap } = widget;

function UndoWidget() {
	const [count, setCount] = useSyncedState("count", 0);
	const [countMap] = useSyncedMap("countMap");

	return (
		<AutoLayout
			onClick={() => {
				countMap.set("userA", 1);
				countMap.set("userB", 2);
			}}
		>
			{String(count)}
		</AutoLayout>
	);
}

figma.widget.register(UndoWidget);
```

This mapping can be visualized as follows (after the user clicks on the widget):

```json
{
	"count": 0,
	"countMap-userA": 1,
	"countMap-userB": 2
}
```

### The Inverse Change Pattern

When a user interacts with a widget that causes a change to a synced variable:

1. **Determine what changed** - Compare old and new state
2. **Push inverse change onto stack** - Store the reverse operation (not the new value)
3. **On undo** - Pop values from stack, apply inverse changes, re-render widget

**Example:**
- User changes count from 5 to 7
- Stack stores: `{count: 5}` (the old value)
- On undo: Apply `{count: 5}` to restore previous state

---

## Counter Widget Example

### A Basic Counter with 1 User

Let's say the counter widget is implemented with a single [`useSyncedState`](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/) hook:

⚠️ **Warning**

In practice, counters should be implemented using [`useSyncedMap`](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/) for correctness in multi-user scenarios.

```tsx
const { widget } = figma;
const { Text, useSyncedState } = widget;

function BasicCounter() {
	const [count, setCount] = useSyncedState("count", 0);

	return (
		<Text onClick={() => setCount(count + 1)}>
			{String(count)}
		</Text>
	);
}

figma.widget.register(BasicCounter);
```

### Single User Behavior

The following table describes a series of actions with one user:

| Action            | Widget State   | User A Undo Stack          | Display |
| ----------------- | -------------- | -------------------------- | ------- |
| Initial           | `{ count: 0 }` | `[]`                       | 0       |
| User A increments | `{ count: 1 }` | `[{count: 0}]`             | 1       |
| User A increments | `{ count: 2 }` | `[{count: 1}, {count: 0}]` | 2       |
| User A undoes     | `{ count: 1 }` | `[{count: 0}]`             | 1       |
| User A undoes     | `{ count: 0 }` | `[]`                       | 0       |

⚠️ **Simple Scenario Works**

These actions and results are straightforward and consistent with expectations. However, when we add another user, this `BasicCounter` will no longer work as expected.

### A Basic Counter with 2 Users

Let's see what happens when two users interact with the widget:

| Action            | Widget State   | User A Stack   | User B Stack   | Display |
| ----------------- | -------------- | -------------- | -------------- | ------- |
| Initial           | `{ count: 0 }` | `[]`           | `[]`           | 0       |
| User A increments | `{ count: 1 }` | `[{count: 0}]` | `[]`           | 1       |
| User B increments | `{ count: 2 }` | `[{count: 0}]` | `[{count: 1}]` | 2       |
| User A undoes     | `{ count: 0 }` | `[]`           | `[{count: 1}]` | 0       |
| User B undoes     | `{ count: 1 }` | `[]`           | `[]`           | 1       |

**The Problem:**

When User A performs an "undo" action, the count goes from **2 → 0**, which is problematic. This happens because when User A incremented the counter (from 0 to 1), the inverse of their action sets the counter to 0. To the observer, though, it looks like User A has somehow undone User B's action. Similarly, when User B undoes, the count gets reset back to 1.

### Counter with useSyncedMap

The expected behavior for when each user performs an undo action is for the counter to **only remove their vote**. We can achieve this by tracking each user's individual counts separately in a `SyncedMap` and displaying the sum of all counts.

Here is the same widget re-implemented correctly:

```tsx
const { widget } = figma;
const { Text, useSyncedMap } = widget;

function GoodCounter() {
	const countMap = useSyncedMap("countMap");

	let totalCount = 0;
	for (let val of countMap.values()) {
		totalCount += val;
	}

	return (
		<Text
			onClick={() => {
				const sessionId = figma.currentUser.sessionId.toString();
				const val = countMap.get(sessionId) || 0;
				countMap.set(sessionId, val + 1);
			}}
		>
			{String(totalCount)}
		</Text>
	);
}

figma.widget.register(GoodCounter);
```

### Multi-User Behavior with useSyncedMap

| Action            | Widget State                     | User A Stack           | User B Stack           | Display |
| ----------------- | -------------------------------- | ---------------------- | ---------------------- | ------- |
| Initial           | `{ }`                            | `[]`                   | `[]`                   | 0       |
| User A increments | `{countMap-A: 1}`                | `[{countMap-A: null}]` | `[]`                   | 1       |
| User B increments | `{countMap-A: 1, countMap-B: 1}` | `[{countMap-A: null}]` | `[{countMap-B: null}]` | 2       |
| User A undoes     | `{countMap-B: 1}`                | `[]`                   | `[{countMap-B: null}]` | 1       |
| User B undoes     | `{ }`                            | `[]`                   | `[]`                   | 0       |

⚠️ **Understanding null Values**

Note that `{countMap-A: null}` simply means this value was just added and that we should remove that key if this is applied to the synced state in an undo.

**The Solution:**

Here, we can see that each user's undo interacts well with the existing count. Both users simply "undo" their respective increments when they undo. User A's undo only removes their contribution, not User B's.

---

## When to Use useSyncedMap vs useSyncedState

### Use useSyncedMap For

When you want to preserve **user-specific objects/values**, it is important to use [`useSyncedMap`](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/), so that values from multiple users get applied properly in multiplayer scenarios.

**Examples:**
- User votes or likes
- Per-user selections or preferences
- Individual user contributions to a shared widget
- Cursors or presence indicators
- Per-user task assignments

```tsx
// ✅ Good - Each user has their own vote
const votes = useSyncedMap("votes");
votes.set(figma.currentUser.sessionId, userVote);

// ❌ Bad - Users will overwrite each other
const [vote, setVote] = useSyncedState("vote", null);
setVote(userVote);
```

### Use useSyncedState For

Of course, there are times that [`useSyncedState`](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/) is appropriate. Use it for **shared, global widget state** that all users should see the same way.

**Examples:**
- Widget theme or color scheme
- Shared configuration settings
- Toggle states that affect everyone
- Widget title or description
- Display mode (grid vs list)

**Example:**

Let's say you are storing the "theme" of your widget in a synced state. If User A changes this value from "gray" to "red", then User B changes the value from "red" to "blue", when User A undoes, the value will go back to "gray".

```tsx
// ✅ Good - Shared theme for all users
const [theme, setTheme] = useSyncedState("theme", "light");

// ❌ Bad - Each user shouldn't have their own theme
const themes = useSyncedMap("themes");
themes.set(figma.currentUser.sessionId, "dark");
```

### Decision Matrix

| Scenario              | Use              | Reason                                |
| --------------------- | ---------------- | ------------------------------------- |
| User votes/likes      | `useSyncedMap`   | Each user has individual contribution |
| Widget theme          | `useSyncedState` | Shared setting for all users          |
| Per-user selections   | `useSyncedMap`   | Each user has separate selection      |
| Widget title          | `useSyncedState` | Single shared value                   |
| User cursors/presence | `useSyncedMap`   | Each user has unique position         |
| Display mode toggle   | `useSyncedState` | All users see same mode               |

For more information, read [Widget State and Multiplayer](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/).

---

## Undoing Plugin API Methods

Let's say your widget also utilizes the Plugin API to perform other actions. To register a set of actions as part of the undo/redo stack, you can use [`figma.commitUndo()`](https://developers.figma.com/docs/plugins/api/properties/figma-commitundo/).

### Basic Usage

```tsx
<Text
	onClick={async () => {
		// Create a node using Plugin API
		const rect = figma.createRectangle();
		rect.x = 100;
		rect.y = 100;
		rect.resize(200, 200);
		figma.currentPage.appendChild(rect);

		// Commit to undo stack
		figma.commitUndo();
	}}
>
	Create Rectangle
</Text>
```

### Combining Widget State and Plugin API Changes

```tsx
<AutoLayout
	onClick={async () => {
		// Update widget state
		setCount(count + 1);

		// Also modify the canvas
		const node = figma.getNodeById(nodeId);
		if (node && "fills" in node) {
			node.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
		}

		// Commit both changes to undo stack
		figma.commitUndo();
	}}
>
	Increment and Color Red
</AutoLayout>
```

### Grouping Multiple Operations

```tsx
<Text
	onClick={async () => {
		// Multiple Plugin API operations
		const rect1 = figma.createRectangle();
		const rect2 = figma.createRectangle();
		const group = figma.group([rect1, rect2], figma.currentPage);

		// All operations committed as single undo action
		figma.commitUndo();
	}}
>
	Create Group
</Text>
```

⚠️ **Important Notes**

- `figma.commitUndo()` only applies to Plugin API changes, not widget state
- Widget state changes (via `useSyncedState`/`useSyncedMap`) are automatically tracked
- Use `commitUndo()` when you want Plugin API actions to appear in the undo stack

---

## Best Practices

### Choose the Right State Hook

**Do:**
- Use `useSyncedMap` for user-specific data
- Use `useSyncedState` for shared global state
- Think about multi-user scenarios upfront

```tsx
// ✅ User-specific selections
const selections = useSyncedMap("selections");

// ✅ Shared widget configuration
const [config, setConfig] = useSyncedState("config", defaultConfig);
```

**Don't:**
- Mix up when to use each hook
- Assume single-user behavior will work for multiple users

### Test Multi-User Scenarios

**Do:**
- Test undo/redo with multiple users interacting
- Verify that users can't undo each other's actions (when inappropriate)
- Use browser tabs or multiple devices to simulate collaboration

**Don't:**
- Only test single-user scenarios
- Assume undo/redo will "just work"

### Use Descriptive Keys

```tsx
// ✅ Good - Clear key names
const [theme, setTheme] = useSyncedState("widgetTheme", "light");
const userVotes = useSyncedMap("userVotes");

// ❌ Bad - Ambiguous keys
const [t, setT] = useSyncedState("t", "light");
const m = useSyncedMap("m");
```

### Handle Edge Cases

```tsx
// ✅ Good - Handle missing values
const votes = useSyncedMap("votes");
const userVote = votes.get(figma.currentUser.sessionId) || 0;

// ❌ Bad - Assumes value exists
const votes = useSyncedMap("votes");
const userVote = votes.get(figma.currentUser.sessionId);
```

### Consider Undo Implications

**Do:**
- Think about what users expect when they undo
- Group related changes that should undo together
- Test undo at every step of your widget's flow

**Don't:**
- Create surprising undo behavior
- Mix user-specific and global changes in confusing ways

### Document State Structure

```tsx
/**
 * Widget State Structure:
 *
 * useSyncedState("theme"): "light" | "dark"
 *   - Shared theme for all users
 *
 * useSyncedMap("votes"): Map<sessionId, number>
 *   - Per-user vote count
 *   - Key: figma.currentUser.sessionId
 *   - Value: number of votes cast by user
 */
```

---

## Resources

### Undo/Redo API

- **[figma.commitUndo()](https://developers.figma.com/docs/plugins/api/properties/figma-commitundo/)** - Commit Plugin API changes to undo stack
- **[useSyncedState](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/)** - Hook for shared state with undo tracking
- **[useSyncedMap](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/)** - Hook for per-user state with undo tracking

### Related Topics

- **[Widget State and Multiplayer](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)** - Deep dive into state management
- **[Working with Widgets](https://developers.figma.com/docs/widgets/working-with-widgets/)** - Core widget concepts
- **[Using the Plugin API](https://developers.figma.com/docs/widgets/using-the-plugin-api/)** - Integrating Plugin API

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to build better widgets? Here's what to explore next:

1. **Study State Management** - [Learn about widget state →](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)
2. **Explore Best Practices** - [Read widget best practices →](https://developers.figma.com/docs/widgets/best-practices/)
3. **Build Multi-User Widgets** - [Handle user events →](https://developers.figma.com/docs/widgets/handling-user-events/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
