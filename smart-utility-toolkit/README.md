# Smart Utility Toolkit

A mobile utility app built with **React Native + Expo**, featuring a unit converter, task/checklist manager, and notes — all with offline persistence via SQLite.

---

## Features

### 🔄 Unit Converter
- Convert **Length**, **Weight**, **Temperature**, and **Currency** units
- Live currency rates via open API
- Conversion history persisted via Zustand

### ✅ Task / Checklist Manager *(Stage 1 — new)*
- Create, edit, and delete tasks
- Mark tasks as completed with a single tap
- Set task **priority** (Low / Medium / High)
- Filter tasks: **All**, **Active**, or **Done**
- Search tasks by title or description
- **Clear completed** tasks in one go
- Fully **offline** — persisted locally with **SQLite**

### 📝 Notes
- Create and edit rich-text notes
- Categorise and search notes
- Offline-first with SQLite

### 🛠 Helpers
- Quick-access utility tools

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo SDK 52 |
| Navigation | Expo Router (file-based) |
| Local Storage | expo-sqlite (SQLite) |
| Global State | Zustand |
| Styling | StyleSheet (Design Tokens) |
| Build | EAS Build |

---

## Project Structure

```
app/
  (tabs)/
    converter.tsx   # Unit converter screen
    tasks.tsx       # Task manager screen  ← NEW
    notes.tsx       # Notes list screen
    helpers.tsx     # Utility helpers screen
  notes/            # Note detail routes

features/
  converter/        # Converter logic, store, services
  tasks/            # Task feature
    hooks/
      useTasks.ts   # SQLite CRUD hook
    components/
      TaskCard.tsx  # Task row with checkbox, badges, actions
      TaskForm.tsx  # Create / Edit modal
  notes/            # Notes hooks

lib/
  sqlite/index.ts   # DB init (notes + tasks tables)
  design/tokens.ts  # Design system tokens

components/
  ui/               # AppText, Button, Card, Input, EmptyState, ScreenWrapper
```

---

## Running Locally

### Prerequisites
- Node 18+
- Expo CLI (`npm i -g expo-cli`)
- Xcode (iOS) or Android Studio (Android)

```bash
# Install dependencies
npm install

# Start Metro bundler
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator / device
npx expo run:android
```

---

## Build (Production APK / IPA)

```bash
# Android APK (local)
cd android && ./gradlew assembleRelease

# iOS simulator build (local)
npx expo run:ios --configuration Release

# Cloud builds via EAS
eas build -p android --profile production
eas build -p ios    --profile production
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Offline Support

All task and note data is stored locally using **expo-sqlite**. The app works fully offline — no internet connection required for the task manager or notes features. Currency conversion rates are cached and fall back gracefully when offline.

---

## License

MIT
