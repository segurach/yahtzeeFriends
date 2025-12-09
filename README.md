# 🎲 Dice Poker with Friends

Bienvenue sur le projet **Dice Poker with Friends** !
Ce document explique comment installer, lancer et construire l'application pour Android et iOS.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
1.  **Node.js** (LTS recommandé)
2.  **Git**
3.  **Expo CLI** et **EAS CLI** (pour les builds cloud) :
    ```bash
    npm install -g eas-cli
    ```
    *(Note : Expo CLI est désormais inclus avec npx, mais EAS CLI reste nécessaire pour les builds).*

---

## 🚀 Installation

Clonez le projet et installez les dépendances pour **le client** et **le serveur**.

### 1. Serveur (Backend)
Le serveur gère les sockets pour le multijoueur.
```bash
cd server
npm install
```

### 2. Client (Application Mobile)
L'application React Native avec Expo.
```bash
cd client
npm install
```

---

## 🛠️ Lancement en Développement

Pour travailler sur le projet, vous devez lancer le serveur et le client simultanément.

### 1. Démarrer le Serveur Local (Optionnel)
Si vous travaillez en local (pensez à mettre à jour `SERVER_URL` dans `App.js` vers votre IP locale) :
```bash
# Dans le dossier /server
node server.js
```
*Le serveur écoute par défaut sur le port 3000.*
> **Note :** En production, l'application pointe vers le serveur hébergé (ex: Render).

### 2. Démarrer l'Application (Expo)
```bash
# Dans le dossier /client
npx expo start
```
- Appuyez sur `a` pour ouvrir sur **Android Emulator**.
- Appuyez sur `i` pour ouvrir sur **iOS Simulator** (Mac uniquement).
- Scannez le QR Code avec **Expo Go** sur votre téléphone (Android/iOS) si vous êtes sur le même réseau Wifi.

---

## 🏗️ Générer les Builds (Android & iOS)

Nous utilisons **EAS (Expo Application Services)** pour compiler l'application dans le cloud.

### 🔑 Configuration Initiale (Une seule fois)
1.  Connectez-vous à votre compte Expo :
    ```bash
    eas login
    ```
2.  Configurez le projet (déjà fait, fichier `eas.json` existant) :
    ```bash
    eas build:configure
    ```

### 🤖 Android Builds

#### 1. APK Standard (Pour tester sur n'importe quel téléphone)
Génère un fichier `.apk` que vous pouvez installer directement sur votre téléphone sans passer par le store.
> **Profil :** `preview` (configuré dans `eas.json` pour sortir un APK).
```bash
cd client
eas build -p android --profile preview
```

#### 2. Android App Bundle (.AAB) (Pour le Google Play Store)
Génère un fichier `.aab` optimisé par Google. C'est **ce fichier** que vous devez uploader sur la Google Play Console.
> **Profil :** `production`
```bash
cd client
eas build -p android --profile production
```

### 🍎 iOS Builds
*(Nécessite un compte Apple Developer payant, sauf pour le simulateur)*

#### 1. Simulateur iOS (Pour tester sur Mac sans compte Dev)
Génère un fichier pour le simulateur XCode.
```bash
cd client
eas build -p ios --profile preview --simulator
```

#### 2. Production / TestFlight (App Store)
Génère l'archive pour l'App Store Connect.
```bash
cd client
eas build -p ios --profile production
```

---

## 📂 Structure du Projet

```
yahtzee-project/
├── client/              # Application Mobile (React Native / Expo)
│   ├── assets/          # Images, Sons, Splash screens
│   ├── components/      # Composants React (Game, Lobby, CustomModal...)
│   ├── utils/           # Logique jeu, Thèmes
│   ├── App.js           # Point d'entrée principal
│   ├── app.json         # Config Expo (Nom, Splash, Icone, Package Name)
│   └── eas.json         # Config des builds (Profils Dev/Prod)
│
├── server/              # Backend (Node.js / Socket.io)
│   ├── server.js        # Logique serveur (Salles, Tours, Score)
│   └── public/          # Fichiers statiques (Privacy Policy html)
│
└── README.md            # Ce fichier
```

## 📝 Notes Importantes pour le Store

*   **Version Code (Android)** : Pour chaque nouvelle soumission au Play Store, le `versionCode` dans `app.json` (ou géré par EAS) doit être incrémenté. Avec notre config `eas.json`, cela se fait automatiquement (`autoIncrement: true`).
*   **Privacy Policy** : Le fichier `privacy.html` dans `server/public` doit être hébergé et son URL fournie dans la console Google Play.

---
*Développé avec ❤️ pour des parties endiablées de Dice Poker !*
