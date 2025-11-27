# Figma Widget API - Working with Lists

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Basic List Rendering](#basic-list-rendering)
3. [The Key Prop](#the-key-prop)
4. [Common Patterns](#common-patterns)
5. [Best Practices](#best-practices)
6. [Resources](#resources)
7. [Next Steps](#next-steps)

---

## Overview

In some cases, you might want to render a list of values. For example, you might have a list of user photo URLs that you want to render.

### Use Cases

- **Image galleries** - Display multiple images
- **User lists** - Show names, avatars, or profiles
- **Task lists** - Render to-do items or notes
- **Data visualization** - Display chart elements or data points
- **Dynamic content** - Render any array of items

A common pattern to achieve this in JSX is to use **`map()`** to transform an array of data into an array of components.

---

## Basic List Rendering

### Using map() to Render Lists

The standard JavaScript `map()` function is used to iterate over an array and return a new array of components.

**Basic Example:**

```tsx
const { widget } = figma
const { AutoLayout, Image } = widget

const userPhotoUrls = [
  "https://....",
  "https://....",
  "https://....",
]

function ListExample() {
  return (
    <AutoLayout>
      {userPhotoUrls.map(url => {
        return <Image key={url} src={url} />
      })}
    </AutoLayout>
  )
}

widget.register(ListExample)
```

### How It Works

1. **Array of data** - Start with an array of values (`userPhotoUrls`)
2. **Map function** - Use `.map()` to iterate over each item
3. **Return component** - For each item, return a JSX component
4. **Key prop** - Include a `key` prop on each component (explained below)
5. **Render in container** - Wrap in `AutoLayout` or other container

---

## The Key Prop

### Why Keys Are Required

You might notice that we've specified a `key` prop on each image! This works very much in the same way as the [key prop in React](https://reactjs.org/docs/lists-and-keys.html#keys) and is used as a hint to help identify which items have changed/been added/removed across re-renders to improve the performance of re-rendering these items.

⚠️ **Console Warnings**

We'll warn against missing key props in the console whenever we detect lists of children without specified keys. You can fix these warnings by giving each element inside an array a `key`!

### Choosing Good Keys

**Best - Unique IDs:**

```tsx
const tasks = [
  { id: "task-1", title: "Design mockup" },
  { id: "task-2", title: "Write code" },
  { id: "task-3", title: "Test feature" },
]

return (
  <AutoLayout direction="vertical">
    {tasks.map(task => (
      <Text key={task.id}>{task.title}</Text>
    ))}
  </AutoLayout>
)
```

**Good - Unique Stable Values:**

```tsx
const usernames = ["alice", "bob", "charlie"]

return (
  <AutoLayout>
    {usernames.map(name => (
      <Text key={name}>{name}</Text>
    ))}
  </AutoLayout>
)
```

**Avoid - Array Indices:**

```tsx
// ⚠️ Not recommended - indices can cause issues with re-ordering
{items.map((item, index) => (
  <Text key={index}>{item}</Text>
))}
```

⚠️ **Why Avoid Indices?**

Using array indices as keys can cause problems when:
- Items are reordered
- Items are added or removed from the middle of the list
- The list is filtered or sorted

---

## Common Patterns

### Text Lists

Render a list of text items:

```tsx
const { widget } = figma
const { AutoLayout, Text, useSyncedState } = widget

function TodoList() {
  const [todos, setTodos] = useSyncedState("todos", [
    { id: "1", text: "Design widget UI", completed: false },
    { id: "2", text: "Implement features", completed: false },
    { id: "3", text: "Test and debug", completed: false },
  ])

  return (
    <AutoLayout direction="vertical" spacing={8}>
      <Text fontSize={24} fontWeight={700}>To-Do List</Text>
      {todos.map(todo => (
        <Text
          key={todo.id}
          fill={todo.completed ? "#999999" : "#000000"}
          textDecoration={todo.completed ? "strikethrough" : "none"}
        >
          {todo.text}
        </Text>
      ))}
    </AutoLayout>
  )
}

widget.register(TodoList)
```

### Interactive Lists

Add click handlers to list items:

```tsx
const { widget } = figma
const { AutoLayout, Text, useSyncedState } = widget

function InteractiveList() {
  const [items, setItems] = useSyncedState("items", [
    { id: "1", name: "Item 1", selected: false },
    { id: "2", name: "Item 2", selected: false },
    { id: "3", name: "Item 3", selected: false },
  ])

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  return (
    <AutoLayout direction="vertical" spacing={4}>
      {items.map(item => (
        <AutoLayout
          key={item.id}
          padding={12}
          fill={item.selected ? "#e3f2fd" : "#f5f5f5"}
          cornerRadius={8}
          onClick={() => toggleItem(item.id)}
        >
          <Text>{item.name}</Text>
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}

widget.register(InteractiveList)
```

### Image Grids

Create a grid layout with images:

```tsx
const { widget } = figma
const { AutoLayout, Image } = widget

function ImageGrid() {
  const images = [
    { id: "img-1", url: "https://example.com/photo1.jpg" },
    { id: "img-2", url: "https://example.com/photo2.jpg" },
    { id: "img-3", url: "https://example.com/photo3.jpg" },
    { id: "img-4", url: "https://example.com/photo4.jpg" },
  ]

  // Split into rows of 2
  const rows = []
  for (let i = 0; i < images.length; i += 2) {
    rows.push(images.slice(i, i + 2))
  }

  return (
    <AutoLayout direction="vertical" spacing={8}>
      {rows.map((row, rowIndex) => (
        <AutoLayout key={`row-${rowIndex}`} spacing={8}>
          {row.map(image => (
            <Image
              key={image.id}
              src={image.url}
              width={150}
              height={150}
              cornerRadius={8}
            />
          ))}
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}

widget.register(ImageGrid)
```

### Dynamic Lists from Network Data

Fetch data and render as a list:

```tsx
const { widget } = figma
const { AutoLayout, Text, useSyncedState, useEffect } = widget

function DynamicList() {
  const [users, setUsers] = useSyncedState("users", [])
  const [loading, setLoading] = useSyncedState("loading", false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://api.example.com/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AutoLayout direction="vertical" spacing={8}>
      <Text fontSize={24}>User List</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : users.length === 0 ? (
        <Text
          onClick={fetchUsers}
          fill="#0066ff"
          textDecoration="underline"
        >
          Click to load users
        </Text>
      ) : (
        users.map(user => (
          <Text key={user.id}>{user.name}</Text>
        ))
      )}
    </AutoLayout>
  )
}

widget.register(DynamicList)
```

### Nested Lists

Render lists within lists:

```tsx
const { widget } = figma
const { AutoLayout, Text } = widget

function NestedList() {
  const categories = [
    {
      id: "cat-1",
      name: "Fruits",
      items: ["Apple", "Banana", "Orange"],
    },
    {
      id: "cat-2",
      name: "Vegetables",
      items: ["Carrot", "Broccoli", "Spinach"],
    },
  ]

  return (
    <AutoLayout direction="vertical" spacing={16}>
      {categories.map(category => (
        <AutoLayout key={category.id} direction="vertical" spacing={4}>
          <Text fontSize={20} fontWeight={700}>
            {category.name}
          </Text>
          {category.items.map(item => (
            <Text key={item} fill="#666666">
              • {item}
            </Text>
          ))}
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}

widget.register(NestedList)
```

---

## Best Practices

### Performance Optimization

**1. Use Stable Keys**
- Always use unique, stable identifiers as keys
- Prefer IDs from your data over generated values
- Avoid using array indices unless the list never changes

**2. Avoid Expensive Operations in map()**
- Keep the mapping function simple and fast
- Move complex calculations outside the map
- Use memoization for derived values

```tsx
// ❌ Bad - expensive operation in every iteration
{items.map(item => (
  <Text key={item.id}>
    {complexCalculation(item, allItems, settings)}
  </Text>
))}

// ✅ Good - calculate once before mapping
const processedItems = items.map(item => ({
  ...item,
  displayValue: complexCalculation(item, allItems, settings)
}))

return (
  <>
    {processedItems.map(item => (
      <Text key={item.id}>{item.displayValue}</Text>
    ))}
  </>
)
```

### Data Management

**1. Keep List Data in Synced State**
```tsx
const [items, setItems] = useSyncedState("items", [])
```

**2. Use useSyncedMap for Complex Lists**
```tsx
const items = useSyncedMap("items")
// items.set(id, data)
// items.get(id)
```

**3. Validate Data Before Rendering**
```tsx
{Array.isArray(items) && items.length > 0 ? (
  items.map(item => <Text key={item.id}>{item.name}</Text>)
) : (
  <Text>No items to display</Text>
)}
```

### Layout Considerations

**1. Choose Appropriate Container**
- Use `AutoLayout` with `direction="vertical"` for vertical lists
- Use `AutoLayout` with `direction="horizontal"` for horizontal lists
- Add `spacing` for consistent gaps between items

**2. Handle Empty States**
```tsx
{items.length === 0 ? (
  <Text fill="#999999">No items yet</Text>
) : (
  items.map(item => <Text key={item.id}>{item.name}</Text>)
)}
```

**3. Consider Maximum Heights**
- Lists can grow indefinitely
- Be mindful of widget size and performance
- Consider pagination or limits for very large lists

---

## Resources

### Core Concepts

- **[AutoLayout Component](https://developers.figma.com/docs/widgets/api/component-AutoLayout/)** - Container for list items
- **[Widget State & Multiplayer](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)** - Managing list state
- **[useSyncedState](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedstate/)** - Simple list state
- **[useSyncedMap](https://developers.figma.com/docs/widgets/api/properties/widget-usesyncedmap/)** - Complex list data

### React Documentation

- **[Lists and Keys in React](https://reactjs.org/docs/lists-and-keys.html)** - Detailed explanation of keys
- **[Rendering Lists](https://reactjs.org/docs/lists-and-keys.html#rendering-multiple-components)** - React list patterns

### Related Topics

- **[Text Editing](https://developers.figma.com/docs/widgets/text-editing/)** - Input components for list items
- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - Interactive list items
- **[Making Network Requests](https://developers.figma.com/docs/widgets/making-network-requests/)** - Fetch data for lists
- **[Working with Variables](https://developers.figma.com/docs/widgets/working-with-variables/)** - Variable-based list styling

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to enhance your lists? Here's what to explore next:

1. **Add Variables** - [Learn about Figma variables →](https://developers.figma.com/docs/widgets/working-with-variables/)
2. **Make Lists Interactive** - [Add event handlers →](https://developers.figma.com/docs/widgets/handling-user-events/)
3. **Fetch Dynamic Data** - [Make network requests →](https://developers.figma.com/docs/widgets/making-network-requests/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
