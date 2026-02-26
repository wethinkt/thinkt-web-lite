import { getDefaultClient } from '@wethinkt/ts-thinkt';

export const apiClient = getDefaultClient();

// The Vite dev server proxies /api to the Go backend.
// We configure the client to hit relative paths.
apiClient.setConfig({
    baseUrl: ''
});


