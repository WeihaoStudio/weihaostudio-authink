# AuthInk Frontend Implementation Guide

> 本文给出 WeihaoStudio AuthInk 从设计规范到可运行 Keycloak Theme 的工程落地路径。

相关文档：[`TOKENS.md`](./TOKENS.md) · [`COMPONENTS.md`](./COMPONENTS.md) · [`PAGES.md`](./PAGES.md) · [`KEYCLOAK_THEME.md`](./KEYCLOAK_THEME.md)

## 1. 推荐技术栈

- React 18+
- TypeScript 5+
- Vite
- Keycloakify
- CSS Variables + CSS Modules（或 Vanilla CSS）
- Storybook
- Vitest + Testing Library
- Playwright
- ESLint + Prettier

AuthInk 的视觉核心必须由 Design Tokens 控制，避免在组件中散落颜色、间距和阴影常量。

## 2. 工程结构

```text
weihaostudio-authink/
├── docs/
├── public/
├── src/
│   ├── assets/
│   │   ├── logo/
│   │   ├── icons/
│   │   └── backgrounds/
│   ├── components/
│   │   ├── Alert/
│   │   ├── AuthCard/
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── Input/
│   │   ├── OAuthButton/
│   │   └── TotpInput/
│   ├── keycloak-theme/
│   │   ├── KcPage.tsx
│   │   ├── kc.gen.ts
│   │   ├── login/
│   │   └── shared/
│   ├── theme/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   └── ink-effects.css
│   ├── stories/
│   └── main.tsx
├── package.json
├── vite.config.ts
└── keycloakify.config.ts
```

## 3. 初始化建议

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install keycloakify
npm install -D @storybook/react-vite vitest @testing-library/react playwright
```

以仓库当前版本锁定实际依赖，不在文档中固定可能过期的版本号。

## 4. Token 使用

导入顺序：

```css
@import "./tokens.css";
@import "./reset.css";
@import "./global.css";
@import "./components.css";
@import "./pages.css";
```

组件只使用语义 Token：

```css
.authink-card {
  background: var(--authink-color-surface);
  color: var(--authink-color-text);
  border: 1px solid var(--authink-color-border);
  border-radius: var(--authink-radius-xl);
  box-shadow: var(--authink-shadow-card);
}
```

禁止：

```css
/* 不允许在组件里散落无语义常量 */
.authink-card {
  background: #faf9f6;
  border-radius: 17px;
}
```

## 5. Theme Provider

推荐使用 `data-theme`：

```tsx
export type Appearance = "light" | "dark" | "auto";

export function applyAppearance(appearance: Appearance) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = appearance === "auto" ? (prefersDark ? "dark" : "light") : appearance;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}
```

- 默认使用 Realm / 产品配置
- 用户手动选择可写入非敏感本地偏好
- 不将主题偏好与认证状态绑定

## 6. AuthLayout 示例

```tsx
import type { PropsWithChildren, ReactNode } from "react";

interface AuthLayoutProps extends PropsWithChildren {
  title: string;
  description?: string;
  brandPanel?: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({
  title,
  description,
  brandPanel,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <main className="authink-layout">
      <section className="authink-layout__brand" aria-label="WeihaoStudio AuthInk">
        {brandPanel}
      </section>

      <section className="authink-layout__content">
        <div className="authink-card">
          <header className="authink-card__header">
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </header>
          {children}
        </div>
        {footer}
      </section>
    </main>
  );
}
```

## 7. 响应式布局

```css
.authink-layout {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(440px, 2fr);
}

.authink-layout__content {
  display: grid;
  place-items: center;
  padding: clamp(24px, 5vw, 80px);
}

@media (max-width: 1199px) {
  .authink-layout {
    grid-template-columns: minmax(280px, 2fr) minmax(420px, 3fr);
  }
}

@media (max-width: 767px) {
  .authink-layout {
    display: block;
  }

  .authink-layout__brand {
    min-height: 144px;
  }

  .authink-layout__content {
    display: block;
    padding: 16px;
  }
}
```

桌面必须是真正的双栏页面；移动端采用独立单列结构。

## 8. Login 示例

```tsx
<form action={kcContext.url.loginAction} method="post" className="authink-form">
  <Input
    name="username"
    label="用户名或邮箱"
    autoComplete="username"
    defaultValue={kcContext.login?.username ?? ""}
    error={usernameError}
  />

  <Input
    name="password"
    type="password"
    label="密码"
    autoComplete="current-password"
    error={passwordError}
  />

  <Button type="submit" fullWidth loading={isSubmitting}>
    登录
  </Button>
</form>
```

Keycloak 表单字段名、Action URL 和 Context 数据不得自行改名。

## 9. OAuth Providers

```tsx
function OAuthProviders({ providers }: { providers: SocialProvider[] }) {
  if (providers.length === 0) return null;

  return (
    <section aria-label="其他登录方式">
      <Divider>或使用以下方式登录</Divider>
      <div className="authink-oauth-list">
        {providers.map(provider => (
          <OAuthButton
            key={provider.providerId}
            href={provider.loginUrl}
            provider={provider.providerId}
          >
            使用 {provider.displayName} 登录
          </OAuthButton>
        ))}
      </div>
    </section>
  );
}
```

不要根据数组位置猜测服务商；使用 `providerId` 映射图标和样式。

## 10. TOTP Input 示例

```tsx
<TotpInput
  length={6}
  name="otp"
  autoFocus
  autoComplete="one-time-code"
  inputMode="numeric"
  error={otpError}
/>
```

组件需支持：

- 单格输入
- 整段粘贴
- 左右方向键
- Backspace 回退
- 移动端数字键盘
- 屏幕阅读器说明
- 单字段无 JavaScript fallback

## 11. 错误处理

### 页面级

```tsx
{message && (
  <Alert type={message.type} role={message.type === "error" ? "alert" : "status"}>
    {message.summary}
  </Alert>
)}
```

### 字段级

```tsx
<Input
  aria-invalid={Boolean(error)}
  aria-describedby={error ? `${id}-error` : undefined}
/>
{error && <p id={`${id}-error`}>{error}</p>}
```

错误信息必须来自 Keycloak Context 或安全的前端校验，不直接渲染不可信 HTML。

## 12. 水墨视觉实现

水墨效果分三层：

1. **Brand Background**：独立图片资源，允许裁剪
2. **Ink Accent**：小型 SVG 或 CSS Mask，用于标题下划线、主按钮边缘
3. **Seal Accent**：印章红的小面积状态或品牌锚点

禁止：

- 在输入框后放复杂山水
- 对正文叠加纹理
- 使用随机滤镜导致每次渲染不一致
- 使用过重动画干扰认证操作

## 13. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 14. Storybook 覆盖

每个核心组件至少包含：

- Light / Dark
- Default / Hover / Focus / Disabled
- Error / Loading（适用时）
- 中文长文案
- 英文文案
- 320px 移动视口
- 1440px 桌面视口

页面 Story：

- Login Default
- Login Invalid Credentials
- Login Loading
- Reset Password
- Reset Password Sent
- TOTP Default
- TOTP Error
- Recovery Code
- Info / Error

## 15. Testing

### Unit / Component

- 表单字段与 Label 关联
- 键盘操作
- 错误信息关联
- OAuth 按钮 URL
- TOTP 粘贴和回退
- Loading 防重复提交

### Visual Regression

建议基准视口：

- `375 × 812`
- `768 × 1024`
- `1440 × 900`
- `1920 × 1080`

### E2E

- 用户名密码登录
- 错误凭据
- 密码重置
- Google / GitHub 跳转
- TOTP 成功 / 失败
- 恢复码
- Light / Dark
- 中文 / 英文

## 16. Build and Packaging

推荐脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "storybook": "storybook dev -p 6006",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "build": "tsc -b && vite build",
    "build-keycloak-theme": "keycloakify build"
  }
}
```

构建产物：

- 静态预览站
- Storybook
- Keycloak Theme JAR
- 可选 npm Design Token 包

## 17. CI 建议

每个 Pull Request：

1. Lint
2. Type check
3. Unit tests
4. Build
5. Storybook build
6. Visual regression
7. Keycloak Theme build

主分支：

- 生成版本号
- 上传 Theme JAR
- 发布文档站
- 生成变更日志

## 18. 分阶段落地顺序

### Stage 1 — Foundation

- Brand
- Design Principles
- Tokens

### Stage 2 — Components

- Button
- Input
- Auth Card
- OAuth Button
- Alert
- TOTP Input

### Stage 3 — Page Patterns

- Login
- Reset Password
- TOTP
- Recovery Code
- Info / Error

### Stage 4 — Keycloak Integration

- KcPage Router
- Context Mapping
- i18n
- Theme JAR

### Stage 5 — Quality

- Storybook
- Accessibility
- Visual Regression
- E2E

每个 Stage 独立提交和验收，不将所有产物堆积到最终一次提交。
