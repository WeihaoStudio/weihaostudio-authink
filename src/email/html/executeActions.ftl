<#outputformat "plainText">
<#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>、</#sep></#items></#list></#if></#assign>
</#outputformat>
<#import "template.ftl" as layout>
<@layout.emailLayout title="完成账户安全操作">
  <div style="font-size:12px;letter-spacing:.16em;color:#777069;">WEIHAOSTUDIO · 安全操作</div>
  <h1 style="margin:14px 0 16px;font-size:28px;font-weight:500;color:#1d1b19;">完成账户安全操作</h1>
  <p style="margin:0 0 10px;color:#514c47;font-size:15px;line-height:1.8;">${realmName} 要求你完成以下操作：${requiredActionsText}。</p>
  <p style="margin:0 0 24px;color:#514c47;font-size:15px;line-height:1.8;">点击下方按钮进入安全流程。</p>
  <a href="${link}" style="display:inline-block;padding:13px 26px;background:#1f1d1b;color:#ffffff;text-decoration:none;font-size:15px;">继续安全操作</a>
  <p style="margin:22px 0 0;color:#777069;font-size:13px;line-height:1.7;">链接将在 ${linkExpirationFormatter(linkExpiration)} 后失效；如非你本人操作，请联系管理员。</p>
</@layout.emailLayout>
