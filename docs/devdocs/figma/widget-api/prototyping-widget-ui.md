# Figma Widget API - Prototyping Widget UI

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Insert Widgets](#insert-widgets)
3. [Widget State and Rendering](#widget-state-and-rendering)
4. [Test Interactions and Events](#test-interactions-and-events)
5. [View and Adjust Widget Sublayers](#view-and-adjust-widget-sublayers)
6. [Widget Code Generator](#widget-code-generator)
7. [Resources](#resources)
8. [Next Steps](#next-steps)

---

## Overview

Once you have created a widget, the best way to see how it looks is to insert it in a file. This allows you to:

- **Preview your widget interface** - See how your design looks on the canvas
- **Test interactions** - Verify user events and behaviors work as expected
- **Iterate on design** - Adjust properties and explore alternatives

💡 **QuickStart Tip**

If you haven't created a widget yet, follow the [QuickStart guide](https://developers.figma.com/docs/widgets/setup-guide/) to download a sample counter widget. This gives you an idea of how this process works without creating a widget from scratch.

---

## Insert Widgets

The Widget API supports two file or editor types: **FigJam** and **Figma**. You can create widgets for FigJam, Figma, or widgets that run in both. You'll [set the editor type](https://developers.figma.com/docs/widgets/setting-editor-type/) as part of your widget's [manifest](https://developers.figma.com/docs/widgets/widget-manifest/).

⚠️ **Development Flexibility**

During the development process, you can insert widgets into either editor type, **regardless of the `editorType` set in the widget's manifest**.

### Figma Design

Insert widgets into design files to preview designs and test their interactivity. In design files, you can also **view and adjust the properties** of your widget's sublayers.

**Steps to Insert:**

1. Using the [Figma Desktop app](https://www.figma.com/downloads/), open the design file where you want to insert the widget
2. In the toolbar, open the **Component, widget, and plugins insert menu** and select the **Widget** tab
3. Click the **Recents** header and select **Development** from the options

⚠️ If you don't see the Development option, make sure you:
- Are using the desktop app (not browser)
- Have created a widget already

4. Select the widget from the list - Figma will insert it into the file

**Benefits in Figma Design:**
- View and adjust sublayer properties
- Explore and iterate on widget design
- Test auto layout configurations
- Preview property changes before committing to code

### FigJam

Insert widgets into FigJam files to preview designs and test their interactivity. **Note**: You can't view or edit individual layers and properties in FigJam files.

**Steps to Insert:**

1. Open a FigJam file in the desktop app
2. In the bottom toolbar, select **Widgets, stickers, templates, and more**
3. Select the **Widgets** tab
4. In the **Development** section, select the widget you want to insert

💡 **Alternative Methods**

You can also insert widgets from:
- **Figma icon menu** - Click the Figma icon in the toolbar → Widgets → Development
- **Right-click menu** - Right-click anywhere on canvas → Widgets → Development

---

## Widget State and Rendering

During development, you'll want to preview changes in real time.

### Hot Reloading

When you select a widget in your file, that instance will **re-render any time you make a change** to the widget code. This is called **hot reloading**.

**Hot Reloading Characteristics:**
- Only updates the affected widget sublayers
- **Preserves the widget's state**
- Useful when prototyping changes

**Example Scenario:**

Your selected counter widget has registered 3 clicks. In your code editor, you change the `fill` property of the `AutoLayout` component from white (`#FFFFFF`) to light blue (`#F1F6FF`).

**Result**: The widget renders with the updated fill color, while the counter **stays at 3** (state preserved).

### Manual Re-rendering

You can force a widget to re-render at any time. The widget will render based on the current widget code.

**Steps:**

1. Right-click on the widget in the file
2. Hover over the **Widgets** menu
3. Select **Re-render widget**

### Reset Widget State

Every widget has its own state. If you insert multiple widgets into a file, you can interact with each widget independently. To restore a widget to its default value:

**Steps:**

1. Right-click on the widget in the file
2. Hover over the **Widgets** menu
3. Select **Reset widget state**

⚠️ **Important**: This resets both state values and any property changes you made in the UI.

---

## Test Interactions and Events

There are many ways widgets can [respond to interaction](https://developers.figma.com/docs/widgets/handling-user-events/). Your widget doesn't need to support all interactions, but we recommend testing them anyway to ensure your widget responds as expected.

### Supported Interactions

📝 **Types of Interactions:**

- **Click events** - Respond to clicks using event listeners
- **Custom property menu** - Interactions with a custom menu
- **Text input** - Accept text input from widget users
- **Hover styling** - Adjust appearance on hover using [hoverStyle](https://developers.figma.com/docs/widgets/api/type-HoverStyle/)
- **iFrame access** - Open an iFrame to access external resources or browser APIs
- **Multiplayer** - Allow multiple people to interact with a widget at once
- **Sticky widgets** - Stick widgets to other objects (FigJam only)

[Learn more about handling user events →](https://developers.figma.com/docs/widgets/handling-user-events/)

### Testing Tips

**Reset to Original State:**

To reset a widget during testing:
1. Right-click on the widget
2. Select **Widgets > Reset widget state**

⚠️ Any changes to component properties will also be reset.

For more testing strategies, read the [Testing guide](https://developers.figma.com/docs/widgets/testing/).

---

## View and Adjust Widget Sublayers

### Viewing Sublayers in Figma Design

If you insert a widget into a design file, you can view widget sublayers in the layers panel. This allows you to select individual layers and adjust their properties.

⚠️ **Development Only**

You can only view layers and adjust properties for widgets that are **still in development**. You can't do this with published versions.

**Steps to View Sublayers:**

1. **Select the widget** in the canvas
2. In the **layers panel**, look for the **purple widget layer** (it will have the same name as your widget)
3. **Click the arrow** to expand the widget and view its sublayers

### Layer Naming Differences

There are differences between the product and API naming:

| API Component    | Appears As                 | Notes                                         |
| ---------------- | -------------------------- | --------------------------------------------- |
| `AutoLayout`     | Frame with direction icon  | Shows horizontal or vertical auto layout icon |
| Input components | T icon with string content | Layer name updates when input content changes |
| `SVG` with paths | Frame layers               | Shapes appear as vector sublayers             |

💡 **Quick Selection Tip**

Hold down `⌘Command` / `Ctrl` and click on a specific element in the canvas to select that layer directly.

[Learn more about layers in the left sidebar →](https://help.figma.com/hc/en-us/articles/360039831974)

### Adjust Properties of Widget Sublayers

In Figma design files, you can change the properties of widget sublayers in the file. While this **doesn't update your widget code**, it allows you to **preview changes before committing them to code**.

**Use Cases:**

- Test combinations of auto layout properties
- Preview changes to text (font, size, layout)
- Apply paints to fills and strokes
- Compare designs by creating multiple instances with different properties

⚠️ **Changes Are Temporary**

Any time your widget is re-rendered or reset, you will **lose any updates you applied**. This happens when you:
- Run or insert a widget
- Use the **Re-render widget** option
- Use the **Reset widget state** option

**Accessing Properties:**

You can access most properties from the **Design tab** of the right sidebar. View the Components section of the [Widget API reference](https://developers.figma.com/docs/widgets/api/api-reference/) to check supported properties.

**Related Help Articles:**

- [Explore auto layout properties](https://help.figma.com/hc/en-us/articles/360040451373)
- [Explore text properties](https://help.figma.com/hc/en-us/articles/360039956634-Explore-text-properties)
- [Basic shape tools in Figma design](https://help.figma.com/hc/en-us/articles/360040450133-Basic-shape-tools-in-Figma-design)
- [Using the arc tool](https://help.figma.com/hc/en-us/articles/360040450173)
- [Apply and adjust stroke properties](https://help.figma.com/hc/en-us/articles/360049283914-Apply-and-adjust-stroke-properties)
- [Adjust alignment, rotation, and position](https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-and-position)

📝 **Clear Changes**

To clear your changes or return a widget to its original design, re-render the widget:
- Right-click on the widget → **Widgets > Re-render widget**
- Use this if your widget stops working after editing properties

### Copy Widget Sublayers from FigJam

You can't view or edit individual layers and properties of widgets in FigJam files. However, you can **copy the existing widget as an entire frame** to iterate on design.

**Use Case:**

This is particularly helpful when configuring properties of `AutoLayout` components. The copied layers are separate from the actual widget, so you can explore alternative designs without changes being overridden.

**Steps:**

1. **Right-click on the widget** in FigJam
2. Select **Widgets > Copy as layers** to copy to clipboard
3. **Open a design file** and right-click on a spot in the canvas
4. Select **Paste here** to add your widget as a regular frame

---

## Widget Code Generator

💡 **Design-First Workflow**

Want to design your widget in Figma first? Figma's [Widget Code Generator](https://www.figma.com/community/plugin/1096460041736534298/Widget-Code-Generator) plugin generates widget UI from existing frames.

**What It Does:**

- Translates your design into components and properties in the widget API
- Generates the initial widget code structure
- Saves time on UI implementation

⚠️ **Manual Work Required**

You'll still need to edit the generated code to:
- Add interactivity
- Support user events
- Implement state management

[Learn more about the Widget Code Generator →](https://help.figma.com/hc/en-us/articles/5601345554967)

---

## Resources

### Getting Started

- **[Setup Guide](https://developers.figma.com/docs/widgets/setup-guide/)** - Download sample counter widget
- **[Widget State](https://developers.figma.com/docs/widgets/widget-state/)** - Understanding state management

### Development Tools

- **[Figma Desktop App](https://www.figma.com/downloads/)** - Required for widget development
- **[Widget Code Generator](https://www.figma.com/community/plugin/1096460041736534298/Widget-Code-Generator)** - Generate code from designs

### API References

- **[Widget API Reference](https://developers.figma.com/docs/widgets/api/api-reference/)** - Complete component reference
- **[AutoLayout Component](https://developers.figma.com/docs/widgets/api/component-AutoLayout/)** - Layout component documentation
- **[HoverStyle Property](https://developers.figma.com/docs/widgets/api/type-HoverStyle/)** - Hover interaction styling

### Configuration

- **[Setting Editor Type](https://developers.figma.com/docs/widgets/setting-editor-type/)** - Configure Figma vs FigJam
- **[Widget Manifest](https://developers.figma.com/docs/widgets/widget-manifest/)** - Manifest configuration

### User Interaction

- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - Complete interaction guide
- **[Testing Guide](https://developers.figma.com/docs/widgets/testing/)** - Testing strategies

### Help Center

- **[View layers in the left sidebar](https://help.figma.com/hc/en-us/articles/360039831974)**
- **[Select layers and objects in design files](https://help.figma.com/hc/en-us/articles/360040449873)**

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to add more functionality? Here's what to explore next:

1. **Add Plugin API Features** - [Use the Plugin API →](https://developers.figma.com/docs/widgets/using-the-plugin-api/)
2. **Handle User Interactions** - [Learn about user events →](https://developers.figma.com/docs/widgets/handling-user-events/)
3. **Test Your Widget** - [Follow testing best practices →](https://developers.figma.com/docs/widgets/testing/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
