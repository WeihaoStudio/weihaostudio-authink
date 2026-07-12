<#import "template.ftl" as layout>
<@layout.emailLayout title="确认你的邮箱">
  <div style="font-size:12px;letter-spacing:.16em;color:#777069;">WEIHAOSTUDIO · 身份确认</div>
  <h1 style="margin:14px 0 16px;font-size:28px;font-weight:500;color:#1d1b19;">确认你的邮箱</h1>
  <p style="margin:0 0 24px;color:#514c47;font-size:15px;line-height:1.8;">请确认此邮箱地址属于你，以便继续使用 ${realmName} 的账户登录、恢复与安全通知。</p>
  <a href="${link}" style="display:inline-block;padding:13px 26px;background:#1f1d1b;color:#ffffff;text-decoration:none;font-size:15px;">验证邮箱地址</a>
  <p style="margin:22px 0 0;color:#777069;font-size:13px;line-height:1.7;">链接将在 ${linkExpirationFormatter(linkExpiration)} 后失效；如非你本人操作，无需采取任何动作。</p>
</@layout.emailLayout>
