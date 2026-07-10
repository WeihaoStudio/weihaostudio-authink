# AuthInk Component System

> 本文定义 WeihaoStudio AuthInk 在登录、OAuth、密码重置、MFA/TOTP 等身份认证场景中的可复用组件规范。

相关文档：[`DESIGN.md`](./DESIGN.md) · [`BRAND.md`](./BRAND.md) · [`TOKENS.md`](./TOKENS.md) · [`PAGES.md`](./PAGES.md)

## 1. 组件原则

1. **安全信息优先**：错误、风险和下一步动作必须清晰，不用装饰掩盖状态。
2. **水墨只做氛围**：水墨纹理不得进入输入内容区，不降低文字和边界对比度。
3. **克制的品牌表达**：品牌 Logo、细线书写标题、印章红是记忆点，不同时过度出现。
4. **键盘优先**：所有交互组件必须支持键盘、焦点可见和屏幕阅读器。
5. **移动端重新布局**：不是缩小桌面，而是按单列流程重排。

## 2. Typography Roles

| 角色 | 推荐字体 | 用途 |
|---|---|---|
| Brand | Logo SVG 资产 | `WeihaoStudio` 品牌字标，不使用普通字体替代 |
| Display | `LXGW WenKai`, `Noto Serif SC`, serif | 欢迎回来、二步验证等页面标题 |
| Body | `Inter`, `Noto Sans SC`, system-ui, sans-serif | 表单、说明、按钮、提示 |
| Code | `SFMono-Regular`, `Consolas`, monospace | 恢复码、调试信息 |

标题采用较轻字重，建议 `400–500`；正文以 `400` 为主；按钮和标签使用 `500–600`。禁止使用大面积厚重毛笔字体。

## 3. Button

### 3.1 Primary Button

用于页面唯一主动作，例如“登录”“验证”“发送重置链接”。

- 高度：桌面 `44px`，移动端 `48px`
- 水平内边距：`20px`
- 圆角：`var(--radius-md)`
- 字号：`15px`
- 默认：墨黑背景、纸白文字
- Hover：背景提升一个墨色层级；允许极轻微墨迹扩散，不改变按钮边界
- Focus：`2px` 外描边 + `2px` 间距
- Disabled：透明度不得低于 `0.45`，同时禁用指针事件
- Loading：保留按钮宽度，文字替换为加载状态，避免布局跳动

```css
.authink-button--primary {
  min-height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: var(--radius-md);
  background: var(--authink-ink-900);
  color: var(--authink-paper);
  font-weight: 600;
}
```

### 3.2 Secondary Button

用于“返回登录”“使用恢复码”等次级动作。

- 透明或纸白背景
- `1px` 雾灰边框
- 不使用墨刷实底
- Hover 仅改变表面色和边框色

### 3.3 OAuth Button

按钮文案统一：

- `使用 Google 登录`
- `使用 GitHub 登录`
- `使用 Microsoft 登录`
- `使用 Apple 登录`

禁止使用“继续使用……”等冗余文案。

规格：

- 图标：`18–20px`
- 图标与文字间距：`10px`
- 图标保持服务商官方配色；单色模式允许使用当前文字色
- 提供商按钮之间间距：`10px`
- OAuth 区域必须有可读分隔文案，例如“或使用以下方式登录”

## 4. Input

### 4.1 Anatomy

1. Label
2. Input container
3. Leading / trailing icon（可选）
4. Supporting text 或 Error message

### 4.2 Specification

- 高度：桌面 `44px`，移动端 `48px`
- 左右内边距：`14px`
- 圆角：`var(--radius-md)`
- 边框：`1px solid var(--authink-mist)`
- Label 与输入框间距：`6px`
- 帮助文字与输入框间距：`6px`
- Placeholder 不得替代 Label

### 4.3 States

| 状态 | 表现 |
|---|---|
| Default | 雾灰边框，纸白背景 |
| Hover | 边框提升至 `ink-700` 的低透明度 |
| Focus | 墨色边框 + 可见焦点环 |
| Error | 错误红边框与文字；必须配合文字描述 |
| Disabled | 降低对比度但仍可辨识内容 |
| Readonly | 保留内容对比度，使用不同表面色 |

密码输入必须提供显示/隐藏按钮，按钮具有可访问名称，例如 `aria-label="显示密码"`。

## 5. Checkbox

用于“记住我”“信任此设备 30 天”。

- 视觉尺寸：`16px`
- 点击热区：至少 `44 × 44px`
- 选中状态：墨黑底、纸白勾
- 焦点状态：清晰外描边
- “信任此设备”旁提供说明入口，解释生效范围与风险

## 6. Auth Card

Auth Card 是认证流程的主容器。

### Desktop

- 推荐宽度：`420–460px`
- 最大宽度：`min(460px, calc(100vw - 64px))`
- 内边距：`40px`
- 卡片不承担大面积水墨背景；水墨属于页面视觉层

### Mobile

- 宽度：`calc(100% - 32px)`
- 最大宽度：`420px`
- 内边距：`24px 20px`
- 在较小屏幕可取消阴影，保留边框或直接融入页面

### Surface

- Light：纸白表面、低对比度边框、柔和阴影
- Dark：半透明深墨表面、细边框；确保正文对比度

## 7. Logo

- 登录页使用 Full Logo
- 小尺寸页头使用 Icon + Wordmark
- favicon 使用 Icon
- Dark 使用浅色 Logo
- 不允许重新排字、压扁、拉伸或使用普通字体重建品牌字标
- Logo 安全区：至少为图标星辰直径的 `0.5×`

## 8. Alert

类型：`info`、`success`、`warning`、`error`。

每个 Alert 必须包含：

- 状态图标
- 简短标题或主信息
- 可选说明
- 可选操作

错误信息示例：

> 用户名或密码错误，请检查后重试。

禁止仅用颜色传达状态。错误提示应位于对应字段附近，页面级错误同时出现在卡片顶部。

## 9. Divider

OAuth 分隔器结构：

```text
────────  或使用以下方式登录  ────────
```

- 文案字号：`12–13px`
- 线条使用低对比度雾灰
- 上下间距：`20–24px`

## 10. TOTP Input

### Desktop

- 6 个独立输入格
- 单格建议 `48 × 52px`
- 间距：`8px`
- 支持整段粘贴并自动分发
- 输入后自动前进，退格自动返回

### Mobile

- 单格宽度使用 `clamp(40px, 12vw, 48px)`
- 整组不得横向溢出
- 数字键盘：`inputmode="numeric"`
- 自动完成：`autocomplete="one-time-code"`

### Error

- 不只标红最后一格；整组显示错误状态
- 错误说明置于输入组下方
- 保留用户已输入内容，方便修正

## 11. Recovery Code Input

- 使用等宽字体展示恢复码
- 支持粘贴
- 默认区分大小写时必须明确说明
- 不在日志、分析事件和错误上报中记录恢复码内容

## 12. Loading

- 页面加载使用轻量旋转指示器或墨点呼吸动画
- 动画时长建议 `900–1200ms`
- 遵守 `prefers-reduced-motion`
- 文案说明当前动作，例如“正在验证身份，请稍候…”

## 13. Footer

包含：

- 版权信息
- 隐私政策
- 用户协议
- 支持与帮助
- 可选语言切换

移动端自动换行，链接点击区域不小于 `44px` 高。

## 14. Accessibility Baseline

- 正文对比度至少 `4.5:1`
- 大字号文字至少 `3:1`
- 焦点不可被移除
- 页面标题使用唯一 `h1`
- 表单错误通过 `aria-describedby` 关联
- OAuth 图标不能替代按钮文字
- 动态状态使用 `aria-live="polite"` 或 `role="alert"`
- 所有触控目标至少 `44 × 44px`
