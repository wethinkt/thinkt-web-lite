// src/views/Projects.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { copyToClipboard, getSourceBadgeStyle } from '../utils';

export function renderProjects(container: HTMLElement, _headerControls?: HTMLElement | null) {
    container.innerHTML = `
        <div class="panel">
            <div id="projects-rendered" class="tab-content active">
                <div id="projects-list" class="loading">Loading projects...</div>
            </div>
            <div id="projects-raw" class="tab-content">
                <div id="projects-json-container"></div>
            </div>
        </div>
    `;

    if (_headerControls) {
        _headerControls.innerHTML = `
            <div class="tabs-header">
                <button class="tab-btn active" data-target="projects-rendered">Rendered</button>
                <button class="tab-btn" data-target="projects-raw">Raw JSON</button>
            </div>
        `;
    } else {
        const fallbackHeader = document.createElement("div");
        fallbackHeader.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 1rem;";
        fallbackHeader.innerHTML = `
            <div class="tabs-header">
                <button class="tab-btn active" data-target="projects-rendered">Rendered</button>
                <button class="tab-btn" data-target="projects-raw">Raw JSON</button>
            </div>
        `;
        container.insertBefore(fallbackHeader, container.firstChild);
    }

    const listContainer = document.getElementById('projects-list');
    const jsonContainer = document.getElementById('projects-json-container');
    const tabBtns = (_headerControls || container).querySelectorAll('.tab-btn');
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

    Promise.all([
        apiClient.getProjects(),
        apiClient.getOpenInApps().catch(() => []) // Fallback if API fails
    ]).then(([projects, apps]) => {
        if (listContainer) {
            if (projects.length === 0) {
                listContainer.innerHTML = `<div style="color: var(--text-secondary);">No projects found.</div>`;
            } else {
                listContainer.innerHTML = projects.map((p, i) => {
                    const styleStr = p.source ? getSourceBadgeStyle(p.source) : '';
                    const selectId = `open-in-${i}`;
                    const copyId = `copy-${i}`;

                    return `
                        <div class="list-item">
                            <div style="flex: 1;">
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${p.name || 'Unnamed Project'}
                                    ${p.source ? `<span class="badge" style="${styleStr}">${p.source}</span>` : ''}
                                </div>
                                <div class="list-item-meta" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                    <span style="font-family: 'IBM Plex Mono', monospace;">${p.id}</span>
                                    <button id="${copyId}" class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.4rem; font-size: 0.7rem;" title="Copy path">📋</button>
                                </div>
                            </div>
                            ${apps.length > 0 ? `
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <select id="${selectId}" class="input" style="width: auto; padding: 0.3rem 0.5rem; font-size: 0.8rem;">
                                        <option value="">Open in...</option>
                                        ${apps.filter(app => app.enabled !== false).map((app: any) => `<option value="${app.id}">${app.name}</option>`).join('')}
                                    </select>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('');

                // Add event listeners for copy and open-in
                projects.forEach((p, i) => {
                    const copyBtn = document.getElementById(`copy-${i}`);
                    if (copyBtn) {
                        copyBtn.addEventListener('click', async () => {
                            const success = await copyToClipboard(p.id);
                            const oldText = copyBtn.textContent;
                            copyBtn.textContent = success ? '✅' : '❌';
                            setTimeout(() => { if (copyBtn) copyBtn.textContent = oldText; }, 2000);
                        });
                    }

                    const selectEl = document.getElementById(`open-in-${i}`) as HTMLSelectElement;
                    if (selectEl) {
                        selectEl.addEventListener('change', async () => {
                            const appId = selectEl.value;
                            if (!appId) return;
                            try {
                                selectEl.disabled = true;
                                await apiClient.openIn(appId, p.id);
                            } catch (err: any) {
                                console.error('Failed to open in app:', err);
                                alert(`Failed to open: ${err.message || 'Unknown error'}`);
                            } finally {
                                selectEl.value = ''; // Reset selection
                                selectEl.disabled = false;
                            }
                        });
                    }
                });
            }
        }

        if (jsonContainer) {
            createJsonViewer(jsonContainer, {
                data: projects,
                filename: 'projects',
                url: '/api/v1/projects'
            });
        }
    }).catch(err => {
        if (listContainer) listContainer.innerHTML = `<div class="error">Failed to load projects: ${err.message}</div>`;
        if (jsonContainer) jsonContainer.innerHTML = `<div class="error">Failed to load projects: ${err.message}</div>`;
    });
}
