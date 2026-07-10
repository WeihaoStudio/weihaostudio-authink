# AuthInk 高保真无损还原规范

本文定义 WeihaoStudio AuthInk 从设计稿到前端实现的视觉一致性合同。

## 1. 基准画布

| 场景 | 设计基准 | 验证视口 |
|---|---:|---:|
| 4K 桌面 | 3840 × 2160 | Playwright `desktop-4k` |
| 标准桌面 | 1440 × 900 | Playwright `desktop-1440` |
| 移动端 | iPhone 14 Pro | Playwright `mobile` |

桌面端必须使用真实双栏网页布局，不允许将移动端卡片简单拉宽。

## 2. 无损资产策略

- Logo、月相、山水背景优先使用 SVG。
- SVG 使用 `viewBox` 与 `preserveAspectRatio`，避免任意拉伸。
- 位图仅用于无法矢量化的墨色纹理，并至少提供 2× 资源。
- 不允许把完整页面截图作为前端背景替代真实组件。
- 品牌 Logo 不使用普通字体临摹替代最终字标；正式接入时应替换 `public/assets/authink-logo.svg` 中的字标为已确认原始矢量资产。

## 3. 布局还原合同

### Desktop

- 视觉区约占 62%，认证区约占 38%。
- 认证卡片最大宽度 480px。
- 页面高度使用 `100dvh`，在超宽屏上保持内容中心和安全留白。
- 浅色与暗色版共享尺寸与组件结构，仅通过语义 Token 切换。

### Mobile

- 移动端重新排版，不缩放桌面端。
- 顶部保留品牌标识，隐藏大段品牌说明。
- 卡片占满可用宽度，左右安全边距 16px。
- 控件高度至少 48px，触控目标至少 44px。

## 4. 字体合同

- Display：细线条文楷 / 现代宋体气质，字重 400。
- Body：高可读无衬线字体。
- 不使用厚重、块状、过度装饰的毛笔字体承载功能文案。
- 正式生产环境应自托管授权字体，避免第三方字体网络抖动影响视觉回归。

## 5. 视觉差异阈值

视觉快照测试默认阈值：

```ts
maxDiffPixelRatio: 0.002
```

超过阈值必须人工确认，禁止为了通过测试而扩大阈值。

## 6. 状态覆盖

以下页面与状态必须拥有独立快照或布局测试：

- 登录：light / dark / mobile
- OAuth：Google / GitHub
- 加载中
- 登录错误
- 重置密码
- 密码重置成功
- TOTP：light / dark / mobile
- TOTP 验证码错误
- 恢复码登录
- 信任此设备：未勾选 / 已勾选 / 已过期

## 7. 当前实现

- `public/assets/authink-logo.svg`：可缩放品牌锁定图。
- `public/assets/ink-landscape-light.svg`：浅色水墨山水背景。
- `public/assets/ink-landscape-dark.svg`：暗色月夜水墨背景。
- `src/pages/LoginPage.tsx`：登录页面。
- `src/pages/TotpPage.tsx`：TOTP 页面。
- `tests/smoke.spec.ts`：CI 布局与文案合同。
- `tests/visual.spec.ts`：4K / 桌面 / 移动视觉快照入口。

## 8. 基准图生成

首次生成基准：

```bash
npm install
npx playwright install chromium
npm run test:visual:update
```

基准图经设计确认后提交。后续执行：

```bash
npm run test:visual
```

任何视觉变更都必须附带原因和更新前后对比。
