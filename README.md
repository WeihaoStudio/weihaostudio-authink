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

## Documentation

- [设计理念](docs/DESIGN.md)
- [品牌规范](docs/BRAND.md)
- [Design Tokens](docs/TOKENS.md)
- [组件系统](docs/COMPONENTS.md)
- [页面模式](docs/PAGES.md)
- [Keycloak Theme 映射](docs/KEYCLOAK_THEME.md)
- [前端实现指南](docs/IMPLEMENTATION.md)

## Frontend Assets

- [`src/theme/tokens.css`](src/theme/tokens.css)：可直接使用的语义化 CSS Variables
- [`src/theme/components.css`](src/theme/components.css)：Button、Input、Auth Card、Alert、TOTP 等组件样式
- [`src/theme/pages.css`](src/theme/pages.css)：桌面双栏、移动单列和暗色模式页面布局

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
- [ ] React component implementation
- [ ] Keycloakify page implementation
- [ ] Storybook
- [ ] Accessibility and visual regression tests
- [ ] Keycloak Theme JAR build

## Delivery Stages

每个阶段独立提交，不将全部产物积压到最终一次提交：

1. Foundation
2. Components
3. Page Patterns
4. Keycloak Integration
5. Frontend Runtime
6. Storybook & Quality

## Status

当前仓库已经完成 Design System 文档骨架与前端 CSS 基础。下一阶段进入 React 组件和 Keycloakify 页面实现。
