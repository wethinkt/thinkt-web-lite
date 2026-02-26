import { getDefaultClient } from '@wethinkt/ts-thinkt';

export const apiClient = getDefaultClient();

// Read auth token from URL hash fragment (#token=...).
// The server passes it this way so it never appears in server logs.
function getTokenFromHash(): string | undefined {
    const hash = window.location.hash;
    if (!hash) return undefined;
    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('token') ?? undefined;
    // Clear the token from the URL bar to avoid leaking it in copy/paste
    if (token) {
        window.history.replaceState(null, '', window.location.pathname);
    }
    return token;
}

const token = getTokenFromHash();

// The Vite dev server proxies /api to the Go backend.
// We configure the client to hit relative paths.
apiClient.setConfig({
    baseUrl: '',
    ...(token ? { token } : {}),
});
