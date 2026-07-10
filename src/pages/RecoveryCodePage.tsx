import { FormEvent, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";

type RecoveryCodePageProps = {
  theme: "light" | "dark";
  onThemeChange: () => void;
  actionUrl?: string;
  totpUrl?: string;
  loginUrl?: string;
  errorMessage?: string;
};

export function RecoveryCodePage({
  theme,
  onThemeChange,
  actionUrl,
  totpUrl = "/?page=totp",
  loginUrl = "/?page=login",
  errorMessage,
}: RecoveryCodePageProps) {
  const [invalid, setInvalid] = useState(Boolean(errorMessage));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const code = String(data.get("recoveryCode") ?? "").trim();
    if (code.length < 8) {
      event.preventDefault();
      setInvalid(true);
      return;
    }
    if (!actionUrl) event.preventDefault();
  }

  return (
    <AuthShell
      theme={theme}
      onThemeChange={onThemeChange}
      eyebrow="AUTHINK · RECOVERY ACCESS"
      title="以备用凭证，重返账户"
      description="当身份验证器不可用时，恢复码提供一次性的安全访问路径。"
    >
      <article className="authink-card authink-card--hero" aria-labelledby="recovery-title">
        <header className="authink-card__header">
          <span className="authink-card__seal" aria-hidden="true">备</span>
          <h2 className="authink-card__title" id="recovery-title">使用恢复码登录</h2>
          <p className="authink-card__description">
            请输入启用二步验证时保存的恢复码。恢复码通常只能使用一次。
          </p>
        </header>

        {errorMessage ? (
          <div className="authink-alert authink-alert--error" role="alert">
            <span aria-hidden="true">!</span>
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form className="authink-form" action={actionUrl} method="post" onSubmit={handleSubmit}>
          <Field
            label="恢复码"
            name="recoveryCode"
            type="text"
            placeholder="输入恢复码（区分大小写）"
            autoComplete="one-time-code"
            error={invalid && !errorMessage ? "恢复码格式不正确，请检查后重试" : undefined}
          />

          <a className="authink-link authink-inline-help" href="#recovery-help">什么是恢复码？</a>

          <button className="authink-button authink-button--primary authink-button--full authink-button--ink" type="submit">
            确认
          </button>
        </form>

        <div className="authink-secondary-actions">
          <a className="authink-link" href={totpUrl}>返回二步验证</a>
          <a className="authink-link" href={loginUrl}>返回登录</a>
        </div>
      </article>
    </AuthShell>
  );
}
