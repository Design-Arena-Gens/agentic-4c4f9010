![Panda AI Logo](./public/panda-logo.svg)

# Panda AI by Max

Panda AI by Max is a playful, privacy-first voice assistant for the web. It pairs the Web Speech APIs with an AI chat backend, smart command shortcuts, and a rich Material-inspired UI that can be deployed instantly to Vercel.

## ✨ Features

- “Speak Now” mic workflow using browser speech recognition with audible chime feedback.
- AI chat backed by the `/api/assistant` route (OpenAI GPT model by default) and friendly TTS responses.
- Smart redirects for actions like opening YouTube, WhatsApp, Instagram, Google searches, tel/sms links, calendar event creation, and alarm shortcuts.
- Animated conversation UI with persistent chat history, clear chat button, typing fallback, and “thinking” indicator.
- Splash screen, listening visualizer, glowing header state, and theme-aware Material styling.
- Settings drawer for assistant name, voice selection, and speaking rate stored locally.
- Privacy policy page outlining runtime permission expectations for Google Play compliance.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore Panda AI locally. The splash screen hides after ~1.5 seconds.

## 🔑 Configure Your AI Provider

This project includes an API route that proxies requests to OpenAI. To enable full responses:

1. Copy `.env.example` to `.env.local` (create one if it doesn’t exist yet) and set:

   ```bash
   OPENAI_API_KEY=sk-your-key-here
   ```

2. Restart `npm run dev`.

Without a key, Panda AI replies with a friendly placeholder response. You can swap the fetch call inside `src/app/api/assistant/route.ts` for Gemini or any other provider.

## 🧪 Recommended Checks

- `npm run lint` – ESLint verification
- `npm run dev` – manual smoke test of voice flow, typed messaging, smart commands, and dark/light mode

The Web Speech API requires a secure context (HTTPS or `localhost`) and works best in Chromium-based browsers.

## 📱 Deploying to Google Play

Although this project runs on the web, the UI, privacy copy, and permission handling map directly to mobile requirements:

- Request microphone access only on user interaction.
- Surface privacy policy text within the app (see `/privacy`) and link it in your Play listing.
- Describe AI usage, data handling, and runtime consent in your store assets.

## ☁️ Deploy to Vercel

1. Ensure the `OPENAI_API_KEY` secret is configured in Vercel (`vercel env add` or via dashboard).
2. Run the deployment command:

   ```bash
   vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-4c4f9010
   ```

3. Verify the production URL once deployment finishes: `https://agentic-4c4f9010.vercel.app`

## 📂 Project Structure Highlights

- `src/app/page.tsx` – main UI surface, speech handling, command routing, and conversation state.
- `src/app/api/assistant/route.ts` – AI proxy with configurable model.
- `src/context/settings.tsx` – local storage powered settings provider.
- `src/lib/intentHandler.ts` – smart command detection.
- `src/lib/storage.ts` – chat persistence helpers.
- `src/components/*` – all UI building blocks.
- `src/app/privacy/page.tsx` – privacy policy screen.

Enjoy hacking on Panda AI and extend it with your own automations, vector memory, or multimedia responses!
