# Koda Atlas — e-mails Resend

## Architecture actuelle

React 19 et Vite servent le site ; `api/contact.js` est une fonction Node 22 sur Vercel. Resend est le seul fournisseur d'envoi. La réception de `contact@kodaatlas.com` utilise Cloudflare Email Routing vers Gmail, selon la configuration confirmée par le propriétaire. La réception est indépendante du code d'envoi : aucun changement DNS ou de routage n'est nécessaire pour ce nettoyage local.

Les deux envois et le bouton de réponse ont été validés en production par le propriétaire. Cette validation est une information fournie par lui ; les commandes locales ci-dessous ne renvoient pas de messages réels et ne modifient pas les comptes distants.

## Modèles et destinataires

Les HTML originaux sont conservés dans `server/templates/contact-us.html` et `server/templates/auto-reply.html`, sans modification du logo, des couleurs, tableaux, boutons ou textes. Ils sont chargés uniquement côté serveur et inclus explicitement dans la fonction par `vercel.json`.

| Message | Destination | Reply-To |
| --- | --- | --- |
| Notification interne | `contact@kodaatlas.com` par défaut | Adresse validée du client |
| Confirmation automatique | Adresse validée du client | `contact@kodaatlas.com` par défaut |

Expéditeur : `Koda Atlas <noreply@kodaatlas.com>`. Sujets : `[Koda Atlas] Nouveau message de {name}` et `Merci de nous avoir contactés !`. Le CTA des réalisations conserve l'URL du HTML original : `https://kodaatlas.com`.

`server/contact-emails.js` échappe les textes, construit séparément les URL mailto/tel/HTTP(S) et remplace les coordonnées facultatives non utilisables comme lien par du texte. Les valeurs facultatives absentes affichent `Non précisé`.

## Variables à conserver

| Variable | Rôle |
| --- | --- |
| `RESEND_API_KEY` | Secret serveur autorisé à envoyer sur le domaine |
| `TURNSTILE_SECRET_KEY` | Secret serveur du widget Cloudflare |
| `VITE_TURNSTILE_SITE_KEY` | Clé publique du même widget, nécessaire au formulaire |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Liste séparée par des virgules ; défaut `kodaatlas.com,www.kodaatlas.com` |
| `CONTACT_NOTIFICATION_EMAIL` | Facultative ; défaut `contact@kodaatlas.com`, contrôle notification et Reply-To de l'accusé |

Les identifiants analytics `VITE_META_PIXEL_ID`, `VITE_GA4_ID` et `VITE_GA_ID` restent indépendants de l'envoi et doivent être conservés s'ils sont utilisés. Aucun secret ne doit recevoir un préfixe `VITE_`.

Configurer les valeurs dans `.env` local (ignoré par Git) ou dans le bon environnement Vercel. Ne pas afficher les secrets dans les logs, le chat ou une commande shell. Pour une prévisualisation ou un runtime local, autoriser le hostname dans le widget Turnstile et dans `TURNSTILE_ALLOWED_HOSTNAMES`. Vite seul ne sert pas les fonctions Vercel.

## Sécurité et fiabilité conservées

- Validation serveur des champs, types, tailles, email et caractères de contrôle.
- Honeypot et vérification serveur Turnstile avec contrôle du hostname.
- Limitation locale à 5 tentatives/10 minutes/IP/instance, mémoire bornée ; un quota global Serverless relève d'une règle WAF distincte.
- Délais bornés : Turnstile 5 secondes, Resend 12 secondes, fonction Vercel 30 secondes.
- Envoi des deux messages par batch Resend, succès uniquement avec deux IDs distincts et aucune erreur partielle signalée.
- Clé HMAC stable du contenu exact des deux messages pour l'idempotence Resend pendant 24 heures. Pour une reprise incertaine, conserver le contenu, les modèles, le destinataire et la clé serveur ; vérifier l'historique après expiration de la fenêtre.
- Préservation du formulaire en cas d'erreur, protection des doubles soumissions et absence de repli vers un autre fournisseur.
- Logs avec requestId, étape, durée, statut et IDs d'emails ; aucune donnée du prospect ni clé.

## Vérifications locales sans envoi

```powershell
npm test
npm run lint
npm run build
npm run check:deployment
npm run test:contact:integration
npm run test:contact:ui
npm run email:preview
npm run email:test -- --check
```

Les tests de l'API remplacent uniquement le transport externe. Les tests navigateur appellent l'API HTTP locale. Les aperçus utilisent des données d'exemple dans `scripts/.email-previews`, ignoré par Git. Les tests navigateur utilisent Chrome installé ; le test SEO existant accepte `$env:PLAYWRIGHT_CHANNEL='chrome'; npm run seo:check`.

Le mode `--check` affiche uniquement les booléens de présence, la boîte de notification et `networkRequestMade:false`. `readyForForm:true` vérifie la configuration locale présente, pas la validité distante des credentials.

`check:deployment` conserve volontairement des assertions négatives contre les anciens noms de fournisseur et de sélecteur : ce sont des protections de non-régression, pas une dépendance active. Il compile aussi avec des secrets factices et vérifie leur absence de `dist`.

## Test opérateur réel, seulement après autorisation

```powershell
npm run email:test -- --send
```

Cette commande demande une adresse de test contrôlée, soumet les deux modèles à Resend et affiche les IDs acceptés. Elle n'exécute pas le CAPTCHA de l'API publique. L'alias `email:test:live` est conservé pour compatibilité avec les commandes déjà utilisées. Sans `--send`, aucun email n'est envoyé.

Une acceptation API ne prouve pas la réception : contrôler les événements Resend et les boîtes internes/client, spams compris. Le script ne réessaie pas automatiquement. Aucun test réel n'est nécessaire pour un simple nettoyage local.

## Diagnostic

Filtrer les logs runtime Vercel sur `/api/contact`, puis corréler `requestId`/`X-Request-Id` :

- `contact_configuration_missing` : configuration serveur absente ou invalide.
- `contact_captcha_rejected` : jeton ou hostname refusé.
- `contact_rate_limited` : quota local atteint.
- `contact_email_rejected` : statut amont ou deux IDs non confirmés.
- `contact_upstream_failed` : réseau ou délai ; l'état d'envoi peut être inconnu.
- `contact_emails_accepted` : deux IDs à retrouver dans Resend.

La configuration de déploiement est décrite dans [vercel-deployment.md](vercel-deployment.md). Aucun commit, push ou déploiement n'est effectué par les vérifications locales.
