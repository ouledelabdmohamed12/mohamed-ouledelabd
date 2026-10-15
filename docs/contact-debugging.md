# Diagnostic navigateur — Koda Atlas

Architecture : React 19, React Router 7, Vite 7, Tailwind 4 et fonction Node 22 sur Vercel. L'envoi utilise désormais uniquement Resend ; consulter [la procédure actuelle](resend-migration.md).

Le diagnostic public précédent dans Chrome a attribué les alertes CSP `connect-src data:`, OTS WOFF2 et WebGPU au document tiers Cloudflare Turnstile. Le WOFF2 Inter servi par Google Fonts répondait correctement et aucune police locale corrompue n'était identifiée. Aucun usage WebGPU n'existe dans le code applicatif. La CSP n'a pas été assouplie et le design n'a pas été modifié.

Le statut 502 seul ne permet pas de diagnostiquer un fournisseur email : utiliser requestId, l'étape et le statut amont dans les logs serveur. Les anciens diagnostics du fournisseur retiré ne constituent pas une preuve d'envoi Resend ni de livraison réelle.
