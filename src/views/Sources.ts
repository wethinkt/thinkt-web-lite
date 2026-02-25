// src/views/Sources.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { getSourceBadgeStyle, createTabbedPanelView } from '../utils';

export function renderSources(container: HTMLElement, headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, headerControls, 'sources', 'Loading sources...');

    apiClient.getSources()
        .then(sources => {
            // Render nice UI
            if (view.listContainer) {
                if (sources.length === 0) {
                    view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">No sources found.</div>`;
                } else {
                    view.listContainer.innerHTML = sources.map(s => {
                        const styleStr = getSourceBadgeStyle(s.name || '');
                        return `
                        <div class="list-item">
                            <div>
                                <div class="list-item-title">
                                    ${s.name}
                                </div>
                                <div class="list-item-meta">
                                    Source: <span class="badge" style="${styleStr}">${s.name}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                ${s.can_resume ? `<span class="badge" title="This source supports continuous conversation history">Resumable</span>` : ''}
                                <div class="source-status online">Online</div>
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
            view.setError(`Failed to load sources: ${err.message}`);
        });
}
