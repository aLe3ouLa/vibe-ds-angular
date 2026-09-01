# WAI-ARIA Patterns Reference

Use this reference when reviewing custom interactive components for accessibility.

The purpose of this document is to evaluate **semantics, keyboard interaction, focus management, state, and relationships together**.

ARIA attributes are not sufficient on their own. A component is accessible only when its implementation provides the behavior implied by its semantics.

---

## Core Principles

### 1. Prefer native HTML

Use native HTML whenever it provides the required semantics and behavior.

Prefer:

```html
<button>Save</button>
```

over:

```html
<div role="button">Save</div>
```

Prefer:

```html
<a href="/settings">Settings</a>
```

over:

```html
<div role="link">Settings</div>
```

Prefer:

```html
<input type="checkbox">
```

over:

```html
<div role="checkbox">
```

Native elements provide keyboard behavior, semantics, focus behavior, and browser integration automatically.

### 2. ARIA does not create behavior

Adding:

```html
<button aria-expanded="true">
```

does not implement an expandable component.

The implementation must actually:

* expose the correct state
* change the associated content
* provide the expected keyboard interaction
* maintain focus correctly

### 3. Do not use ARIA unnecessarily

Additional ARIA can make an otherwise accessible component less accessible.

For example, do not add:

```html
<button role="button">
```

The native button already has that role.

### 4. Evaluate the complete interaction

For every custom widget, evaluate:

1. Role
2. Accessible name
3. State
4. Properties
5. Relationships
6. Keyboard interaction
7. Focus behavior
8. Screen-reader behavior
9. Dynamic state changes

---

# Button

## Preferred implementation

Use a native button:

```html
<button type="button">
  Save
</button>
```

## Accessible name

The button must have an accessible name.

Valid sources include:

* visible text
* `aria-labelledby`
* `aria-label` when appropriate
* accessible content provided by the native element

For icon-only buttons, provide an accessible name:

```html
<button type="button" aria-label="Close">
  <svg aria-hidden="true">...</svg>
</button>
```

Do not use `aria-label` to replace meaningful visible text unnecessarily.

## Keyboard

A native button supports:

* Enter
* Space

Do not manually recreate this behavior unless there is a compelling reason.

## Disabled state

Prefer:

```html
<button disabled>
```

for a genuinely disabled native button.

For custom widgets, verify that the disabled state:

* is exposed correctly
* prevents the expected interaction
* does not create confusing focus behavior

## Review questions

* Is this actually an action?
* Why isn't this a native `<button>`?
* Does it have an accessible name?
* Does its disabled state match its visual state?
* Is keyboard activation supported?

---

# Link

## Preferred implementation

Use:

```html
<a href="/profile">Profile</a>
```

A link represents navigation to another resource or location.

Do not use a button when the primary purpose is navigation.

Do not use a link when the primary purpose is an action.

## Keyboard

Native links support:

* Enter

## Review questions

* Does the element navigate?
* Does it have a valid `href`?
* Does its accessible name describe the destination?
* Is it incorrectly implemented as a clickable `<div>` or `<span>`?

---

# Checkbox

## Preferred implementation

Use:

```html
<label>
  <input type="checkbox">
  Receive notifications
</label>
```

A checkbox represents an independent boolean choice.

## State

The checked state must accurately represent the actual UI state.

For native checkboxes, prefer:

```html
<input type="checkbox" checked>
```

For custom checkboxes, the appropriate state must be exposed.

## Keyboard

Typical interaction:

* Space: toggle

Do not require Enter unless the interaction pattern specifically calls for it.

## Review questions

* Is the control actually a checkbox?
* Is its label programmatically associated?
* Is its checked state exposed?
* Is the visual state synchronized with the accessibility state?

---

# Radio Group

A radio group represents a choice where only one option can normally be selected.

## Native implementation

Prefer:

```html
<fieldset>
  <legend>Payment method</legend>

  <label>
    <input type="radio" name="payment" value="card">
    Card
  </label>

  <label>
    <input type="radio" name="payment" value="cash">
    Cash
  </label>
</fieldset>
```

## Custom implementation

A custom radio group must expose:

* group semantics
* radio semantics
* selected state
* appropriate keyboard interaction
* meaningful group name

## Keyboard

Typical interaction:

* Arrow keys: move between options
* Space: select the focused option

The exact implementation should be consistent with the chosen radio pattern.

## Review questions

* Is the group correctly labelled?
* Can the user understand which option is selected?
* Is keyboard navigation predictable?
* Is only one option selected?

---

# Switch

A switch represents an on/off setting.

Example:

```html
<button
  type="button"
  role="switch"
  aria-checked="false"
>
  Email notifications
</button>
```

## State

The `aria-checked` value must always reflect the actual state.

```html
aria-checked="true"
```

must correspond to the setting actually being enabled.

## Keyboard

Space should toggle the switch.

## Review questions

* Is this genuinely an on/off setting?
* Is `aria-checked` synchronized with the application state?
* Does keyboard interaction work?
* Is the accessible name meaningful?

Do not use `role="switch"` merely because a control looks like a toggle.

---

# Disclosure

A disclosure shows or hides associated content.

Example:

```html
<button
  type="button"
  aria-expanded="false"
  aria-controls="details"
>
  Show details
</button>

<div id="details" hidden>
  ...
</div>
```

## Required state

`aria-expanded` must represent the actual visibility state.

```text
aria-expanded="false"
```

means the controlled content is collapsed.

```text
aria-expanded="true"
```

means the controlled content is expanded.

## Relationship

When appropriate, `aria-controls` identifies the controlled element.

## Keyboard

The trigger should normally be a native button, providing:

* Enter
* Space

## Review questions

* Is the trigger a button?
* Does `aria-expanded` reflect reality?
* Is the controlled content correctly associated?
* Can the content be reached when expanded?

---

# Accordion

An accordion is a collection of disclosure controls used to show and hide sections.

## Structure

Typical structure:

```html
<h3>
  <button
    aria-expanded="false"
    aria-controls="panel-1"
  >
    Shipping information
  </button>
</h3>

<div id="panel-1" hidden>
  ...
</div>
```

## Review

Check:

* heading structure
* button semantics
* `aria-expanded`
* relationship between trigger and panel
* keyboard interaction
* focus behavior

## Important distinction

Do not automatically treat every expandable section as an accordion.

If there is only one expandable section, a disclosure pattern may be more appropriate.

---

# Dialog

A dialog is a window that interrupts or supplements the current page interaction.

Example:

```html
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-modal="true"
>
  <h2 id="dialog-title">
    Delete account
  </h2>

  ...
</div>
```

## Accessible name

The dialog must have an accessible name.

Possible mechanisms include:

```html
aria-labelledby="dialog-title"
```

or, when appropriate:

```html
aria-label="Delete account"
```

Prefer a visible heading referenced with `aria-labelledby` when one exists.

## Initial focus

When a dialog opens, determine where focus should move.

The correct target depends on the dialog's purpose.

Common choices include:

* first interactive element
* heading or static content for informational dialogs
* destructive-action confirmation control

Do not automatically focus the first button without considering the user's task.

## Keyboard

Typical behavior:

* Tab: move between dialog controls
* Shift+Tab: move backwards
* Escape: close when appropriate

## Focus containment

For a modal dialog, keyboard focus should not accidentally escape into the underlying page.

Use an established dialog implementation rather than attempting to recreate focus management casually.

## Focus restoration

When the dialog closes, focus should normally return to the element that opened it, unless doing so would no longer make sense because the context changed.

## Review questions

* Does the dialog have an accessible name?
* Where does focus go when it opens?
* Can the user operate everything inside it?
* Can it be closed using the expected keyboard interaction?
* Is focus trapped appropriately?
* Where does focus go after closing?
* Is `aria-modal` consistent with the actual modal behavior?

---

# Alert Dialog

An alert dialog is used when the user needs to respond to important information before continuing.

Example scenarios:

* destructive confirmation
* critical warning
* confirmation of an irreversible action

Use:

```html
role="alertdialog"
```

only when the interaction actually represents an alert dialog.

## Review

Check:

* accessible name
* accessible description where needed
* initial focus
* keyboard interaction
* focus restoration
* clear action labels

Do not use an alert dialog simply because something is visually styled as a modal.

---

# Alert

An alert communicates important information without requiring the user to initiate the interaction.

Example:

```html
<div role="alert">
  Your payment failed.
</div>
```

Use alerts carefully.

## Review

Check:

* whether the message genuinely requires an announcement
* whether the message is dynamically inserted
* whether the announcement is useful rather than noisy
* whether the message is duplicated

Do not add `role="alert"` to static content simply because it is visually important.

---

# Status

A status communicates information about the current state of an application without requiring immediate user action.

Examples:

* "Saved"
* "3 results found"
* "Uploading"

Consider whether `role="status"` is appropriate.

Avoid repeatedly announcing information that does not help the user.

---

# Tabs

Tabs organize content into multiple panels where one tab is active.

Typical structure:

```html
<div role="tablist" aria-label="Account settings">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="profile-panel"
    id="profile-tab"
  >
    Profile
  </button>

  <button
    role="tab"
    aria-selected="false"
    aria-controls="security-panel"
    id="security-tab"
  >
    Security
  </button>
</div>

<div
  role="tabpanel"
  id="profile-panel"
  aria-labelledby="profile-tab"
>
  ...
</div>
```

## Required concepts

Check:

* `tablist`
* `tab`
* `tabpanel`
* selected state
* relationship between tab and panel

## Keyboard

Typical keyboard interaction includes:

* ArrowLeft
* ArrowRight
* Home
* End

Determine whether the implementation uses:

* automatic activation
* manual activation

Do not assume one without examining the behavior.

## Review questions

* Is this genuinely a tab interface?
* Is the selected state correct?
* Does focus move predictably?
* Does activating a tab expose the correct panel?
* Are tab/panel relationships correct?
* Is the activation model consistent?

---

# Menu

A menu represents a specific set of commands or actions.

It is not synonymous with a generic dropdown.

## Typical structure

```html
<div role="menu">
  <button role="menuitem">
    Edit
  </button>

  <button role="menuitem">
    Delete
  </button>
</div>
```

## Keyboard

Typical interaction:

* ArrowDown
* ArrowUp
* Home
* End
* Enter
* Space where appropriate
* Escape

## Focus

Menus often use managed focus rather than normal Tab navigation between every item.

Review the actual focus model.

## Important distinction

Do not use `role="menu"` for:

* navigation links
* a list of filters
* a collection of unrelated buttons
* generic dropdown content

Use the semantic pattern that actually describes the interaction.

---

# Menubar

A menubar is a persistent horizontal collection of menus.

Review:

* `menubar`
* `menu`
* `menuitem`
* nested menu relationships
* Arrow key behavior
* Escape behavior
* focus management

Do not implement a menubar simply because a navigation bar visually resembles one.

---

# Listbox

A listbox presents a collection of selectable options.

Typical structure:

```html
<div
  role="listbox"
  aria-label="Choose a color"
>
  <div
    role="option"
    aria-selected="true"
  >
    Red
  </div>

  <div
    role="option"
    aria-selected="false"
  >
    Blue
  </div>
</div>
```

## Keyboard

Depending on the pattern:

* ArrowUp
* ArrowDown
* Home
* End
* Enter
* Space
* Escape

Review the exact selection model.

## Review questions

* Is the widget really a listbox?
* Is selection state exposed?
* Is focus managed correctly?
* Can the user understand which option is active?
* Does the visual selection match the accessibility state?

---

# Combobox

A combobox combines an input or button with a popup containing selectable options.

It is one of the most error-prone ARIA patterns.

## Review carefully

Check:

```text
aria-expanded
aria-controls
aria-haspopup
aria-autocomplete
aria-activedescendant
```

Only require attributes that correspond to actual behavior.

## Keyboard

Depending on implementation:

* ArrowDown
* ArrowUp
* Enter
* Escape
* typing
* selection
* focus movement

## Important distinction

A searchable select, autocomplete, editable combobox, and select-only combobox can have different interaction models.

Do not apply one generic keyboard contract to every component called "combobox."

## Review questions

* What is the input's accessible name?
* Is the popup correctly associated?
* Is expanded state accurate?
* Can the active option be determined?
* Does the screen reader receive selection changes?
* Does Escape behave appropriately?
* Is focus retained or moved intentionally?

---

# Tree

A tree represents hierarchical items that can be expanded, collapsed, and/or selected.

Examples:

* file explorers
* hierarchical navigation
* nested categories

Check:

* `tree`
* `treeitem`
* `group`
* expanded state
* selection state
* hierarchy
* keyboard navigation

Typical keyboard interactions include:

* ArrowUp
* ArrowDown
* ArrowRight
* ArrowLeft
* Home
* End
* Enter
* Space where appropriate

Do not implement a tree pattern for ordinary nested navigation unless the interaction genuinely requires tree semantics.

---

# Treegrid

A treegrid combines hierarchical navigation with grid/table interaction.

This is a complex widget.

Before recommending a treegrid:

1. Determine whether a semantic table can solve the problem.
2. Determine whether a tree is sufficient.
3. Determine whether the additional interaction is actually necessary.

Do not introduce treegrid semantics merely to make a complex table appear more sophisticated.

---

# Grid

A grid is an interactive two-dimensional collection of cells.

It may be appropriate for:

* spreadsheet-like interfaces
* complex interactive data grids
* keyboard-intensive applications

It is not automatically appropriate for every HTML table.

## Review

Check:

* grid structure
* row semantics
* cell semantics
* focus model
* keyboard navigation
* editing behavior
* selection behavior

Typical keyboard interactions may include:

* Arrow keys
* Home
* End
* PageUp
* PageDown
* Enter
* Escape

The exact behavior depends on the implementation.

---

# Tooltip

A tooltip provides supplementary information associated with an element.

Do not use a tooltip as the only way to provide essential information.

## Review

Check:

* accessible relationship
* keyboard access
* hover behavior
* dismissal
* focus behavior
* whether the content is actually a tooltip

If information is essential to completing a task, consider whether it should be visible or exposed as a description instead.

Do not add `role="tooltip"` merely because an element appears when hovering.

---

# Feed

A feed represents a dynamically loaded stream of content.

Review:

* article structure
* loading behavior
* focus behavior
* dynamic content announcements
* user control

Be careful with infinite scrolling.

Do not cause focus to jump unexpectedly when new content loads.

---

# Search

Search functionality is generally better represented using native HTML semantics than by inventing an ARIA widget.

Consider:

```html
<form role="search">
  <label for="search">Search</label>
  <input id="search" type="search">
  <button type="submit">Search</button>
</form>
```

Check:

* accessible name
* form semantics
* input label
* submit behavior
* result updates

---

# Navigation

Use native navigation semantics:

```html
<nav aria-label="Primary">
  ...
</nav>
```

Do not use `role="menu"` for ordinary site navigation.

Check:

* meaningful landmark name
* link semantics
* current-page indication
* keyboard accessibility

---

# Landmark Roles

Prefer native landmark elements:

```html
<header>
<nav>
<main>
<aside>
<footer>
```

Use ARIA landmark roles when necessary.

Common landmarks:

* banner
* navigation
* main
* complementary
* contentinfo
* search

## Review

Avoid creating excessive landmarks.

Multiple landmarks of the same type should generally have distinguishable accessible names when users need to differentiate them.

---

# Accessible Names

Every interactive widget needs an accessible name.

Check the accessible-name computation rather than relying only on visible appearance.

Potential sources:

1. Native semantics
2. Associated visible text
3. `<label>`
4. `aria-labelledby`
5. `aria-label`

Prefer visible text and programmatic relationships over unnecessary `aria-label`.

## Common failures

Flag:

```html
<button>
  <svg>...</svg>
</button>
```

when the SVG does not provide an appropriate accessible name.

Also flag:

```html
<input placeholder="Email">
```

when the placeholder is being used as the only meaningful label.

---

# Relationships

When components have relationships, those relationships must be represented programmatically.

Examples:

### Label

```html
<label for="email">Email</label>
<input id="email">
```

### Description

```html
<input
  aria-describedby="email-help"
>

<p id="email-help">
  Use your work email.
</p>
```

### Error

```html
<input
  aria-invalid="true"
  aria-describedby="email-error"
>

<p id="email-error">
  Enter a valid email address.
</p>
```

### Dialog title

```html
<div
  role="dialog"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Settings</h2>
</div>
```

Review whether referenced IDs actually exist and whether the relationship matches the user's mental model.

---

# State Synchronization

ARIA state must never become stale.

Common state attributes include:

```text
aria-expanded
aria-selected
aria-checked
aria-pressed
aria-current
aria-disabled
aria-invalid
aria-busy
aria-hidden
```

When reviewing stateful components:

1. Identify the application's source of truth.
2. Identify the visual state.
3. Identify the ARIA state.
4. Verify that all three remain synchronized.

Example failure:

```html
<button
  aria-expanded="false"
>
  Filters
</button>
```

while the filters panel is actually visible.

This is an accessibility defect even though the ARIA syntax itself is valid.

---

# `aria-hidden`

`aria-hidden="true"` removes content from the accessibility tree.

Use it carefully.

Appropriate examples may include:

```html
<svg aria-hidden="true">
```

for a decorative icon whose meaning is already provided by surrounding text.

Do not use `aria-hidden="true"` on:

* focusable elements
* interactive controls
* content users need to understand
* ancestors containing required interactive content

Be particularly suspicious of:

```html
aria-hidden="true"
```

combined with:

```html
tabindex="0"
```

or interactive descendants.

---

# `tabindex`

Prefer natural tab order.

Good:

```html
<button>Save</button>
```

Avoid unnecessary:

```html
tabindex="0"
```

on elements that should be native controls.

Avoid positive tabindex values:

```html
tabindex="1"
tabindex="2"
```

Positive tabindex values create a custom focus order that is difficult to maintain and can conflict with the DOM order.

Prefer:

* native interactive elements
* DOM order
* `tabindex="0"` only when a genuinely custom focusable element requires it
* `tabindex="-1"` for programmatic focus targets that should not normally be in sequential tab order

---

# Focus Management

ARIA does not solve focus management.

When reviewing interactive widgets, ask:

* Where is focus before interaction?
* Where does it move?
* Can the user understand where they are?
* Can they leave the component?
* Does focus remain on a meaningful element?
* Is focus restored when appropriate?

Focus management is especially important for:

* dialogs
* menus
* comboboxes
* listboxes
* tabs
* dynamically inserted content
* route changes

---

# Custom Components

When reviewing a custom component:

## Step 1 — Identify intent

Determine what the component actually does.

Do not trust its name.

A component named:

```text
Dropdown
```

could be:

* navigation
* menu
* listbox
* combobox
* disclosure
* select
* popover

## Step 2 — Find the closest native element

Ask:

> Could this be implemented with native HTML?

If yes, recommend native HTML unless there is a concrete reason not to.

## Step 3 — Identify the ARIA pattern

If native HTML is insufficient, identify the appropriate ARIA pattern.

## Step 4 — Verify the complete contract

Check:

```text
Role
  ↓
Name
  ↓
State
  ↓
Relationships
  ↓
Keyboard
  ↓
Focus
  ↓
Screen reader behavior
```

## Step 5 — Check implementation consistency

Verify that the implementation actually behaves according to the pattern.

Never assume that the presence of ARIA attributes means the pattern is correctly implemented.

---

# Design-System Component Review

When reviewing a reusable design-system component, additionally determine:

### Accessibility defaults

Does the component provide accessible behavior by default?

### Consumer responsibilities

What must consumers provide?

Examples:

* accessible label
* visible text
* error message
* heading
* `aria-describedby`

### Unsafe APIs

Can consumers accidentally create inaccessible states?

For example:

```tsx
<Button iconOnly />
```

may require an accessible label.

Consider whether the API should enforce this:

```tsx
<Button
  iconOnly
  aria-label="Close"
/>
```

### State guarantees

Determine which accessibility states are owned by the component.

For example:

```text
expanded
selected
checked
disabled
invalid
```

The component should ideally derive these from the same source of truth as its visual state.

### Testing

Reusable components should have accessibility tests for their interaction contract.

Examples:

* keyboard navigation
* focus behavior
* accessible name
* state changes
* screen-reader-relevant semantics
* disabled behavior

Fix accessibility problems at the design-system level when possible.

A component-level fix can prevent the same defect from appearing across many consuming applications.

---

# Review Heuristics

When reviewing an implementation, ask:

1. Is there a native HTML element that solves this?
2. What is the user's actual interaction?
3. What semantic pattern best represents that interaction?
4. Does the accessible name make sense?
5. Are states synchronized with the UI?
6. Are relationships represented programmatically?
7. Can the entire interaction be completed with a keyboard?
8. Is focus managed intentionally?
9. Can a screen reader understand the component's state and purpose?
10. Can consumers accidentally misuse the component?
11. Is the issue a WCAG violation, a best-practice issue, or a usability improvement?
12. Can the problem be fixed once in the design system instead of repeatedly in consuming applications?

---

# Common Anti-Patterns

Flag these when encountered:

## Clickable div

```html
<div onclick="save()">Save</div>
```

Recommend a native button.

## Clickable span

```html
<span onclick="open()">Open</span>
```

Recommend a native button or link depending on the purpose.

## Fake button

```html
<div
  role="button"
  tabindex="0"
>
  Save
</div>
```

Only consider this acceptable when there is a strong reason not to use a native button and the complete keyboard interaction has been implemented.

## ARIA duplication

```html
<button role="button">
```

Remove unnecessary role duplication.

## Incorrect menu

```html
<div role="menu">
  <a href="/settings">Settings</a>
</div>
```

Do not automatically use menu semantics for navigation.

## Stale state

```html
<button aria-expanded="false">
```

while the associated content is visible.

## Hidden focusable content

```html
<div aria-hidden="true">
  <button>Action</button>
</div>
```

Do not hide interactive content from assistive technology while leaving it keyboard focusable.

## Positive tabindex

```html
tabindex="1"
```

Avoid unless there is an extremely unusual and well-understood reason.

## Placeholder as label

```html
<input placeholder="Email">
```

Do not use the placeholder as the sole accessible label.

## ARIA without behavior

```html
<div
  role="combobox"
  aria-expanded="true"
>
```

when the implementation does not actually behave as a combobox.

---

# Final Review Rule

The presence of correct ARIA attributes is **not evidence that a component is accessible**.

The review should establish that:

```text
Semantic intent
      +
Accessible name
      +
State
      +
Relationships
      +
Keyboard behavior
      +
Focus management
      +
Actual implementation
      =
Accessible interaction
```

If these elements disagree, report the actual user impact and identify the smallest correct fix.

Prefer native HTML.

Use ARIA to communicate semantics that cannot reasonably be expressed with native HTML.

Never use ARIA as decoration.
