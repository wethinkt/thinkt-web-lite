// src/main.ts
import './style.css';
import { renderProjects } from './views/Projects';
import { renderSources } from './views/Sources';
import { renderDashboard } from './views/Dashboard';
import { renderApps } from './views/Apps';
import { renderThemes } from './views/Themes';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    <nav class="sidebar">
      <div class="sidebar-header">
        <a href="https://wethinkt.com" target="_blank" rel="noopener" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; font-weight: 500;">
          <span class="icon">🧠</span> thinkt lite
        </a>
      </div>
      <div class="nav-menu">
        <div class="nav-item active" data-view="dashboard">
          <span class="icon">📊</span> Dashboard
        </div>
        <div class="nav-item" data-view="projects">
          <span class="icon">📁</span> Projects
        </div>
        <div class="nav-item" data-view="sources">
          <span class="icon">🔌</span> Sources
        </div>
        <div class="nav-item" data-view="apps">
          <span class="icon">🧩</span> Apps
        </div>
        <div class="nav-item" data-view="themes">
          <span class="icon">🎨</span> Themes
        </div>
        <a href="/swagger/index.html" target="_blank" rel="noopener" class="nav-item" style="text-decoration: none;">
          <span class="icon">📚</span> API Docs
          <span style="margin-left: auto; font-size: 0.8rem; opacity: 0.7;">↗</span>
        </a>
      </div>
      <div class="theme-toggle" id="theme-toggle">
        <span class="icon">🌓</span> Toggle Theme
      </div>
    </nav>
    <main class="main-content">
      <header class="header">
        <h1 id="view-title">Dashboard</h1>
        <div id="header-controls"></div>
      </header>
      <div class="view-container" id="view-container">
        <!-- Content injected here -->
      </div>
    </main>
  `;

  const navItems = document.querySelectorAll('.nav-item');
  const viewTitle = document.getElementById('view-title');
  const viewContainer = document.getElementById('view-container');
  const themeToggle = document.getElementById('theme-toggle');

  // Theme support
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // View switching logic
  function switchView(viewName: string) {
    if (!viewTitle || !viewContainer) return;

    const headerControls = document.getElementById("header-controls");
    if (headerControls) headerControls.innerHTML = "";

    // Update active nav
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
        viewTitle.textContent = item.textContent?.trim() || viewName;
      }
    });

    // Render content
    viewContainer.innerHTML = '';

    switch (viewName) {
      case 'dashboard':
        renderDashboard(viewContainer, headerControls);
        break;
      case 'projects':
        renderProjects(viewContainer, headerControls);
        break;
      case 'sources':
        renderSources(viewContainer, headerControls);
        break;
      case 'apps':
        renderApps(viewContainer, headerControls);
        break;
      case 'themes':
        renderThemes(viewContainer, headerControls);
        break;
      default:
        viewContainer.innerHTML = `<div class="error">View "${viewName}" not implemented yet</div>`;
    }
  }

  // Handle nav clicks
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewName = item.getAttribute('data-view');
      if (viewName) switchView(viewName);
    });
  });

  // Global event listener for programmatic navigation
  document.addEventListener('navigate', (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    switchView(customEvent.detail);
  });

  // Initialize
  switchView('dashboard');
}
