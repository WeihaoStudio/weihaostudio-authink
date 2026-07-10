import { InfoPage } from "../pages/InfoPage";
import { LoginPage } from "../pages/LoginPage";
import { RecoveryCodePage } from "../pages/RecoveryCodePage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { TotpPage } from "../pages/TotpPage";
import type { AuthInkKcContext } from "./types";

type AuthInkKcPageProps = {
  kcContext: AuthInkKcContext;
  theme?: "light" | "dark";
  onThemeChange?: () => void;
};

export function AuthInkKcPage({
  kcContext,
  theme = "light",
  onThemeChange = () => undefined,
}: AuthInkKcPageProps) {
  const errorMessage = kcContext.message?.type === "error" ? kcContext.message.summary : undefined;
  const loginUrl = kcContext.url.loginUrl ?? "/";

  switch (kcContext.pageId) {
    case "login.ftl":
      return (
        <LoginPage
          theme={theme}
          onThemeChange={onThemeChange}
          actionUrl={kcContext.url.loginAction}
          resetPasswordUrl={kcContext.url.loginResetCredentialsUrl}
          username={kcContext.login?.username}
          errorMessage={errorMessage}
          providers={kcContext.social?.providers}
        />
      );

    case "login-otp.ftl":
      return (
        <TotpPage
          theme={theme}
          onThemeChange={onThemeChange}
          actionUrl={kcContext.url.loginAction}
          recoveryUrl={kcContext.recoveryCodeUrl}
          loginUrl={loginUrl}
          errorMessage={errorMessage}
        />
      );

    case "login-reset-password.ftl":
      return (
        <ResetPasswordPage
          theme={theme}
          onThemeChange={onThemeChange}
          actionUrl={kcContext.url.loginAction}
          loginUrl={loginUrl}
          errorMessage={errorMessage}
        />
      );

    case "login-recovery-authn-code.ftl":
      return (
        <RecoveryCodePage
          theme={theme}
          onThemeChange={onThemeChange}
          actionUrl={kcContext.url.loginAction}
          totpUrl={kcContext.totpUrl}
          loginUrl={loginUrl}
          errorMessage={errorMessage}
        />
      );

    case "error.ftl":
      return (
        <InfoPage
          theme={theme}
          onThemeChange={onThemeChange}
          tone="error"
          title="验证未完成"
          description={kcContext.message?.summary ?? "身份验证过程中出现问题，请稍后重试。"}
          actionLabel={kcContext.actionLabel ?? "返回登录"}
          actionHref={kcContext.actionUri ?? loginUrl}
        />
      );

    case "info.ftl":
      return (
        <InfoPage
          theme={theme}
          onThemeChange={onThemeChange}
          tone={kcContext.message?.type === "success" ? "success" : "info"}
          title={kcContext.message?.type === "success" ? "操作已完成" : "身份验证提示"}
          description={kcContext.message?.summary ?? "请按照页面提示继续完成身份验证。"}
          actionLabel={kcContext.actionLabel ?? "继续"}
          actionHref={kcContext.actionUri ?? loginUrl}
        />
      );
  }
}
