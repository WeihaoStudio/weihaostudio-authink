# AuthInk Color System

> 水墨体系的色彩哲学：少色彩、低饱和、强留白。
> 以墨黑、宣纸白、淡墨灰为骨架，印章红为唯一暖色点睛。

相关文档：[`TOKENS.md`](./TOKENS.md) · [`BRAND.md`](./BRAND.md)

## Color Philosophy

AuthInk 不使用高饱和色彩。所有颜色经过降饱和处理，确保：

- 长时间阅读不疲劳
- 暗色模式与浅色模式气质统一
- 氛围辅助认证任务，不喧宾夺主

## Two-Layer Architecture

```text
Primitive（原始色阶）          Semantic（语义映射）
--authink-ink-900  #111111  →  --authink-color-text       主文字
--authink-paper-100 #faf9f6 →  --authink-color-page       页面底色
--authink-seal-500 #c0392b  →  --authink-color-seal       印章红
```

组件**只消费 semantic token**，不直接引用 primitive。这样换肤时只需改 semantic 映射，组件代码不变。

## Primitive Palettes

### Ink（墨色阶）

从最深到最浅的 11 级灰阶，带极淡暖调：

| Step | 值 | 角色 |
|---|---|---|
| 950 | `#090909` | 最深背景 |
| 900 | `#111111` | 主文字 / 主按钮 |
| 800 | `#242424` | 深色表面 |
| 700 | `#3d3d3d` | 强调文字 |
| 600 | `#565651` | 辅助文字 |
| 500 | `#72726b` | 次要文字 |
| 400 | `#96958d` | 强边框 |
| 300 | `#b9b7ae` | 分割线 |
| 200 | `#d8d5cc` | 普通边框 |
| 100 | `#e8e6df` | 雾色 |
| 50 | `#f3f1ec` | 最浅墨色 |

### Paper（宣纸色阶）

偏暖的白纸色系：

| Step | 值 | 角色 |
|---|---|---|
| 0 | `#ffffff` | 纯白 |
| 50 | `#fcfbf8` | 最浅宣纸 |
| 100 | `#faf9f6` | 页面底色 |
| 200 | `#f5f3ee` | 次级表面 |
| 300 | `#efede7` | 静默表面 |

### Seal（印章红色阶）

来自书画落款印章，整个体系**唯一的暖色**：

| Step | 值 | 角色 |
|---|---|---|
| 700 | `#8f241d` | 深印章红 |
| 600 | `#a72d24` | 印章红 |
| 500 | `#c0392b` | 标准印章红（浅色模式） |
| 400 | `#d45548` | 亮印章红（暗色模式） |
| 100 | `#f7e4e1` | 印章红底色 |

## Status Colors（状态色）

四组语义状态色，每组三个层级：

| 状态 | 700（深色文字） | 600（文字 / 图标） | 100（底色） |
|---|---|---|---|
| Success | `#246b47` | `#2f855a` | `#e4f3e9` |
| Warning | `#8a5a14` | `#b7791f` | `#faf0d8` |
| Error | `#9b2424` | `#c53030` | `#f9e1e1` |
| Info | `#315f78` | `#3f7896` | `#e3eff5` |

使用规则：

- `600` 用于文字和图标
- `100` 用于背景底色
- `700` 用于暗色模式下的文字

## Semantic Colors

### Light（默认）

| Token | 值 | 用途 |
|---|---|---|
| `--authink-color-page` | `#faf9f6` | 页面底色 |
| `--authink-color-surface` | `rgb(255 255 255 / 0.94)` | 卡片面 |
| `--authink-color-surface-muted` | `#f5f3ee` | 静默表面 |
| `--authink-color-text` | `#111111` | 主文字 |
| `--authink-color-text-muted` | `#565651` | 辅助文字 |
| `--authink-color-text-subtle` | `#72726b` | 次要文字 |
| `--authink-color-border` | `#d8d5cc` | 普通边框 |
| `--authink-color-border-strong` | `#96958d` | 强边框 |
| `--authink-color-primary` | `#111111` | 主按钮背景 |
| `--authink-color-on-primary` | `#ffffff` | 主按钮文字 |
| `--authink-color-focus` | `#3d3d3d` | Focus 描边 |
| `--authink-color-link` | `#242424` | 链接 |
| `--authink-color-seal` | `#c0392b` | 印章红 |
| `--authink-color-overlay` | `rgb(17 17 17 / 0.44)` | 遮罩 |

### Dark

| Token | 值 | 用途 |
|---|---|---|
| `--authink-color-page` | `#090a0c` | 页面底色 |
| `--authink-color-surface` | `rgb(21 22 25 / 0.90)` | 卡片面 |
| `--authink-color-surface-muted` | `#1b1c20` | 静默表面 |
| `--authink-color-text` | `#f5f5f0` | 主文字 |
| `--authink-color-text-muted` | `#c4c4bc` | 辅助文字 |
| `--authink-color-text-subtle` | `#9b9b94` | 次要文字 |
| `--authink-color-border` | `#34353a` | 普通边框 |
| `--authink-color-border-strong` | `#55565c` | 强边框 |
| `--authink-color-primary` | `#f5f5f0` | 主按钮背景（反转） |
| `--authink-color-on-primary` | `#111214` | 主按钮文字（反转） |
| `--authink-color-focus` | `#dddcd5` | Focus 描边 |
| `--authink-color-link` | `#f0efe9` | 链接 |
| `--authink-color-seal` | `#d45548` | 印章红（提亮） |
| `--authink-color-overlay` | `rgb(0 0 0 / 0.62)` | 遮罩 |

暗色模式不是简单反转：primary 反转（墨黑 → 纸白），seal 提亮（`#c0392b` → `#d45548`），surface 保持半透明。

## Color Usage Rules

### 应该

- 页面大面积使用 `page` + `surface`，保持留白
- 文字层次靠 `text` → `text-muted` → `text-subtle` 三级区分
- `seal` 红只用于品牌点睛和错误状态，不大面积使用
- 状态色遵循 `600` 文字 + `100` 底色的组合

### 禁止

- 使用高饱和度纯色（如 `#FF0000`、`#0000FF`）
- 大面积使用 seal 红
- 在浅色模式使用纯黑 `#000` 作为文字色
- 在深色模式使用纯白 `#fff` 作为文字色
- 组件直接引用 primitive token（应通过 semantic 间接引用）
- 引入超出 palette 的额外颜色

## Accessibility

目标：正文达到 WCAG AA（4.5:1），大字达到 AAA（7:1）。

| 组合 | 浅色对比度 | 深色对比度 | 标准 |
|---|---|---|---|
| text on page | ~14.8:1 | ~17.0:1 | AAA |
| text on surface | ~15.5:1 | ~16.0:1 | AAA |
| text-muted on page | ~7.2:1 | ~9.5:1 | AAA |
| text-subtle on page | ~5.0:1 | ~7.0:1 | AA |
| seal on page | ~5.9:1 | ~4.7:1 | AA |
| on-primary on primary | ~20:1 | ~16:1 | AAA |

> 对比度值为近似值，最终需在真实渲染环境中用工具验证。
