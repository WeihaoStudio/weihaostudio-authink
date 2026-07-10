# WeihaoStudio AuthInk Design System

> 状态：Draft for frontend landing
> 主题名：WeihaoStudio AuthInk · 墨鉴
> 口号：入墨见星，一鉴通行

相关文档：[`BRAND.md`](./BRAND.md) · [`TOKENS.md`](./TOKENS.md) · [`COLORS.md`](./COLORS.md) · [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) · [`COMPONENTS.md`](./COMPONENTS.md) · [`PAGES.md`](./PAGES.md)

## 1. Design Philosophy

> Ink remembers identity.
>
> 墨承身份，印证信任。

AuthInk 将东方水墨艺术与现代身份认证结合。它不是简单做一个 Keycloak Skin，而是将登录体验品牌化、安全流程仪式化、企业身份入口产品化。

### 核心意象

| 意象 | 含义 | 表达方式 |
|---|---|---|
| 墨 | 安全、稳定、信任 | 墨黑主色、笔触边缘 |
| 山水 | 空间、留白、平衡 | 远山轮廓、大面积留白 |
| 星辰 | 数字世界、连接、探索 | 星点、月弧、微光轨迹 |
| 印章 | 身份确认、品牌认证 | 章印红、落款锚点 |

## 2. OpenDesign 定义

AuthInk 的 OpenDesign 不是单张视觉稿，而是一份「设计即契约」的工程交付：

1. **Intent First** - 先描述设计意图，再进入实现。
2. **Token First** - 颜色、间距、圆角、阴影、动效进入 token。
3. **Component Contract** - 组件有职责、结构、状态和 Keycloak 映射。
4. **State Complete** - 覆盖默认、错误、加载、OAuth、移动端、暗色模式。
5. **Implementation Ready** - 能落到 HTML、CSS、Keycloak FreeMarker。

## 3. Visual Direction

- 中国风，但不堆砌传统纹样
- 水墨感来自笔触、留白、淡墨层次，而不是复杂插画
- 星辰意象来自星轨、月弧、微光和路径感
- 登录页必须克制：认证任务优先，氛围作为辅助

### 设计关键词

| 关键词 | 表达方式 |
|---|---|
| 水墨 | 宣纸白、墨黑、淡墨灰、柔和渐层 |
| 星辰 | 星点、月弧、轨迹、微光 |
| 极简 | 少色彩、少装饰、强留白 |
| 安全 | 清晰层级、稳定卡片、可读表单 |
| 工程化 | token、contract、template、CSS 变量 |

## 4. Interface Style

AuthInk UI 不是传统中国风网页，而是：

```
Apple Human Interface Guidelines
+ 东方水墨气质
+ 企业级安全产品
```

参考感觉：Linear、Vercel、Stripe、Apple -- 但拥有东方气质。

### 禁止

- 厚重毛笔字
- 过度国潮（龙纹、金色、繁复纹样）
- 复杂山水插画
- 高饱和科技蓝

## 5. Product Scope

覆盖：

- Keycloak 登录主题
- OAuth 登录（Google、GitHub、Microsoft、Apple、OIDC）
- MFA / TOTP 验证
- 密码重置
- 错误状态
- 注册页

## 6. Design Principles

1. **内容优先** - 认证任务是核心，氛围辅助。
2. **留白优先** - 用空间建立呼吸感和高级感。
3. **品牌一致** - 所有页面共享同一视觉语言。
4. **安全可信** - 清晰层级、稳定交互、不轻浮。
5. **可工程化落地** - token 驱动、组件契约、可直接实现。

## 7. Responsive Strategy

| 断点 | 布局 |
|---|---|
| 桌面端 | 左侧氛围层 + 右侧登录卡片，形成「水墨入口」 |
| 平板端 | 卡片居中，背景弱化 |
| 移动端 | 顶部 Logo 收敛，卡片满宽，OAuth 保持可点击面积 |

移动端不是缩小桌面端，而是重新布局：Logo -> Card -> OAuth -> Footer 上下排列。

> 详细页面结构和响应式规范见 [`PAGES.md`](./PAGES.md)。

## 8. Acceptance Checklist

- [ ] Light / Dark 模式均可读
- [ ] Google / GitHub OAuth 可展示
- [ ] 登录错误、加载、禁用状态完整
- [ ] 移动端 375px 宽度无遮挡
- [ ] Keycloak 默认变量能正常渲染
- [ ] 不依赖外部字体即可保持基础可用
- [ ] Logo 资产缺失时页面仍可优雅降级
- [ ] 色彩对比度达到 WCAG AA 标准
