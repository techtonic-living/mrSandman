# mrSandman Widget - Features

> Comprehensive feature list and specifications

---

## Core Features

### 1. Collaborative Task Cards

**Status**: 🟡 Planning
**Priority**: High
**Target**: Phase 2

**Description**:
Interactive task cards placed directly on the canvas allowing designers to add, assign, and update tasks. Each user can set their own status/comment without overwriting others. Aggregated view shows overall progress.

**User Story**:

> As a designer collaborating in Figma, I want lightweight task cards on the canvas so that I can track work items without leaving the design context.

**Acceptance Criteria**:

- [ ] Users can add a new task card with title & description
- [ ] Each user can add their own comment (stored per user)
- [ ] Task can be assigned (shared state) and show assignee avatar
- [ ] Progress ring reflects % of subtasks complete
- [ ] Undo only affects the acting user's per-user updates

**Technical Requirements**:

- State management: useSyncedState (shared: title, assignee, subtasks); useSyncedMap (per-user: comments, personal status)
- Components needed: `TaskCard`, `ProgressRing`, `UserAvatarGroup`, `CommentBadge`
- API calls: None (initial phase)

**Design Considerations**:

- Performance impact: Low (limited nodes, simple layout)
- Multiplayer support: Yes
- Mobile compatibility: Yes (tap-friendly hit areas)

---

### 2. Real-Time Voting / Polls

**Status**: ⚪ Not Started
**Priority**: High
**Target**: Phase 2

**Description**:
Create quick polls (e.g., choose a direction/style). Each user can cast one vote; aggregated results update live with animated bars.

**User Story**:

> As a team member, I want to create a poll so that the team can quickly decide between design options without leaving the canvas.

**Acceptance Criteria**:

- [ ] User can create a poll with 2-5 options
- [ ] Each user can vote once and change their vote (last vote counts)
- [ ] Live tally updates for all users within 250ms
- [ ] Animated bar chart reflects percentages
- [ ] Handles ≥20 concurrent users without noticeable lag

**Technical Requirements**:

- State management: useSyncedState (poll meta: question, options); useSyncedMap (votes keyed by sessionId)
- Components needed: `PollContainer`, `OptionRow`, `VoteBar`, `ResultsSummary`
- API calls: None (local only)

**Design Considerations**:

- Performance impact: Medium (frequent updates during voting window)
- Multiplayer support: Yes
- Mobile compatibility: Yes (large tap targets)

---

### 3. Inspiration Mood Board (Image Pins)

**Status**: ⚪ Not Started
**Priority**: Medium
**Target**: Phase 3

**Description**:
Users pin external reference images (URLs) or drag existing Figma images into a board area. Supports lightweight tagging & per-user favorites.

**User Story**:

> As a product designer, I want to collect inspiration images in a shared space so that the team sees a unified visual direction.

**Acceptance Criteria**:

- [ ] Add image via URL (validation + error feedback)
- [ ] Drag existing Figma image node into board to create a pin
- [ ] Per-user favorite (star) stored separately
- [ ] Tag list (shared) with add/remove
- [ ] Grid auto-wrap layout with hover enlarge preview

**Technical Requirements**:

- State management: useSyncedState (shared: pin metadata, tags); useSyncedMap (per-user: favorites)
- Components needed: `MoodBoardGrid`, `ImagePin`, `TagList`, `FavoriteStar`
- API calls: Requires external image fetching -> manifest domain allowlist update (Phase 3)

**Design Considerations**:

- Performance impact: Medium/High (multiple images; need size constraints & lazy load strategy)
- Multiplayer support: Yes
- Mobile compatibility: Partial (image grid scroll)

---

## Feature Priority Matrix

### Must Have (Phase 1-2)

Features critical for MVP functionality:

- [ ] Collaborative Task Cards
- [ ] Real-Time Voting / Polls
- [ ] Basic error handling
- [ ] Multi-user support

### Should Have (Phase 3)

Important features that enhance usability:

- [ ] Inspiration Mood Board
- [ ] Hover states and visual feedback
- [ ] Property menu actions
- [ ] Keyboard shortcuts

### Could Have (Phase 4+)

Nice-to-have features for future releases:

- [ ] Advanced customization
- [ ] Export/import
- [ ] Integration with external tools
- [ ] Analytics dashboard

### Won't Have (Current Scope)

Features explicitly out of scope:

- ❌ [Feature to exclude]
- ❌ [Feature to exclude]

---

## User Experience Features

### Interaction Design

- **On-Canvas Actions**: Primary interactions happen directly on widget
- **Property Menu**: Settings and configuration only
- **Keyboard Support**: Common shortcuts (Copy, Delete, etc.)
- **Touch Support**: Works on iPad and touch devices

### Visual Design

- **Consistent Styling**: Follows Figma design system
- **Responsive Layout**: Adapts to widget size
- **Hover States**: Visual feedback for interactive elements
- **Loading States**: Clear indicators for async operations

### Accessibility

- **Keyboard Navigation**: Tab through interactive elements
- **Screen Reader**: Semantic HTML in iframe UI
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states

---

## Technical Features

### State Management

- **Per-User State**: useSyncedMap for user-specific data
- **Global State**: useSyncedState for shared settings
- **Undo/Redo**: Automatic tracking of state changes
- **Persistence**: State saved across sessions

### Performance

- **Optimized Rendering**: Minimal re-renders
- **Dynamic Loading**: Load pages on-demand
- **Efficient State Updates**: Batch updates where possible
- **Image Optimization**: Use rasterized images for complex effects

### Error Handling

- **Validation**: Input validation with clear error messages
- **Async Errors**: Try/catch with user-friendly notifications
- **Graceful Degradation**: Widget remains functional on errors
- **Debug Mode**: Console logging for development

### Multi-User Support

- **Real-Time Sync**: Instant state synchronization
- **Conflict Resolution**: Proper use of useSyncedMap
- **User Identification**: Track actions by sessionId
- **Collaborative Features**: Multiple users can interact simultaneously

---

## API Integration

### Network Requests

**Enabled**: [ ] Yes [x] No (will switch to Yes for Mood Board in Phase 3)

If enabled:

- **Endpoints**: [list allowed domains]
- **Authentication**: [method]
- **Error Handling**: [strategy]
- **Rate Limiting**: [approach]

### Plugin API Usage

**Features using Plugin API**:

- [ ] Node creation/modification
- [ ] Page access
- [ ] Selection handling
- [ ] Other: [specify]

**Undo Handling**: Use `figma.commitUndo()` for Plugin API changes

---

## Feature Dependencies

```
Feature 1
  ├── Component A
  ├── Component B
  └── Utility X

Feature 2
  ├── Component C
  ├── Utility Y
  └── Depends on: Feature 1

Feature 3
  ├── Component D
  └── Depends on: Feature 1, Feature 2
```

---

## Feature Testing

Each feature must pass:

- [ ] Single-user testing
- [ ] Multi-user testing
- [ ] Undo/redo testing
- [ ] Error scenario testing
- [ ] Performance testing
- [ ] Accessibility testing

---

## Future Feature Ideas

**Brainstorm** - Not committed:

- Idea 1: [description]
- Idea 2: [description]
- Idea 3: [description]

**User Requests** - Track in separate issue tracker

---

**Last Updated**: November 27, 2025
**Owner**: Core Maintainer
**Reviewers**: Design Team, Engineering
