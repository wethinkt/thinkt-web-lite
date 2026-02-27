import { apiClient } from '../api';
import { getLocale, t } from '../i18n';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function formatNumber(num?: number): string {
  if (num === undefined) return t('common.notAvailable');
  return num.toLocaleString(getLocale());
}

function formatUptime(seconds?: number): string {
  if (seconds === undefined) return t('common.notAvailable');
  if (seconds < 60) return t('time.secondsShort', { count: seconds });

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return t('time.hoursMinutesShort', { hours: hrs, minutes: mins });
  return t('time.minutesShort', { count: mins });
}

function statCard(icon: string, label: string, value: string | number, subtext?: string, flex = '1'): string {
  return `
        <div style="flex: ${flex}; min-width: 150px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 500;">
                <span style="font-size: 1.1rem;">${icon}</span> ${label}
            </div>
            <div style="font-size: 1.5rem; font-weight: 600; color: var(--text-primary); font-family: 'Inter', sans-serif;">${value}</div>
            ${subtext ? `<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${subtext}</div>` : ''}
        </div>
    `;
}

function labeledProgressBar(label: string, done?: number, total?: number): string {
  if (done === undefined || total === undefined || total <= 0) return '';
  const pct = Math.min(100, Math.round((done / total) * 100));
  return `
        <div style="margin-top: 0.75rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                <span style="font-weight: 500;">${label}</span>
                <span>${formatNumber(done)} / ${formatNumber(total)} &nbsp; ${pct}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: 999px; overflow: hidden;">
                <div style="width: ${pct}%; height: 100%; background: var(--accent-color); border-radius: 999px;"></div>
            </div>
        </div>
    `;
}

export function renderDashboard(container: HTMLElement, _headerControls?: HTMLElement | null): void {
  container.innerHTML = `
    <div class="panel">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin-bottom: 0;"><span class="icon">⚡</span> ${t('dashboard.systemStatus')}</h2>
        <div id="dashboard-connection" class="loading" style="font-size: 0.9rem;">${t('dashboard.connecting')}</div>
      </div>
    </div>

    <div class="panel">
      <h2><span class="icon">📊</span> ${t('dashboard.usageStatistics')}</h2>
      <div id="dashboard-stats" class="loading">${t('dashboard.loadingStats')}</div>
    </div>

    <div class="panel">
      <h2><span class="icon">🖥️</span> ${t('dashboard.serverInformation')}</h2>
      <div id="dashboard-server-info" class="loading">${t('dashboard.loadingServerInfo')}</div>
    </div>

    <div class="panel">
      <h2><span class="icon">🔄</span> ${t('dashboard.indexerStatus')}</h2>
      <div id="dashboard-indexer" class="loading">${t('dashboard.loadingIndexerStatus')}</div>
    </div>

    <div class="panel">
      <h2><span class="icon">ℹ️</span> ${t('dashboard.aboutTitle')}</h2>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        ${t('dashboard.aboutBody')}
      </p>
      <p style="margin-top: 0.5rem;">
        <a href="https://github.com/wethinkt/go-thinkt" target="_blank" rel="noopener" style="color: var(--accent-color); font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;">github.com/wethinkt/go-thinkt</a>
      </p>
    </div>
  `;

  const connEl = document.getElementById('dashboard-connection');
  const statsEl = document.getElementById('dashboard-stats');
  const serverInfoEl = document.getElementById('dashboard-server-info');
  const indexerEl = document.getElementById('dashboard-indexer');

  apiClient.getSources()
    .then(() => {
      if (connEl) {
        connEl.classList.remove('loading');
        connEl.innerHTML = `<span class="source-status online">${t('status.online')}</span>`;
      }
    })
    .catch((err: unknown) => {
      if (connEl) {
        connEl.classList.remove('loading');
        connEl.innerHTML = `<span class="source-status offline" title="${getErrorMessage(err)}">${t('status.offline')}</span>`;
      }
    });

  apiClient.getStats()
    .then((stats: any) => {
      if (!statsEl) return;

      const topTools = (stats.top_tools || [])
        .sort((a: any, b: any) => (b.count || 0) - (a.count || 0))
        .slice(0, 10);

      statsEl.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${statCard('💬', t('dashboard.sessions'), formatNumber(stats.total_sessions))}
                    ${statCard('📁', t('dashboard.projects'), formatNumber(stats.total_projects))}
                    ${statCard('📝', t('dashboard.entries'), formatNumber(stats.total_entries))}
                    ${statCard('🪙', t('dashboard.totalTokens'), formatNumber(stats.total_tokens))}
                </div>
                ${topTools.length > 0 ? `
                    <div style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">${t('dashboard.topToolsUsed')}</div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${topTools.map((tool: any) => {
        const max = (topTools[0] as any).count || 1;
        const pct = Math.round(((tool.count || 0) / max) * 100);
        return `
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace; min-width: 180px; color: var(--text-primary);">${tool.name}</div>
                                    <div style="flex: 1; background: var(--border-color); border-radius: 999px; height: 8px; overflow: hidden;">
                                        <div style="background: var(--accent-color); width: ${pct}%; height: 100%; border-radius: 999px;"></div>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary); min-width: 50px; text-align: right;">${formatNumber(tool.count)}</div>
                                </div>
                            `;
      }).join('')}
                    </div>
                ` : ''}
            `;
    })
    .catch((err: unknown) => {
      if (statsEl) statsEl.innerHTML = `<div class="error">${t('dashboard.failedToLoadStats', { message: getErrorMessage(err) })}</div>`;
    });

  apiClient.getInfo()
    .then((info: any) => {
      if (!serverInfoEl) return;

      serverInfoEl.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${statCard('🏷️', t('dashboard.version'), info.version || t('common.notAvailable'), info.revision ? `<span style="font-family: 'IBM Plex Mono', monospace;">${info.revision.substring(0, 7)}</span>` : undefined, '2')}
                    ${statCard('⏱', t('dashboard.uptime'), formatUptime(info.uptime_seconds))}
                    ${statCard('🔑', t('dashboard.auth'), info.authenticated ? t('common.enabled') : t('common.disabled'))}
                    ${statCard('⚙️', t('dashboard.pid'), info.pid || t('common.notAvailable'))}
                </div>
            `;
    })
    .catch((err: unknown) => {
      if (serverInfoEl) {
        serverInfoEl.innerHTML = `<div style="color: var(--text-secondary);">${t('dashboard.serverInfoUnavailable', { message: getErrorMessage(err) })}</div>`;
      }
    });

  apiClient.getIndexerStatus()
    .then((status: any) => {
      if (!indexerEl) return;

      const stateColor = status.running ? 'var(--success-color)' : 'var(--text-secondary)';
      const sync = status.sync_progress;
      const embed = status.embed_progress;

      const syncProjectBar = labeledProgressBar(t('dashboard.projects'), sync?.project, sync?.project_total);
      const syncSessionBar = labeledProgressBar(t('dashboard.sessions'), sync?.done, sync?.total);
      const embedSessionBar = labeledProgressBar(t('dashboard.sessions'), embed?.done, embed?.total);
      const embedChunkBar = labeledProgressBar(t('dashboard.chunks'), embed?.chunks_done, embed?.chunks_total);

      indexerEl.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${statCard('🧠', t('dashboard.model'), status.model || t('common.notAvailable'), status.model_dim ? `${status.model_dim}d` : undefined, '2')}
                    ${statCard('⏱', t('dashboard.uptime'), formatUptime(status.uptime_seconds))}
                    ${statCard('📡', t('dashboard.watching'), status.watching ? t('common.yes') : t('common.no'))}
                    ${statCard('⚙️', t('dashboard.state'), '', `<span style="color: ${stateColor}; font-size: 0.9rem; font-weight: 600;">${status.state || (status.running ? t('dashboard.running') : t('dashboard.idle'))}</span>`)}
                </div>

                ${sync ? `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">${t('dashboard.syncProgress')}</div>
                        ${sync.message ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${sync.message}</div>` : ''}
                        ${syncProjectBar || syncSessionBar ? `${syncProjectBar}${syncSessionBar}` : labeledProgressBar(t('dashboard.sessions'), sync.done, sync.total)}
                        ${sync.project_name ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">${t('dashboard.project', { name: sync.project_name })}</div>` : ''}
                    </div>
                ` : ''}

                ${embed ? `
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">${t('dashboard.embeddingProgress')}</div>
                        ${embed.message ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${embed.message}</div>` : ''}
                        ${embedSessionBar || embedChunkBar ? `${embedSessionBar}${embedChunkBar}` : labeledProgressBar(t('dashboard.sessions'), embed.done, embed.total)}
                    </div>
                ` : ''}

                ${!sync && !embed ? `<div style="color: var(--text-secondary); font-size: 0.875rem;">${t('dashboard.noActiveSyncOrEmbedding')}</div>` : ''}
            `;
    })
    .catch((err: unknown) => {
      if (indexerEl) {
        indexerEl.innerHTML = `<div style="color: var(--text-secondary);">${t('dashboard.indexerStatusUnavailable', { message: getErrorMessage(err) })}</div>`;
      }
    });
}
