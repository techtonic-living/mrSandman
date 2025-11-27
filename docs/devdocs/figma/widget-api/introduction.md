# Figma Widget API - Introduction

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [What are Widgets?](#what-are-widgets)
3. [Building Widgets](#building-widgets)
4. [Widget Capabilities](#widget-capabilities)
5. [Use Cases](#use-cases)
6. [Resources](#resources)
7. [Next Steps](#next-steps)

---

## Overview

Welcome to the Widget API! Widgets are interactive objects that extend the functionality of design files and FigJam boards. Unlike plugins that run for a specific person, **everyone can see and interact with the same widget**. You can add as many widgets to the board as you need and even run them at the same time, making them great for collaboration!

### Key Differences from Plugins

- **Plugins**: Run for a specific person
- **Widgets**: Visible and interactive for everyone simultaneously
- Multiple widgets can run at the same time on the same board

---

## What are Widgets?

Widgets are collaborative tools that live directly in your Figma design files or FigJam boards. They enable real-time interaction and shared experiences among team members.

### Important Performance Note

⚠️ **Document Loading Behavior**

If a widget does not contain the manifest field `"documentAccess": "dynamic-page"`, the entire document will be loaded when a widget runs or is interacted with.

- In large or complex files, this can cause a **20-30 second delay**
- **Recommendation**: Update your widget manifest to include `documentAccess` and only load the pages the user needs, rather than the whole document
- [Learn more about accessing documents →](https://developers.figma.com/docs/plugins/accessing-document/)

---

## Building Widgets

The Widget API is designed around two JavaScript-based technologies:

### Core Technologies

- **TypeScript**
- **JSX**

### Prerequisites

- Basic understanding of JavaScript is required
- If you've written React before, you'll feel right at home!
- [View required knowledge →](https://developers.figma.com/docs/widgets/prerequisites/)

### Widget Structure

A widget is a **function that renders components** inside a dedicated widget object. You build your widget interface from a combination of components or sublayers, then pass in properties to customize the look and feel.

#### About Components

When we talk about "components," we're using language from [React components](https://reactjs.org/docs/components-and-props.html). These are different from the components and instances you'd use in Figma design files.

Most components in the Widget API are layers you'd interact with in files, such as:
- Frames
- Text
- Shapes

[Explore Widget API reference →](https://developers.figma.com/docs/widgets/api/api-reference/)

---

## Widget Capabilities

### 1. User Interaction

Widgets are objects in files that everyone can see and use. You have complete control over how people interact with your widget:

- Specify a property menu
- Create a custom interface
- Run widgets in response to click events

[Customize widget interactions →](https://developers.figma.com/docs/widgets/handling-user-events/)

### 2. Plugin API Integration

Widgets can access the functionality of the Plugin API, allowing you to:

- Pull data from external resources
- Open an iFrame to show more UI
- Edit other objects in a file

**Note**: If you're building a standalone widget, you may not need the Plugin API at all.

[Using the Plugin API →](https://developers.figma.com/docs/widgets/using-the-plugin-api/)

---

## Use Cases

Here are some examples of widgets you can create:

### Data & Visualization
- **Import data** to create tables or interactive visualizations

### Collaboration & Feedback
- **Gather insight** through live polls and voting counters

### Project Management
- **Build timelines** and manage projects with calendars

### Games & Entertainment
- **Connect and play games** in multiplayer

---

## Resources

### Getting Started

- **[QuickStart Guide](https://developers.figma.com/docs/widgets/setup-guide/)** - Set up your environment and run a sample widget
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Explore widget examples for inspiration

### Documentation

- **[API Reference](https://developers.figma.com/docs/widgets/api/api-reference/)** - Components, hooks, and functions for building widgets
- **[Development Guides](https://developers.figma.com/)** - Concepts and processes for building successful widgets

### Decision Guides

Not sure what you want to create? Check out these guides:

- [Widgets vs Plugins →](https://developers.figma.com/docs/widgets/widgets-vs-plugins/)
- [Figma Design or FigJam Widgets →](https://developers.figma.com/docs/widgets/figma-figjam-widgets/)
- [Explore Widgets in the Community →](https://www.figma.com/community/widgets)

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server

---

## Next Steps

Ready to start building? Here's what to do next:

1. **Review Prerequisites** - [Ensure you have the required knowledge →](https://developers.figma.com/docs/widgets/prerequisites/)
2. **Follow the QuickStart** - [Set up your development environment →](https://developers.figma.com/docs/widgets/setup-guide/)
3. **Explore Examples** - [Check out sample widgets →](https://github.com/figma/widget-samples)
4. **Read the API Reference** - [Learn about available components →](https://developers.figma.com/docs/widgets/api/api-reference/)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
