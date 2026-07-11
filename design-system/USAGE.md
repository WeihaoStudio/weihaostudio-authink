# WeihaoStudio Auth Ink — Usage

This folder is an Open Design design-system project.

## Install

Copy the entire `weihaostudio-auth-ink/` folder into one of the Open Design design-system roots:

```text
design-systems/weihaostudio-auth-ink/
```

Open Design will read `manifest.json`, inject `DESIGN.md` into generation prompts, and expose `components.html` / `preview/index.html` for review.

## Canonical files

- `DESIGN.md` — agent-facing brand contract.
- `tokens.css` — semantic light and dark CSS variables.
- `components.html` — standalone component fixture.
- `assets/` — approved logo lockups and marks.
- `preview/index.html` — complete desktop login and TOTP specimen.
- `source/evidence.md` — design decisions and provenance.

## Theme usage

Set dark mode on any containing element:

```html
<div data-theme="dark">
  ...
</div>
```

The semantic tokens cascade to descendants.

## Keycloak mapping

Recommended template mapping:

- `login.ftl` → desktop/mobile login shell
- `login-reset-password.ftl` → reset form
- `info.ftl` → reset success and status notices
- `login-otp.ftl` → TOTP form
- `login-config-totp.ftl` → TOTP setup
- identity providers → `.button.button--secondary`
- form errors → `.alert.alert--danger`

## Copy rules

OAuth labels:

- `使用 Google 登录`
- `使用 GitHub 登录`

Do not add “继续”.

## Font policy

The package does not redistribute font files. It uses safe fallbacks and recommends LXGW WenKai for display headings and Noto Sans SC for UI body text.
