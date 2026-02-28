import { getSessionToken, setSessionToken, clearSessionToken } from '../api';
import { t } from '../i18n';

function redact(token: string): string {
    if (token.length <= 8) return '••••••••';
    return token.slice(0, 4) + '•'.repeat(Math.min(token.length - 8, 32)) + token.slice(-4);
}

export function renderAuth(container: HTMLElement, _headerControls?: HTMLElement | null) {
    const token = getSessionToken();

    container.innerHTML = `
        <div style="max-width: 560px;">
            <div class="card" style="margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 0.75rem; font-size: 1rem; color: var(--text-primary);">${t('auth.currentToken')}</h3>
                ${token ? `
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <code id="auth-token-display" style="flex: 1; padding: 0.5rem 0.75rem; background: var(--panel-bg); border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.85rem; color: var(--text-primary); word-break: break-all;">${redact(token)}</code>
                        <button id="auth-toggle-reveal" class="btn" type="button" style="white-space: nowrap;">${t('auth.reveal')}</button>
                    </div>
                    <button id="auth-clear-btn" class="btn" type="button" style="background: var(--danger-color); color: #fff; border: none;">${t('auth.clearToken')}</button>
                ` : `
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">${t('auth.noToken')}</div>
                `}
            </div>

            <div class="card">
                <h3 style="margin: 0 0 0.75rem; font-size: 1rem; color: var(--text-primary);">${t('auth.setNewToken')}</h3>
                <div style="display: flex; gap: 0.5rem;">
                    <input id="auth-new-token" type="text" class="input" placeholder="${t('auth.tokenPlaceholder')}" style="flex: 1;" />
                    <button id="auth-set-btn" class="btn" type="button">${t('auth.apply')}</button>
                </div>
            </div>
        </div>
    `;

    // Reveal / hide toggle
    const toggleBtn = document.getElementById('auth-toggle-reveal');
    const display = document.getElementById('auth-token-display');
    if (toggleBtn && display && token) {
        let revealed = false;
        toggleBtn.addEventListener('click', () => {
            revealed = !revealed;
            display.textContent = revealed ? token : redact(token);
            toggleBtn.textContent = revealed ? t('auth.hide') : t('auth.reveal');
        });
    }

    // Clear token
    const clearBtn = document.getElementById('auth-clear-btn');
    clearBtn?.addEventListener('click', () => {
        clearSessionToken();
        renderAuth(container, _headerControls);
    });

    // Set new token
    const setBtn = document.getElementById('auth-set-btn');
    const input = document.getElementById('auth-new-token') as HTMLInputElement | null;
    setBtn?.addEventListener('click', () => {
        const value = input?.value.trim();
        if (value) {
            setSessionToken(value);
            renderAuth(container, _headerControls);
        }
    });
    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') setBtn?.click();
    });
}
