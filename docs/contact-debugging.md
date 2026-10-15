# Diagnostic et déploiement du formulaire Koda Atlas — 15 octobre 2026

## Architecture et observations

React 19, React Router 7, Vite 7, Tailwind 4 et Framer Motion. Le serveur est une fonction Node Vercel dans `api/contact.js`. Aucun serveur Next.js ni SMTP direct dans ce dépôt : EmailJS utilise son service mail connecté.

Le handler initial convertissait toutes les erreurs EmailJS en 502. La cause précise du refus en production reste inconnue sans les logs Vercel et le compte EmailJS. Le `.env` local ne contient pas EMAILJS_PRIVATE_KEY ; aucune preuve ne permet d'affirmer qu'elle est également absente de Vercel. Le SDK installé ne borne pas sa requête HTTPS. Les logs initiaux exposaient des coordonnées clients et l'objet d'erreur brut. Le honeypot renvoyait un faux succès, et Turnstile n'était validé que dans le navigateur (jeton jamais envoyé au serveur).

Diagnostic public réellement exécuté avec Chrome sans extensions : les alertes `connect-src data:`, OTS WOFF2 et WebGPU ont toutes pour origine le document `https://challenges.cloudflare.com/cdn-cgi/challenge-platform/.../turnstile/...`. La police qui déclenche OTS est interne à l'iframe tierce, sans fichier correspondant dans le dépôt ; son URL individuelle n'est pas exposée par les requêtes de polices observées. Inter provient de `https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcviYwY.woff2`, répond 200, Content-Type font/woff2, signature wOF2, 72 920 octets, sans erreur OTS associée. La CSP du document Cloudflare ne peut pas être corrigée depuis le site parent. Aucune politique n'a été assouplie et aucune police du design n'a été remplacée. Aucun usage WebGPU dans le code applicatif. Ces avertissements tiers ne démontrent pas un échec de l'envoi EmailJS.

## Corrections

- Envoi réel conservé avec le même service et modèle EmailJS, via son API REST officielle, avec interruption réseau à 12 secondes. Aucune simulation dans le code de production.
- Vérification serveur Turnstile à 5 secondes, contrôle du hostname, secrets obligatoires, aucun test-key fallback en build de production.
- Aucun succès sur honeypot, configuration absente, erreur réseau, réponse fournisseur invalide ou délai dépassé. Succès seulement après HTTP 200 et accusé `OK` d'EmailJS. Cet accusé confirme l'acceptation fournisseur ; la réception en boîte doit encore être contrôlée.
- Logs JSON avec identifiant de requête, étape, durée et statut fournisseur. Aucune identité, adresse email, contenu du message, clé ou réponse fournisseur brute dans les logs.
- Validation des types, tailles, champs obligatoires et email côté serveur ; espaces seuls refusés. Champs optionnels, budget, langue et campagne conservés dans le modèle.
- Formulaire HTML, labels associés, clavier email mobile, alertes accessibles, verrou synchrone contre les doubles soumissions et délai navigateur de 22 secondes. Données conservées en mémoire en cas d'échec ; elles ne sont pas persistées après rechargement. CAPTCHA renouvelé après tentative, car son jeton est à usage unique.
- Routage SPA excluant `/api/`, budget Vercel de 30 secondes. Vite seul ne sert pas les fonctions Vercel.

## Avant de déployer

1. Dans Vercel, configurer les secrets serveur `EMAILJS_PRIVATE_KEY` et `TURNSTILE_SECRET_KEY`. Ne jamais utiliser un préfixe VITE_ pour eux.
2. Conserver/configurer `VITE_TURNSTILE_SITE_KEY` avec une vraie clé. La clé secrète doit appartenir au même widget. Autoriser `kodaatlas.com` et `www.kodaatlas.com` dans Cloudflare. `TURNSTILE_ALLOWED_HOSTNAMES` contient ces domaines par défaut ; ajouter explicitement le hostname du staging si nécessaire.
3. Vérifier dans EmailJS les clés, le service `service_prx83vw`, le modèle `template_bbujlih`, l'autorisation des appels depuis une application serveur, le quota et la connexion du service email (réautoriser si expirée). Les identifiants peuvent être remplacés par EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID et EMAILJS_PUBLIC_KEY.
4. Dans le modèle EmailJS, vérifier que le destinataire est l'adresse de réception réellement voulue (le site affiche contact@kodaatlas.com). Le destinataire n'est pas défini dans ce dépôt : il est configuré chez EmailJS. Vérifier Reply-To = {{email}} et la présence de {{name}}, {{message}}, {{phone}}, {{website}}, {{projectType}}, {{budget}}, {{language}}, {{utm}}. Ne pas permettre au client de choisir le destinataire.
5. Déployer le dépôt entier sur Vercel, framework Vite, build `npm run build`, sortie `dist`, racine du projet incluant `api/` et `vercel.json`. Un hébergement du dossier dist seul ne peut pas envoyer les emails. Utiliser un runtime Node supportant fetch et AbortSignal.timeout (tests réalisés sous Node 22).
6. Tester d'abord sur un déploiement de prévisualisation correctement configuré puis en production. Soumettre une demande clairement marquée TEST via un vrai navigateur, effectuer le CAPTCHA, contrôler la réponse JSON, les logs contact_email_accepted, l'historique EmailJS et la réception effective (inbox et spam). Vérifier aussi Reply-To, accents, budget et UTM.
7. Tester une adresse invalide et un échec contrôlé en staging. En cas de 502, corréler X-Request-Id avec contact_email_rejected / upstreamStatus et l'historique fournisseur. 401/403 orientent vers les accès ; 429 vers les limites ; 5xx vers le fournisseur. Un timeout email signifie état inconnu : ne pas renvoyer automatiquement, vérifier d'abord l'historique pour éviter un doublon.

Aucun déploiement, modification de compte EmailJS/Cloudflare ni email réel n'a été effectué pendant cette intervention. L'accès public au site ne donne pas accès à ses secrets, logs serveur ni boîte de réception. La panne de production ne peut donc pas être déclarée résolue avant ces vérifications.

## Commandes de vérification

- `npm test` : tests de l'API, transport HTTPS remplacé uniquement dans les tests.
- `npm run lint` et `npm run build`.
- `npm run test:contact:ui` : Chrome installé requis ; teste 1280px et 390px, API et widget remplacés uniquement dans le navigateur de test. Aucun email n'est envoyé.
- PowerShell : `$env:PLAYWRIGHT_CHANNEL='chrome'; npm run seo:check` pour le test de rendu préexistant (sinon installer le navigateur Playwright attendu).
- `npm run contact:diagnose` : lecture seule du site public ; sorties de console et métadonnées des polices.
- Pour tester réellement la fonction localement, utiliser le runtime Vercel avec les variables serveur configurées ; `vite` et `vite preview` seuls ne l'exécutent pas.

Références : https://www.emailjs.com/docs/rest-api/send/ et https://developers.cloudflare.com/turnstile/get-started/server-side-validation/.

## Résultats de cette intervention

- 21 tests API : réussis.
- Tests navigateur du formulaire à 1280px et 390px : réussis (champs requis, email invalide, chargement, double soumission, conservation sur erreur, succès confirmé par contrat API de test, absence de débordement horizontal).
- ESLint : réussi.
- Build Vite : réussi ; avertissement non bloquant préexistant de bundle JavaScript supérieur à 500 Ko.
- Test SEO préexistant : les sept routes passent avec Chrome sélectionné via PLAYWRIGHT_CHANNEL. Le navigateur Playwright par défaut n'était pas installé ; aucun téléchargement nécessaire.
- Diagnostic public réel : CSP/WOFF2/WebGPU attribués au document Turnstile ; aucune soumission réelle effectuée.

## Fichiers modifiés ou ajoutés

`api/contact.js`, `src/components/Sections/ContactSection.jsx`, `src/components/Input/TextInput.jsx`, `src/components/Turnstile.jsx`, `src/i18n/locales/fr.json`, `src/i18n/locales/en.json`, `vercel.json`, `.env.example`, `package.json`, `tests/contact.test.mjs`, `scripts/contact-form-check.mjs`, `scripts/contact-production-diagnostics.mjs`, `scripts/seo-render-check.mjs` (sélection du navigateur de test), `README.md`, `docs/contact-debugging.md`.
