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

export interface TabbedView {
    listContainer: HTMLElement | null;
    jsonContainer: HTMLElement | null;
    setError: (message: string) => void;
}

export function createTabbedPanelView(
    container: HTMLElement,
    headerControls: HTMLElement | null | undefined,
    viewId: string,
    loadingText: string = 'Loading...'
): TabbedView {
    container.innerHTML = `
        <div class="panel">
            <div id="${viewId}-rendered" class="tab-content active">
                <div id="${viewId}-list" class="loading">${loadingText}</div>
            </div>
            <div id="${viewId}-raw" class="tab-content">
                <div id="${viewId}-json-container"></div>
            </div>
        </div>
    `;

    const tabsHtml = `
        <div class="tabs-header">
            <button class="tab-btn active" data-target="${viewId}-rendered">Rendered</button>
            <button class="tab-btn" data-target="${viewId}-raw">Raw JSON</button>
        </div>
    `;

    if (headerControls) {
        headerControls.innerHTML = tabsHtml;
    } else {
        const fallbackHeader = document.createElement("div");
        fallbackHeader.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 1rem;";
        fallbackHeader.innerHTML = tabsHtml;
        container.insertBefore(fallbackHeader, container.firstChild);
    }

    const listContainer = document.getElementById(`${viewId}-list`);
    const jsonContainer = document.getElementById(`${viewId}-json-container`);
    const tabBtns = (headerControls || container).querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = (e.target as HTMLElement).getAttribute('data-target');

            tabBtns.forEach(b => b.classList.remove('active'));
            (e.target as HTMLElement).classList.add('active');

            tabContents.forEach(c => {
                c.classList.remove('active');
                if (c.id === targetId) c.classList.add('active');
            });
        });
    });

    return {
        listContainer,
        jsonContainer,
        setError: (message: string) => {
            if (listContainer) listContainer.innerHTML = `<div class="error">${message}</div>`;
            if (jsonContainer) jsonContainer.innerHTML = `<div class="error">${message}</div>`;
        }
    };
}


