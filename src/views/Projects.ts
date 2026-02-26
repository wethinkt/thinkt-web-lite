// src/views/Projects.ts
import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { copyToClipboard, getSourceBadgeStyle, createTabbedPanelView } from '../utils';

type SortField = 'name' | 'time';
type SortDirection = 'asc' | 'desc';

interface MergedProject {
    name: string;
    id: string;           // canonical id (first seen)
    path: string;
    sources: string[];     // all source badges
    lastModifiedMin: number;
    lastModifiedMax: number;
}

function mergeProjects(projects: any[]): MergedProject[] {
    const map = new Map<string, MergedProject>();
    for (const p of projects) {
        // Use displayPath (if available) or path as the unifying key, not the storage id
        const canonicalPath = p.displayPath || p.path || p.id || '';
        const key = `${p.name || ''}\0${canonicalPath}`;
        const ts = p.lastModified ? new Date(p.lastModified).getTime() : 0;
        const existing = map.get(key);

        if (existing) {
            if (p.source && !existing.sources.includes(p.source)) {
                existing.sources.push(p.source);
            }
            if (ts > 0) {
                existing.lastModifiedMin = existing.lastModifiedMin === 0 ? ts : Math.min(existing.lastModifiedMin, ts);
                existing.lastModifiedMax = Math.max(existing.lastModifiedMax, ts);
            }
        } else {
            map.set(key, {
                name: p.name || '',
                id: p.id || '', // we keep the first one's ID for operations if needed, but display canonicalPath
                path: canonicalPath,
                sources: p.source ? [p.source] : [],
                lastModifiedMin: ts,
                lastModifiedMax: ts,
            });
        }
    }
    return Array.from(map.values());
}

export function renderProjects(container: HTMLElement, _headerControls?: HTMLElement | null) {
    const view = createTabbedPanelView(container, _headerControls, 'projects', 'Loading projects...');

    // Inject sort controls into header (before the Rendered/Raw tabs)
    if (_headerControls) {
        const sortControls = document.createElement('div');
        sortControls.className = 'sort-controls';
        sortControls.innerHTML = `
            <div class="sort-group">
                <button class="sort-btn" data-sort-field="name" title="Sort by name">Name</button>
                <button class="sort-btn active" data-sort-field="time" title="Sort by time">Time</button>
            </div>
            <button class="sort-btn sort-dir-btn" data-sort-dir="desc" title="Toggle sort direction">↓</button>
        `;
        _headerControls.insertBefore(sortControls, _headerControls.firstChild);
    }

    let currentSortField: SortField = 'time';
    let currentSortDir: SortDirection = 'desc';

    Promise.all([
        apiClient.getProjects(),
        apiClient.getOpenInApps().catch(() => ({ apps: [] } as any)),
        apiClient.getSources().catch(() => [])
    ]).then(([projects, appsData, sources]) => {
        const merged = mergeProjects(projects);
        const apps = appsData.apps || [];

        // Build set of resumable source names
        const resumableSources = new Set<string>();
        for (const s of sources) {
            if ((s as any).can_resume || (s as any).canResume) {
                const name = (s as any).name || (s as any).id || '';
                if (name) resumableSources.add(name);
            }
        }

        function sortList(list: MergedProject[]): MergedProject[] {
            const sorted = [...list];
            sorted.sort((a, b) => {
                let cmp = 0;
                if (currentSortField === 'name') {
                    cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
                } else {
                    const ta = currentSortDir === 'asc' ? a.lastModifiedMin : a.lastModifiedMax;
                    const tb = currentSortDir === 'asc' ? b.lastModifiedMin : b.lastModifiedMax;
                    cmp = ta - tb;
                }
                return currentSortDir === 'asc' ? cmp : -cmp;
            });
            return sorted;
        }

        function renderList() {
            if (!view.listContainer) return;
            const sorted = sortList(merged);

            if (sorted.length === 0) {
                view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">No projects found.</div>`;
                return;
            }

            view.listContainer.innerHTML = sorted.map((p, i) => {
                const copyId = `copy-${i}`;
                const selectId = `open-in-${i}`;
                const badges = p.sources.map(s => {
                    const styleStr = getSourceBadgeStyle(s);
                    return `<span class="badge" style="${styleStr}">${s}</span>`;
                }).join('');

                const ts = p.lastModifiedMax;
                const timeStr = ts > 0
                    ? new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                    : '';

                // Build resume options for this project's resumable sources
                const projectResumableSources = p.sources.filter(s => resumableSources.has(s));
                const resumeOptions = projectResumableSources.length > 0
                    ? `<option disabled>──────────</option>` +
                    projectResumableSources.map(s => `<option value="resume:${s}">Resume (${s})</option>`).join('')
                    : '';

                const enabledApps = apps.filter((app: any) => app.enabled !== false);
                const hasOptions = enabledApps.length > 0 || projectResumableSources.length > 0;

                return `
                    <div class="list-item">
                        <div style="flex: 1;">
                            <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                ${p.name || 'Unnamed Project'}
                                ${badges}
                            </div>
                            <div class="list-item-meta" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                <span style="font-family: 'IBM Plex Mono', monospace;">${p.path}</span>
                                <button id="${copyId}" class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.4rem; font-size: 0.7rem;" title="Copy path">📋</button>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            ${timeStr ? `<span style="opacity: 0.5; font-size: 0.75rem; white-space: nowrap;">${timeStr}</span>` : ''}
                            ${hasOptions ? `
                                <select id="${selectId}" class="input">
                                    <option value="">Open in...</option>
                                    ${enabledApps.map((app: any) => `<option value="${app.id}">${app.name}</option>`).join('')}
                                    ${resumeOptions}
                                </select>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            // Re-attach event listeners
            sorted.forEach((p, i) => {
                const copyBtn = document.getElementById(`copy-${i}`);
                if (copyBtn) {
                    copyBtn.addEventListener('click', async () => {
                        const success = await copyToClipboard(p.path);
                        const oldText = copyBtn.textContent;
                        copyBtn.textContent = success ? '✅' : '❌';
                        setTimeout(() => { if (copyBtn) copyBtn.textContent = oldText; }, 2000);
                    });
                }

                const selectEl = document.getElementById(`open-in-${i}`) as HTMLSelectElement;
                if (selectEl) {
                    selectEl.addEventListener('change', async () => {
                        const value = selectEl.value;
                        if (!value) return;
                        try {
                            selectEl.disabled = true;

                            if (value.startsWith('resume:')) {
                                // Resume: find latest session for this project+source, then exec resume
                                const source = value.slice('resume:'.length);
                                const sessions = await apiClient.getSessions(p.id, source);
                                if (sessions.length === 0) {
                                    alert(`No sessions found for ${source} in this project.`);
                                    return;
                                }
                                // Sort by modified_at descending to get latest
                                sessions.sort((a: any, b: any) => {
                                    const ta = a.modifiedAt ? new Date(a.modifiedAt).getTime() : 0;
                                    const tb = b.modifiedAt ? new Date(b.modifiedAt).getTime() : 0;
                                    return tb - ta;
                                });
                                const latestSession = sessions[0];
                                const sessionPath = (latestSession as any).fullPath || (latestSession as any).full_path || '';
                                if (!sessionPath) {
                                    alert('Could not determine session path for resume.');
                                    return;
                                }
                                await apiClient.execResumeSession(sessionPath);
                            } else {
                                // Normal open-in
                                await apiClient.openIn(value, p.path);
                            }
                        } catch (err: any) {
                            console.error('Action failed:', err);
                            alert(`Failed: ${err.message || 'Unknown error'}`);
                        } finally {
                            selectEl.value = '';
                            selectEl.disabled = false;
                        }
                    });
                }
            });
        }

        // Wire up sort controls
        if (_headerControls) {
            const fieldBtns = _headerControls.querySelectorAll<HTMLButtonElement>('[data-sort-field]');
            const dirBtn = _headerControls.querySelector<HTMLButtonElement>('[data-sort-dir]');

            fieldBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentSortField = btn.getAttribute('data-sort-field') as SortField;
                    fieldBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderList();
                });
            });

            if (dirBtn) {
                dirBtn.addEventListener('click', () => {
                    currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
                    dirBtn.textContent = currentSortDir === 'asc' ? '↑' : '↓';
                    dirBtn.setAttribute('data-sort-dir', currentSortDir);
                    renderList();
                });
            }
        }

        // Initial render
        renderList();

        if (view.jsonContainer) {
            createJsonViewer(view.jsonContainer, {
                data: projects,
                filename: 'projects',
                url: '/api/v1/projects'
            });
        }
    }).catch(err => {
        view.setError(`Failed to load projects: ${err.message}`);
    });
}
