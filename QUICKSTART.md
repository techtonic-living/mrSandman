# Quick Start Guide - mrSandman Widget

Get up and running with mrSandman widget development in 5 minutes!

---

## 🚀 Setup (One-Time)

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Prettier (if not already installed)

```bash
npm install --save-dev prettier
```

### 3. Open in VS Code

- Open this folder in VS Code
- Install recommended extensions when prompted
- Settings are pre-configured for optimal development

---

## 💻 Daily Development Workflow

### Start Development Mode

```bash
npm run watch
```

Or in VS Code: `Terminal > Run Build Task... > npm: watch`

**Keep this running!** It auto-rebuilds when you save files.

### Import Widget in Figma

1. Open Figma Desktop App
2. `Widgets` menu → `Development` → `Import widget from manifest`
3. Select `manifest.json` from this project
4. Widget appears in your file!

### Make Changes

1. Edit `widget-src/code.tsx`
2. Save file (auto-rebuild happens)
3. Widget re-renders in Figma (if selected)

---

## 📝 Key Files to Edit

| File                     | Purpose                             |
| ------------------------ | ----------------------------------- |
| `widget-src/code.tsx`    | Main widget code - start here!      |
| `manifest.json`          | Widget settings (name, permissions) |
| `ui.html`                | Optional modal UI                   |
| `widget-src/components/` | Reusable components                 |
| `widget-src/utils/`      | Helper functions                    |
| `widget-src/types/`      | TypeScript types                    |

---

## 🛠️ Common Commands

```bash
# Development
npm run watch          # Auto-rebuild (use this!)
npm run dev           # Same as watch

# Building
npm run build         # One-time build
npm run build:prod    # Production build with checks

# Code Quality
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix errors
npm run tsc           # Type check
npm run format        # Format code
npm run validate      # Run all checks

# Utilities
npm run clean         # Clean dist folder
```

---

## 🐛 Debugging

### View Console Logs

1. Right-click widget in Figma
2. `Widgets` → `Show console`
3. Use `console.log()` in your code

### Reset Widget State

Right-click widget → `Widgets` → `Reset widget state`

### Force Re-render

Right-click widget → `Widgets` → `Re-render widget`

---

## 📚 Learning Resources

### Project Documentation

- `/docs/planning/` - Roadmap, features, architecture
- `/docs/testing/` - Test plan and scenarios
- `/docs/devdocs/figma/widget-api/` - 20+ API reference docs
- `/.github/copilot-instructions.md` - Development patterns

### Quick API References

- **State**: Use `useSyncedState` for shared, `useSyncedMap` for per-user
- **Components**: `AutoLayout`, `Text`, `Input`, `Image`, `Frame`
- **Events**: `onClick`, `onTextEditEnd`, `usePropertyMenu`
- **Notifications**: `figma.notify("message")`

---

## 🎯 Your First Change

Try this to see hot reloading in action:

1. Open `widget-src/code.tsx`
2. Find the `<Text>` component
3. Change the text
4. Save file
5. Watch widget update in Figma!

---

## ✅ Checklist for New Features

Before implementing a new feature:

- [ ] Document in `/docs/planning/FEATURES.md`
- [ ] Design component structure
- [ ] Add TypeScript types in `/types/`
- [ ] Implement in `code.tsx` or `/components/`
- [ ] Test single-user scenario
- [ ] Test multi-user scenario
- [ ] Test undo/redo behavior
- [ ] Add to test plan
- [ ] Update documentation

---

## 🆘 Common Issues

### "Module not found" error

```bash
npm install
```

### TypeScript errors after adding files

```bash
npm run tsc
```

### Widget not updating in Figma

- Check `npm run watch` is still running
- Right-click → Re-render widget
- Rebuild: `npm run build`

### Linting errors

```bash
npm run lint:fix
```

---

## 🎓 Next Steps

1. **Read Architecture**: `/docs/planning/ARCHITECTURE.md`
2. **Check Roadmap**: `/docs/planning/ROADMAP.md`
3. **Browse API Docs**: `/docs/devdocs/figma/widget-api/`
4. **Start Building**: Edit `widget-src/code.tsx`

---

**Questions?** Check the full README.md or consult the documentation!

Happy coding! 🎉
