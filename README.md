# Rizwan Online Center

A responsive Hindi-first React + Vite frontend prototype for a full online service center.

## Included
- Responsive home page and service catalogue
- Search and category filters
- Request form and WhatsApp share handoff
- Browser-session request list / tracking demo
- About page, demo admin panel, privacy reminders
- PWA manifest for installable web experience

## Run locally
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.
4. Run `npm run build` to build static files in `dist/`.

## Important prototype limits
This is a frontend prototype, not a production service. Requests are stored only in React state and disappear on refresh. There is no real server, database, login, payment processing, document upload, OTP, or official government portal integration. Prices are sample placeholders and must be verified/replaced before launch. Do not collect Aadhaar numbers, OTPs, passwords, or sensitive documents through an unsecured form.

## Website hosting
Build with `npm run build`, then deploy the `dist/` folder to a static host such as Netlify, Vercel, or your hosting provider. Configure SPA fallback to `index.html`.

## Android app
This project is a mobile-friendly installable PWA. To publish a native Android APK, wrap the hosted site using Capacitor or build a separate native app. Before launch, add a backend API, secure admin authentication, privacy policy, terms, service provider details, and verified official service links. Payments require a compliant payment gateway integration and server-side verification.
