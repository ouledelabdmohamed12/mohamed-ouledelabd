# Préparation Vercel — Koda Atlas — 15 octobre 2026

## État

Tous les fichiers sont enregistrés sur disque. Ils sont encore non commités sur la branche locale main. Aucun push, déploiement, changement distant de variables ou envoi réel n'a été effectué. Le CLI Vercel est installé mais sans session authentifiée ; la connexion automatiquement proposée par `vercel whoami` a été interrompue. Aucun projet local `.vercel/project.json` n'existe. Les réglages du dashboard restent à contrôler avec le compte propriétaire.

## Configuration prête

- Racine Vercel : racine du dépôt (contenant package.json, api/, vercel.json et src/), pas dist/.
- Framework : Vite ; installation npm ci ; build npm run build ; sortie dist. Paramètres explicites dans vercel.json.
- Node 22.x fixé dans package.json et package-lock.json ; cette version est prise en charge par Vercel.
- api/contact.js : handler Node ESM exporté par défaut, helpers req/res compatibles Vercel. /api/contact est exclue de la réécriture SPA, durée maximale 30 s. L'ensemble des appels amont est borné à 5 s puis 12 s.
- Le build Vite ne compile que le frontend. Vercel doit aussi empaqueter api/contact.js ; aucune preuve de packaging Vercel réel n'est revendiquée avant un build lié au projet ou un déploiement autorisé.
- .env, .env.* et .vercel sont ignorés, sauf .env.example qui reste versionnable. Les secrets sont lus par process.env exclusivement côté serveur. Le test check:deployment injecte des marqueurs factices dans le processus de build puis vérifie leur absence de tous les fichiers dist ; aucun vrai secret n'est imprimé.

## Variables exactes

Configurer les variables dans le projet Vercel, avec la portée Production et aussi Preview si vous testez un déploiement de prévisualisation. Utiliser des credentials de test distincts en Preview si disponibles. Ne jamais copier les secrets dans une variable VITE_ ni dans le chat. Une modification de variable nécessite un nouveau déploiement pour être prise en compte.

| Variable | Statut | Usage / visibilité |
| --- | --- | --- |
| EMAILJS_PRIVATE_KEY | Obligatoire | Secret serveur EmailJS |
| TURNSTILE_SECRET_KEY | Obligatoire | Secret serveur du widget Turnstile |
| VITE_TURNSTILE_SITE_KEY | Obligatoire | Clé publique du même widget, intégrée au frontend à la compilation |
| TURNSTILE_ALLOWED_HOSTNAMES | Facultatif si domaines par défaut | Liste serveur séparée par des virgules ; défaut kodaatlas.com,www.kodaatlas.com ; inclure le hostname exact de Preview et l'autoriser aussi dans Cloudflare |
| EMAILJS_SERVICE_ID | Facultatif | Identifiant serveur ; le service existant est utilisé par défaut |
| EMAILJS_TEMPLATE_ID | Facultatif | Identifiant serveur ; le modèle existant est utilisé par défaut |
| EMAILJS_PUBLIC_KEY | Facultatif | Clé publique du compte ; la clé existante est utilisée par défaut, uniquement par la fonction |
| VITE_META_PIXEL_ID | Facultatif, analytics | Identifiant public Meta déjà utilisé dans le projet |
| VITE_GA4_ID | Facultatif, analytics | Identifiant public du module analytics avec consentement |
| VITE_GA_ID | Facultatif, analytics héritées | Identifiant public lu par les scripts existants d'index.html ; même ID que VITE_GA4_ID si les deux sont définis |

Le formulaire ne nécessite que les trois variables obligatoires, avec les identifiants EmailJS actuels par défaut. Aucun destinataire n'est configuré par variable dans ce dépôt : il est défini dans le modèle EmailJS. Le site affiche contact@kodaatlas.com ; confirmer dans EmailJS que c'est bien la boîte voulue.

Il existe déjà des scripts analytics dans index.html en plus du module analytics : leurs paramètres sont recensés ici, sans modifier cette intégration pendant la préparation du formulaire.

## Contrôles des services avant feu vert

EmailJS : vérifier le service connecté et son autorisation mail, le quota, les clés, l'accès aux appels depuis une application serveur, le modèle et son destinataire fixe. Reply-To doit utiliser {{email}} ; contrôler les autres variables de modèle détaillées dans contact-debugging.md. Le code appelle le vrai endpoint EmailJS et exige HTTP 200 + OK.

Turnstile : utiliser une vraie paire site-key/secret-key issue du même widget. Autoriser les domaines Production et Preview dans Cloudflare et les mêmes hostnames côté API. Le jeton est envoyé dans captchaToken, validé serveur via Siteverify, contrôlé sur success et hostname. Aucun fallback automatique vers une clé de test en build de production.

Les comptes et les credentials réels ne sont pas validés par les tests locaux : les transports sont remplacés exclusivement dans les tests. L'acceptation EmailJS ne garantit pas le classement en boîte principale ; vérifier la réception effective.

## Résultats locaux relancés

- npm test : 21/21 réussis.
- npm run lint : réussi.
- npm run build : réussi.
- npm run check:deployment : réussi (manifest/lock, export Node, exclusion API, build avec secrets factices et scan de dist).
- npm run test:contact:ui : réussi à 1280px et 390px.
- PLAYWRIGHT_CHANNEL=chrome avec npm run seo:check : sept routes réussies. En PowerShell : `$env:PLAYWRIGHT_CHANNEL='chrome'; npm run seo:check`.
- git diff --check : réussi.
- Avertissement non bloquant conservé : bundle JS supérieur à 500 Ko.

## Commandes Git à exécuter localement

Ces commandes préparent uniquement le commit local. Elles n'ont pas été exécutées par l'agent.

```powershell
git switch -c codex/prepare-vercel-contact
git add -- .gitignore .env.example README.md package.json package-lock.json vercel.json api src scripts tests docs
git diff --cached --check
git diff --cached --stat
git diff --cached
git commit -m "fix: harden contact delivery and prepare Vercel deployment"
git status --short
```

Vérifier le diff préparé avant commit. .env, .vercel, node_modules et dist ne doivent jamais apparaître dans le commit. Tous les nouveaux scripts de tests et fichiers docs doivent y être présents.

**Après confirmation explicite uniquement**, le push suivant peut déclencher un déploiement Preview si l'intégration Git Vercel est activée :

```powershell
git push -u origin codex/prepare-vercel-contact
```

Vérifier que le projet Vercel est bien relié au dépôt mohamed-ouledelabd et que sa branche Production est celle attendue. Vérifier Preview et les variables avant d'autoriser une fusion sur main : un push/fusion sur la branche Production peut déclencher immédiatement un déploiement Production. Aucun push ni commande vercel de déploiement ne doit être exécuté avant le feu vert.

## Après déploiement autorisé

1. Vérifier dans les détails du déploiement que /api/contact existe comme fonction Node et non comme fichier statique. Ouvrir /contact directement pour vérifier le routage SPA.
2. Une visite GET /api/contact doit renvoyer 405 JSON, Allow: POST et X-Request-Id. Un POST JSON avec objet vide doit renvoyer 400 JSON et ne doit envoyer aucun email. Une réponse HTML 200 indique un problème de routage.
3. Ouvrir /contact sur ordinateur puis téléphone. Saisir une demande clairement marquée TEST avec une adresse de réponse réelle et vérifier le CAPTCHA. Dans les outils développeur, repérer POST /api/contact : HTTP 200, success:true, requestId. Le navigateur ne doit transmettre aucune clé privée : uniquement les champs et captchaToken à /api/contact.
4. Confirmer contact_email_accepted dans les logs de la fonction, le succès dans l'historique EmailJS et la réception du message dans la boîte configurée (y compris spam). Vérifier les accents, le budget, la langue, la campagne UTM et Reply-To.
5. Dans le dashboard Vercel du projet, ouvrir les logs runtime du déploiement concerné. Filtrer la requête /api/contact et rechercher le requestId de la réponse ou l'en-tête X-Request-Id ; vérifier la bonne période et le bon environnement.

| Événement / réponse | Contrôle |
| --- | --- |
| contact_configuration_missing / 503 | Présence des deux secrets dans le bon environnement ; redéployer après ajout |
| contact_captcha_rejected / 400 | Paire de clés, hostname autorisé, expiration ; renouveler le CAPTCHA |
| contact_email_rejected / 502 | upstreamStatus puis historique EmailJS ; vérifier accès, modèle, service et quota |
| contact_upstream_failed | stage=captcha ou email, reason=timeout ou network_or_response |
| DELIVERY_UNKNOWN / 504 | Envoi potentiellement accepté avant expiration : vérifier EmailJS et la boîte avant de renvoyer |
| Aucun log de fonction, HTML au lieu de JSON | Mauvaise racine de projet, fonction absente du déploiement ou réécriture incorrecte |

Références officielles :
- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://vercel.com/docs/project-configuration/vercel-json
- https://www.emailjs.com/docs/rest-api/send/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
