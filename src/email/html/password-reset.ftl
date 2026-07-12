<#import "template.ftl" as layout>
<@layout.emailLayout title=msg("passwordResetSubject")>
${kcSanitize(msg("passwordResetBodyHtml",link, linkExpiration, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
<@layout.primaryAction link=link label=msg("authinkEmailResetPasswordAction") />
</@layout.emailLayout>
