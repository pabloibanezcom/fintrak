---
name: sync-types
description: Rebuild the shared types package and verify imports across api, web, and mobile apps
---

# Sync Types Package

Use this after modifying any files in `packages/types/`.

## Steps

1. **Rebuild the types package:**
   ```bash
   pnpm --filter @fintrak/types build
   ```

2. **Verify the build succeeded** by checking for `packages/types/dist/`

3. **Check for import errors** in dependent packages:
   ```bash
   pnpm --filter api exec tsc --noEmit
   pnpm --filter web exec tsc --noEmit
   ```

## Common Issues

### "Cannot find module '@fintrak/types'"
- Ensure types package is built: `pnpm --filter @fintrak/types build`
- Check `packages/types/package.json` has correct exports

### "Type 'X' is not exported"
- Add export to `packages/types/src/index.ts`
- Rebuild: `pnpm --filter @fintrak/types build`

### Changes not reflecting
- Delete `packages/types/dist/` and rebuild
- Restart TypeScript server in IDE

## Type Locations

| Type | File |
|------|------|
| Products | `packages/types/src/Product.ts` |
| User | `packages/types/src/User.ts` |
| Transactions | `packages/types/src/Transaction.ts` |
| Bank accounts | `packages/types/src/BankAccount.ts` |
| Investments | `packages/types/src/Investment.ts` |

## Adding New Types

1. Create/edit file in `packages/types/src/`
2. Export from `packages/types/src/index.ts`
3. Run this skill to rebuild and verify
