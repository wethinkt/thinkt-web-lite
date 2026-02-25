// src/views/Apps.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';

export function renderApps(container: HTMLElement) {
    container.innerHTML = `
        <div class="panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2><span class="icon">🧩</span> Allowed Apps</h2>
                <div class="tabs-header">
                    <button class="tab-btn active" data-target="apps-rendered">Rendered</button>
                    <button class="tab-btn" data-target="apps-raw">Raw JSON</button>
                </div>
            </div>
            
            <div id="apps-rendered" class="tab-content active">
                <div id="apps-list" class="loading">Loading apps...</div>
            </div>
            <div id="apps-raw" class="tab-content">
                <div id="apps-json-container"></div>
            </div>
        </div>
    `;

    const listContainer = document.getElementById('apps-list');
    const jsonContainer = document.getElementById('apps-json-container');
    const tabBtns = container.querySelectorAll('.tab-btn');
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

    apiClient.getOpenInApps()
        .then(apps => {
            if (listContainer) {
                if (apps.length === 0) {
                    listContainer.innerHTML = `<div style="color: var(--text-secondary);">No allowed apps found.</div>`;
                } else {
                    listContainer.innerHTML = apps.map(app => `
                        <div class="list-item">
                            <div>
                                <div class="list-item-title">${app.name}</div>
                            </div>
                        </div>
                    `).join('');
                }
            }

            if (jsonContainer) {
                createJsonViewer(jsonContainer, {
                    data: apps,
                    filename: 'allowed-apps',
                    url: '/api/v1/open-in/apps'
                });
            }
        })
        .catch(err => {
            if (listContainer) listContainer.innerHTML = `<div class="error">Failed to load apps: ${err.message}</div>`;
            if (jsonContainer) jsonContainer.innerHTML = `<div class="error">Failed to load apps: ${err.message}</div>`;
        });
}
