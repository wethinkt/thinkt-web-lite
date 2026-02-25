// src/components/ThemePreview.ts
import { ThemeColors } from '@wethinkt/ts-thinkt';

type ThemeStyle = { fg?: string; bg?: string };

// Helper to reliably apply fg+bg to innerHTML style
function blockStyle(style?: ThemeStyle): string {
    if (!style) return '';
    const res = [];
    if (style.fg) res.push(`color: ${style.fg}`);
    if (style.bg) res.push(`background: ${style.bg}`);
    return res.join('; ');
}

// Helper to generate a small color swatch
function swatch(label: string, style?: ThemeStyle, accent?: string): string {
    const color = style?.fg || accent || 'var(--text-secondary)';
    const bg = style?.bg || 'transparent';
    return `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <div style="width: 20px; height: 20px; border-radius: 4px; background: ${color}; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;" title="${color}"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${label}</span>
            ${bg !== 'transparent' ? `<div style="width: 20px; height: 20px; border-radius: 4px; background: ${bg}; border: 1px solid rgba(255,255,255,0.1);" title="bg: ${bg}"></div>` : ''}
        </div>
    `;
}

export function createThemePreview(container: HTMLElement, colors: ThemeColors, themeName: string) {
    const c = colors;

    container.innerHTML = `
        <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;">
            
            <!-- Preview Header -->
            <div style="padding: 0.5rem 0.75rem; background: ${c.border_active || 'var(--border-color)'}20; border-bottom: 2px solid ${c.border_active || 'var(--border-color)'}; font-size: 0.75rem; color: var(--text-secondary);">
                Preview: ${themeName} ${c.accent ? `<span style="color:${c.accent};">●</span>` : ''}
            </div>

            <!-- Simulated conversation -->
            <div style="padding: 0.75rem; background: #0d0d0d; display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- User turn -->
                <div style="${blockStyle(c.user_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; border-left: 3px solid ${c.accent || '#aaa'};">
                    <div style="${blockStyle(c.user_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        USER
                    </div>
                    <div style="${blockStyle(c.text_primary)};">Hello, can you help me?</div>
                </div>

                <!-- Assistant thinking indicator -->
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin: 0.25rem 0;">
                    <div style="${blockStyle(c.thinking_label)}; font-size: 0.7rem;">&lt;thinking&gt;</div>
                </div>

                <!-- Tool call -->
                <div style="${blockStyle({ bg: c.tool_label?.bg || '#1a1a1a' })}; border: 1px dotted ${c.tool_label?.fg || '#444'}; padding: 0.5rem; border-radius: 4px;">
                    <span style="${blockStyle(c.tool_label)}; font-size: 0.75rem;">⚙️ runCode(python)</span>
                </div>

                <!-- Assistant turn -->
                <div style="${blockStyle(c.assistant_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; margin-top: 0.25rem;">
                    <div style="${blockStyle(c.assistant_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        ASSISTANT
                    </div>
                    <div style="${blockStyle(c.text_primary)};">
                        I ran the code. The result is <span style="${blockStyle(c.text_secondary)};">42</span>.
                    </div>
                    <div style="${blockStyle(c.text_muted)}; font-size: 0.75rem; margin-top: 0.25rem;">
                        (Took 0.3s)
                    </div>
                </div>
            </div>

            <!-- Color Swatches Grid -->
            <div style="padding: 0.75rem; border-top: 1px solid var(--border-color); display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1.5rem;">
                ${c.accent ? swatch('accent', { fg: c.accent }) : ''}
                ${swatch('user', c.user_label)}
                ${swatch('assistant', c.assistant_label)}
                ${swatch('tool', c.tool_label)}
                ${swatch('thinking', c.thinking_label)}
                ${swatch('text primary', c.text_primary)}
                ${swatch('text secondary', c.text_secondary)}
                ${swatch('text muted', c.text_muted)}
                ${c.border_active ? swatch('border active', { fg: c.border_active }) : ''}
            </div>
        </div>
    `;
}
