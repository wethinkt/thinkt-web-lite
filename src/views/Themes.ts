// src/views/Themes.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { createThemePreview } from '../components/ThemePreview';
import { ThemeInfo } from '@wethinkt/ts-thinkt';
import { getLocale, t } from '../i18n';

import { createTabbedPanelView } from '../utils';

export function renderThemes(container: HTMLElement, headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, headerControls, 'themes', t('themes.loadingThemes'));

    apiClient.getThemes()
        .then(data => {
            const themes: ThemeInfo[] = (data.themes || []).sort((a, b) => {
                // Active themes bubble to the top
                if (a.active && !b.active) return -1;
                if (!a.active && b.active) return 1;
                return (a.name || '').localeCompare(b.name || '', getLocale(), { sensitivity: 'base' });
            });

            if (view.listContainer) {
                if (themes.length === 0) {
                    view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">${t('themes.noThemesFound')}</div>`;
                } else {
                    view.listContainer.innerHTML = `
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                            ${t('themes.previewDescription')}
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
                                    ${theme.name || t('themes.unnamed')}
                                    ${theme.active ? `<span class="badge success">${t('themes.active')}</span>` : ''}
                                    ${theme.embedded ? `<span class="badge">${t('themes.builtIn')}</span>` : ''}
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
                                createThemePreview(previewWrapper, theme.colors, theme.name || t('themes.unnamed'));
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
            view.setError(t('themes.failedToLoadThemes', { message: err.message }));
        });
}
