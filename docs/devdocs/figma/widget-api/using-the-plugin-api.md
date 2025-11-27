# Figma Widget API - Using the Plugin API

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Widget API vs Plugin API](#widget-api-vs-plugin-api)
3. [Where to Use Plugin API](#where-to-use-plugin-api)
4. [Usage Pattern](#usage-pattern)
5. [Common Use Cases](#common-use-cases)
6. [Examples](#examples)
7. [Resources](#resources)
8. [Next Steps](#next-steps)

---

## Overview

As you probably already figured out, the Widget API and [Plugin API](https://developers.figma.com/docs/plugins/) are very much related and meant to be used together when building widgets.

### Key Principle

⚠️ **Important Constraint**

The Plugin API can **only be used in event handlers and hooks**. It cannot be used directly in rendering code.

---

## Widget API vs Plugin API

You can think of this model as:

### 1. Widget API

**Purpose**: An interface to **describing what goes on the canvas**

- Declarative rendering
- JSX components
- Visual representation
- On-canvas UI elements

### 2. Plugin API

**Purpose**: An interface to **manipulate things on the canvas**

- Imperative operations
- Document access
- Node manipulation
- Data reading and writing

### The Relationship

The two APIs work together:
- **Widget API** defines how your widget looks
- **Plugin API** enables your widget to interact with the document

---

## Where to Use Plugin API

The Plugin API is accessible in specific contexts within your widget code:

### ✅ Valid Contexts

**Event Handlers**
```tsx
onClick={() => {
  // Plugin API can be used here
  const selection = figma.currentPage.selection
}}
```

**Hooks**
```tsx
useEffect(() => {
  // Plugin API can be used here
  const nodes = figma.currentPage.findAll()
})
```

**Async Functions**
```tsx
const handleClick = async () => {
  // Plugin API can be used here
  const node = await figma.getNodeByIdAsync(nodeId)
}
```

### ❌ Invalid Contexts

**Rendering Code**
```tsx
function Widget() {
  // ❌ CANNOT use Plugin API here
  const page = figma.currentPage  // ERROR!

  return <Text>Widget</Text>
}
```

⚠️ **Why This Restriction?**

Rendering code must be synchronous and state-dependent to ensure consistent rendering across all clients. The Plugin API provides access to document data that could cause inconsistencies in multiplayer scenarios.

---

## Usage Pattern

Your widget code will typically follow this pattern:

### Pseudocode Structure

```tsx
const { widget } = figma
const { AutoLayout, Text, useWidgetId } = widget

function AverageWidget() {
  const widgetId = useWidgetId()

  return (
    // Use the Widget JSX API here to describe how to render the widget!
    <AutoLayout
      onClick={() => {

        // Use Plugin API here in response to user interactions!
        const widgetNode = await figma.getNodeByIdAsync(widgetId) as WidgetNode

      }}
    >
      <Text>Hello</Text>
    </AutoLayout>
  )
}

widget.register(AverageWidget)
```

### The Pattern

1. **Rendering Phase** (Widget API)
   - Use JSX to describe the UI
   - Depend only on widget state
   - No Plugin API calls

2. **Interaction Phase** (Plugin API)
   - Handle user events
   - Access and manipulate the document
   - Update widget state if needed
   - Widget re-renders automatically

---

## Common Use Cases

### Accessing the Current Selection

```tsx
onClick={async () => {
  const selection = figma.currentPage.selection
  if (selection.length > 0) {
    console.log('Selected nodes:', selection)
  }
}}
```

### Reading Node Properties

```tsx
onClick={async () => {
  const node = await figma.getNodeByIdAsync(nodeId)
  if (node && 'width' in node) {
    const width = node.width
    const height = node.height
  }
}}
```

### Creating New Nodes

```tsx
onClick={async () => {
  const rect = figma.createRectangle()
  rect.x = 100
  rect.y = 100
  rect.resize(200, 100)
  figma.currentPage.appendChild(rect)
}}
```

### Finding Nodes

```tsx
onClick={async () => {
  // Find all text nodes
  const textNodes = figma.currentPage.findAll(node =>
    node.type === 'TEXT'
  )

  // Find specific node by name
  const foundNode = figma.currentPage.findOne(node =>
    node.name === 'MyNode'
  )
}}
```

### Modifying Node Properties

```tsx
onClick={async () => {
  const selection = figma.currentPage.selection
  for (const node of selection) {
    if ('fills' in node) {
      node.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
    }
  }
}}
```

---

## Examples

### Counter that Modifies Selection

```tsx
const { widget } = figma
const { AutoLayout, Text, useSyncedState } = widget

function SelectionCounter() {
  const [count, setCount] = useSyncedState('count', 0)

  return (
    <AutoLayout
      direction="vertical"
      onClick={async () => {
        // Get selection using Plugin API
        const selection = figma.currentPage.selection

        // Update widget state
        setCount(selection.length)

        // Show notification
        figma.notify(`${selection.length} items selected`)
      }}
    >
      <Text>Selected items: {count}</Text>
      <Text fontSize={12}>Click to update</Text>
    </AutoLayout>
  )
}

widget.register(SelectionCounter)
```

### Widget that Creates Shapes

```tsx
function ShapeCreator() {
  const [created, setCreated] = useSyncedState('created', 0)

  return (
    <AutoLayout
      onClick={async () => {
        // Create a new rectangle using Plugin API
        const rect = figma.createRectangle()
        rect.x = 100 + (created * 50)
        rect.y = 100
        rect.resize(100, 100)
        rect.fills = [{
          type: 'SOLID',
          color: { r: Math.random(), g: Math.random(), b: Math.random() }
        }]

        figma.currentPage.appendChild(rect)

        // Update widget state
        setCreated(created + 1)

        figma.notify(`Created ${created + 1} rectangles`)
      }}
    >
      <Text>Create Rectangle ({created} created)</Text>
    </AutoLayout>
  )
}

widget.register(ShapeCreator)
```

### Widget that Reads Node Data

```tsx
function NodeInspector() {
  const [nodeInfo, setNodeInfo] = useSyncedState('nodeInfo', '')

  return (
    <AutoLayout
      direction="vertical"
      onClick={async () => {
        const selection = figma.currentPage.selection

        if (selection.length === 0) {
          setNodeInfo('No selection')
          return
        }

        const node = selection[0]
        const info = `Type: ${node.type}\nName: ${node.name}\nID: ${node.id}`

        setNodeInfo(info)
      }}
    >
      <Text>Click to inspect selected node</Text>
      {nodeInfo && <Text fontSize={10}>{nodeInfo}</Text>}
    </AutoLayout>
  )
}

widget.register(NodeInspector)
```

---

## Resources

### Plugin API Documentation

- **[Plugin API Overview](https://developers.figma.com/docs/plugins/)** - Complete plugin API guide
- **[Plugin API Reference](https://developers.figma.com/docs/plugins/api/api-reference/)** - Full API documentation
- **[Accessing the Document](https://developers.figma.com/docs/plugins/accessing-document/)** - Working with nodes and pages

### Widget-Specific Resources

- **[How Widgets Run](https://developers.figma.com/docs/widgets/how-widgets-run/)** - Understanding execution model
- **[Widget State](https://developers.figma.com/docs/widgets/widget-state/)** - State management
- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - Event handling patterns

### API References

- **[useWidgetId Hook](https://developers.figma.com/docs/widgets/api/properties/widget-usewidgetid/)** - Get widget's node ID
- **[figma.getNodeByIdAsync](https://developers.figma.com/docs/plugins/api/figma/#getnodebyidasync)** - Async node access
- **[figma.currentPage](https://developers.figma.com/docs/plugins/api/figma/#currentpage)** - Current page access

### Related Topics

- **[Working with Widgets](https://developers.figma.com/docs/widgets/working-with-widgets/)** - Advanced widget patterns
- **[Plugin Development](https://developers.figma.com/docs/plugins/)** - Full plugin capabilities

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to build more powerful widgets? Here's what to explore next:

1. **Learn Plugin API Capabilities** - [Explore the Plugin API →](https://developers.figma.com/docs/plugins/)
2. **Work with Document Nodes** - [Access and manipulate nodes →](https://developers.figma.com/docs/plugins/accessing-document/)
3. **Advanced Widget Patterns** - [Discover working with widgets →](https://developers.figma.com/docs/widgets/working-with-widgets/)
4. **Study Complex Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
