# Figma Widget API - Widget State

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Understanding Widget State](#understanding-widget-state)
3. [Using Synced State](#using-synced-state)
4. [State as Data Representation](#state-as-data-representation)
5. [State Updates and Re-rendering](#state-updates-and-re-rendering)
6. [Best Practices](#best-practices)
7. [Examples](#examples)
8. [Resources](#resources)
9. [Next Steps](#next-steps)

---

## Overview

Every instance of a widget has its own state. You can think of a widget's state as its **data representation**. A widget with the same state should always render the same output.

### Key Principle

⚠️ **Important Concept**

If you want to change how a widget looks in response to a user interaction, you should **update its state**! State changes trigger re-renders, which update the widget's appearance.

---

## Understanding Widget State

### What is Widget State?

Widget state is the data that determines how your widget looks and behaves. It's similar to React state but with an important distinction:

**Synced State**

We interchangeably refer to a widget's state as **synced state** because all of a widget's state is currently synced across all clients.

⚠️ **Current Limitation**

In the future, Figma intends to support local state, but **for now all state is synced state**. This means every state change is synchronized across all users viewing the widget.

---

## Using Synced State

### The useSyncedState Hook

The primary way to manage state in widgets is through the `useSyncedState` hook, which works similarly to React's `useState` but with synchronization across clients.

### Basic Syntax

```tsx
const [value, setValue] = useSyncedState(key, defaultValue)
```

**Parameters:**
- `key` (string) - Unique identifier for this state value
- `defaultValue` - Initial value for the state

**Returns:**
- Array with current value and setter function

### Simple Counter Example

Here's a widget that increments a count for every click:

```tsx
const { widget } = figma
const { Text, useSyncedState } = widget

function SimpleCounter() {
  const [count, setCount] = useSyncedState("count", 0)

  return (
    <Text
      onClick={() => {
        setCount(count + 1)
      }}
    >
      {count}
    </Text>
  )
}

widget.register(SimpleCounter)
```

⚠️ **Important: Unique Keys**

If you have multiple `useSyncedState` calls, make sure you give them **unique keys**! Duplicate keys will cause state conflicts.

---

## State as Data Representation

### Internal State Structure

Under the hood, you can think of a widget's state as a **JSON object**.

For the counter example above, the state evolves like this:

**Initially:**
```json
{
  "count": 0
}
```

**After one click:**
```json
{
  "count": 1
}
```

**After another click:**
```json
{
  "count": 2
}
```

### Valid State Values

⚠️ **JSON Serializable Only**

Any **JSON serializable value** is a valid state value. This includes:

- ✅ Numbers: `42`, `3.14`
- ✅ Strings: `"hello"`, `"widget"`
- ✅ Booleans: `true`, `false`
- ✅ Arrays: `[1, 2, 3]`, `["a", "b"]`
- ✅ Objects: `{ name: "widget", count: 5 }`
- ✅ Null: `null`

**Not supported:**
- ❌ Functions
- ❌ Symbols
- ❌ undefined (use `null` instead)
- ❌ Non-serializable objects (e.g., DOM nodes, Map, Set)

---

## State Updates and Re-rendering

### Automatic Re-rendering

Each time the state object gets updated, the associated widget is **automatically re-rendered** to reflect the changes.

### Update Flow

```tsx
// 1. User interacts with widget
onClick={() => {
  // 2. State setter is called
  setCount(count + 1)

  // 3. State updates
  // 4. Widget re-renders with new state
  // 5. All clients see the updated widget via Multiplayer
}}
```

### Synchronization Across Clients

When one user updates the widget state:

1. **Local client** immediately sees the change
2. **State synchronizes** via Figma's Multiplayer system
3. **All other clients** receive the update and re-render

This ensures everyone sees the same widget state in real-time.

---

## Best Practices

### 1. Use Unique State Keys

```tsx
// ✅ Good - unique keys
const [count, setCount] = useSyncedState("count", 0)
const [name, setName] = useSyncedState("name", "")
const [items, setItems] = useSyncedState("items", [])

// ❌ Bad - duplicate keys will conflict
const [value1, setValue1] = useSyncedState("data", 0)
const [value2, setValue2] = useSyncedState("data", "") // Conflict!
```

### 2. Keep State JSON-Serializable

```tsx
// ✅ Good - simple, serializable values
const [user, setUser] = useSyncedState("user", {
  name: "Alice",
  score: 100,
  active: true
})

// ❌ Bad - non-serializable
const [handler, setHandler] = useSyncedState("handler", () => {}) // Functions don't serialize
```

### 3. Initialize with Appropriate Defaults

```tsx
// ✅ Good - meaningful defaults
const [count, setCount] = useSyncedState("count", 0)
const [items, setItems] = useSyncedState("items", [])
const [config, setConfig] = useSyncedState("config", { theme: "light" })
```

### 4. State Should Determine Rendering

```tsx
// ✅ Good - rendering based solely on state
function Widget() {
  const [count, setCount] = useSyncedState("count", 0)
  return <Text>{count}</Text>
}

// ❌ Bad - depending on external factors during render
function Widget() {
  const [count, setCount] = useSyncedState("count", 0)
  // Don't access figma.currentPage during render!
  return <Text>{figma.currentPage.name}</Text>
}
```

---

## Examples

### Simple Toggle

```tsx
function ToggleWidget() {
  const [isOn, setIsOn] = useSyncedState("toggle", false)

  return (
    <Text onClick={() => setIsOn(!isOn)}>
      {isOn ? "ON" : "OFF"}
    </Text>
  )
}
```

### Counter with Multiple State Values

```tsx
function MultiStateWidget() {
  const [count, setCount] = useSyncedState("count", 0)
  const [label, setLabel] = useSyncedState("label", "Clicks")

  return (
    <AutoLayout direction="vertical">
      <Text>{label}: {count}</Text>
      <Text onClick={() => setCount(count + 1)}>
        Click me
      </Text>
    </AutoLayout>
  )
}
```

### List Management

```tsx
function TodoWidget() {
  const [todos, setTodos] = useSyncedState("todos", [])

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text }])
  }

  return (
    <AutoLayout direction="vertical">
      {todos.map(todo => (
        <Text key={todo.id}>{todo.text}</Text>
      ))}
    </AutoLayout>
  )
}
```

---

## Resources

### API Documentation

- **[useSyncedState API](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/)** - Complete hook reference
- **[Widget Hooks](https://developers.figma.com/docs/widgets/api/api-reference/)** - All available hooks

### Related Concepts

- **[How Widgets Run](https://developers.figma.com/docs/widgets/how-widgets-run/)** - Understanding widget execution
- **[Prototyping Widget UI](https://developers.figma.com/docs/widgets/prototyping-widget-ui/)** - Building widget interfaces

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to build more interactive widgets? Here's what to explore next:

1. **Build Your UI** - [Learn about prototyping widget UI →](https://developers.figma.com/docs/widgets/prototyping-widget-ui/)
2. **Handle Events** - [Make widgets interactive →](https://developers.figma.com/docs/widgets/handling-user-events/)
3. **Advanced State Patterns** - [Explore useSyncedState details →](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
