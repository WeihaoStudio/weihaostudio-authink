import type { PropsWithChildren, ReactNode } from "react";

type AuthShellProps = PropsWithChildren<{
  theme: "light" | "dark";
  title: string;
  description: string;
  eyebrow: string;
  footer?: ReactNode;
  onThemeChange: () => void;
}>;

export function AuthShell({
  theme,
  title,
  description,
  eyebrow,
  footer,
  onThemeChange,
  children,
}: AuthShellProps) {
  const landscape = theme === "dark" ? "/assets/ink-landscape-dark.svg" : "/assets/ink-landscape-light.svg";

  return (
    <main className="authink-page">
      <div className="authink-page__landscape" aria-hidden="true">
        <img className="authink-page__landscape-image" src={landscape} alt="" />
      </div>

      <div className="authink-layout">
        <section className="authink-layout__brand" aria-label="WeihaoStudio AuthInk 品牌区">
          <a className="authink-brand-lockup" href="/" aria-label="WeihaoStudio AuthInk 首页">
            <img src="/assets/authink-logo.svg" alt="WeihaoStudio" />
          </a>

          <div className="authink-brand-copy">
            <p className="authink-brand-copy__eyebrow">{eyebrow}</p>
            <h1 className="authink-brand-copy__title">{title}</h1>
            <p className="authink-brand-copy__description">{description}</p>
          </div>
        </section>

        <section className="authink-layout__auth" aria-label="身份验证区">
          <header className="authink-toolbar">
            <button className="authink-toolbar__control" type="button" aria-label="切换语言">
              <span aria-hidden="true">文</span>
              <span>简体中文</span>
              <span aria-hidden="true">⌄</span>
            </button>
            <button
              className="authink-toolbar__control authink-toolbar__theme"
              type="button"
              aria-label={theme === "dark" ? "切换到浅色模式" : "切换到暗色模式"}
              onClick={onThemeChange}
            >
              <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
            </button>
          </header>

          <div className="authink-auth-stage">{children}</div>

          <footer className="authink-page-footer">
            <span>© 2026 WeihaoStudio. All rights reserved.</span>
            <nav className="authink-page-footer__links" aria-label="页脚链接">
              <a className="authink-link" href="#privacy">隐私政策</a>
              <a className="authink-link" href="#terms">用户协议</a>
              <a className="authink-link" href="#support">支持与帮助</a>
            </nav>
            {footer}
          </footer>
        </section>
      </div>
    </main>
  );
}
