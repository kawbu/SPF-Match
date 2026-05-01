# SPFMatch Mobile

SPFMatch Mobile is the Expo/React Native client for the SPFMatch project.

## Repository

This project is intended to be versioned in Git and hosted on GitHub for transport, review, and deployment workflows.

## Install Notes (Quick Start)

### Prerequisites

- Node.js 20+
- npm 10+
- Xcode (for iOS simulator on macOS)
- Android Studio (for Android emulator, optional)
- Expo Go app (optional for device testing)

### Setup

1. From the project root, open the mobile app folder:
   - `cd SPFMatch-Mobile`
2. Install dependencies:
   - `npm install`
3. Start the Expo dev server:
   - `npm run start`
4. Run on a target:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Environment Notes

The app uses Supabase for authentication and data sync. If environment variables are not configured, the app falls back to safe placeholders and local cache behavior where applicable.

## Team Style and Documentation Standards

This repository follows the team’s consistency expectations:

- Keep formatting and naming consistent across files.
- Write comments only when they add context the code alone does not express.
- Avoid obvious comments that restate syntax.
- Keep code, comments, test data, and identifiers professional and public-safe.
- Prefer concise function-level documentation for non-trivial behavior.

For contribution details, see CONTRIBUTING.md.

## Prior-System / External-Origin Code and Data

The following items are not considered original team-authored business logic and should be reviewed accordingly:

- `assets/data/sunscreen-database.json` — seeded dataset derived from upstream SPFMatch data pipeline.
- Generated framework wiring (Expo/React Native scaffolding patterns) where unchanged from tool defaults.
- Third-party SDK usage wrappers (for example Supabase client setup and Expo notifications integration) that follow vendor integration patterns.

When adding new imported legacy modules, annotate provenance in the relevant file header and in pull request notes.

## License

No license file is currently declared in this folder. Add one before public distribution if required by your release policy.
