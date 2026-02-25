// src/views/EndpointTester.ts
import { rawApiFetch } from '../api';
import { syntaxHighlight } from '../utils';

export function renderEndpointTester(container: HTMLElement) {
    container.innerHTML = `
    <div class="tester-layout">
        <!-- Input section -->
        <div class="tester-form panel">
            <h2 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <span><span class="icon">🔌</span> Request</span>
            </h2>
            
            <div class="form-group">
                <label class="form-label">Method</label>
                <select id="tester-method" class="input" style="width: auto;">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Endpoint Path</label>
                <input type="text" id="tester-path" class="input" placeholder="/api/v1/status" value="/api/v1/sources" style="font-family: 'IBM Plex Mono', monospace;">
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    Base URL is inferred from the proxy/client config.
                </div>
            </div>
            
            <div class="form-group" id="tester-body-group" style="display: none;">
                <label class="form-label" style="display: flex; justify-content: space-between;">
                    <span>Request Body (JSON)</span>
                    <button class="btn btn-secondary" style="padding: 0.1rem 0.5rem; font-size: 0.7rem;" id="tester-format-json">Format JSON</button>
                </label>
                <textarea id="tester-body" class="input" placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"></textarea>
                <div id="tester-body-error" style="color: var(--danger-color); font-size: 0.75rem; margin-top: 0.5rem; display: none;">Invalid JSON</div>
            </div>
            
            <div style="margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--border-color); display: flex; gap: 1rem;">
                <button class="btn" id="tester-send" style="padding: 0.75rem 2rem;">🚀 Send Request</button>
                <button class="btn btn-secondary" id="tester-clear" style="padding: 0.75rem 1rem;">Clear Response</button>
            </div>
        </div>

        <!-- Output section -->
        <div class="panel" style="display: flex; flex-direction: column;">
            <h2 style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <span><span class="icon">📦</span> Response</span>
                <span id="tester-status" class="status-badge" style="display: none;"></span>
            </h2>
            <div id="tester-response" class="tester-response" style="flex: 1;"><span style="color: var(--text-secondary); font-style: italic;">No request sent yet.</span></div>
        </div>
    </div>
  `;

  const methodSelect = document.getElementById('tester-method') as HTMLSelectElement;
  const pathInput = document.getElementById('tester-path') as HTMLInputElement;
  const bodyGroup = document.getElementById('tester-body-group') as HTMLElement;
  const bodyInput = document.getElementById('tester-body') as HTMLTextAreaElement;
  const bodyError = document.getElementById('tester-body-error') as HTMLElement;
  const sendBtn = document.getElementById('tester-send') as HTMLButtonElement;
  const clearBtn = document.getElementById('tester-clear') as HTMLButtonElement;
  const formatBtn = document.getElementById('tester-format-json') as HTMLButtonElement;
  const responseDiv = document.getElementById('tester-response') as HTMLElement;
  const statusBadge = document.getElementById('tester-status') as HTMLElement;

  // Show/hide body input based on method
  methodSelect.addEventListener('change', () => {
    const requiresBody = ['POST', 'PUT', 'PATCH'].includes(methodSelect.value);
    bodyGroup.style.display = requiresBody ? 'block' : 'none';
  });

  // Format JSON helper
  formatBtn.addEventListener('click', () => {
    if (!bodyInput.value.trim()) return;
    try {
      const parsed = JSON.parse(bodyInput.value);
      bodyInput.value = JSON.stringify(parsed, null, 2);
      bodyError.style.display = 'none';
    } catch {
      bodyError.style.display = 'block';
    }
  });

  // Clear output
  clearBtn.addEventListener('click', () => {
    responseDiv.innerHTML = '<span style="color: var(--text-secondary); font-style: italic;">No request sent yet.</span>';
    statusBadge.style.display = 'none';
  });

  // Execute Request
  sendBtn.addEventListener('click', async () => {
    let path = pathInput.value.trim();
    if (!path) {
      pathInput.focus();
      return;
    }
    if (!path.startsWith('/')) path = '/' + path;

    const method = methodSelect.value;
    const options: RequestInit = { method };

    // Handle body parsing for POST/PUT
    if (bodyGroup.style.display !== 'none' && bodyInput.value.trim()) {
      try {
        // Validate JSON before sending
        JSON.parse(bodyInput.value);
        options.body = bodyInput.value;
        options.headers = { 'Content-Type': 'application/json' };
        bodyError.style.display = 'none';
      } catch {
        bodyError.style.display = 'block';
        return;
      }
    }

    // UI loading state
    sendBtn.disabled = true;
    sendBtn.textContent = '⏳ Sending...';
    responseDiv.innerHTML = '<span style="color: var(--text-secondary); font-style: italic;">Waiting for response...</span>';
    statusBadge.style.display = 'none';

    try {
      const startTime = performance.now();
      const res = await rawApiFetch(path, options);
      const ms = Math.round(performance.now() - startTime);

      statusBadge.textContent = `Success (${ms}ms)`;
      statusBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
      statusBadge.style.color = 'var(--success-color)';
      statusBadge.style.display = 'inline-block';

      responseDiv.innerHTML = syntaxHighlight(JSON.stringify(res, null, 2));
    } catch (err: any) {
      statusBadge.textContent = 'Error';
      statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      statusBadge.style.color = 'var(--danger-color)';
      statusBadge.style.display = 'inline-block';

      // Check if it's already a JSON error object from our fetch wrapper
      let errMsg = err.message || 'Unknown fetch error';
      if (typeof err === 'object' && err.message) {
        responseDiv.innerHTML = `<span style="color: var(--danger-color);">${errMsg}</span>`;
      } else {
        responseDiv.textContent = errMsg;
      }
    } finally {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '🚀 Send Request';
    }
  });

  // Allow pressing Enter in path input to trigger fetch
  pathInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
}
