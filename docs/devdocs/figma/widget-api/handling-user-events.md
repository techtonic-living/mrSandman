# Figma Widget API - Handling User Events

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Click Listeners](#click-listeners)
3. [Property Menus](#property-menus)
4. [iFrames](#iframes)
5. [Stickable Hooks](#stickable-hooks)
6. [Additional Interaction Types](#additional-interaction-types)
7. [Resources](#resources)
8. [Next Steps](#next-steps)

---

## Overview

There are many ways a user can interact with a widget:

- **Click listeners** - Respond to user clicks
- **Property menus** - Secondary actions via selection menu
- **Text editing** - Accept text input from users
- **iFrames** - Complex input via modal UI
- **Stickable hooks** - Attach widgets to other nodes (FigJam only)
- **Hover states** - Visual feedback on mouse hover

---

## Click Listeners

### Basic Click Handler

Widgets can register event listeners that respond to user events. Currently, widgets support **`click` events** on nodes inside the widget.

**Simple Example:**

```tsx
const { widget } = figma
const { Text } = widget

function ConsoleWidget() {
  return <Text onClick={() => console.log('Hey!')}>Click me</Text>
}

widget.register(ConsoleWidget)
```

### Widget Lifecycle with Clicks

When a user clicks on a widget, the function passed to the `onClick` prop runs and the **widget terminates thereafter**. However, there are cases where it's useful to keep the widget running longer (e.g., if your click handler opens an iframe for additional input).

### Async Click Handlers

To enable long-lived event handlers, widgets support **`async` callbacks** to indicate the widget shouldn't be terminated immediately.

**Using async/await:**

```tsx
const { widget } = figma
const { Text } = widget

function AsyncClickWidget() {
  return (
    <Text
      onClick={async () => {
        const fonts = await figma.listAvailableFontsAsync()
        // Do stuff
      }}
    >
      Click me
    </Text>
  )
}

widget.register(AsyncClickWidget)
```

⚠️ **Important Behavior**

If your callback returns a promise, your widget will only be terminated once the promise has been resolved, or when `figma.closePlugin()` is called.

### Returning Promises

```tsx
const { widget } = figma
const { Text } = widget

function PromiseWidget() {
  return (
    <Text
      onClick={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            console.log('This is a delayed action')
            resolve(null)
          }, 1000)
        })
      }
    >
      Click me
    </Text>
  )
}

widget.register(PromiseWidget)
```

### Click Event Coordinates

The function passed to the `onClick` prop can take an argument that provides information about where the user clicked on the screen.

**Accessing Click Coordinates:**

```tsx
const { widget } = figma
const { Frame } = widget

function XYWidget() {
  return (
    <Frame
      width={200}
      height={200}
      fill="#f00"
      onClick={(event) => {
        // offsetX and offsetY are useful for getting the position of the
        // mouse relative to the component that was clicked. You could use
        // these coordinates to position something inside of the frame.
        console.log('offset coords:', event.offsetX, event.offsetY)

        // canvasX and canvasY are relative to the canvas itself.
        // You can use these to position objects outside of
        // the widget relative to the canvas.
        console.log('canvas coords:', event.canvasX, event.canvasY)
      }}
    />
  )
}

widget.register(XYWidget)
```

**Event Properties:**

- **`offsetX`, `offsetY`** - Mouse position relative to the clicked component
- **`canvasX`, `canvasY`** - Mouse position relative to the canvas itself

**Use Cases:**
- Position elements inside frames using offset coordinates
- Position objects outside the widget using canvas coordinates

---

## Property Menus

### Overview

A property menu is an **optional menu** that can be shown when you select your widget.

⚠️ **Best Practice**

We recommend using property menus **only when there are secondary actions** that cannot be done directly on the widget, such as formatting and settings.

### Basic Property Menu

**Simple Example:**

```tsx
const { widget } = figma
const { Text, usePropertyMenu } = widget

function PropertyMenuExample() {
  usePropertyMenu(
    [
      {
        tooltip: 'One',
        propertyName: 'one',
        itemType: 'action',
      },
      {
        tooltip: 'Two',
        propertyName: 'two',
        itemType: 'action',
      },
    ],
    (e) => {
      console.log(e.propertyName)
    },
  )

  return <Text>Select Me</Text>
}

widget.register(PropertyMenuExample)
```

### Property Menu Configuration

**Menu Item Structure:**
- **`tooltip`** - Text shown in the menu
- **`propertyName`** - Identifier for the action
- **`itemType`** - Type of menu item (e.g., `'action'`)

**Callback:**
- Receives event with `propertyName` to identify which item was clicked

For more information, refer to the [usePropertyMenu](https://developers.figma.com/docs/widgets/api/properties/widget-usepropertymenu/) documentation.

---

## iFrames

### Using iFrames for Complex Input

For more complex input methods (such as a textbox), you can open an **iFrame window** to receive the input.

📝 **Setup Requirements**

For more information on setting up a separate `ui.html` page, refer to the [Creating a User Interface](https://developers.figma.com/docs/plugins/creating-ui/) guide from the plugin docs.

### iFrame Implementation

**Complete Example:**

```tsx
const { widget } = figma
const { Text, useSyncedState, useEffect } = widget

function IFrameExample() {
  const [name, setName] = useSyncedState('name', '[Enter your name]')

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      if (message.type === 'name') {
        setName(message.name)
        figma.closePlugin()
      }
    }
  })

  return (
    <Text
      onClick={() => {
        return new Promise((resolve) => {
          figma.showUI(`
            <input id="name" type="text" placeholder="Name">
            <button id="submit">Submit</button>
            <script>
              document.getElementById('submit').onclick = () => {
                const textbox = document.getElementById('name')
                const name = textbox.value
                const message = { pluginMessage: {type: 'name', name} }
                parent.postMessage(message, '*')
              }
            </script>
        `)
        })
      }}
    >
      Hello {name}
    </Text>
  )
}

widget.register(IFrameExample)
```

### iFrame Pattern Breakdown

**1. Setup Message Handler in useEffect:**

```tsx
useEffect(() => {
  figma.ui.onmessage = (message) => {
    if (message.type === 'name') {
      setName(message.name)
      figma.closePlugin()
    }
  }
})
```

Setting up the `figma.ui.onmessage` handler inside of `useEffect()` ensures the handler is set when the widget mounts.

**2. Open iFrame on Click:**

```tsx
onClick={() => {
  return new Promise((resolve) => {
    figma.showUI(`<html>...</html>`)
  })
}}
```

The iFrame HTML is set up inline in the `figma.showUI()` method.

**3. Send Data from iFrame:**

```tsx
parent.postMessage({ pluginMessage: {type: 'name', name} }, '*')
```

The value from the textbox is sent to the parent widget.

**4. Close iFrame:**

```tsx
figma.closePlugin()
```

Once the data has been received, the iFrame is closed by calling [`figma.closePlugin()`](https://developers.figma.com/docs/plugins/api/properties/figma-closeplugin/).

---

## Stickable Hooks

### Overview

In FigJam, a **stickable** is any node that sticks to other nodes when placed on top of them.

**Built-in Stickables:**
- `STAMP` nodes
- `HIGHLIGHT` nodes
- `WIDGET` nodes (when using the [`useStickable`](https://developers.figma.com/docs/widgets/api/properties/widget-usestickable/) hook)

### Stickable vs Stickable Host

Your widget can either be:
- **Stickable** - Sticks to other nodes like stamps
- **Stickable Host** - Allows stickables to stick to it

⚠️ **Important Constraint**

Your widget can either be a stickable **OR** a stickable host, but **not both**.

### Making a Widget Stickable

If a widget is declared as stickable, it will attach itself to all other non-stickables in the document. When your widget node is "stuck" to another node, it will move along with the element it is attached to unless dragged off.

**Use the `useStickable` hook:**

```tsx
const { widget } = figma
const { AutoLayout, Text, useStickable } = widget

function StickableWidget() {
  useStickable()

  return (
    <AutoLayout>
      <Text>I'm stickable!</Text>
    </AutoLayout>
  )
}

widget.register(StickableWidget)
```

**Behavior:**
- Widget sticks to sticky notes and other nodes when dragged over them
- Moves with the host when the host is moved
- Can be detached by dragging away

### Making a Widget a Stickable Host

If a widget is a stickable host, stickables are allowed to attach themselves to that widget.

⚠️ **Default Behavior**

By default, **all widgets are stickable hosts** unless they call [`useStickable()`](https://developers.figma.com/docs/widgets/api/properties/widget-usestickable/). This means that stamps and highlights will stick to your widget out of the box.

**Running Code on Attach:**

If you want your widget to run code when something sticks to it, use the [`useStickableHost`](https://developers.figma.com/docs/widgets/api/properties/widget-usestickablehost/) hook:

```tsx
const { widget } = figma
const { AutoLayout, Text, useStickableHost, useSyncedState } = widget

function StickableHostWidget() {
  const [stickedCount, setStickedCount] = useSyncedState('count', 0)

  useStickableHost(() => {
    // This runs when a stickable is attached
    setStickedCount(stickedCount + 1)
  })

  return (
    <AutoLayout>
      <Text>Stamps attached: {stickedCount}</Text>
    </AutoLayout>
  )
}

widget.register(StickableHostWidget)
```

📝 **Note About Stickable Hosts**

Calling [`useStickableHost`](https://developers.figma.com/docs/widgets/api/properties/widget-usestickablehost/) will **not** make nodes other than stamp, highlight, and stickable widget nodes stick to your widget.

---

## Additional Interaction Types

### Text Editing

Widgets can accept text input directly from users.

[Learn about text editing →](https://developers.figma.com/docs/widgets/text-editing/)

### Hover States

Widgets can change appearance on hover for better user feedback.

[Learn about hover states →](https://developers.figma.com/docs/widgets/adding-hover-states/)

---

## Resources

### Event Handling

- **[usePropertyMenu](https://developers.figma.com/docs/widgets/api/properties/widget-usepropertymenu/)** - Property menu hook
- **[useStickable](https://developers.figma.com/docs/widgets/api/properties/widget-usestickable/)** - Make widget stickable
- **[useStickableHost](https://developers.figma.com/docs/widgets/api/properties/widget-usestickablehost/)** - Accept stickables

### UI and Input

- **[Text Editing](https://developers.figma.com/docs/widgets/text-editing/)** - Text input handling
- **[Adding Hover States](https://developers.figma.com/docs/widgets/adding-hover-states/)** - Hover interactions
- **[Creating a User Interface](https://developers.figma.com/docs/plugins/creating-ui/)** - iFrame setup guide

### API References

- **[figma.showUI](https://developers.figma.com/docs/plugins/api/figma/#showui)** - Display iFrame
- **[figma.closePlugin](https://developers.figma.com/docs/plugins/api/properties/figma-closeplugin/)** - Close widget/iframe
- **[figma.ui.onmessage](https://developers.figma.com/docs/plugins/api/figma-ui/#onmessage)** - Handle iframe messages

### Related Topics

- **[Widget State & Multiplayer](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)** - State management
- **[Making Network Requests](https://developers.figma.com/docs/widgets/making-network-requests/)** - External data access

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to add more interactions? Here's what to explore next:

1. **Add Text Editing** - [Learn text input handling →](https://developers.figma.com/docs/widgets/text-editing/)
2. **Implement Hover States** - [Add hover interactions →](https://developers.figma.com/docs/widgets/adding-hover-states/)
3. **Make Network Requests** - [Fetch external data →](https://developers.figma.com/docs/widgets/making-network-requests/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
