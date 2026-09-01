# Keyboard Interaction Reference

Use this reference when reviewing keyboard accessibility.

The objective is to verify that users can **discover, operate, navigate, and exit interactive components using only a keyboard**.

Keyboard accessibility is not limited to pressing Tab through a page. Complex components often require specific keyboard interactions and intentional focus management.

---

# Core Principles

## 1. Every interactive operation needs a keyboard equivalent

If an action can be performed with a pointer, determine how a keyboard user performs the same action.

Check:

* Tab
* Shift+Tab
* Enter
* Space
* Escape
* Arrow keys
* Home
* End
* PageUp
* PageDown

Do not require every key for every component.

The expected interaction depends on the semantic pattern.

---

## 2. Prefer native HTML

Native controls already provide correct keyboard behavior.

Prefer:

```html
<button type="button">
  Save
</button>
```

over manually implementing:

```javascript
element.addEventListener("keydown", ...)
```

on a generic element.

Native controls should be the default solution unless there is a concrete reason to build a custom interaction.

---

## 3. Do not add keyboard behavior blindly

Do not make every element respond to:

```text
Enter
Space
Arrow keys
Escape
```

simply because it is interactive.

First identify:

1. What the component does.
2. Which semantic pattern it represents.
3. What keyboard behavior that pattern requires.

---

# Sequential Focus Navigation

## Tab

`Tab` moves forward through the sequential focus order.

Typical focusable elements include:

* links
* buttons
* form controls
* elements with appropriate `tabindex`

Check that:

* all interactive controls are reachable
* non-interactive elements are not unnecessarily focusable
* focus order is logical
* hidden content is not reachable
* disabled controls behave appropriately

---

## Shift+Tab

`Shift+Tab` moves backwards through the sequential focus order.

Test both directions.

A component that works only when entering it with Tab may still have broken focus behavior when navigating backwards.

---

# Focus Order

Focus order should generally follow the logical reading and interaction order.

Prefer:

```html id="8qf7cm"
<header />
<main>
  <button>First</button>
  <button>Second</button>
</main>
```

over relying on CSS to create a conflicting interaction order.

Be suspicious of:

```css id="0wq3a6"
order: 2;
```

```css id="qf8k3y"
flex-direction: row-reverse;
```

and complex positioning.

Visual order and DOM order can differ, but this should not create a confusing keyboard experience.

---

# `tabindex`

## `tabindex="0"`

Use when a genuinely custom interactive element needs to participate in sequential focus navigation.

Do not use it as a substitute for native HTML.

Bad:

```html id="z4d0os"
<div tabindex="0" role="button">
  Save
</div>
```

when this could simply be:

```html id="5vtr3b"
<button>
  Save
</button>
```

---

## `tabindex="-1"`

Allows programmatic focus without adding the element to the normal Tab sequence.

Useful for:

* dialog headings
* focus management targets
* dynamically inserted content
* application navigation targets

Example:

```html id="e3x3dl"
<h2 tabindex="-1">
  Search results
</h2>
```

Do not use `tabindex="-1"` to hide an interactive control from keyboard users.

---

## Positive tabindex

Avoid:

```html id="10yl8c"
tabindex="1"
tabindex="2"
tabindex="3"
```

Positive tabindex values create a separate focus order that is difficult to maintain.

Prefer:

* native DOM order
* native interactive elements
* `tabindex="0"` where genuinely necessary
* `tabindex="-1"` for programmatic focus

---

# Focus Visibility

Keyboard users must be able to identify the current focus.

Check:

* visible focus indicator
* sufficient contrast
* indicator remains visible across states
* focus is not obscured
* component styles do not accidentally remove it

Be suspicious of:

```css id="9m8a3y"
outline: none;
```

or:

```css id="5c0e3h"
outline: 0;
```

These are not automatically violations if an equivalent visible focus indication exists, but the replacement must be evaluated.

---

# Focus Obscured

A focused element should not be completely hidden by:

* sticky headers
* sticky footers
* dialogs
* overlays
* popovers
* browser-like application chrome

When a component receives focus programmatically, verify that the focused element remains visible to the user.

---

# Button Interaction

Use a native button whenever possible.

Expected keyboard interaction:

| Key   | Behavior |
| ----- | -------- |
| Enter | Activate |
| Space | Activate |

Native `<button>` provides this behavior.

Avoid manually implementing button keyboard behavior on generic elements.

---

# Link Interaction

Native links should be used for navigation.

Expected:

| Key   | Behavior |
| ----- | -------- |
| Enter | Activate |

Do not require Space to activate a normal link.

Do not implement navigation using a generic clickable element.

---

# Checkbox Interaction

Expected:

| Key   | Behavior |
| ----- | -------- |
| Space | Toggle   |

Native checkboxes provide this behavior.

The visual state, form state, and accessibility state must remain synchronized.

---

# Radio Group Interaction

A native radio group provides browser-managed keyboard behavior.

For custom radio groups, review:

* Arrow keys
* Space
* focus behavior
* selected state

Typical behavior:

| Key                    | Behavior        |
| ---------------------- | --------------- |
| ArrowUp / ArrowLeft    | Previous option |
| ArrowDown / ArrowRight | Next option     |
| Space                  | Select          |

Do not implement custom radio navigation without verifying the expected interaction model.

---

# Switch Interaction

For a switch:

| Key   | Behavior |
| ----- | -------- |
| Space | Toggle   |

Verify:

* focus remains on the switch after toggling
* `aria-checked` reflects the new state
* visual state changes
* application state changes

---

# Disclosure Interaction

A disclosure is normally triggered by a native button.

Expected:

| Key   | Behavior |
| ----- | -------- |
| Enter | Toggle   |
| Space | Toggle   |

After activation:

* the content should actually appear/disappear
* `aria-expanded` should update
* focus should remain predictable

Do not move focus unnecessarily when expanding or collapsing content.

---

# Accordion Interaction

Accordion triggers should normally be buttons.

Expected interaction:

| Key   | Behavior |
| ----- | -------- |
| Enter | Toggle   |
| Space | Toggle   |

If the implementation supports additional accordion navigation, verify that it is intentional and consistent.

Do not add Arrow key navigation simply because another widget uses Arrow keys.

---

# Dialog Interaction

For a modal dialog:

| Key       | Expected behavior            |
| --------- | ---------------------------- |
| Tab       | Move through dialog controls |
| Shift+Tab | Move backwards               |
| Escape    | Close when supported         |

## Opening

When the dialog opens:

1. Move focus into the dialog when appropriate.
2. Focus a meaningful element.
3. Ensure the focused element is visible.
4. Prevent accidental interaction with the underlying page.

Do not blindly focus the first button.

The appropriate initial focus depends on the purpose of the dialog.

---

## While open

Verify:

* focus cannot accidentally escape the modal
* all interactive controls are reachable
* background content is not accidentally keyboard accessible
* Escape behaves appropriately
* focus remains understandable

---

## Closing

When the dialog closes:

1. Return focus to the invoking element when appropriate.
2. If the invoking element no longer exists, choose the next logical target.
3. Do not leave focus on a removed DOM node.

---

# Alert Dialog

Alert dialogs generally require an explicit response.

Review:

* initial focus
* action order
* Escape behavior
* focus restoration
* keyboard activation of all actions

For destructive actions, ensure keyboard users can clearly distinguish:

```text
Cancel
Delete
```

and are not forced into an accidental destructive action through focus order.

---

# Tabs

Tabs require a specific keyboard interaction model.

Typical interaction:

| Key        | Behavior     |
| ---------- | ------------ |
| ArrowLeft  | Previous tab |
| ArrowRight | Next tab     |
| Home       | First tab    |
| End        | Last tab     |

Depending on the implementation, activation may be:

### Automatic activation

Moving focus to a tab immediately activates it.

### Manual activation

Moving focus changes the focused tab but activation requires an additional action, typically Enter or Space.

The implementation must be consistent with the chosen model.

## Review

Check:

* only the intended tab is selected
* focus is visible
* selection state updates
* the correct panel becomes available
* focus does not unexpectedly jump into the panel

---

# Menu

Menus use managed keyboard navigation rather than normal Tab navigation between every item.

Typical behavior:

| Key       | Behavior                  |
| --------- | ------------------------- |
| ArrowDown | Next item                 |
| ArrowUp   | Previous item             |
| Home      | First item                |
| End       | Last item                 |
| Enter     | Activate                  |
| Space     | Activate where applicable |
| Escape    | Close                     |

Additional behavior may include:

* ArrowRight / ArrowLeft for nested menus
* typeahead
* wrapping navigation

Verify the actual menu pattern before applying these rules.

## Important

Do not use menu keyboard behavior for ordinary dropdowns or navigation lists.

---

# Menubar

A menubar typically supports:

| Key        | Behavior                                   |
| ---------- | ------------------------------------------ |
| ArrowRight | Next menu                                  |
| ArrowLeft  | Previous menu                              |
| ArrowDown  | Open menu / move into menu                 |
| ArrowUp    | Move within/open menu depending on pattern |
| Home       | First item                                 |
| End        | Last item                                  |
| Escape     | Close menu                                 |

Nested menu behavior must be implemented consistently.

---

# Listbox

Listboxes use managed keyboard navigation.

Typical behavior:

| Key       | Behavior        |
| --------- | --------------- |
| ArrowDown | Next option     |
| ArrowUp   | Previous option |
| Home      | First option    |
| End       | Last option     |

Depending on the pattern:

* Enter may confirm selection
* Space may select
* Escape may close an associated popup

Verify the selection model.

---

# Combobox

Combobox keyboard behavior depends heavily on its implementation.

Possible interactions include:

| Key       | Possible behavior                                   |
| --------- | --------------------------------------------------- |
| ArrowDown | Open popup / next option                            |
| ArrowUp   | Previous option                                     |
| Enter     | Select option                                       |
| Escape    | Close popup                                         |
| Home      | Beginning of text / first option depending on state |
| End       | End of text / last option depending on state        |

Do not prescribe keyboard behavior without first identifying:

* editable vs select-only
* autocomplete behavior
* popup type
* selection model

## Review

Check:

* typing works
* popup can be opened using keyboard
* options can be navigated
* active option is exposed
* selection can be made
* Escape behaves correctly
* focus remains predictable

---

# Tree

Trees use hierarchical keyboard navigation.

Typical interaction:

| Key        | Behavior                   |
| ---------- | -------------------------- |
| ArrowDown  | Next visible item          |
| ArrowUp    | Previous visible item      |
| ArrowRight | Expand / move into child   |
| ArrowLeft  | Collapse / move to parent  |
| Home       | First item                 |
| End        | Last item                  |
| Enter      | Activate where appropriate |
| Space      | Select where appropriate   |

The exact behavior depends on the tree's selection model.

---

# Treegrid

Treegrids combine:

* hierarchical navigation
* grid navigation
* potentially editing

Review carefully.

Possible interactions include:

* Arrow keys
* Home
* End
* PageUp
* PageDown
* Enter
* Escape

Do not apply generic grid behavior without understanding the component's editing and selection model.

---

# Grid

A grid represents an interactive two-dimensional structure.

Typical navigation:

| Key        | Behavior               |
| ---------- | ---------------------- |
| ArrowUp    | Previous row           |
| ArrowDown  | Next row               |
| ArrowLeft  | Previous cell          |
| ArrowRight | Next cell              |
| Home       | Beginning of row       |
| End        | End of row             |
| PageUp     | Previous page/viewport |
| PageDown   | Next page/viewport     |

The implementation may use either:

* roving `tabindex`
* `aria-activedescendant`

Review which model is being used.

---

# Roving `tabindex`

Roving tabindex allows a composite widget to have one element in the normal Tab order while arrow keys move focus among its descendants.

Typical implementation:

```html id="ihs4pk"
<button tabindex="0">One</button>
<button tabindex="-1">Two</button>
<button tabindex="-1">Three</button>
```

When the user moves with ArrowRight:

```text id="g4a0fc"
One   tabindex="-1"
Two   tabindex="0"   ← focus
Three tabindex="-1"
```

## Review

Verify:

* exactly one relevant item is normally tabbable
* arrow navigation works
* the active item receives focus
* Tab exits the composite predictably
* Shift+Tab can return to the composite
* state remains synchronized

---

# `aria-activedescendant`

`aria-activedescendant` allows focus to remain on a container while identifying the currently active descendant.

Example:

```html id="c89qpf"
<input
  role="combobox"
  aria-activedescendant="option-2"
/>
```

Review:

* referenced element exists
* referenced element is an appropriate descendant or valid controlled relationship
* active descendant changes correctly
* the visual active item matches the accessibility state
* keyboard navigation remains predictable

Do not use `aria-activedescendant` when ordinary DOM focus would be simpler and more reliable.

---

# Escape

Escape commonly closes transient UI such as:

* dialogs
* menus
* popovers
* combobox popups
* dropdowns

When reviewing Escape:

1. Determine whether the component is expected to dismiss with Escape.
2. Verify that Escape performs the expected action.
3. Verify where focus goes afterward.
4. Ensure Escape does not unexpectedly trigger another application action.

Do not add Escape handling to every component.

---

# Enter vs Space

Do not treat Enter and Space as interchangeable.

Typical behavior:

| Control           |             Enter |             Space |
| ----------------- | ----------------: | ----------------: |
| Button            |          Activate |          Activate |
| Link              |          Activate |        Usually no |
| Checkbox          |        Usually no |            Toggle |
| Switch            |        Usually no |            Toggle |
| Disclosure button |          Activate |          Activate |
| Radio             | Pattern-dependent |            Select |
| Menu item         |          Activate | Pattern-dependent |

Native HTML should determine behavior whenever possible.

---

# Typeahead

Some composite widgets support typeahead.

For example, a menu or listbox may allow:

```text
Press "A"
↓
focus moves to "Amsterdam"
```

When reviewing typeahead:

* verify it does not interfere with normal text input
* support repeated-character navigation where appropriate
* handle case differences
* handle rapid typing
* maintain predictable focus

Do not require typeahead for every list or menu.

---

# Dragging and Pointer Alternatives

If functionality depends on dragging, provide a keyboard-accessible alternative.

Examples:

* sortable lists
* sliders
* drag-and-drop editors
* kanban boards

Ask:

> Can the same meaningful result be achieved without dragging?

Do not simply make the draggable element focusable and consider the problem solved.

---

# Sliders

Native range controls should be preferred:

```html id="2j3evk"
<input type="range" min="0" max="100">
```

Typical keyboard behavior includes:

| Key                   | Behavior |
| --------------------- | -------- |
| ArrowRight / ArrowUp  | Increase |
| ArrowLeft / ArrowDown | Decrease |
| Home                  | Minimum  |
| End                   | Maximum  |

Depending on the implementation:

* PageUp
* PageDown

may also be supported.

Verify that:

* value changes
* accessible value changes
* visual value changes
* step size is correct

---

# Date Pickers

Date pickers are complex composite widgets.

Review:

* opening with keyboard
* navigation between dates
* month/year navigation
* selection
* Escape
* focus restoration
* current date indication
* selected date indication

Do not invent keyboard behavior.

If implementing a date picker, follow an established interaction pattern consistently.

---

# Focus Traps

A focus trap intentionally restricts keyboard focus to a region, usually a modal dialog.

A legitimate focus trap should:

1. Activate when the modal opens.
2. Keep focus within the modal while it is modal.
3. Allow all modal controls to be reached.
4. Allow the modal to close.
5. Restore focus appropriately.

A broken focus trap may:

* make focus disappear
* trap the user permanently
* skip controls
* prevent Escape from working
* trap focus inside hidden content

---

# Dynamic Content

When new content appears, do not automatically move focus.

Ask:

* Does the user need to know it appeared?
* Is focus movement necessary?
* Would a live-region announcement be more appropriate?
* Will moving focus interrupt the user's current task?

Examples where focus movement may be appropriate:

* opening a dialog
* navigating to a new application view
* entering a newly opened composite widget

Examples where it may be inappropriate:

* loading additional search results
* displaying a passive success message
* updating a background counter

---

# Loading States

When a component enters a loading state, verify keyboard behavior.

Consider:

* Can the user still focus disabled controls?
* Is the loading state communicated?
* Is focus preserved?
* Does completion cause an unexpected focus jump?

Do not automatically move focus when loading finishes.

---

# Disabled Controls

For native controls, prefer native disabled semantics.

Example:

```html id="9y3p9z"
<button disabled>
  Submit
</button>
```

Review:

* whether the control is actually unavailable
* whether it should remain discoverable
* whether the disabled state is communicated
* whether focus behavior is intentional

Be careful with custom `aria-disabled="true"`.

`aria-disabled` communicates state but does not automatically prevent interaction.

If using:

```html id="j3x4f8"
aria-disabled="true"
```

verify that the implementation actually prevents the relevant action.

---

# Keyboard Traps

A keyboard trap occurs when a user can move focus into a component but cannot move it out using the keyboard.

Test every complex component:

1. Tab into it.
2. Tab through it.
3. Shift+Tab backwards.
4. Try the expected exit mechanism.
5. Verify focus can leave.

Pay particular attention to:

* dialogs
* embedded widgets
* iframes
* rich text editors
* custom dropdowns
* menus
* grids
* date pickers
* third-party components

---

# Nested Interactive Elements

Interactive controls must not be nested incorrectly.

Bad:

```html id="v6d8s2"
<button>
  Save
  <a href="/help">Help</a>
</button>
```

This creates conflicting keyboard semantics.

Check for:

* button inside button
* link inside link
* interactive control inside another interactive control
* clickable container surrounding interactive descendants

Instead, restructure the interaction.

---

# Pointer Events Must Not Be the Only Interaction

Flag implementations that rely exclusively on:

```javascript id="z1b1go"
onMouseDown
onMouseUp
onMouseEnter
onClick
```

when the functionality is intended to be keyboard accessible.

Important:

A native button's `click` event can be triggered by keyboard activation, so the presence of `onClick` alone is **not** a keyboard accessibility problem.

Evaluate the element's semantics and actual behavior.

---

# CSS Interaction States

Check that keyboard state is reflected visually.

Examples:

```css id="n6b8s8"
:hover
:focus
:focus-visible
:active
```

Do not rely solely on:

```css id="j0o8fh"
:hover
```

for important interaction feedback.

Keyboard users do not have a hover state equivalent to pointer users.

---

# Testing Strategy

Keyboard accessibility should be tested at three levels.

## 1. Automated

Automated tooling can detect some structural issues.

Examples:

* missing accessible names
* some focusability problems
* invalid ARIA
* some hidden-focusable-content issues

Automated tests cannot fully determine whether keyboard interaction is usable.

---

## 2. Component tests

Test important keyboard behavior explicitly.

Example:

```javascript id="zv72od"
await user.tab();
expect(button).toHaveFocus();

await user.keyboard("{Enter}");
expect(onClick).toHaveBeenCalled();
```

For a disclosure:

```javascript id="7x4e3c"
await user.keyboard("{Space}");

expect(button).toHaveAttribute(
  "aria-expanded",
  "true"
);
```

For a dialog:

```javascript id="0x0cqs"
await user.keyboard("{Escape}");

expect(dialog).not.toBeInTheDocument();
expect(trigger).toHaveFocus();
```

---

## 3. Manual testing

For complex components:

1. Use only the keyboard.
2. Start outside the component.
3. Tab into it.
4. Operate every feature.
5. Navigate backwards.
6. Escape transient UI.
7. Verify focus remains visible.
8. Verify focus can leave.
9. Repeat at different viewport sizes.

Manual testing is especially important for:

* dialogs
* menus
* comboboxes
* listboxes
* tabs
* grids
* trees
* date pickers
* drag-and-drop interactions

---

# Design-System Review

For reusable components, keyboard behavior should be part of the component contract.

Document:

* focus behavior
* keyboard shortcuts
* activation keys
* navigation keys
* Escape behavior
* disabled behavior
* focus restoration

For example:

```text id="v0j8j5"
Component: Dropdown Menu

Tab
  → Focus trigger

Enter / Space
  → Open menu

ArrowDown
  → Move to first item

ArrowUp
  → Move to last item

ArrowDown / ArrowUp
  → Navigate items

Enter / Space
  → Activate item

Escape
  → Close menu and restore focus
```

The consuming application should not need to rediscover this behavior.

---

# Review Checklist

For every interactive component, answer:

### Discovery

* Can I reach it using the keyboard?
* Is its focus state visible?
* Is the focus order logical?

### Operation

* Can I perform every important action?
* Is the correct key used for the interaction?
* Are Enter and Space behavior appropriate?
* Are Arrow keys used where the pattern requires them?

### Navigation

* Can I move forwards?
* Can I move backwards?
* Can I exit the component?
* Does Escape behave appropriately?

### Focus

* Where does focus go when the component opens?
* Where does focus go during interaction?
* Where does focus go when it closes?
* Is focus ever lost?
* Is focus ever trapped incorrectly?

### State

* Does visual state match application state?
* Does accessibility state match application state?
* Are state changes communicated appropriately?

### Semantics

* Is a native HTML element available?
* Is the correct ARIA pattern being used?
* Does the keyboard behavior match that pattern?

### Testing

* Is keyboard behavior covered by component tests?
* Has the component been manually tested using only a keyboard?
* Would a regression test prevent this issue from returning?

---

# Final Principle

Keyboard accessibility is not:

```text
"Can I press Tab until I reach everything?"
```

It is:

```text
Can I discover it?
       ↓
Can I understand it?
       ↓
Can I operate it?
       ↓
Can I navigate within it?
       ↓
Can I escape it?
       ↓
Can I understand what changed?
       ↓
Can I continue my task?
```

A component passes a keyboard accessibility review when a keyboard-only user can complete the same meaningful task as a pointer user without unexpected barriers, traps, or loss of context.

Prefer native HTML.

Follow established interaction patterns.

Do not invent keyboard behavior when an established pattern exists.
