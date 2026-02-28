// src/views/Languages.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { t } from '../i18n';
import { createTabbedPanelView } from '../utils';

export function renderLanguages(container: HTMLElement, headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, headerControls, 'languages', t('languages.loadingLanguages'));

    apiClient.getLanguages()
        .then(data => {
            const languages = data.languages ?? [];

            if (view.listContainer) {
                if (languages.length === 0) {
                    view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">${t('languages.noLanguagesFound')}</div>`;
                } else {
                    const total = Math.max(...languages.map(l => l.coverage ?? 0));

                    view.listContainer.innerHTML = languages.map(lang => {
                        const count = lang.coverage ?? 0;
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                        return `
                        <div class="list-item">
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span>${lang.english_name || lang.name || lang.tag || t('common.unknown')}</span>
                                    ${lang.name && lang.name !== lang.english_name ? `<span style="color: var(--text-secondary);">(${lang.name})</span>` : ''}
                                    ${lang.active ? `<span class="badge" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24;">★ ${t('languages.active')}</span>` : ''}
                                </div>
                                <div class="list-item-meta">${lang.tag || ''}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                ${lang.coverage != null ? `<span style="color: var(--text-secondary); font-size: 0.85rem;">${t('languages.coverage')} ${pct}% (${count} / ${total})</span>` : ''}
                            </div>
                        </div>
                    `}).join('');
                }
            }

            if (view.jsonContainer) {
                createJsonViewer(view.jsonContainer, {
                    data,
                    filename: 'languages',
                    url: '/api/v1/languages'
                });
            }
        })
        .catch(err => {
            view.setError(t('languages.failedToLoadLanguages', { message: err.message }));
        });
}
