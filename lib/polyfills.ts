// Polyfill web APIs missing from React Native's JS runtime,
// needed by @tambo-ai/react and its dependencies.

import { randomUUID, getRandomValues } from "expo-crypto";
import { fetch as expoFetch } from "expo/fetch";

// Replace the default React Native fetch with Expo's streaming-capable fetch,
// needed by @tambo-ai/typescript-sdk for SSE streaming.
globalThis.fetch = expoFetch as typeof globalThis.fetch;

if (typeof globalThis.crypto === "undefined") {
  // @ts-expect-error minimal polyfill
  globalThis.crypto = {};
}
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = randomUUID;
}
if (!globalThis.crypto.getRandomValues) {
  // @ts-expect-error expo-crypto compatible shim
  globalThis.crypto.getRandomValues = getRandomValues;
}

// Array.prototype.toSorted – ES2023, not available in default Hermes.
// Available natively with Hermes v1 (opt-in in Expo 55).
// Used by @tambo-ai/react's event-accumulator.
if (!Array.prototype.toSorted) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.toSorted = function (compareFn?: (a: any, b: any) => number) {
    return [...this].sort(compareFn);
  };
}

if (typeof globalThis.Event === "undefined") {
  // @ts-expect-error minimal polyfill
  globalThis.Event = class Event {
    type: string;
    constructor(type: string) {
      this.type = type;
    }
  };
}

if (typeof globalThis.EventTarget === "undefined") {
  // @ts-expect-error minimal polyfill
  globalThis.EventTarget = class EventTarget {
    private _listeners: Record<string, Array<(...args: unknown[]) => void>> = {};

    addEventListener(
      type: string,
      callback: (...args: unknown[]) => void,
      options?: { once?: boolean },
    ) {
      if (!this._listeners[type]) this._listeners[type] = [];
      if (options?.once) {
        const wrapped = (...args: unknown[]) => {
          this.removeEventListener(type, wrapped);
          callback(...args);
        };
        this._listeners[type].push(wrapped);
      } else {
        this._listeners[type].push(callback);
      }
    }

    removeEventListener(type: string, callback: (...args: unknown[]) => void) {
      if (!this._listeners[type]) return;
      this._listeners[type] = this._listeners[type].filter(
        (cb) => cb !== callback,
      );
    }

    dispatchEvent(event: { type: string }) {
      const listeners = this._listeners[event.type];
      if (listeners) {
        for (const cb of [...listeners]) cb(event);
      }
      return true;
    }
  };
}
