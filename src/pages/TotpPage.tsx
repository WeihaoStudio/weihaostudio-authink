import { FormEvent, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { TotpInput } from "../components/TotpInput";

type TotpPageProps = {
  theme: "light" | "dark";
  onThemeChange: () => void;
  actionUrl?: string;
  recoveryUrl?: string;
  loginUrl?: string;
  errorMessage?: string;
};

export function TotpPage({
  theme,
  onThemeChange,
  actionUrl,
  recoveryUrl = "/?page=recovery",
  loginUrl = "/?page=login",
  errorMessage,
}: TotpPageProps) {
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(Boolean(errorMessage));
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (code.length !== 6) {
      event.preventDefault();
      setInvalid(true);
      return;
    }
    if (actionUrl) return;
    event.preventDefault();
    setInvalid(false);
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <AuthShell
      theme={theme}
      onThemeChange={onThemeChange}
      eyebrow="AUTHINK · TRUSTED VERIFICATION"
      title="安全如静水深流"
      description="用克制而清晰的验证流程，守护每一次身份确认。"
    >
      <article className="authink-card authink-card--hero" aria-labelledby="totp-title">
        <header className="authink-card__header">
          <span className="authink-card__seal" aria-hidden="true">验</span>
          <h2 className="authink-card__title" id="totp-title">二步验证</h2>
          <p className="authink-card__description">请输入身份验证器 App 中的 6 位动态验证码</p>
        </header>

        {errorMessage ? (
          <div className="authink-alert authink-alert--error" role="alert">
            <span aria-hidden="true">!</span>
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form className="authink-form authink-totp-section" action={actionUrl} method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="otp" value={code} />
          <TotpInput
            invalid={invalid}
            onChange={value => {
              setCode(value);
              if (value.length === 6) setInvalid(false);
            }}
          />
          {invalid && !errorMessage ? (
            <p className="authink-field__error authink-totp-error" role="alert">请输入完整的 6 位动态验证码</p>
          ) : null}

          <div className="authink-trust-device">
            <label className="authink-checkbox">
              <input className="authink-checkbox__control" type="checkbox" name="trustDevice" value="on" />
              <span>信任此设备 30 天</span>
            </label>
            <button className="authink-help-trigger" type="button" aria-label="了解信任设备">?</button>
          </div>

          <button
            className="authink-button authink-button--primary authink-button--full authink-button--ink"
            type="submit"
            disabled={submitting}
          >
            {submitting ? <span className="authink-button__spinner" aria-hidden="true" /> : null}
            <span>{submitting ? "正在验证" : "验证"}</span>
          </button>
        </form>

        <div className="authink-secondary-actions">
          <a className="authink-link" href={recoveryUrl}>使用恢复码登录</a>
          <a className="authink-link" href={loginUrl}>返回登录</a>
        </div>

        <aside className="authink-help-card">
          动态验证码每 30 秒更新一次。请勿向任何人泄露验证码；勾选“信任此设备”仅适用于受信任的个人设备。
        </aside>
      </article>
    </AuthShell>
  );
}
