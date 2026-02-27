import { apiClient } from '../api';
import { createJsonViewer } from '../components/JsonViewer';
import { getLocale, t } from '../i18n';
import { copyToClipboard, createTabbedPanelView, getSourceBadgeStyle } from '../utils';

type SortField = 'name' | 'time';
type SortDirection = 'asc' | 'desc';

interface MergedProject {
  name: string;
  id: string;
  path: string;
  sources: string[];
  lastModifiedMin: number;
  lastModifiedMax: number;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function mergeProjects(projects: any[]): MergedProject[] {
  const map = new Map<string, MergedProject>();
  for (const p of projects) {
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
        id: p.id || '',
        path: canonicalPath,
        sources: p.source ? [p.source] : [],
        lastModifiedMin: ts,
        lastModifiedMax: ts,
      });
    }
  }
  return Array.from(map.values());
}

export function renderProjects(container: HTMLElement, headerControls?: HTMLElement | null): void {
  const view = createTabbedPanelView(container, headerControls, 'projects', t('projects.loadingProjects'));

  if (headerControls) {
    const sortControls = document.createElement('div');
    sortControls.className = 'sort-controls';
    sortControls.innerHTML = `
            <div class="sort-group">
                <button class="sort-btn" data-sort-field="name" title="${t('projects.sortByName')}">${t('projects.sortName')}</button>
                <button class="sort-btn active" data-sort-field="time" title="${t('projects.sortByTime')}">${t('projects.sortTime')}</button>
            </div>
            <button class="sort-btn sort-dir-btn" data-sort-dir="desc" title="${t('projects.toggleSortDirection')}">↓</button>
        `;
    headerControls.insertBefore(sortControls, headerControls.firstChild);
  }

  let currentSortField: SortField = 'time';
  let currentSortDir: SortDirection = 'desc';

  Promise.all([
    apiClient.getProjects(),
    apiClient.getOpenInApps().catch(() => ({ apps: [] } as any)),
    apiClient.getSources().catch(() => []),
  ]).then(([projects, appsData, sources]) => {
    const merged = mergeProjects(projects);
    const apps = appsData.apps || [];

    const resumableSources = new Set<string>();
    for (const source of sources) {
      if ((source as any).can_resume || (source as any).canResume) {
        const sourceName = (source as any).name || (source as any).id || '';
        if (sourceName) resumableSources.add(sourceName);
      }
    }

    function sortList(list: MergedProject[]): MergedProject[] {
      const sorted = [...list];
      sorted.sort((a, b) => {
        let cmp: number;
        if (currentSortField === 'name') {
          cmp = a.name.localeCompare(b.name, getLocale(), { sensitivity: 'base' });
        } else {
          const ta = currentSortDir === 'asc' ? a.lastModifiedMin : a.lastModifiedMax;
          const tb = currentSortDir === 'asc' ? b.lastModifiedMin : b.lastModifiedMax;
          cmp = ta - tb;
        }
        return currentSortDir === 'asc' ? cmp : -cmp;
      });
      return sorted;
    }

    function renderList(): void {
      if (!view.listContainer) return;
      const sorted = sortList(merged);

      if (sorted.length === 0) {
        view.listContainer.innerHTML = `<div style="color: var(--text-secondary);">${t('projects.noProjectsFound')}</div>`;
        return;
      }

      view.listContainer.innerHTML = sorted.map((project, index) => {
        const copyId = `copy-${index}`;
        const selectId = `open-in-${index}`;
        const badges = project.sources.map((sourceName) => {
          const styleStr = getSourceBadgeStyle(sourceName);
          return `<span class="badge" style="${styleStr}">${sourceName}</span>`;
        }).join('');

        const ts = project.lastModifiedMax;
        const timeStr = ts > 0
          ? new Date(ts).toLocaleString(getLocale(), { dateStyle: 'medium', timeStyle: 'short' })
          : '';

        const projectResumableSources = project.sources.filter((sourceName) => resumableSources.has(sourceName));
        const resumeOptions = projectResumableSources.length > 0
          ? `<option disabled>──────────</option>${
            projectResumableSources.map((sourceName) => `<option value="resume:${sourceName}">${t('projects.resume', { source: sourceName })}</option>`).join('')
          }`
          : '';

        const enabledApps = apps.filter((app: any) => app.enabled !== false);
        const hasOptions = enabledApps.length > 0 || projectResumableSources.length > 0;

        return `
                    <div class="list-item">
                        <div style="flex: 1;">
                            <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                ${project.name || t('projects.unnamedProject')}
                                ${badges}
                            </div>
                            <div class="list-item-meta" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                <span style="font-family: 'IBM Plex Mono', monospace;">${project.path}</span>
                                <button id="${copyId}" class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.4rem; font-size: 0.7rem;" title="${t('projects.copyPath')}">📋</button>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            ${timeStr ? `<span style="opacity: 0.5; font-size: 0.75rem; white-space: nowrap;">${timeStr}</span>` : ''}
                            ${hasOptions ? `
                                <select id="${selectId}" class="input">
                                    <option value="">${t('projects.openIn')}</option>
                                    ${enabledApps.map((app: any) => `<option value="${app.id}">${app.name}</option>`).join('')}
                                    ${resumeOptions}
                                </select>
                            ` : ''}
                        </div>
                    </div>
                `;
      }).join('');

      sorted.forEach((project, index) => {
        const copyBtn = document.getElementById(`copy-${index}`);
        if (copyBtn) {
          copyBtn.addEventListener('click', async () => {
            const success = await copyToClipboard(project.path);
            const oldText = copyBtn.textContent;
            copyBtn.textContent = success ? '✅' : '❌';
            setTimeout(() => {
              if (copyBtn) copyBtn.textContent = oldText;
            }, 2000);
          });
        }

        const selectEl = document.getElementById(`open-in-${index}`) as HTMLSelectElement;
        if (!selectEl) return;

        selectEl.addEventListener('change', async () => {
          const value = selectEl.value;
          if (!value) return;

          try {
            selectEl.disabled = true;

            if (value.startsWith('resume:')) {
              const source = value.slice('resume:'.length);
              const sessions = await apiClient.getSessions(project.id, source);
              if (sessions.length === 0) {
                alert(t('projects.noSessionsFound', { source }));
                return;
              }

              sessions.sort((a: any, b: any) => {
                const ta = a.modifiedAt ? new Date(a.modifiedAt).getTime() : 0;
                const tb = b.modifiedAt ? new Date(b.modifiedAt).getTime() : 0;
                return tb - ta;
              });

              const latestSession = sessions[0];
              const sessionPath = (latestSession as any).fullPath || (latestSession as any).full_path || '';
              if (!sessionPath) {
                alert(t('projects.couldNotDetermineSessionPath'));
                return;
              }

              await apiClient.execResumeSession(sessionPath);
            } else {
              await apiClient.openIn(value, project.path);
            }
          } catch (error: unknown) {
            console.error('Action failed:', error);
            alert(t('common.failedWithMessage', { message: getErrorMessage(error) || t('common.unknownError') }));
          } finally {
            selectEl.value = '';
            selectEl.disabled = false;
          }
        });
      });
    }

    if (headerControls) {
      const fieldButtons = headerControls.querySelectorAll<HTMLButtonElement>('[data-sort-field]');
      const dirButton = headerControls.querySelector<HTMLButtonElement>('[data-sort-dir]');

      fieldButtons.forEach((button) => {
        button.addEventListener('click', () => {
          currentSortField = button.getAttribute('data-sort-field') as SortField;
          fieldButtons.forEach((btn) => btn.classList.remove('active'));
          button.classList.add('active');
          renderList();
        });
      });

      if (dirButton) {
        dirButton.addEventListener('click', () => {
          currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
          dirButton.textContent = currentSortDir === 'asc' ? '↑' : '↓';
          dirButton.setAttribute('data-sort-dir', currentSortDir);
          renderList();
        });
      }
    }

    renderList();

    if (view.jsonContainer) {
      createJsonViewer(view.jsonContainer, {
        data: projects,
        filename: 'projects',
        url: '/api/v1/projects',
      });
    }
  }).catch((error: unknown) => {
    view.setError(t('projects.failedToLoadProjects', { message: getErrorMessage(error) }));
  });
}
