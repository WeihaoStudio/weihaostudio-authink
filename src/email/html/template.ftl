<#ftl output_format="HTML">
<#macro emailLayout title="">
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><#if title?has_content>${title}<#else>WeihaoStudio</#if></title>
</head>
<body style="margin:0;padding:0;background:#f3f0ea;color:#24211e;font-family:system-ui,-apple-system,'Segoe UI','Microsoft YaHei',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f3f0ea;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border:1px solid #d8d1c7;border-radius:12px;background:#fbf8f2;overflow:hidden;">
        <tr><td background="${url.resourcesPath}/img/authink-email-landscape.webp" style="min-height:184px;padding:30px 36px;background:#39342f url('${url.resourcesPath}/img/authink-email-landscape.webp') center/cover no-repeat;">
          <div style="font-size:22px;font-weight:700;letter-spacing:.02em;color:#ffffff;text-shadow:0 1px 12px rgba(0,0,0,.32);">WeihaoStudio</div>
          <div style="margin-top:7px;font-size:12px;letter-spacing:.16em;color:#ffffff;text-shadow:0 1px 12px rgba(0,0,0,.32);">${msg("authinkEmailKicker")}</div>
        </td></tr>
        <tr><td style="padding:34px 36px 38px;font-size:15px;line-height:1.8;color:#514c47;">
          <#nested>
        </td></tr>
      </table>
      <div style="max-width:600px;padding:18px 12px 0;color:#8a837b;font-size:12px;line-height:1.7;">${msg("authinkEmailSafety")}</div>
    </td></tr>
  </table>
</body>
</html>
</#macro>

<#macro primaryAction link label>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;"><tr><td align="center" style="border-radius:8px;background:#211f1d;">
  <a href="${link}" style="display:inline-block;min-height:48px;padding:0 22px;color:#ffffff;font-size:15px;font-weight:700;line-height:48px;text-decoration:none;">${label}</a>
</td></tr></table>
</#macro>
