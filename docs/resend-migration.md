# Koda Atlas — configuration locale et validation Resend

## Modèles intégrés

Les deux HTML originaux sont maintenant enregistrés dans server/templates/contact-us.html (pièce jointe fournie) et server/templates/auto-reply.html (code du message). Le logo og-image.png, les couleurs, tableaux, textes, boutons et liens fixes sont conservés. Le CTA des réalisations cible https://kodaatlas.com, comme dans l'original fourni.

server/contact-emails.js les charge uniquement côté serveur. Le rendu échappe les valeurs textuelles et construit séparément les URL mailto/tel/HTTP(S). Les coordonnées facultatives absentes ou non utilisables comme URL deviennent du texte plutôt qu'un lien vide ou dangereux. Les champs facultatifs affichent Non précisé. Un document HTML et une règle de retour à la ligne entourent les fragments pour leur affichage mobile, sans réécrire les styles des modèles. vercel.json inclut explicitement server/templates/*.html dans la fonction.

Resend est le fournisseur unique, la dépendance @emailjs/nodejs et le sélecteur sont supprimés. Aucun MX Namecheap n'a été modifié. Aucun email réel et aucun déploiement ne sont autorisés sans le prochain accord explicite du propriétaire.

## Renseigner les secrets localement

Le fichier .env existe et ses deux entrées serveur manquantes ont été ajoutées vides. Il est ignoré par Git. Ouvrir ce fichier dans l'éditeur local, sans en copier le contenu dans le chat, une commande shell ou un commit.

1. Renseigner RESEND_API_KEY avec la clé Resend créée pour envoyer depuis kodaatlas.com.
2. Dans le dashboard Cloudflare, ouvrir Turnstile et sélectionner le widget déjà utilisé par le site. Copier sa secret key dans TURNSTILE_SECRET_KEY.
3. Conserver VITE_TURNSTILE_SITE_KEY avec la sitekey publique DU MÊME widget. Elle est déjà présente localement, mais l'association avec la secret key doit être vérifiée par le propriétaire.
4. Enregistrer le fichier. Aucun préfixe VITE_ ne doit être ajouté aux deux secrets serveur.

Entrées concernées (seulement des emplacements vides ci-dessous, aucune vraie clé) :

```dotenv
RESEND_API_KEY=
TURNSTILE_SECRET_KEY=
```

Pour le formulaire local, utiliser le runtime Vercel : Vite seul ne sert pas api/contact.js. Le hostname local doit être autorisé dans le widget Cloudflare et TURNSTILE_ALLOWED_HOSTNAMES ; utiliser idéalement un widget de développement distinct, sans modifier les MX.

Variables du formulaire : RESEND_API_KEY, TURNSTILE_SECRET_KEY, VITE_TURNSTILE_SITE_KEY ; TURNSTILE_ALLOWED_HOSTNAMES (défaut kodaatlas.com,www.kodaatlas.com) ; CONTACT_NOTIFICATION_EMAIL facultative (défaut contact@kodaatlas.com). Aucun CONTACT_MAIL_PROVIDER nécessaire. Les variables analytics restent inchangées.

## Vérification sans envoi

```powershell
npm run email:test -- --check
```

Le contrôle affiche uniquement des booléens de présence, le destinataire interne et networkRequestMade:false. Il ne contacte ni Resend ni Cloudflare et ne prouve pas la validité des clés. readyForForm doit être true ; le code de sortie est 1 si une configuration obligatoire manque. Après l'enregistrement des secrets, relancer cette commande ou demander à l'agent de la relancer. Ne jamais afficher le contenu de .env pour diagnostiquer.

Lors de la dernière vérification : sitekey présente, RESEND_API_KEY et TURNSTILE_SECRET_KEY encore vides, readyForForm:false. La boîte interne reste contact@kodaatlas.com par défaut, même sans variable explicite.

## Tests réels préparés, non autorisés à ce stade

Destinations convenues dans le chat : notification interne à contact@kodaatlas.com et Auto-Reply à l'adresse Gmail fournie par le propriétaire. L'adresse personnelle n'est pas codée en dur dans le projet.

La commande email:test et son alias email:test:live n'envoient rien sans --send. Le script ne sauvegarde pas l'adresse client. Après accord explicite seulement, l'agent pourra passer l'adresse fournie ou le propriétaire pourra lancer la commande interactive :

```powershell
npm run email:test -- --send
```

Le test opérateur soumet les deux modèles à Resend ; il ne traverse pas le CAPTCHA de l'API publique. Un accusé API avec deux IDs ne prouve pas la livraison. Vérifier les événements Resend, puis les deux boîtes et spams, les sujets, les Reply-To et le rendu dans des clients mail réels. La réception externe de contact@kodaatlas.com reste à confirmer. Ne modifier aucun MX pour effectuer ces tests.

Tester ensuite le parcours complet dans un runtime Vercel local ou un Preview explicitement autorisé avec un vrai CAPTCHA. Aucune mise en Production avant validation des réceptions réelles et accord du propriétaire.

## Fiabilité et limites

Validations serveur, honeypot, Turnstile avec hostname, délais de 5 s/12 s (fonction 30 s), logs sans données du prospect, deux IDs exigés avant succès, conservation des champs en cas d'erreur. Une clé HMAC stable du contenu des deux emails permet une reprise identique avec l'idempotence Resend pendant 24 heures. Ne pas modifier la demande, les modèles ou la clé pendant une reprise incertaine ; vérifier l'historique après expiration de la fenêtre. Le compteur local 5 tentatives/10 min/IP est par instance : configurer une règle WAF pour un quota global Serverless.

## Vérifications réalisées

43 tests Node réussis ; lint et build réussis ; scan des secrets dans dist réussi ; tests navigateur de la vraie API HTTP locale à 1280px et 390px réussis (seuls les services externes/CAPTCHA sont simulés) ; rendus des deux HTML originaux à 800px et 390px réussis et captures inspectées. Ces vérifications n'envoient aucun email réel et ne certifient pas le rendu Gmail/Outlook.

Commandes : npm test ; npm run lint ; npm run check:deployment ; npm run test:contact:integration ; npm run email:preview. Les rendus d'exemple sont dans scripts/.email-previews, ignorés par Git.

## Avant Vercel Production

Racine du dépôt entier, Vite, npm ci, npm run build, sortie dist, Node 22.x, api/contact.js et server/templates inclus. Configurer les secrets et hostnames séparément pour Preview/Production ; supprimer les anciennes variables inutiles du fournisseur retiré. Corréler requestId/X-Request-Id avec les logs contact_emails_accepted et ses deux emailIds. Vérifier les deux réceptions réelles avant d'autoriser un push ou un déploiement pouvant publier la Production.

Références : https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/ ; https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions ; https://resend.com/docs/dashboard/emails/idempotency-keys.

## Test réel autorisé — 15 octobre 2026

Une seule exécution initiale de `npm run email:test -- --send --client-email=kodaatlas26@gmail.com` a été effectuée, sans relance automatique. Le batch Resend a répondu HTTP 200 avec deux IDs distincts, dans l'ordre des messages :

- Notification interne, contact@kodaatlas.com : 01a14138-d199-7473-80ae-c76a9e5ced3f.
- Auto-Reply, kodaatlas26@gmail.com : 01a14138-d199-73e1-9099-6261e82a26d5.

Les deux modèles HTML originaux intégrés ont été utilisés. Cela confirme leur acceptation par l'API Resend, pas leur réception en boîte. Les deux boîtes et les événements de livraison restent à contrôler par le propriétaire. Aucune clé n'a été affichée, aucun déploiement et aucun changement DNS/MX effectués. Le script affiche désormais le statut HTTP et des erreurs fournisseur expurgées des clés, sans tentative automatique supplémentaire.
