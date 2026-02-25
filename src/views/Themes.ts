// src/views/Themes.ts
import { rawApiFetch } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { createThemePreview } from '../components/ThemePreview';
import { ThemeColors } from '@wethinkt/ts-thinkt';

import { createTabbedPanelView } from '../utils';

interface ThemeInfo {
    name: string;
    description?: string;
    active?: boolean;
    built_in?: boolean;
    colors?: ThemeColors;
}

export function renderThemes(container: HTMLElement, headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, headerControls, 'themes', 'Loading themes...');

    // Fetch using rawApiFetch as Theme response doesn't have an adapter in client yet
    rawApiFetch('/api/v1/themes')
        .then((data: { themes?: ThemeInfo[]; active?: string }) => {
            const themes: ThemeInfo[] = (data.themes || []).sort((a, b) => {
                // Active themes bubble to the top
                if (a.active && !b.active) return -1;
                if (!a.active && b.active) return 1;
                return a.name.localeCompare(b.name);
            });

            if (view.listContainer) {
                if (themes.length === 0) {
                    view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">No themes found.</div>`;
                } else {
                    view.listContainer.innerHTML = `
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                            Preview the available themes from the connected Thinkt API.
                        </p>
                    `;
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
                        view.listContainer!.appendChild(card);

                        // Auto-expand the active theme
                        if (theme.active) {
                            header.click();
                        }
                    });
                }
            }

            if (view.jsonContainer) {
                createJsonViewer(view.jsonContainer, {
                    data: data,
                    filename: 'themes',
                    url: '/api/v1/themes'
                });
            }
        })
        .catch((err: Error) => {
            view.setError(`Failed to load themes: ${err.message}`);
        });
}
