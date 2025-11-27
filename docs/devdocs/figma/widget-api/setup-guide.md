# Figma Widget API - Setup Guide

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Create a New Widget](#create-a-new-widget)
4. [Modify Your Widget](#modify-your-widget)
5. [Quick Start with CLI](#quick-start-with-cli)
6. [Building from Scratch](#building-from-scratch)
7. [Sample Widgets](#sample-widgets)
8. [Resources](#resources)
9. [Next Steps](#next-steps)

---

## Overview

This guide walks you through setting up your development environment for writing and creating a simple widget for FigJam. By the end of this guide, you'll have a simple counter widget that records and displays the number of times people have clicked on it.

⚠️ **Important Note**

The setup for widget development is very similar to plugin development. If you're already familiar with Figma plugin development, you can skip directly to [Create a New Widget](#create-a-new-widget), [Sample Widgets](#sample-widgets), or [Building from Scratch](#building-from-scratch).

---

## Installation

Before starting widget development, you'll need to install the following tools:

### Required Software

**1. Visual Studio Code**

Download the recommended code editor for widget development:
- [Download VS Code →](https://code.visualstudio.com/)

**2. Node.js and NPM**

Node.js includes NPM (Node Package Manager) which is required for installing dependencies:
- [Download Node.js →](https://nodejs.org/en/download/)

**3. Figma Desktop App**

⚠️ **Desktop App Required**

At this time, widget development and testing **must be done using the Figma desktop app**. This is because Figma needs to read your code saved as a local file.

- [Download Figma Desktop App →](https://www.figma.com/downloads/)

**Important**: If you already have the desktop app, make sure to **update to the latest version**. Several features have been added specifically to provide a better widget development experience.

---

## Create a New Widget

Follow these steps to generate your first widget using Figma's built-in template:

### Step-by-Step Process

1. **Log in to your account** and open the Figma desktop app
2. **Open any existing Figma/FigJam document** or create a new one
3. **Navigate to**: `Menu > Widgets > Development > New widget...`

This opens the "Create widget" modal.

4. **Give your widget a name**
5. **Choose "Simple widget"** in the next screen
6. **Save the widget** anywhere on disk

Your widget starter files are now created and ready to customize!

---

## Modify Your Widget

Now that you have a widget template, let's set it up for development:

### 1. Open in Visual Studio Code

Open the **entire folder** you just created using Visual Studio Code.

⚠️ **Pro Tip**: Widgets are defined using multiple files, so open the folder itself rather than individual files. This makes it easier to navigate and edit all components.

### 2. Install Dependencies

Run the following command in your terminal:

```bash
npm install
```

This installs:
- TypeScript
- Widget typings (`@figma/widget-typings`)
- Plugin typings (`@figma/plugin-typings`)

**Why plugin typings?** Much of the code you'll write inside widgets uses the Figma Plugin API in addition to the Widget API.

### 3. Install the Linter

Linting provides automated validation of source code for issues, helping catch errors early in development.

Figma provides a set of [typescript-eslint rules](https://github.com/figma/eslint-plugin-figma-plugins) specifically for widget development. These rules can identify and often automatically fix issues in your widget code.

**To install and use the linter:**
- Follow the instructions in the [Usage section](https://github.com/figma/eslint-plugin-figma-plugins?tab=readme-ov-file#usage) of the linter README
- [View the eslint-plugin-figma-plugins repository →](https://github.com/figma/eslint-plugin-figma-plugins)

### 4. Set Up TypeScript Compilation

Configure automatic compilation from TypeScript to JavaScript:

1. In VS Code, select: `Terminal > Run Build Task...`
2. Choose: `npm: watch`

This tells Visual Studio Code to:
- Compile `widget-src/code.tsx` into `dist/code.js`
- Watch for changes to `*.tsx` files
- Automatically regenerate `dist/code.js` each time you save

⚠️ **Important**: You'll need to run this build task again every time you reopen Visual Studio Code.

### 5. Insert Your Widget

In your Figma/FigJam file:

1. Navigate to: `Menu > Widgets > Development > {your_widget_name}`
2. Click to insert your newly created widget

The sample widget should appear as a simple counter.

### 6. Make Test Changes

Make some simple changes to `widget-src/code.tsx` to get familiar with the workflow.

⚠️ **Critical**: Edit `widget-src/code.tsx`, **NOT** `dist/code.js`. The `code.js` file is generated and gets overwritten automatically!

---

## Quick Start with CLI

If you're already familiar with widgets, Figma provides a single command to get started quickly:

```bash
npm init @figma/widget
```

This command scaffolds a new widget project with all necessary configuration.

---

## Building from Scratch

If you're building your widget from scratch without using the template, here's what you need:

### Sample tsconfig.json

```json
{
   "compilerOptions": {
      "jsx": "react",
      "jsxFactory": "figma.widget.h",
      "jsxFragmentFactory": "figma.widget.Fragment",
      "target": "es6",
      "strict": true,
      "typeRoots": [
         "./node_modules/@types",
         "./node_modules/@figma"
      ]
   }
}
```

### Install Required Typings

```bash
npm install --save-dev @figma/widget-typings @figma/plugin-typings
```

These packages provide TypeScript definitions for both the Widget API and Plugin API, enabling autocomplete and type checking in your editor.

---

## Sample Widgets

If you understand the fundamentals of building widgets or learn best by example, explore these resources:

- **[Widget Samples on GitHub](https://github.com/figma/widget-samples)** - Real-world widget implementations
- Study the code to see different patterns and techniques
- Clone and modify samples to jumpstart your own projects

---

## Resources

### Getting Started

- **[Prerequisites](https://developers.figma.com/docs/widgets/prerequisites/)** - Required knowledge before building widgets
- **[Introduction to Widgets](https://developers.figma.com/docs/widgets/)** - Overview of the Widget API

### Development Tools

- **[Visual Studio Code](https://code.visualstudio.com/)** - Recommended editor
- **[Figma ESLint Plugin](https://github.com/figma/eslint-plugin-figma-plugins)** - Linting rules for widgets
- **[Node.js](https://nodejs.org/)** - JavaScript runtime and package manager

### Downloads

- **[Figma Desktop App](https://www.figma.com/downloads/)** - Required for widget development

### Next Topics

- **[Widgets vs Plugins](https://developers.figma.com/docs/widgets/widgets-vs-plugins/)** - Understanding the differences
- **[Widget API Reference](https://developers.figma.com/docs/widgets/api/api-reference/)** - Complete API documentation

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

You're all set up! Here's what to do next:

1. **Understand the Differences** - [Learn widgets vs plugins →](https://developers.figma.com/docs/widgets/widgets-vs-plugins/)
2. **Explore the API** - [Review available components →](https://developers.figma.com/docs/widgets/api/api-reference/)
3. **Handle User Events** - [Make your widget interactive →](https://developers.figma.com/docs/widgets/handling-user-events/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
