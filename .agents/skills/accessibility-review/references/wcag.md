# WCAG 2.2 Reference

Use this reference when determining whether an accessibility finding corresponds to a WCAG 2.2 Success Criterion.

## 1. Perceivable

### 1.1.1 Non-text Content — Level A

Relevant when:

- Images convey information without an appropriate text alternative.
- Informative icons have no accessible name.
- Decorative images are exposed unnecessarily to assistive technology.

Check:

- `alt`
- accessible names
- decorative image handling
- SVG accessibility

Do not require alt text for purely decorative content.

---

### 1.3.1 Info and Relationships — Level A

Relevant when visual relationships are not represented programmatically.

Check:

- headings
- lists
- labels
- form relationships
- table headers
- fieldsets
- landmarks

Prefer semantic HTML over ARIA.

---

### 1.3.2 Meaningful Sequence — Level A

Check whether DOM order represents the intended reading or interaction order.

Be suspicious of:

- CSS reordering
- visually positioned content
- complex grid layouts

---

### 1.4.3 Contrast (Minimum) — Level AA

Normal text:

- 4.5:1 minimum

Large text:

- 3:1 minimum

Do not evaluate contrast from screenshots alone when actual CSS values are available.

---

### 1.4.11 Non-text Contrast — Level AA

Check important visual UI elements and graphical objects.

Examples:

- form boundaries
- buttons
- focus indicators
- selected states
- controls

---

### 1.4.13 Content on Hover or Focus — Level AA

Relevant to:

- tooltips
- popovers
- hover menus
- contextual information

Check whether content:

- can be dismissed
- remains available when needed
- can be interacted with without disappearing unexpectedly

---

## 2. Operable

### 2.1.1 Keyboard — Level A

All functionality must be operable using a keyboard.

Check:

- buttons
- links
- menus
- dialogs
- dropdowns
- custom controls
- drag interactions

---

### 2.1.2 No Keyboard Trap — Level A

Users must be able to move focus away from components.

Especially important for:

- modals
- embedded widgets
- custom editors
- keyboard navigation components

---

### 2.4.3 Focus Order — Level A

Focus order should preserve meaningful interaction.

Check:

- DOM order
- CSS reordering
- dynamically inserted elements
- modal opening
- menus

---

### 2.4.7 Focus Visible — Level AA

Keyboard focus must be visually apparent.

Do not accept:

```css
outline: none;