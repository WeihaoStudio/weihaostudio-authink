# AuthInk Account 第一阶段表面与版式对齐实施计划

> **供执行 Agent 使用：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，严格按任务顺序执行。所有步骤使用复选框跟踪。

**目标：** 在不修改 Account 原生路由与业务行为的前提下，移除玻璃效果，并对齐 OpenDesign 的实体表面、1080px 内容轨道和大留白节奏。

**架构：** 第一阶段只修改 Account CSS 和 CSS 契约测试。使用 `.authink-account` 作用域映射 PatternFly Shell，保留 `Root.tsx`、`Header.tsx`、`PageNav.tsx`、动态菜单、Feature flag、Router、API 和表单逻辑。真实 KC26 验收后，再决定是否开启独立的 Sidebar 展示结构第二阶段。

**技术栈：** React 18、TypeScript、Keycloakify 11.15.11、PatternFly v5、Vitest、Storybook 8、CSS Custom Properties、Keycloak 26.0.0 测试环境。

---

## 文件边界

- 修改：`src/account/AccountThemeStyles.test.ts`——定义 Account 第一阶段视觉契约。
- 修改：`src/account/authink-account.css`——实现实体表面、内容轨道、间距和响应式覆盖。
- 创建：`docs/deployment/2026-07-13-account-surface-kc26.md`——记录构建 Hash、备份、部署和验收证据。
- 不修改：`src/account/root/Root.tsx`、`Header.tsx`、`PageNav.tsx` 及各业务路由组件。

## Task 1：建立会失败的 Account CSS 契约测试

**文件：**

- 修改：`src/account/AccountThemeStyles.test.ts`
- 测试：`src/account/AccountThemeStyles.test.ts`

- [ ] **Step 1：把现有玻璃效果断言替换为“禁止玻璃”断言**

将第一个测试改为：

```ts
it("uses solid Account surfaces without wallpaper or backdrop blur", () => {
    expect(css).not.toContain(".authink-account::before");
    expect(css).not.toMatch(/(?:-webkit-)?backdrop-filter\s*:/);
    expect(css).toMatch(/\.authink-account\s*\{[^}]*background:\s*var\(--color-canvas\)/s);
    expect(css).toMatch(/\.pf-v5-c-page__sidebar\s*\{[^}]*background:\s*var\(--color-surface\)/s);
    expect(css).toMatch(/\.pf-v5-c-masthead\s*\{[^}]*background:\s*var\(--color-surface\)/s);
    expect(css).toMatch(/\.pf-v5-c-card,[\s\S]*?background:\s*var\(--color-surface\)/s);
    expect(css).toMatch(/\.pf-v5-c-table\s*\{[^}]*background:\s*var\(--color-surface\)/s);
    expect(css).toMatch(/\.authink-account-theme-toggle\s*\{[^}]*background:\s*var\(--color-surface\)/s);
});
```

- [ ] **Step 2：新增内容轨道和节奏测试**

```ts
it("maps native Account sections onto the OpenDesign content track", () => {
    expect(css).toMatch(/\.pf-v5-c-page__main-container[^}]*padding:\s*clamp\(72px,\s*9vw,\s*128px\)\s+clamp\(24px,\s*7vw,\s*112px\)\s+64px/s);
    expect(css).toMatch(/\.pf-v5-c-page__main-section[^}]*max-width:\s*1080px/s);
    expect(css).toMatch(/\.pf-v5-c-page__main-section\s*\+\s*\.pf-v5-c-page__main-section[^}]*margin-top:\s*44px/s);
});
```

- [ ] **Step 3：新增主题按钮不位移测试**

```ts
it("keeps the Account theme toggle stable on hover", () => {
    const hoverRule = css.match(/\.authink-account-theme-toggle:hover\s*\{([^}]*)\}/s)?.[1] ?? "";
    expect(hoverRule).not.toContain("transform:");
});
```

- [ ] **Step 4：运行定向测试并确认失败原因正确**

运行：

```bash
pnpm vitest run src/account/AccountThemeStyles.test.ts
```

预期：测试失败，原因包括仍存在 `backdrop-filter`、实体表面不匹配、缺少 `1080px` 内容轨道和 `44px` Section 间距；不得出现 TypeScript 编译错误。

- [ ] **Step 5：提交测试红灯**

```bash
git add src/account/AccountThemeStyles.test.ts
git commit -m "test: define solid Account surface contract"
```

## Task 2：实现实体 Shell 和内容轨道

**文件：**

- 修改：`src/account/authink-account.css:21-58`
- 测试：`src/account/AccountThemeStyles.test.ts`

- [ ] **Step 1：将 Sidebar 和 Masthead 改成实体表面**

使用以下规则替换现有 Sidebar、SidebarBody 和 Masthead 对应块：

```css
.authink-account .pf-v5-c-page__sidebar {
  z-index: 3;
  width: 256px;
  border-inline-end: var(--border-thin) solid var(--color-border-subtle);
  background: var(--color-surface);
}

.authink-account .pf-v5-c-page__sidebar-body {
  padding: 32px 20px 24px;
}

.authink-account .pf-v5-c-masthead {
  z-index: 4;
  min-height: 72px;
  border-bottom: var(--border-thin) solid var(--color-border-subtle);
  background: var(--color-surface);
}
```

- [ ] **Step 2：建立 OpenDesign 内容轨道**

将 Page/Main/MainContainer 与 MainSection 规则调整为：

```css
.authink-account .pf-v5-c-page,
.authink-account .pf-v5-c-page__main {
  min-height: 100dvh;
  background: transparent;
}

.authink-account .pf-v5-c-page__main-container {
  min-height: 100dvh;
  padding: clamp(72px, 9vw, 128px) clamp(24px, 7vw, 112px) 64px;
  background: var(--color-canvas);
}

.authink-account .pf-v5-c-page__main-section {
  width: 100%;
  max-width: 1080px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.authink-account .pf-v5-c-page__main-section + .pf-v5-c-page__main-section {
  margin-top: 44px;
}
```

- [ ] **Step 3：运行定向测试**

```bash
pnpm vitest run src/account/AccountThemeStyles.test.ts
```

预期：内容轨道相关断言通过；玻璃表面测试仍可能因 Card、Table 或 Toggle 失败。

- [ ] **Step 4：提交 Shell 与内容轨道**

```bash
git add src/account/authink-account.css src/account/AccountThemeStyles.test.ts
git commit -m "style: align Account shell and content track"
```

## Task 3：移除 Card、Table 和主题按钮玻璃效果

**文件：**

- 修改：`src/account/authink-account.css:92-117`
- 修改：`src/account/authink-account.css:179-208`
- 测试：`src/account/AccountThemeStyles.test.ts`

- [ ] **Step 1：将 Card、Modal 和 Table 改成实体表面**

```css
.authink-account .pf-v5-c-card,
.authink-account .pf-v5-c-modal-box {
  border: var(--border-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.authink-account .pf-v5-c-table {
  overflow: hidden;
  border: var(--border-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
```

- [ ] **Step 2：将主题按钮改成稳定实体控件**

保留其位置、44px 尺寸、Focus 和日/夜文字逻辑，将材质和 Hover 调整为：

```css
.authink-account-theme-toggle {
  border: var(--border-thin) solid var(--color-border-strong);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-card);
  transition: background-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}

.authink-account-theme-toggle:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-muted);
}
```

不得删除原规则中的定位、尺寸、圆角、字体、Cursor 和 Focus 样式。

- [ ] **Step 3：确认 Account CSS 中彻底没有 Backdrop Filter**

```bash
rg -n "backdrop-filter|-webkit-backdrop-filter" src/account/authink-account.css
```

预期：退出码为 1，且没有输出。

- [ ] **Step 4：运行 Account 全部定向测试**

```bash
pnpm vitest run src/account/AccountThemeStyles.test.ts src/account/AccountThemeToggle.test.tsx src/account/accountThemeBranding.test.ts src/account/colorScheme.test.ts
```

预期：全部 PASS。

- [ ] **Step 5：提交实体表面修改**

```bash
git add src/account/authink-account.css src/account/AccountThemeStyles.test.ts
git commit -m "style: remove Account glass surfaces"
```

## Task 4：收敛窄屏间距并执行完整本地验证

**文件：**

- 修改：`src/account/authink-account.css:215-261`
- 测试：全部测试与构建脚本

- [ ] **Step 1：在 1024px 以下取消桌面大留白**

在现有 `@media (max-width: 1024px)` 中加入：

```css
.authink-account .pf-v5-c-page__main-container {
  padding: 72px 24px 48px;
}
```

- [ ] **Step 2：在 640px 以下收敛为移动端留白**

用以下规则替换现有只修改 MainSection 横向 Padding 的规则：

```css
.authink-account .pf-v5-c-page__main-container {
  padding: 48px 20px 40px;
}

.authink-account .pf-v5-c-page__main-section + .pf-v5-c-page__main-section {
  margin-top: 32px;
}
```

保留 Masthead 的 `min-height: 64px` 与 `padding-inline-end: 72px`。

- [ ] **Step 3：运行格式和 Diff 检查**

```bash
pnpm exec prettier src/account/authink-account.css src/account/AccountThemeStyles.test.ts --write
git diff --check
```

预期：`git diff --check` 没有输出并返回 0。

- [ ] **Step 4：运行完整测试**

```bash
pnpm test:run
```

预期：全部测试 PASS，不减少测试文件或测试数量。

- [ ] **Step 5：构建 Storybook**

```bash
pnpm build-storybook
```

预期：构建成功，不出现 Account TypeScript 或 CSS 导入错误。

- [ ] **Step 6：构建 Keycloak Theme JAR**

```bash
pnpm build-keycloak-theme
```

预期：成功生成：

```text
dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar
dist_keycloak/versioned/weihaostudio-authink-keycloak-21.0.2.jar
```

- [ ] **Step 7：验证确定性打包**

```bash
pnpm test:packaging
sha256sum dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar \
  dist_keycloak/versioned/weihaostudio-authink-keycloak-21.0.2.jar
```

预期：打包测试全部 PASS；两个版本标签 JAR 的 SHA-256 相同。

- [ ] **Step 8：提交响应式和本地验证结果**

```bash
git add src/account/authink-account.css src/account/AccountThemeStyles.test.ts
git commit -m "fix: preserve Account responsive spacing"
```

如果 Step 1–2 没有产生额外 Diff，则不创建空提交。

## Task 5：独立 Reviewer 关卡

**文件：**

- 只读：`src/account/authink-account.css`
- 只读：`src/account/AccountThemeStyles.test.ts`
- 对照：OpenDesign `account.html`、`keycloak-themes.css`

- [ ] **Step 1：要求 Reviewer 检查范围边界**

Reviewer 必须确认：

- Diff 没有修改 React、Router、动态菜单或业务组件；
- 所有新选择器均限制在 `.authink-account` 或 `.authink-account-theme-toggle`；
- 没有 Wallpaper、Glass、Blur 或 Hover 位移；
- 内容轨道和响应式覆盖不会造成 Body 横向滚动；
- 第一阶段没有伪造 Sidebar 品牌结构来冒充完整高保真。

- [ ] **Step 2：修复 Reviewer 提出的 P0/P1 问题**

每项修复都必须先补充或调整失败测试，再修改 CSS，并重新运行：

```bash
pnpm vitest run src/account/AccountThemeStyles.test.ts
pnpm test:run
pnpm build-keycloak-theme
pnpm test:packaging
```

预期：全部 PASS。

- [ ] **Step 3：提交 Reviewer 修复**

仅在存在实际修改时执行：

```bash
git add src/account/authink-account.css src/account/AccountThemeStyles.test.ts
git commit -m "fix: address Account surface review"
```

## Task 6：备份并只部署 KC26

**文件：**

- 创建：`docs/deployment/2026-07-13-account-surface-kc26.md`
- 部署源：`dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar`
- 目标容器：`keycloak-test-server-1`

- [ ] **Step 1：记录候选 JAR Hash**

```bash
sha256sum dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar
```

把完整 Hash 写入部署记录。

- [ ] **Step 2：在 Homelab 创建新的时间戳备份目录**

执行：

```bash
ssh weihao@192.168.200.10 'set -e
backup_dir="/home/weihao/docker/keycloak-theme-backups/$(date +%Y%m%d-%H%M%S)-account-surface-kc26"
mkdir -p "$backup_dir"
docker cp keycloak-test-server-1:/opt/keycloak/providers/weihaostudio-authink-keycloak-26.0.0.jar \
  "$backup_dir/weihaostudio-authink-keycloak-26.0.0.jar"
sha256sum "$backup_dir/weihaostudio-authink-keycloak-26.0.0.jar" > "$backup_dir/jar-before.sha256"
printf "%s\n" "$backup_dir" | tee /tmp/authink-account-backup-dir
'
```

预期：输出唯一的新备份目录。把该路径保存到部署记录，后续所有快照写入同一目录。

- [ ] **Step 3：记录 Realm Theme 字段**

先在远端确认测试数据库容器名称：

```bash
ssh weihao@192.168.200.10 \
  "docker ps --format '{{.Names}}' | grep -E '^keycloak-test-.*database.*-1$'"
```

预期：仅返回测试数据库容器。若名称不是 `keycloak-test-database-1`，停止并修正后续命令，不猜测容器。

确认名称后执行以下只读 SQL：

```bash
ssh weihao@192.168.200.10 'set -e
BACKUP_DIR="$(cat /tmp/authink-account-backup-dir)"
test -d "$BACKUP_DIR"
docker exec -i keycloak-test-database-1 sh -lc '\''psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -At -F "|"'\'' \
  > "$BACKUP_DIR/realm-theme-before.txt"
test "$(wc -l < "$BACKUP_DIR/realm-theme-before.txt")" -eq 2
' <<'SQL'
select name,
       coalesce(login_theme, ''),
       coalesce(account_theme, ''),
       coalesce(admin_theme, ''),
       coalesce(email_theme, '')
from realm
where name in ('master', 'WeihaoStudio')
order by name;
SQL
```

预期：命令返回 0，快照恰好包含两个 Realm。命令只读取容器已有环境变量，不输出数据库密码。

- [ ] **Step 4：复制候选 JAR 并只重启测试容器**

上传并部署：

```bash
scp dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar \
  weihao@192.168.200.10:/tmp/weihaostudio-authink-keycloak-26.0.0.jar

ssh weihao@192.168.200.10 'set -e
docker cp /tmp/weihaostudio-authink-keycloak-26.0.0.jar \
  keycloak-test-server-1:/opt/keycloak/providers/weihaostudio-authink-keycloak-26.0.0.jar
docker restart keycloak-test-server-1
'
```

不得停止或重启 `keycloak-server-1`，不得修改生产目录与生产端口。

- [ ] **Step 5：验证运行状态和日志**

```bash
ssh weihao@192.168.200.10 'set -e
for attempt in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:8180/realms/master/.well-known/openid-configuration >/dev/null; then
    break
  fi
  test "$attempt" -lt 30
  sleep 2
done
if docker logs --since 5m keycloak-test-server-1 2>&1 | \
  grep -E "ERROR|FATAL|TemplateNotFoundException|FreeMarkerException"; then
  exit 1
fi
'
```

预期：Discovery 在 60 秒内成功，且 Theme/FreeMarker 错误过滤没有输出。已知 bootstrap admin 重复用户消息单独记录，不当作 Theme 回归。

- [ ] **Step 6：核对远端 JAR Hash 与 Realm 字段未变化**

先记录本地 Hash：

```bash
local_sha="$(sha256sum dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar | awk '{print $1}')"
remote_sha="$(ssh weihao@192.168.200.10 \
  'docker exec keycloak-test-server-1 sha256sum /opt/keycloak/providers/weihaostudio-authink-keycloak-26.0.0.jar' | awk '{print $1}')"
test "$local_sha" = "$remote_sha"
```

然后在远端再次执行相同的只读 SQL，写入 `realm-theme-after.txt` 并比较：

```bash
ssh weihao@192.168.200.10 'set -e
BACKUP_DIR="$(cat /tmp/authink-account-backup-dir)"
docker exec -i keycloak-test-database-1 sh -lc '\''psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -At -F "|"'\'' \
  > "$BACKUP_DIR/realm-theme-after.txt"
cmp "$BACKUP_DIR/realm-theme-before.txt" "$BACKUP_DIR/realm-theme-after.txt"
' <<'SQL'
select name,
       coalesce(login_theme, ''),
       coalesce(account_theme, ''),
       coalesce(admin_theme, ''),
       coalesce(email_theme, '')
from realm
where name in ('master', 'WeihaoStudio')
order by name;
SQL
```

预期：本地与远端 JAR Hash 相同，`cmp` 返回 0。

## Task 7：KC26 已登录只读验收与记录

**文件：**

- 修改：`docs/deployment/2026-07-13-account-surface-kc26.md`

- [ ] **Step 1：使用现有登录会话打开 KC26 Account**

不得创建测试管理员、重置密码、绕过认证或直接改数据库。若没有有效会话，暂停浏览器验收并要求用户正常登录后继续。

- [ ] **Step 2：桌面端 1440×1024 验收**

检查并记录：

- Sidebar 宽度约 256px；
- Masthead、Sidebar、Card、Table 无模糊或壁纸；
- 内容轨道不超过 1080px；
- 主内容顶部具有明显留白；
- 标题 Section 与业务 Section 间距约 44px；
- Light/Dark 下文字、边框、卡片均可读；
- 主题按钮 Hover 不上下移动。

- [ ] **Step 3：窄屏验收**

依次检查 900px、768px、375px：

- 导航横向滚动正常；
- 页面 Body 不横向溢出；
- 主题按钮不遮挡 Masthead；
- 表单、Card、Table 不越界；
- 键盘 Tab 顺序仍能进入原生工具栏、导航和主内容。

- [ ] **Step 4：只读检查核心页面**

至少打开：

- Personal info；
- Account security / Signing in；
- Device activity；
- Applications。

只进行浏览、切换主题和键盘导航，不保存表单，不登出其他 Session，不删除关联账号。

- [ ] **Step 5：形成第一阶段结论**

部署记录必须明确写出：

- JAR Hash；
- 备份目录；
- Realm Theme 字段未变化；
- 测试与构建结果；
- 浏览器几何与截图证据；
- 第一阶段是否通过；
- 是否仍需要第二阶段 Sidebar Logo/caption/footer。

- [ ] **Step 6：提交并推送，不合并**

```bash
git add docs/deployment/2026-07-13-account-surface-kc26.md
git commit -m "docs: record KC26 Account surface acceptance"
git push origin feature/202607-authink-login
```

不得合并到主干或 Release 分支。

## 本计划完成边界

本计划完成时只允许 KC26 测试环境处于新版本。不得部署 KC21，不得修改生产容器、生产端口、生产目录或任何 Realm Theme 字段。是否推广 KC21 必须基于 KC26 已登录验收结果另行确认。

## Task 8：KC26 失败回滚

**触发条件：** Discovery 无法恢复、出现 Theme/FreeMarker 错误、远端 Hash 不匹配、Realm 字段变化，或已登录验收出现阻断性 P0 回归。

- [ ] **Step 1：从已记录的备份目录恢复旧 JAR**

```bash
ssh weihao@192.168.200.10 'set -e
BACKUP_DIR="$(cat /tmp/authink-account-backup-dir)"
test -s "$BACKUP_DIR/weihaostudio-authink-keycloak-26.0.0.jar"
docker cp "$BACKUP_DIR/weihaostudio-authink-keycloak-26.0.0.jar" \
  keycloak-test-server-1:/opt/keycloak/providers/weihaostudio-authink-keycloak-26.0.0.jar
docker restart keycloak-test-server-1
'
```

- [ ] **Step 2：验证旧服务恢复**

```bash
ssh weihao@192.168.200.10 'set -e
for attempt in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:8180/realms/master/.well-known/openid-configuration >/dev/null; then
    break
  fi
  test "$attempt" -lt 30
  sleep 2
done
BACKUP_DIR="$(cat /tmp/authink-account-backup-dir)"
expected_sha="$(awk "{print \\$1}" "$BACKUP_DIR/jar-before.sha256")"
runtime_sha="$(docker exec keycloak-test-server-1 sha256sum /opt/keycloak/providers/weihaostudio-authink-keycloak-26.0.0.jar | awk "{print \\$1}")"
test "$expected_sha" = "$runtime_sha"
'
```

预期：KC26 Discovery 恢复，运行时 JAR Hash 与 `jar-before.sha256` 一致。

- [ ] **Step 3：确认 Realm 字段无需恢复**

本计划不修改 Realm Theme 字段。比较 `realm-theme-before.txt` 和失败现场的 `realm-theme-after.txt`：若两者不同，停止自动操作并先报告具体 Diff；不得猜测或批量覆盖 Realm 字段。

- [ ] **Step 4：记录回滚证据**

在 `docs/deployment/2026-07-13-account-surface-kc26.md` 记录失败原因、回滚时间、恢复后的 Hash、Discovery 状态和未触碰 KC21 的确认信息。
