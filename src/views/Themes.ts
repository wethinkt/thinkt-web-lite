// src/views/Themes.ts
import { rawApiFetch } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { createThemePreview } from '../components/ThemePreview';
import { ThemeColors } from '@wethinkt/ts-thinkt';

interface ThemeInfo {
    name: string;
    description?: string;
    active?: boolean;
    built_in?: boolean;
    colors?: ThemeColors;
}

export function renderThemes(container: HTMLElement, headerControls?: HTMLElement | null) {
    container.innerHTML = `
        <div class="panel">
            <div id="themes-rendered" class="tab-content active">
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    Preview the available themes from the connected Thinkt API.
                </p>
                <div id="themes-list" class="loading">Loading themes...</div>
            </div>
            
            <div id="themes-raw" class="tab-content">
                <div id="themes-json-container"></div>
            </div>
        </div>
    `;

    if (headerControls) {
        headerControls.innerHTML = `<div class="tabs-header">
                    <button class="tab-btn active" data-target="themes-rendered">Rendered</button>
                    <button class="tab-btn" data-target="themes-raw">Raw JSON</button>
                </div>`;
    } else {
        // Fallback if no global header
        const fallbackHeader = document.createElement("div");
        fallbackHeader.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 1rem;";
        fallbackHeader.innerHTML = `<div class="tabs-header">
                    <button class="tab-btn active" data-target="themes-rendered">Rendered</button>
                    <button class="tab-btn" data-target="themes-raw">Raw JSON</button>
                </div>`;
        container.insertBefore(fallbackHeader, container.firstChild);
    }

    const listContainer = document.getElementById('themes-list');
    const jsonContainer = document.getElementById('themes-json-container');
    const tabBtns = (headerControls || container).querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    // Handle tab switching
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

    // Fetch using rawApiFetch as Theme response doesn't have an adapter in client yet
    rawApiFetch('/api/v1/themes')
        .then((data: { themes?: ThemeInfo[]; active?: string }) => {
            const themes: ThemeInfo[] = (data.themes || []).sort((a, b) => {
                // Active themes bubble to the top
                if (a.active && !b.active) return -1;
                if (!a.active && b.active) return 1;
                return a.name.localeCompare(b.name);
            });

            if (listContainer) {
                if (themes.length === 0) {
                    listContainer.innerHTML = `<div style="color: var(--text-secondary);">No themes found.</div>`;
                } else {
                    listContainer.innerHTML = '';
                    themes.forEach((theme, i) => {
                        const card = document.createElement('div');
                        card.style.marginBottom = '0.75rem';

                        // Header (clickable)
                        const header = document.createElement('div');
                        header.className = 'list-item';
                        header.style.cursor = 'pointer';
                        header.style.background = 'var(--bg-color)';
                        header.style.borderRadius = '6px';
                        header.style.border = '1px solid var(--border-color)';

                        header.innerHTML = `
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${theme.name}
                                    ${theme.active ? '<span class="badge success">Active</span>' : ''}
                                    ${theme.built_in ? '<span class="badge">Built-in</span>' : ''}
                                </div>
                                ${theme.description ? `<div class="list-item-meta">${theme.description}</div>` : ''}
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">
                                <span class="toggle-icon">▼</span>
                            </div>
                        `;



                        const previewWrapper = document.createElement('div');
                        previewWrapper.id = `theme-preview-${i}`;
                        previewWrapper.style.display = 'none';
                        previewWrapper.style.marginTop = '0.5rem';
                        let previewRendered = false;

                        header.addEventListener('click', () => {
                            const isHidden = previewWrapper.style.display === 'none';
                            previewWrapper.style.display = isHidden ? 'block' : 'none';
                            header.querySelector('.toggle-icon')!.textContent = isHidden ? '▲' : '▼';

                            // Lazy render the preview components only when opening the first time
                            if (isHidden && !previewRendered && theme.colors) {
                                createThemePreview(previewWrapper, theme.colors, theme.name);
                                previewRendered = true;
                            }
                        });

                        card.appendChild(header);
                        card.appendChild(previewWrapper);
                        listContainer.appendChild(card);

                        // Auto-expand the active theme
                        if (theme.active) {
                            header.click();
                        }
                    });
                }
            }

            if (jsonContainer) {
                createJsonViewer(jsonContainer, {
                    data: data,
                    filename: 'themes',
                    url: '/api/v1/themes'
                });
            }
        })
        .catch((err: Error) => {
            if (listContainer) listContainer.innerHTML = `<div class="error">Failed to load themes: ${err.message}</div>`;
            if (jsonContainer) jsonContainer.innerHTML = `<div class="error">Failed to load themes: ${err.message}</div>`;
        });
}
