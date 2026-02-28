import './style.css';
import { renderProjects } from './views/Projects';
import { renderSources } from './views/Sources';
import { renderDashboard } from './views/Dashboard';
import { renderApps } from './views/Apps';
import { renderThemes } from './views/Themes';
import { renderLanguages } from './views/Languages';
import { renderAuth } from './views/Auth';
import { LOCALE_LABELS, SUPPORTED_LOCALES, type SupportedLocale, getLocale, initI18n, setLocale, t } from './i18n';

const app = document.getElementById('app');
type ViewName = 'dashboard' | 'projects' | 'sources' | 'auth' | 'apps' | 'themes' | 'languages';

const views: Record<ViewName, { icon: string; labelKey: string; render: (container: HTMLElement, headerControls?: HTMLElement | null) => void }> = {
  dashboard: { icon: '📊', labelKey: 'nav.dashboard', render: renderDashboard },
  projects: { icon: '📁', labelKey: 'nav.projects', render: renderProjects },
  sources: { icon: '🔌', labelKey: 'nav.sources', render: renderSources },
  auth: { icon: '🔑', labelKey: 'nav.auth', render: renderAuth },
  apps: { icon: '🧩', labelKey: 'nav.apps', render: renderApps },
  themes: { icon: '🎨', labelKey: 'nav.themes', render: renderThemes },
  languages: { icon: '🌐', labelKey: 'nav.languages', render: renderLanguages },
};

let currentView: ViewName = 'dashboard';

function isViewName(value: string): value is ViewName {
  return value in views;
}

function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function switchView(viewName: string): void {
  const nextView: ViewName = isViewName(viewName) ? viewName : 'dashboard';
  currentView = nextView;

  const viewTitle = document.getElementById('view-title');
  const viewContainer = document.getElementById('view-container');
  const headerControls = document.getElementById('header-controls');

  if (!viewTitle || !viewContainer) return;

  if (headerControls) {
    headerControls.innerHTML = '';
  }

  const navItems = document.querySelectorAll<HTMLElement>('.nav-item[data-view]');
  navItems.forEach((item) => {
    item.classList.toggle('active', item.getAttribute('data-view') === nextView);
  });

  const viewInfo = views[nextView];
  const viewLabel = t(viewInfo.labelKey);
  viewTitle.textContent = viewLabel;
  document.title = `${viewLabel} - ${t('document.title')}`;

  viewContainer.innerHTML = '';
  viewInfo.render(viewContainer, headerControls);
}

function renderShell(): void {
  if (!app) return;

  const navItems = Object.entries(views)
    .map(([viewName, view]) => `
      <div class="nav-item${viewName === currentView ? ' active' : ''}" data-view="${viewName}">
        <span class="icon">${view.icon}</span> ${t(view.labelKey)}
      </div>
    `)
    .join('');

  const languageOptions = SUPPORTED_LOCALES
    .map((locale) => `<option value="${locale}"${locale === getLocale() ? ' selected' : ''}>${LOCALE_LABELS[locale]}</option>`)
    .join('');

  app.innerHTML = `
    <nav class="sidebar">
      <div class="sidebar-header">
        <a href="https://wethinkt.com" target="_blank" rel="noopener" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; font-weight: 500;">
          <span class="icon">🧠</span> ${t('app.title')}
        </a>
      </div>
      <div class="nav-menu">
        ${navItems}
        <a href="/swagger/index.html" target="_blank" rel="noopener" class="nav-item" style="text-decoration: none;">
          <span class="icon">📚</span> ${t('nav.apiDocs')}
          <span style="margin-left: auto; font-size: 0.8rem; opacity: 0.7;">↗</span>
        </a>
      </div>
      <div class="sidebar-footer">
        <div class="language-picker">
          <label for="lang-select" class="language-label">${t('language.label')}</label>
          <select id="lang-select" class="input language-select">${languageOptions}</select>
        </div>
        <button class="theme-toggle" id="theme-toggle" type="button">
          <span class="icon">🌓</span> ${t('action.toggleTheme')}
        </button>
      </div>
    </nav>
    <main class="main-content">
      <header class="header">
        <h1 id="view-title"></h1>
        <div id="header-controls"></div>
      </header>
      <div class="view-container" id="view-container"></div>
    </main>
  `;

  const shellNavItems = document.querySelectorAll<HTMLElement>('.nav-item[data-view]');
  shellNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      const viewName = item.getAttribute('data-view');
      if (viewName) {
        switchView(viewName);
      }
    });
  });

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  const langSelect = document.getElementById('lang-select');
  if (langSelect instanceof HTMLSelectElement) {
    langSelect.addEventListener('change', () => {
      const next = langSelect.value;
      if (!isSupportedLocale(next)) return;

      setLocale(next);
      renderShell();
      switchView(currentView);
    });
  }
}

if (app) {
  initI18n();
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  document.addEventListener('navigate', (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    if (typeof customEvent.detail === 'string') {
      switchView(customEvent.detail);
    }
  });

  renderShell();
  switchView('dashboard');
}
