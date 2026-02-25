import { getDefaultClient } from '@wethinkt/ts-thinkt';

export const apiClient = getDefaultClient();

// The Vite dev server proxies /api to the Go backend.
// We configure the client to hit relative paths.
apiClient.setConfig({
    baseUrl: ''
});

// Since the client doesn't have a typed getOpenInApps yet, we export a raw fetch helper
// that injects the authorization header from the client config (or relies on the proxy).
export async function rawApiFetch(path: string, options: RequestInit = {}) {
    const res = await fetch(path, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
}
