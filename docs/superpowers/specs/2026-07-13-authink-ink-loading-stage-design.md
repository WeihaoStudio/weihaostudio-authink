# AuthInk InkLoading 居中加载阶段设计

**日期：** 2026-07-13  
**状态：** 待用户审阅  
**范围：** Login 与 Login OTP/TOTP 的提交中视觉状态；不改 Account、Admin、Email 主题；不改 Keycloak 表单协议或部署配置。

## 背景与问题

当前提交态把 `InkLoading`（20px）与“正在验证…”文本一起放进 44px 登录按钮的 inline-flex 内容组。浏览器实测中，动画中心相对按钮中心左偏 44px；它在视觉上没有居中。20px 同时不足以呈现水墨笔触、飞白、颗粒及顺时针干涸细节。

实现还使用 `easeOutCubic` 揭示曲线，进度在名义绘制时长的前半段已完成约 87.5%，所以即使总时长增加，主观感受仍然偏快。

OpenDesign 的基准是：固定位置、无旋转、顺时针绘制、短暂停留、顺时针由浅至消失的连续 Canvas 动画。

## 目标

1. 登录与 OTP 提交后，水墨动画在**独立、固定尺寸、真正居中的区域**展示。
2. 动画尺寸足以看清笔触细节，采用 **64px** 作为桌面与移动端的基准尺寸。
3. 动画保留 OpenDesign 语义：不旋转；顺时针绘制 → 短暂停留 → 顺时针变浅后消失 → 短暂停顿。
4. 把绘制曲线改为非前置爆发的平滑曲线，使“绘制过程”可被观察。
5. 保留 Keycloak 原生提交字段、POST `action`、禁用防重复提交和屏幕阅读器状态通知。
6. 变更可在单个 JAR 回滚；不修改 realm 的主题选择、不变更数据库。

## 非目标

- 不重做 InkLoading 原始素材。
- 不把动画塞回 44px 按钮，避免再次牺牲可读性。
- 不改 Login 以外的 Theme 的整体视觉；Admin/Account 的保真度问题保留为独立评审后的后续工作。
- 不修改生产账号、密码、realm 或 Keycloak 服务配置。

## 方案选择

采用“**独立加载阶段**”（用户已口头确认）：

- 表单提交后，保持原表单容器尺寸与背景，隐藏按钮的常规可见内容；在提交操作区替换为 `AuthInkSubmitLoading`。
- 加载阶段为一个居中 column：64px Canvas + `正在验证身份…` 文本。
- 加载阶段带 `role="status"`、`aria-live="polite"` 与文本说明；装饰 Canvas 不重复发声。
- `prefers-reduced-motion: reduce` 下不运行循环绘制，显示静态完整水墨环与相同状态文本。
- 仅调整 Login 和 OTP/TOTP 的提交显示分支；仍由原始 `<form action={url.loginAction}>` 提交，状态只用于原生导航发生前的短暂反馈。

## 动画参数

| 阶段 | 当前 | 目标 | 说明 |
| --- | ---: | ---: | --- |
| 绘制 | 2800ms + `easeOutCubic` | 3000ms + 对称缓入缓出 | 避免 50% 时间已完成 87.5% 图形的前置爆发 |
| 停留 | 500ms | 600ms | 给完整笔触一次可读停留 |
| 干涸 | 3600ms | 3600ms | 保留逐段变淡再消失的细节 |
| 间隔 | 280ms | 280ms | 保持循环边界克制 |

建议绘制曲线为连续的 `easeInOutCubic`（或等价校准函数），并在单元测试中验证采用的函数与阶段参数，避免未来回退为前置爆发曲线。

## 结构与接口

新增可复用的 `AuthInkSubmitLoading`（命名可在实现时根据项目约定调整）：

```tsx
<AuthInkSubmitLoading
  message="正在验证身份…"
  size={64}
  ariaLabel="正在验证身份，请稍候"
/>
```

职责：
- 只负责提交中的呈现与无障碍状态；
- 内部使用已有 `InkLoading`；
- 不承担表单逻辑、不拦截 Keycloak 提交；
- 容器通过 grid/flex 的单元素居中，而非与文案组成一组后再 `justify-content:center`。

影响文件预期：
- `src/login/components/InkLoading/inkLoadingCore.ts`：曲线和时序常量。
- `src/login/components/InkLoading/InkLoading.tsx`、`inkLoading.css`：支持静态降级（若现有能力不足）。
- `src/login/components/AuthInkSubmitLoading/*`：新增可复用加载阶段与测试。
- `src/login/Login.tsx`、`LoginOtp.tsx`：提交态替换。
- `src/login/authink.css`：加载阶段布局、主题色与 reduced-motion 样式。
- `src/login/Login.test.tsx`、`LoginOtp.test.tsx`：更新为加载阶段契约；新增核心/组件测试。
- 对应 Storybook 场景：默认、提交中、深色、窄屏与 reduced-motion。

## 验收标准

### 自动化

- Login 与 OTP 测试在提交后断言：
  - 原生表单的 `action` 与字段不变；
  - 提交控件仍禁用并有 `aria-busy="true"`；
  - 独立加载阶段存在、含状态文本；
  - `InkLoading` 尺寸为 64px，且不承担独立朗读；
  - reduced-motion 为静态替代。
- Ink 核心测试：目标时序、绘制曲线不是 `easeOutCubic` 前置揭示。
- `pnpm test:run`、`pnpm build-storybook`、`pnpm build-keycloak-theme`、`pnpm test:packaging` 均通过。

### 浏览器验收（KC26 先行）

- 在提交瞬间，Canvas 的几何中心与加载区中心重合；不可再出现当前按钮中心左偏 44px 的情况。
- 64px 下可辨识水墨环的粗细、飞白与干涸段。
- 不出现旋转；绘制与干涸均顺时针。
- 在浅色、深色、登录及 OTP 页面视觉一致；窄屏不溢出。
- 验收失败可通过恢复前一份 JAR 完成回滚，无 realm 配置变化。

## 风险与回滚

风险仅限登录提交前 UI 反馈；Keycloak POST 协议和 JAR 的 Theme ID 不变。若测试或 KC26 浏览器验收出现布局、提交或无障碍回归：停止推进 KC21，恢复当前部署 JAR，并以 Git 的本次独立提交回退。
