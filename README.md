# Mobile Log

A chat-first mobile logging app built with [Tambo](https://tambo.co) and Expo. Each Tambo thread is a "log" — the AI asks contextual follow-up questions about each entry, rendered as tappable multiple-choice buttons. Answers are stored naturally in the conversation history.

Great for logging activities like cooking, woodworking, hiking, repairs, and other hands-on projects where typing on mobile is tedious.

## How it works

1. Tap **+** to start a new log
2. Describe what you're working on (or snap a photo)
3. The AI asks follow-up questions — some as tappable buttons, some as free text
4. After a few exchanges, it summarizes a structured log entry

### The "Prompt Tools" pattern

The app uses a pattern where the AI calls tools that render as interactive UI. The tool returns a Promise that **blocks until the user taps an answer**:

```
AI calls: ask_multiple_choice({ question: "What technique?", options: ["Sautéing", "Braising", "Grilling"] })
  → Renders tappable buttons
  → User taps "Braising"
  → Promise resolves, result sent back to AI
  → AI continues the conversation
```

See `lib/tools.ts` for the implementation.

## Setup

```sh
npm install
```

Create a `.env` file with your Tambo API key:

```
EXPO_PUBLIC_TAMBO_API_KEY=your_key_here
```

## Running

```sh
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

## React Native polyfills

`@tambo-ai/react` targets web by default. This app polyfills several APIs that React Native's JS runtime doesn't provide (see `lib/polyfills.ts`):

- **`crypto.randomUUID()` / `crypto.getRandomValues()`** — via `expo-crypto`
- **`Event` / `EventTarget`** — needed by the `eventsource` package for SSE streaming
- **`fetch` with streaming support** — React Native's built-in fetch doesn't support readable streams; replaced with `expo/fetch`
- **`react-dom` / `react-media-recorder`** — stubbed out in `metro.config.js` (web-only deps)

## Project structure

```
app/
  _layout.tsx          TamboProvider + Stack navigator
  index.tsx            Log list (thread list)
  log/[id].tsx         Single log view (chat screen)
components/
  log-entry.tsx        Message renderer (text, tool_use, resource)
  quick-answer.tsx     Multiple-choice buttons
  input-bar.tsx        Text input + send button
lib/
  polyfills.ts         React Native polyfills for web APIs
  tools.ts             ask_multiple_choice tool + resolvePrompt()
  system-prompt.ts     System prompt and initial messages
```

## Stack

- [Expo](https://expo.dev) 54 / React Native 0.81
- [React](https://react.dev) 19
- [@tambo-ai/react](https://www.npmjs.com/package/@tambo-ai/react) SDK
- [Expo Router](https://docs.expo.dev/router/introduction/) for navigation
