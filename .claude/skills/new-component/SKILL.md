---
name: new-component
description: Create a new web component with proper folder structure, TypeScript, CSS modules, and barrel export
---

# Create New Web Component

When the user asks to create a new component, follow this structure exactly:

## File Structure

Create in `apps/web/src/components/ui/` (or `components/dashboard/` for dashboard-specific):

```
ComponentName/
├── ComponentName.tsx        # Component with typed props
├── ComponentName.module.css # Scoped styles
└── index.ts                 # Barrel export
```

## Templates

### ComponentName.tsx

```tsx
'use client';

import styles from './ComponentName.module.css';

export interface ComponentNameProps {
  // Add props here
}

export function ComponentName({ }: ComponentNameProps) {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
}
```

### ComponentName.module.css

```css
.container {
  /* Base styles */
}
```

### index.ts

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Conventions

- Use `'use client'` directive for interactive components
- Import utilities from `@/utils` (e.g., `formatCurrency`)
- Import types from `@fintrak/types`
- Use CSS variables from the design system (check existing components)
- Follow existing patterns in similar components (StatCard, InvestmentCard, BankAccountCard)

## After Creation

1. Add export to parent index.ts if exists (e.g., `components/ui/index.ts`)
2. Run `pnpm lint-fix` to ensure code quality
