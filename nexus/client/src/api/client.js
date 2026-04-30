/**
 * Core API client with demo mode fallback.
 *
 * When VITE_DEMO_MODE=true or the server returns { source: 'demo' },
 * requests resolve with bundled demo data instead of hitting the network.
 */

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Build a full API URL from a relative path.
 * @param {string} path – e.g. '/api/roadmap/generate'
 * @returns {string}
 */
export function buildApiUrl(path) {
  return `${BASE_URL}${path}`;
}

/**
 * Generic fetch wrapper with automatic demo-mode fallback.
 *
 * @param {Object}  options
 * @param {string}  options.path         – API path (e.g. '/api/roadmap/generate')
 * @param {string}  [options.method]     – HTTP method (default: 'GET')
 * @param {Object}  [options.body]       – JSON-serialisable request body
 * @param {string}  [options.token]      – Bearer token for Authorization header
 * @param {*}       options.fallbackData – Data returned when in demo mode
 * @returns {Promise<*>}
 */
export async function apiRequest({ path, method = 'GET', body, token, fallbackData }) {
  // ── Demo mode shortcut ──────────────────────────────────────────────
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return fallbackData;
  }

  // ── Live request ────────────────────────────────────────────────────
  try {
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fetchOptions = { method, headers };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(buildApiUrl(path), fetchOptions);

    if (!response.ok) {
      throw new Error(`API ${method} ${path} failed with status ${response.status}`);
    }

    const data = await response.json();

    // Server signalled demo mode — treat as demo fallback
    if (data && data.source === 'demo') {
      return { ...fallbackData, ...data };
    }

    return data;
  } catch {
    // Network error / server unreachable — graceful demo fallback
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return fallbackData;
  }
}
