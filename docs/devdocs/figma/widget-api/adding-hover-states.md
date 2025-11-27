# Figma Widget API - Adding Hover States

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [The hoverStyle Prop](#the-hoverstyle-prop)
3. [Hover Targets](#hover-targets)
4. [Recursive Application](#recursive-application)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Resources](#resources)
8. [Next Steps](#next-steps)

---

## Overview

Any component can take an optional **`hoverStyle`** property that takes property overrides. These overrides will be applied when a user hovers over a parent hover target.

### Why Use Hover States?

- **Visual feedback** - Show users that elements are interactive
- **Improved UX** - Clear indication of clickable areas
- **Professional polish** - Make widgets feel more responsive
- **Accessibility** - Help users understand interaction points

### Supported Properties

The `hoverStyle` prop accepts the type of [HoverStyle](https://developers.figma.com/docs/widgets/api/type-HoverStyle/) and **only** the following properties can be overridden:

- **`fill`** - Background color
- **`stroke`** - Border color
- **`opacity`** - Transparency level

⚠️ **Limited Property Support**

Only `fill`, `stroke`, and `opacity` can be modified in hover states. Other properties like `fontSize`, `padding`, or `cornerRadius` cannot be changed on hover.

---

## The hoverStyle Prop

### Basic Syntax

```tsx
<Component
  hoverStyle={{
    fill: '#000000',
    stroke: '#FFFFFF',
    opacity: 0.8
  }}
>
  Content
</Component>
```

### Property Types

**fill:**
- Hex code string: `'#000000'`
- Color object: `{ r: 0, g: 0, b: 0 }`
- Paint array: `[{ type: 'solid', color: { r: 0, g: 0, b: 0 } }]`

**stroke:**
- Hex code string: `'#FFFFFF'`
- Color object: `{ r: 1, g: 1, b: 1 }`
- Paint array: `[{ type: 'solid', color: { r: 1, g: 1, b: 1 } }]`

**opacity:**
- Number between 0 and 1: `0.8`

---

## Hover Targets

A valid hover target is currently defined as any component that has an **`onClick`** or **`onTextEditEnd`** event handler on it.

### What Makes a Hover Target

**Valid hover targets:**
```tsx
// Component with onClick
<Text onClick={() => console.log('clicked')}>
  Clickable Text
</Text>

// Component with onTextEditEnd
<Input
  onTextEditEnd={(e) => setText(e.characters)}
  value={text}
/>
```

**Not hover targets:**
```tsx
// No event handler - hoverStyle won't activate
<Text hoverStyle={{ fill: '#000' }}>
  Not clickable
</Text>
```

⚠️ **Event Handler Required**

For `hoverStyle` to work, the component (or a parent component) must have an `onClick` or `onTextEditEnd` handler.

---

## Recursive Application

When hovering over a hover target, the `hoverStyle` of the target and **all of its children recursively** are applied, unless they are in a hover target that isn't currently hovered.

### Inheritance Behavior

```tsx
<AutoLayout
  onClick={() => console.log('clicked')}
  hoverStyle={{ fill: '#000000' }}
>
  <Text hoverStyle={{ fill: '#FFFFFF' }}>
    This text will turn white when hovering over AutoLayout
  </Text>

  <AutoLayout hoverStyle={{ opacity: 0.5 }}>
    This will also be affected
  </AutoLayout>
</AutoLayout>
```

### Nested Hover Targets

```tsx
<AutoLayout
  onClick={() => console.log('outer')}
  hoverStyle={{ fill: '#000000' }}
>
  <Text>Outer hover area</Text>

  <AutoLayout
    onClick={() => console.log('inner')}
    hoverStyle={{ fill: '#0066FF' }}
  >
    <Text>Inner hover area - has its own hover target</Text>
  </AutoLayout>
</AutoLayout>
```

When hovering over the inner `AutoLayout`, only its hover styles apply (not the outer one's), because it's a separate hover target.

---

## Examples

### Basic Button with Hover

In the below example, hovering over the button will make the containing `AutoLayout` black and the nested `Text` inside of it white.

```tsx
const { widget } = figma
const { useSyncedState, AutoLayout, Text } = widget

function Widget() {
  const [count, setCount] = useSyncedState('count', 0)

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={'#FFFFFF'}
      stroke={'#E6E6E6'}
      onClick={() => setCount(count + 1)}
      hoverStyle={{
        fill: '#000000',
      }}
    >
      <Text
        fill="#000000"
        hoverStyle={{
          fill: '#FFFFFF',
        }}
      >
        Count: {String(count)}
      </Text>
    </AutoLayout>
  )
}

widget.register(Widget)
```

**Result:**

![Hover button](https://developers.figma.com/assets/images/hover-button-6a47ce07f8c6983d93533c757fe3842d.gif)

### Opacity Change on Hover

Create a subtle fade effect:

```tsx
<AutoLayout
  padding={12}
  fill="#0066FF"
  cornerRadius={8}
  onClick={() => figma.notify('Clicked!')}
  hoverStyle={{
    opacity: 0.8
  }}
>
  <Text fill="#FFFFFF">Hover me</Text>
</AutoLayout>
```

### Stroke Highlight on Hover

Add a border highlight:

```tsx
<AutoLayout
  padding={16}
  fill="#FFFFFF"
  stroke="#CCCCCC"
  strokeWidth={1}
  cornerRadius={8}
  onClick={() => console.log('clicked')}
  hoverStyle={{
    stroke: '#0066FF'
  }}
>
  <Text>Click here</Text>
</AutoLayout>
```

### Combined Effects

Use multiple hover properties together:

```tsx
<AutoLayout
  padding={20}
  fill="#F5F5F5"
  stroke="#E0E0E0"
  cornerRadius={12}
  onClick={() => console.log('clicked')}
  hoverStyle={{
    fill: '#E8F4FF',
    stroke: '#0066FF',
    opacity: 0.9
  }}
>
  <Text fill="#333333" hoverStyle={{ fill: '#0066FF' }}>
    Hover for multiple effects
  </Text>
</AutoLayout>
```

### List Item Hover

Create a hoverable list:

```tsx
const { widget } = figma
const { AutoLayout, Text } = widget

function HoverableList() {
  const items = ['Item 1', 'Item 2', 'Item 3']

  return (
    <AutoLayout direction="vertical" spacing={4}>
      {items.map((item, index) => (
        <AutoLayout
          key={item}
          padding={12}
          fill="#FFFFFF"
          stroke="#E0E0E0"
          cornerRadius={4}
          width={200}
          onClick={() => figma.notify(`Clicked ${item}`)}
          hoverStyle={{
            fill: '#F0F0F0',
            stroke: '#0066FF'
          }}
        >
          <Text hoverStyle={{ fill: '#0066FF' }}>
            {item}
          </Text>
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}

widget.register(HoverableList)
```

### Icon Button Hover

Create a simple icon button with hover effect:

```tsx
<AutoLayout
  padding={8}
  fill="#FFFFFF"
  stroke="#CCCCCC"
  cornerRadius={4}
  onClick={() => console.log('icon clicked')}
  hoverStyle={{
    fill: '#F5F5F5',
    stroke: '#0066FF'
  }}
>
  <Text fontSize={20}>⚙️</Text>
</AutoLayout>
```

### Card with Hover Effect

Create an interactive card:

```tsx
<AutoLayout
  direction="vertical"
  spacing={12}
  padding={20}
  fill="#FFFFFF"
  stroke="#E0E0E0"
  cornerRadius={12}
  width={250}
  onClick={() => console.log('card clicked')}
  hoverStyle={{
    fill: '#FAFAFA',
    stroke: '#0066FF',
    opacity: 0.95
  }}
>
  <Text fontSize={18} fontWeight={700}>
    Card Title
  </Text>
  <Text fontSize={14} fill="#666666" hoverStyle={{ fill: '#0066FF' }}>
    Hover to see the effect
  </Text>
</AutoLayout>
```

---

## Best Practices

### Visual Feedback

**Do:**
- Use subtle changes that don't distract
- Keep hover effects consistent across similar components
- Provide clear indication that something is clickable

```tsx
// ✅ Subtle, professional hover effect
<Text
  onClick={() => console.log('clicked')}
  hoverStyle={{ opacity: 0.8 }}
>
  Click me
</Text>
```

**Don't:**
- Make hover effects too dramatic
- Use inconsistent hover styles

```tsx
// ❌ Too dramatic - jarring for users
<Text
  onClick={() => console.log('clicked')}
  hoverStyle={{ fill: '#FF0000', opacity: 0.3 }}
>
  Click me
</Text>
```

### Performance

- Hover effects are lightweight and don't impact performance
- Use them liberally on interactive elements
- No need to optimize or limit hover states

### Accessibility

- Hover states improve accessibility by showing interactive elements
- Always pair hover states with proper click handlers
- Consider users on touch devices (hover may not always apply)

### Color Contrast

Ensure hover states maintain good contrast:

```tsx
// ✅ Good contrast in both states
<AutoLayout
  fill="#0066FF"
  onClick={() => console.log('clicked')}
  hoverStyle={{ fill: '#0052CC' }}
>
  <Text fill="#FFFFFF">Button</Text>
</AutoLayout>

// ❌ Poor contrast on hover
<AutoLayout
  fill="#0066FF"
  onClick={() => console.log('clicked')}
  hoverStyle={{ fill: '#E0E0E0' }}
>
  <Text fill="#FFFFFF">Button</Text> {/* White on light gray */}
</AutoLayout>
```

### Consistent Patterns

Establish hover patterns and use them consistently:

```tsx
// Define reusable hover styles
const buttonHoverStyle = {
  opacity: 0.8
}

const linkHoverStyle = {
  fill: '#0066FF'
}

// Apply consistently
<Text onClick={handler1} hoverStyle={linkHoverStyle}>Link 1</Text>
<Text onClick={handler2} hoverStyle={linkHoverStyle}>Link 2</Text>
```

---

## Resources

### Hover State API

- **[HoverStyle Type](https://developers.figma.com/docs/widgets/api/type-HoverStyle/)** - Complete type definition
- **[BaseProps](https://developers.figma.com/docs/widgets/api/component-Text/#baseprops)** - hoverStyle is part of BaseProps

### Related Components

- **[Text Component](https://developers.figma.com/docs/widgets/api/component-Text/)** - Supports hoverStyle
- **[AutoLayout Component](https://developers.figma.com/docs/widgets/api/component-AutoLayout/)** - Supports hoverStyle
- **[Frame Component](https://developers.figma.com/docs/widgets/api/component-Frame/)** - Supports hoverStyle
- **[Rectangle Component](https://developers.figma.com/docs/widgets/api/component-Rectangle/)** - Supports hoverStyle

### Related Topics

- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - onClick and event handlers
- **[Managing Multiple Widgets](https://developers.figma.com/docs/widgets/managing-multiple-widgets/)** - Previous topic
- **[Undo/Redo for Widgets](https://developers.figma.com/docs/widgets/undo-redo/)** - Next topic

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to add more interactivity? Here's what to explore next:

1. **Implement Undo/Redo** - [Learn about undo/redo →](https://developers.figma.com/docs/widgets/undo-redo/)
2. **Handle User Events** - [Add click interactions →](https://developers.figma.com/docs/widgets/handling-user-events/)
3. **Build Interactive Lists** - [Work with lists →](https://developers.figma.com/docs/widgets/working-with-lists/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
