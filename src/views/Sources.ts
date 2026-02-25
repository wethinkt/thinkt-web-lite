// src/views/Sources.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { getSourceBadgeStyle } from '../utils';

export function renderSources(container: HTMLElement, headerControls?: HTMLElement | null) {
    container.innerHTML = `
        <div class="panel">
            <div id="sources-rendered" class="tab-content active">
                <div id="sources-list" class="loading">Loading sources...</div>
            </div>
            <div id="sources-raw" class="tab-content">
                <div id="sources-json-container"></div>
            </div>
        </div>
    `;

    if (headerControls) {
        headerControls.innerHTML = `<div class="tabs-header">
                    <button class="tab-btn active" data-target="sources-rendered">Rendered</button>
                    <button class="tab-btn" data-target="sources-raw">Raw JSON</button>
                </div>`;
    } else {
        // Fallback if no global header
        const fallbackHeader = document.createElement("div");
        fallbackHeader.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 1rem;";
        fallbackHeader.innerHTML = `<div class="tabs-header">
                    <button class="tab-btn active" data-target="sources-rendered">Rendered</button>
                    <button class="tab-btn" data-target="sources-raw">Raw JSON</button>
                </div>`;
        container.insertBefore(fallbackHeader, container.firstChild);
    }

    const listContainer = document.getElementById('sources-list');
    const jsonContainer = document.getElementById('sources-json-container');
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

    apiClient.getSources()
        .then(sources => {
            // Render nice UI
            if (listContainer) {
                if (sources.length === 0) {
                    listContainer.innerHTML = `<div style="color: var(--text-secondary);">No sources found.</div>`;
                } else {
                    listContainer.innerHTML = sources.map(s => {
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
            if (jsonContainer) {
                createJsonViewer(jsonContainer, {
                    data: sources,
                    filename: 'sources',
                    url: '/api/v1/sources'
                });
            }
        })
        .catch(err => {
            if (listContainer) listContainer.innerHTML = `<div class="error">Failed to load sources: ${err.message}</div>`;
            if (jsonContainer) jsonContainer.innerHTML = `<div class="error">Failed to load sources: ${err.message}</div>`;
        });
}
