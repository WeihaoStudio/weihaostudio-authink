# AuthInk Keycloak Theme Specification

> 本文定义 WeihaoStudio AuthInk 与 Keycloak 登录主题的页面映射、模板职责、资源组织和实现约束。

相关文档：[`PAGES.md`](./PAGES.md) · [`COMPONENTS.md`](./COMPONENTS.md) · [`IMPLEMENTATION.md`](./IMPLEMENTATION.md)

## 1. 实现目标

AuthInk 不是单纯替换 CSS 的皮肤，而是一套可维护的身份认证前端主题：

- 覆盖 Keycloak 常用认证页面
- 支持浅色 / 暗色模式
- 支持桌面、平板和移动端
- 支持 OAuth / Identity Provider
- 支持 TOTP、恢复码和可信设备提示
- 保留 Keycloak 表单行为、错误信息和安全语义
- 允许通过 Realm 配置品牌文案和登录提供商

## 2. 推荐技术路线

优先使用 **Keycloakify + React + TypeScript + CSS Variables**。

原因：

- 页面状态可以组件化
- 支持 Storybook / Vite 预览
- 更容易做响应式和可访问性测试
- 保留 Keycloak Context 数据模型
- 可打包成标准 Keycloak Theme JAR

如需原生 FreeMarker Theme，本文的页面映射和 Token 仍可直接复用。

## 3. 目录结构

```text
src/
├── keycloak-theme/
│   ├── kc.gen.ts
│   ├── KcPage.tsx
│   ├── KcPageStory.tsx
│   ├── login/
│   │   ├── Login.tsx
│   │   ├── LoginResetPassword.tsx
│   │   ├── LoginUpdatePassword.tsx
│   │   ├── LoginOtp.tsx
│   │   ├── LoginRecoveryAuthnCode.tsx
│   │   ├── Info.tsx
│   │   └── Error.tsx
│   └── shared/
│       ├── AuthLayout.tsx
│       ├── AuthCard.tsx
│       ├── BrandPanel.tsx
│       ├── OAuthProviders.tsx
│       ├── TotpInput.tsx
│       ├── Alert.tsx
│       └── Footer.tsx
├── theme/
│   ├── tokens.css
│   ├── reset.css
│   ├── components.css
│   ├── pages.css
│   └── ink-effects.css
└── assets/
    ├── logo/
    ├── icons/
    └── backgrounds/
```

## 4. Keycloak Page Mapping

| Keycloak Page ID / Template | AuthInk 页面 | React 组件 |
|---|---|---|
| `login.ftl` | 登录页 | `Login.tsx` |
| `login-reset-password.ftl` | 重置密码 | `LoginResetPassword.tsx` |
| `login-update-password.ftl` | 更新密码 | `LoginUpdatePassword.tsx` |
| `login-otp.ftl` | TOTP 二步验证 | `LoginOtp.tsx` |
| `login-recovery-authn-code.ftl` | 恢复码登录 | `LoginRecoveryAuthnCode.tsx` |
| `info.ftl` | 成功 / 信息页 | `Info.tsx` |
| `error.ftl` | 错误页 | `Error.tsx` |
| `login-idp-link-confirm.ftl` | 外部账号绑定确认 | `IdpLinkConfirm.tsx` |
| `login-idp-link-email.ftl` | 邮箱绑定确认 | `IdpLinkEmail.tsx` |
| `terms.ftl` | 用户协议 | `Terms.tsx` |

实现时以当前目标 Keycloak 版本实际提供的 `pageId` 为准，并在升级时检查模板差异。

## 5. KcPage Router

```tsx
export function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;

  switch (kcContext.pageId) {
    case "login.ftl":
      return <Login kcContext={kcContext} />;
    case "login-reset-password.ftl":
      return <LoginResetPassword kcContext={kcContext} />;
    case "login-update-password.ftl":
      return <LoginUpdatePassword kcContext={kcContext} />;
    case "login-otp.ftl":
      return <LoginOtp kcContext={kcContext} />;
    case "login-recovery-authn-code.ftl":
      return <LoginRecoveryAuthnCode kcContext={kcContext} />;
    case "info.ftl":
      return <Info kcContext={kcContext} />;
    case "error.ftl":
      return <Error kcContext={kcContext} />;
    default:
      return <DefaultPage kcContext={kcContext} />;
  }
}
```

任何未定制页面必须有可用 fallback，避免 Keycloak 新增页面时出现空白页面。

## 6. AuthLayout

`AuthLayout` 负责：

- 品牌视觉区
- 认证内容区
- Header 工具（语言、主题）
- Footer
- 响应式布局
- Light / Dark 主题
- 页面标题和元数据

推荐 API：

```tsx
<AuthLayout
  appearance="auto"
  brandVariant="full"
  visual="ink-mountain"
  title="欢迎回来"
  description="使用您的账号登录"
>
  {children}
</AuthLayout>
```

布局规则见 [`PAGES.md`](./PAGES.md)。

## 7. Login Context Mapping

登录页应使用 Keycloak 提供的数据，不在前端硬编码 Realm 行为：

- `url.loginAction`
- `url.registrationUrl`
- `url.loginResetCredentialsUrl`
- `realm.rememberMe`
- `realm.resetPasswordAllowed`
- `realm.registrationAllowed`
- `social.providers`
- `login.username`
- `messagesPerField`
- `message`

OAuth 提供商：

```tsx
{social?.providers.map(provider => (
  <OAuthProviderButton
    key={provider.providerId}
    href={provider.loginUrl}
    providerId={provider.providerId}
    displayName={provider.displayName}
  />
))}
```

按钮文案统一生成：`使用 {displayName} 登录`。

## 8. Form Submission

- 表单 `action` 使用 Keycloak `url.loginAction`
- 方法使用 `POST`
- 保留 Keycloak 要求的字段名称
- 不拦截或修改安全字段
- 提交后立即禁用重复提交
- 网络异常时不得假装认证成功

示例字段：

```html
<input name="username" autocomplete="username" />
<input name="password" type="password" autocomplete="current-password" />
<input name="rememberMe" type="checkbox" />
```

## 9. Error and Message Mapping

### Field Error

使用 `messagesPerField.existsError("username", "password")` 等 API 判断字段错误。

- 字段错误放在字段附近
- 页面错误放在 Card 顶部
- `role="alert"`
- 避免将后端 HTML 未清洗地直接插入页面

### Global Message

支持：

- `success`
- `warning`
- `error`
- `info`

视觉映射到 AuthInk `Alert` 组件。

## 10. TOTP / OTP

Keycloak OTP 页面可能提供多个已配置凭据：

- 单一凭据：直接显示验证码输入
- 多个凭据：先选择设备，再输入验证码

要求：

- 字段名以当前 Keycloak Context 为准
- 支持 `autocomplete="one-time-code"`
- 支持粘贴 6 位数字
- 不把验证码写入日志或分析平台
- 错误后保留页面结构稳定

“信任此设备 30 天”不是所有 Keycloak 默认流程自带能力。实现前必须确认：

1. 是否由自定义 Authenticator 提供
2. 是否有对应表单字段和 Cookie 策略
3. 是否满足组织安全策略

如果后端未实现，不得仅做前端假复选框。

## 11. Recovery Codes

恢复码页面需遵守：

- 输入值不记录到日志
- 提交后清理本地状态
- 使用等宽字体只用于输入表现
- 错误文案不泄漏恢复码有效性细节
- 剩余恢复码提示由后端 Context 提供时才展示

## 12. Internationalization

- 所有界面文案进入消息资源文件
- 不在组件中硬编码中文
- 中文为默认品牌语言时仍保留英文 fallback
- OAuth 服务商名称不翻译

推荐资源：

```text
messages/
├── messages_zh_CN.properties
└── messages_en.properties
```

示例：

```properties
authink.login.title=欢迎回来
authink.login.description=使用您的账号登录
authink.oauth.signInWith=使用 {0} 登录
authink.totp.title=二步验证
authink.totp.description=请输入身份验证器 App 中的 6 位动态验证码
authink.recovery.title=使用恢复码登录
```

## 13. Theme Configuration

推荐暴露以下品牌配置：

```ts
export interface AuthInkThemeConfig {
  productName: string;
  appearance: "light" | "dark" | "auto";
  brandVisual: "ink-mountain" | "minimal" | "none";
  sealEnabled: boolean;
  supportUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
  footerText?: string;
}
```

Realm 级差异通过环境配置或构建时配置注入，不修改基础组件。

## 14. Asset Rules

### Logo

```text
assets/logo/
├── authink-full-light.svg
├── authink-full-dark.svg
├── authink-icon-light.svg
├── authink-icon-dark.svg
└── authink-icon-mono.svg
```

### Background

- 使用 WebP / AVIF + fallback
- Light 与 Dark 分开导出
- 不在 CSS 中内嵌超大 base64
- 首屏背景应按响应式尺寸加载
- 移动端可使用裁剪版或关闭背景图

### Icons

- 功能图标使用统一 SVG 图标集
- Google / GitHub 等品牌图标遵守官方规范
- 不使用 emoji 作为正式 UI 图标

## 15. Security Constraints

- 不在客户端存储密码、OTP、恢复码
- 不记录表单敏感值
- 不修改 Keycloak CSRF / flow code 行为
- 外部链接使用受控配置
- `target="_blank"` 必须加 `rel="noreferrer noopener"`
- HTML 消息必须经过 Keycloak/框架安全处理
- 禁止前端模拟登录成功状态

## 16. Accessibility

- 认证页加载后焦点移动到页面标题或第一个错误字段
- 错误摘要支持屏幕阅读器
- 验证码输入支持单字段 fallback
- 语言选择有明确名称
- 主题切换有当前状态说明
- Dark 模式保持 WCAG 对比度

## 17. Native FreeMarker Fallback

如果使用原生 Theme：

```text
themes/authink/login/
├── theme.properties
├── login.ftl
├── login-reset-password.ftl
├── login-update-password.ftl
├── login-otp.ftl
├── info.ftl
├── error.ftl
├── messages/
└── resources/
    ├── css/
    ├── img/
    └── js/
```

`theme.properties` 示例：

```properties
parent=keycloak
import=common/keycloak
styles=css/tokens.css css/authink.css
locales=zh-CN,en
```

## 18. Definition of Done

一个 AuthInk Keycloak 页面完成时必须满足：

- 页面状态已在 Storybook / 本地预览覆盖
- Light / Dark 可用
- Desktop / Mobile 可用
- 键盘流程可完成
- 错误信息可被读取
- 未记录敏感值
- 与目标 Keycloak 版本构建成功
- Theme JAR 可安装
- Realm 中手动验证主要登录流程
