<#import "template.ftl" as layout>
<@layout.emailLayout title="确认账户关联">
  <div style="font-size:12px;letter-spacing:.16em;color:#777069;">WEIHAOSTUDIO · 账户关联</div>
  <h1 style="margin:14px 0 16px;font-size:28px;font-weight:500;color:#1d1b19;">确认账户关联</h1>
  <p style="margin:0 0 24px;color:#514c47;font-size:15px;line-height:1.8;">正在请求将 ${identityProviderDisplayName} 账户与 ${realmName} 中的 ${identityProviderContext.username} 关联。</p>
  <a href="${link}" style="display:inline-block;padding:13px 26px;background:#1f1d1b;color:#ffffff;text-decoration:none;font-size:15px;">确认关联账户</a>
  <p style="margin:22px 0 0;color:#777069;font-size:13px;line-height:1.7;">链接将在 ${linkExpirationFormatter(linkExpiration)} 后失效；如非你本人操作，请忽略此邮件。</p>
</@layout.emailLayout>
