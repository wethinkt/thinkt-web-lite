// src/views/Sources.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { t } from '../i18n';
import { getSourceBadgeStyle, createTabbedPanelView } from '../utils';

export function renderSources(container: HTMLElement, headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, headerControls, 'sources', t('sources.loadingSources'));

    apiClient.getSources()
        .then(sources => {
            // Render nice UI
            if (view.listContainer) {
                if (sources.length === 0) {
                    view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">${t('sources.noSourcesFound')}</div>`;
                } else {
                    view.listContainer.innerHTML = sources.map(s => {
                        const badgeStyle = getSourceBadgeStyle(s.name || '');
                        return `
                        <div class="list-item">
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span class="badge" style="${badgeStyle}">${s.name}</span>
                                </div>
                                <div class="list-item-meta">${s.base_path || ''}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                ${s.can_resume ? `<span class="badge" title="${t('sources.resumableTooltip')}">${t('sources.resumable')}</span>` : ''}
                                <div class="source-status online">${t('status.online')}</div>
                            </div>
                        </div>
                    `}).join('');
                }
            }

            // Mount shared JSON viewer in the Raw JSON tab
            if (view.jsonContainer) {
                createJsonViewer(view.jsonContainer, {
                    data: sources,
                    filename: 'sources',
                    url: '/api/v1/sources'
                });
            }
        })
        .catch(err => {
            view.setError(t('sources.failedToLoadSources', { message: err.message }));
        });
}
