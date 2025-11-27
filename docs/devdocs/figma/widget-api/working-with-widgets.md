# Figma Widget API - Working with Widgets

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Rendering and State](#rendering-and-state)
4. [Widget Visibility](#widget-visibility)
5. [Updating Widgets](#updating-widgets)
6. [Concurrency and Execution](#concurrency-and-execution)
7. [Performance Considerations](#performance-considerations)
8. [Widget Lifecycle](#widget-lifecycle)
9. [Resources](#resources)
10. [Next Steps](#next-steps)

---

## Overview

To ensure predictable and performant widgets, there are important principles and constraints to keep in mind as you're building them. Understanding these rules will help you create widgets that work reliably in all scenarios.

---

## Core Principles

These fundamental principles govern how widgets operate in Figma and FigJam:

### 1. State-Dependent Rendering

⚠️ **Critical Rule**

A widget's render function should depend **only on values returned by `useSyncedState` OR `useSyncedMap`**.

**Why This Matters:**
- Ensures consistent rendering across all clients
- Prevents race conditions
- Maintains multiplayer synchronization

**Example:**

```tsx
// ✅ Correct - depends only on synced state
function Widget() {
  const [count, setCount] = useSyncedState("count", 0)
  return <Text>{count}</Text>
}

// ❌ Wrong - depends on external data
function Widget() {
  const currentTime = Date.now()  // Non-deterministic!
  return <Text>{currentTime}</Text>
}
```

### 2. Universal Visibility

**Widgets appear the exact same to all users.**

- All collaborators see the same widget instance
- Widget state is synchronized across all clients
- Changes made by one user are visible to everyone
- This is what makes widgets collaborative by default

### 3. State-Driven Updates

**The only way to update a widget is by updating its state, which will re-render the widget automatically.**

You cannot manually trigger a re-render. All updates must go through state:

```tsx
const [value, setValue] = useSyncedState("value", 0)

// Update state to trigger re-render
onClick={() => setValue(value + 1)}
```

### 4. Single Widget Execution

**Many widgets can be in a file, but a user is only allowed to run one widget at a time.**

- Multiple widget instances can exist on the canvas
- All instances are visible and interactive
- Only one widget's code executes per user at a time
- Other widgets remain functional via their cached state

### 5. Document Loading Behavior

⚠️ **Performance Warning**

If a widget's manifest does not contain the `"documentAccess": "dynamic-page"` manifest field, then when the widget runs for the first time, **all pages in the document are loaded**.

**Impact:**
- In very large or complex files, this can result in a **significant delay** (sometimes 20 to 30 seconds)
- The entire file must load before the widget becomes interactive

**Solution:**

Consider updating your widget to include the `documentAccess` manifest field, and only [load pages](https://developers.figma.com/docs/plugins/accessing-document/) as needed.

```json
{
  "documentAccess": "dynamic-page"
}
```

### 6. Widget Code Termination

**Widget code can be terminated at any time by the user / FigJam.**

Known events that would terminate widget code:

- **User leaves/closes the file** - Widget code stops when user exits
- **User explicitly stops a long running widget** - Via the visual bell indicator
- **User deletes the running widget** - Removes the widget from canvas
- **User interacts with another widget** - Only one widget runs per user at a time

⚠️ **Design Implication**

Always design widgets to handle unexpected termination gracefully. Don't assume your code will complete.

---

## Rendering and State

### State as Single Source of Truth

The rendering function must be **pure** and **deterministic**:

```tsx
function CounterWidget() {
  const [count, setCount] = useSyncedState("count", 0)

  // ✅ Pure rendering - only uses state
  return (
    <AutoLayout onClick={() => setCount(count + 1)}>
      <Text>{count}</Text>
    </AutoLayout>
  )
}
```

### Why This Constraint Exists

**Multiplayer Consistency:**
- Multiple users viewing the same widget must see identical output
- Rendering must be reproducible given the same state
- No dependency on local client conditions

**Performance:**
- Predictable rendering enables optimizations
- State-based rendering allows efficient change detection
- Minimizes unnecessary re-renders

---

## Widget Visibility

### Collaborative Nature

Widgets are inherently collaborative objects:

**Characteristics:**
- One widget instance = visible to all users
- State changes propagate to all collaborators
- Interactive for everyone simultaneously
- No "owner" - all users have equal access

**Use Case Example:**

A voting widget where all team members can see real-time vote counts as they're cast by different users.

---

## Updating Widgets

### State-Triggered Re-renders

Updates follow a strict pattern:

1. **User interaction** triggers event handler
2. **Event handler updates state** via `setValue()` or `setMap()`
3. **State change triggers automatic re-render**
4. **New UI appears** based on updated state
5. **All clients receive update** via Multiplayer

### No Manual Re-renders

```tsx
// ❌ Cannot do this - no manual re-render API
function Widget() {
  // No forceUpdate() or similar method exists
  return <Text>Content</Text>
}

// ✅ Update state to trigger re-render
function Widget() {
  const [refresh, setRefresh] = useSyncedState("refresh", 0)

  // Trigger re-render by updating state
  onClick={() => setRefresh(refresh + 1)}

  return <Text>Content</Text>
}
```

---

## Concurrency and Execution

### One Widget Per User

**What This Means:**

- User can interact with multiple widgets
- Only one widget's code executes at a time
- Other widgets remain functional via their state
- Switching to another widget terminates current execution

**Scenario:**

1. User clicks Widget A - Widget A's code starts running
2. User clicks Widget B - Widget A's code terminates, Widget B's code starts
3. Widget A remains on canvas and is still interactive (its state is preserved)

### Multiple Instances

You can have multiple instances of the same or different widgets in a file:

- Each instance has its own state
- Each can be interacted with independently
- All are collaborative and visible to everyone
- Only one executes per user at a time

---

## Performance Considerations

### Dynamic Page Loading

⚠️ **Critical for Large Files**

Always use `"documentAccess": "dynamic-page"` in your manifest:

```json
{
  "documentAccess": "dynamic-page"
}
```

**Without this:**
- Entire document loads when widget runs
- 20-30 second delay in large files
- Poor user experience

**With this:**
- Pages load only when needed
- Faster initial widget load
- Better performance in complex files

### Loading Pages On Demand

```tsx
onClick={async () => {
  // Load specific page only when needed
  const page = await figma.getNodeByIdAsync(pageId)
  // Process page data
}}
```

[Learn more about accessing documents →](https://developers.figma.com/docs/plugins/accessing-document/)

---

## Widget Lifecycle

### Termination Events

Your widget code can stop at any moment. Plan for graceful termination:

### Event 1: User Closes File

**What happens:**
- Widget code terminates immediately
- Widget state is saved
- Widget remains on canvas for next session

### Event 2: Long-Running Widget Stopped

**What happens:**
- Visual bell appears to user
- User can stop widget manually
- Code terminates

**Design tip:** Keep operations short and responsive.

### Event 3: Widget Deleted

**What happens:**
- Widget removed from canvas
- Code terminates
- State is lost

### Event 4: Another Widget Interaction

**What happens:**
- Current widget code terminates
- New widget code starts
- Previous widget remains on canvas

### Handling Termination

```tsx
// ❌ Don't assume completion
onClick={async () => {
  await longOperation()  // Might terminate mid-operation
  await anotherOperation()  // May never execute
  updateState()  // May never execute
}}

// ✅ Design for interruption
onClick={async () => {
  // Save state frequently
  setState("processing", true)

  try {
    const result = await operation()
    setState("result", result)
  } catch (error) {
    setState("error", error.message)
  } finally {
    setState("processing", false)
  }
}}
```

---

## Resources

### Core Concepts

- **[How Widgets Run](https://developers.figma.com/docs/widgets/how-widgets-run/)** - Execution model details
- **[Widget State](https://developers.figma.com/docs/widgets/widget-state/)** - State management patterns
- **[Using the Plugin API](https://developers.figma.com/docs/widgets/using-the-plugin-api/)** - Document access

### API References

- **[useSyncedState](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/)** - Synchronized state hook
- **[useSyncedMap](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/)** - Map-based state
- **[Widget Manifest](https://developers.figma.com/docs/widgets/widget-manifest/)** - Configuration options

### Performance

- **[Accessing Documents](https://developers.figma.com/docs/plugins/accessing-document/)** - Loading pages dynamically
- **[documentAccess Field](https://developers.figma.com/docs/widgets/widget-manifest/#documentaccess)** - Manifest configuration

### Next Topics

- **[Setting Editor Type](https://developers.figma.com/docs/widgets/setting-editor-type/)** - Figma vs FigJam configuration

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to optimize your widgets? Here's what to explore next:

1. **Configure Editor Type** - [Set up Figma vs FigJam →](https://developers.figma.com/docs/widgets/setting-editor-type/)
2. **Optimize Performance** - [Implement dynamic page loading →](https://developers.figma.com/docs/plugins/accessing-document/)
3. **Handle Events Properly** - [Learn user event patterns →](https://developers.figma.com/docs/widgets/handling-user-events/)
4. **Study Best Practices** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
