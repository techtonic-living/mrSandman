# Figma Widget API - Widgets vs Plugins

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Key Differences](#key-differences)
3. [Installation & Access](#installation--access)
4. [User Interaction Model](#user-interaction-model)
5. [Execution & Lifecycle](#execution--lifecycle)
6. [Multiplayer & Collaboration](#multiplayer--collaboration)
7. [When to Use Widgets](#when-to-use-widgets)
8. [When to Use Plugins](#when-to-use-plugins)
9. [Resources](#resources)
10. [Next Steps](#next-steps)

---

## Overview

If you're a developer who has built [plugins](https://developers.figma.com/docs/plugins/) before, there are a few key differences to understand between plugins and widgets. Understanding these distinctions will help you choose the right approach for your use case.

### Quick Comparison

- **Plugins**: Single-player tools that run for individual users
- **Widgets**: Collaborative objects visible to everyone in the file

---

## Key Differences

Here's a comprehensive comparison of widgets and plugins:

| Aspect           | Plugins                                         | Widgets                                                                                                                            |
| ---------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Installation** | Needs to be installed by each user in a file    | Anyone in a file can insert it onto the canvas, then it's available for use by all users                                           |
| **Interaction**  | Users primarily interact via off-canvas iframes | Users interact directly on the canvas, like any other native object. Can create iframes, but entry points are on the widget itself |
| **Execution**    | Run specifically for the user who is running it | Collaborative and multiplayer—everyone in a file sees the same instance                                                            |
| **Concurrency**  | Only one per user can be open at a time         | Unlimited number can be in a file and ready to be interacted with, like any other object                                           |

---

## Installation & Access

### Plugins

- **User-Specific**: Each user must install the plugin individually
- **Requires Action**: Users need to explicitly add the plugin to their workspace
- **Per-User Management**: Each user manages their own plugin installations

### Widgets

- **Team-Accessible**: Once inserted by anyone, all team members can use it
- **No Installation Required**: Users don't need to install anything
- **Persistent Presence**: Remains in the file for everyone to interact with

⚠️ **Key Insight**

Widgets have a lower barrier to entry for teams. One person adds it to the canvas, and it's immediately available to everyone.

---

## User Interaction Model

### Plugins

**Off-Canvas Interaction**

- Primary interface is through **off-canvas iframes**
- Opens in a separate panel or modal window
- User leaves the canvas to interact with the plugin
- UI is separate from the design/document

### Widgets

**On-Canvas Interaction**

- Users interact **directly on the canvas**
- Behaves like any other native Figma object
- Can be moved, resized, and positioned
- Entry points are on the widget itself
- **Can optionally create off-canvas iframes**, but the primary interaction is on-canvas

---

## Execution & Lifecycle

### Plugins

**Single-User Execution**

- Runs specifically for the user who launched it
- Only one plugin can be open per user at a time
- Execution is isolated to that user's session
- Results may need to be shared manually with team

### Widgets

**Multiplayer by Default**

- Unlimited widgets can exist in a file simultaneously
- Everyone sees the same widget instance
- Changes are immediately visible to all users
- State is shared across all collaborators

---

## Multiplayer & Collaboration

### Plugins: Single-Player Experience

- Each user runs their own instance
- Results aren't automatically shared
- Best for individual workflows
- Personal automation tasks

### Widgets: Collaborative Experience

- **Everyone sees the same widget**
- Real-time interaction and updates
- Shared state across all users
- Perfect for team activities

⚠️ **Critical Difference**

Widgets are fundamentally collaborative. If you're building something where multiple people need to interact with the same data or state simultaneously, widgets are the right choice.

---

## When to Use Widgets

Widgets are better for:

### Collaborative Use Cases

- **Voting systems** - Team polls and decision-making
- **Shared counters** - Tracking team metrics together
- **Live data displays** - Information everyone needs to see
- **Interactive games** - Multiplayer activities

### On-Canvas Interaction Requirements

- **Diagramming tools** - Visual elements that live on the canvas
- **Interactive visualizations** - Data displays integrated with designs
- **Team activities** - Exercises that require canvas presence
- **Persistent objects** - Elements that should remain visible in the file

**Example Use Case**: A voting widget where team members click to vote on design options. Everyone sees the vote count update in real-time.

---

## When to Use Plugins

Plugins are better for:

### Single-Player Automation

- **Personal workflows** - Individual productivity tools
- **Code generation** - Creating components from specifications
- **Batch operations** - Processing multiple elements at once
- **Personal utilities** - Tools for individual designers

### File Setup Activities

- **Template generation** - Creating standard file structures
- **Style system setup** - Initializing design systems
- **Configuration tasks** - One-time setup operations

### Import/Export Operations

- **Content libraries** - Bringing in external assets
- **Data import** - Loading spreadsheets or databases
- **Export utilities** - Generating files for external use
- **Integration tools** - Connecting to other platforms

**Example Use Case**: A plugin that exports all components to SVG files for use in development. This is a single-user operation that doesn't benefit from collaboration.

---

## Resources

### Widget Documentation

- **[Introduction to Widgets](https://developers.figma.com/docs/widgets/)** - Getting started overview
- **[Setup Guide](https://developers.figma.com/docs/widgets/setup-guide/)** - Environment configuration
- **[Prerequisites](https://developers.figma.com/docs/widgets/prerequisites/)** - Required knowledge

### Plugin Documentation

- **[Plugin Documentation](https://developers.figma.com/docs/plugins/)** - Complete plugin guide
- **[Plugin vs Widget Decision Guide](https://developers.figma.com/docs/plugins/)** - More detailed comparison

### Next Topics

- **[Figma and FigJam Widgets](https://developers.figma.com/docs/widgets/figma-figjam-widgets/)** - Understanding widget contexts
- **[Widget API Reference](https://developers.figma.com/docs/widgets/api/api-reference/)** - Complete API documentation

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Now that you understand the difference, here's what to do next:

1. **Choose Your Approach** - Decide between widget or plugin based on your use case
2. **Learn Widget-Specific Features** - [Explore Figma vs FigJam widgets →](https://developers.figma.com/docs/widgets/figma-figjam-widgets/)
3. **Start Building** - [Follow the setup guide →](https://developers.figma.com/docs/widgets/setup-guide/)
4. **Explore Examples** - [Study sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
