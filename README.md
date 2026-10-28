# ATELIO — page d’annonce

Projet autonome, séparé de l’application EL MECANO.

```
atelio-vitrine/
  frontend/     page React (Vite)
  backend/      API e-mail des demandes de démo
```

La page s’ouvre à la racine (`/`). Les demandes de démonstration sont envoyées à `contact@atelio-app.com`.

## En local

Deux terminaux :

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Puis ouvrir [http://localhost:5180](http://localhost:5180).

Le fichier `backend/.env` (non versionné) doit contenir `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` et `DEMO_NOTIFY_TO`. Un modèle se trouve dans `backend/.env.example`.

## En production

```bash
docker compose up -d --build
```

La page est servie sur le port `APP_HTTP_PORT` (8080 par défaut). Le nom de domaine prévu dans nginx est `atelio-app.com`.
