# BO2 Camo Tracker

Application web (React + Vite + Tailwind) pour suivre manuellement votre
progression de camouflages sur **Call of Duty: Black Ops 2** (multijoueur),
avec synchronisation cloud via **Supabase** entre tous vos appareils (PC,
téléphone, etc.).

## Sommaire

1. [Prérequis : installer Node.js](#1-prérequis--installer-nodejs)
2. [Créer le projet Supabase (gratuit)](#2-créer-le-projet-supabase-gratuit)
3. [Configurer les clés API dans le projet](#3-configurer-les-clés-api-dans-le-projet)
4. [Lancer l'application en local](#4-lancer-lapplication-en-local)
5. [Corriger/compléter les données d'armes](#5-corrigercompléter-les-données-darmes)
6. [Déployer gratuitement (Vercel ou Netlify)](#6-déployer-gratuitement-vercel-ou-netlify)
7. [Ajouter l'app à l'écran d'accueil du téléphone](#7-ajouter-lapp-à-lécran-daccueil-du-téléphone)

---

## 1. Prérequis : installer Node.js

Ce projet a été généré entièrement (code + données), mais **Node.js n'est pas
installé sur cette machine** — il est nécessaire pour installer les
dépendances et lancer l'application.

1. Téléchargez la version LTS sur [nodejs.org](https://nodejs.org/) (choisissez
   l'installeur Windows).
2. Installez-la (Suivant / Suivant / Terminer).
3. Rouvrez un terminal (PowerShell) et vérifiez :
   ```powershell
   node --version
   npm --version
   ```

## 2. Créer le projet Supabase (gratuit)

1. Allez sur [supabase.com](https://supabase.com/) et cliquez sur **Start your
   project** / **Sign up** (vous pouvez vous connecter avec GitHub ou par
   email).
2. Cliquez sur **New project**.
   - **Name** : `bo2-camo-tracker` (ou ce que vous voulez).
   - **Database Password** : générez-en un et **conservez-le** (pas besoin de
     le retenir pour ce projet, mais gardez-le de côté).
   - **Region** : choisissez la région la plus proche de vous (ex: `Europe
     West (Paris)` ou équivalent).
   - **Plan** : Free.
3. Attendez ~1-2 minutes que le projet soit provisionné.
4. Une fois dans le projet, allez dans **SQL Editor** (icône dans le menu de
   gauche) → **New query**.
5. Copiez tout le contenu du fichier [`supabase/schema.sql`](supabase/schema.sql)
   de ce projet, collez-le dans l'éditeur, puis cliquez sur **Run**.
   - Cela crée la table `progression`, active la sécurité au niveau ligne
     (RLS, chacun ne voit que ses propres données), et active la
     synchronisation temps réel (Realtime) sur cette table.
6. Activer l'authentification par email :
   - Allez dans **Authentication > Providers** (ou **Sign In / Providers**).
   - Vérifiez que **Email** est activé (c'est activé par défaut).
   - Pour utiliser le **lien magique** (connexion sans mot de passe) : il est
     inclus avec le provider Email, rien à faire de plus.
   - Astuce : par défaut Supabase exige une confirmation par email à
     l'inscription. Vous pouvez désactiver cette confirmation pour aller plus
     vite (usage perso) dans **Authentication > Providers > Email > Confirm
     email** (désactivez le toggle) — sinon vous devrez cliquer sur le lien
     reçu par email après inscription.

## 3. Configurer les clés API dans le projet

1. Dans Supabase, allez dans **Project Settings** (icône engrenage) **>
   API**.
2. Notez deux valeurs :
   - **Project URL** (ex: `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (une longue chaîne commençant par `eyJ...`, dans la
     section **Project API keys**). **N'utilisez jamais** la clé
     `service_role` dans cette application front-end.
3. Dans ce projet, dupliquez le fichier `.env.example` en `.env` :
   ```powershell
   Copy-Item .env.example .env
   ```
4. Ouvrez `.env` et remplacez les valeurs :
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
   ```
5. Sauvegardez. Le fichier `.env` est ignoré par git (`.gitignore`), vos clés
   ne seront donc pas commitées.

## 4. Lancer l'application en local

Dans le dossier `bo2-camo-tracker` :

```powershell
npm install
npm run dev
```

Ouvrez l'URL affichée (en général `http://localhost:5173`). Créez un compte
(email + mot de passe, ou lien magique), et vous êtes prêt à suivre votre
progression.

Pour tester la synchronisation multi-appareils en local : ouvrez l'app dans
un autre navigateur (ou en navigation privée) avec le même compte — les
changements faits sur un appareil apparaissent sur l'autre en temps réel
(grâce à Supabase Realtime), sans besoin de recharger la page.

## 5. Corriger/compléter les données d'armes

Toutes les armes, catégories, camouflages et défis sont dans
[`src/data/weapons.json`](src/data/weapons.json).

**Important** : les défis et valeurs cibles générés dans ce fichier sont des
**valeurs de départ approximatives** (nombre de kills, noms de camouflages
standards, etc.) — à vérifier et corriger vous-même selon vos observations en
jeu, car je n'ai pas de source garantie à 100% précise pour chaque arme.

Structure d'une arme :

```json
{
  "id": "type_25",
  "nom": "Type 25",
  "camouflages": [
    {
      "id": "digital",
      "nom": "Digital",
      "ordre": 1,
      "type": "standard",
      "defis": [
        { "id": "type_25_digital", "description": "Obtenir 50 kills", "valeur_cible": 50 }
      ]
    }
  ]
}
```

- `type` peut être `"standard"`, `"or"` ou `"diamant"` (détermine la couleur
  d'affichage). L'ordre d'affichage des camouflages suit le champ `ordre`.
- Un camouflage peut avoir **plusieurs défis** (ajoutez simplement d'autres
  objets dans le tableau `defis`) — le camouflage est marqué "Débloqué"
  quand **tous** ses défis atteignent leur valeur cible.
- Chaque `defi.id` doit être **unique dans tout le fichier** (il sert de clé
  de synchronisation avec Supabase). Gardez le préfixe `<arme_id>_...` pour
  éviter les collisions si vous ajoutez des défis.
- Vous pouvez ajouter/supprimer des armes ou des catégories librement ; aucune
  modification de code n'est nécessaire, l'app lit ce fichier dynamiquement.

Après modification, relancez simplement `npm run dev` (ou redéployez) pour
voir les changements.

## 6. Déployer gratuitement (Vercel ou Netlify)

### Option A — Vercel

1. Poussez ce projet sur un dépôt GitHub (créez un repo, `git init` si besoin,
   commit, push).
2. Allez sur [vercel.com](https://vercel.com/), connectez-vous avec GitHub.
3. **Add New... > Project**, sélectionnez votre dépôt.
4. Vercel détecte Vite automatiquement (Framework Preset: Vite). Le dossier
   racine du projet à déployer est `bo2-camo-tracker` (si le repo contient
   d'autres dossiers, réglez **Root Directory** en conséquence dans les
   options du projet).
5. Dans **Environment Variables**, ajoutez :
   - `VITE_SUPABASE_URL` = votre Project URL
   - `VITE_SUPABASE_ANON_KEY` = votre clé anon public
6. Cliquez **Deploy**. Vous obtenez une URL du type
   `https://bo2-camo-tracker.vercel.app`.

### Option B — Netlify

1. Poussez le projet sur GitHub (comme ci-dessus).
2. Sur [netlify.com](https://netlify.com/) : **Add new site > Import an
   existing project**, choisissez votre dépôt.
3. **Base directory** : `bo2-camo-tracker`.
4. **Build command** : `npm run build`.
5. **Publish directory** : `bo2-camo-tracker/dist`.
6. Dans **Site settings > Environment variables**, ajoutez
   `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` comme ci-dessus.
7. Déployez.

Dans les deux cas, une fois déployé, retournez dans Supabase >
**Authentication > URL Configuration** et ajoutez l'URL de votre site déployé
dans **Site URL** / **Redirect URLs**, sinon le lien magique par email vous
redirigera vers `localhost`.

## 7. Ajouter l'app à l'écran d'accueil du téléphone

L'app inclut un `manifest.webmanifest` permettant de l'installer comme une
app quasi-native :

- **Android (Chrome)** : ouvrez l'URL déployée → menu (⋮) → **Ajouter à
  l'écran d'accueil** / **Installer l'application**.
- **iPhone (Safari)** : ouvrez l'URL → bouton **Partager** → **Sur l'écran
  d'accueil**.

Note : ajoutez deux icônes `public/icon-192.png` et `public/icon-512.png`
(images carrées PNG, fond opaque) pour une icône propre sur l'écran
d'accueil — sans elles, l'app fonctionne quand même mais utilise une icône
par défaut du navigateur.

---

## Stack technique

- **React 18 + Vite** — interface.
- **Tailwind CSS** — thème sombre inspiré de l'esthétique Call of Duty.
- **Supabase** — Auth (email/mot de passe + lien magique), Postgres
  (table `progression`), Realtime (sync instantanée entre appareils).

## Structure du projet

```
bo2-camo-tracker/
├── src/
│   ├── data/weapons.json       # Armes, camouflages, défis (éditable)
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   └── weaponsUtils.js     # Calculs de progression
│   ├── hooks/useProgression.js # Fetch + upsert + Realtime
│   ├── context/AuthContext.jsx
│   └── components/
│       ├── Login.jsx
│       ├── Header.jsx
│       ├── CategoryList.jsx
│       ├── WeaponCard.jsx
│       ├── CamoSection.jsx
│       ├── ChallengeRow.jsx
│       ├── ProgressBar.jsx
│       └── ConfirmModal.jsx
└── supabase/schema.sql         # Table + RLS + Realtime à exécuter sur Supabase
```
