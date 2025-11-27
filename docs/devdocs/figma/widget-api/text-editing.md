# Figma Widget API - Text Editing

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [The Input Component](#the-input-component)
3. [Basic Implementation](#basic-implementation)
4. [Styling and Configuration](#styling-and-configuration)
5. [Advanced Patterns](#advanced-patterns)
6. [Resources](#resources)
7. [Next Steps](#next-steps)

---

## Overview

To allow users to enter text directly in your widget, use the **[Input](https://developers.figma.com/docs/widgets/api/component-Input/)** component.

### Key Features

The Input component provides:

- **Text input** - Users can type and edit text directly in the widget
- **onTextEditEnd callback** - Fires when the user blurs (exits) the Input component
- **Placeholder text** - Display hints when the input is empty
- **Custom styling** - Style the text, frame, and appearance
- **Synced state** - Automatically synchronize input across all users

⚠️ **Important Behavior**

[onTextEditEnd](https://developers.figma.com/docs/widgets/api/component-Input/#ontexteditend) does **not** fire on every key stroke. It only fires when the user finishes editing and clicks away from the input.

---

## The Input Component

### Component Props

The Input component allows you to specify and style:

- **The text itself** - Via the `value` prop
- **A placeholder** - Via [placeholderProps](https://developers.figma.com/docs/widgets/api/component-Input/#placeholderprops)
- **A wrapping frame** - Via [inputFrameProps](https://developers.figma.com/docs/widgets/api/component-Input/#inputframeprops)

### Event Handling

The [onTextEditEnd](https://developers.figma.com/docs/widgets/api/component-Input/#ontexteditend) callback fires when the user blurs the Input component. This is where you update your widget's state with the new text value.

---

## Basic Implementation

### Simple Text Input

Typically, you will use a synced variable (e.g., [useSyncedState](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/) or [useSyncedMap](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/)) to store text displayed by the Input component, which is specified via its [value](https://developers.figma.com/docs/widgets/api/component-Input/#value) prop. In the [onTextEditEnd](https://developers.figma.com/docs/widgets/api/component-Input/#ontexteditend) callback, you can then update the synced variable accordingly.

**Basic Example:**

```tsx
const { widget } = figma
const { useSyncedState, Input } = widget

function InputWidget() {
  const [text, setText] = useSyncedState("text", "")

  return (
    <Input
      value={text}
      placeholder="Type name"
      onTextEditEnd={(e) => {
        setText(e.characters)
      }}
      fontSize={64}
      fill="#7f1d1d"
      width={500}
      inputFrameProps={{
        fill: "#fee2e2",
        stroke: "#b91c1c",
        cornerRadius: 16,
        padding: 20,
      }}
      inputBehavior="wrap"
    />
  )
}

widget.register(InputWidget)
```

### Visual Result

The example above creates a styled text input that looks like this:

![Example input component](https://static.figma.com/uploads/52546777ad3920192e1e9f468f3c66b130ed6891)

---

## Styling and Configuration

### Text Styling

You can style the text itself using standard text properties:

```tsx
<Input
  value={text}
  fontSize={64}        // Text size
  fill="#7f1d1d"       // Text color
  fontFamily="Inter"   // Font family
  fontWeight={700}     // Font weight
  textCase="upper"     // Text transformation
  letterSpacing={2}    // Letter spacing
  onTextEditEnd={(e) => setText(e.characters)}
/>
```

### Placeholder Styling

Use `placeholderProps` to customize the appearance of placeholder text:

```tsx
<Input
  value={text}
  placeholder="Enter your name"
  placeholderProps={{
    fill: "#999999",       // Placeholder color
    opacity: 0.5,          // Placeholder opacity
    fontSize: 48,          // Different size than main text
  }}
  onTextEditEnd={(e) => setText(e.characters)}
/>
```

### Frame Styling

Use `inputFrameProps` to style the container frame around the input:

```tsx
<Input
  value={text}
  inputFrameProps={{
    fill: "#fee2e2",           // Background color
    stroke: "#b91c1c",         // Border color
    strokeWidth: 2,            // Border width
    cornerRadius: 16,          // Rounded corners
    padding: 20,               // Internal padding
  }}
  onTextEditEnd={(e) => setText(e.characters)}
/>
```

### Input Behavior

Control how text wraps using the `inputBehavior` prop:

```tsx
<Input
  value={text}
  inputBehavior="wrap"    // Text wraps to multiple lines
  width={500}             // Fixed width for wrapping
  onTextEditEnd={(e) => setText(e.characters)}
/>

// Or for single-line input:
<Input
  value={text}
  inputBehavior="truncate"  // Single line, truncated with ellipsis
  onTextEditEnd={(e) => setText(e.characters)}
/>
```

---

## Advanced Patterns

### Multiple Inputs with Synced Map

Use [useSyncedMap](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/) to manage multiple text inputs:

```tsx
const { widget } = figma
const { useSyncedMap, AutoLayout, Input, Text } = widget

function MultiInputWidget() {
  const inputs = useSyncedMap("inputs")

  return (
    <AutoLayout direction="vertical" spacing={16}>
      <Text fontSize={24}>User Information</Text>

      <Input
        value={inputs.get("name") || ""}
        placeholder="Name"
        onTextEditEnd={(e) => inputs.set("name", e.characters)}
        width={300}
      />

      <Input
        value={inputs.get("email") || ""}
        placeholder="Email"
        onTextEditEnd={(e) => inputs.set("email", e.characters)}
        width={300}
      />

      <Input
        value={inputs.get("message") || ""}
        placeholder="Message"
        inputBehavior="wrap"
        onTextEditEnd={(e) => inputs.set("message", e.characters)}
        width={300}
        height={100}
      />
    </AutoLayout>
  )
}

widget.register(MultiInputWidget)
```

### Validation and Processing

Process or validate input before saving:

```tsx
const { widget } = figma
const { useSyncedState, Input, Text } = widget

function ValidatedInputWidget() {
  const [email, setEmail] = useSyncedState("email", "")
  const [error, setError] = useSyncedState("error", "")

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(text)) {
      setError("Invalid email format")
      return false
    }
    setError("")
    return true
  }

  return (
    <>
      <Input
        value={email}
        placeholder="Enter email"
        onTextEditEnd={(e) => {
          if (validateEmail(e.characters)) {
            setEmail(e.characters)
          }
        }}
        width={300}
      />
      {error && (
        <Text fill="#ff0000" fontSize={14}>
          {error}
        </Text>
      )}
    </>
  )
}

widget.register(ValidatedInputWidget)
```

### Dynamic Width Input

Create inputs that adjust to their container:

```tsx
<AutoLayout width="fill-parent" padding={20}>
  <Input
    value={text}
    placeholder="Full width input"
    onTextEditEnd={(e) => setText(e.characters)}
    width="fill-parent"
    inputFrameProps={{
      fill: "#ffffff",
      stroke: "#cccccc",
      padding: 12,
    }}
  />
</AutoLayout>
```

---

## Resources

### Input Component

- **[Input Component](https://developers.figma.com/docs/widgets/api/component-Input/)** - Complete API reference
- **[onTextEditEnd](https://developers.figma.com/docs/widgets/api/component-Input/#ontexteditend)** - Event callback documentation
- **[placeholderProps](https://developers.figma.com/docs/widgets/api/component-Input/#placeholderprops)** - Placeholder styling options
- **[inputFrameProps](https://developers.figma.com/docs/widgets/api/component-Input/#inputframeprops)** - Frame styling options
- **[value](https://developers.figma.com/docs/widgets/api/component-Input/#value)** - Text value property

### State Management

- **[useSyncedState](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/)** - Simple synced state hook
- **[useSyncedMap](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/)** - Map-based synced state
- **[Widget State & Multiplayer](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)** - State synchronization guide

### Layout Components

- **[AutoLayout](https://developers.figma.com/docs/widgets/api/component-AutoLayout/)** - Container for arranging components
- **[Text](https://developers.figma.com/docs/widgets/api/component-Text/)** - Display-only text component

### Related Topics

- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - Other interaction patterns
- **[Working with Lists](https://developers.figma.com/docs/widgets/working-with-lists/)** - Dynamic list rendering

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to build more complex interfaces? Here's what to explore next:

1. **Work with Lists** - [Learn dynamic list rendering →](https://developers.figma.com/docs/widgets/working-with-lists/)
2. **Handle User Events** - [Add click interactions →](https://developers.figma.com/docs/widgets/handling-user-events/)
3. **Manage State** - [Deep dive into widget state →](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
