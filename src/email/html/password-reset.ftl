<#import "template.ftl" as layout>
<@layout.emailLayout title="重置你的密码">
  <div style="font-size:12px;letter-spacing:.16em;color:#777069;">WEIHAOSTUDIO · 账户恢复</div>
  <h1 style="margin:14px 0 16px;font-size:28px;font-weight:500;color:#1d1b19;">重置你的密码</h1>
  <p style="margin:0 0 24px;color:#514c47;font-size:15px;line-height:1.8;">我们收到了 ${realmName} 账户的密码重置请求。点击下方按钮继续。</p>
  <a href="${link}" style="display:inline-block;padding:13px 26px;background:#1f1d1b;color:#ffffff;text-decoration:none;font-size:15px;">继续重置密码</a>
  <p style="margin:22px 0 0;color:#777069;font-size:13px;line-height:1.7;">链接将在 ${linkExpirationFormatter(linkExpiration)} 后失效；如非你本人操作，请忽略此邮件，你的密码不会改变。</p>
</@layout.emailLayout>
