# Déploiement Vercel — Resend

Paramètres locaux : racine du dépôt entier, framework Vite, installation `npm ci`, build `npm run build`, sortie `dist`, Node 22.x. `api/contact.js` est la fonction serveur ; `server/` contient ses modules privés et modèles HTML. `/api/contact` est exclue de la réécriture SPA et dispose de 30 secondes.

Les variables Resend/Turnstile et les commandes de vérification sont dans [resend-migration.md](resend-migration.md). Configurer les valeurs séparément pour Preview et Production. Les modèles sont inclus par `functions.api/contact.js.includeFiles` dans `vercel.json`.

La réception utilise Cloudflare Email Routing vers Gmail, selon la configuration du propriétaire. Ne pas modifier les DNS, le routage ou les secrets pour un nettoyage local.

Pour contrôler un déploiement autorisé : `GET /api/contact` doit répondre 405 JSON avec `Allow: POST`, pas servir le HTML SPA. Un POST JSON vide doit répondre 400 sans envoi. Corréler `X-Request-Id` avec les logs et les deux IDs Resend pour une demande réelle.

Le propriétaire a confirmé le succès des tests en production. Une nouvelle publication reste soumise à sa validation des modifications locales. Aucun commit, push ou déploiement n'est lancé par ces instructions.
