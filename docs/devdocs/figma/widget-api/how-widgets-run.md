# Figma Widget API - How Widgets Run

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Widget Execution Model](#widget-execution-model)
3. [Rendering Code](#rendering-code)
4. [State Updating Code](#state-updating-code)
5. [File Loading](#file-loading)
6. [Network Access](#network-access)
7. [Resources](#resources)
8. [Next Steps](#next-steps)

---

## Overview

Widgets run inside the same [sandbox as Plugins](https://developers.figma.com/docs/plugins/how-plugins-run/) but with additional capabilities:

- **Create custom objects** that live on the canvas
- **Respond to user interactions** on these custom objects

### Key Execution Characteristics

⚠️ **Important Execution Model**

Widgets only run in response to user interaction and only on the specific client that initiated this interaction. All other clients see the updated widget via regular file updates through Multiplayer.

---

## Widget Execution Model

It's helpful to think about widget code in **2 distinct parts**:

### 1. Rendering Code
Code that describes **how a widget should look**

- Runs **synchronously**
- Purely declarative
- Based on widget state

### 2. State Updating Code
Code that **updates widget state**

- Runs **asynchronously**
- Can access Plugin API
- Can make network requests
- Triggers re-render when complete

This separation ensures consistent behavior across multiple clients and maintains the collaborative nature of widgets.

---

## Rendering Code

Rendering code describes how a widget should look and runs **synchronously**.

### Key Principles

**State-Only Dependencies**

Rendering code should solely depend on a widget's state to avoid inconsistencies when rendering across multiple clients.

⚠️ **Critical Constraint**

A widget **shouldn't depend on attributes of other nodes** on the canvas when deciding how it looks. This is enforced at the API level—widget rendering code won't be able to read and access data outside of the particular widget's state.

### Working with Dynamic Data

If you want to use something like [`figma.activeUsers`](https://developers.figma.com/docs/plugins/api/figma/#activeusers) in your widget, the recommended pattern is to use a [lazy default initializer](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/#lazy-initial-state) to initialize a synced state value.

#### Example Pattern

```tsx
const [users, setUsers] = useSyncedState('users', () => {
  // Lazy initialization - runs once to set initial state
  return figma.activeUsers
})

// Rendering code uses the state, not direct API calls
return <Text>{users.length} active users</Text>
```

### Why This Matters

This constraint ensures:
- **Consistent rendering** across all clients
- **No race conditions** between clients
- **Predictable behavior** regardless of load order
- **Reliable multiplayer** synchronization

---

## State Updating Code

Code that updates [widget state](https://developers.figma.com/docs/widgets/widget-state/) runs **asynchronously**. When completed, the widget will re-render.

### Capabilities

Widgets can do more than just read widget state:

**Plugin API Access**
- Access and modify the document
- Read file properties and metadata
- Interact with layers and nodes

**Network Requests**
- Make API calls via iframes
- Fetch external data
- Integrate with external services

**User Input**
- Open iframes for complex user input
- Handle form submissions
- Process user interactions

### Asynchronous Flow

```tsx
// State updating code runs asynchronously
const handleClick = async () => {
  // Update state
  setCount(count + 1)

  // Access Plugin API
  const selection = figma.currentPage.selection

  // Make network request (via iframe)
  const data = await fetchFromAPI()

  // Widget re-renders after state update
}
```

### Re-rendering

When state updating code completes:
1. Widget state is updated
2. Widget automatically re-renders
3. All clients see the updated widget via Multiplayer

---

## File Loading

Pages in Figma files are loaded **as needed**, and most widgets will not require access to a user's complete Figma document.

### Performance Considerations

⚠️ **Important for Large Files**

If your widget acts on multiple or all pages in a user's file, you can still improve the experience in very large files by having your widget [load pages only as needed](https://developers.figma.com/docs/plugins/accessing-document/).

### Best Practices

**Load on Demand**
- Don't load entire document by default
- Load specific pages when user requests them
- Use `documentAccess: "dynamic-page"` in manifest

**Incremental Loading**

```tsx
const loadPage = async (pageId: string) => {
  // Load specific page only when needed
  const page = await figma.getNodeByIdAsync(pageId)
  // Process page data
}
```

### Type Definitions

TypeScript type definitions are available in the [official typings](https://github.com/figma/widget-typings) to help with document access patterns.

---

## Network Access

Additional network security is enforced if your widget [limits network access](https://developers.figma.com/docs/widgets/widget-manifest/#networkaccess) in the manifest.

### Security Enforcement

When network access is limited, if your widget attempts to access a domain that isn't specified in your widget's manifest, Figma **blocks that attempt** and returns a **content-security policy (CSP) error**.

### Scope of Enforcement

**Widget Requests Only**

The enforcement of domain access is limited only to requests made by the widget, such as:
- Fetch API requests
- Public REST API calls
- Direct network requests from widget code

### Iframe Exception

⚠️ **Important Distinction**

If your widget renders a website in an iframe, network access limits only apply directly to the website's domain. Network access limits **do not affect resources needed by that website**.

**Example Scenario**:

```json
// manifest.json
{
  "networkAccess": {
    "allowedDomains": ["figma.com"]
  }
}
```

With this configuration:
- ✅ Your widget can load `figma.com` in an iframe
- ❌ Your widget is prevented from rendering content from other domains
- ✅ BUT: `figma.com` can still load its own external resources (e.g., Google Analytics scripts)

### Best Practices

**Explicit Domain Listing**

Always specify domains in your manifest:

```json
{
  "networkAccess": {
    "allowedDomains": [
      "api.example.com",
      "cdn.example.com"
    ]
  }
}
```

**Testing Network Access**

Test your widget with network restrictions enabled to catch CSP errors early in development.

---

## Resources

### Core Concepts

- **[Plugin Sandbox](https://developers.figma.com/docs/plugins/how-plugins-run/)** - Understanding the execution environment
- **[Widget State](https://developers.figma.com/docs/widgets/widget-state/)** - Managing widget state
- **[Accessing Documents](https://developers.figma.com/docs/plugins/accessing-document/)** - Loading pages on demand

### API References

- **[useSyncedState](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/)** - Synchronized state management
- **[figma.activeUsers](https://developers.figma.com/docs/plugins/api/figma/#activeusers)** - Accessing active users
- **[Widget Typings](https://github.com/figma/widget-typings)** - Official TypeScript definitions

### Manifest Configuration

- **[Widget Manifest](https://developers.figma.com/docs/widgets/widget-manifest/)** - Complete manifest reference
- **[Network Access](https://developers.figma.com/docs/widgets/widget-manifest/#networkaccess)** - Network security configuration

### Related Topics

- **[Figma and FigJam Widgets](https://developers.figma.com/docs/widgets/figma-figjam-widgets/)** - Widget contexts
- **[How Plugins Run](https://developers.figma.com/docs/plugins/how-plugins-run/)** - Plugin execution model

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to dive deeper? Here's what to explore next:

1. **Understand State Management** - [Learn about widget state →](https://developers.figma.com/docs/widgets/widget-state/)
2. **Handle User Events** - [Make widgets interactive →](https://developers.figma.com/docs/widgets/handling-user-events/)
3. **Optimize Performance** - [Implement lazy loading →](https://developers.figma.com/docs/plugins/accessing-document/)
4. **Configure Network Access** - [Set up manifest security →](https://developers.figma.com/docs/widgets/widget-manifest/#networkaccess)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
