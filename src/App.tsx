import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { TotpPage } from "./pages/TotpPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { RecoveryCodePage } from "./pages/RecoveryCodePage";
import { InfoPage } from "./pages/InfoPage";

type PreviewPage = "login" | "login-error" | "totp" | "reset" | "recovery" | "success";
type Theme = "light" | "dark";

const supportedPages = new Set<PreviewPage>([
  "login",
  "login-error",
  "totp",
  "reset",
  "recovery",
  "success",
]);

function readInitialPage(): PreviewPage {
  const requested = new URLSearchParams(window.location.search).get("page") as PreviewPage | null;
  return requested && supportedPages.has(requested) ? requested : "login";
}

function readInitialTheme(): Theme {
  return new URLSearchParams(window.location.search).get("theme") === "dark" ? "dark" : "light";
}

export function App() {
  const [page, setPage] = useState<PreviewPage>(readInitialPage);
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    url.searchParams.set("theme", theme);
    window.history.replaceState({}, "", url);
  }, [page, theme]);

  const commonProps = {
    theme,
    onThemeChange: () => setTheme(current => (current === "light" ? "dark" : "light")),
  } as const;

  let content;
  switch (page) {
    case "login-error":
      content = <LoginPage {...commonProps} username="user@example.com" errorMessage="用户名或密码错误，请重试。" />;
      break;
    case "totp":
      content = <TotpPage {...commonProps} />;
      break;
    case "reset":
      content = <ResetPasswordPage {...commonProps} />;
      break;
    case "recovery":
      content = <RecoveryCodePage {...commonProps} />;
      break;
    case "success":
      content = (
        <InfoPage
          {...commonProps}
          tone="success"
          title="身份验证成功"
          description="您的身份已经确认，正在安全返回应用。"
          actionLabel="返回登录预览"
        />
      );
      break;
    default:
      content = <LoginPage {...commonProps} />;
  }

  const tabs: Array<{ page: PreviewPage; label: string }> = [
    { page: "login", label: "登录" },
    { page: "login-error", label: "错误" },
    { page: "totp", label: "TOTP" },
    { page: "reset", label: "重置" },
    { page: "recovery", label: "恢复码" },
  ];

  return (
    <>
      <nav className="authink-preview-nav" aria-label="原型页面切换">
        {tabs.map(tab => (
          <button
            className={page === tab.page ? "is-active" : ""}
            type="button"
            onClick={() => setPage(tab.page)}
            key={tab.page}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {content}
    </>
  );
}
