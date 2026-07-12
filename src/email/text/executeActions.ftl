<#ftl output_format="plainText">
<#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>、</#sep></#items></#list></#if></#assign>
完成账户安全操作

${realmName} 要求你完成：${requiredActionsText}

操作链接：${link}

链接将在 ${linkExpirationFormatter(linkExpiration)} 后失效。如非你本人操作，请联系管理员。
