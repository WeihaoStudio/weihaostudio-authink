import { FormEvent, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";

type ResetPasswordPageProps = {
  theme: "light" | "dark";
  onThemeChange: () => void;
};

export function ResetPasswordPage({ theme, onThemeChange }: ResetPasswordPageProps) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <AuthShell
      theme={theme}
      onThemeChange={onThemeChange}
      eyebrow="AUTHINK · ACCOUNT RECOVERY"
      title="循墨迹，归账户"
      description="通过安全、清晰的恢复流程，重新建立对账户的访问。"
    >
      <article className="authink-card authink-card--hero" aria-labelledby="reset-title">
        {sent ? (
          <div className="authink-result" role="status">
            <span className="authink-result__icon authink-result__icon--success" aria-hidden="true">✓</span>
            <h2 className="authink-card__title" id="reset-title">邮件已发送</h2>
            <p className="authink-card__description">
              我们已向您的邮箱发送密码重置链接，请在有效期内完成操作。
            </p>
            <a className="authink-button authink-button--secondary authink-button--full" href="/?page=login">
              返回登录
            </a>
          </div>
        ) : (
          <>
            <header className="authink-card__header">
              <span className="authink-card__seal" aria-hidden="true">复</span>
              <h2 className="authink-card__title" id="reset-title">重置密码</h2>
              <p className="authink-card__description">
                输入您的邮箱，我们将发送一封密码重置邮件。
              </p>
            </header>

            <form className="authink-form" onSubmit={handleSubmit}>
              <Field
                label="邮箱"
                name="email"
                type="email"
                placeholder="请输入您的邮箱"
                autoComplete="email"
              />
              <button className="authink-button authink-button--primary authink-button--full authink-button--ink" type="submit">
                发送重置链接
              </button>
            </form>

            <div className="authink-secondary-actions">
              <a className="authink-link" href="/?page=login">返回登录</a>
            </div>
          </>
        )}
      </article>
    </AuthShell>
  );
}
