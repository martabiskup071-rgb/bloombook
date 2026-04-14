# 🌿 Bloombook

A mobile app for discovering and collecting plants using AI recognition.

## Features

- 📷 **Camera scan** — photograph any plant
- 🔬 **AI Recognition** — identify plants via Pl@ntNet API
- 🎙️ **Voice memos** — record memories for each plant
- 🗺️ **Map view** — see where you found each plant
- 🎯 **Challenges** — gamified collection goals
- 💾 **Firebase** — cloud sync of your collection

## Tech Stack

- [Expo](https://expo.dev) (SDK 55) + React Native
- [Expo Router](https://expo.github.io/router) for navigation
- [Firebase Firestore](https://firebase.google.com) for data storage
- [Pl@ntNet API](https://my.plantnet.org) for plant recognition
- TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Add your API keys
cp .env.example .env
# Fill in your keys in .env

# Start the app
npx expo start
```

## Environment Variables

```
EXPO_PUBLIC_PLANTNET_API_KEY=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

## Project Structure

```
app/          # Screens (Expo Router)
components/   # Reusable UI components
services/     # API & storage logic
constants/    # Theme & colors
assets/       # Images & fonts
```
