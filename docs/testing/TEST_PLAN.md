# mrSandman Widget - Test Plan

> Comprehensive testing strategy and test cases

---

## Testing Overview

### Testing Philosophy
- **Manual Testing**: Primary method for widgets (no automated testing framework)
- **Multi-User Testing**: Essential for collaborative features
- **Real-World Scenarios**: Test in actual Figma files with team
- **Edge Cases**: Deliberately break things to find issues

---

## Test Environment Setup

### Prerequisites
- Figma Desktop App installed
- Widget imported from manifest
- Multiple test accounts/devices available
- Test Figma file prepared

### Test File Setup
Create a dedicated test file with:
- Multiple pages for different scenarios
- Varied canvas sizes
- Multiple widget instances
- Sample design elements for Plugin API testing

---

## Test Categories

## 1. Basic Functionality Tests

### 1.1 Widget Loading
| Test Case         | Steps                        | Expected Result                 | Status |
| ----------------- | ---------------------------- | ------------------------------- | ------ |
| Widget renders    | Import widget, add to canvas | Widget appears correctly        | [ ]    |
| Initial state     | First widget instance        | Default state displayed         | [ ]    |
| Build succeeds    | Run `npm run build`          | No errors, dist/code.js created | [ ]    |
| Type check passes | Run `npm run tsc`            | No type errors                  | [ ]    |
| Lint passes       | Run `npm run lint`           | No linting errors               | [ ]    |

### 1.2 State Persistence
| Test Case          | Steps                            | Expected Result        | Status |
| ------------------ | -------------------------------- | ---------------------- | ------ |
| State saves        | Modify state, close file, reopen | State persisted        | [ ]    |
| Multiple instances | Create 2+ widgets                | Independent state      | [ ]    |
| Page switch        | Switch pages                     | Widget state unchanged | [ ]    |

---

## 2. Single-User Tests

### 2.1 User Interactions
| Test Case     | Steps                     | Expected Result       | Status |
| ------------- | ------------------------- | --------------------- | ------ |
| Click handler | Click interactive element | Action executed       | [ ]    |
| Text input    | Edit text field           | Text updates          | [ ]    |
| Button press  | Click button              | Expected action       | [ ]    |
| Hover state   | Hover over element        | Visual feedback shown | [ ]    |

### 2.2 State Management
| Test Case      | Steps                     | Expected Result          | Status |
| -------------- | ------------------------- | ------------------------ | ------ |
| Update state   | Trigger state change      | UI updates               | [ ]    |
| useSyncedState | Modify shared state       | All instances update     | [ ]    |
| useSyncedMap   | Modify user-specific data | Only user's data changes | [ ]    |
| Invalid input  | Enter invalid data        | Validation error shown   | [ ]    |

---

## 3. Multi-User Tests

### 3.1 Concurrent Users
| Test Case            | Steps             | Expected Result           | Status |
| -------------------- | ----------------- | ------------------------- | ------ |
| 2 users interact     | Both users click  | Both see updates          | [ ]    |
| Simultaneous edits   | Edit at same time | No conflicts              | [ ]    |
| User A changes state | User A modifies   | User B sees change        | [ ]    |
| Per-user data        | Each user votes   | Independent votes tracked | [ ]    |

### 3.2 State Synchronization
| Test Case      | Steps                         | Expected Result              | Status |
| -------------- | ----------------------------- | ---------------------------- | ------ |
| Real-time sync | User A clicks, User B watches | Instant update on B's screen | [ ]    |
| Network delay  | Simulate slow connection      | Graceful handling            | [ ]    |
| Offline user   | User goes offline, comes back | State syncs correctly        | [ ]    |

---

## 4. Undo/Redo Tests

### 4.1 Single User Undo
| Test Case      | Steps                         | Expected Result       | Status |
| -------------- | ----------------------------- | --------------------- | ------ |
| Undo action    | Perform action, undo (Cmd+Z)  | Action reverted       | [ ]    |
| Redo action    | Undo, then redo (Cmd+Shift+Z) | Action reapplied      | [ ]    |
| Multiple undos | Series of actions, undo all   | All reverted in order | [ ]    |

### 4.2 Multi-User Undo
| Test Case         | Steps                          | Expected Result         | Status |
| ----------------- | ------------------------------ | ----------------------- | ------ |
| User A undoes     | User A performs action, undoes | Only A's action undone  | [ ]    |
| User B unaffected | User A undoes                  | User B's actions intact | [ ]    |
| Shared state undo | Change theme, undo             | Reverts for all users   | [ ]    |
| Per-user undo     | User-specific action, undo     | Only that user affected | [ ]    |

---

## 5. Error Handling Tests

### 5.1 Input Validation
| Test Case          | Steps               | Expected Result     | Status |
| ------------------ | ------------------- | ------------------- | ------ |
| Empty input        | Submit empty field  | Error message shown | [ ]    |
| Invalid format     | Enter wrong format  | Validation error    | [ ]    |
| Too long input     | Exceed max length   | Truncated or error  | [ ]    |
| Special characters | Enter special chars | Handled correctly   | [ ]    |

### 5.2 Async Errors
| Test Case        | Steps                | Expected Result    | Status |
| ---------------- | -------------------- | ------------------ | ------ |
| Network failure  | Simulate API failure | Error notification | [ ]    |
| Timeout          | Simulate slow API    | Timeout handling   | [ ]    |
| Invalid response | Mock bad data        | Error caught       | [ ]    |

### 5.3 Plugin API Errors
| Test Case         | Steps                  | Expected Result  | Status |
| ----------------- | ---------------------- | ---------------- | ------ |
| Node not found    | Reference deleted node | Error handled    | [ ]    |
| Permission denied | Access restricted node | Graceful failure | [ ]    |
| Invalid operation | Try invalid API call   | Error caught     | [ ]    |

---

## 6. Performance Tests

### 6.1 Rendering Performance
| Test Case        | Steps                | Expected Result            | Status |
| ---------------- | -------------------- | -------------------------- | ------ |
| Initial load     | Add widget to canvas | Loads < 1 second           | [ ]    |
| State update     | Trigger re-render    | Updates < 100ms            | [ ]    |
| Large data set   | Display 100+ items   | No lag                     | [ ]    |
| Multiple widgets | Add 10+ instances    | No performance degradation | [ ]    |

### 6.2 Optimization Verification
| Test Case          | Steps                  | Expected Result                  | Status |
| ------------------ | ---------------------- | -------------------------------- | ------ |
| Dynamic page load  | Check manifest setting | `documentAccess: "dynamic-page"` | [ ]    |
| Minimal re-renders | State change           | Only affected parts update       | [ ]    |
| Image optimization | Check image usage      | No complex effects               | [ ]    |
| Blend modes        | Check blend mode usage | Only normal/passthrough          | [ ]    |

---

## 7. Edge Cases

### 7.1 Boundary Conditions
| Test Case          | Steps             | Expected Result      | Status |
| ------------------ | ----------------- | -------------------- | ------ |
| Zero state         | No data present   | Placeholder shown    | [ ]    |
| Maximum data       | Fill to capacity  | Handles gracefully   | [ ]    |
| Very long text     | Enter 1000+ chars | Truncates or scrolls | [ ]    |
| Special characters | Unicode, emojis   | Displays correctly   | [ ]    |

### 7.2 Unusual Scenarios
| Test Case         | Steps                     | Expected Result      | Status |
| ----------------- | ------------------------- | -------------------- | ------ |
| Rapid clicking    | Click repeatedly fast     | No duplicate actions | [ ]    |
| Browser refresh   | Refresh during use        | State persists       | [ ]    |
| Delete & recreate | Delete widget, create new | Fresh state          | [ ]    |
| Copy & paste      | Duplicate widget          | Independent instance | [ ]    |

---

## 8. Accessibility Tests

### 8.1 Keyboard Navigation
| Test Case        | Steps                 | Expected Result       | Status |
| ---------------- | --------------------- | --------------------- | ------ |
| Tab navigation   | Tab through elements  | Focus moves logically | [ ]    |
| Enter activation | Press Enter on button | Action triggered      | [ ]    |
| Escape closes    | Press Esc on modal    | Modal closes          | [ ]    |

### 8.2 Visual Accessibility
| Test Case        | Steps                 | Expected Result     | Status |
| ---------------- | --------------------- | ------------------- | ------ |
| Color contrast   | Check text/background | Meets WCAG AA       | [ ]    |
| Focus indicators | Tab to elements       | Clear focus outline | [ ]    |
| Text size        | Check font sizes      | Readable (12px+)    | [ ]    |

---

## 9. Property Menu Tests

### 9.1 Property Menu Functionality
| Test Case     | Steps            | Expected Result         | Status |
| ------------- | ---------------- | ----------------------- | ------ |
| Menu appears  | Select widget    | Property menu shown     | [ ]    |
| Actions work  | Click menu item  | Action executes         | [ ]    |
| Icons visible | Check menu items | Icons display correctly | [ ]    |
| Tooltips show | Hover menu items | Tooltips appear         | [ ]    |

---

## 10. Integration Tests

### 10.1 Plugin API Integration
| Test Case         | Steps                  | Expected Result        | Status |
| ----------------- | ---------------------- | ---------------------- | ------ |
| Node creation     | Create node via API    | Node appears on canvas | [ ]    |
| Node modification | Modify existing node   | Changes applied        | [ ]    |
| Selection access  | Read current selection | Correct nodes returned | [ ]    |
| Undo committed    | Use figma.commitUndo() | Plugin action undoable | [ ]    |

### 10.2 Network Integration (if applicable)
| Test Case         | Steps                | Expected Result | Status |
| ----------------- | -------------------- | --------------- | ------ |
| API call succeeds | Make network request | Data received   | [ ]    |
| CORS handling     | Cross-origin request | Request allowed | [ ]    |
| Error handling    | API returns error    | Error handled   | [ ]    |
| Timeout handling  | Slow API response    | Timeout managed | [ ]    |

---

## Test Execution

### Before Each Test Session
- [ ] Run `npm run build` to ensure latest code
- [ ] Check console for warnings/errors
- [ ] Clear browser cache if needed
- [ ] Prepare test data/scenarios

### During Testing
- [ ] Document unexpected behavior
- [ ] Screenshot any visual issues
- [ ] Note performance problems
- [ ] Record steps to reproduce bugs

### After Testing
- [ ] Update test status in this document
- [ ] File issues for failed tests
- [ ] Update code based on findings
- [ ] Re-test fixed issues

---

## Bug Report Template

```markdown
## Bug Report

**Title**: [Brief description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Environment**:
- Figma version: [version]
- OS: [macOS/Windows]
- Browser: [if iframe involved]

**Screenshots/Video**:
[Attach if applicable]

**Additional Context**:
[Any other relevant information]
```

---

## Testing Schedule

### Phase 1: Development Testing
- **Frequency**: Continuous during development
- **Focus**: Feature functionality, basic interactions
- **Testers**: Developer

### Phase 2: Integration Testing
- **Frequency**: After each feature completion
- **Focus**: Multi-user, state management, integration
- **Testers**: Developer + 1-2 team members

### Phase 3: User Acceptance Testing
- **Frequency**: Before release
- **Focus**: Real-world scenarios, usability
- **Testers**: Target users (5-10 people)

### Phase 4: Regression Testing
- **Frequency**: Before each release
- **Focus**: Ensure fixes didn't break existing features
- **Testers**: Developer + QA

---

## Success Criteria

Widget is ready for release when:
- [ ] All critical and high-priority test cases pass
- [ ] No critical or high-severity bugs remain
- [ ] Multi-user scenarios work reliably
- [ ] Performance meets targets
- [ ] User acceptance testing successful
- [ ] Documentation complete

---

## Test Results Summary

**Last Test Run**: [Date]
**Total Tests**: [Number]
**Passed**: [Number]
**Failed**: [Number]
**Blocked**: [Number]
**Pass Rate**: [Percentage]

### Known Issues
1. [Issue description] - [Status]
2. [Issue description] - [Status]

---

**Test Plan Owner**: [Your name]
**Last Updated**: November 26, 2025
**Next Review**: [Date]
