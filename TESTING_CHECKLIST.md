# Testing Checklist for Dynamic Header Controls

## Visual Tests

### Block Selection Tests
- [ ] Click on a text block → Header shows "TextBlock" name and text controls
- [ ] Click on an image block → Header shows "ImageBlock" name and image controls  
- [ ] Click on a header block → Header shows "HeaderBlock" name and generic controls
- [ ] Click on any other block → Header shows block name and generic controls
- [ ] Click outside blocks → Header shows "Select a block to edit" message

### Control Visibility Tests
- [ ] Text controls show: font size, weight, bold, italic, underline, alignment, color
- [ ] Image controls show: replace, crop, border radius, opacity
- [ ] Generic controls show: position, spacing, background, display mode
- [ ] Controls are hidden on smaller screens (< lg breakpoint)
- [ ] Controls don't overlap with viewport switcher (centered)
- [ ] Controls don't interfere with preview/settings buttons (right side)

### Existing Feature Tests
- [ ] Desktop viewport button works correctly
- [ ] Tablet viewport button works correctly
- [ ] Mobile viewport button works correctly
- [ ] Preview button is still accessible and functional
- [ ] Settings button is still accessible and functional
- [ ] Block deletion still deselects the block
- [ ] Block duplication works without issues

### Interactive Control Tests
- [ ] Font size dropdown opens and shows options
- [ ] Font weight dropdown opens and shows options
- [ ] Text color popover opens with color picker
- [ ] Border radius popover opens with slider and input
- [ ] Opacity popover opens with slider and input
- [ ] Spacing popover opens with padding/margin inputs
- [ ] Background color popover opens with color picker
- [ ] Display mode dropdown opens and shows options

### Edge Cases
- [ ] No blocks in workspace → Shows placeholder message
- [ ] Multiple rapid block selections → Controls update smoothly
- [ ] Deleting selected block → Header resets to default state
- [ ] Component name undefined → Falls back gracefully
- [ ] Block type undefined → Defaults to generic controls

## Integration Tests

### State Management
- [ ] useEditorStore correctly tracks selectedBlock
- [ ] Block type is correctly detected and set
- [ ] Component name is properly passed through
- [ ] Store updates trigger header re-render

### Type Detection
- [ ] "TextBlock" → detected as 'text' type
- [ ] "ImageBlock" → detected as 'image' type  
- [ ] "HeaderBlock" → detected as 'header' type
- [ ] "HeroSection" → detected as 'header' type
- [ ] Unknown names → default to 'generic' type

## Performance Tests
- [ ] Header doesn't re-render unnecessarily
- [ ] Block selection is responsive (< 100ms)
- [ ] Controls switch instantly when changing blocks
- [ ] No memory leaks from repeated selections

## Browser Compatibility
- [ ] Chrome/Edge - All controls visible and functional
- [ ] Firefox - All controls visible and functional
- [ ] Safari - All controls visible and functional

## Responsive Design
- [ ] Desktop (≥1024px) - All controls visible
- [ ] Tablet (768-1023px) - Controls hidden or adjusted
- [ ] Mobile (< 768px) - Controls properly adapted

## Accessibility
- [ ] All buttons have proper title attributes
- [ ] Color pickers are keyboard accessible
- [ ] Dropdowns can be navigated with keyboard
- [ ] Focus indicators are visible
- [ ] Screen readers can read control labels

---

## Test Results Template

**Date**: ___________  
**Tester**: ___________  
**Browser**: ___________  
**Viewport**: ___________  

### Issues Found:
1. 
2. 
3. 

### Notes:


### Overall Status: ☐ Pass  ☐ Fail  ☐ Needs Review
