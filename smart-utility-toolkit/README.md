# Smart Utility Toolkit

A production-quality Expo React Native app combining three connected utility modules in one clean, scalable product.

## Features

### 🔄 Unit Converter
- Length, weight, temperature, and live currency conversions
- Real-time currency rates via TanStack Query with offline caching
- Swap units interaction and conversion history (Zustand)

### 📝 Notes
- Create, edit, delete, and search notes
- Persisted locally with expo-sqlite (WAL mode)
- Category tags, empty states, and clean editor

### 🛠 Daily Helpers
- **Bill Splitter** — divide expenses evenly
- **Tip Calculator** — quick tip math with preset percentages
- **Fuel Estimator** — estimate trip fuel costs
- **Percentage Math** — calculate discounts and differences
## Architecture

```
app/              # Expo Router file-based routing
  (tabs)/         # Bottom tab navigator
  notes/          # Note editor stack screens
  helpers/        # Helper tool stack screens
components/ui/    # Shared design system components
features/         # Feature-first domain logic
  converter/      # Conversion services, store
  notes/          # SQLite repository hooks
  helpers/        # Pure calculation formulas
lib/              # Infrastructure (sqlite, design tokens)
providers/        # React context providers
tests/            # Unit tests
```

**Key patterns:**
- Feature-first architecture — domain logic isolated from UI
- Pure functions for all calculations — testable, no React dependencies
- Thin screens — business logic lives in services/hooks, not components
- Design tokens — single source of truth for colors, spacing, typography

## Tech Stack
- **Expo SDK 54** + Expo Router
- **TypeScript** (strict mode)
- **Zustand** for client state
- **TanStack Query** for remote data
- **expo-sqlite** for local persistence
## Getting Started

```bash
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

For native builds:
```bash
npx expo run:ios --device
```
