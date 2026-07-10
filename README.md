# WeihaoStudio AuthInk

WeihaoStudio AuthInk 是一个面向 Keycloak 身份认证场景的东方水墨设计系统与前端主题。

> Ink remembers identity.  
> 墨承身份，印证信任。

## Goals

- Keycloak Theme
- OAuth Login Experience
- MFA / TOTP Experience
- Frontend Design System
- Light / Dark Theme
- Desktop / Mobile Responsive Layout
- Accessible Authentication UI
- 4K High-Fidelity Visual Parity

## Run the Preview

```bash
npm install
npm run dev
```

打开：

- `/?page=login&theme=light`
- `/?page=login&theme=dark`
- `/?page=totp&theme=light`
- `/?page=totp&theme=dark`

构建生产预览：

```bash
npm run build
npm run preview
```

## Documentation

- [设计理念](docs/DESIGN.md)
- [品牌规范](docs/BRAND.md)
- [Design Tokens](docs/TOKENS.md)
- [组件系统](docs/COMPONENTS.md)
- [页面模式](docs/PAGES.md)
- [Keycloak Theme 映射](docs/KEYCLOAK_THEME.md)
- [前端实现指南](docs/IMPLEMENTATION.md)
- [高保真无损还原规范](docs/VISUAL_FIDELITY.md)

## Frontend Implementation

- [`src/App.tsx`](src/App.tsx)：登录页 / TOTP 原型路由和主题切换
- [`src/components/AuthShell.tsx`](src/components/AuthShell.tsx)：真实桌面双栏与移动端重排外壳
- [`src/components/Field.tsx`](src/components/Field.tsx)：可访问表单输入
- [`src/components/OAuthButtons.tsx`](src/components/OAuthButtons.tsx)：Google / GitHub 登录
- [`src/components/TotpInput.tsx`](src/components/TotpInput.tsx)：六位动态验证码输入
- [`src/pages/LoginPage.tsx`](src/pages/LoginPage.tsx)：高保真登录页
- [`src/pages/TotpPage.tsx`](src/pages/TotpPage.tsx)：高保真 TOTP 页

## Visual Assets

- [`public/assets/authink-logo.svg`](public/assets/authink-logo.svg)：可缩放品牌锁定图
- [`public/assets/ink-landscape-light.svg`](public/assets/ink-landscape-light.svg)：浅色水墨山水
- [`public/assets/ink-landscape-dark.svg`](public/assets/ink-landscape-dark.svg)：暗色月夜水墨

全部使用 SVG，避免在 4K、Retina 和超宽屏中出现位图拉伸失真。

## Theme Assets

- [`src/theme/tokens.css`](src/theme/tokens.css)：语义化 CSS Variables
- [`src/theme/components.css`](src/theme/components.css)：Button、Input、Auth Card、Alert、TOTP 等组件样式
- [`src/theme/pages.css`](src/theme/pages.css)：桌面双栏、移动单列和暗色模式页面布局
- [`src/app.css`](src/app.css)：高保真视觉校准层

## Quality

```bash
npx playwright install chromium
npx playwright test tests/smoke.spec.ts
npm run test:visual:update
npm run test:visual
```

CI 当前执行稳定的响应式布局与文案合同测试。视觉快照基准需要设计确认后提交。

## Design Direction

- 中国风
- 水墨画
- 极简克制
- 星辰与月山意境
- 现代企业级安全产品质感

AuthInk 不使用厚重国潮堆砌。水墨负责氛围，表单负责效率，错误与安全信息始终优先清晰表达。

## Roadmap

- [x] Brand foundation
- [x] Design philosophy
- [x] Design tokens documentation
- [x] Component specification
- [x] Page patterns
- [x] Keycloak page mapping
- [x] Frontend implementation guide
- [x] CSS token foundation
- [x] Core component styles
- [x] Responsive page styles
- [x] React component implementation
- [x] Login high-fidelity page
- [x] TOTP high-fidelity page
- [x] SVG visual assets
- [x] Accessibility and visual test harness
- [ ] Approved visual snapshot baselines
- [ ] Keycloakify page implementation
- [ ] Storybook
- [ ] Keycloak Theme JAR build

## Delivery Stages

每个阶段独立提交，不将全部产物积压到最终一次提交：

1. Foundation
2. Components
3. Page Patterns
4. Keycloak Integration
5. Frontend Runtime
6. Visual Fidelity
7. Storybook & Quality

## Status

当前仓库已经具备可运行的 React 高保真预览、浅色/暗色主题、桌面/移动响应式布局、登录与 TOTP 页面，以及自动化视觉质量入口。下一阶段将接入 Keycloakify 的真实 `KcContext` 与页面映射。
