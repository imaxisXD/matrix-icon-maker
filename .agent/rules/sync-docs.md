---
description: how to keep project documentation in sync with codebase
---

# Matrix Icon Maker Documentation Sync

This workflow ensures project documentation stays in sync with the codebase. Run this after adding new features or making significant changes.

## When to Run

- After adding new components or features
- After modifying component props/APIs
- After changing project structure
- Before major releases

## Steps

1. **Read existing documentation**
   - Check `.agent/project-docs.md` for current state

2. **Identify changes**
   - Compare with actual codebase in `src/components/`
   - Check for new props in `Matrix.tsx`, `MatrixEditor.tsx`, etc.
   - Review `src/stores/editorStore.ts` for new state/actions
   - Check `src/data/presets.ts` for new pattern generators

3. **Update component documentation**
   - Ensure all props are documented with types and defaults
   - Update any changed behavior descriptions
   - Add new features to the Features section

4. **Update workflow documentation**
   - Add any new development or deployment workflows

5. **Verify README.md**
   - Ensure installation instructions are current
   - Update any changed commands

## Key Files to Monitor

- `src/components/ui/Matrix.tsx` - Core Matrix component
- `src/components/editor/*.tsx` - Editor components
- `src/stores/editorStore.ts` - Editor state management
- `src/data/presets.ts` - Pattern presets
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies
