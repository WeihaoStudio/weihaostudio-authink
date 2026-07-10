# AuthInk Typography

> 字体系统核心原则：不厚重、有线条感、可读优先。
> 水墨气质来自留白和层次，不依赖厚重的毛笔字体。

相关文档：[`TOKENS.md`](./TOKENS.md) · [`BRAND.md`](./BRAND.md) · [`COMPONENTS.md`](./COMPONENTS.md)

## Font Stacks

### Brand / Display（品牌 / 展示）

```css
--authink-font-brand:   "LXGW WenKai", "Noto Serif SC", serif;
--authink-font-display: "LXGW WenKai", "Noto Serif SC", serif;
```

用途：页面标题（欢迎回来、二步验证、密码重置）、品牌字标。

选择逻辑：

- **LXGW WenKai / 霞鹜文楷** - 首选，细线行书感，文气克制
- **Noto Serif SC** - 回退，开源宋体，线条现代
- 最终回退系统衬线字体

### Body（正文）

```css
--authink-font-body: Inter, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```

用途：表单、提示、按钮、UI 控件、正文。

选择逻辑：

- **Inter** - 英文首选，现代中性可读
- **Noto Sans SC** - 中文回退，开源无衬线
- **PingFang SC** - macOS 系统中文
- **Microsoft YaHei** - Windows 系统中文
- 最终回退系统无衬线

### Mono（等宽）

```css
--authink-font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

用途：恢复码、调试信息、验证码输入。

## Type Roles

| 角色 | Token | 字体 | 用途 |
|---|---|---|---|
| Brand | `--authink-font-brand` | LXGW WenKai | WeihaoStudio 品牌字标 |
| Display | `--authink-font-display` | LXGW WenKai | 页面标题 |
| Body | `--authink-font-body` | Inter | 正文、表单、UI |
| Code | `--authink-font-mono` | SF Mono | 恢复码、调试 |

### Brand 字标规则

WeihaoStudio 字标是品牌字形资产。`--authink-font-brand` 用于文字还原的回退方案，但**生产环境优先使用 Logo SVG 资产**，不可用 CSS font-family 替代品牌图形。

## Font Size Scale

| Token | rem | px (16px base) | 用途 |
|---|---|---|---|
| `--authink-font-size-xs` | 0.75rem | 12px | 输入标签、徽标 |
| `--authink-font-size-sm` | 0.8125rem | 13px | 辅助提示 |
| `--authink-font-size-md` | 0.875rem | 14px | 正文、表单 |
| `--authink-font-size-base` | 1rem | 16px | 副标题 |
| `--authink-font-size-lg` | 1.125rem | 18px | 卡片标题 |
| `--authink-font-size-xl` | 1.375rem | 22px | 区块标题 |
| `--authink-font-size-2xl` | 1.75rem | 28px | 页面主标题 |
| `--authink-font-size-3xl` | 2.25rem | 36px | 展示标题 |

字号阶基于 14px（`md`）正文基准，标题向上递增，辅助向下递减。

## Font Weight

| Token | 值 | 用途 |
|---|---|---|
| `--authink-font-weight-regular` | 400 | 正文、提示 |
| `--authink-font-weight-medium` | 500 | 副标题、标签、按钮 |
| `--authink-font-weight-semibold` | 600 | 卡片标题 |

> 避免使用 700+ 超粗字重，与水墨克制气质冲突。标题采用较轻字重（400-500）。

## Line Height

| Token | 值 | 用途 |
|---|---|---|
| `--authink-line-height-tight` | 1.25 | 标题 |
| `--authink-line-height-normal` | 1.5 | 正文 |
| `--authink-line-height-relaxed` | 1.7 | 长文本说明 |

## Letter Spacing

| 用途 | 字间距 |
|---|---|
| 展示标题 | -0.02em（收紧） |
| 正文 | 0（默认） |
| 全大写标签 | 0.05em（放松） |

## Font Loading Strategy

### 基础可用（零外部依赖）

不加载任何外部字体，仅使用系统字体栈。此时：

- 英文：system-ui / Inter（如已安装）
- 中文：PingFang SC / Microsoft YaHei
- 页面保持基础可读性

### 增强体验（可选）

按需加载 Web 字体：

1. **LXGW WenKai / 霞鹜文楷** - 水墨手写感，品牌 / 展示标题首选
2. **Noto Serif SC** - 标题衬线回退
3. **Inter** - 英文无衬线
4. **Noto Sans SC** - 中文无衬线

加载建议：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

> Keycloak Theme 环境可能无法访问外部 CDN，因此基础可用性不依赖外部字体。
> 外部字体作为渐进增强，加载失败时回退到系统字体栈。

## Usage

```css
.page-title {
  font-family: var(--authink-font-display);
  font-size: var(--authink-font-size-2xl);
  font-weight: var(--authink-font-weight-medium);
  line-height: var(--authink-line-height-tight);
  letter-spacing: -0.02em;
  color: var(--authink-color-text);
}

.form-label {
  font-family: var(--authink-font-body);
  font-size: var(--authink-font-size-xs);
  font-weight: var(--authink-font-weight-medium);
  line-height: var(--authink-line-height-normal);
  color: var(--authink-color-text-muted);
}
```
