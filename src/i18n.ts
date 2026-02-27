export const SUPPORTED_LOCALES = ['en', 'es', 'zh'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
};

const STORAGE_KEY = 'thinkt-lite-locale';
const DEFAULT_LOCALE: SupportedLocale = 'en';

const translations: Record<SupportedLocale, Record<string, string>> = {
  en: {
    'document.title': 'Thinkt Web Lite',
    'app.title': 'thinkt lite',
    'language.label': 'Language',
    'action.toggleTheme': 'Toggle Theme',

    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.sources': 'Sources',
    'nav.apps': 'Apps',
    'nav.themes': 'Themes',
    'nav.apiDocs': 'API Docs',

    'error.viewNotImplemented': 'View "{viewName}" not implemented yet',

    'tabs.rendered': 'Rendered',
    'tabs.rawJson': 'Raw JSON',
    'loading.default': 'Loading...',

    'json.openRawData': 'Open raw data in new tab',
    'json.copyApiResponse': 'Copy API Response',
    'json.downloadJson': 'Download JSON',
    'json.copied': 'Copied!',
    'json.copyFailed': 'Failed',

    'common.notAvailable': '-',
    'common.unknown': 'Unknown',
    'common.unknownError': 'Unknown error',
    'common.failedWithMessage': 'Failed: {message}',
    'common.enabled': 'enabled',
    'common.disabled': 'disabled',
    'common.yes': 'Yes',
    'common.no': 'No',

    'status.online': 'Online',
    'status.offline': 'Offline',

    'time.secondsShort': '{count}s',
    'time.minutesShort': '{count}m',
    'time.hoursMinutesShort': '{hours}h {minutes}m',

    'dashboard.systemStatus': 'System Status',
    'dashboard.connecting': 'Connecting...',
    'dashboard.usageStatistics': 'Usage Statistics',
    'dashboard.loadingStats': 'Loading stats...',
    'dashboard.serverInformation': 'Server Information',
    'dashboard.loadingServerInfo': 'Loading server info...',
    'dashboard.indexerStatus': 'Indexer Status',
    'dashboard.loadingIndexerStatus': 'Loading indexer status...',
    'dashboard.aboutTitle': 'About Thinkt Web Lite',
    'dashboard.aboutBody': 'Developer-oriented diagnostic tool for the Thinkt API. Monitor projects, verify sources, inspect indexer health, and test API endpoints.',
    'dashboard.sessions': 'Sessions',
    'dashboard.projects': 'Projects',
    'dashboard.entries': 'Entries',
    'dashboard.totalTokens': 'Total Tokens',
    'dashboard.topToolsUsed': 'Top Tools Used',
    'dashboard.failedToLoadStats': 'Failed to load stats: {message}',
    'dashboard.version': 'Version',
    'dashboard.uptime': 'Uptime',
    'dashboard.auth': 'Auth',
    'dashboard.pid': 'PID',
    'dashboard.serverInfoUnavailable': 'Server info unavailable: {message}',
    'dashboard.model': 'Model',
    'dashboard.watching': 'Watching',
    'dashboard.state': 'State',
    'dashboard.running': 'Running',
    'dashboard.idle': 'Idle',
    'dashboard.syncProgress': 'Sync Progress',
    'dashboard.embeddingProgress': 'Embedding Progress',
    'dashboard.project': 'Project: {name}',
    'dashboard.chunks': 'Chunks',
    'dashboard.noActiveSyncOrEmbedding': 'No active sync or embedding in progress.',
    'dashboard.indexerStatusUnavailable': 'Indexer status unavailable: {message}',

    'projects.loadingProjects': 'Loading projects...',
    'projects.sortByName': 'Sort by name',
    'projects.sortByTime': 'Sort by time',
    'projects.toggleSortDirection': 'Toggle sort direction',
    'projects.sortName': 'Name',
    'projects.sortTime': 'Time',
    'projects.noProjectsFound': 'No projects found.',
    'projects.unnamedProject': 'Unnamed Project',
    'projects.copyPath': 'Copy path',
    'projects.openIn': 'Open in...',
    'projects.resume': 'Resume ({source})',
    'projects.noSessionsFound': 'No sessions found for {source} in this project.',
    'projects.couldNotDetermineSessionPath': 'Could not determine session path for resume.',
    'projects.failedToLoadProjects': 'Failed to load projects: {message}',

    'sources.loadingSources': 'Loading sources...',
    'sources.noSourcesFound': 'No sources found.',
    'sources.resumable': 'Resumable',
    'sources.resumableTooltip': 'This source supports continuous conversation history',
    'sources.failedToLoadSources': 'Failed to load sources: {message}',

    'apps.loadingApps': 'Loading apps...',
    'apps.noAppsConfigured': 'No apps configured.',
    'apps.terminal': 'terminal',
    'apps.default': 'default',
    'apps.terminalApp': 'Terminal App',
    'apps.defaultTerminal': 'Default Terminal',
    'apps.failedToLoadApps': 'Failed to load apps: {message}',

    'themes.loadingThemes': 'Loading themes...',
    'themes.noThemesFound': 'No themes found.',
    'themes.previewDescription': 'Preview the available themes from the connected Thinkt API.',
    'themes.unnamed': 'Unnamed',
    'themes.active': 'Active',
    'themes.builtIn': 'Built-in',
    'themes.failedToLoadThemes': 'Failed to load themes: {message}',

    'themePreview.previewHeader': 'Preview: {themeName}',
    'themePreview.userLabel': 'USER',
    'themePreview.userExample': 'Hello, can you help me?',
    'themePreview.thinking': '<thinking>',
    'themePreview.assistantLabel': 'ASSISTANT',
    'themePreview.assistantExample': 'I ran the code. The result is',
    'themePreview.tookSeconds': '(Took {seconds}s)',
    'themePreview.swatchAccent': 'accent',
    'themePreview.swatchUser': 'user',
    'themePreview.swatchAssistant': 'assistant',
    'themePreview.swatchTool': 'tool',
    'themePreview.swatchThinking': 'thinking',
    'themePreview.swatchTextPrimary': 'text primary',
    'themePreview.swatchTextSecondary': 'text secondary',
    'themePreview.swatchTextMuted': 'text muted',
    'themePreview.swatchBorderActive': 'border active',
  },
  es: {
    'document.title': 'Thinkt Web Lite',
    'app.title': 'thinkt lite',
    'language.label': 'Idioma',
    'action.toggleTheme': 'Cambiar tema',

    'nav.dashboard': 'Panel',
    'nav.projects': 'Proyectos',
    'nav.sources': 'Fuentes',
    'nav.apps': 'Apps',
    'nav.themes': 'Temas',
    'nav.apiDocs': 'Docs API',

    'error.viewNotImplemented': 'La vista "{viewName}" aun no esta implementada',

    'tabs.rendered': 'Renderizado',
    'tabs.rawJson': 'JSON sin formato',
    'loading.default': 'Cargando...',

    'json.openRawData': 'Abrir datos sin formato en una nueva pestana',
    'json.copyApiResponse': 'Copiar respuesta API',
    'json.downloadJson': 'Descargar JSON',
    'json.copied': 'Copiado!',
    'json.copyFailed': 'Error',

    'common.notAvailable': '-',
    'common.unknown': 'Desconocido',
    'common.unknownError': 'Error desconocido',
    'common.failedWithMessage': 'Error: {message}',
    'common.enabled': 'habilitado',
    'common.disabled': 'deshabilitado',
    'common.yes': 'Si',
    'common.no': 'No',

    'status.online': 'En linea',
    'status.offline': 'Desconectado',

    'time.secondsShort': '{count}s',
    'time.minutesShort': '{count}m',
    'time.hoursMinutesShort': '{hours}h {minutes}m',

    'dashboard.systemStatus': 'Estado del sistema',
    'dashboard.connecting': 'Conectando...',
    'dashboard.usageStatistics': 'Estadisticas de uso',
    'dashboard.loadingStats': 'Cargando estadisticas...',
    'dashboard.serverInformation': 'Informacion del servidor',
    'dashboard.loadingServerInfo': 'Cargando informacion del servidor...',
    'dashboard.indexerStatus': 'Estado del indexador',
    'dashboard.loadingIndexerStatus': 'Cargando estado del indexador...',
    'dashboard.aboutTitle': 'Acerca de Thinkt Web Lite',
    'dashboard.aboutBody': 'Herramienta de diagnostico orientada a desarrolladores para la API de Thinkt. Supervisa proyectos, verifica fuentes, inspecciona el indexador y prueba endpoints API.',
    'dashboard.sessions': 'Sesiones',
    'dashboard.projects': 'Proyectos',
    'dashboard.entries': 'Entradas',
    'dashboard.totalTokens': 'Tokens totales',
    'dashboard.topToolsUsed': 'Herramientas mas usadas',
    'dashboard.failedToLoadStats': 'No se pudieron cargar las estadisticas: {message}',
    'dashboard.version': 'Version',
    'dashboard.uptime': 'Tiempo activo',
    'dashboard.auth': 'Auth',
    'dashboard.pid': 'PID',
    'dashboard.serverInfoUnavailable': 'Informacion del servidor no disponible: {message}',
    'dashboard.model': 'Modelo',
    'dashboard.watching': 'Observando',
    'dashboard.state': 'Estado',
    'dashboard.running': 'En ejecucion',
    'dashboard.idle': 'Inactivo',
    'dashboard.syncProgress': 'Progreso de sincronizacion',
    'dashboard.embeddingProgress': 'Progreso de embeddings',
    'dashboard.project': 'Proyecto: {name}',
    'dashboard.chunks': 'Fragmentos',
    'dashboard.noActiveSyncOrEmbedding': 'No hay sincronizacion ni embeddings activos.',
    'dashboard.indexerStatusUnavailable': 'Estado del indexador no disponible: {message}',

    'projects.loadingProjects': 'Cargando proyectos...',
    'projects.sortByName': 'Ordenar por nombre',
    'projects.sortByTime': 'Ordenar por fecha',
    'projects.toggleSortDirection': 'Cambiar direccion de orden',
    'projects.sortName': 'Nombre',
    'projects.sortTime': 'Fecha',
    'projects.noProjectsFound': 'No se encontraron proyectos.',
    'projects.unnamedProject': 'Proyecto sin nombre',
    'projects.copyPath': 'Copiar ruta',
    'projects.openIn': 'Abrir en...',
    'projects.resume': 'Reanudar ({source})',
    'projects.noSessionsFound': 'No se encontraron sesiones de {source} en este proyecto.',
    'projects.couldNotDetermineSessionPath': 'No se pudo determinar la ruta de sesion para reanudar.',
    'projects.failedToLoadProjects': 'No se pudieron cargar los proyectos: {message}',

    'sources.loadingSources': 'Cargando fuentes...',
    'sources.noSourcesFound': 'No se encontraron fuentes.',
    'sources.resumable': 'Reanudable',
    'sources.resumableTooltip': 'Esta fuente admite historial continuo de conversaciones',
    'sources.failedToLoadSources': 'No se pudieron cargar las fuentes: {message}',

    'apps.loadingApps': 'Cargando apps...',
    'apps.noAppsConfigured': 'No hay apps configuradas.',
    'apps.terminal': 'terminal',
    'apps.default': 'predeterminada',
    'apps.terminalApp': 'App de terminal',
    'apps.defaultTerminal': 'Terminal predeterminada',
    'apps.failedToLoadApps': 'No se pudieron cargar las apps: {message}',

    'themes.loadingThemes': 'Cargando temas...',
    'themes.noThemesFound': 'No se encontraron temas.',
    'themes.previewDescription': 'Previsualiza los temas disponibles desde la API de Thinkt conectada.',
    'themes.unnamed': 'Sin nombre',
    'themes.active': 'Activo',
    'themes.builtIn': 'Integrado',
    'themes.failedToLoadThemes': 'No se pudieron cargar los temas: {message}',

    'themePreview.previewHeader': 'Vista previa: {themeName}',
    'themePreview.userLabel': 'USUARIO',
    'themePreview.userExample': 'Hola, puedes ayudarme?',
    'themePreview.thinking': '<pensando>',
    'themePreview.assistantLabel': 'ASISTENTE',
    'themePreview.assistantExample': 'Ejecute el codigo. El resultado es',
    'themePreview.tookSeconds': '(Tardo {seconds}s)',
    'themePreview.swatchAccent': 'acento',
    'themePreview.swatchUser': 'usuario',
    'themePreview.swatchAssistant': 'asistente',
    'themePreview.swatchTool': 'herramienta',
    'themePreview.swatchThinking': 'pensando',
    'themePreview.swatchTextPrimary': 'texto primario',
    'themePreview.swatchTextSecondary': 'texto secundario',
    'themePreview.swatchTextMuted': 'texto tenue',
    'themePreview.swatchBorderActive': 'borde activo',
  },
  zh: {
    'document.title': 'Thinkt Web Lite',
    'app.title': 'thinkt lite',
    'language.label': '语言',
    'action.toggleTheme': '切换主题',

    'nav.dashboard': '仪表盘',
    'nav.projects': '项目',
    'nav.sources': '来源',
    'nav.apps': '应用',
    'nav.themes': '主题',
    'nav.apiDocs': 'API 文档',

    'error.viewNotImplemented': '视图“{viewName}”尚未实现',

    'tabs.rendered': '渲染视图',
    'tabs.rawJson': '原始 JSON',
    'loading.default': '加载中...',

    'json.openRawData': '在新标签页中打开原始数据',
    'json.copyApiResponse': '复制 API 响应',
    'json.downloadJson': '下载 JSON',
    'json.copied': '已复制!',
    'json.copyFailed': '失败',

    'common.notAvailable': '-',
    'common.unknown': '未知',
    'common.unknownError': '未知错误',
    'common.failedWithMessage': '失败: {message}',
    'common.enabled': '已启用',
    'common.disabled': '已禁用',
    'common.yes': '是',
    'common.no': '否',

    'status.online': '在线',
    'status.offline': '离线',

    'time.secondsShort': '{count}秒',
    'time.minutesShort': '{count}分',
    'time.hoursMinutesShort': '{hours}小时 {minutes}分',

    'dashboard.systemStatus': '系统状态',
    'dashboard.connecting': '连接中...',
    'dashboard.usageStatistics': '使用统计',
    'dashboard.loadingStats': '正在加载统计...',
    'dashboard.serverInformation': '服务器信息',
    'dashboard.loadingServerInfo': '正在加载服务器信息...',
    'dashboard.indexerStatus': '索引器状态',
    'dashboard.loadingIndexerStatus': '正在加载索引器状态...',
    'dashboard.aboutTitle': '关于 Thinkt Web Lite',
    'dashboard.aboutBody': '面向开发者的 Thinkt API 诊断工具。可监控项目、验证来源、检查索引器健康状态并测试 API 端点。',
    'dashboard.sessions': '会话',
    'dashboard.projects': '项目',
    'dashboard.entries': '条目',
    'dashboard.totalTokens': '总 Token',
    'dashboard.topToolsUsed': '最常用工具',
    'dashboard.failedToLoadStats': '加载统计失败: {message}',
    'dashboard.version': '版本',
    'dashboard.uptime': '运行时长',
    'dashboard.auth': '认证',
    'dashboard.pid': 'PID',
    'dashboard.serverInfoUnavailable': '服务器信息不可用: {message}',
    'dashboard.model': '模型',
    'dashboard.watching': '监听中',
    'dashboard.state': '状态',
    'dashboard.running': '运行中',
    'dashboard.idle': '空闲',
    'dashboard.syncProgress': '同步进度',
    'dashboard.embeddingProgress': '嵌入进度',
    'dashboard.project': '项目: {name}',
    'dashboard.chunks': '分块',
    'dashboard.noActiveSyncOrEmbedding': '当前没有进行中的同步或嵌入任务。',
    'dashboard.indexerStatusUnavailable': '索引器状态不可用: {message}',

    'projects.loadingProjects': '正在加载项目...',
    'projects.sortByName': '按名称排序',
    'projects.sortByTime': '按时间排序',
    'projects.toggleSortDirection': '切换排序方向',
    'projects.sortName': '名称',
    'projects.sortTime': '时间',
    'projects.noProjectsFound': '未找到项目。',
    'projects.unnamedProject': '未命名项目',
    'projects.copyPath': '复制路径',
    'projects.openIn': '打开方式...',
    'projects.resume': '继续 ({source})',
    'projects.noSessionsFound': '该项目中未找到 {source} 的会话。',
    'projects.couldNotDetermineSessionPath': '无法确定用于继续会话的路径。',
    'projects.failedToLoadProjects': '加载项目失败: {message}',

    'sources.loadingSources': '正在加载来源...',
    'sources.noSourcesFound': '未找到来源。',
    'sources.resumable': '可继续',
    'sources.resumableTooltip': '该来源支持连续对话历史',
    'sources.failedToLoadSources': '加载来源失败: {message}',

    'apps.loadingApps': '正在加载应用...',
    'apps.noAppsConfigured': '未配置应用。',
    'apps.terminal': '终端',
    'apps.default': '默认',
    'apps.terminalApp': '终端应用',
    'apps.defaultTerminal': '默认终端',
    'apps.failedToLoadApps': '加载应用失败: {message}',

    'themes.loadingThemes': '正在加载主题...',
    'themes.noThemesFound': '未找到主题。',
    'themes.previewDescription': '预览已连接 Thinkt API 提供的可用主题。',
    'themes.unnamed': '未命名',
    'themes.active': '启用中',
    'themes.builtIn': '内置',
    'themes.failedToLoadThemes': '加载主题失败: {message}',

    'themePreview.previewHeader': '预览: {themeName}',
    'themePreview.userLabel': '用户',
    'themePreview.userExample': '你好，可以帮我吗？',
    'themePreview.thinking': '<思考中>',
    'themePreview.assistantLabel': '助手',
    'themePreview.assistantExample': '我已运行代码，结果是',
    'themePreview.tookSeconds': '(耗时 {seconds}s)',
    'themePreview.swatchAccent': '强调色',
    'themePreview.swatchUser': '用户',
    'themePreview.swatchAssistant': '助手',
    'themePreview.swatchTool': '工具',
    'themePreview.swatchThinking': '思考',
    'themePreview.swatchTextPrimary': '主文本',
    'themePreview.swatchTextSecondary': '次文本',
    'themePreview.swatchTextMuted': '弱文本',
    'themePreview.swatchBorderActive': '激活边框',
  },
};

let currentLocale: SupportedLocale = DEFAULT_LOCALE;

function normalizeLocale(raw: string | null | undefined): SupportedLocale | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  const base = lower.split('-')[0];

  if (SUPPORTED_LOCALES.includes(lower as SupportedLocale)) {
    return lower as SupportedLocale;
  }
  if (SUPPORTED_LOCALES.includes(base as SupportedLocale)) {
    return base as SupportedLocale;
  }
  return null;
}

function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => String(params[key] ?? `{${key}}`));
}

export function initI18n(): SupportedLocale {
  const stored = normalizeLocale(localStorage.getItem(STORAGE_KEY));
  const browser = normalizeLocale(navigator.language);
  currentLocale = stored ?? browser ?? DEFAULT_LOCALE;
  document.documentElement.lang = currentLocale;
  return currentLocale;
}

export function setLocale(locale: SupportedLocale): void {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  currentLocale = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function t(key: string, params: Record<string, string | number> = {}): string {
  const template = translations[currentLocale][key] ?? translations.en[key] ?? key;
  return interpolate(template, params);
}
