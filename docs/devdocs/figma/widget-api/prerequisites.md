# Figma Widget API - Prerequisites

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Core Technologies](#core-technologies)
3. [JSX](#jsx)
4. [TypeScript](#typescript)
5. [Advanced Tools](#advanced-tools)
6. [Resources](#resources)
7. [Next Steps](#next-steps)

---

## Overview

The Widget API is designed to be written in **JSX** and **TypeScript**, leveraging the existing Plugin API extensively. Both JSX and TypeScript need to be compiled down into JavaScript prior to being run in the Widget Sandbox (in the browser).

### What You Need to Know

Before building widgets, you should have:

- **Basic understanding of JavaScript** - The foundation of widget development
- **Familiarity with React concepts** (optional but helpful) - If you've written React before, you'll feel right at home with the Widget API!

---

## Core Technologies

### JSX

JSX is a syntax extension for JavaScript that allows you to write UI components using a declarative, HTML-like syntax.

### TypeScript

TypeScript is an extension of JavaScript that allows you to add type annotations to your code. These annotations don't change how your code runs—they are just notes for yourself and the compiler.

When paired with an editor like Visual Studio Code, these annotations provide helpful hints during development, improving code quality and catching bugs early.

---

## JSX

If you're used to writing HTML, you'll find JSX familiar. JSX allows us to express the desired widget object using a declarative syntax.

### Basic JSX Example

```tsx
const { widget } = figma
const { AutoLayout, Text } = widget

function JSXSample() {
  return (
    <AutoLayout>
      <Text>Hello Widget</Text>
    </AutoLayout>
  )
}

widget.register(JSXSample)
```

### How JSX Works

Under the hood, JSX gets converted to JavaScript function calls. For example:

**JSX Code:**
```tsx
<Text>Hello Widget</Text>
```

**Compiled JavaScript:**
```javascript
figma.widget.h(Text, null, "Hello Widget")
```

⚠️ **Important Configuration**

The `figma.widget.h` function comes from how `tsconfig.json` is configured. If this was React, it would be `React.createElement`. This is a critical distinction when setting up your widget project.

### Passing Props in JSX

You can specify attributes on each element (known as `props`) to customize components:

**JSX with Props:**
```tsx
// code.tsx
<Text fontSize={20}>Hello Widget</Text>
```

**Compiled JavaScript:**
```javascript
// code.js
figma.widget.h(Text, { fontSize: 20 }, "Hello Widget")
```

---

## TypeScript

TypeScript adds type safety to your JavaScript code through type annotations. These annotations serve as documentation and enable powerful editor features.

### Benefits of TypeScript

- **Editor Assistance** - Get autocomplete, inline documentation, and error detection as you type
- **Type Safety** - Catch errors at compile-time rather than runtime
- **Better Refactoring** - Safely rename variables and functions across your codebase
- **Self-Documenting Code** - Types serve as inline documentation for your functions and components

### TypeScript in Action

When using Visual Studio Code with TypeScript, you get:

- Autocomplete suggestions for Figma Widget API methods
- Inline documentation for available properties
- Real-time error detection for type mismatches
- Intelligent code navigation

---

## Advanced Tools

For more complex widgets, additional tools used in modern web development will be useful. **You don't need to learn these tools before starting to write widgets**, but they will come in handy eventually.

### Development Environment

**Integrated Development Environments (IDEs):**

- **[VS Code](https://code.visualstudio.com/)** - Recommended for widget development
- **[Eclipse IDE](https://eclipseide.org/)**
- **[IntelliJ IDEA](https://www.jetbrains.com/idea/)**

IDEs provide extensions that make development easier and help you work across multiple files efficiently. JavaScript and HTML are well-supported languages in most IDEs.

### Key Concepts for Complex Widgets

**[Asynchronous JavaScript](https://developers.figma.com/docs/plugins/async-tasks/)**

Async operations are essential for Figma widgets, particularly for:
- Loading pages on demand
- Requesting and processing data that takes time to return
- Non-blocking UI operations

**[Bundling with Webpack](https://developers.figma.com/docs/plugins/libraries-and-bundling/)**

Bundling helps pack dependencies into the format required for Figma widgets:
- Combine large multi-file projects
- Import external libraries
- Optimize code for production

**UI Frameworks**

For complex user interfaces, consider:
- React
- Vue
- Other modern JavaScript frameworks

### Why These Tools?

The Figma Widget API builds on top of the most popular open-source tools in the web development community rather than rolling out proprietary solutions. This means you can leverage existing knowledge and community resources.

---

## Resources

### Getting Started

- **[Introduction to Widgets](https://developers.figma.com/docs/widgets/)** - Overview of the Widget API
- **[Setup Guide](https://developers.figma.com/docs/widgets/setup-guide/)** - Step-by-step environment setup

### Learning JavaScript & TypeScript

- **[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)** - Comprehensive TypeScript guide
- **[Primer on JSX](https://reactjs.org/docs/introducing-jsx.html)** - Understanding JSX syntax
- **[The Odin Project](https://www.theodinproject.com/courses/web-development-101)** - Web development fundamentals
- **[Codecademy: Web Development](https://www.codecademy.com/learn/paths/web-development)** - Interactive learning path
- **[Khan Academy: Intro to JS](https://www.khanacademy.org/computing/computer-programming/programming)** - JavaScript basics

### Figma-Specific Resources

- **[Plugin API Prerequisites](https://developers.figma.com/docs/plugins/prerequisites/)** - Related plugin development knowledge
- **[TypeScript with Plugin API](https://developers.figma.com/docs/plugins/typescript/)** - TypeScript configuration details
- **[Async Tasks in Plugins](https://developers.figma.com/docs/plugins/async-tasks/)** - Handling asynchronous operations
- **[Libraries and Bundling](https://developers.figma.com/docs/plugins/libraries-and-bundling/)** - Working with external dependencies

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to start building? Here's your path forward:

1. **Set Up Your Environment** - [Follow the setup guide →](https://developers.figma.com/docs/widgets/setup-guide/)
2. **Review the Introduction** - [Understand widgets fundamentals →](https://developers.figma.com/docs/widgets/)
3. **Explore Examples** - [Check out sample widgets →](https://github.com/figma/widget-samples)
4. **Read the API Reference** - [Learn about available components →](https://developers.figma.com/docs/widgets/api/api-reference/)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
