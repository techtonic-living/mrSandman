# mrSandman Widget

> A powerful Figma widget for enhanced collaboration and productivity

[![Figma Widget](https://img.shields.io/badge/Figma-Widget-000000?logo=figma)](https://www.figma.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Resources](#resources)

---

## Overview

mrSandman is a **Figma widget for design system token management**. It provides a visual workbench for creating, editing, and organizing design primitives across three core domains: **Colors**, **Typography**, and **Sizing**.

### Key Characteristics

- **Token-Centric** - Structured approach to design primitives and semantic mapping
- **Visual Editing** - Interactive editors for colors, type scales, and spacing systems
- **Variable Integration** - Direct binding to Figma variables for design-to-code workflows
- **Collaborative** - Real-time multiplayer token library management
- **Type-Safe** - Built with TypeScript for reliability
- **Well-Documented** - Comprehensive API and pattern reference included

---

## Features

- [ ] **Color Management** - Primitives, LCH ramps, semantic tokens, WCAG contrast validation
- [ ] **Typography System** - Font families, type scales, text styles, semantic mapping
- [ ] **Sizing & Spacing** - Spacing scales, dimensions, radii, stroke widths

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Figma Desktop App** - [Download](https://www.figma.com/downloads/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the project (Widget + UI):**
   ```bash
   npm run build
   ```

### Running in Figma

1. **Start the development watch server:**

   ```bash
   npm run watch
   ```

   This will start both the Widget build (esbuild) and the UI build (Vite) in watch mode.

   Or use VS Code: `Terminal > Run Build Task... > npm: watch`

2. **Import widget in Figma:**
   - Open Figma Desktop App
   - Go to `Widgets` menu → `Development` → `Import widget from manifest`
   - Select `manifest.json` from this project
   - Widget appears in your file - click to interact!

3. **Hot Reloading:**
   - Selected widgets automatically re-render when code changes
   - State is preserved during hot reload
   - Right-click widget → `Widgets` → `Re-render widget` to force refresh

---

## Development

### Development Workflow

```bash
# Start development mode (watch + auto-rebuild for Widget & UI)
npm run dev

# Type check (without building)
npm run tsc

# Lint code
npm run lint

# Build for production
npm run build:prod
```

### Project Structure

```
mrSandman/
├── widget-src/           # Widget logic (runs on canvas)
│   ├── code.tsx          # Main entry point
│   └── components/       # Widget-specific components
├── ui-src/               # React UI (runs in iframe)
│   ├── main.tsx          # UI entry point
│   ├── App.tsx           # Main UI component
│   └── components/       # React components (shadcn/ui)
├── dist/                 # Build output
│   ├── code.js           # Bundled widget code
│   └── index.html        # Bundled UI (single file)
├── manifest.json         # Widget configuration
└── package.json          # Dependencies and scripts
```

# Lint code

npm run lint

# Fix linting issues

npm run lint:fix

# Format code with Prettier

npm run format

# Validate everything (lint + type-check)

npm run validate

# Production build

npm run build:prod

```

### Project Commands

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `npm run watch`      | Auto-rebuild on file changes (recommended) |
| `npm run build`      | One-time build                             |
| `npm run build:prod` | Production build with validation           |
| `npm run lint`       | Check for linting errors                   |
| `npm run lint:fix`   | Auto-fix linting issues                    |
| `npm run tsc`        | Type check without emitting files          |
| `npm run format`     | Format code with Prettier                  |
| `npm run validate`   | Run all checks (lint + types)              |
| `npm run clean`      | Clean dist folder                          |

### VS Code Setup

1. **Install recommended extensions:**
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features

2. **Start build task:**
   - `Terminal > Run Build Task...` → `npm: watch`
   - Must be done each time you reopen VS Code

3. **Enable format on save:**
   - `Preferences > Settings`
   - Search "Format On Save"
   - Enable checkbox

---

## Testing

### Manual Testing in Figma

1. **Run the widget:**
   - Import widget from manifest (see above)
   - Click widget to interact
   - Test with multiple users (open file in different browsers/devices)

2. **Debugging:**
   - Right-click widget → `Widgets` → `Show console`
   - Use `console.log()` in your code
   - Check for errors in Figma's developer console

3. **Test Scenarios:**
   - [ ] Single user interactions
   - [ ] Multiple users simultaneously
   - [ ] Undo/redo behavior
   - [ ] State persistence
   - [ ] Error handling
   - [ ] Performance with large data

### Reset Widget State

If you need to reset widget state during testing:

- Right-click widget → `Widgets` → `Reset widget state`

---

## Documentation

### Project Documentation

- **[Copilot Instructions](/.github/copilot-instructions.md)** - AI coding assistant guide
- **[Widget API Reference](/docs/devdocs/figma/widget-api/)** - Comprehensive API documentation
- **[Planning Documents](/docs/planning/)** - Roadmap, features, architecture
- **[Test Plans](/docs/testing/)** - Testing strategies and results

### Reference Documentation Available

The `/docs/devdocs/figma/widget-api/` directory contains 20+ comprehensive guides:

- Introduction & Setup
- Widgets vs Plugins
- Widget State & Multiplayer
- Handling User Events
- Making Network Requests
- Text Editing
- Working with Lists
- Working with Variables
- Images in Widgets
- Adding Hover States
- Undo/Redo
- Best Practices
- And more...

### Official Resources

- **[Figma Widget API Docs](https://www.figma.com/widget-docs/)** - Official documentation
- **[Widget Samples](https://github.com/figma/widget-samples)** - Example widgets
- **[Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Get help

---

## Project Structure

```

mrSandman/
├── .github/
│ ├── copilot-instructions.md # AI agent development guide
│ ├── prompts/
│ │ └── add-devdoc.prompt.md # Documentation workflow
│ └── templates/
│ └── devdoc_TEMPLATE.md # Doc template
│
├── assets/ # Images, icons, resources
│ └── logo/
│
├── docs/
│ ├── devdocs/
│ │ └── figma/
│ │ └── widget-api/ # 20+ API reference docs
│ ├── planning/ # Planning documents
│ │ ├── ROADMAP.md
│ │ ├── FEATURES.md
│ │ └── ARCHITECTURE.md
│ └── testing/ # Test plans & results
│ └── TEST_PLAN.md
│
├── widget-src/
│ ├── code.tsx # Main widget code
│ ├── tsconfig.json # TypeScript config
│ ├── components/ # Reusable components
│ ├── utils/ # Helper functions
│ └── types/ # Type definitions
│
├── dist/
│ ├── code.js # Compiled output (git-ignored)
│ └── index.html # Compiled UI
│
├── ui-src/ # React UI Source
├── manifest.json # Widget configuration
├── package.json # Dependencies & scripts
├── .gitignore # Git ignore rules
├── .prettierrc # Prettier config
└── README.md # This file

````

### Key Files

- **`widget-src/code.tsx`** - Main widget component (your code here!)
- **`manifest.json`** - Widget metadata and permissions
- **`ui-src/`** - React UI source code (Vite project)
- **`dist/code.js`** - Compiled JavaScript (auto-generated)

---

## Contributing

### Development Process

1. **Plan**: Document features in `/docs/planning/`
2. **Build**: Implement in `widget-src/`
3. **Test**: Manual testing in Figma + document in `/docs/testing/`
4. **Document**: Update reference docs as needed

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for consistency
- Add JSDoc comments for complex functions
- Keep components small and focused

### Commit Guidelines

```bash
# Format: <type>: <description>
feat: Add new voting feature
fix: Resolve state sync issue
docs: Update API reference
refactor: Simplify component structure
perf: Optimize rendering performance
test: Add test scenarios
chore: Update dependencies
````

---

## Resources

### Figma Widget Development

- **[Widget API Introduction](https://www.figma.com/widget-docs/)** - Getting started
- **[API Reference](https://www.figma.com/widget-docs/api/api-reference/)** - Complete API
- **[Sample Widgets](https://github.com/figma/widget-samples)** - Real examples
- **[Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Ask questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Developer community

### TypeScript & Tools

- **[TypeScript Docs](https://www.typescriptlang.org/docs/)** - Language reference
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[esbuild](https://esbuild.github.io/)** - Build tool

---

**Ready to build?** Start with `npm run watch` and open Figma! 🚀
