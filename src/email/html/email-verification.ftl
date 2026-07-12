<#import "template.ftl" as layout>
<@layout.emailLayout title=msg("emailVerificationSubject")>
${kcSanitize(msg("emailVerificationBodyHtml",link, linkExpiration, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
<@layout.primaryAction link=link label=msg("authinkEmailVerifyAction") />
</@layout.emailLayout>
