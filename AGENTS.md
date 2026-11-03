<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# book-nook

Next.js 16.4.3 + React 19 app (App Router in `src/app`). Fresh scaffold — `page.tsx` and `layout.tsx` still contain create-next-app boilerplate and metadata.

## Commands

- `npm run dev` — Dev server on `http://localhost:3000` (Turbopack by default).
- `npm run build` — Production build; the real verification step.
- `npm run lint` — ESLint flat config (`eslint-config-next`). `npm run lint -- --fix <path>` to fix files.
- `npx tsc --noEmit` — Typecheck (there is no `typecheck` script).
- No test framework, no CI workflows are set up.

## Config quirks (all set in `next.config.ts`)

- `cacheComponents: true` — Dynamic data requires explicit `await` data access inside `<Suspense>` boundaries; uncached `fetch` won't show up without it. `params`/`searchParams` in pages/layouts are Promises and must be awaited. Consider `"use cache"` for static data.
- `reactCompiler: true` — Do not add `useMemo`, `useCallback`, or `React.memo` by hand; the compiler handles memoization. Props/children must still follow the rules of React.
- `partialPrefetching: true` — Links prefetch without config; don't add per-link prefetch props unless needed.
- Tailwind v4 is wired through the `turbopack.rules` CSS loader (no PostCSS config file).

## Styling & UI

- **Tailwind CSS v4, CSS-first**: there is NO `tailwind.config.js`. Design tokens and theme live in `src/app/globals.css` (`@theme inline`, CSS variables, `@custom-variant dark`). Change theme there.
- **shadcn/ui with the `base-nova` style**: components in `src/components/ui/*` are built on **`@base-ui/react` primitives — NOT Radix UI**. Check `components.json` and existing `src/components/ui` files before reaching for a Radix import. Add missing components with `npx shadcn@latest add <component>`.
- `cn` is imported from the **`cn` package** in these components (`components.json` aliases `@/lib/utils`, but the generated code uses `cn`). Follow whichever pattern the neighboring file uses.
- Path alias `@/*` → `src/*` (`tsconfig.json`).
- Fonts: Inter for body text and Playfair Display for headings, loaded via `next/font/google` in `layout.tsx` as CSS variables.
