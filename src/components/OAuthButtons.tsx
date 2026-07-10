function GoogleIcon() {
  return (
    <svg className="authink-button__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.23-.2-1.78H12v3.42h5.52a4.72 4.72 0 0 1-2.05 3.02v2.22h3.32c1.94-1.79 2.81-4.43 2.81-6.88Z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.61-2.42l-3.32-2.22c-.9.61-2.07.97-3.29.97-2.6 0-4.81-1.76-5.6-4.13H2.98v2.29A10 10 0 0 0 12 22Z"/>
      <path fill="#FBBC05" d="M6.4 14.2A6.03 6.03 0 0 1 6.08 12c0-.77.14-1.51.4-2.2V7.51H2.97A10 10 0 0 0 2 12c0 1.61.38 3.13.98 4.49L6.4 14.2Z"/>
      <path fill="#EA4335" d="M12 5.67c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.66 9.66 0 0 0 12 2a10 10 0 0 0-9.02 5.51L6.48 9.8C7.2 7.43 9.4 5.67 12 5.67Z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="authink-button__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.93a9.4 9.4 0 0 1 2.5.34c1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"/>
    </svg>
  );
}

export function OAuthButtons() {
  return (
    <div className="authink-oauth-list" aria-label="第三方登录">
      <button className="authink-button authink-button--oauth authink-button--full" type="button">
        <GoogleIcon />
        <span>使用 Google 登录</span>
      </button>
      <button className="authink-button authink-button--oauth authink-button--full" type="button">
        <GitHubIcon />
        <span>使用 GitHub 登录</span>
      </button>
    </div>
  );
}
