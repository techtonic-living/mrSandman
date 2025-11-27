# Figma Widget API - Working with Variables

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing the Variables API](#accessing-the-variables-api)
3. [Get Variables and Collections](#get-variables-and-collections)
4. [Create Variables and Collections](#create-variables-and-collections)
5. [Bind Variables to Nodes](#bind-variables-to-nodes)
6. [Typography Variables](#typography-variables)
7. [Extended Variable Collections](#extended-variable-collections)
8. [Helper Methods](#helper-methods)
9. [Resources](#resources)
10. [Next Steps](#next-steps)

---

## Overview

Variables in Figma design store reusable values that can be applied to all kinds of design properties and prototyping actions. They help save time and effort when building designs, managing design systems, and creating complex prototyping flows.

### What Are Variables?

- **Design tokens** - Reusable values for colors, spacing, typography, etc.
- **Modes** - Different variations (e.g., light mode, dark mode)
- **Collections** - Groups of related variables
- **Aliases** - Variables that reference other variables

### Variable Types

- **COLOR** - RGB/RGBA color values
- **FLOAT** - Numeric values (spacing, sizing, opacity, etc.)
- **STRING** - Text values (font names, content, etc.)
- **BOOLEAN** - True/false values

⚠️ **Prerequisites**

This guide assumes that you're familiar with the basics of creating Figma widgets and plugins. If you're new to developing plugins, check out the [Build your first plugin](https://help.figma.com/hc/en-us/articles/4407260620823--BYFP-1-Overview) course.

---

## Accessing the Variables API

The Variables API is available to widgets by [using the Plugin API](https://developers.figma.com/docs/widgets/using-the-plugin-api/) in your widget.

### Key Concept

Variables API methods are accessed through the `figma.variables` global object and can only be used in **event handlers or hooks**, not in rendering code.

**Basic Pattern:**

```tsx
const { widget } = figma
const { Text, useEffect } = widget

function VariableWidget() {
  useEffect(() => {
    // Access Variables API in useEffect
    figma.variables.getLocalVariablesAsync().then(variables => {
      console.log('Local variables:', variables)
    })
  })

  return <Text>Widget with Variables</Text>
}

widget.register(VariableWidget)
```

📝 **Full Documentation**

For comprehensive information about using the Variables API, see [Working with Variables](https://developers.figma.com/docs/plugins/working-with-variables/) in the Plugin API documentation.

---

## Get Variables and Collections

### Get All Local Variable Collections

Returns all local variable collections in the current file.

```tsx
const localCollections = await figma.variables.getLocalVariableCollectionsAsync()
```

### Get Variable Collection by ID

Finds a variable collection by ID. Returns `null` if not found.

```tsx
const collection = await figma.variables.getVariableCollectionByIdAsync(
  'VariableCollectionId:257c3beb2/57:13'
)
```

### Get All Local Variables

Returns all local variables in the current file, optionally filtering by resolved type.

```tsx
// Get all local variables
const allVariables = await figma.variables.getLocalVariablesAsync()

// Filter by type
const stringVariables = await figma.variables.getLocalVariablesAsync('STRING')
const colorVariables = await figma.variables.getLocalVariablesAsync('COLOR')
const floatVariables = await figma.variables.getLocalVariablesAsync('FLOAT')
```

### Get Variable by ID

Finds a variable by ID. Returns `null` if not found.

```tsx
const variable = await figma.variables.getVariableByIdAsync(variableId)
```

---

## Create Variables and Collections

### Create a Variable Collection

```tsx
const collection = figma.variables.createVariableCollection('Example Collection')
```

### Create a Variable

Creates a variable with a name, collection, and type.

```tsx
const variable = figma.variables.createVariable(
  'ExampleVariableName',
  collection,
  'STRING'
)
```

**Variable Types:**
- `'COLOR'` - For colors
- `'FLOAT'` - For numbers (spacing, sizing, opacity)
- `'STRING'` - For text (font names, content)
- `'BOOLEAN'` - For true/false values

### Example: Create Collection with Modes

```tsx
onClick={async () => {
  // Create collection
  const collection = figma.variables.createVariableCollection('semantic colors')

  // Rename first mode to "light"
  collection.renameMode(collection.modes[0].modeId, 'light')

  // Add "dark" mode
  const darkModeId = collection.addMode('dark')
  const lightModeId = collection.modes[0].modeId

  // Create color variable
  const colorVariable = figma.variables.createVariable(
    'text-primary',
    collection,
    'COLOR'
  )

  // Set values for each mode
  colorVariable.setValueForMode(lightModeId, { r: 0, g: 0, b: 0 }) // #000 in light
  colorVariable.setValueForMode(darkModeId, { r: 1, g: 1, b: 1 })  // #fff in dark

  figma.notify('Created variable collection with modes')
}}
```

---

## Bind Variables to Nodes

For a variable to apply its value to a node, the variable must be **bound** to the node.

### Simple Field Binding

Use `setBoundVariable` for simple fields like `width`, `opacity`, etc.

```tsx
onClick={async () => {
  const collection = figma.variables.createVariableCollection('example-collection')
  const widthVariable = figma.variables.createVariable(
    'width-variable',
    collection,
    'FLOAT'
  )

  const exampleNode = await figma.getNodeByIdAsync('1:4')

  // Bind variable to width
  exampleNode.setBoundVariable('width', widthVariable)
}}
```

### Get Bound Variables

Access bound variables via the `boundVariables` property.

```tsx
const exampleNode = await figma.getNodeByIdAsync('1:4')
const exampleNodeVariables = exampleNode.boundVariables

/* Example boundVariables object:
  {
    "strokes": [
      {
        "type": "VARIABLE_ALIAS",
        "id": "VariableID:1:7"
      }
    ]
  }
*/
```

### Unbind Variables

Set the bound field to `null` to remove a variable binding.

```tsx
exampleNode.setBoundVariable('width', null)
```

### Complex Field Binding

For fills, strokes, effects, and layout grids, use helper methods and immutable array patterns.

**Binding to Fills:**

```tsx
const collection = figma.variables.createVariableCollection('new-collection')
const colorVariable = figma.variables.createVariable(
  'color-variable',
  collection,
  'COLOR'
)

const node = await figma.getNodeByIdAsync('...')

// Must clone array, modify, and reassign
const fillsCopy = [...node.fills]
fillsCopy[0] = figma.variables.setBoundVariableForPaint(
  fillsCopy[0],
  'color',
  colorVariable
)
node.fills = fillsCopy
```

**Binding to Effects:**

```tsx
const radiusVariable = figma.variables.createVariable(
  'radius-variable',
  collection,
  'FLOAT'
)

const effectsCopy = [...node.effects]
effectsCopy[0] = figma.variables.setBoundVariableForEffect(
  effectsCopy[0],
  'radius',
  radiusVariable
)
node.effects = effectsCopy
```

**Binding to Layout Grids:**

```tsx
const countVar = figma.variables.createVariable(
  'count-variable',
  collection,
  'FLOAT'
)

const layoutGridsCopy = [...node.layoutGrids]
layoutGridsCopy[0] = figma.variables.setBoundVariableForLayoutGrid(
  layoutGridsCopy[0],
  'count',
  countVar
)
node.layoutGrids = layoutGridsCopy
```

---

## Typography Variables

Typography variables control text styling for `TextNodes`, `TextSublayers` (substrings), and `TextStyles`.

### Bindable Typography Properties

- **`fontFamily`** - String variables (e.g., "Inter")
- **`fontStyle`** - String variables (e.g., "Regular", "Bold")
- **`fontWeight`** - Number variables (closest valid weight used)
- **`lineHeight`** - Number variables
- **`letterSpacing`** - Number variables
- **`paragraphSpacing`** - Number variables (not for substrings)
- **`paragraphIndent`** - Number variables (not for substrings)

### Bind to TextNode

```tsx
onClick={async () => {
  const collection = figma.variables.createVariableCollection('example-collection')
  const weightVariable = figma.variables.createVariable(
    'weight-variable',
    collection,
    'FLOAT'
  )

  const exampleTextNode = await figma.getNodeByIdAsync('1:4')

  // Bind to entire text node
  exampleTextNode.setBoundVariable('fontWeight', weightVariable)
}}
```

### Bind to Text Range (Substring)

Use `setRangeBoundVariable` to bind variables to specific character ranges.

```tsx
const exampleTextNode = await figma.getNodeByIdAsync('1:4')

// Bind to characters 0-5
exampleTextNode.setRangeBoundVariable(
  0,     // start index
  5,     // end index
  'fontWeight',
  weightVariable
)
```

### Get Typography Variables

**For entire TextNode:**

```tsx
const exampleTextNode = await figma.getNodeByIdAsync('1:4')
const exampleTextNodeVariables = exampleTextNode.boundVariables
```

**For text segments:**

```tsx
exampleTextNode.getStyledTextSegments(['boundVariables'])

/* Example output:
[
  {
    characters: "hello",
    start: 0,
    end: 5,
    boundVariables: {
      fontFamily: { type: "VARIABLE_ALIAS", id: "VariableID:1:7" }
    }
  },
  {
    characters: " world",
    start: 5,
    end: 11,
    boundVariables: {
      fontFamily: { type: "VARIABLE_ALIAS", id: "VariableID:2:8" }
    }
  }
]
*/
```

**For specific range:**

```tsx
exampleTextNode.getRangeBoundVariable(0, 5, 'fontWeight')
```

### Bind to TextStyle

```tsx
onClick={async () => {
  const collection = figma.variables.createVariableCollection('example-collection')
  const weightVariable = figma.variables.createVariable(
    'weight-variable',
    collection,
    'FLOAT'
  )

  const localTextStyles = await figma.getLocalTextStylesAsync()
  const exampleTextStyle = localTextStyles[0]

  // Bind to text style
  exampleTextStyle.setBoundVariable('fontWeight', weightVariable)
}}
```

---

## Extended Variable Collections

🏢 **Enterprise Feature**

Extended variable collections enable theming for variables. Extended collections inherit modes and variables from their parent collection.

### Create Extended Collection

**From local collection:**

```tsx
const localCollection = figma.variables.createVariableCollection('example-collection')
const extendedCollection = localCollection.extend('extended-collection-1')
```

**From library collection:**

```tsx
const libraryCollection = await figma.variables.getVariableCollectionByIdAsync(
  'VariableCollectionId:1:3'
)
const extendedCollection = await figma.variables.extendLibraryCollectionByKeyAsync(
  libraryCollection.key,
  'extended-collection-2'
)
```

### Override Variable Values

```tsx
const modeId = extendedCollection.modes[0].modeId
const variable = await figma.variables.getVariableByIdAsync(
  extendedCollection.variableIds[0]
)

// Override value for this mode
variable.setValueForMode(modeId, { r: 1, g: 0, b: 0 })
```

### Get Extended Collection Values

```tsx
// Get values including overrides
const values = await variable.valuesByModeForCollectionAsync(extendedCollection)
console.log(values)
// Example: {"VariableCollectionId:1:3/0:1": { r: 1, g: 0, b: 0, a: 1 } }

// Get all overrides
const overrides = extendedCollection.variableOverrides
console.log(overrides)
// Example: { "VariableID:1:4": { "VariableCollectionId:1:3/0:1": { r: 1, g: 0, b: 0, a: 1 } } }
```

### Remove Overrides

```tsx
// Remove specific override
variable.removeOverrideForMode(extendedCollection.modes[0].modeId)

// Remove all overrides for variable
extendedCollection.removeOverridesForVariable(variable.id)
```

---

## Helper Methods

### createVariableAlias

Creates a variable alias for binding variables to other variables or properties.

```tsx
const alias = figma.variables.createVariableAlias(variable)
```

### createVariableAliasByIdAsync

Creates an alias by variable ID.

```tsx
const alias = await figma.variables.createVariableAliasByIdAsync(variableId)
```

### setBoundVariableForPaint

Binds a variable to a SolidPaint.

```tsx
const updatedPaint = figma.variables.setBoundVariableForPaint(
  paint,
  'color',
  colorVariable
)
```

### setBoundVariableForEffect

Binds a variable to an Effect.

```tsx
const updatedEffect = figma.variables.setBoundVariableForEffect(
  effect,
  'radius',
  radiusVariable
)
```

### setBoundVariableForLayoutGrid

Binds a variable to a LayoutGrid.

```tsx
const updatedGrid = figma.variables.setBoundVariableForLayoutGrid(
  grid,
  'count',
  countVariable
)
```

### importVariableByKeyAsync

Loads a variable from the team library.

```tsx
const libraryVariable = await figma.variables.importVariableByKeyAsync(variableKey)
```

---

## Resources

### Variables API

- **[figma.variables](https://developers.figma.com/docs/plugins/api/figma-variables/)** - Main variables API object
- **[Working with Variables (Plugin API)](https://developers.figma.com/docs/plugins/working-with-variables/)** - Complete plugin documentation
- **[Variable](https://developers.figma.com/docs/plugins/api/Variable/)** - Variable object reference
- **[VariableCollection](https://developers.figma.com/docs/plugins/api/VariableCollection/)** - Collection object reference

### Node Methods

- **[setBoundVariable](https://developers.figma.com/docs/plugins/api/properties/nodes-setboundvariable/)** - Bind variables to nodes
- **[boundVariables](https://developers.figma.com/docs/plugins/api/node-properties/#boundvariables)** - Get bound variables
- **[setRangeBoundVariable](https://developers.figma.com/docs/plugins/api/TextNode/#setrangeboundvariable)** - Bind to text ranges
- **[getRangeBoundVariable](https://developers.figma.com/docs/plugins/api/TextNode/#getrangeboundvariable)** - Get range bindings

### Code Samples

- **[Styles to Variables](https://github.com/figma/plugin-samples/tree/master/styles-to-variables)** - Convert styles to variables
- **[Variables Import/Export](https://github.com/figma/plugin-samples/tree/master/variables-import-export)** - Import/export design tokens
- **[Plugin Samples Repository](https://github.com/figma/plugin-samples)** - More examples

### Related Topics

- **[Using the Plugin API](https://developers.figma.com/docs/widgets/using-the-plugin-api/)** - How widgets access Plugin API
- **[Working with Lists](https://developers.figma.com/docs/widgets/working-with-lists/)** - Render variable collections
- **[Images in Widgets](https://developers.figma.com/docs/widgets/images-in-widgets/)** - Next topic

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to work with more widget features? Here's what to explore next:

1. **Work with Images** - [Learn about images in widgets →](https://developers.figma.com/docs/widgets/images-in-widgets/)
2. **Explore Code Samples** - [View variables examples →](https://github.com/figma/plugin-samples)
3. **Build Design Systems** - Use variables for scalable design tokens
4. **Study Plugin API** - [Deep dive into Variables API →](https://developers.figma.com/docs/plugins/working-with-variables/)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
