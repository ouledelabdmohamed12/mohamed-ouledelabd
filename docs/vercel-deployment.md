# Déploiement Vercel — fournisseur unique Resend

La procédure actuelle, les variables, les commandes de test réel et les conditions de publication sont dans [resend-migration.md](resend-migration.md).

Paramètres déjà enregistrés : Vite, npm ci, npm run build, dist, Node 22.x. api/contact.js est la fonction serveur, server/ contient ses modules privés. /api/contact est exclue de la réécriture SPA et dispose de 30 secondes.

Il n'existe plus de sélection de fournisseur. Configurer RESEND_API_KEY et les variables Turnstile, supprimer les anciennes variables du fournisseur retiré dans Vercel. Les modifications distantes restent à faire par le compte propriétaire.

Ne pas déployer en Production avant validation réelle de la boîte de notification et validation des deux livraisons avec les modèles originaux intégrés. Aucun push ni déploiement ne résulte de ces seules modifications locales.
