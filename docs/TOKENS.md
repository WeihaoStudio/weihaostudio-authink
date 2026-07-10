# AuthInk Design Tokens

> 本文件是 `src/theme/tokens.css` 的人工可读参考。
> 实现以 CSS 文件为准，本文档与之保持同步。

## Architecture

AuthInk token 采用两层架构：

1. **Primitive** - 原始色阶和基础值，不直接用于组件
2. **Semantic** - 语义化映射，组件只消费 semantic token

```text
Primitive (--authink-ink-900, --authink-paper-100, ...)
    │
    ▼
Semantic (--authink-color-text, --authink-color-page, ...)
    │
    ▼
Component (.authink-button { color: var(--authink-color-text) })
```

## Theme Switching

通过 `data-theme` 属性手动切换，同时支持 `prefers-color-scheme` 自动跟随：

```css
:root { color-scheme: light; /* default light */ }
:root[data-theme="dark"] { color-scheme: dark; /* override */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { /* auto dark */ }
}
```

```html
<html data-theme="dark">  <!-- 强制暗色 -->
<html>                     <!-- 跟随系统 -->
```

## Primitive - Ink（墨色阶）

| Token | 值 | 用途 |
|---|---|---|
| `--authink-ink-950` | `#090909` | 最深墨色 |
| `--authink-ink-900` | `#111111` | 主文字 / 主按钮 |
| `--authink-ink-800` | `#242424` | 深色表面 |
| `--authink-ink-700` | `#3d3d3d` | 强调文字 |
| `--authink-ink-600` | `#565651` | 辅助文字 |
| `--authink-ink-500` | `#72726b` | 次要文字 |
| `--authink-ink-400` | `#96958d` | 强边框 |
| `--authink-ink-300` | `#b9b7ae` | 分割线 |
| `--authink-ink-200` | `#d8d5cc` | 普通边框 |
| `--authink-ink-100` | `#e8e6df` | 雾色 |
| `--authink-ink-50` | `#f3f1ec` | 最浅墨色 |

## Primitive - Paper（宣纸色阶）

| Token | 值 | 用途 |
|---|---|---|
| `--authink-paper-0` | `#ffffff` | 纯白 |
| `--authink-paper-50` | `#fcfbf8` | 最浅宣纸 |
| `--authink-paper-100` | `#faf9f6` | 页面底色 |
| `--authink-paper-200` | `#f5f3ee` | 次级表面 |
| `--authink-paper-300` | `#efede7` | 静默表面 |

## Primitive - Seal（印章红色阶）

| Token | 值 | 用途 |
|---|---|---|
| `--authink-seal-700` | `#8f241d` | 深印章红 |
| `--authink-seal-600` | `#a72d24` | 印章红 |
| `--authink-seal-500` | `#c0392b` | 标准印章红 |
| `--authink-seal-400` | `#d45548` | 亮印章红（暗色模式） |
| `--authink-seal-100` | `#f7e4e1` | 印章红底色 |

## Semantic - Status（状态色）

| Token | 700 | 600 | 100 |
|---|---|---|---|
| `--authink-success-*` | `#246b47` | `#2f855a` | `#e4f3e9` |
| `--authink-warning-*` | `#8a5a14` | `#b7791f` | `#faf0d8` |
| `--authink-error-*` | `#9b2424` | `#c53030` | `#f9e1e1` |
| `--authink-info-*` | `#315f78` | `#3f7896` | `#e3eff5` |

> `600` 用于文字 / 图标，`100` 用于底色，`700` 用于深色模式文字。

## Semantic - Colors（语义色彩）

### Light（默认）

| Token | 值 | 来源 |
|---|---|---|
| `--authink-color-page` | `var(--authink-paper-100)` | 页面底色 |
| `--authink-color-surface` | `rgb(255 255 255 / 0.94)` | 卡片面 |
| `--authink-color-surface-muted` | `var(--authink-paper-200)` | 静默表面 |
| `--authink-color-text` | `var(--authink-ink-900)` | 主文字 |
| `--authink-color-text-muted` | `var(--authink-ink-600)` | 辅助文字 |
| `--authink-color-text-subtle` | `var(--authink-ink-500)` | 次要文字 |
| `--authink-color-border` | `var(--authink-ink-200)` | 普通边框 |
| `--authink-color-border-strong` | `var(--authink-ink-400)` | 强边框 |
| `--authink-color-primary` | `var(--authink-ink-900)` | 主按钮背景 |
| `--authink-color-on-primary` | `var(--authink-paper-0)` | 主按钮文字 |
| `--authink-color-focus` | `var(--authink-ink-700)` | Focus 描边 |
| `--authink-color-link` | `var(--authink-ink-800)` | 链接 |
| `--authink-color-seal` | `var(--authink-seal-500)` | 印章红 |
| `--authink-color-overlay` | `rgb(17 17 17 / 0.44)` | 遮罩 |
| `--authink-shadow-surface` | `var(--authink-shadow-card)` | 表面阴影 |

### Dark

| Token | 值 |
|---|---|
| `--authink-color-page` | `#090a0c` |
| `--authink-color-surface` | `rgb(21 22 25 / 0.90)` |
| `--authink-color-surface-muted` | `#1b1c20` |
| `--authink-color-text` | `#f5f5f0` |
| `--authink-color-text-muted` | `#c4c4bc` |
| `--authink-color-text-subtle` | `#9b9b94` |
| `--authink-color-border` | `#34353a` |
| `--authink-color-border-strong` | `#55565c` |
| `--authink-color-primary` | `#f5f5f0` |
| `--authink-color-on-primary` | `#111214` |
| `--authink-color-focus` | `#dddcd5` |
| `--authink-color-link` | `#f0efe9` |
| `--authink-color-seal` | `#d45548` |
| `--authink-color-overlay` | `rgb(0 0 0 / 0.62)` |
| `--authink-shadow-surface` | `var(--authink-shadow-dark-card)` |

> 详细色彩语义见 [COLORS.md](COLORS.md)。

## Typography

```css
--authink-font-brand:   "LXGW WenKai", "Noto Serif SC", serif;
--authink-font-display: "LXGW WenKai", "Noto Serif SC", serif;
--authink-font-body:    Inter, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
--authink-font-mono:    "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

| Token | 用途 |
|---|---|
| `--authink-font-brand` | WeihaoStudio 品牌字标（Logo 资产优先） |
| `--authink-font-display` | 页面标题（欢迎回来、二步验证） |
| `--authink-font-body` | 正文、表单、UI 控件 |
| `--authink-font-mono` | 恢复码、调试信息 |

> 详细字体系统见 [TYPOGRAPHY.md](TYPOGRAPHY.md)。

## Font Size

| Token | rem | px (16px base) |
|---|---|---|
| `--authink-font-size-xs` | 0.75rem | 12px |
| `--authink-font-size-sm` | 0.8125rem | 13px |
| `--authink-font-size-md` | 0.875rem | 14px |
| `--authink-font-size-base` | 1rem | 16px |
| `--authink-font-size-lg` | 1.125rem | 18px |
| `--authink-font-size-xl` | 1.375rem | 22px |
| `--authink-font-size-2xl` | 1.75rem | 28px |
| `--authink-font-size-3xl` | 2.25rem | 36px |

## Line Height & Font Weight

```css
--authink-line-height-tight:   1.25;
--authink-line-height-normal:  1.5;
--authink-line-height-relaxed: 1.7;

--authink-font-weight-regular:  400;
--authink-font-weight-medium:   500;
--authink-font-weight-semibold: 600;
```

## Spacing

基于 4px 基准（0.25rem），rem 单位：

| Token | rem | px |
|---|---|---|
| `--authink-space-0` | 0 | 0 |
| `--authink-space-1` | 0.25rem | 4px |
| `--authink-space-2` | 0.5rem | 8px |
| `--authink-space-3` | 0.75rem | 12px |
| `--authink-space-4` | 1rem | 16px |
| `--authink-space-5` | 1.25rem | 20px |
| `--authink-space-6` | 1.5rem | 24px |
| `--authink-space-8` | 2rem | 32px |
| `--authink-space-10` | 2.5rem | 40px |
| `--authink-space-12` | 3rem | 48px |
| `--authink-space-16` | 4rem | 64px |
| `--authink-space-20` | 5rem | 80px |
| `--authink-space-24` | 6rem | 96px |

## Radius

| Token | rem | px |
|---|---|---|
| `--authink-radius-xs` | 0.25rem | 4px |
| `--authink-radius-sm` | 0.375rem | 6px |
| `--authink-radius-md` | 0.5rem | 8px |
| `--authink-radius-lg` | 0.75rem | 12px |
| `--authink-radius-xl` | 1rem | 16px |
| `--authink-radius-2xl` | 1.5rem | 24px |
| `--authink-radius-full` | 9999px | — |

## Border

```css
--authink-border-width:  1px;
--authink-focus-width:   2px;
--authink-focus-offset:  2px;
```

## Shadow

| Token | 值 |
|---|---|
| `--authink-shadow-xs` | `0 1px 2px rgb(17 17 17 / 0.04)` |
| `--authink-shadow-sm` | `0 4px 16px rgb(17 17 17 / 0.06)` |
| `--authink-shadow-card` | `0 18px 60px rgb(17 17 17 / 0.10)` |
| `--authink-shadow-dark-card` | `0 24px 80px rgb(0 0 0 / 0.35)` |

## Motion

```css
--authink-duration-fast:    120ms;
--authink-duration-normal:  200ms;
--authink-duration-slow:    360ms;

--authink-ease-standard:    cubic-bezier(0.2, 0, 0, 1);
--authink-ease-emphasized:  cubic-bezier(0.2, 0.8, 0.2, 1);
```

> `prefers-reduced-motion: reduce` 时，所有 duration 降为 `0.01ms`。

## Layout

| Token | 值 | 用途 |
|---|---|---|
| `--authink-content-max` | `100rem` | 内容最大宽度 |
| `--authink-card-width` | `28rem` | 登录卡片宽度 |
| `--authink-page-gutter` | `clamp(1rem, 4vw, 5rem)` | 页面边距 |
| `--authink-control-height` | `2.75rem` | 控件高度（桌面） |
| `--authink-control-height-mobile` | `3rem` | 控件高度（移动） |
| `--authink-touch-target` | `2.75rem` | 最小触控目标 |

> 移动端（`max-width: 47.9375rem`）自动将 `--authink-page-gutter` 收为 `1rem`，`--authink-control-height` 切换为 mobile 值。

## Usage

```css
.authink-card {
  background: var(--authink-color-surface);
  border: 1px solid var(--authink-color-border);
  border-radius: var(--authink-radius-2xl);
  padding: var(--authink-space-8);
  box-shadow: var(--authink-shadow-surface);
  color: var(--authink-color-text);
  font-family: var(--authink-font-body);
  transition: border-color var(--authink-duration-normal) var(--authink-ease-standard);
}
```
