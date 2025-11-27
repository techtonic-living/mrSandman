# Figma Widget API - Managing Multiple Widgets

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Widget Identification](#widget-identification)
3. [Finding Widget Instances](#finding-widget-instances)
4. [Reading Widget State](#reading-widget-state)
5. [Cloning Widgets](#cloning-widgets)
6. [Updating Widget State](#updating-widget-state)
7. [Use Cases](#use-cases)
8. [Resources](#resources)
9. [Next Steps](#next-steps)

---

## Overview

So far, we've only been talking about single, standalone widgets. For certain use cases, you might want to coordinate across instances of your widget within the same file!

### Why Manage Multiple Widgets?

- **Multi-widget experiences** - Org charts, sticky note systems, kanban boards
- **Cross-widget coordination** - Synchronize data across widget instances
- **Voting/polling systems** - Track user actions across multiple widgets
- **Resource limits** - Enforce limits (e.g., max votes per user)
- **Bulk operations** - Update or query all widget instances at once

### Key Concepts

The [Plugin API](https://developers.figma.com/docs/plugins/) has been augmented to complement the Widget API seamlessly with these use cases in mind:

- **`widgetId`** - Unique identifier from `manifest.json`
- **`widgetSyncedState`** - Access state of other widget instances
- **`cloneWidget()`** - Create new instances with custom state
- **`setWidgetSyncedState()`** - Update state of other instances
- **`findWidgetNodesByWidgetId()`** - Find all matching widgets

---

## Widget Identification

### WidgetNode.widgetId and figma.widgetId

Every WidgetNode is associated with its corresponding `manifest.json` "id" field, and you can use the Plugin API to read this value to check if a given widget node belongs to your widget.

**Check Widget Ownership:**

```tsx
const allWidgetNodes: WidgetNode[] = figma.currentPage.findAll(node => {
  return node.type === "WIDGET"
})

const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter(node => {
  return node.widgetId === figma.widgetId
})
```

### Widget ID Source

The `widgetId` comes from the `"id"` field in your `manifest.json`:

**manifest.json:**
```json
{
  "name": "My Widget",
  "id": "1234567890123456789",
  "widgetApi": "1.0.0",
  "containsWidget": true
}
```

**Usage:**
```tsx
// figma.widgetId === "1234567890123456789"
// Only nodes with matching widgetId belong to your widget
```

---

## Finding Widget Instances

### findWidgetNodesByWidgetId()

If you want to find all of the widget nodes that match the same `node.widgetId`, you can use [findWidgetNodesByWidgetId()](https://developers.figma.com/docs/plugins/api/properties/nodes-findwidgetnodesbywidgetid/).

**Method Signature:**

```tsx
findWidgetNodesByWidgetId(widgetId: string): Array<WidgetNode>
```

**Basic Usage:**

```tsx
onClick={async () => {
  // Find all instances of this widget
  const myWidgets = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId)

  figma.notify(`Found ${myWidgets.length} widget instances`)
}}
```

### Find All Widget Instances

```tsx
const { widget } = figma
const { Text } = widget

function WidgetCounter() {
  return (
    <Text
      onClick={async () => {
        const widgets = figma.currentPage.findWidgetNodesByWidgetId(
          figma.widgetId
        )

        // Process all widget instances
        const totalCount = widgets.reduce((sum, w) => {
          return sum + (w.widgetSyncedState?.count || 0)
        }, 0)

        figma.notify(`Total across ${widgets.length} widgets: ${totalCount}`)
      }}
    >
      Count All Widgets
    </Text>
  )
}

widget.register(WidgetCounter)
```

---

## Reading Widget State

### WidgetNode.widgetSyncedState

Using the Plugin API, you can read the syncedState of a given widget node via [WidgetNode.widgetSyncedState](https://developers.figma.com/docs/plugins/api/WidgetNode/#widgetsyncedstate).

⚠️ **Widget-Specific Access**

Similar to [pluginData](https://developers.figma.com/docs/plugins/api/DocumentNode/#getplugindata), access to this data is widget-specific! The synced state on each widget node will only be visible to widgets that have the same `WidgetNode.widgetId`.

### Voting Widget Example

You can implement a voting widget that caps the maximum number of votes each user can make within the file. Prior to registering a user's vote, you can sum up the total number of votes the particular user has made by enumerating through all your widgets in the current file.

**Complete Example:**

```tsx
const { widget } = figma
const { Text, useSyncedMap } = widget

const MAX_VOTES_ALLOWED = 5

function CounterWidget() {
  const votes = useSyncedMap<number>("votes")

  return (
    <Text
      onClick={() => {
        let numVotes = 0
        figma.currentPage.children.forEach(node => {
          if (node.type === "WIDGET" && node.widgetId === figma.widgetId) {
            numVotes += node.widgetSyncedState[figma.currentUser.id]
          }
        })

        if (numVotes >= MAX_VOTES_ALLOWED) {
          figma.notify(`You've already voted ${MAX_VOTES_ALLOWED} times.`)
        } else {
          votes.set(figma.currentUser.id, 1)
        }
      }}
    >
      {votes.size()}
    </Text>
  )
}

widget.register(CounterWidget)
```

### Access Patterns

**Read specific state value:**

```tsx
const widget = myWidgets[0]
const userVotes = widget.widgetSyncedState['votes'] || 0
```

**Read all state:**

```tsx
const allState = widget.widgetSyncedState
// Returns object with all synced state and synced map values
```

**Aggregate across widgets:**

```tsx
const widgets = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId)
const totalVotes = widgets.reduce((sum, w) => {
  return sum + (w.widgetSyncedState['voteCount'] || 0)
}, 0)
```

---

## Cloning Widgets

### WidgetNode.cloneWidget()

Additionally, given a widget node, you can clone it with a custom synced state and synced map values using [WidgetNode.cloneWidget()](https://developers.figma.com/docs/plugins/api/WidgetNode/#clonewidget).

**Method Signature:**

```tsx
interface WidgetNode {
  cloneWidget(
    syncedStateOverrides: { [name: string]: any },
    syncedMapOverrides?: { [mapName: string]: { [key: string]: any } }
  ): WidgetNode
}
```

⚠️ **Important Behavior**

Every key in `syncedMapOverrides` will override the **entire** corresponding synced map, deleting all existing keys in the map. If you wish to preserve some of the keys in the map, you'll need to explicitly specify them in the override.

⚠️ **Widget-Specific Access**

Similar to `WidgetNode.widgetSyncedState`, this is only supported for widgets that share the same `WidgetNode.widgetId`! Only you can call this function on your widget nodes.

### Basic Cloning

```tsx
onClick={async () => {
  // Get current widget node
  const currentWidget = figma.currentPage.findWidgetNodesByWidgetId(
    figma.widgetId
  )[0]

  // Clone with new state
  const newWidget = currentWidget.cloneWidget({
    title: "Cloned Widget",
    count: 0
  })

  // Position next to original
  newWidget.x = currentWidget.x + currentWidget.width + 20
  newWidget.y = currentWidget.y

  figma.notify('Widget cloned!')
}}
```

### Clone with State and Maps

```tsx
onClick={async () => {
  const currentWidget = figma.currentPage.findWidgetNodesByWidgetId(
    figma.widgetId
  )[0]

  // Clone with both state overrides and map overrides
  const newWidget = currentWidget.cloneWidget(
    {
      // Synced state overrides
      title: "New Task",
      completed: false
    },
    {
      // Synced map overrides
      votes: {
        "user1": 1,
        "user2": 1
      },
      comments: {
        "comment1": "Initial comment"
      }
    }
  )

  // Position the clone
  newWidget.x = currentWidget.x
  newWidget.y = currentWidget.y + currentWidget.height + 20
}}
```

### Org Chart Example

When used in combination with the `useWidgetId` hook, this lets you create rich, multi-widget experiences like an Org Chart, where each Org Chart Item is its own widget.

```tsx
const { widget } = figma
const { Text, AutoLayout, useSyncedState } = widget

function OrgChartItem() {
  const [name, setName] = useSyncedState('name', 'Employee')
  const [role, setRole] = useSyncedState('role', 'Role')

  return (
    <AutoLayout direction="vertical" spacing={8} padding={16}>
      <Text fontSize={18} fontWeight={700}>{name}</Text>
      <Text fontSize={14} fill="#666666">{role}</Text>

      <Text
        fontSize={12}
        fill="#0066ff"
        onClick={async () => {
          const currentWidget = figma.currentPage.findWidgetNodesByWidgetId(
            figma.widgetId
          )[0]

          // Clone to create new org chart item
          const newWidget = currentWidget.cloneWidget({
            name: 'New Employee',
            role: 'New Role'
          })

          // Position below current item
          newWidget.x = currentWidget.x
          newWidget.y = currentWidget.y + currentWidget.height + 40
        }}
      >
        + Add Report
      </Text>
    </AutoLayout>
  )
}

widget.register(OrgChartItem)
```

### Positioning Clones

⚠️ **Parent Handling**

Similar to [WidgetNode.clone](https://developers.figma.com/docs/plugins/api/WidgetNode/#clone), the duplicate will be parented under `figma.currentPage`. If you are relying on the x, y or the relativeTransform of the original widget, make sure to account for the case where the original widget is parented under a different node (e.g., a section).

---

## Updating Widget State

### WidgetNode.setWidgetSyncedState()

Not only can you clone a widget with a new synced state and synced map values, you can also set the state on an existing widget matching the same `node.widgetId` using [setWidgetSyncedState()](https://developers.figma.com/docs/plugins/api/WidgetNode/#setwidgetsyncedstate).

This can be helpful for managing multi-widget experiences where the user is able to update other widgets by taking an action on a single widget.

**Method Signature:**

```tsx
interface WidgetNode {
  setWidgetSyncedState(
    syncedState: { [name: string]: any },
    syncedMap?: { [mapName: string]: { [key: string]: any } }
  ): void
}
```

### Update Other Widget Instances

```tsx
onClick={async () => {
  const widgets = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId)

  // Update all widget instances
  widgets.forEach(widget => {
    widget.setWidgetSyncedState({
      lastUpdated: Date.now(),
      status: 'synced'
    })
  })

  figma.notify(`Updated ${widgets.length} widgets`)
}}
```

### Broadcast Updates

```tsx
const { widget } = figma
const { Text, useSyncedState } = widget

function BroadcastWidget() {
  const [message, setMessage] = useSyncedState('message', 'Hello')

  return (
    <Text
      onClick={async () => {
        const newMessage = 'Updated: ' + Date.now()

        // Update this widget
        setMessage(newMessage)

        // Update all other instances
        const widgets = figma.currentPage.findWidgetNodesByWidgetId(
          figma.widgetId
        )

        widgets.forEach(w => {
          w.setWidgetSyncedState({ message: newMessage })
        })
      }}
    >
      {message}
    </Text>
  )
}

widget.register(BroadcastWidget)
```

### Update with Maps

```tsx
const widgets = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId)

widgets.forEach(widget => {
  widget.setWidgetSyncedState(
    {
      // Update synced state
      status: 'active'
    },
    {
      // Update synced maps
      users: {
        'user1': { active: true },
        'user2': { active: false }
      }
    }
  )
})
```

---

## Use Cases

### Vote Limiting System

Prevent users from voting more than a certain number of times across all widgets:

```tsx
const MAX_VOTES = 5

function checkUserVotes(userId: string): number {
  const widgets = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId)

  return widgets.reduce((total, widget) => {
    const userVote = widget.widgetSyncedState[userId] || 0
    return total + userVote
  }, 0)
}

function VoteWidget() {
  const votes = useSyncedMap<number>('votes')

  return (
    <Text
      onClick={() => {
        const userId = figma.currentUser.id
        const userTotalVotes = checkUserVotes(userId)

        if (userTotalVotes >= MAX_VOTES) {
          figma.notify(`You've reached the maximum of ${MAX_VOTES} votes`)
        } else {
          votes.set(userId, (votes.get(userId) || 0) + 1)
        }
      }}
    >
      Vote ({votes.size()})
    </Text>
  )
}
```

### Synchronized Status Board

Update all widgets when one changes:

```tsx
function StatusCard() {
  const [status, setStatus] = useSyncedState('status', 'pending')

  return (
    <Text
      onClick={async () => {
        const newStatus = 'completed'
        setStatus(newStatus)

        // Update all sibling widgets
        const widgets = figma.currentPage.findWidgetNodesByWidgetId(
          figma.widgetId
        )

        const completedCount = widgets.filter(
          w => w.widgetSyncedState.status === 'completed'
        ).length

        figma.notify(`${completedCount}/${widgets.length} completed`)
      }}
    >
      Status: {status}
    </Text>
  )
}
```

### Widget Templates

Create new widgets from template instances:

```tsx
function TemplateWidget() {
  const [isTemplate] = useSyncedState('isTemplate', true)

  if (isTemplate) {
    return (
      <Text
        onClick={async () => {
          const currentWidget = figma.currentPage.findWidgetNodesByWidgetId(
            figma.widgetId
          )[0]

          // Clone from template
          const newWidget = currentWidget.cloneWidget({
            isTemplate: false,
            title: 'New Item',
            createdAt: Date.now()
          })

          newWidget.x = currentWidget.x + 200
        }}
      >
        Click to create from template
      </Text>
    )
  }

  return <Text>Widget instance</Text>
}
```

---

## Resources

### Widget Node API

- **[WidgetNode](https://developers.figma.com/docs/plugins/api/WidgetNode/)** - WidgetNode interface
- **[widgetSyncedState](https://developers.figma.com/docs/plugins/api/WidgetNode/#widgetsyncedstate)** - Read widget state
- **[cloneWidget()](https://developers.figma.com/docs/plugins/api/WidgetNode/#clonewidget)** - Clone with custom state
- **[setWidgetSyncedState()](https://developers.figma.com/docs/plugins/api/WidgetNode/#setwidgetsyncedstate)** - Update widget state
- **[findWidgetNodesByWidgetId()](https://developers.figma.com/docs/plugins/api/properties/nodes-findwidgetnodesbywidgetid/)** - Find widget instances

### Related Topics

- **[Widget State & Multiplayer](https://developers.figma.com/docs/widgets/widget-state-and-multiplayer/)** - State synchronization
- **[Using the Plugin API](https://developers.figma.com/docs/widgets/using-the-plugin-api/)** - Accessing Plugin API
- **[Images in Widgets](https://developers.figma.com/docs/widgets/images-in-widgets/)** - Previous topic
- **[Adding Hover States](https://developers.figma.com/docs/widgets/adding-hover-states/)** - Next topic

### Code Samples

- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples
- **[Plugin API Documentation](https://developers.figma.com/docs/plugins/)** - Full Plugin API reference

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server

---

## Next Steps

Ready to enhance your widgets? Here's what to explore next:

1. **Add Hover States** - [Learn about hover interactions →](https://developers.figma.com/docs/widgets/adding-hover-states/)
2. **Build Multi-Widget Systems** - Create org charts, kanban boards, or voting systems
3. **Explore Plugin API** - [Deep dive into Plugin API →](https://developers.figma.com/docs/plugins/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)
