// src/views/Projects.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';

export function renderProjects(container: HTMLElement) {
    container.innerHTML = `
        <div class="panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2><span class="icon">📁</span> Projects</h2>
                <div class="tabs-header">
                    <button class="tab-btn active" data-target="projects-rendered">Rendered</button>
                    <button class="tab-btn" data-target="projects-raw">Raw JSON</button>
                </div>
            </div>
            
            <div id="projects-rendered" class="tab-content active">
                <div id="projects-list" class="loading">Loading projects...</div>
            </div>
            <div id="projects-raw" class="tab-content">
                <div id="projects-json-container"></div>
            </div>
        </div>
    `;

    const listContainer = document.getElementById('projects-list');
    const jsonContainer = document.getElementById('projects-json-container');
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

    apiClient.getProjects()
        .then(projects => {
            if (listContainer) {
                if (projects.length === 0) {
                    listContainer.innerHTML = `<div style="color: var(--text-secondary);">No projects found.</div>`;
                } else {
                    listContainer.innerHTML = projects.map(p => `
                        <div class="list-item">
                            <div>
                                <div class="list-item-title">${p.name || 'Unnamed Project'}</div>
                                <div class="list-item-meta">
                                    <span style="font-family: 'IBM Plex Mono', monospace;">${p.id}</span>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            }

            if (jsonContainer) {
                createJsonViewer(jsonContainer, {
                    data: projects,
                    filename: 'projects',
                    url: '/api/v1/projects'
                });
            }
        })
        .catch(err => {
            if (listContainer) listContainer.innerHTML = `<div class="error">Failed to load projects: ${err.message}</div>`;
            if (jsonContainer) jsonContainer.innerHTML = `<div class="error">Failed to load projects: ${err.message}</div>`;
        });
}
