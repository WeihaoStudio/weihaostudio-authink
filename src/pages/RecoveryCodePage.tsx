import { FormEvent, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";

type RecoveryCodePageProps = {
  theme: "light" | "dark";
  onThemeChange: () => void;
};

export function RecoveryCodePage({ theme, onThemeChange }: RecoveryCodePageProps) {
  const [invalid, setInvalid] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const code = String(data.get("recoveryCode") ?? "").trim();
    setInvalid(code.length < 8);
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

        <form className="authink-form" onSubmit={handleSubmit}>
          <Field
            label="恢复码"
            name="recoveryCode"
            type="text"
            placeholder="输入恢复码（区分大小写）"
            autoComplete="one-time-code"
            error={invalid ? "恢复码格式不正确，请检查后重试" : undefined}
          />

          <a className="authink-link authink-inline-help" href="#recovery-help">什么是恢复码？</a>

          <button className="authink-button authink-button--primary authink-button--full authink-button--ink" type="submit">
            确认
          </button>
        </form>

        <div className="authink-secondary-actions">
          <a className="authink-link" href="/?page=totp">返回二步验证</a>
          <a className="authink-link" href="/?page=login">返回登录</a>
        </div>
      </article>
    </AuthShell>
  );
}
