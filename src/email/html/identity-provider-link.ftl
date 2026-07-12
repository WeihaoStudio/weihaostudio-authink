<#import "template.ftl" as layout>
<@layout.emailLayout title=msg("identityProviderLinkSubject")>
${kcSanitize(msg("identityProviderLinkBodyHtml", identityProviderDisplayName, realmName, identityProviderContext.username, link, linkExpiration, linkExpirationFormatter(linkExpiration)))?no_esc}
<@layout.primaryAction link=link label=msg("authinkEmailLinkIdentityProviderAction") />
</@layout.emailLayout>
