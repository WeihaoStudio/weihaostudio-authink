# AuthInk Account 表面与版式对齐设计

**日期：** 2026-07-13
**状态：** 已依据“按最小风险顺序继续完成剩余 Theme”的指令确认方向
**范围：** 仅调整 Account Theme 的视觉呈现

## 1. 问题说明

当前 Account Theme 已使用 AuthInk Token，桌面端侧栏也采用约 256px 的正确方向，但整体仍像半透明控制台，没有形成 OpenDesign `account.html` 所体现的克制纸面感和大留白工作区。

主要差距：

1. Masthead、卡片和主题切换按钮仍使用 `backdrop-filter` 与透明混合表面。
2. 主内容距离 Masthead 太近，缺少 OpenDesign 的标题与内容节奏。
3. 内容宽度依赖 PatternFly 默认布局，没有明确的 1080px 阅读轨道。
4. 导航、表格和卡片虽已换色，但仍缺少一致的实体表面层级。
5. OpenDesign 把品牌、caption 和底部说明放在左侧 Aside；当前实现仍把品牌放在全宽 Masthead。

## 2. 目标

- 移除 Account Masthead、侧栏、卡片、表格和主题切换按钮的玻璃与模糊效果。
- 对齐 OpenDesign 的 `max-width: 1080px` 内容轨道、顶部大留白和标题/内容间距。
- 保留所有原生 Account 路由、表单动作、API、菜单、键盘交互和响应式行为。
- 将改动拆为独立、可回滚的低风险阶段。
- 先在 KC26 验收，未通过前不推广到 KC21。

## 3. 非目标

- 本阶段不重写 Account Router 或根 Shell。
- 不把 Login 壁纸或 Login 玻璃表单引入 Account。
- 不用自定义 React 组件替换 PatternFly/Keycloak Account 业务组件。
- 不为视觉验收修改账号、密码、Realm 或用户数据。
- 不在同一阶段扩展 Admin 或 Email Theme。

## 4. 方案比较

### 方案 A：仅用 CSS 对齐表面和间距——第一阶段采用

保留 Keycloakify Account 的现有 DOM，只在 `.authink-account` 作用域下调整样式。

**优点**

- 回滚面和版本兼容风险最低。
- 不影响 KC26/KC21 原生业务行为。
- 可通过 CSS 契约测试和真实浏览器几何进行验证。

**限制**

- 因原生路由 DOM 仍是权威结构，不能仅靠 CSS 完整复制 OpenDesign 的 Aside 构图。

### 方案 B：替换 Account 根 Shell

围绕原生 Route Outlet 重建 Masthead、Sidebar 和内容壳层。

**本轮拒绝：** 会扩大焦点管理、响应式、路由和跨版本兼容风险。

### 方案 C：轻量补充 Sidebar 展示结构——第二阶段候选

在 KC26 第一阶段验收后，仅在 `PageNav.tsx` 补充 Logo、caption 和 footer，并隐藏 Masthead 中重复的品牌视觉。

**约束：** 不修改动态菜单、Feature flag、导航、Referrer、Router 或 API；必须单独设计、测试和部署。

## 5. 第一阶段视觉设计

### 5.1 Shell

- Canvas 使用 `var(--color-canvas)`。
- 桌面侧栏维持 256px，使用不透明 `var(--color-surface)` 和轻量分隔线。
- Masthead 使用不透明 `var(--color-surface)` 与底部分隔线，不使用 Blur。
- Account 中禁止壁纸、伪壁纸和 Backdrop Filter。

### 5.2 主工作区

- 桌面主内容使用接近 OpenDesign 的间距：顶部 `clamp(72px, 9vw, 128px)`，水平流式留白，底部 64px。
- 内容宽度上限为 1080px，保持左对齐阅读轨道。
- 保留原生标题语义，仅调整字体和间距。
- 标题 Section 与业务 Section 之间保持稳定的 44px 节奏。

### 5.3 导航

- Hover 使用 `var(--color-surface-muted)`。
- Current 状态使用实体表面、AuthInk 文字颜色、Semibold 权重和既有卡片阴影。
- 不使用玻璃、发光或上下移动动画。
- 窄屏继续使用原生横向可滚动导航。

### 5.4 卡片、表格和控件

- 卡片和 Modal 使用不透明 `var(--color-surface)`、细边框、`var(--radius-lg)` 和 `var(--shadow-card)`。
- 表格使用相同实体层级，表头使用 `var(--color-surface-subtle)`。
- 输入框和按钮保留现有 Token 映射及原生语义。
- 主题切换按钮改为不透明紧凑控件，Hover 不发生位移。

### 5.5 日间和夜间主题

- 两个主题共用相同结构与 Token 名称。
- 夜间主题不能通过透明度重新制造玻璃效果。
- 对比度只依赖 canonical surface、border 和 text Token。

## 6. 实现边界

第一阶段预计只修改：

- `src/account/authink-account.css`
- `src/account/AccountThemeStyles.test.ts`

除非真实 KC26 DOM 证明 CSS 无法安全实现，否则不修改 React 文件。任何 JSX 改动必须进入独立的第二阶段设计。

## 7. 测试要求

CSS 契约测试必须先失败，再验证：

1. Account CSS 不存在 `backdrop-filter` 或 `-webkit-backdrop-filter`。
2. Masthead、Sidebar、卡片、表格和主题切换按钮使用不透明 canonical surface。
3. 主工作区存在 1080px 内容宽度上限。
4. 桌面端具有更大的顶部留白和 44px Section 节奏。
5. Current 导航仍为实体表面和 Semibold。
6. 响应式横向导航规则仍存在。
7. Account 规则保持在 `.authink-account` 或专用 Toggle 类作用域内。

现有路由、品牌、主题切换、构建、Storybook 和打包测试必须继续通过。

## 8. 验收与发布

### 本地关卡

- Account 定向测试。
- 完整 `pnpm test:run`。
- `pnpm build-storybook`。
- `pnpm build-keycloak-theme`。
- `pnpm test:packaging`。
- 独立 Reviewer 对照 OpenDesign 审查 Diff。

### KC26 关卡

- 备份当前 JAR，并记录全部 Realm Theme 字段。
- 只部署到 `keycloak-test-server-1`。
- 使用已有登录会话进行只读走查。
- 至少检查个人资料、账号安全、设备活动、应用、日/夜切换、键盘焦点和响应式布局。
- 不为验收重置凭据或修改用户/Realm 数据。

### 推广

KC26 证据未确认前不修改 KC21。推广时必须复用同一个已验证 JAR Hash，并创建独立回滚备份。

## 9. 回滚

第一阶段可以独立回滚：

1. Revert Account CSS 对齐提交并重新构建；或
2. 在 KC26 恢复部署前的时间戳 JAR。

Account Theme 已被选中，因此本阶段不应改变 Realm Theme 字段。
