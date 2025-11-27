# Figma Widget API - Setting Editor Type

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Understanding Editor Types](#understanding-editor-types)
3. [Declaring Editor Type](#declaring-editor-type)
4. [Choosing an Editor Type](#choosing-an-editor-type)
5. [Supported APIs](#supported-apis)
6. [Conditional Logic](#conditional-logic)
7. [Best Practices](#best-practices)
8. [Resources](#resources)
9. [Next Steps](#next-steps)

---

## Overview

Widgets are custom interactive objects that run in **Figma design** and **FigJam** files.

These environments support different kinds of work at each stage of the design process:
- **FigJam**: Brainstorming and workshopping
- **Figma Design**: High-fidelity designs and production work

[Compare Figma and FigJam →](https://help.figma.com/hc/en-us/articles/1500004290201-Compare-Figma-and-FigJam)

### Key Concept

The Plugin and Widget APIs treat Figma design and FigJam files as **different editor types**. You can create widgets for:
- A specific editor type (FigJam only or Figma only)
- Both editor types (universal widgets)
- Widgets that behave differently in each editor

---

## Understanding Editor Types

### What is an Editor Type?

Editor types define the environment where your widget runs:

| Editor Type    | Description        | Use Cases                                                   |
| -------------- | ------------------ | ----------------------------------------------------------- |
| **`"figma"`**  | Figma design files | Precise design work, component libraries, production assets |
| **`"figjam"`** | FigJam boards      | Brainstorming, diagramming, workshops, collaboration        |

### Setting the Editor Type

⚠️ **Required Configuration**

For your widget to work, you need to declare which editor type(s) your widget can run in. You do this by setting the **`editorType` field** in the widget's manifest.

```json
{
  "name": "MyWidget",
  "id": "737805260747778093",
  "api": "1.0.0",
  "widgetApi": "1.0.0",
  "editorType": ["figma", "figjam"],
  "containsWidget": true,
  "main": "code.js",
  "ui": "ui.html"
}
```

---

## Declaring Editor Type

### Manifest Configuration

The `editorType` field is an array that specifies which environments your widget supports.

**Syntax:**
```json
"editorType": ["figma", "figjam"]
```

**Valid Values:**
- `"figma"` - Figma design files only
- `"figjam"` - FigJam boards only
- Both values - Universal widget

📝 **Development Note**

Declaring an editor type impacts which files your **published widget** can run in. During the development process, you can insert and run widgets in both file types regardless of the manifest setting.

---

## Choosing an Editor Type

### Option 1: FigJam Only

Create widgets that only run in FigJam files. This is useful when your widget is best suited to brainstorming or collaborative environments.

```json
"editorType": [
  "figjam"
]
```

**Use Cases:**
- Workshop and brainstorming tools
- Voting and polling widgets
- Sticky note organizers
- Game and icebreaker widgets

### Option 2: Figma Design Only

Create widgets that only run in Figma design files. This is useful when your widget needs precise design capabilities.

```json
"editorType": [
  "figma"
]
```

**Use Cases:**
- Design system components
- Measurement and specification tools
- Production-ready asset generators
- Precision layout tools

### Option 3: Universal (Both Editors)

Create widgets that run in both editor types. **This gives people more flexibility** when using your widget.

```json
"editorType": [
  "figjam",
  "figma"
]
```

**Benefits:**
- Maximum accessibility
- Users can choose their preferred environment
- Consistent experience across workflows

**Considerations:**
- Must handle API differences between editors
- May need conditional logic for editor-specific features
- Requires testing in both environments

---

## Supported APIs

### API Availability

When you declare a specific editor type, you can only access APIs that are available on that editor type.

### Widget API Compatibility

**Most Widget APIs work in both editors:**
- Core components (AutoLayout, Text, Frame, etc.)
- Supported properties for components
- State management hooks
- Event handlers

### Editor-Specific Features

⚠️ **Important Differences**

There are some features of the Widget (and Plugin) API that are **only supported on certain editor types**.

**Example: Stickable Hooks**

Stickable hooks are **only supported in FigJam files**:

```tsx
// Only works in FigJam
const stickable = useStickable()
```

**Learn More:**

To learn more about these differences, read the [Figma design or FigJam widgets](https://developers.figma.com/docs/widgets/figma-figjam-widgets/) guide.

---

## Conditional Logic

### Detecting Current Editor

You can use the method **`figma.editorType`** to detect which editor your widget is running in. This returns a string value of either `"figma"` or `"figjam"`.

### Basic Detection

```tsx
if (figma.editorType === 'figjam') {
  figma.createShapeWithText()
}
```

### Conditional Rendering

```tsx
function Widget() {
  const [message, setMessage] = useSyncedState("message", "")

  return (
    <AutoLayout>
      <Text>
        {figma.editorType === 'figjam'
          ? 'Running in FigJam'
          : 'Running in Figma Design'}
      </Text>
    </AutoLayout>
  )
}
```

### Editor-Specific Features

```tsx
onClick={async () => {
  if (figma.editorType === 'figjam') {
    // FigJam-specific code
    const shape = figma.createShapeWithText()
    shape.shapeType = 'ROUNDED_RECTANGLE'
  } else {
    // Figma Design-specific code
    const frame = figma.createFrame()
    frame.layoutMode = 'HORIZONTAL'
  }
}}
```

### Comprehensive Example

```tsx
function UniversalWidget() {
  const [count, setCount] = useSyncedState("count", 0)

  const handleClick = async () => {
    setCount(count + 1)

    // Editor-specific behavior
    if (figma.editorType === 'figjam') {
      figma.notify('Clicked in FigJam!')
    } else {
      figma.notify('Clicked in Figma Design!')
    }
  }

  return (
    <AutoLayout onClick={handleClick}>
      <Text>
        Click count: {count}
      </Text>
      <Text fontSize={10}>
        Editor: {figma.editorType}
      </Text>
    </AutoLayout>
  )
}
```

---

## Best Practices

### 1. Set Clear Expectations

📝 **User Experience Tip**

There are functions that aren't supported in both editor types. This means people using your widget may have different experiences across file types.

**Help users understand:**
- Provide clear signifiers about editor-specific features
- Include detailed instructions
- Show helpful error messages when features aren't available

### 2. Test in Both Environments

If your widget supports both editor types:

```bash
# Test workflow
1. Test in FigJam file
2. Test in Figma design file
3. Verify conditional logic works correctly
4. Check error handling for unsupported APIs
```

[Learn more about testing →](https://developers.figma.com/docs/widgets/testing/)

### 3. Graceful Degradation

Handle editor-specific features gracefully:

```tsx
onClick={async () => {
  if (figma.editorType === 'figjam') {
    // Use FigJam-specific feature
    figma.createShapeWithText()
  } else {
    // Provide alternative for Figma Design
    figma.notify('This feature is only available in FigJam')
  }
}}
```

### 4. Document Editor Requirements

If your widget only works well in one editor:
- Specify this in your widget description
- Explain why one editor is preferred
- Guide users to the appropriate environment

### 5. Choose the Right Strategy

**Use Single Editor When:**
- Widget relies heavily on editor-specific APIs
- Workflow is clearly tied to one environment
- Different behavior in each editor would confuse users

**Use Both Editors When:**
- Widget functionality is editor-agnostic
- You can provide good experience in both
- You want maximum accessibility

---

## Resources

### Configuration

- **[Widget Manifest](https://developers.figma.com/docs/widgets/widget-manifest/)** - Complete manifest reference
- **[editorType Field](https://developers.figma.com/docs/widgets/widget-manifest/#editortype)** - Field documentation

### Editor Differences

- **[Figma Design or FigJam Widgets](https://developers.figma.com/docs/widgets/figma-figjam-widgets/)** - Detailed comparison
- **[Compare Figma and FigJam](https://help.figma.com/hc/en-us/articles/1500004290201-Compare-Figma-and-FigJam)** - Product differences

### Development

- **[Working with Widgets](https://developers.figma.com/docs/widgets/working-with-widgets/)** - Core principles
- **[Testing Guide](https://developers.figma.com/docs/widgets/testing/)** - Testing strategies

### API References

- **[figma.editorType](https://developers.figma.com/docs/plugins/api/figma/#editortype)** - Runtime detection
- **[Plugin API Reference](https://developers.figma.com/docs/plugins/api/api-reference/)** - Complete API docs

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to optimize for different editors? Here's what to explore next:

1. **Understand Editor Differences** - [Learn about Figma vs FigJam →](https://developers.figma.com/docs/widgets/figma-figjam-widgets/)
2. **Learn Multiplayer Patterns** - [Explore widget state and multiplayer →](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)
3. **Test Your Widget** - [Follow testing best practices →](https://developers.figma.com/docs/widgets/testing/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
