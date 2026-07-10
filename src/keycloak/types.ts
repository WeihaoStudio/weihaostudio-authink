import type { OAuthProvider } from "../components/OAuthButtons";

export type KcMessage = {
  type: "success" | "warning" | "error" | "info";
  summary: string;
};

type BaseContext = {
  realm?: {
    displayName?: string;
    rememberMe?: boolean;
    resetPasswordAllowed?: boolean;
  };
  message?: KcMessage;
  url: {
    loginUrl?: string;
    loginAction?: string;
    loginResetCredentialsUrl?: string;
  };
};

export type LoginKcContext = BaseContext & {
  pageId: "login.ftl";
  login?: {
    username?: string;
    rememberMe?: boolean;
  };
  social?: {
    providers?: OAuthProvider[];
  };
};

export type TotpKcContext = BaseContext & {
  pageId: "login-otp.ftl";
  recoveryCodeUrl?: string;
};

export type ResetPasswordKcContext = BaseContext & {
  pageId: "login-reset-password.ftl";
};

export type RecoveryCodeKcContext = BaseContext & {
  pageId: "login-recovery-authn-code.ftl";
  totpUrl?: string;
};

export type InfoKcContext = BaseContext & {
  pageId: "info.ftl" | "error.ftl";
  actionUri?: string;
  actionLabel?: string;
};

export type AuthInkKcContext =
  | LoginKcContext
  | TotpKcContext
  | ResetPasswordKcContext
  | RecoveryCodeKcContext
  | InfoKcContext;
