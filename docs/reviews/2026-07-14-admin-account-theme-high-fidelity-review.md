# WeihaoStudio AuthInk AdminUI / Account Theme 高保真 Review 与验收门禁

> 文档日期：2026-07-14
> 文档状态：**Review 已完成，整改待实施**
> 适用分支：`feature/202607-authink-login`
> 适用环境：KC26 测试环境优先；KC21 生产环境仅在全部门禁通过后考虑推广
> 本文用途：后续实施计划、Reviewer 复验、KC26 发布验收与 KC21 推广门禁

## 1. 文档约束

本文件只固化本轮 Review 的结论、修改意见与验收标准，不代表相关问题已经修复。

当前执行约束：

- 采用**最小可回滚**方式实施；
- 每个阶段使用独立提交，禁止把功能修复、视觉重构和环境发布混为一个提交；
- 允许后续提交、推送和部署，但**禁止合并**，除非用户另行确认；
- KC26 是候选验证环境，Reviewer 和用户确认前不得推广到 KC21；
- Account 功能闭环是视觉改造的前置条件；
- 运行态、构建产物和 Keycloak 实际资源状态优先于静态文档或页面标题。

---

## 2. 评审范围与高保真基准

### 2.1 被评审实现

仓库：

```text
/home/weihao/agent-workspaces/WeihaoStudio/keycloak-themes/weihaostudio-authink-worktree/feature-202607-authink-login
```

主要范围：

```text
src/admin/**
src/account/**
src/login/components/InkLoading*
src/login/authink.tokens.css
```

### 2.2 OpenDesign 高保真基准

OpenDesign 项目：

```text
Project: a83b455e-bb6c-4108-aadd-18a9a50a6ca4
Conversation: 151fd9b0-6a8e-43b6-a103-651f4bd5316f
```

基准文件：

```text
/home/weihao/tools/open-design/.od/projects/a83b455e-bb6c-4108-aadd-18a9a50a6ca4/ui_kits/app/admin-ui.html
/home/weihao/tools/open-design/.od/projects/a83b455e-bb6c-4108-aadd-18a9a50a6ca4/ui_kits/app/account.html
/home/weihao/tools/open-design/.od/projects/a83b455e-bb6c-4108-aadd-18a9a50a6ca4/ui_kits/app/keycloak-themes.css
```

评审期间 OpenDesign MCP 曾返回 `Transport closed`，但 OpenDesign daemon、项目文件和 HTTP 预览服务正常。本轮直接使用同一项目的本地制品渲染作为高保真基准，因此不影响基准真实性。

### 2.3 Review 证据

证据目录：

```text
/home/weihao/agent-workspaces/WeihaoStudio/review-artifacts/authink-admin-account-20260714/
```

| 文件 | 说明 |
|---|---|
| `opendesign-admin-light.png` | OpenDesign AdminUI 浅色高保真 |
| `opendesign-admin-dark.png` | OpenDesign AdminUI 深色高保真 |
| `opendesign-account-light.png` | OpenDesign Account 浅色高保真 |
| `opendesign-account-dark.png` | OpenDesign Account 深色高保真 |
| `current-admin-light-simulated.png` | 当前 Admin 候选 CSS 注入 KC26 PatternFly DOM 后的浅色模拟，不代表已部署 |
| `current-admin-dark-simulated.png` | 当前 Admin 候选 CSS 注入 KC26 PatternFly DOM 后的深色模拟，不代表已部署 |
| `kc26-account-runtime-stuck.png` | KC26 Account 实际运行态无限加载证据 |

> 说明：证据截图位于仓库外的稳定本地目录，本文件不复制二进制资源，避免扩大当前文档提交范围。

---

## 3. 总体结论

### 3.1 评分与判定

| Theme | 高保真还原度 | 生产可用度 | 判定 |
|---|---:|---:|---|
| AdminUI 候选 | 42/100 | 55/100 | **Fail**：可作为技术底座，不能通过视觉验收 |
| Account Theme | 18/100 | 10/100 | **Fail**：存在运行阻断，不具备测试或生产可用条件 |

### 3.2 当前门禁状态

```text
AdminUI 高保真：Fail
AdminUI 功能底座：Partial
Account 高保真：Fail
Account 运行可用：Fail

允许部署完整候选到 KC26：否
允许推广到 KC21：否
```

### 3.3 核心判断

1. **Account 当前首先是运行问题，不是纯视觉问题。** KC26 与 KC21 均停留在初始化 Loading，必须先修复 OIDC / Provider bootstrap。
2. **Admin 当前是 PatternFly 默认组件树加 AuthInk CSS 换肤。** 技术底座可继续使用，但仅靠 CSS 无法还原 OpenDesign 的信息架构和操作层级。
3. **Admin 浅色 Masthead 存在白字白底。** 这是可访问性和可操作性阻断，优先级高于视觉润色。
4. **实际 Account Loading 没有展示设计好的 InkLoading。** 当前看到的是 Provider 内置 PatternFly Spinner，导致居中、节奏和水墨细节要求均未生效。
5. **Admin Theme Toggle 的 Portal 方案应保留。** OpenDesign 静态稿中的右上角 fixed 定位会与用户头像、用户信息和顶部操作重叠，设计稿应跟随已验证实现更新。

---

## 4. P0：必须先解决的阻断问题

## 4.1 P0-1：Account 在 KC26、KC21 无限加载

### 现象

实测入口：

```text
KC26: http://192.168.200.10:8180/realms/WeihaoStudio/account/
KC21: http://192.168.200.10:8080/realms/WeihaoStudio/account/
```

两套环境均只显示主题按钮和加载图形，等待超过 8 秒仍未进入 Account 页面。

网络侧已观察到：

- OIDC `.well-known/openid-configuration` 已加载；
- Account 静态资源已加载；
- 尚未继续发起 Account REST 业务数据请求。

因此当前卡点更可能位于：

```text
oidcEarlyInit
  -> KcAccountUiLoader
  -> KeycloakProvider bootstrap
  -> 尚未进入 Root 路由和账户业务请求
```

### 代码证据

```text
src/account/KcPage.tsx:21-39
src/account/KcAccountUi.tsx:24-46
```

当前风险点：

- `oidcEarlyInit()` 返回不加载时直接 `return null`，没有可观察错误态；
- i18n 初始化未完成时直接 `return null`；
- `KeycloakProvider` bootstrap 的等待、失败和重试状态没有在 AuthInk 外壳中显式呈现；
- 页面没有超时错误界面，用户无法区分“仍在加载”与“已经失败”。

### 必须修改

1. 为 `oidcEarlyInit`、`KcAccountUiLoader`、i18n 初始化和 `KeycloakProvider` bootstrap 增加结构化状态与错误日志；
2. 核对 `account-console` 客户端的：
   - Valid Redirect URIs；
   - Web Origins；
   - DPoP 兼容性；
   - Session Restoration；
   - KC26/KC21 版本差异；
3. 正常网络下 10 秒仍未完成初始化时，切换到明确的错误页，不能无限 Spinner；
4. 错误页至少提供：
   - 重试；
   - 返回登录；
   - 重新认证；
   - 可供排障的非敏感错误标识；
5. 在 Account 功能闭环前，禁止继续扩大纯视觉改造范围。

### 最小回滚边界

首个修复提交只允许修改 Account bootstrap、错误边界和对应测试，不同时重构 Account Shell 或 PersonalInfo。

---

## 4.2 P0-2：实际 Account Loading 未居中，且没有使用 InkLoading

### 实际 DOM

```html
<div class="authink-account">
  <button class="authink-account-theme-toggle">昼</button>
  <svg class="pf-v5-c-spinner ..."></svg>
</div>
```

当前样式主要命中：

```css
.authink-account-loading
```

因此 Provider 内部产生的 `.pf-v5-c-spinner` 不受 `authink-account-loading` 的居中布局控制。

### 相关文件

```text
src/account/AccountLoading.tsx
src/account/authink-account.css
src/account/KcAccountUi.tsx
src/account/KcPage.tsx
```

`AccountLoading` 已设置：

```tsx
<InkLoading size={72} speed={0.75} label="账户中心加载中" />
```

`speed={0.75}` 对应的水墨周期本身已经足够慢。当前体验差的主要原因不是动画仍然太快，而是实际运行态没有进入该 InkLoading 路径。

### 必须修改

必须统一处理三类状态：

1. `KcAccountUiLoader` 页面级 Loading；
2. `KeycloakProvider` bootstrap Loading；
3. 超时或初始化失败错误态。

不得只为 `.pf-v5-c-spinner` 增加视觉补丁后声称完成；目标是让页面级加载状态真正使用可识别、可访问的 InkLoading。

### 可测量要求

- 页面级 Loading 在可视视口内水平、垂直居中，视觉中心偏差不超过 4px；
- Theme Toggle 不参与 Loading 居中计算；
- 水墨圆环完整显示，不裁切、不缩放跳变、不旋转整张图片；
- 一个完整 draw / hold / dry 周期应足以辨识笔触细节，建议总周期保持在约 7–12 秒；
- 干涸阶段沿顺时针方向逐渐变淡再消失，不得整圈瞬间淡出；
- `prefers-reduced-motion` 下提供静态或低运动降级；
- Loading 使用 `role="status"` 或等价语义，并提供可本地化的 `aria-live` 文本。

---

## 4.3 P0-3：Admin 浅色 Masthead 白字白底

### 现象

当前候选样式将 Masthead 背景映射为浅色 Surface：

```css
.authink-admin .pf-v5-c-masthead {
  background: var(--color-surface);
}
```

实测计算样式：

```text
Masthead background: #FFFEFB
用户菜单文字: #FFFFFF
Plain button/icon: #F0F0F0
```

结果是用户名、Help、下拉箭头和部分顶部操作在浅色主题下不可读。

### 代码证据

```text
src/admin/index.css:62-69
```

### 必须修改

1. 不得只映射 `--pf-v5-global-*` 全局变量；
2. 显式覆盖 Masthead 内部 Button、MenuToggle、Dropdown、Toolbar 的组件级 Token；
3. 覆盖并测试：
   - default；
   - hover；
   - active；
   - focus-visible；
   - expanded；
   - disabled；
4. 文本对比度达到 WCAG AA；非文本控件与焦点边界达到至少 3:1；
5. 深色主题不得因浅色修复发生回归。

### 最小回滚边界

该修复应作为独立提交，仅修 Masthead 可访问性和对应测试，不混入 Users 页面结构重构。

---

## 5. P1：AdminUI 高保真改造意见

## 5.1 当前差距

当前实现本质上仍是：

```text
Keycloak / PatternFly 默认组件树
+ AuthInk Token
+ CSS 换肤
```

这可以保留 Keycloak 原生管理能力，但无法仅靠 CSS 高保真还原以下结构：

- Realm Selector 进入顶部 Masthead；
- Eyebrow + 文楷 Display Title；
- Primary Action 与 Secondary Toolbar 分层；
- 更高识别度的当前导航；
- OpenDesign 中的 Table / Card 信息层级；
- 页面标题、说明、数量、筛选和主操作之间的节奏。

## 5.2 第一轮试点范围：仅 Users 页面

建议优先改造：

```text
src/admin/user/UsersSection.tsx
src/admin/components/users/UserDataTable.tsx
src/admin/components/users/UserDataTableToolbarItems.tsx
src/admin/PageHeader.tsx
src/admin/PageNav.tsx
```

实施要求：

1. 不删除或隐藏 Keycloak 原生管理能力；
2. “添加用户”作为当前页面唯一 Primary Action；
3. 删除、刷新、高级搜索、分页作为 Secondary Toolbar；
4. 桌面端 Realm Selector 进入 Masthead；
5. 移动端保留 Sidebar / Drawer 回退；
6. 先完成 Users 页闭环，不批量改造 Clients、Realm Settings 等页面；
7. 组件树调整优先于使用大范围 CSS 选择器强行模拟结构。

## 5.3 Admin 视觉方向

OpenDesign 最新版本存在极弱壁纸与 Blur，而当前实现曾明确采用实色 Surface。为兼顾品牌感、可读性和 PatternFly 管理场景，实施时采用以下折中上限：

```text
背景壁纸 opacity <= 0.12
主 Canvas overlay >= 0.90
Sidebar / Masthead / Table 接近实色
```

禁止复制 Login 页面“10% 不透明表单”的策略到 Admin。

Admin 应优先满足：

- 专业、稳定、信息密度清晰；
- 弱装饰，强层级；
- 实色可操作区域；
- 克制的阴影、圆角和 Blur；
- 表格与批量操作状态清晰。

## 5.4 Theme Toggle

当前 Portal 方案方向正确：

```text
src/admin/AdminThemeToggle.tsx
```

按钮进入：

```text
.pf-v5-c-masthead .pf-v5-c-toolbar__content-section
```

必须保留该策略，原因是固定在视口右上角会与用户头像、用户信息、Help 和顶部导航操作重叠。

需要补充：

- 删除 Theme Toggle 上无功能价值的 `transform: translateY(-1px)`；
- 确保切换按钮在 1440、1024、390 三种宽度下都位于正常 Toolbar 流中；
- OpenDesign 静态稿应更新为 Toolbar 内定位，不能要求实现退回 fixed；
- `aria-label`、当前主题状态和键盘焦点必须准确。

---

## 6. P1：Account Theme 高保真改造意见

## 6.1 当前结构与高保真差距

当前结构：

```tsx
<Page header={<Header />} sidebar={<PageNav />}>
  <Outlet />
</Page>
```

相关文件：

```text
src/account/root/Root.tsx
src/account/root/Header.tsx
src/account/root/PageNav.tsx
src/account/components/page/Page.tsx
src/account/personal-info/PersonalInfo.tsx
```

OpenDesign 高保真目标：

- 完整品牌 Sidebar；
- 桌面端不再使用横跨页面的独立 Masthead；
- Eyebrow + 大号“账户中心”标题系统；
- 个人资料与恢复方式双列 Card；
- 顶层体验围绕“个人资料、账号安全、可信设备”组织。

## 6.2 建议实施方式

1. 在 P0 功能闭环后，自定义 Account Shell；
2. Logo 和“账户中心”品牌信息移入 Sidebar；
3. 桌面端移除或降级独立 Masthead，移动端保留必要工具栏；
4. 改造 `Page.tsx` 标题系统，统一 Eyebrow、标题、说明和页面操作；
5. 第一轮仅高保真改造 `PersonalInfo`；
6. 其他 Account 页面保留 PatternFly 功能底座，避免一次性重写；
7. 恢复方式卡片第一阶段只作为导航入口，不复制或伪造复杂认证状态。

## 6.3 导航重组原则

不能为了匹配静态稿直接删除 Keycloak 功能。建议重组为：

```text
个人资料

账号安全
- 登录方式
- 关联账号
- 恢复方式

可信设备
- 设备活动

更多
- 应用
- 群组
- 组织
- 资源
```

未启用或当前 Realm 不支持的功能可以隐藏，但必须由 Keycloak feature/config 决定，不能通过静态主题代码永久删除。

---

## 7. P2：维护性与设计系统一致性

P2 不阻塞 P0 功能修复，但应在高保真试点稳定后完成。

1. **同步 OpenDesign Theme Toggle 位置**
   将 AdminUI 静态稿中的 fixed 主题按钮更新为 Masthead Toolbar 内定位，消除设计与实现漂移。

2. **统一组件级 Token**
   减少依赖宽泛 DOM 选择器，优先建立 Masthead、Sidebar、Page Header、Table、Card、Form 的语义 Token 映射。

3. **统一 Loading 规范**
   Login、Account 和未来 Admin 异步状态共用同一 InkLoading 核心，但允许按场景提供 `page / section / inline` 尺寸与文案。

4. **补充真实运行 Story / Fixture**
   Storybook 场景应固定壁纸定位、Viewport 和容器尺寸；不得因 Story wrapper 差异导致背景位置或 Loading 中心不一致。

5. **清理过时说明**
   文档、注释和静态验证文件不得继续声明已 PASS 的旧行为；以当前代码、构建产物和 KC26 运行证据为准。

6. **建立视觉基线**
   保存 1440、1024、390 三档，light/dark 两种主题的基准截图，并将 Reviewer 差异记录到同一 Review 文档或后续复验文档。

---

## 8. 非目标与禁止事项

本轮整改不得采用以下方式：

- 不得在 Account 无限加载未修复时先扩大视觉重构；
- 不得用隐藏 Spinner、缩短超时或静态占位掩盖 bootstrap 失败；
- 不得只给 Provider Spinner 加 CSS 后声称 InkLoading 已接入；
- 不得为追求静态稿而删除 Keycloak 原生管理或账户功能；
- 不得将 Login 的高透明玻璃卡片直接复制到 Admin；
- 不得在 Admin 大面积使用壁纸、Blur、强阴影和过度圆角；
- 不得将 Admin Theme Toggle 固定在视口右上角；
- 不得一次性重构全部 Admin / Account 页面；
- 不得在 KC26 Reviewer Gate 未通过前部署到 KC21；
- 不得合并分支，除非用户明确授权。

---

## 9. 最小风险实施顺序

| 阶段 | 目标 | 修改范围 | 完成门禁 |
|---|---|---|---|
| 阶段 0 | Account 功能闭环 | Bootstrap、错误边界、Loading、运行测试 | KC26 正常进入 Account；失败态可诊断 |
| 阶段 1 | Admin 浅色可访问性修复 | Masthead 组件 Token 与状态测试 | 浅/深色均满足对比度，无功能回归 |
| 阶段 2 | Admin Users 高保真试点 | Users、PageHeader、PageNav、Toolbar | Users 页 Reviewer 视觉与功能验收通过 |
| 阶段 3 | Account PersonalInfo 高保真试点 | Account Shell、Page、PersonalInfo | PersonalInfo 功能与视觉验收通过 |
| 阶段 4 | 响应式、可访问性、视觉回归 | 1440/1024/390、light/dark | 自动化和人工 Checklist 全部通过 |
| 阶段 5 | KC26 候选部署 | 两个匹配版本制品中的 KC26 候选 | Runtime Smoke + Reviewer + 用户确认 |
| 阶段 6 | KC21 推广评估 | 仅使用已验收提交和 KC21 匹配制品 | 用户明确授权后才执行 |

每个阶段要求：

1. 独立提交；
2. 提交说明包含变更范围、风险和回滚方式；
3. 构建与测试证据可复查；
4. 不跨阶段提前声明完成；
5. Reviewer 未通过时只在当前阶段整改，不推进下一环境。

---

## 10. 测试现状与缺口

### 10.1 已有结果

评审时已运行：

```text
8 个测试文件
35 个测试通过
```

已有覆盖主要包括：

- Token / 选择器存在；
- Theme Toggle 切换 `data-theme`；
- Loading wrapper CSS；
- 品牌 Logo。

### 10.2 尚未覆盖

- Admin 浅色 Masthead 白字白底；
- Account bootstrap 无限加载；
- 实际 Provider Spinner 与 InkLoading 的切换；
- 高保真组件树；
- 1440 / 1024 / 390 响应式；
- InkLoading draw / hold / dry 关键帧；
- KC26 真实 Realm、真实会话和实际路由；
- KC21 版本兼容性。

### 10.3 必须新增的验证

- KC26 Runtime Smoke Test；
- Account 正常网络下 10 秒内离开 Loading；
- bootstrap 失败、会话失效和网络错误用例；
- Admin Masthead 各交互状态的 computed-style / 截图测试；
- 1440、1024、390，light/dark 截图；
- Masthead、Sidebar、Table、Modal、PersonalInfo 视觉回归；
- Loading draw、hold、dry 三帧采样；
- `prefers-reduced-motion`；
- 主题 JAR 内容与未引用资源排除检查。

---

## 11. 验收标准 Checklist

以下 Checklist 是“完成”的必要条件，不得只根据单元测试或单张截图判定通过。

### 11.1 功能验收

- [ ] KC26 Account 正常网络下 10 秒内离开页面级 Loading；
- [ ] Account 初始化失败后显示错误页，不无限加载；
- [ ] 错误页提供重试、返回登录或重新认证；
- [ ] Account 个人资料可读取、编辑、保存和取消；
- [ ] Account 登录方式、关联账号、设备活动及其他启用路由可访问；
- [ ] Admin 用户新增、编辑、删除、搜索、刷新和分页正常；
- [ ] Admin Realm Selector、用户菜单、Help 和 Theme Toggle 正常；
- [ ] Session Expiration Warning 正常；
- [ ] 浏览器控制台无未处理 Promise rejection；
- [ ] 服务端无新增 FreeMarker、资源 404 或主题加载异常。

### 11.2 AdminUI 视觉验收

- [ ] Shell、Sidebar、Masthead、Page Header 和内容区层级与 OpenDesign 方向一致；
- [ ] Users 页具有 Eyebrow、Display Title、说明和清晰的 Primary Action；
- [ ] “添加用户”是唯一 Primary Action；
- [ ] Secondary Toolbar 不与主操作争夺视觉权重；
- [ ] 浅色 Masthead 不存在白字白底或低对比度图标；
- [ ] 深色 Masthead、Sidebar、Table、Modal 无回归；
- [ ] Theme Toggle 位于 Masthead Toolbar 正常布局流中；
- [ ] Theme Toggle 不与头像、用户信息、Help、菜单或标题重叠；
- [ ] Admin 背景壁纸不超过 `0.12`，主内容 Overlay 不低于 `0.90`；
- [ ] Sidebar、Masthead、Table 保持接近实色；
- [ ] 不出现 Login 风格的高透明玻璃化管理界面；
- [ ] Reviewer 高保真评分达到 85/100 或 Reviewer 明确给出 Pass。

### 11.3 Account 视觉验收

- [ ] 桌面端具有完整品牌 Sidebar；
- [ ] Logo 与“账户中心”品牌信息进入 Sidebar；
- [ ] 桌面端不再出现与高保真冲突的横跨页面 Masthead；
- [ ] 移动端保留可操作的顶部工具栏或 Drawer 入口；
- [ ] 页面标题使用统一的 Eyebrow、标题和说明系统；
- [ ] PersonalInfo 形成个人资料与恢复方式双列布局；
- [ ] 恢复方式入口不展示伪造或无法验证的认证状态；
- [ ] 导航重组后不丢失 Realm 已启用的 Keycloak 功能；
- [ ] 浅色和深色均无不可读内容；
- [ ] Reviewer 高保真评分达到 85/100 或 Reviewer 明确给出 Pass。

### 11.4 InkLoading 验收

- [ ] Account 页面级 Loading 实际使用 InkLoading，而不是裸露 PatternFly Spinner；
- [ ] Loading 水平、垂直居中，视觉中心偏差不超过 4px；
- [ ] Loading 不被 Theme Toggle、Header 或容器 Padding 推离中心；
- [ ] 水墨笔触完整、清晰、不裁切；
- [ ] 动画无整图旋转、无跳帧、无割裂；
- [ ] draw 阶段沿顺时针逐渐显现；
- [ ] hold 阶段足以辨识完整笔触；
- [ ] dry 阶段沿顺时针先变淡再逐渐消失；
- [ ] 完整周期约 7–12 秒，实际观看可辨识笔触细节；
- [ ] `prefers-reduced-motion` 下有合理降级；
- [ ] Loading 具备 `role="status"` 或等价语义；
- [ ] Loading 文案可本地化且不会被屏幕阅读器重复轰炸。

### 11.5 响应式验收

- [ ] 1440px 桌面布局通过；
- [ ] 1024px 窄桌面/平板横屏布局通过；
- [ ] 390px 移动布局通过；
- [ ] 导航、用户菜单和 Theme Toggle 不溢出、不重叠；
- [ ] Table 在窄屏下仍可查看关键字段并执行主要操作；
- [ ] Sidebar / Drawer 切换无布局闪烁；
- [ ] Modal 不超出视口；
- [ ] 交互目标最小尺寸达到 44×44px，或提供等效可操作区域。

### 11.6 可访问性验收

- [ ] 普通文本对比度达到 WCAG AA 4.5:1；
- [ ] 大文本对比度达到至少 3:1；
- [ ] 图标、边界和非文本控件达到至少 3:1；
- [ ] 所有可交互控件具有可见 `focus-visible`；
- [ ] Theme Toggle 具有准确的 `aria-label` 和状态语义；
- [ ] Sidebar、Drawer、Menu、Modal 可全键盘操作；
- [ ] 页面标题层级正确且无跳级；
- [ ] Loading 和错误态可被辅助技术理解；
- [ ] 颜色不是表达状态的唯一方式。

### 11.7 工程与发布验收

- [ ] 单元测试全部通过；
- [ ] TypeScript 检查通过；
- [ ] 前端生产构建通过；
- [ ] Storybook 构建通过；
- [ ] Keycloakify 主题打包通过；
- [ ] KC21、KC26 两个匹配版本 JAR 均可构建；
- [ ] JAR 仅包含运行所需资源，未引用原始图片不进入制品；
- [ ] 4K 原图保留在仓库参考目录但不进入 JAR；
- [ ] KC26 Runtime Smoke Test 通过；
- [ ] KC26 浅色/深色、1440/1024/390 截图齐全；
- [ ] Reviewer 高保真验收通过；
- [ ] 用户确认通过；
- [ ] 回滚步骤已验证；
- [ ] 用户明确授权后，才允许推广到 KC21；
- [ ] 用户明确授权前，不合并当前分支。

---

## 12. Reviewer 复验输出格式

Reviewer 每个阶段必须给出明确结论，不接受只有描述、没有判定的输出。

```text
阶段：
环境与版本：
代码提交：
构建制品：

功能：Pass / Partial / Fail
高保真：Pass / Partial / Fail
响应式：Pass / Partial / Fail
可访问性：Pass / Partial / Fail
运行稳定性：Pass / Partial / Fail

阻断问题：
非阻断问题：
证据路径：
回滚点：
是否允许进入下一阶段：是 / 否
是否允许推广 KC21：是 / 否
```

若结论为 `Partial`，必须列出未满足的具体 Checklist 项，不能按“基本完成”处理。

---

## 13. 最终结论

当前 AdminUI 与 Account Theme 均未达到高保真和生产可用门禁：

- AdminUI 可以保留现有 PatternFly 技术底座，但必须先修复浅色 Masthead 可访问性，再以 Users 页面为试点进行组件树级高保真改造；
- Account 必须先解决 KC26/KC21 初始化无限加载，并让真实运行态使用居中的 InkLoading，再推进 Account Shell 和 PersonalInfo 高保真；
- Theme Toggle 以当前实现的 Masthead Toolbar Portal 方案为准，OpenDesign 静态稿需同步；
- 所有变更必须先在 KC26 通过 Runtime Smoke、Reviewer 和用户验收；
- **在上述门禁全部通过前，不允许推广 KC21，也不允许合并。**
