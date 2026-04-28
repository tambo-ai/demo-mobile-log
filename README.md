# Mobile Log

A demo Expo/React Native app showing how to integrate `@tambo-ai/react` on mobile. It's a simple activity logger where each Tambo thread is a conversation-style log entry.

Expo 55 / React Native 0.83 / React 19.

## Setup

```sh
npm install
```

Create a `.env` file:

```
EXPO_PUBLIC_TAMBO_API_KEY=your_key_here
```

Run:

```sh
npx expo start
```

## Tambo integration

### Provider setup (`app/_layout.tsx`)

Standard `TamboProvider` wrapping the app, with tools and initial messages passed in. A random `userKey` is generated on first launch and persisted with AsyncStorage.

### Rendering the chat UI

Since `@tambo-ai/react`'s built-in components render HTML elements, this app renders everything with React Native primitives (`View`, `Text`, `Pressable`, `FlatList`).

The message renderer (`components/log-entry.tsx`) switches on the content block type:

- **`text`** — chat bubble (`View` + `Text`)
- **`tool_use`** — interactive UI (e.g. `QuickAnswer` with tappable `Pressable` buttons)
- **`component`** — dynamically rendered Tambo components (e.g. `StarRating`, `SummaryCard`) via `ComponentRenderer`
- **`resource`** — inline image via React Native `Image`
- **`tool_result`** — skipped (rendered inline with the corresponding `tool_use`)

The chat screen (`app/log/[id].tsx`) uses an inverted `FlatList` with `KeyboardAvoidingView`.

### Thread management

- `useTamboThreadList` powers the log list screen
- `useTambo` provides `messages`, `startNewThread`, and `switchThread` for the chat screen
- `useTamboThreadInput` handles the input bar state and submission

### Dynamic components (`lib/components.ts`)

Two `TamboComponent` entries are registered via the `components` prop on `TamboProvider`:

- **`StarRating`** — interactive 1-5 star input; uses `useTamboComponentState` to sync the selected rating to the backend
- **`SummaryCard`** — display-only card with key-value pairs for end-of-conversation recaps

The AI decides when to render each component based on the conversation context.

### Blocking prompt tools (`lib/tools.ts`)

The app defines a `ask_multiple_choice` tool whose executor returns a Promise that blocks until the user taps an answer. The SDK's tool executor `await`s tool functions, so a pending Promise simply pauses execution. Meanwhile, the `tool_use` content block streams in and the message renderer shows tappable buttons. When the user taps one, `resolvePrompt()` resolves the Promise and the conversation continues.

## Making `@tambo-ai/react` work on React Native

The SDK targets web browsers. Several things are needed to make it work in React Native's JavaScript runtime.

### Polyfills (`lib/polyfills.ts`)

Imported at the top of `app/_layout.tsx` before any SDK code loads:

| API | Why it's needed | Polyfill |
|-----|----------------|----------|
| `crypto.randomUUID()` / `getRandomValues()` | SDK generates IDs throughout | `expo-crypto` |
| `Array.prototype.toSorted()` | SDK's event accumulator uses this ES2023 method; not available in default Hermes | `[...arr].sort()` shim |
| `Event` / `EventTarget` | The `eventsource` package (SSE streaming) extends these | Minimal class polyfills |
| `fetch` with streaming body | SDK reads SSE response as a stream; React Native's built-in fetch doesn't support `ReadableStream` on the response body | `expo/fetch` replaces `globalThis.fetch` |

All polyfills use runtime guards (`if (!...)`) so they become no-ops if the runtime already provides the API. If you opt in to Hermes v1 (available in Expo 55), the `toSorted` and `Event`/`EventTarget` polyfills will be skipped automatically.

### Metro config (`metro.config.js`)

Two web-only dependencies are stubbed out so Metro doesn't try to bundle them:

- `react-dom` — peer dependency of the SDK, unused on mobile
- `react-media-recorder` — web-only direct dependency of the SDK

```js
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-dom" || moduleName === "react-media-recorder") {
    return { type: "empty" };
  }
  // ...
};
```

### npm overrides (`package.json`)

The SDK lists `react-dom` as a peer dependency, which pulls in a version incompatible with the React version Expo pins. Since we don't use react-dom at all, overrides prevent the resolution conflict:

```json
"overrides": {
  "react-dom": "$react",
  "@types/react-dom": { "@types/react": "$@types/react" }
}
```

## Project structure

```
app/
  _layout.tsx          TamboProvider + Stack navigator
  index.tsx            Log list (thread list)
  log/[id].tsx         Chat screen (single log)
components/
  log-entry.tsx        Message content renderer
  quick-answer.tsx     Multiple-choice button UI
  star-rating.tsx      Star rating input (useTamboComponentState)
  summary-card.tsx     Structured key-value summary card
  input-bar.tsx        Text input + send
lib/
  polyfills.ts         Web API polyfills for React Native runtime
  tools.ts             Tool definitions + resolvePrompt()
  components.ts        TamboComponent registrations
  system-prompt.ts     System prompt and initial messages
metro.config.js        Stubs for web-only dependencies
```
