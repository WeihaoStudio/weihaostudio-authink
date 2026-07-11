# WeihaoStudio Auth Ink
> Category: Developer Tools
> A restrained Chinese ink-wash authentication system for Keycloak login, OAuth, recovery, and TOTP flows.
WeihaoStudio Auth Ink translates the studio’s approved crescent-mountain identity into a calm, enterprise-ready authentication system. It is designed for Keycloak and other identity products where clarity, security, localization, and accessibility are non-negotiable.
## 1. Visual Theme & Atmosphere
### Core idea
Authentication is a threshold: the user passes through a quiet moon gate into a protected space. The interface combines:
- restrained Chinese ink-wash composition;
- modern enterprise authentication structure;
- generous negative space;
- fine-line literary display type;
- one small cinnabar seal accent;
- familiar, high-confidence controls.
The result should feel quiet, secure, spacious, precise, poetic, and contemporary Chinese.
### Approved brand assets
Use only:
- `assets/logo-lockup-ink.png` on light surfaces;
- `assets/logo-lockup-white.png` on dark surfaces;
- `assets/logo-mark-ink.png` in compact light contexts;
- `assets/logo-mark-white.png` in compact dark contexts.
The WeihaoStudio wordmark is an image asset. Do not recreate it with a substitute font.
Minimum clear space equals the height of the largest star in the mark. Never crop the crescent, mountain silhouette, stars, or calligraphic tail.
### Imagery
Preferred:
- pale layered mountains, mist, water, distant trees, small boats;
- indigo-black moonlit landscapes in dark mode;
- sparse stars;
- one warm pavilion or window as a human-scale detail.
Ink texture is an atmospheric layer, not decoration on every component. Form content always retains clear contrast.
### Prior art
- Chinese shanshui painting for depth and restraint;
- ink-wash book covers for composition;
- Keycloak for authentication information architecture;
- Linear and Vercel for enterprise control density;
- Apple account-security flows for TOTP clarity.
### Use cases
Primary: login, OAuth, password recovery, reset confirmation, TOTP, recovery codes, trusted devices, loading, errors, and expired sessions.
Secondary: admin sign-in, secure account portals, and internal developer tools.
## 2. Color
### Principles
1. Near-black ink is the primary action in light mode.
2. Warm paper replaces pure white as the canvas.
3. Cool blue is reserved for links, information, and focus.
4. Cinnabar red is reserved for the seal and destructive/error emphasis.
5. Dark mode is moonlit, not a simple inversion.
6. Text and data colors must meet WCAG AA against their actual surfaces.
### Canonical light tokens
```css
:root {
  --color-canvas: #F7F5F0;
  --color-canvas-elevated: #FCFBF7;
  --color-surface: #FFFEFB;
  --color-surface-subtle: #EEEAE2;
  --color-surface-muted: #E4E0D8;
  --color-overlay: rgba(25, 26, 27, 0.52);
  --color-text: #191A1B;
  --color-text-secondary: #4C4F52;
  --color-text-muted: #62666A;
  --color-text-inverse: #F5F2EA;
  --color-placeholder: #6B7074;
  --color-primary: #1E2428;
  --color-primary-hover: #343C41;
  --color-primary-active: #11161A;
  --color-on-primary: #FFFFFF;
  --color-link: #245A78;
  --color-link-hover: #17435D;
  --color-focus: #245A78;
  --color-border: #C8C4BC;
  --color-border-strong: #858A8D;
  --color-border-subtle: #DEDAD2;
  --color-divider: #D8D4CC;
  --color-success: #2E6B50;
  --color-success-surface: #E5F1EA;
  --color-warning: #7A4F10;
  --color-warning-surface: #F7EEDB;
  --color-danger: #9E2F2A;
  --color-danger-surface: #F8E7E5;
  --color-info: #275F7A;
  --color-info-surface: #E4EFF4;
  --color-seal: #9C2F24;
}
```
### Dark override
```css
[data-theme="dark"] {
  --color-canvas: #0B1115;
  --color-canvas-elevated: #0F171C;
  --color-surface: #111A20;
  --color-surface-subtle: #18242C;
  --color-surface-muted: #22313A;
  --color-overlay: rgba(4, 8, 11, 0.62);
  --color-text: #F5F2EA;
  --color-text-secondary: #C9D0D2;
  --color-text-muted: #AAB4B8;
  --color-text-inverse: #11161A;
  --color-placeholder: #AAB4B8;
  --color-primary: #F3F1EA;
  --color-primary-hover: #D9D5CB;
  --color-primary-active: #C5C0B5;
  --color-on-primary: #11161A;
  --color-link: #8EC6E7;
  --color-link-hover: #B6DCF1;
  --color-focus: #8EC6E7;
  --color-border: #43515A;
  --color-border-strong: #7E8B92;
  --color-border-subtle: #2B3942;
  --color-divider: #33434D;
  --color-success: #72C49B;
  --color-success-surface: #173329;
  --color-warning: #F1C46A;
  --color-warning-surface: #3B2D13;
  --color-danger: #FF8C84;
  --color-danger-surface: #3B1C1C;
  --color-info: #8EC6E7;
  --color-info-surface: #18313E;
  --color-seal: #D86A5D;
}
```
### Verified contrast targets
- text on canvas: > 15:1;
- secondary text on canvas: > 7:1;
- muted text on canvas: > 5:1;
- on-primary on primary: > 15:1;
- link on canvas: > 6:1;
- danger on canvas: > 5.5:1.
### Application
- One dominant ink action per screen.
- OAuth icons may retain official marks; surrounding buttons remain neutral.
- The seal appears at most once per viewport.
- Never place text directly on high-detail artwork without a protective surface or overlay.
- Do not tint inputs decoratively.
## 3. Typography
### Character
Display text should feel drawn with a fine brush, not stamped with a heavy one. Functional text stays neutral and highly readable.
Font labels for catalog extraction:
Display: "LXGW WenKai", "霞鹜文楷", "Kaiti SC", STKaiti, Georgia, serif
Body: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, sans-serif
Mono: "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace
### Roles
- Display / page title: display stack, regular, 36–48px desktop.
- Auth card title: display stack, regular, 28px desktop, 26px mobile.
- Section heading: display stack, regular, 22–28px.
- Body: body stack, regular, 16px.
- Label: body stack, medium, 14px.
- Caption: body stack, regular, 12px.
- OTP digits: body or mono stack, medium, 20–24px.
- Brand wordmark: approved image only.
```css
:root {
  --font-display: "LXGW WenKai", "霞鹜文楷", "Kaiti SC", STKaiti, Georgia, serif;
  --font-body: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --text-caption: 12px;
  --text-label: 14px;
  --text-body: 16px;
  --text-body-lg: 18px;
  --text-title-sm: 22px;
  --text-title: 28px;
  --text-heading: 36px;
  --text-display: 48px;
  --text-hero: 64px;
  --leading-caption: 1.45;
  --leading-body: 1.65;
  --leading-title: 1.35;
  --tracking-display: 0.02em;
  --tracking-label: 0.02em;
}
```
Rules:
- no bold calligraphy for paragraphs or labels;
- no synthetic italic;
- use tabular numerals for OTP and time;
- button text stays 14–16px medium;
- avoid all-caps English except short metadata.
## 4. Spacing
The base unit is 4px. Prefer 8px multiples for components and 16px multiples for page layout.
```css
:root {
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```
### Card rhythm
- logo → title: 20–24px;
- title → support copy: 8–12px;
- support copy → first field: 24–32px;
- field → field: 16px;
- helper row → primary button: 24px;
- button → separator: 24px;
- separator → OAuth stack: 16px;
- OAuth button → OAuth button: 12px;
- final action → footer: 32px.
### Responsive spacing
Desktop: 48px shell padding, 40px card padding, 48–72px column gap.
Tablet: 32px shell padding, 32px card padding.
Phone: 20px screen inset, 24px card padding, 12px between touch targets.
## 5. Layout & Composition
### Desktop login
Desktop must look unmistakably desktop.
- reference viewport: 1440×900 or wider;
- true two-column composition;
- visual field: 56–62%;
- auth panel: 38–44%;
- card width: 384–420px;
- card aligns to the optical center of the right panel;
- landscape may extend edge-to-edge inside the visual field;
- never stretch a phone card across a browser canvas.
### Desktop TOTP
Use the same shell as login.
Valid:
1. visual field left + compact TOTP card right;
2. full landscape + card aligned to the right third.
Invalid: a narrow vertical card alone in the exact center of a wide desktop canvas without secondary structure.
### Mobile
- single column;
- logo above or inside the card header;
- landscape becomes a low-contrast header or wash;
- OAuth stays full-width;
- 6 OTP cells fit at 320px without horizontal scrolling;
- first interactive field should appear in the initial viewport.
```css
:root {
  --auth-card-width: 420px;
  --auth-card-width-compact: 384px;
  --container-max: 1440px;
  --content-max: 1200px;
  --auth-visual-ratio: 58%;
  --auth-panel-ratio: 42%;
  --auth-desktop-padding: 48px;
  --auth-tablet-padding: 32px;
  --auth-phone-padding: 20px;
  --auth-min-height: 720px;
}
```
Breakpoints:
- desktop ≥ 1180px: two-column shell;
- tablet 768–1179px: compact split or protected overlay;
- phone < 768px: single column;
- small phone < 360px: reduce gaps before reducing touch-target size.
Composition rules:
- one primary visual focus;
- asymmetry in art, symmetry in the form;
- calm empty area around the form;
- no stars, birds, or peaks behind text;
- seal near title/footer, never inside the form.
## 6. Components
Component colors must reference semantic tokens.
### Authentication card
```css
.auth-card {
  width: min(100%, var(--auth-card-width));
  padding: var(--space-10);
  border: var(--border-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  background: color-mix(in oklab, var(--color-surface), transparent 3%);
  color: var(--color-text);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(10px);
}
.auth-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-title);
  font-weight: var(--font-weight-regular);
  line-height: var(--leading-title);
}
.auth-card__description {
  margin-block-start: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--text-label);
  line-height: var(--leading-body);
}
```
### Field
```css
.field {
  display: grid;
  gap: var(--space-2);
}
.field__label {
  color: var(--color-text-secondary);
  font-size: var(--text-label);
  font-weight: var(--font-weight-medium);
}
.field__control {
  width: 100%;
  min-height: var(--control-height);
  padding-inline: var(--space-4);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font: var(--font-weight-regular) var(--text-body) / 1 var(--font-body);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}
.field__control::placeholder {
  color: var(--color-placeholder);
}
.field__control:focus-visible {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: var(--shadow-focus);
}
.field[data-invalid="true"] .field__control {
  border-color: var(--color-danger);
}
```
### Buttons
```css
.button {
  display: inline-flex;
  min-height: var(--control-height);
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding-inline: var(--space-5);
  border: var(--border-thin) solid transparent;
  border-radius: var(--radius-sm);
  font: var(--font-weight-medium) var(--text-label) / 1 var(--font-body);
  text-decoration: none;
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}
.button:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
.button--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
.button--primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}
.button--secondary {
  border-color: var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
}
.button--secondary:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface-subtle);
}
```
OAuth provider buttons:
- full-width;
- 18–20px provider icon;
- labels are “使用 Google 登录” and “使用 GitHub 登录”;
- never use “继续”;
- remain visually secondary to the primary login action.
### Checkbox
```css
.check-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--text-label);
}
.check-row input {
  inline-size: 18px;
  block-size: 18px;
  accent-color: var(--color-primary);
}
.check-row input:focus-visible {
  outline: var(--border-strong) solid var(--color-focus);
  outline-offset: var(--space-1);
}
```
### OTP
```css
.otp {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, var(--otp-cell-size)));
  justify-content: center;
  gap: var(--space-2);
}
.otp__cell {
  inline-size: var(--otp-cell-size);
  block-size: var(--otp-cell-size);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: center;
  font: var(--font-weight-medium) var(--text-title-sm) / 1 var(--font-mono);
}
.otp__cell:focus-visible {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: var(--shadow-focus);
}
.otp[data-invalid="true"] .otp__cell {
  border-color: var(--color-danger);
}
```
### Alerts
```css
.alert {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-label);
}
.alert--danger {
  border-color: var(--color-danger);
  background: var(--color-danger-surface);
  color: var(--color-danger);
}
.alert--success {
  border-color: var(--color-success);
  background: var(--color-success-surface);
  color: var(--color-success);
}
.alert--info {
  border-color: var(--color-info);
  background: var(--color-info-surface);
  color: var(--color-info);
}
```
Loading:
- keep the approved mark visible;
- use a thin progress indicator;
- copy: “正在安全验证，请稍候…”;
- preserve layout to prevent shift.
Footer includes copyright, privacy, terms, support, and optional locale control.
## 7. Motion & Interaction
Motion is short and functional. No continuous decorative particles or parallax.
```css
:root {
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 300ms;
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```
Rules:
- primary button may lift 1px on hover;
- focus is always visible;
- error alerts enter without shifting the whole card;
- OTP advances on valid input and supports six-digit paste;
- theme changes cross-fade in 180ms;
- loading buttons retain width;
- password visibility preserves cursor position.
```css
@media (prefers-reduced-motion: reduce) {
  .button {
    transition-duration: 0.01ms;
  }
  .auth-card {
    animation: none;
  }
  .loading-indicator {
    animation-duration: 1.5s;
  }
  .theme-transition {
    transition: none;
  }
}
```
Keyboard:
- Tab follows visual order;
- Enter submits;
- Escape closes locale/provider menus;
- OAuth choices use buttons or links;
- OTP exposes one accessible group label.
## 8. Voice & Brand
WeihaoStudio speaks with calm confidence.
Use concise instructions, plain security language, specific recovery guidance, and one optional poetic line outside the form.
Avoid jokes, blame, unnecessary urgency, and obscure classical language.
Preferred copy:
Login:
- “欢迎回来”
- “使用您的账号安全登录。”
- “登录”
- “使用 Google 登录”
- “使用 GitHub 登录”
- “忘记密码？”
- “联系管理员”
TOTP:
- “二步验证”
- “请输入身份验证器 App 中的 6 位动态验证码。”
- “验证”
- “信任此设备 30 天”
- “使用恢复码登录”
- “返回登录”
Status:
- “正在安全验证，请稍候…”
- “用户名或密码不正确，请重新输入。”
- “验证码不正确，请检查后重试。”
- “邮件已发送，请检查您的收件箱。”
- “当前会话已过期，请重新登录。”
Optional visual-field line:
> 明月松间照，清泉石上流。
Localization:
- Chinese first;
- allow 35% label expansion;
- no fixed-width translated buttons;
- locale control shows current language;
- use sentence case in English.
## 9. Anti-patterns
- Do not replace the approved logo with generated text or another crescent.
- Do not use the wordmark font for functional UI labels.
- Do not use heavy black calligraphy for paragraphs, labels, or helper text.
- Do not stretch a mobile card across a desktop viewport.
- Do not center a narrow mobile-like card on a wide canvas without desktop structure.
- Do not show more than one cinnabar decorative accent per viewport.
- Do not place mountain peaks, birds, stars, or splashes behind form text.
- Do not use texture as a substitute for hierarchy.
- Do not remove standard password, checkbox, or focus affordances.
- Do not make OAuth buttons more prominent than the primary action.
- Do not use “继续” in OAuth labels.
- Do not use decorative gradients as control fills.
- Do not use low-contrast glassmorphism.
- Do not exceed 24px corner radius on product cards.
- Do not shadow every control.
- Do not animate ink particles continuously.
- Do not disable motion with a global `*` selector.
- Do not use placeholder text as the only label.
- Do not use red for neutral decoration.
- Do not hide recovery or admin assistance behind an unlabeled icon.
- Do not reduce touch targets below 44px.
- Do not shrink OTP digits until ambiguous; reduce gaps first.
- Do not claim WCAG compliance without pairwise contrast checks.
- Do not hardcode light colors inside component rules.
- Do not duplicate light/dark components; override semantic tokens with `[data-theme="dark"]`.
