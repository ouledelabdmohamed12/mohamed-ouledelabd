# Koda Atlas

Site React 19 / Vite 7, Tailwind et React Router, déployé sur Vercel avec une fonction Node 22 dans `api/contact.js`.

Le formulaire utilise exclusivement Resend pour la notification interne et l'accusé de réception client. Cloudflare Turnstile, honeypot, validations serveur et idempotence sont conservés. Les secrets ne sont jamais exposés au frontend.

- [Configuration, modèles et validation réelle avant publication](docs/resend-migration.md)
- [Préparation Vercel](docs/vercel-deployment.md)
- [Diagnostic des alertes navigateur](docs/contact-debugging.md)

Copier `.env.example` vers `.env` et configurer les secrets localement, ou utiliser les variables du projet Vercel. `vite` seul ne sert pas les fonctions Vercel.

```powershell
npm ci
npm test
npm run lint
npm run check:deployment
npm run test:contact:integration
npm run test:contact:ui
npm run email:preview
```

`npm run email:test:live` sans arguments n'envoie rien. L'envoi réel exige `--send`, une adresse client contrôlée et une clé serveur configurée ; voir la documentation. Aucun déploiement Production avant validation explicite des tests réels.
