// Minimal polyfills to satisfy node-style globals used by some libs (e.g. pbkdf2)
// This file must be imported before other modules.

/* global window, globalThis */

if (typeof globalThis.global === 'undefined') {
  // define global for libs that expect Node global
  globalThis.global = globalThis;
}

if (typeof globalThis.process === 'undefined') {
  // minimal process.env for libraries that read process.env
  globalThis.process = { env: {} };
}

// Buffer might be required by some packages; set if missing (not full polyfill)
try {
  if (typeof globalThis.Buffer === 'undefined') {
    // try to load a lightweight buffer polyfill if available
    // otherwise skip — many libs won't need Buffer in the browser
    // eslint-disable-next-line no-undef
    // Note: do not throw if `require` is not available in ESM build
  }
} catch (e) {
  // ignore
}
