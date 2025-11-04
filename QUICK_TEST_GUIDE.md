# Quick Testing Guide - Focus Fix & Dynamic Controls

## How to Test

### 1. Test Focus Preservation
Open the editor and perform these actions:

#### Test Header Clicks
1. Select a block in the workspace
2. Click on "Отменить" (Undo) button → Block should stay selected ✓
3. Click on "Повторить" (Redo) button → Block should stay selected ✓
4. Click on "Опубликовать" (Publish) button → Block should stay selected ✓
5. Click on zoom controls → Block should stay selected ✓
6. Click on avatar → Block should stay selected ✓

#### Test Secondary Header (HeaderEditorFields)
1. Select a block in the workspace
2. Click on viewport switcher (Desktop/Tablet/Mobile) → Block should stay selected ✓
3. Click on "Предпросмотр" (Preview) → Block should stay selected ✓
4. Click on "Настройки" (Settings) → Block should stay selected ✓
5. Click on any contextual control → Block should stay selected ✓

#### Test Left Sidebar
1. Select a block in the workspace
2. Click on sidebar toggle buttons (Блоки, Настройки, etc.) → Block should stay selected ✓
3. Open the sidebar panel
4. Click anywhere inside the panel → Block should stay selected ✓
5. Drag a new block preview → Block should stay selected ✓

#### Test Right Sidebar (Inspector)
1. Select a block in the workspace
2. Click on inspector toggle button → Block should stay selected ✓
3. Open the inspector panel
4. Click inside the panel → Block should stay selected ✓
5. Drag blocks to reorder → Block should stay selected ✓

#### Test Block Interactions
1. Select a block in the workspace
2. Click on FloatingToolbar buttons:
   - Arrow Up → Should move block up, keep selected ✓
   - Arrow Down → Should move block down, keep selected ✓
   - Copy → Should duplicate block ✓
   - Trash → Should delete block and deselect ✓

#### Test Deselection (Expected Behavior)
1. Select a block in the workspace
2. Click on empty canvas area → Block should deselect ✓
3. Click on the workspace background → Block should deselect ✓

---

### 2. Test Dynamic Controls

#### When No Block Selected
- Header should show: "Выберите элемент для редактирования" ✓
- No contextual controls visible ✓
- Viewport switcher still visible ✓

#### When Text Block Selected
- Header should show: "Выбрано: [block name]" ✓
- Should show: TextControls (font size, weight, alignment, color) ✓
- Controls should be visible on desktop/large screens ✓

#### When Image Block Selected  
- Header should show: "Выбрано: [block name]" ✓
- Should show: ImageControls (replace, crop, opacity, border radius) ✓

#### When Header/Hero Block Selected
- Header should show: "Выбрано: [block name]" ✓
- Should show: GenericControls (position, spacing, background, display) ✓

#### When Generic Block Selected
- Header should show: "Выбрано: Блок" (if no name) ✓
- Should show: GenericControls ✓

---

### 3. Test Existing Features (Regression Testing)

#### Drag and Drop
- [ ] Can drag blocks from sidebar to workspace
- [ ] Can reorder blocks in workspace
- [ ] Can reorder blocks in inspector
- [ ] Drag overlay shows correctly

#### Block Operations
- [ ] Can select blocks by clicking
- [ ] Can delete blocks
- [ ] Can duplicate blocks
- [ ] Can move blocks up/down
- [ ] Can see FloatingToolbar on selection

#### Viewport Switching
- [ ] Desktop view works
- [ ] Tablet view works
- [ ] Mobile view works
- [ ] Workspace scales correctly

#### UI Interactions
- [ ] Sidebars open/close smoothly
- [ ] Inspector opens/closes smoothly
- [ ] Animations work correctly
- [ ] Tooltips show on hover

---

## Common Issues & Solutions

### Issue: Block still deselects when clicking header
**Check**: 
- Does the element have `data-header-toolbar="true"`?
- Does the element have a click handler with `e.stopPropagation()`?
- Is there a parent element capturing events?

### Issue: Can't click on controls
**Check**:
- Are z-index values correct?
- Is the element positioned correctly?
- Is pointer-events set correctly?

### Issue: Controls don't show
**Check**:
- Is a block actually selected? (`selectedBlock` not null)
- Is the block type set correctly?
- Are you on a large enough screen? (controls hidden on < lg)

### Issue: Wrong controls showing
**Check**:
- What is the block's `type` property?
- Does the block have a `componentName`?
- Is `getBlockType()` working correctly?

---

## Expected Console Output

No errors should appear in the console.

If you see errors, check:
- TypeScript compilation errors
- React hydration warnings
- Event handler errors
- Store state errors

---

## Visual Indicators

### Block Selected
- Block has accent border color
- FloatingToolbar visible on the left
- Header shows block name and controls
- Inspector highlights the block (if open)

### Block Not Selected
- No accent border
- No FloatingToolbar
- Header shows placeholder text
- No contextual controls

---

## Performance Checks

- [ ] No lag when clicking rapidly
- [ ] No memory leaks from event handlers
- [ ] Smooth animations
- [ ] Fast state updates
- [ ] No unnecessary re-renders

---

## Browser Testing

Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

---

## Mobile Testing (if applicable)

- [ ] MobileEditorNavigation doesn't interfere
- [ ] Touch events work correctly
- [ ] Gestures don't cause deselection
- [ ] Mobile UI is responsive

---

## Accessibility Testing

- [ ] Can navigate with keyboard
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Screen reader friendly
- [ ] ARIA labels present

---

## Ready for Production?

- [ ] All tests pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Performance acceptable

---

## Notes

Remember to test in both:
- Light mode
- Dark mode

And with:
- Different viewport sizes
- Different block types
- Multiple blocks in workspace
- Empty workspace
