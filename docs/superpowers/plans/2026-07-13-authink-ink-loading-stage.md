# AuthInk InkLoading Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unreadable 20px inline submit spinner in Login and OTP with a shared, centered 64px AuthInk loading stage whose motion remains observable and accessible.

**Architecture:** Keep Keycloak form submission untouched and isolate visual state in one presentation-only `AuthInkSubmitLoading` component. Reuse the existing canvas renderer, change only the draw timing/easing contract, and add component, page, Storybook, packaging, and browser-verification gates.

**Tech Stack:** React 18, TypeScript, CSS, Vitest, Testing Library, Storybook 8, Keycloakify 11.15.11.

---

## File structure

- Create `src/login/components/AuthInkSubmitLoading/AuthInkSubmitLoading.tsx`: shared status stage.
- Create `src/login/components/AuthInkSubmitLoading/AuthInkSubmitLoading.test.tsx`: accessibility and geometry-class contract.
- Create `src/login/components/AuthInkSubmitLoading/index.ts`: component export.
- Modify `src/login/components/InkLoading/inkLoadingCore.ts`: balanced draw easing and target timing.
- Modify `src/login/components/InkLoading/InkLoading.test.tsx`: timing/easing regression contract.
- Modify `src/login/Login.tsx` and `src/login/LoginOtp.tsx`: switch submit state to shared stage.
- Modify `src/login/Login.test.tsx` and `src/login/LoginOtp.test.tsx`: page-level submission contract.
- Modify `src/login/authink.css`: centered 96–120px stage, theme treatment, reduced-motion-safe layout.
- Modify `src/login/Login.stories.tsx` and `src/login/LoginOtp.stories.tsx`: deterministic submitting stories.

### Task 1: Lock the desired InkLoading timing with failing tests

- [ ] Add a test asserting `drawMs=3000`, `holdMs=600`, `dryMs=3600`, `pauseMs=280` and that at 40% of draw time reveal is between 0.20 and 0.50 rather than the current ~0.784.
- [ ] Run `pnpm exec vitest run src/login/components/InkLoading/InkLoading.test.tsx`; expect failure on current timing/reveal.
- [ ] Replace `easeOutCubic` with `easeInOutCubic` and update the two timing values.
- [ ] Re-run the focused test; expect pass.

### Task 2: Add the shared centered submit stage using TDD

- [ ] Create a failing component test that renders `AuthInkSubmitLoading`, asserts `role=status`, `aria-live=polite`, the text `正在验证身份…`, a decorative 64px `.ink-loading`, and distinct `.authink-submit-loading__visual` / `__message` elements.
- [ ] Run the focused test; expect module-not-found failure.
- [ ] Implement the minimal component:

```tsx
export function AuthInkSubmitLoading() {
    return (
        <div className="authink-submit-loading" role="status" aria-live="polite" aria-label="正在验证身份，请稍候">
            <span className="authink-submit-loading__visual" aria-hidden="true">
                <InkLoading size={64} announce={false} />
            </span>
            <span className="authink-submit-loading__message">正在验证身份…</span>
        </div>
    );
}
```

- [ ] Add CSS with a full-width grid, `place-items:center`, fixed minimum height, and centered visual/message rows; do not use offsets or absolute centering hacks.
- [ ] Re-run the component test; expect pass.

### Task 3: Integrate Login and OTP with failing page tests

- [ ] Update Login and OTP tests to expect `.authink-submit-loading`, a 64px ink element, status text, and the original disabled submit button with `aria-busy=true`; assert the previous inline spinner group is absent.
- [ ] Run `pnpm exec vitest run src/login/Login.test.tsx src/login/LoginOtp.test.tsx`; expect failure.
- [ ] Replace the button children with `<AuthInkSubmitLoading />` only while submitting; otherwise retain the original button label.
- [ ] Re-run focused tests; expect pass.

### Task 4: Add deterministic Storybook submission states

- [ ] Add a `forceSubmitting?: boolean` presentation-only prop to Login and OTP, defaulting false, and compute `showSubmitting = isSubmitting || forceSubmitting` without changing POST behavior.
- [ ] Add `Submitting`, `SubmittingDark`, and mobile viewport stories for Login, plus `Submitting` for OTP.
- [ ] Add tests proving default behavior remains unchanged when the prop is absent.
- [ ] Run focused tests and `pnpm build-storybook`; expect pass.

### Task 5: Full verification and independent review

- [ ] Run `pnpm test:run`.
- [ ] Run `pnpm build-storybook`.
- [ ] Run `pnpm build-keycloak-theme`.
- [ ] Run `pnpm test:packaging`.
- [ ] Inspect the diff for scope leakage; Account/Admin/Email files must be untouched.
- [ ] Dispatch an independent Reviewer against the design spec and diff; fix all P0/P1 issues.
- [ ] Commit implementation as one reversible commit.
- [ ] Deploy only to KC26, capture browser geometry evidence (`loader center - stage center < 1px`) and visual timing evidence before any KC21 action.
