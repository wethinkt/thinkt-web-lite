var B=Object.defineProperty;var P=(t,e,i)=>e in t?B(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var y=(t,e,i)=>P(t,typeof e!="symbol"?e+"":e,i);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();class k extends Error{constructor(i,s,n){super(i);y(this,"statusCode");y(this,"response");this.statusCode=s,this.response=n,this.name="ThinktAPIError"}}class S extends Error{constructor(i,s){super(i);y(this,"originalError");this.originalError=s,this.name="ThinktNetworkError"}}const U={baseUrl:"http://localhost:8784",apiVersion:"/api/v1",timeout:3e4};function m(t,e,i,s){let n=`${t}${e}${i}`;if(s&&Object.keys(s).length>0){const a=new URLSearchParams;for(const[r,c]of Object.entries(s))c!=null&&a.append(r,String(c));const o=a.toString();o&&(n+=`?${o}`)}return n}class R{constructor(e){y(this,"config");this.config={...U,...e}}setConfig(e){this.config={...this.config,...e}}getConfig(){return{...this.config}}async fetchWithTimeout(e,i={},s){const n=new AbortController,a=setTimeout(()=>n.abort(),this.config.timeout),o=s?AbortSignal.any([n.signal,s]):n.signal,r=this.config.fetch??fetch;try{const c={};this.config.token&&(c.Authorization=`Bearer ${this.config.token}`);const d=await r(e,{...i,signal:o,headers:{Accept:"application/json",...c,...i.headers}});if(clearTimeout(a),!d.ok){let l;try{l=await d.json()}catch{}throw new k((l==null?void 0:l.message)||`HTTP ${d.status}: ${d.statusText}`,d.status,l)}return await d.json()}catch(c){throw clearTimeout(a),c instanceof k?c:c instanceof Error&&c.name==="AbortError"?s!=null&&s.aborted?c:new S(`Request timeout after ${this.config.timeout}ms`,c):new S(c instanceof Error?c.message:"Network error",c)}}async getSources(){const e=m(this.config.baseUrl,this.config.apiVersion,"/sources");return(await this.fetchWithTimeout(e)).sources??[]}async getProjects(e,i){const s=m(this.config.baseUrl,this.config.apiVersion,"/projects",{source:e,include_deleted:i!=null&&i.includeDeleted?"true":void 0});return(await this.fetchWithTimeout(s,{},i==null?void 0:i.signal)).projects??[]}async getSessions(e,i,s){const n=encodeURIComponent(e),a=i==null?void 0:i.trim().toLowerCase(),o=a?`/projects/${encodeURIComponent(a)}/${n}/sessions`:`/projects/${n}/sessions`,r=m(this.config.baseUrl,this.config.apiVersion,o);return(await this.fetchWithTimeout(r,{},s)).sessions??[]}async getSession(e,i){const s=encodeURIComponent(e),n=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}`,{limit:i==null?void 0:i.limit,offset:i==null?void 0:i.offset}),a=await this.fetchWithTimeout(n,{},i==null?void 0:i.signal);return{meta:a.meta,entries:a.entries??[],total:a.total??0,has_more:a.has_more??!1}}async getSessionMetadata(e,i){const s=encodeURIComponent(e),n={limit:i==null?void 0:i.limit,offset:i==null?void 0:i.offset,sort_by:i==null?void 0:i.sortBy};i!=null&&i.excludeRoles&&i.excludeRoles.length>0&&(n.exclude_roles=i.excludeRoles.join(",")),(i==null?void 0:i.summaryOnly)!==void 0&&(n.summary_only=i.summaryOnly?"true":"false");const a=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}/metadata`,n);return await this.fetchWithTimeout(a)}async openIn(e,i){const s=m(this.config.baseUrl,this.config.apiVersion,"/open-in"),n=await this.fetchWithTimeout(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({app:e,path:i})});if(n.error)throw new Error(n.error)}async getOpenInApps(){const e=m(this.config.baseUrl,this.config.apiVersion,"/open-in/apps");return(await this.fetchWithTimeout(e)).apps??[]}async search(e){const i={q:e.query,project:e.project,source:e.source,limit:e.limit,limit_per_session:e.limitPerSession};e.caseSensitive&&(i.case_sensitive="true"),e.regex&&(i.regex="true");const s=m(this.config.baseUrl,this.config.apiVersion,"/search",i);return await this.fetchWithTimeout(s,{},e.signal)}async semanticSearch(e){const i={q:e.query,project:e.project,source:e.source,limit:e.limit,max_distance:e.maxDistance};e.diversity&&(i.diversity="true");const s=m(this.config.baseUrl,this.config.apiVersion,"/semantic-search",i);return await this.fetchWithTimeout(s,{},e.signal)}async getResumeCommand(e){const i=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${i}/resume`);return await this.fetchWithTimeout(s)}async execResumeSession(e){const i=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${i}/resume?action=exec`);return await this.fetchWithTimeout(s)}async getIndexerHealth(){const e=m(this.config.baseUrl,this.config.apiVersion,"/indexer/health");return await this.fetchWithTimeout(e)}async getIndexerStatus(){const e=m(this.config.baseUrl,this.config.apiVersion,"/indexer/status");return await this.fetchWithTimeout(e)}async getStats(){const e=m(this.config.baseUrl,this.config.apiVersion,"/stats");return await this.fetchWithTimeout(e)}async getTeams(){const e=m(this.config.baseUrl,this.config.apiVersion,"/teams");return(await this.fetchWithTimeout(e)).teams??[]}async getTeam(e){const i=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/teams/${i}`);return await this.fetchWithTimeout(s)}async getTeamMemberMessages(e,i){const s=encodeURIComponent(e),n=encodeURIComponent(i),a=m(this.config.baseUrl,this.config.apiVersion,`/teams/${s}/members/${n}/messages`);return(await this.fetchWithTimeout(a)).messages??[]}async getTeamTasks(e){const i=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/teams/${i}/tasks`);return(await this.fetchWithTimeout(s)).tasks??[]}async getThemes(){const e=m(this.config.baseUrl,this.config.apiVersion,"/themes");return await this.fetchWithTimeout(e)}async*streamSessionEntries(e,i=100,s){let n=0,a=!0;for(;a;){const o=await this.getSession(e,{limit:i,offset:n,signal:s});for(const r of o.entries)yield r;if(a=o.has_more,n+=o.entries.length,o.entries.length===0)break}}async getAllSessionEntries(e,i=100,s){const n=[];for await(const a of this.streamSessionEntries(e,i,s))n.push(a);return n}}function T(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}function z(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"tool":return"tool";case"system":return"system";case"summary":return"summary";case"progress":return"progress";case"checkpoint":return"checkpoint";default:return"assistant"}}function H(t){switch(t.type??"text"){case"text":return{type:"text",text:t.text??""};case"thinking":return{type:"thinking",thinking:t.thinking??"",signature:t.signature};case"tool_use":return{type:"tool_use",toolUseId:t.tool_use_id??"",toolName:t.tool_name??"unknown",toolInput:t.tool_input??{}};case"tool_result":return{type:"tool_result",toolUseId:t.tool_use_id??"",toolResult:t.tool_result??"",isError:t.is_error??!1};case"image":return{type:"image",mediaType:t.media_type??"image/png",mediaData:t.media_data??""};case"document":return{type:"document",mediaType:t.media_type??"application/pdf",mediaData:t.media_data??"",filename:void 0};default:return{type:"text",text:t.text??""}}}function O(t){return{id:t.id??"",name:t.name??"",path:t.path??"",displayPath:t.display_path,sessionCount:t.session_count??0,lastModified:t.last_modified?new Date(t.last_modified):void 0,source:T(t.source),workspaceId:t.workspace_id,sourceBasePath:t.source_base_path,pathExists:t.path_exists??!0}}function E(t){return{id:t.id??"unknown",projectPath:t.project_path,fullPath:t.full_path,firstPrompt:t.first_prompt,summary:t.summary,entryCount:t.entry_count??0,fileSize:t.file_size,createdAt:t.created_at?new Date(t.created_at):void 0,modifiedAt:t.modified_at?new Date(t.modified_at):void 0,gitBranch:t.git_branch,model:t.model,source:T(t.source),workspaceId:t.workspace_id,chunkCount:t.chunk_count,title:t.first_prompt?t.first_prompt.slice(0,60)+(t.first_prompt.length>60?"...":""):t.id??"Untitled Session"}}function L(t){var s;const e=((s=t.content_blocks)==null?void 0:s.map(H))??[],i={};return t.metadata&&Object.assign(i,t.metadata),t.workspace_id&&(i.workspaceId=t.workspace_id),{uuid:t.uuid??`entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,parentUuid:t.parent_uuid??void 0,role:z(t.role),timestamp:t.timestamp?new Date(t.timestamp):new Date,source:T(t.source),contentBlocks:e,text:t.text??e.filter(n=>n.type==="text").map(n=>n.text).join(`
`),model:t.model,usage:t.usage?{inputTokens:t.usage.input_tokens??0,outputTokens:t.usage.output_tokens??0,cacheCreationInputTokens:t.usage.cache_creation_input_tokens,cacheReadInputTokens:t.usage.cache_read_input_tokens}:void 0,gitBranch:t.git_branch,cwd:t.cwd,isCheckpoint:t.is_checkpoint??!1,isSidechain:t.is_sidechain??!1,agentId:t.agent_id,sourceAgentId:t.source_agent_id,metadata:Object.keys(i).length>0?i:void 0}}function q(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}class N{constructor(e){y(this,"_api");this._api=new R(e)}get api(){return this._api}setConfig(e){this._api.setConfig(e)}getConfig(){return this._api.getConfig()}async getSources(){return this._api.getSources()}async getProjects(e,i){return(await this._api.getProjects(e,i)).map(O)}async getSessions(e,i,s){return(await this._api.getSessions(e,i,s)).map(E)}async getSession(e,i){const s=await this._api.getSession(e,i);return{meta:E(s.meta),entries:s.entries.map(L),total:s.total,hasMore:s.has_more}}async getSessionMetadata(e,i){const s=await this._api.getSessionMetadata(e,i),n=s.meta;return{meta:{id:(n==null?void 0:n.id)??"unknown",fullPath:n==null?void 0:n.path,entryCount:s.total_entries??0,createdAt:n!=null&&n.created_at?new Date(n.created_at):void 0,modifiedAt:n!=null&&n.modified_at?new Date(n.modified_at):void 0,gitBranch:n==null?void 0:n.git_branch,model:n==null?void 0:n.model,source:q(n==null?void 0:n.source),title:(n==null?void 0:n.id)??"Session Metadata"},description:s.description,roleCounts:s.role_counts??{},entrySummary:(s.entry_summary??[]).map(o=>({index:o.index,role:o.role,timestamp:o.timestamp,contentLength:o.content_length,hasThinking:o.has_thinking,hasToolUse:o.has_tool_use,hasToolResult:o.has_tool_result,preview:o.preview})),totalEntries:s.total_entries??0,totalContentBytes:s.total_content_bytes??0,returnedSummaries:s.returned_summaries??0}}async openIn(e,i){return this._api.openIn(e,i)}async getOpenInApps(){return this._api.getOpenInApps()}async search(e){return this._api.search(e)}async semanticSearch(e){return this._api.semanticSearch(e)}async getResumeCommand(e){return this._api.getResumeCommand(e)}async execResumeSession(e){return this._api.execResumeSession(e)}async getIndexerHealth(){return this._api.getIndexerHealth()}async getIndexerStatus(){return this._api.getIndexerStatus()}async getStats(){return this._api.getStats()}async getTeams(){return this._api.getTeams()}async getTeam(e){return this._api.getTeam(e)}async getTeamMemberMessages(e,i){return this._api.getTeamMemberMessages(e,i)}async getTeamTasks(e){return this._api.getTeamTasks(e)}async getThemes(){return this._api.getThemes()}async*streamSessionEntries(e,i,s){for await(const n of this._api.streamSessionEntries(e,i,s))yield L(n)}async getAllSessionEntries(e,i,s){const n=[];for await(const a of this.streamSessionEntries(e,i,s))n.push(a);return n}}function D(t){return new N(t)}const b=D({baseUrl:""});async function I(t){const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}: ${e.statusText}`);return e.json()}function h(t){return t==null?"—":t.toLocaleString()}function V(t){if(t==null)return"—";const e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}h ${i}m`:i>0?`${i}m ${s}s`:`${s}s`}function j(t,e){if(!e)return"";const i=Math.min(100,Math.round((t||0)/e*100));return`
        <div style="margin-top: 0.4rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                <span>${h(t)} / ${h(e)}</span>
                <span>${i}%</span>
            </div>
            <div style="background: var(--border-color); border-radius: 999px; height: 6px; overflow: hidden;">
                <div style="background: var(--accent-color); width: ${i}%; height: 100%; border-radius: 999px; transition: width 0.5s;"></div>
            </div>
        </div>
    `}function f(t,e,i,s){return`
        <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 1.25rem 1.5rem; flex: 1; min-width: 140px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">${t}</div>
            <div style="font-size: 1.75rem; font-weight: 700; line-height: 1; margin-bottom: 0.25rem;">${i}</div>
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">${e}</div>
            ${s?`<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem; opacity: 0.8;">${s}</div>`:""}
        </div>
    `}function W(t){t.innerHTML=`
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
  `;const e=document.getElementById("dashboard-connection"),i=document.getElementById("dashboard-stats"),s=document.getElementById("dashboard-indexer");b.getSources().then(()=>{e&&(e.innerHTML=`
                    <div class="connection-status connected" style="display: inline-flex;">
                        <span class="status-dot"></span>
                        Connected to Thinkt API
                    </div>`)}).catch(n=>{e&&(e.innerHTML=`
                    <div class="connection-status disconnected" style="display: inline-flex;">
                        <span class="status-dot"></span>
                        Offline — ${n.message||"Cannot reach Thinkt API"}
                    </div>`)}),b.getStats().then(n=>{if(!i)return;const a=Object.entries(n.tool_usage||{}).sort(([,o],[,r])=>r-o).slice(0,10);i.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${f("💬","Sessions",h(n.total_sessions))}
                    ${f("📁","Projects",h(n.total_projects))}
                    ${f("📝","Entries",h(n.total_entries))}
                    ${f("🪙","Total Tokens",h(n.total_tokens))}
                </div>
                ${a.length>0?`
                    <div style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Top Tools Used</div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${a.map(([o,r])=>{const c=a[0][1],d=Math.round(r/c*100);return`
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace; min-width: 180px; color: var(--text-primary);">${o}</div>
                                    <div style="flex: 1; background: var(--border-color); border-radius: 999px; height: 8px; overflow: hidden;">
                                        <div style="background: var(--accent-color); width: ${d}%; height: 100%; border-radius: 999px;"></div>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary); min-width: 50px; text-align: right;">${h(r)}</div>
                                </div>
                            `}).join("")}
                    </div>
                `:""}
            `}).catch(n=>{i&&(i.innerHTML=`<div class="error">Failed to load stats: ${n.message}</div>`)}),b.getIndexerStatus().then(n=>{if(!s)return;const a=n.running?"var(--success-color)":"var(--text-secondary)",o=n.sync_progress,r=n.embed_progress;s.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${f("🧠","Model",n.model||"—",n.model_dim?`${n.model_dim}d`:void 0)}
                    ${f("⏱","Uptime",V(n.uptime_seconds))}
                    ${f("📡","Watching",n.watching?"Yes":"No")}
                    ${f("⚙️","State","",`<span style="color: ${a}; font-size: 0.9rem; font-weight: 600;">${n.state||(n.running?"Running":"Idle")}</span>`)}
                </div>

                ${o?`
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Sync Progress</div>
                        ${o.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${o.message}</div>`:""}
                        ${j(o.done,o.total)}
                        ${o.project_name?`<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">Project: ${o.project_name}</div>`:""}
                    </div>
                `:""}

                ${r?`
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Embedding Progress</div>
                        ${r.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${r.message}</div>`:""}
                        ${j(r.done,r.total)}
                    </div>
                `:""}

                ${!o&&!r?'<div style="color: var(--text-secondary); font-size: 0.875rem;">No active sync or embedding in progress.</div>':""}
            `}).catch(n=>{s&&(s.innerHTML=`<div style="color: var(--text-secondary);">Indexer status unavailable: ${n.message}</div>`)})}function F(t,e){const i=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(i),n=document.createElement("a");n.href=s,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s)}async function J(t){try{return await navigator.clipboard.writeText(t),!0}catch(e){return console.error("Failed to copy text: ",e),!1}}function A(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(i){let s="json-number";return/^"/.test(i)?/:$/.test(i)?s="json-key":s="json-string":/true|false/.test(i)?s="json-boolean":/null/.test(i)&&(s="json-null"),'<span class="'+s+'">'+i+"</span>"})}function M(t){const e=(t||"").toLowerCase(),i={claude:["var(--source-claude-color)","var(--source-claude-bg)"],kimi:["var(--source-kimi-color)","var(--source-kimi-bg)"],gemini:["var(--source-gemini-color)","var(--source-gemini-bg)"],codex:["var(--source-codex-color)","var(--source-codex-bg)"],copilot:["var(--source-copilot-color)","var(--source-copilot-bg)"],qwen:["var(--source-qwen-color)","var(--source-qwen-bg)"]},[s,n]=i[e]??["var(--text-secondary)","rgba(148,163,184,0.15)"];return`color: ${s}; background: ${n}; border: 1px solid ${s}40;`}function _(t,e){const i=e.filename.replace(/[^a-zA-Z0-9]/g,"-");t.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="${e.url}" target="_blank" rel="noopener" style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; color: var(--accent-color); text-decoration: none; opacity: 0.9;" title="Open raw data in new tab">${e.url??""}</a>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                <button class="btn btn-sm" id="btn-copy-${i}">📋 Copy API Response</button>
                <button class="btn btn-sm" id="btn-download-${i}">⬇️ Download JSON</button>
            </div>
        </div>
        <div class="json-view" style="flex: 1; width: 100%; overflow: auto;">${A(JSON.stringify(e.data,null,2))}</div>
    `;const s=t.querySelector(`#btn-copy-${i}`);s&&s.addEventListener("click",async()=>{if(await J(JSON.stringify(e.data,null,2))){const o=s.innerHTML;s.innerHTML="✅ Copied!",setTimeout(()=>{s.innerHTML=o},2e3)}});const n=t.querySelector(`#btn-download-${i}`);n&&n.addEventListener("click",()=>{F(e.filename,e.data)})}function G(t,e,i){return[...t].sort((s,n)=>{let a=0;if(e==="name")a=(s.name||"").localeCompare(n.name||"");else{const o=s.lastModified?new Date(s.lastModified).getTime():0,r=n.lastModified?new Date(n.lastModified).getTime():0;a=o-r}return i==="asc"?a:-a})}function $(t,e,i){const s=document.getElementById("projects-list");if(!s)return;const n=G(t,e,i);s.innerHTML=n.map(a=>`
    <div class="list-item">
      <div>
        <div class="list-item-title">${a.name||a.id}</div>
        <div class="list-item-meta" style="display: flex; align-items: center; gap: 0.4rem;">
          <span>${a.path}</span>
          <button class="copy-path-btn" data-path="${a.path}" title="Copy path" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0; font-size: 0.9rem; line-height: 1; opacity: 0.6; transition: opacity 0.15s;">📋</button>
        </div>
      </div>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-end; align-items: center;">
        <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem; margin-right: 1rem; text-align: right;">
          <span><strong>Sessions:</strong> ${a.sessionCount??0}</span>
          <span><strong>Modified:</strong> ${a.lastModified?new Date(a.lastModified).toLocaleString():"Unknown"}</span>
        </div>
        ${a.pathExists===!1?'<span class="badge" style="background: var(--danger-color)" title="Directory not found on disk">Path Missing</span>':""}
        <span class="badge" title="Source" style="${M(a.source)}">${a.source||"Unknown"}</span>
      </div>
    </div>
  `).join("")}function Z(t){let e="date",i="desc";t.innerHTML=`
    <div class="panel" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <h2 style="margin-bottom: 0;"><span class="icon">📁</span> Projects</h2>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <div class="tabs-header" id="projects-sort-field" style="margin-bottom: 0;">
            <button class="tab-btn" data-sort-field="name">Name</button>
            <button class="tab-btn active" data-sort-field="date">Date</button>
          </div>
          <div class="tabs-header" id="projects-sort-dir" style="margin-bottom: 0;">
            <button class="tab-btn" data-sort-dir="asc">↑ Asc</button>
            <button class="tab-btn active" data-sort-dir="desc">↓ Desc</button>
          </div>
          <div class="tabs-header" id="projects-tabs" style="margin-bottom: 0;">
            <button class="tab-btn active" data-target="projects-tab-rendered">Rendered</button>
            <button class="tab-btn" data-target="projects-tab-raw">Raw JSON</button>
          </div>
        </div>
      </div>

      <div class="tab-content active" id="projects-tab-rendered" style="flex: 1; overflow-y: auto; margin-top: 1rem;">
        <div id="projects-list" class="loading">Loading projects...</div>
      </div>

      <div class="tab-content" id="projects-tab-raw" style="flex: 1; display: none; flex-direction: column; margin-top: 1rem;">
        <div id="projects-json-viewer" style="display: flex; flex-direction: column; flex: 1; min-height: 400px;"></div>
      </div>
    </div>
  `;const s=t.querySelectorAll("#projects-tabs .tab-btn"),n=t.querySelectorAll(".tab-content");s.forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-target");s.forEach(c=>c.classList.remove("active")),o.classList.add("active"),n.forEach(c=>{c.id===r?(c.classList.add("active"),c.style.display=c.id==="projects-tab-raw"?"flex":"block"):(c.classList.remove("active"),c.style.display="none")})})});let a=[];t.querySelectorAll("#projects-sort-field .tab-btn").forEach(o=>{o.addEventListener("click",()=>{e=o.getAttribute("data-sort-field"),t.querySelectorAll("#projects-sort-field .tab-btn").forEach(r=>r.classList.remove("active")),o.classList.add("active"),$(a,e,i)})}),t.querySelectorAll("#projects-sort-dir .tab-btn").forEach(o=>{o.addEventListener("click",()=>{i=o.getAttribute("data-sort-dir"),t.querySelectorAll("#projects-sort-dir .tab-btn").forEach(r=>r.classList.remove("active")),o.classList.add("active"),$(a,e,i)})}),b.getProjects().then(o=>{var d;a=o||[];const r=document.getElementById("projects-list");r&&a.length===0?r.innerHTML='<div style="color: var(--text-secondary);">No projects found.</div>':($(a,e,i),(d=document.getElementById("projects-list"))==null||d.addEventListener("click",l=>{const u=l.target.closest(".copy-path-btn");if(!u)return;const v=u.getAttribute("data-path")||"";navigator.clipboard.writeText(v).then(()=>{u.textContent="✅",setTimeout(()=>{u.textContent="📋"},1500)})}));const c=document.getElementById("projects-json-viewer");c&&_(c,{data:a,filename:"projects.json",url:"/api/v1/projects"})}).catch(o=>{const r=document.getElementById("projects-list");r&&(r.innerHTML=`<div class="error">Failed to load projects: ${o.message}</div>`)})}function K(t){t.innerHTML=`
    <div class="panel" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h2><span class="icon">📦</span> Sources</h2>
        <div class="tabs-header" id="sources-tabs" style="margin-bottom: 0;">
          <button class="tab-btn active" data-target="sources-tab-rendered">Rendered</button>
          <button class="tab-btn" data-target="sources-tab-raw">Raw JSON</button>
        </div>
      </div>
      
      <div class="tab-content active" id="sources-tab-rendered" style="flex: 1; overflow-y: auto; margin-top: 1rem;">
        <div id="sources-list" class="loading">Loading sources...</div>
      </div>
      
      <div class="tab-content" id="sources-tab-raw" style="flex: 1; display: none; flex-direction: column; margin-top: 1rem;">
        <div id="sources-json-viewer" style="display: flex; flex-direction: column; flex: 1; min-height: 400px;"></div>
      </div>
    </div>
  `;const e=t.querySelectorAll(".tab-btn"),i=t.querySelectorAll(".tab-content");e.forEach(s=>{s.addEventListener("click",n=>{const a=n.currentTarget.getAttribute("data-target");e.forEach(o=>o.classList.remove("active")),n.currentTarget.classList.add("active"),i.forEach(o=>{const r=o;r.id===a?(r.classList.add("active"),r.id==="sources-tab-raw"?r.style.display="flex":r.style.display="block"):(r.classList.remove("active"),r.style.display="none")})})}),b.getSources().then(s=>{const n=document.getElementById("sources-list");if(n)if(!s||s.length===0)n.innerHTML='<div style="color: var(--text-secondary);">No sources found.</div>';else{const o=[...s].sort((r,c)=>(r.name||"").localeCompare(c.name||""));n.innerHTML=o.map(r=>`
            <div class="list-item">
              <div>
                <div class="list-item-title">${r.name}</div>
                <div class="list-item-meta">${r.base_path||"No base path"}</div>
              </div>
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                ${r.can_resume?'<span class="badge" style="background: var(--accent-color);">Resumable</span>':""}
                <span class="badge" style="${M(r.name)}">${r.name||"Unknown"}</span>
                <span class="badge" style="background: ${r.available?"var(--success-color)":"var(--danger-color)"}">
                  ${r.available?"Online":"Offline"}
                </span>
              </div>
            </div>
          `).join("")}const a=document.getElementById("sources-json-viewer");a&&_(a,{data:s,filename:"sources.json",url:"/api/v1/sources"})}).catch(s=>{const n=document.getElementById("sources-list");n&&(n.innerHTML=`<div class="error">Failed to load sources: ${s.message}</div>`)})}function Q(t){t.innerHTML=`
    <div class="panel" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h2><span class="icon">🧩</span> Apps</h2>
        <div class="tabs-header" id="apps-tabs" style="margin-bottom: 0;">
          <button class="tab-btn active" data-target="apps-tab-rendered">Rendered</button>
          <button class="tab-btn" data-target="apps-tab-raw">Raw JSON</button>
        </div>
      </div>

      <div class="tab-content active" id="apps-tab-rendered" style="flex: 1; overflow-y: auto; margin-top: 1rem;">
        <div id="apps-list" class="loading">Loading apps...</div>
      </div>

      <div class="tab-content" id="apps-tab-raw" style="flex: 1; display: none; flex-direction: column; margin-top: 1rem;">
        <div id="apps-json-viewer" style="display: flex; flex-direction: column; flex: 1; min-height: 400px;"></div>
      </div>
    </div>
  `;const e=t.querySelectorAll("#apps-tabs .tab-btn"),i=t.querySelectorAll(".tab-content");e.forEach(s=>{s.addEventListener("click",()=>{const n=s.getAttribute("data-target");e.forEach(a=>a.classList.remove("active")),s.classList.add("active"),i.forEach(a=>{a.id===n?(a.classList.add("active"),a.style.display=a.id==="apps-tab-raw"?"flex":"block"):(a.classList.remove("active"),a.style.display="none")})})}),I("/api/v1/open-in/apps").then(s=>{const n=s.apps||[],a=document.getElementById("apps-list");a&&(n.length===0?a.innerHTML='<div style="color: var(--text-secondary);">No apps found.</div>':a.innerHTML=n.map(r=>`
                        <div class="list-item">
                            <div>
                                <div class="list-item-title">${r.name}</div>
                                <div class="list-item-meta">${r.id}</div>
                            </div>
                            <span class="badge" style="background: var(--success-color);">Ready</span>
                        </div>
                    `).join(""));const o=document.getElementById("apps-json-viewer");o&&_(o,{data:n,filename:"apps.json",url:"/api/v1/open-in/apps"})}).catch(s=>{const n=document.getElementById("apps-list");n&&(n.innerHTML=`<div class="error">Failed to load apps: ${s.message}</div>`)})}function p(t){const e=[];return t!=null&&t.fg&&e.push(`color: ${t.fg}`),t!=null&&t.bg&&e.push(`background: ${t.bg}`),t!=null&&t.bold&&e.push("font-weight: 600"),t!=null&&t.italic&&e.push("font-style: italic"),e.join("; ")}function g(t,e,i){const s=(e==null?void 0:e.fg)||i||"var(--text-secondary)",n=(e==null?void 0:e.bg)||"transparent";return`
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <div style="width: 20px; height: 20px; border-radius: 4px; background: ${s}; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;" title="${s}"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${t}</span>
            ${n!=="transparent"?`<div style="width: 20px; height: 20px; border-radius: 4px; background: ${n}; border: 1px solid rgba(255,255,255,0.1);" title="bg: ${n}"></div>`:""}
        </div>
    `}function C(t,e,i){var n;const s=e;t.innerHTML=`
        <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;">

            <!-- Preview Header -->
            <div style="padding: 0.5rem 0.75rem; background: ${s.border_active||"var(--border-color)"}20; border-bottom: 2px solid ${s.border_active||"var(--border-color)"}; font-size: 0.75rem; color: var(--text-secondary);">
                Preview: ${i} ${s.accent?`<span style="color:${s.accent};">●</span>`:""}
            </div>

            <!-- Simulated conversation -->
            <div style="padding: 0.75rem; background: #0d0d0d; display: flex; flex-direction: column; gap: 0.5rem;">

                <!-- User turn -->
                <div style="${p(s.user_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; border-left: 3px solid ${s.accent||"#aaa"};">
                    <div style="${p(s.user_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        USER
                    </div>
                    <div style="${p(s.text_primary)};">Hello, can you help me?</div>
                </div>

                <!-- Assistant turn -->
                <div style="${p(s.assistant_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; border-left: 3px solid ${((n=s.assistant_label)==null?void 0:n.fg)||"#888"};">
                    <div style="${p(s.assistant_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        ASSISTANT
                    </div>
                    <div style="${p(s.text_primary)};">Of course! Let me check that for you.</div>
                </div>

                <!-- Tool call -->
                <div style="${p(s.tool_call_block)}; padding: 0.5rem 0.75rem; border-radius: 6px;">
                    <div style="${p(s.tool_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        TOOL: read_file
                    </div>
                    <div style="${p(s.text_secondary)};">{"path": "/etc/readme.txt"}</div>
                </div>

                <!-- Tool result -->
                <div style="${p(s.tool_result_block)}; padding: 0.5rem 0.75rem; border-radius: 6px;">
                    <div style="${p(s.text_muted)}; font-size: 0.7rem;">Result: file contents here…</div>
                </div>

                <!-- Thinking block -->
                ${s.thinking_block?`
                <div style="${p(s.thinking_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; font-style: italic; opacity: 0.8;">
                    <div style="${p(s.thinking_label)}; font-size: 0.7rem; margin-bottom: 0.25rem;">&lt;thinking&gt;</div>
                    <div style="${p(s.text_muted)}; font-size: 0.8rem;">The user needs help with…</div>
                </div>`:""}
            </div>

            <!-- Color Swatches Grid -->
            <div style="padding: 0.75rem; border-top: 1px solid var(--border-color); display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1.5rem;">
                ${s.accent?g("accent",{fg:s.accent}):""}
                ${g("user",s.user_label)}
                ${g("assistant",s.assistant_label)}
                ${g("tool",s.tool_label)}
                ${g("thinking",s.thinking_label)}
                ${g("text primary",s.text_primary)}
                ${g("text secondary",s.text_secondary)}
                ${g("text muted",s.text_muted)}
                ${s.border_active?g("border active",{fg:s.border_active}):""}
            </div>
        </div>
    `}function Y(t){t.innerHTML=`
    <div class="panel" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h2><span class="icon">🎨</span> Themes</h2>
        <div class="tabs-header" id="themes-tabs" style="margin-bottom: 0;">
          <button class="tab-btn active" data-target="themes-tab-rendered">Rendered</button>
          <button class="tab-btn" data-target="themes-tab-raw">Raw JSON</button>
        </div>
      </div>

      <div class="tab-content active" id="themes-tab-rendered" style="flex: 1; overflow-y: auto; margin-top: 1rem;">
        <div id="themes-list" class="loading">Loading themes...</div>
      </div>

      <div class="tab-content" id="themes-tab-raw" style="flex: 1; display: none; flex-direction: column; margin-top: 1rem;">
        <div id="themes-json-viewer" style="display: flex; flex-direction: column; flex: 1; min-height: 400px;"></div>
      </div>
    </div>
  `;const e=t.querySelectorAll("#themes-tabs .tab-btn"),i=t.querySelectorAll(".tab-content");e.forEach(s=>{s.addEventListener("click",()=>{const n=s.getAttribute("data-target");e.forEach(a=>a.classList.remove("active")),s.classList.add("active"),i.forEach(a=>{a.id===n?(a.classList.add("active"),a.style.display=a.id==="themes-tab-raw"?"flex":"block"):(a.classList.remove("active"),a.style.display="none")})})}),I("/api/v1/themes").then(s=>{const n=(s.themes||[]).sort((r,c)=>r.active&&!c.active?-1:!r.active&&c.active?1:r.name.localeCompare(c.name)),a=document.getElementById("themes-list");a&&(n.length===0?a.innerHTML='<div style="color: var(--text-secondary);">No themes found.</div>':(a.innerHTML="",n.forEach((r,c)=>{const d=document.createElement("div");d.style.marginBottom="0.75rem";const l=document.createElement("div");l.className="list-item",l.style.cursor="pointer",l.style.userSelect="none",r.active&&(l.style.borderColor="var(--accent-color)"),l.innerHTML=`
                            <div>
                                <div class="list-item-title">
                                    ${r.name}
                                    ${r.active?'<span style="font-size: 0.75rem; color: var(--accent-color); margin-left: 0.5rem;">● Active</span>':""}
                                </div>
                                <div class="list-item-meta">${r.description||(r.embedded?"Built-in theme":"User theme")}</div>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                ${r.active?'<span class="badge" style="background: var(--accent-color);">Active</span>':""}
                                <span class="badge" style="background: ${r.embedded?"var(--text-secondary)":"var(--success-color)"};">
                                    ${r.embedded?"Built-in":"User"}
                                </span>
                                <span class="theme-toggle-chevron" style="color: var(--text-secondary); font-size: 0.75rem;">▶</span>
                            </div>
                        `;const u=document.createElement("div");u.id=`theme-preview-${c}`,u.style.display="none",u.style.padding="0.5rem 0";let v=!1;if(l.addEventListener("click",()=>{const x=u.style.display!=="none",w=l.querySelector(".theme-toggle-chevron");x?(u.style.display="none",w&&(w.textContent="▶")):(u.style.display="block",w&&(w.textContent="▼"),!v&&r.colors?(C(u,r.colors,r.name),v=!0):v||(u.innerHTML='<div style="color: var(--text-secondary); font-size: 0.85rem; padding: 0.5rem;">No color data available for this theme.</div>'))}),r.active&&r.colors){u.style.display="block",C(u,r.colors,r.name),v=!0;const x=l.querySelector(".theme-toggle-chevron");x&&(x.textContent="▼")}d.appendChild(l),d.appendChild(u),a.appendChild(d)})));const o=document.getElementById("themes-json-viewer");o&&_(o,{data:n,filename:"themes.json",url:"/api/v1/themes"})}).catch(s=>{const n=document.getElementById("themes-list");n&&(n.innerHTML=`<div class="error">Failed to load themes: ${s.message}</div>`)})}function X(t){t.innerHTML=`
    <div class="panel">
      <h2><span class="icon">🔍</span> API Endpoint Tester</h2>
      <p style="margin-bottom: 2rem; color: var(--text-secondary);">
        Directly query the local configuration endpoints.
      </p>
      
      <form id="tester-form" class="tester-form">
        <select id="method-select" class="tester-input" style="flex: 0 0 100px;">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        <input id="endpoint-input" type="text" class="tester-input" value="/api/v1/projects" placeholder="e.g. /api/v1/sources" />
        <button type="submit" class="btn" id="run-btn">Send Request</button>
      </form>

      <div class="quick-links" style="margin-bottom: 1.5rem; display: flex; gap: 0.5rem;">
        <span style="color: var(--text-secondary); font-size: 0.875rem; display: flex; align-items: center;">Quick:</span>
        <button class="badge" onclick="document.getElementById('endpoint-input').value='/api/v1/sources'; document.getElementById('run-btn').click();" style="cursor:pointer; border:none;">/sources</button>
        <button class="badge" onclick="document.getElementById('endpoint-input').value='/api/v1/projects'; document.getElementById('run-btn').click();" style="cursor:pointer; border:none;">/projects</button>
        <button class="badge" onclick="document.getElementById('endpoint-input').value='/api/v1/themes'; document.getElementById('run-btn').click();" style="cursor:pointer; border:none;">/themes</button>
      </div>

      <div style="position: relative;">
        <div id="response-status" style="position: absolute; top: -1.5rem; right: 0; font-size: 0.875rem; font-weight: 500;"></div>
        <pre id="json-output" class="json-view">Response will appear here...</pre>
      </div>
    </div>
  `;const e=document.getElementById("tester-form");e==null||e.addEventListener("submit",async i=>{i.preventDefault();const s=document.getElementById("endpoint-input"),n=document.getElementById("method-select"),a=document.getElementById("json-output"),o=document.getElementById("response-status");if(!(!s||!a||!o||!n)){a.innerHTML='<span class="loading">Loading...</span>',o.textContent="";try{const r=performance.now();let c;n.value==="GET"?c=await fetch(s.value):c=await fetch(s.value,{method:n.value});const d=Math.round(performance.now()-r);o.textContent=`${c.status} ${c.statusText} (${d}ms)`,o.style.color=c.ok?"var(--success-color)":"var(--danger-color)";const l=await c.json();a.innerHTML=A(JSON.stringify(l,null,2))}catch(r){o.textContent="Error",o.style.color="var(--danger-color)",a.innerHTML=`<span class="error">${r.message||"Network error"}</span>`}}})}function ee(){const t=document.getElementById("app");if(!t)return;t.innerHTML=`
    <nav class="sidebar">
      <div class="sidebar-header">
        <a href="https://wethinkt.com" target="_blank" rel="noopener" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; font-weight: 500;">
          <span class="icon">🧠</span> thinkt lite
        </a>
      </div>
      <div class="nav-menu">
        <div class="nav-item active" data-view="dashboard">
          <span>📊</span> Dashboard
        </div>
        <div class="nav-item" data-view="projects">
          <span>📁</span> Projects
        </div>
        <div class="nav-item" data-view="sources">
          <span>📦</span> Sources
        </div>
        <div class="nav-item" data-view="apps">
          <span>🧩</span> Apps
        </div>
        <div class="nav-item" data-view="themes">
          <span>🎨</span> Themes
        </div>
        <div class="nav-item" data-view="tester">
          <span>🔍</span> Endpoint Tester
        </div>
      </div>
      <div style="flex: 1;"></div>
      <div style="padding: 1rem; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
        v0.1.0-lite
      </div>
    </nav>
    <main class="main-content">
      <header class="top-bar">
        <div style="font-weight: 600; font-size: 1.1rem; color: var(--text-secondary);" id="current-view-title">
          Dashboard
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <a href="/swagger/" target="_blank" style="color: var(--accent-color); text-decoration: none; font-weight: 500; font-size: 0.9rem;">
            API Docs ↗
          </a>
          <button class="theme-toggle" id="theme-toggle" title="Toggle theme">
            🌙
          </button>
        </div>
      </header>
      <div class="view-container" id="view-container">
        <!-- View content renders here -->
      </div>
    </main>
  `;const e=document.getElementById("view-container"),i=document.querySelectorAll(".nav-item"),s=document.getElementById("current-view-title");function n(c){if(!(!e||!s))switch(i.forEach(d=>{d.classList.toggle("active",d.getAttribute("data-view")===c)}),c){case"dashboard":s.textContent="Dashboard",W(e);break;case"projects":s.textContent="Projects",Z(e);break;case"sources":s.textContent="Sources",K(e);break;case"apps":s.textContent="Apps",Q(e);break;case"themes":s.textContent="Themes",Y(e);break;case"tester":s.textContent="Endpoint Tester",X(e);break}}i.forEach(c=>{c.addEventListener("click",()=>{const d=c.getAttribute("data-view");d&&n(d)})}),document.addEventListener("navigate",c=>{n(c.detail)});const a=document.getElementById("theme-toggle"),o=localStorage.getItem("theme")||(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");function r(c){document.body.classList.toggle("light-mode",c==="light"),a&&(a.textContent=c==="light"?"☀️":"🌙"),localStorage.setItem("theme",c)}r(o),a==null||a.addEventListener("click",()=>{const c=document.body.classList.contains("light-mode");r(c?"dark":"light")}),n("dashboard")}document.addEventListener("DOMContentLoaded",ee);
