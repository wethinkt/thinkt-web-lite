export function downloadJson(filename: string, data: any) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function syntaxHighlight(json: string): string {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {
        console.error('Failed to copy to clipboard', e);
        return false;
    }
}

export function getSourceBadgeStyle(sourceName: string): string {
    const normalized = sourceName.toLowerCase();

    // Check our known providers mapping to CSS variables
    const knownProviders = ['claude', 'kimi', 'gemini', 'codex', 'copilot', 'qwen'];
    if (knownProviders.includes(normalized)) {
        return `color: var(--source-${normalized}-color); background: var(--source-${normalized}-bg); border: 1px solid var(--source-${normalized}-color);`;
    }
    
    // Default style
    return 'color: var(--text-secondary); background: var(--border-color);';
}
