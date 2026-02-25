// src/views/Dashboard.ts
import { apiClient } from '../api';

function formatNumber(num?: number): string {
  if (num === undefined) return '—';
  return num.toLocaleString();
}

function formatUptime(seconds?: number): string {
  if (seconds === undefined) return '—';
  if (seconds < 60) return `${seconds}s`;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

function statCard(icon: string, label: string, value: string | number, subtext?: string) {
  return `
        <div style="flex: 1; min-width: 150px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 500;">
                <span style="font-size: 1.1rem;">${icon}</span> ${label}
            </div>
            <div style="font-size: 1.5rem; font-weight: 600; color: var(--text-primary); font-family: 'Inter', sans-serif;">${value}</div>
            ${subtext ? `<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${subtext}</div>` : ''}
        </div>
    `;
}

function progressBar(done?: number, total?: number) {
  if (done === undefined || total === undefined || total === 0) return '';
  const pct = Math.min(100, Math.round((done / total) * 100));
  return `
        <div style="margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                <span>${formatNumber(done)} / ${formatNumber(total)}</span>
                <span>${pct}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: 999px; overflow: hidden;">
                <div style="width: ${pct}%; height: 100%; background: var(--accent-color); border-radius: 999px;"></div>
            </div>
        </div>
    `;
}

export function renderDashboard(container: HTMLElement, _headerControls?: HTMLElement | null) {
  container.innerHTML = `
    <!-- Connection Status -->
    <div class="panel">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin-bottom: 0;"><span class="icon">⚡</span> System Status</h2>
        <div id="dashboard-connection" class="loading" style="font-size: 0.9rem;">Connecting…</div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="panel">
      <h2><span class="icon">📊</span> Usage Statistics</h2>
      <div id="dashboard-stats" class="loading">Loading stats…</div>
    </div>

    <!-- Indexer Status -->
    <div class="panel">
      <h2><span class="icon">🔄</span> Indexer Status</h2>
      <div id="dashboard-indexer" class="loading">Loading indexer status…</div>
    </div>

    <!-- About -->
    <div class="panel">
      <h2><span class="icon">ℹ️</span> About Thinkt Web Lite</h2>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        Developer-oriented diagnostic tool for the Thinkt API. Monitor projects, verify sources, inspect indexer health, and test API endpoints.
      </p>
      <p style="margin-top: 0.5rem;">
        <a href="https://github.com/wethinkt/go-thinkt" target="_blank" rel="noopener" style="color: var(--accent-color); font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;">github.com/wethinkt/go-thinkt</a>
      </p>
    </div>
  `;

  const connEl = document.getElementById('dashboard-connection');
  const statsEl = document.getElementById('dashboard-stats');
  const indexerEl = document.getElementById('dashboard-indexer');

  // --- Connection Status ---
  apiClient.getSources()
    .then(() => {
      if (connEl) {
        connEl.classList.remove('loading');
        connEl.innerHTML = `<span class="source-status online">Online</span>`;
      }
    })
    .catch(err => {
      if (connEl) {
        connEl.classList.remove('loading');
        connEl.innerHTML = `<span class="source-status offline" title="${err.message}">Offline</span>`;
      }
    });

  // --- Stats ---
  // Ensure we use the exact shape since ThinktClient currently bypasses adapters for getStats
  apiClient.getStats()
    .then((stats: any) => {
      if (!statsEl) return;

      const topTools = Object.entries(stats.tool_usage || {})
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 10);

      statsEl.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${statCard('💬', 'Sessions', formatNumber(stats.total_sessions))}
                    ${statCard('📁', 'Projects', formatNumber(stats.total_projects))}
                    ${statCard('📝', 'Entries', formatNumber(stats.total_entries))}
                    ${statCard('🪙', 'Total Tokens', formatNumber(stats.total_tokens))}
                </div>
                ${topTools.length > 0 ? `
                    <div style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Top Tools Used</div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${topTools.map(([tool, count]: any) => {
        const max = topTools[0][1] as number;
        const pct = Math.round((count / max) * 100);
        return `
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace; min-width: 180px; color: var(--text-primary);">${tool}</div>
                                    <div style="flex: 1; background: var(--border-color); border-radius: 999px; height: 8px; overflow: hidden;">
                                        <div style="background: var(--accent-color); width: ${pct}%; height: 100%; border-radius: 999px;"></div>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary); min-width: 50px; text-align: right;">${formatNumber(count)}</div>
                                </div>
                            `;
      }).join('')}
                    </div>
                ` : ''}
            `;
    })
    .catch(err => {
      if (statsEl) statsEl.innerHTML = `<div class="error">Failed to load stats: ${err.message}</div>`;
    });

  // --- Indexer Status ---
  apiClient.getIndexerStatus()
    .then((status: any) => {
      if (!indexerEl) return;

      const stateColor = status.running ? 'var(--success-color)' : 'var(--text-secondary)';
      const sync = status.sync_progress;
      const embed = status.embed_progress;

      indexerEl.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${statCard('🧠', 'Model', status.model || '—', status.model_dim ? `${status.model_dim}d` : undefined)}
                    ${statCard('⏱', 'Uptime', formatUptime(status.uptime_seconds))}
                    ${statCard('📡', 'Watching', status.watching ? 'Yes' : 'No')}
                    ${statCard('⚙️', 'State', '', `<span style="color: ${stateColor}; font-size: 0.9rem; font-weight: 600;">${status.state || (status.running ? 'Running' : 'Idle')}</span>`)}
                </div>

                ${sync ? `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Sync Progress</div>
                        ${sync.message ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${sync.message}</div>` : ''}
                        ${progressBar(sync.done, sync.total)}
                        ${sync.project_name ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">Project: ${sync.project_name}</div>` : ''}
                    </div>
                ` : ''}

                ${embed ? `
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Embedding Progress</div>
                        ${embed.message ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${embed.message}</div>` : ''}
                        ${progressBar(embed.done, embed.total)}
                    </div>
                ` : ''}

                ${!sync && !embed ? `<div style="color: var(--text-secondary); font-size: 0.875rem;">No active sync or embedding in progress.</div>` : ''}
            `;
    })
    .catch(err => {
      if (indexerEl) indexerEl.innerHTML = `<div style="color: var(--text-secondary);">Indexer status unavailable: ${err.message}</div>`;
    });
}
