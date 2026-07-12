<#macro emailLayout title>
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f0ea;color:#24211e;font-family:Arial,'Microsoft YaHei',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f3f0ea;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border:1px solid #d8d1c7;background:#fbf8f2;">
        <tr><td style="padding:28px 36px 18px;border-bottom:1px solid #e3ddd4;">
          <div style="font-size:22px;font-weight:700;letter-spacing:.02em;color:#1d1b19;">WeihaoStudio</div>
          <div style="margin-top:5px;font-size:12px;letter-spacing:.16em;color:#777069;">身份与安全通知</div>
        </td></tr>
        <tr><td style="padding:34px 36px 38px;">
          <#nested>
        </td></tr>
      </table>
      <div style="max-width:600px;padding:18px 12px 0;color:#8a837b;font-size:12px;line-height:1.7;">WeihaoStudio 不会通过邮件向你索取密码、动态验证码或恢复码。</div>
    </td></tr>
  </table>
</body>
</html>
</#macro>
