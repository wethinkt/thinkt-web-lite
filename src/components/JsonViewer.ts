// src/components/JsonViewer.ts
import { syntaxHighlight, copyToClipboard, downloadJson } from '../utils';

export interface JsonViewerOptions {
    data: any;
    filename: string;
    url?: string;
}

export function createJsonViewer(container: HTMLElement, options: JsonViewerOptions) {
    const cleanFilename = options.filename.replace(/[^a-zA-Z0-9]/g, '-');
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="${options.url}" target="_blank" rel="noopener" style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; color: var(--accent-color); text-decoration: none; opacity: 0.9;" title="Open raw data in new tab">${options.url ?? ''}</a>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                <button class="btn btn-sm" id="btn-copy-${cleanFilename}">📋 Copy API Response</button>
                <button class="btn btn-sm" id="btn-download-${cleanFilename}">⬇️ Download JSON</button>
            </div>
        </div>
        <div class="json-view" style="flex: 1; width: 100%; overflow: auto;">${syntaxHighlight(JSON.stringify(options.data, null, 2))}</div>
    `;

    // Copy to clipboard
    const copyBtn = document.getElementById(`btn-copy-${cleanFilename}`);
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const success = await copyToClipboard(JSON.stringify(options.data, null, 2));
            const oldText = copyBtn.textContent;
            copyBtn.textContent = success ? '✅ Copied!' : '❌ Failed';
            setTimeout(() => { copyBtn.textContent = oldText; }, 2000);
        });
    }

    // Download JSON file
    const dlBtn = document.getElementById(`btn-download-${cleanFilename}`);
    if (dlBtn) {
        dlBtn.addEventListener('click', () => {
            downloadJson(`${cleanFilename}.json`, options.data);
        });
    }
}
