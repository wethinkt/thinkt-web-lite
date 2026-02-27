// src/views/Apps.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { t } from '../i18n';
import { createTabbedPanelView } from '../utils';

export function renderApps(container: HTMLElement, headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, headerControls, 'apps', t('apps.loadingApps'));

    apiClient.getOpenInApps()
        .then(response => {
            const apps = response.apps || [];
            const defaultTerminal = response.default_terminal;
            if (view.listContainer) {
                if (apps.length === 0) {
                    view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">${t('apps.noAppsConfigured')}</div>`;
                    return;
                } else {
                    view.listContainer.innerHTML = apps.map((app: any) => {
                        const badges: string[] = [];
                        if (app.terminal) {
                            const isDefault = app.id === defaultTerminal;
                            badges.push(`<span class="badge" style="background: rgba(20, 184, 166, 0.12); border: 1px solid rgba(20, 184, 166, 0.35); color: #2dd4bf;" title="${t('apps.terminalApp')}">${t('apps.terminal')}</span>`);
                            if (isDefault) {
                                badges.push(`<span class="badge" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24;" title="${t('apps.defaultTerminal')}">★ ${t('apps.default')}</span>`);
                            }
                        }
                        return `
                        <div class="list-item">
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${app.name}
                                    ${badges.join('')}
                                </div>
                                <div class="list-item-meta">${app.id} · ${app.enabled !== false ? t('common.enabled') : t('common.disabled')}</div>
                            </div>
                        </div>
                    `}).join('');
                }
            }

            if (view.jsonContainer) {
                createJsonViewer(view.jsonContainer, {
                    data: response,
                    filename: 'allowed-apps',
                    url: '/api/v1/open-in/apps'
                });
            }
        })
        .catch(err => {
            view.setError(t('apps.failedToLoadApps', { message: err.message }));
        });
}
