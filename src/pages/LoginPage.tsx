import { FormEvent, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";
import { OAuthButtons } from "../components/OAuthButtons";

type LoginPageProps = {
  theme: "light" | "dark";
  onThemeChange: () => void;
};

export function LoginPage({ theme, onThemeChange }: LoginPageProps) {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <AuthShell
      theme={theme}
      onThemeChange={onThemeChange}
      eyebrow="AUTHINK · IDENTITY WITH INK"
      title="墨承身份，印证信任"
      description="以东方水墨的留白与秩序，承载企业级身份认证体验。"
    >
      <article className="authink-card authink-card--hero" aria-labelledby="login-title">
        <header className="authink-card__header">
          <span className="authink-card__seal" aria-hidden="true">印</span>
          <h2 className="authink-card__title" id="login-title">欢迎回来</h2>
          <p className="authink-card__description">使用您的账号登录以继续访问</p>
        </header>

        <form className="authink-form" onSubmit={handleSubmit}>
          <Field
            label="用户名或邮箱"
            name="username"
            type="text"
            placeholder="请输入用户名或邮箱"
            autoComplete="username"
          />
          <Field
            label="密码"
            name="password"
            type="password"
            placeholder="请输入密码"
            autoComplete="current-password"
          />

          <div className="authink-form__meta">
            <label className="authink-checkbox">
              <input className="authink-checkbox__control" type="checkbox" name="rememberMe" />
              <span>记住我</span>
            </label>
            <a className="authink-link" href="#reset-password">忘记密码？</a>
          </div>

          <button
            className="authink-button authink-button--primary authink-button--full authink-button--ink"
            type="submit"
            disabled={submitting}
          >
            {submitting ? <span className="authink-button__spinner" aria-hidden="true" /> : null}
            <span>{submitting ? "正在验证" : "登录"}</span>
          </button>

          <div className="authink-divider"><span>或使用以下方式登录</span></div>
          <OAuthButtons />
        </form>

        <div className="authink-secondary-actions">
          <span>无法登录？</span>
          <a className="authink-link" href="#support">联系管理员</a>
        </div>
      </article>
    </AuthShell>
  );
}
