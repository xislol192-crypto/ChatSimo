// The app (src/App.jsx) was originally built for Claude's artifact
// `window.storage` API. This file re-implements that same tiny API on top
// of the browser's localStorage so the app works unmodified as a normal
// Vite/React site. Everything is stored under a "fcs:" namespace prefix.

const NS = "fcs:";

function keyFor(key, shared) {
  return `${NS}${shared ? "shared:" : "personal:"}${key}`;
}

const storage = {
  async get(key, shared = false) {
    try {
      const raw = localStorage.getItem(keyFor(key, shared));
      if (raw == null) return null;
      return { key, value: raw, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
  async set(key, value, shared = false) {
    try {
      localStorage.setItem(keyFor(key, shared), value);
      return { key, value, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
  async delete(key, shared = false) {
    try {
      localStorage.removeItem(keyFor(key, shared));
      return { key, deleted: true, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
  async list(prefix = "", shared = false) {
    try {
      const full = keyFor(prefix, shared);
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(full)) keys.push(k.slice(NS.length + (shared ? 7 : 9)));
      }
      return { keys, prefix, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
};

if (typeof window !== "undefined") {
  window.storage = storage;
}

export default storage;
