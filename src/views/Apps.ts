// src/views/Apps.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { createTabbedPanelView } from '../utils';

export function renderApps(container: HTMLElement, headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, headerControls, 'apps', 'Loading apps...');

    apiClient.getOpenInApps()
        .then(apps => {
            if (view.listContainer) {
                if (apps.length === 0) {
                    view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">No allowed apps found.</div>`;
                } else {
                    view.listContainer.innerHTML = apps.map(app => `
                        <div class="list-item">
                            <div>
                                <div class="list-item-title">${app.name}</div>
                            </div>
                        </div>
                    `).join('');
                }
            }

            if (view.jsonContainer) {
                createJsonViewer(view.jsonContainer, {
                    data: apps,
                    filename: 'allowed-apps',
                    url: '/api/v1/open-in/apps'
                });
            }
        })
        .catch(err => {
            view.setError(`Failed to load apps: ${err.message}`);
        });
}
