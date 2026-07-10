import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { TotpPage } from "./pages/TotpPage";

type PreviewPage = "login" | "totp";
type Theme = "light" | "dark";

function readInitialPage(): PreviewPage {
  return new URLSearchParams(window.location.search).get("page") === "totp" ? "totp" : "login";
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

  return (
    <>
      <nav className="authink-preview-nav" aria-label="原型页面切换">
        <button
          className={page === "login" ? "is-active" : ""}
          type="button"
          onClick={() => setPage("login")}
        >
          登录页
        </button>
        <button
          className={page === "totp" ? "is-active" : ""}
          type="button"
          onClick={() => setPage("totp")}
        >
          TOTP 验证
        </button>
      </nav>
      {page === "login" ? <LoginPage {...commonProps} /> : <TotpPage {...commonProps} />}
    </>
  );
}
