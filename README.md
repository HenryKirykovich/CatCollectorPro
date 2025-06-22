# Cat Collection App

This is a 3-page React Native application built using Expo and Supabase as part of the Bellevue College course DEV 272 - Server Side Web Development.

## Demo & Preview

**Preview via Expo**  
[View latest update](https://expo.dev/preview/update?message=add%20displaying%20pictures%20on%20add%20detect%20breed&updateRuntimeVersion=1.0.0&createdAt=2025-06-16T02%3A42%3A31.602Z&slug=exp&projectId=5e72242f-4cee-473d-bb5f-f4a56cf35839&group=9c39fbf1-73d6-458a-bf0c-421d9868eaff)  
 


This link opens a live version of the app and displays a QR code for mobile access.

### How to Try the App (Client Instructions)

#### Option 1: 📱 Using Expo Go (Recommended)
1. Install the **Expo Go** app on your phone: [expo.dev/client](https://expo.dev/client)
2. Open this link on desktop: [https://expo.dev/@groo21021984/catalyze](https://expo.dev/@groo21021984/catalyze)
3. Scan the QR code using the **Expo Go** app
4. The app will load instantly — no installation needed

#### Option 2: 🟢 Android APK (optional)
If the client doesn’t want to install Expo Go, a separate `.apk` can be built and shared using `eas build`.

---

## Pages

1. Home Screen – List of all cats with a search bar and filter  
2. Cat Details – Details of selected cat (origin, description, image)  
3. Add New Cat – Form to add a new cat (with validation and image upload)

## Technologies Used

| Technology           | Purpose                                |
|----------------------|----------------------------------------|
| Expo Router          | App navigation (tabs, stack, layout)   |
| React Native         | Building cross-platform UI             |
| Supabase             | Database and file/image storage        |
| React Query          | Client-side data caching and sync      |
| TypeScript           | Type safety and scalability            |
| Jest + Testing Library | Component and UI testing            |
| ESLint + Prettier    | Code quality and formatting            |
| Husky                | Pre-commit hook to run lint and tests  |

## Features Implemented

- Global Context API to manage cat data
- Supabase integration for backend services
- Favorites toggle with persistent state
- Real-time image upload using Expo Image Picker
- Testing setup with Jest and RTL
- Code validation via ESLint and Prettier
- Git hooks with Husky for commit safety

## What I Learned

- Connecting a front-end app to a real backend (Supabase)
- Structuring a React Native app using modern Expo practices
- Implementing global state using React Context
- Writing and running unit tests in a mobile environment
- Using pre-commit hooks to maintain code quality

## Developer

**Henadzi Kirykovich**  
Student, Software Development – Bellevue College  
DEV 272 – Spring 2025
