import { AuthShell } from "../components/AuthShell";

type InfoPageProps = {
  theme: "light" | "dark";
  onThemeChange: () => void;
  tone?: "success" | "error" | "info";
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function InfoPage({
  theme,
  onThemeChange,
  tone = "info",
  title = "操作已完成",
  description = "您的身份认证流程已经完成。",
  actionLabel = "返回登录",
  actionHref = "/?page=login",
}: InfoPageProps) {
  const icon = tone === "success" ? "✓" : tone === "error" ? "!" : "i";

  return (
    <AuthShell
      theme={theme}
      onThemeChange={onThemeChange}
      eyebrow="AUTHINK · STATUS"
      title="每一次回应，都清晰可信"
      description="用明确的状态和下一步操作，减少身份认证中的不确定感。"
    >
      <article className="authink-card authink-card--hero authink-result" aria-labelledby="info-title">
        <span className={`authink-result__icon authink-result__icon--${tone}`} aria-hidden="true">{icon}</span>
        <h2 className="authink-card__title" id="info-title">{title}</h2>
        <p className="authink-card__description">{description}</p>
        <a className="authink-button authink-button--primary authink-button--full authink-button--ink" href={actionHref}>
          {actionLabel}
        </a>
      </article>
    </AuthShell>
  );
}
