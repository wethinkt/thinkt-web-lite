var te=Object.defineProperty;var se=(t,e,s)=>e in t?te(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var T=(t,e,s)=>se(t,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=s(i);fetch(i.href,o)}})();class w extends Error{constructor(s,n,i,o){super(s);T(this,"line");T(this,"source");T(this,"rawContent");this.line=n,this.source=i,this.rawContent=o,this.name="ParseError"}}function ne(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"system":return"system";case"progress":return"progress";case"summary":return"summary";case"file-history-snapshot":return"checkpoint";case"queue-operation":return"system";default:return"system"}}function ie(t){if(typeof t=="string")return{type:"text",text:t};if(typeof t!="object"||t===null)return null;const e=t;switch(e.type){case"text":return{type:"text",text:e.text??""};case"thinking":return{type:"thinking",thinking:e.thinking??"",signature:e.signature};case"tool_use":return{type:"tool_use",toolUseId:e.id??"",toolName:e.name??"",toolInput:e.input??{}};case"tool_result":return{type:"tool_result",toolUseId:e.tool_use_id??"",toolResult:typeof e.content=="string"?e.content:JSON.stringify(e.content??""),isError:e.is_error===!0};case"image":return e.source?{type:"image",mediaType:e.source.media_type??"image/png",mediaData:e.source.data??""}:null;case"document":return e.source?{type:"document",mediaType:e.source.media_type??"application/pdf",mediaData:e.source.data??""}:null;default:return"text"in e&&typeof e.text=="string"?{type:"text",text:e.text}:null}}function oe(t){if(!(t!=null&&t.usage))return;const e=t.usage;return{inputTokens:e.input_tokens??0,outputTokens:e.output_tokens??0,cacheCreationInputTokens:e.cache_creation_input_tokens,cacheReadInputTokens:e.cache_read_input_tokens}}function O(t,e="claude"){var c;const s=ne(t.type),n=[];let i;if(t.message){const a=t.message.content;if(typeof a=="string")i=a,n.push({type:"text",text:a});else if(Array.isArray(a)){for(const u of a){const p=ie(u);p&&n.push(p)}const l=n.filter(u=>u.type==="text");l.length>0&&(i=l.map(u=>u.text).join(`
`))}}t.type==="summary"&&t.summary&&(i=t.summary,n.length===0&&n.push({type:"text",text:t.summary}));let o;t.timestamp?o=new Date(t.timestamp):o=new Date;const r={uuid:t.uuid??`entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,parentUuid:t.parentUuid??void 0,role:s,timestamp:o,source:e,contentBlocks:n,text:i,model:(c=t.message)==null?void 0:c.model,usage:oe(t.message),gitBranch:t.gitBranch,cwd:t.cwd,isCheckpoint:t.type==="file-history-snapshot",isSidechain:t.isSidechain,metadata:{}};return t.sessionId&&(r.metadata.sessionId=t.sessionId),t.version&&(r.metadata.version=t.version),t.agentId&&(r.metadata.agentId=t.agentId),t.error&&(r.metadata.error=t.error),t.isApiErrorMessage&&(r.metadata.isApiErrorMessage=t.isApiErrorMessage),t.stopReason&&(r.metadata.stopReason=t.stopReason),t.requestId&&(r.metadata.requestId=t.requestId),t.permissionMode&&(r.metadata.permissionMode=t.permissionMode),t.thinkingMetadata&&(r.metadata.thinkingMetadata=t.thinkingMetadata),t.status&&(r.metadata.progressStatus=t.status),Object.keys(r.metadata).length===0&&delete r.metadata,r}function re(t,e){const s=[];let n=0;const i=t.split(`
`);for(let o=0;o<i.length;o++){const r=i[o].trim();if(r)try{const c=JSON.parse(r);s.push(c)}catch{{n++;continue}}}return{entries:s,skipped:n}}function ae(t){if(typeof t!="string")return!1;const e=t.trim().split(`
`)[0];if(!e)return!1;try{const s=JSON.parse(e);return typeof s=="object"&&s!==null&&"type"in s&&["user","assistant","system","progress","file-history-snapshot","summary","queue-operation"].includes(s.type)}catch{return!1}}function N(t,e){var y,h;const s=t.filter(d=>d.role==="user"||d.role==="assistant"),n=s[0]??t[0],i=s[s.length-1]??t[t.length-1];let o;if(n&&i){const d=n.timestamp.getTime(),b=i.timestamp.getTime();!isNaN(d)&&!isNaN(b)&&b>d&&(o=b-d)}const r=t.find(d=>d.role==="assistant"&&d.model),c=r==null?void 0:r.model,a={inputTokens:0,outputTokens:0,cacheCreationInputTokens:0,cacheReadInputTokens:0};for(const d of t)d.usage&&(a.inputTokens+=d.usage.inputTokens??0,a.outputTokens+=d.usage.outputTokens??0,a.cacheCreationInputTokens+=d.usage.cacheCreationInputTokens??0,a.cacheReadInputTokens+=d.usage.cacheReadInputTokens??0);const l=(y=n==null?void 0:n.metadata)==null?void 0:y.sessionId,u=t.find(d=>d.role==="user"),p=(h=u==null?void 0:u.text)==null?void 0:h.slice(0,200),g=t.filter(d=>d.role==="summary"&&d.text),v=g.length>0?g[g.length-1].text:void 0;let m=e??"Claude Code Session";return l?m=`Session ${l.slice(0,8)}...`:p&&(m=p.slice(0,50)+(p.length>50?"...":"")),{id:l??`session-${Date.now()}`,title:m,source:"claude",entryCount:t.length,createdAt:n==null?void 0:n.timestamp,modifiedAt:i==null?void 0:i.timestamp,model:c,gitBranch:n==null?void 0:n.gitBranch,projectPath:n==null?void 0:n.cwd,durationMs:o,totalUsage:a,firstPrompt:p,summary:v}}function ce(t){return{source:"claude",canParse(e){return ae(e)},parse(e,s){if(typeof e!="string")throw new w("Claude parser expects string content",void 0,"claude");const{entries:n,skipped:i}=re(e),o=n.map(a=>O(a,"claude")),r=N(o,s),c=[];return i>0&&c.push(`Skipped ${i} invalid JSON line(s)`),{session:{meta:r,entries:o},warnings:c.length>0?c:void 0,skippedCount:i>0?i:void 0}},parseMetadata(e,s){if(typeof e!="string")throw new w("Claude parser expects string content",void 0,"claude");const n=e.split(`
`).filter(c=>c.trim()),i=[...n.slice(0,50),...n.slice(-10)],o=[];for(const c of i)try{const a=JSON.parse(c);o.push(O(a,"claude"))}catch{}const r=N(o,s);return r.entryCount=n.length,r}}}const le=ce();function de(t){if(typeof t!="string")return!1;try{const e=t.split(`
`);for(const s of e){const n=s.trim();if(!n)continue;const i=JSON.parse(n);return typeof i=="object"&&i!==null&&typeof i.role=="string"&&!("uuid"in i)&&!("type"in i)?["user","assistant","tool","system","_checkpoint","_usage"].includes(i.role):!1}return!1}catch{return!1}}function ue(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"tool":return"tool";case"system":return"system";case"_checkpoint":return"checkpoint";case"_usage":return"system";default:return"system"}}function D(t){if(t==null)return null;if(typeof t=="string")return{type:"text",text:t};if(typeof t!="object")return null;const e=t;switch(e.type){case"text":return{type:"text",text:e.text??""};case"thinking":case"think":return{type:"thinking",thinking:e.thinking??e.think??"",signature:e.signature};case"tool_result":{let n="";return typeof e.content=="string"?n=e.content:Array.isArray(e.content)&&(n=e.content.filter(i=>typeof i=="object"&&i!==null).map(i=>i.text??"").filter(Boolean).join("")),{type:"tool_result",toolUseId:e.tool_use_id??"",toolResult:n,isError:e.is_error??!1}}default:return"text"in e&&typeof e.text=="string"?{type:"text",text:e.text}:null}}function me(t,e){const s=t.role;if(!s||s==="_usage")return null;const n={uuid:`L${e}`,role:ue(s),timestamp:t.timestamp?new Date(t.timestamp*1e3):new Date,source:"kimi",contentBlocks:[],metadata:{}};if(s==="_checkpoint")return n.isCheckpoint=!0,n;switch(s){case"user":if(typeof t.content=="string")n.text=t.content,n.contentBlocks=[{type:"text",text:t.content}];else if(Array.isArray(t.content)){const i=t.content.map(D).filter(o=>o!==null);n.contentBlocks=i,n.text=H(i)}break;case"assistant":if(Array.isArray(t.content)){const i=t.content.map(D).filter(o=>o!==null);n.contentBlocks=i,n.text=H(i)}if(Array.isArray(t.tool_calls))for(const i of t.tool_calls){let o="",r={};if(i.function){if(o=i.function.name,i.function.arguments)try{r=JSON.parse(i.function.arguments)}catch{r=i.function.arguments}}else o=i.name??"",r=i.input??{};n.contentBlocks.push({type:"tool_use",toolUseId:i.id,toolName:o,toolInput:r})}break;case"tool":{let i="";typeof t.content=="string"?i=t.content:Array.isArray(t.content)&&(i=t.content.filter(o=>typeof o=="object"&&o!==null).map(o=>o.text??"").filter(Boolean).join("")),n.contentBlocks=[{type:"tool_result",toolUseId:t.tool_call_id??"",toolResult:i,isError:!1}];break}case"system":typeof t.content=="string"&&(n.text=t.content,n.contentBlocks=[{type:"text",text:t.content}]);break}return t.usage&&(n.usage={inputTokens:t.usage.input_tokens??0,outputTokens:t.usage.output_tokens??0}),n}function H(t){return t.filter(e=>e.type==="text").map(e=>e.text).filter(Boolean).join(`
`)}function z(t,e={}){const{skipInvalidLines:s=!0}=e,n=t.split(`
`),i=[];let o=0,r=0;for(const c of n){const a=c.trim();if(a){r++;try{const l=JSON.parse(a),u=me(l,r);u&&i.push(u)}catch(l){if(s)o++;else throw new w(`Invalid JSON on line ${r}: ${l instanceof Error?l.message:String(l)}`)}}}return{entries:i,skipped:o}}function J(t){const e={id:`kimi-${Date.now()}`,title:"Kimi Session",source:"kimi",entryCount:t.length},s=t.find(r=>r.role==="user");s!=null&&s.text&&(e.firstPrompt=s.text.length>50?s.text.slice(0,50)+"...":s.text);const n=t.filter(r=>r.timestamp);if(n.length>=2){const r=n[0].timestamp,c=n[n.length-1].timestamp;e.durationMs=c.getTime()-r.getTime()}let i=0,o=0;for(const r of t)r.usage&&(i+=r.usage.inputTokens,o+=r.usage.outputTokens);return(i>0||o>0)&&(e.totalUsage={inputTokens:i,outputTokens:o}),e}function pe(t={}){return{source:"kimi",canParse(e){return de(e)},parse(e){if(typeof e!="string")throw new w("Kimi parser expects string content");const{entries:s,skipped:n}=z(e,t),r={session:{meta:J(s),entries:s},warnings:[],skippedCount:n};return n>0&&r.warnings.push(`Skipped ${n} invalid JSON line(s)`),r},parseMetadata(e){if(typeof e!="string")throw new w("Kimi parser expects string content");const{entries:s}=z(e,{...t,skipInvalidLines:!0});return J(s)}}}const fe=pe();function ge(t){if(typeof t!="string")return!1;try{const e=JSON.parse(t);return typeof e=="object"&&e!==null&&"sessionId"in e&&Array.isArray(e.messages)}catch{return!1}}function W(t){try{const e=JSON.parse(t),s=[];for(const i of e.messages){const o=i.timestamp?new Date(i.timestamp):new Date;if(i.type==="user")s.push({uuid:i.id??`msg-${Date.now()}-${Math.random()}`,role:"user",source:"gemini",timestamp:o,text:i.content,contentBlocks:i.content?[{type:"text",text:i.content}]:[]});else if(i.type==="gemini"){const r=[];if(i.thoughts)for(const a of i.thoughts)r.push({type:"thinking",thinking:`[${a.subject}] ${a.description}`});if(i.content&&r.push({type:"text",text:i.content}),i.toolCalls)for(const a of i.toolCalls)r.push({type:"tool_use",toolUseId:a.id,toolName:a.name,toolInput:a.args});const c=i.tokens?{inputTokens:i.tokens.input,outputTokens:i.tokens.output,thinkingTokens:i.tokens.thoughts,serverToolUse:i.tokens.tool}:void 0;if(s.push({uuid:i.id??`msg-${Date.now()}-${Math.random()}`,role:"assistant",source:"gemini",timestamp:o,model:i.model,usage:c,contentBlocks:r,text:i.content}),i.toolCalls){for(const a of i.toolCalls)if(a.result)for(const l of a.result){let u="";const p=l.functionResponse.response;if(p&&"output"in p){const g=p.output;u=typeof g=="string"?g:JSON.stringify(g)}else u=JSON.stringify(p);s.push({uuid:l.functionResponse.id??`res-${Date.now()}-${Math.random()}`,role:"tool",source:"gemini",timestamp:o,contentBlocks:[{type:"tool_result",toolUseId:a.id,toolResult:u,isError:!1}]})}}}}return{session:{meta:he(e,s),entries:s}}}catch(e){throw new w(`Failed to parse Gemini JSON: ${e instanceof Error?e.message:String(e)}`,void 0,"gemini")}}function he(t,e){const s=e.find(c=>c.role==="user"),n=s==null?void 0:s.text;let i=0,o=0;for(const c of e)c.usage&&(i+=c.usage.inputTokens,o+=c.usage.outputTokens);const r=t.startTime&&t.lastUpdated?new Date(t.lastUpdated).getTime()-new Date(t.startTime).getTime():void 0;return{id:t.sessionId,source:"gemini",title:n?n.slice(0,50)+(n.length>50?"...":""):"Gemini Session",entryCount:e.length,createdAt:t.startTime?new Date(t.startTime):void 0,modifiedAt:t.lastUpdated?new Date(t.lastUpdated):void 0,durationMs:r,totalUsage:{inputTokens:i,outputTokens:o},firstPrompt:n==null?void 0:n.slice(0,200)}}function ye(t){return{source:"gemini",canParse(e){return ge(e)},parse(e){if(typeof e!="string")throw new w("Gemini parser expects string content");return W(e)},parseMetadata(e){if(typeof e!="string")throw new w("Gemini parser expects string content");return W(e).session.meta}}}const ve=ye();class be{constructor(){T(this,"parsers",new Map);this.register(le),this.register(fe),this.register(ve)}register(e){this.parsers.set(e.source,e)}unregister(e){this.parsers.delete(e)}get(e){return this.parsers.get(e)}getSources(){return[...this.parsers.keys()]}canParse(e){for(const s of this.parsers.values())if(s.canParse(e))return!0;return!1}detect(e){for(const s of this.parsers.values())if(s.canParse(e))return s}parse(e,s){const n=this.detect(e);if(!n)throw new w("No parser found for content format");return n.parse(e,s)}parseMetadata(e,s){const n=this.detect(e);if(!n)throw new w("No parser found for content format");return n.parseMetadata?n.parseMetadata(e,s):n.parse(e,s).session.meta}}new be;class V extends Error{constructor(s,n,i){super(s);T(this,"statusCode");T(this,"response");this.statusCode=n,this.response=i,this.name="ThinktAPIError"}}class q extends Error{constructor(s,n){super(s);T(this,"originalError");this.originalError=n,this.name="ThinktNetworkError"}}const xe={baseUrl:"http://localhost:8784",apiVersion:"/api/v1",timeout:3e4};function f(t,e,s,n){let i=`${t}${e}${s}`;if(n&&Object.keys(n).length>0){const o=new URLSearchParams;for(const[c,a]of Object.entries(n))a!=null&&o.append(c,String(a));const r=o.toString();r&&(i+=`?${r}`)}return i}class ke{constructor(e){T(this,"config");this.config={...xe,...e}}setConfig(e){this.config={...this.config,...e}}getConfig(){return{...this.config}}async fetchWithTimeout(e,s={},n){const i=new AbortController,o=setTimeout(()=>i.abort(),this.config.timeout),r=n?AbortSignal.any([i.signal,n]):i.signal,c=this.config.fetch??fetch;try{const a={};this.config.token&&(a.Authorization=`Bearer ${this.config.token}`);const l=await c(e,{...s,signal:r,headers:{Accept:"application/json",...a,...s.headers}});if(clearTimeout(o),!l.ok){let u;try{u=await l.json()}catch{}throw new V((u==null?void 0:u.message)||`HTTP ${l.status}: ${l.statusText}`,l.status,u)}return await l.json()}catch(a){throw clearTimeout(o),a instanceof V?a:a instanceof Error&&a.name==="AbortError"?n!=null&&n.aborted?a:new q(`Request timeout after ${this.config.timeout}ms`,a):new q(a instanceof Error?a.message:"Network error",a)}}async getSources(){const e=f(this.config.baseUrl,this.config.apiVersion,"/sources");return(await this.fetchWithTimeout(e)).sources??[]}async getProjects(e,s){const n=f(this.config.baseUrl,this.config.apiVersion,"/projects",{source:e,include_deleted:s!=null&&s.includeDeleted?"true":void 0});return(await this.fetchWithTimeout(n,{},s==null?void 0:s.signal)).projects??[]}async getSessions(e,s,n){const i=encodeURIComponent(e),o=s==null?void 0:s.trim().toLowerCase(),r=o?`/projects/${encodeURIComponent(o)}/${i}/sessions`:`/projects/${i}/sessions`,c=f(this.config.baseUrl,this.config.apiVersion,r);return(await this.fetchWithTimeout(c,{},n)).sessions??[]}async getSession(e,s){const n=encodeURIComponent(e),i=f(this.config.baseUrl,this.config.apiVersion,`/sessions/${n}`,{limit:s==null?void 0:s.limit,offset:s==null?void 0:s.offset}),o=await this.fetchWithTimeout(i,{},s==null?void 0:s.signal);return{meta:o.meta,entries:o.entries??[],total:o.total??0,has_more:o.has_more??!1}}async getSessionMetadata(e,s){const n=encodeURIComponent(e),i={limit:s==null?void 0:s.limit,offset:s==null?void 0:s.offset,sort_by:s==null?void 0:s.sortBy};s!=null&&s.excludeRoles&&s.excludeRoles.length>0&&(i.exclude_roles=s.excludeRoles.join(",")),(s==null?void 0:s.summaryOnly)!==void 0&&(i.summary_only=s.summaryOnly?"true":"false");const o=f(this.config.baseUrl,this.config.apiVersion,`/sessions/${n}/metadata`,i);return await this.fetchWithTimeout(o)}async openIn(e,s){const n=f(this.config.baseUrl,this.config.apiVersion,"/open-in"),i=await this.fetchWithTimeout(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({app:e,path:s})});if(i.error)throw new Error(i.error)}async getOpenInApps(){const e=f(this.config.baseUrl,this.config.apiVersion,"/open-in/apps");return await this.fetchWithTimeout(e)}async search(e){const s={q:e.query,project:e.project,source:e.source,limit:e.limit,limit_per_session:e.limitPerSession};e.caseSensitive&&(s.case_sensitive="true"),e.regex&&(s.regex="true");const n=f(this.config.baseUrl,this.config.apiVersion,"/search",s);return await this.fetchWithTimeout(n,{},e.signal)}async semanticSearch(e){const s={q:e.query,project:e.project,source:e.source,limit:e.limit,max_distance:e.maxDistance};e.diversity&&(s.diversity="true");const n=f(this.config.baseUrl,this.config.apiVersion,"/semantic-search",s);return await this.fetchWithTimeout(n,{},e.signal)}async getResumeCommand(e){const s=encodeURIComponent(e),n=f(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}/resume`);return await this.fetchWithTimeout(n)}async execResumeSession(e){const s=encodeURIComponent(e),n=f(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}/resume`);return await this.fetchWithTimeout(n,{method:"POST"})}async getIndexerHealth(){const e=f(this.config.baseUrl,this.config.apiVersion,"/indexer/health");return await this.fetchWithTimeout(e)}async getIndexerStatus(){const e=f(this.config.baseUrl,this.config.apiVersion,"/indexer/status");return await this.fetchWithTimeout(e)}async getStats(){const e=f(this.config.baseUrl,this.config.apiVersion,"/stats");return await this.fetchWithTimeout(e)}async getTeams(){const e=f(this.config.baseUrl,this.config.apiVersion,"/teams");return(await this.fetchWithTimeout(e)).teams??[]}async getTeam(e){const s=encodeURIComponent(e),n=f(this.config.baseUrl,this.config.apiVersion,`/teams/${s}`);return await this.fetchWithTimeout(n)}async getTeamMemberMessages(e,s){const n=encodeURIComponent(e),i=encodeURIComponent(s),o=f(this.config.baseUrl,this.config.apiVersion,`/teams/${n}/members/${i}/messages`);return(await this.fetchWithTimeout(o)).messages??[]}async getTeamTasks(e){const s=encodeURIComponent(e),n=f(this.config.baseUrl,this.config.apiVersion,`/teams/${s}/tasks`);return(await this.fetchWithTimeout(n)).tasks??[]}async getThemes(){const e=f(this.config.baseUrl,this.config.apiVersion,"/themes");return await this.fetchWithTimeout(e)}async*streamSessionEntries(e,s=100,n){let i=0,o=!0;for(;o;){const r=await this.getSession(e,{limit:s,offset:i,signal:n});for(const c of r.entries)yield c;if(o=r.has_more,i+=r.entries.length,r.entries.length===0)break}}async getAllSessionEntries(e,s=100,n){const i=[];for await(const o of this.streamSessionEntries(e,s,n))i.push(o);return i}}function R(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}function _e(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"tool":return"tool";case"system":return"system";case"summary":return"summary";case"progress":return"progress";case"checkpoint":return"checkpoint";default:return"assistant"}}function $e(t){switch(t.type??"text"){case"text":return{type:"text",text:t.text??""};case"thinking":return{type:"thinking",thinking:t.thinking??"",signature:t.signature};case"tool_use":return{type:"tool_use",toolUseId:t.tool_use_id??"",toolName:t.tool_name??"unknown",toolInput:t.tool_input??{}};case"tool_result":return{type:"tool_result",toolUseId:t.tool_use_id??"",toolResult:t.tool_result??"",isError:t.is_error??!1};case"image":return{type:"image",mediaType:t.media_type??"image/png",mediaData:t.media_data??""};case"document":return{type:"document",mediaType:t.media_type??"application/pdf",mediaData:t.media_data??"",filename:void 0};default:return{type:"text",text:t.text??""}}}function Te(t){return{id:t.id??"",name:t.name??"",path:t.path??"",displayPath:t.display_path,sessionCount:t.session_count??0,lastModified:t.last_modified?new Date(t.last_modified):void 0,source:R(t.source),workspaceId:t.workspace_id,sourceBasePath:t.source_base_path,pathExists:t.path_exists??!0}}function F(t){return{id:t.id??"unknown",projectPath:t.project_path,fullPath:t.full_path,firstPrompt:t.first_prompt,summary:t.summary,entryCount:t.entry_count??0,fileSize:t.file_size,createdAt:t.created_at?new Date(t.created_at):void 0,modifiedAt:t.modified_at?new Date(t.modified_at):void 0,gitBranch:t.git_branch,model:t.model,source:R(t.source),workspaceId:t.workspace_id,chunkCount:t.chunk_count,title:t.first_prompt?t.first_prompt.slice(0,60)+(t.first_prompt.length>60?"...":""):t.id??"Untitled Session"}}function G(t){var n;const e=((n=t.content_blocks)==null?void 0:n.map($e))??[],s={};return t.metadata&&Object.assign(s,t.metadata),t.workspace_id&&(s.workspaceId=t.workspace_id),{uuid:t.uuid??`entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,parentUuid:t.parent_uuid??void 0,role:_e(t.role),timestamp:t.timestamp?new Date(t.timestamp):new Date,source:R(t.source),contentBlocks:e,text:t.text??e.filter(i=>i.type==="text").map(i=>i.text).join(`
`),model:t.model,usage:t.usage?{inputTokens:t.usage.input_tokens??0,outputTokens:t.usage.output_tokens??0,cacheCreationInputTokens:t.usage.cache_creation_input_tokens,cacheReadInputTokens:t.usage.cache_read_input_tokens}:void 0,gitBranch:t.git_branch,cwd:t.cwd,isCheckpoint:t.is_checkpoint??!1,isSidechain:t.is_sidechain??!1,agentId:t.agent_id,sourceAgentId:t.source_agent_id,metadata:Object.keys(s).length>0?s:void 0}}function we(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}class Se{constructor(e){T(this,"_api");this._api=new ke(e)}get api(){return this._api}setConfig(e){this._api.setConfig(e)}getConfig(){return this._api.getConfig()}async getSources(){return this._api.getSources()}async getProjects(e,s){return(await this._api.getProjects(e,s)).map(Te)}async getSessions(e,s,n){return(await this._api.getSessions(e,s,n)).map(F)}async getSession(e,s){const n=await this._api.getSession(e,s);return{meta:F(n.meta),entries:n.entries.map(G),total:n.total,hasMore:n.has_more}}async getSessionMetadata(e,s){const n=await this._api.getSessionMetadata(e,s),i=n.meta;return{meta:{id:(i==null?void 0:i.id)??"unknown",fullPath:i==null?void 0:i.path,entryCount:n.total_entries??0,createdAt:i!=null&&i.created_at?new Date(i.created_at):void 0,modifiedAt:i!=null&&i.modified_at?new Date(i.modified_at):void 0,gitBranch:i==null?void 0:i.git_branch,model:i==null?void 0:i.model,source:we(i==null?void 0:i.source),title:(i==null?void 0:i.id)??"Session Metadata"},description:n.description,roleCounts:n.role_counts??{},entrySummary:(n.entry_summary??[]).map(r=>({index:r.index,role:r.role,timestamp:r.timestamp,contentLength:r.content_length,hasThinking:r.has_thinking,hasToolUse:r.has_tool_use,hasToolResult:r.has_tool_result,preview:r.preview})),totalEntries:n.total_entries??0,totalContentBytes:n.total_content_bytes??0,returnedSummaries:n.returned_summaries??0}}async openIn(e,s){return this._api.openIn(e,s)}async getOpenInApps(){return this._api.getOpenInApps()}async search(e){return this._api.search(e)}async semanticSearch(e){return this._api.semanticSearch(e)}async getResumeCommand(e){return this._api.getResumeCommand(e)}async execResumeSession(e){return this._api.execResumeSession(e)}async getIndexerHealth(){return this._api.getIndexerHealth()}async getIndexerStatus(){return this._api.getIndexerStatus()}async getStats(){return this._api.getStats()}async getTeams(){return this._api.getTeams()}async getTeam(e){return this._api.getTeam(e)}async getTeamMemberMessages(e,s){return this._api.getTeamMemberMessages(e,s)}async getTeamTasks(e){return this._api.getTeamTasks(e)}async getThemes(){return this._api.getThemes()}async*streamSessionEntries(e,s,n){for await(const i of this._api.streamSessionEntries(e,s,n))yield G(i)}async getAllSessionEntries(e,s,n){const i=[];for await(const o of this.streamSessionEntries(e,s,n))i.push(o);return i}}let B=null;function Ce(){return B||(B=new Se),B}const k=Ce();function Ie(){const t=window.location.hash;if(!t)return;const s=new URLSearchParams(t.slice(1)).get("token")??void 0;return s&&window.history.replaceState(null,"",window.location.pathname),s}const K=Ie();k.setConfig({baseUrl:"",...K?{token:K}:{}});function Me(t,e){const s=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(s),i=document.createElement("a");i.href=n,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)}function Ee(t){return t=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(e){let s="json-number";return/^"/.test(e)?/:$/.test(e)?s="json-key":s="json-string":/true|false/.test(e)?s="json-boolean":/null/.test(e)&&(s="json-null"),'<span class="'+s+'">'+e+"</span>"})}async function Q(t){try{return await navigator.clipboard.writeText(t),!0}catch(e){return console.error("Failed to copy to clipboard",e),!1}}function X(t){const e=t.toLowerCase();return["claude","kimi","gemini","codex","copilot","qwen"].includes(e)?`color: var(--source-${e}-color); background: var(--source-${e}-bg); border: 1px solid var(--source-${e}-color);`:"color: var(--text-secondary); background: var(--border-color);"}function P(t,e,s,n="Loading..."){t.innerHTML=`
        <div class="panel">
            <div id="${s}-rendered" class="tab-content active">
                <div id="${s}-list" class="loading">${n}</div>
            </div>
            <div id="${s}-raw" class="tab-content">
                <div id="${s}-json-container"></div>
            </div>
        </div>
    `;const i=`
        <div class="tabs-header">
            <button class="tab-btn active" data-target="${s}-rendered">Rendered</button>
            <button class="tab-btn" data-target="${s}-raw">Raw JSON</button>
        </div>
    `;if(e)e.innerHTML=i;else{const l=document.createElement("div");l.style.cssText="display: flex; justify-content: flex-end; margin-bottom: 1rem;",l.innerHTML=i,t.insertBefore(l,t.firstChild)}const o=document.getElementById(`${s}-list`),r=document.getElementById(`${s}-json-container`),c=(e||t).querySelectorAll(".tab-btn"),a=t.querySelectorAll(".tab-content");return c.forEach(l=>{l.addEventListener("click",u=>{const p=u.target.getAttribute("data-target");c.forEach(g=>g.classList.remove("active")),u.target.classList.add("active"),a.forEach(g=>{g.classList.remove("active"),g.id===p&&g.classList.add("active")})})}),{listContainer:o,jsonContainer:r,setError:l=>{o&&(o.innerHTML=`<div class="error">${l}</div>`),r&&(r.innerHTML=`<div class="error">${l}</div>`)}}}function U(t,e){const s=e.filename.replace(/[^a-zA-Z0-9]/g,"-");t.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="${e.url}" target="_blank" rel="noopener" style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; color: var(--accent-color); text-decoration: none; opacity: 0.9;" title="Open raw data in new tab">${e.url??""}</a>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                <button class="btn btn-sm" id="btn-copy-${s}">📋 Copy API Response</button>
                <button class="btn btn-sm" id="btn-download-${s}">⬇️ Download JSON</button>
            </div>
        </div>
        <div class="json-view" style="flex: 1; width: 100%; overflow: auto;">${Ee(JSON.stringify(e.data,null,2))}</div>
    `;const n=document.getElementById(`btn-copy-${s}`);n&&n.addEventListener("click",async()=>{const o=await Q(JSON.stringify(e.data,null,2)),r=n.textContent;n.textContent=o?"✅ Copied!":"❌ Failed",setTimeout(()=>{n.textContent=r},2e3)});const i=document.getElementById(`btn-download-${s}`);i&&i.addEventListener("click",()=>{Me(`${s}.json`,e.data)})}function Le(t){const e=new Map;for(const s of t){const n=s.displayPath||s.path||s.id||"",i=`${s.name||""}\0${n}`,o=s.lastModified?new Date(s.lastModified).getTime():0,r=e.get(i);r?(s.source&&!r.sources.includes(s.source)&&r.sources.push(s.source),o>0&&(r.lastModifiedMin=r.lastModifiedMin===0?o:Math.min(r.lastModifiedMin,o),r.lastModifiedMax=Math.max(r.lastModifiedMax,o))):e.set(i,{name:s.name||"",id:s.id||"",path:n,sources:s.source?[s.source]:[],lastModifiedMin:o,lastModifiedMax:o})}return Array.from(e.values())}function je(t,e){const s=P(t,e,"projects","Loading projects...");if(e){const o=document.createElement("div");o.className="sort-controls",o.innerHTML=`
            <div class="sort-group">
                <button class="sort-btn" data-sort-field="name" title="Sort by name">Name</button>
                <button class="sort-btn active" data-sort-field="time" title="Sort by time">Time</button>
            </div>
            <button class="sort-btn sort-dir-btn" data-sort-dir="desc" title="Toggle sort direction">↓</button>
        `,e.insertBefore(o,e.firstChild)}let n="time",i="desc";Promise.all([k.getProjects(),k.getOpenInApps().catch(()=>({apps:[]})),k.getSources().catch(()=>[])]).then(([o,r,c])=>{const a=Le(o),l=r.apps||[],u=new Set;for(const v of c)if(v.can_resume||v.canResume){const m=v.name||v.id||"";m&&u.add(m)}function p(v){const m=[...v];return m.sort((y,h)=>{let d=0;if(n==="name")d=y.name.localeCompare(h.name,void 0,{sensitivity:"base"});else{const b=i==="asc"?y.lastModifiedMin:y.lastModifiedMax,_=i==="asc"?h.lastModifiedMin:h.lastModifiedMax;d=b-_}return i==="asc"?d:-d}),m}function g(){if(!s.listContainer)return;const v=p(a);if(v.length===0){s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No projects found.</div>';return}s.listContainer.innerHTML=v.map((m,y)=>{const h=`copy-${y}`,d=`open-in-${y}`,b=m.sources.map(x=>`<span class="badge" style="${X(x)}">${x}</span>`).join(""),_=m.lastModifiedMax,M=_>0?new Date(_).toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"}):"",E=m.sources.filter(x=>u.has(x)),j=E.length>0?"<option disabled>──────────</option>"+E.map(x=>`<option value="resume:${x}">Resume (${x})</option>`).join(""):"",L=l.filter(x=>x.enabled!==!1),A=L.length>0||E.length>0;return`
                    <div class="list-item">
                        <div style="flex: 1;">
                            <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                ${m.name||"Unnamed Project"}
                                ${b}
                            </div>
                            <div class="list-item-meta" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                <span style="font-family: 'IBM Plex Mono', monospace;">${m.path}</span>
                                <button id="${h}" class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.4rem; font-size: 0.7rem;" title="Copy path">📋</button>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            ${M?`<span style="opacity: 0.5; font-size: 0.75rem; white-space: nowrap;">${M}</span>`:""}
                            ${A?`
                                <select id="${d}" class="input">
                                    <option value="">Open in...</option>
                                    ${L.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}
                                    ${j}
                                </select>
                            `:""}
                        </div>
                    </div>
                `}).join(""),v.forEach((m,y)=>{const h=document.getElementById(`copy-${y}`);h&&h.addEventListener("click",async()=>{const b=await Q(m.path),_=h.textContent;h.textContent=b?"✅":"❌",setTimeout(()=>{h&&(h.textContent=_)},2e3)});const d=document.getElementById(`open-in-${y}`);d&&d.addEventListener("change",async()=>{const b=d.value;if(b)try{if(d.disabled=!0,b.startsWith("resume:")){const _=b.slice(7),M=await k.getSessions(m.id,_);if(M.length===0){alert(`No sessions found for ${_} in this project.`);return}M.sort((L,A)=>{const x=L.modifiedAt?new Date(L.modifiedAt).getTime():0;return(A.modifiedAt?new Date(A.modifiedAt).getTime():0)-x});const E=M[0],j=E.fullPath||E.full_path||"";if(!j){alert("Could not determine session path for resume.");return}await k.execResumeSession(j)}else await k.openIn(b,m.path)}catch(_){console.error("Action failed:",_),alert(`Failed: ${_.message||"Unknown error"}`)}finally{d.value="",d.disabled=!1}})})}if(e){const v=e.querySelectorAll("[data-sort-field]"),m=e.querySelector("[data-sort-dir]");v.forEach(y=>{y.addEventListener("click",()=>{n=y.getAttribute("data-sort-field"),v.forEach(h=>h.classList.remove("active")),y.classList.add("active"),g()})}),m&&m.addEventListener("click",()=>{i=i==="asc"?"desc":"asc",m.textContent=i==="asc"?"↑":"↓",m.setAttribute("data-sort-dir",i),g()})}g(),s.jsonContainer&&U(s.jsonContainer,{data:o,filename:"projects",url:"/api/v1/projects"})}).catch(o=>{s.setError(`Failed to load projects: ${o.message}`)})}function Ae(t,e){const s=P(t,e,"sources","Loading sources...");k.getSources().then(n=>{s.listContainer&&(n.length===0?s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No sources found.</div>':s.listContainer.innerHTML=n.map(i=>`
                        <div class="list-item">
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span class="badge" style="${X(i.name||"")}">${i.name}</span>
                                </div>
                                <div class="list-item-meta">${i.base_path||""}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                ${i.can_resume?'<span class="badge" title="This source supports continuous conversation history">Resumable</span>':""}
                                <div class="source-status online">Online</div>
                            </div>
                        </div>
                    `).join("")),s.jsonContainer&&U(s.jsonContainer,{data:n,filename:"sources",url:"/api/v1/sources"})}).catch(n=>{s.setError(`Failed to load sources: ${n.message}`)})}function I(t){return t===void 0?"—":t.toLocaleString()}function Pe(t){if(t===void 0)return"—";if(t<60)return`${t}s`;const e=Math.floor(t/3600),s=Math.floor(t%3600/60);return e>0?`${e}h ${s}m`:`${s}m`}function C(t,e,s,n){return`
        <div style="flex: 1; min-width: 150px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 500;">
                <span style="font-size: 1.1rem;">${t}</span> ${e}
            </div>
            <div style="font-size: 1.5rem; font-weight: 600; color: var(--text-primary); font-family: 'Inter', sans-serif;">${s}</div>
            ${n?`<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${n}</div>`:""}
        </div>
    `}function Z(t,e){if(t===void 0||e===void 0||e===0)return"";const s=Math.min(100,Math.round(t/e*100));return`
        <div style="margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                <span>${I(t)} / ${I(e)}</span>
                <span>${s}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: 999px; overflow: hidden;">
                <div style="width: ${s}%; height: 100%; background: var(--accent-color); border-radius: 999px;"></div>
            </div>
        </div>
    `}function Ue(t,e){t.innerHTML=`
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
  `;const s=document.getElementById("dashboard-connection"),n=document.getElementById("dashboard-stats"),i=document.getElementById("dashboard-indexer");k.getSources().then(()=>{s&&(s.classList.remove("loading"),s.innerHTML='<span class="source-status online">Online</span>')}).catch(o=>{s&&(s.classList.remove("loading"),s.innerHTML=`<span class="source-status offline" title="${o.message}">Offline</span>`)}),k.getStats().then(o=>{if(!n)return;const r=(o.top_tools||[]).sort((c,a)=>(a.count||0)-(c.count||0)).slice(0,10);n.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${C("💬","Sessions",I(o.total_sessions))}
                    ${C("📁","Projects",I(o.total_projects))}
                    ${C("📝","Entries",I(o.total_entries))}
                    ${C("🪙","Total Tokens",I(o.total_tokens))}
                </div>
                ${r.length>0?`
                    <div style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Top Tools Used</div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${r.map((c,a)=>{const l=r[0].count||1,u=Math.round((c.count||0)/l*100);return`
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace; min-width: 180px; color: var(--text-primary);">${c.name}</div>
                                    <div style="flex: 1; background: var(--border-color); border-radius: 999px; height: 8px; overflow: hidden;">
                                        <div style="background: var(--accent-color); width: ${u}%; height: 100%; border-radius: 999px;"></div>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary); min-width: 50px; text-align: right;">${I(c.count)}</div>
                                </div>
                            `}).join("")}
                    </div>
                `:""}
            `}).catch(o=>{n&&(n.innerHTML=`<div class="error">Failed to load stats: ${o.message}</div>`)}),k.getIndexerStatus().then(o=>{if(!i)return;const r=o.running?"var(--success-color)":"var(--text-secondary)",c=o.sync_progress,a=o.embed_progress;i.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${C("🧠","Model",o.model||"—",o.model_dim?`${o.model_dim}d`:void 0)}
                    ${C("⏱","Uptime",Pe(o.uptime_seconds))}
                    ${C("📡","Watching",o.watching?"Yes":"No")}
                    ${C("⚙️","State","",`<span style="color: ${r}; font-size: 0.9rem; font-weight: 600;">${o.state||(o.running?"Running":"Idle")}</span>`)}
                </div>

                ${c?`
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Sync Progress</div>
                        ${c.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${c.message}</div>`:""}
                        ${Z(c.done,c.total)}
                        ${c.project_name?`<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">Project: ${c.project_name}</div>`:""}
                    </div>
                `:""}

                ${a?`
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Embedding Progress</div>
                        ${a.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${a.message}</div>`:""}
                        ${Z(a.done,a.total)}
                    </div>
                `:""}

                ${!c&&!a?'<div style="color: var(--text-secondary); font-size: 0.875rem;">No active sync or embedding in progress.</div>':""}
            `}).catch(o=>{i&&(i.innerHTML=`<div style="color: var(--text-secondary);">Indexer status unavailable: ${o.message}</div>`)})}function Be(t,e){const s=P(t,e,"apps","Loading apps...");k.getOpenInApps().then(n=>{const i=n.apps||[],o=n.default_terminal;if(s.listContainer)if(i.length===0){s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No apps configured.</div>';return}else s.listContainer.innerHTML=i.map(r=>{const c=[];if(r.terminal){const a=r.id===o;c.push('<span class="badge" style="background: rgba(20, 184, 166, 0.12); border: 1px solid rgba(20, 184, 166, 0.35); color: #2dd4bf;" title="Terminal App">terminal</span>'),a&&c.push('<span class="badge" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24;" title="Default Terminal">★ default</span>')}return`
                        <div class="list-item">
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${r.name}
                                    ${c.join("")}
                                </div>
                                <div class="list-item-meta">${r.id} · ${r.enabled!==!1?"enabled":"disabled"}</div>
                            </div>
                        </div>
                    `}).join("");s.jsonContainer&&U(s.jsonContainer,{data:n,filename:"allowed-apps",url:"/api/v1/open-in/apps"})}).catch(n=>{s.setError(`Failed to load apps: ${n.message}`)})}function $(t){if(!t)return"";const e=[];return t.fg&&e.push(`color: ${t.fg}`),t.bg&&e.push(`background: ${t.bg}`),e.join("; ")}function S(t,e,s){const n=(e==null?void 0:e.fg)||s||"var(--text-secondary)",i=(e==null?void 0:e.bg)||"transparent";return`
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <div style="width: 20px; height: 20px; border-radius: 4px; background: ${n}; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;" title="${n}"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${t}</span>
            ${i!=="transparent"?`<div style="width: 20px; height: 20px; border-radius: 4px; background: ${i}; border: 1px solid rgba(255,255,255,0.1);" title="bg: ${i}"></div>`:""}
        </div>
    `}function Re(t,e,s){var i,o;const n=e;t.innerHTML=`
        <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;">
            
            <!-- Preview Header -->
            <div style="padding: 0.5rem 0.75rem; background: ${n.border_active||"var(--border-color)"}20; border-bottom: 2px solid ${n.border_active||"var(--border-color)"}; font-size: 0.75rem; color: var(--text-secondary);">
                Preview: ${s} ${n.accent?`<span style="color:${n.accent};">●</span>`:""}
            </div>

            <!-- Simulated conversation -->
            <div style="padding: 0.75rem; background: #0d0d0d; display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- User turn -->
                <div style="${$(n.user_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; border-left: 3px solid ${n.accent||"#aaa"};">
                    <div style="${$(n.user_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        USER
                    </div>
                    <div style="${$(n.text_primary)};">Hello, can you help me?</div>
                </div>

                <!-- Assistant thinking indicator -->
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin: 0.25rem 0;">
                    <div style="${$(n.thinking_label)}; font-size: 0.7rem;">&lt;thinking&gt;</div>
                </div>

                <!-- Tool call -->
                <div style="${$({bg:((i=n.tool_label)==null?void 0:i.bg)||"#1a1a1a"})}; border: 1px dotted ${((o=n.tool_label)==null?void 0:o.fg)||"#444"}; padding: 0.5rem; border-radius: 4px;">
                    <span style="${$(n.tool_label)}; font-size: 0.75rem;">⚙️ runCode(python)</span>
                </div>

                <!-- Assistant turn -->
                <div style="${$(n.assistant_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; margin-top: 0.25rem;">
                    <div style="${$(n.assistant_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        ASSISTANT
                    </div>
                    <div style="${$(n.text_primary)};">
                        I ran the code. The result is <span style="${$(n.text_secondary)};">42</span>.
                    </div>
                    <div style="${$(n.text_muted)}; font-size: 0.75rem; margin-top: 0.25rem;">
                        (Took 0.3s)
                    </div>
                </div>
            </div>

            <!-- Color Swatches Grid -->
            <div style="padding: 0.75rem; border-top: 1px solid var(--border-color); display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1.5rem;">
                ${n.accent?S("accent",{fg:n.accent}):""}
                ${S("user",n.user_label)}
                ${S("assistant",n.assistant_label)}
                ${S("tool",n.tool_label)}
                ${S("thinking",n.thinking_label)}
                ${S("text primary",n.text_primary)}
                ${S("text secondary",n.text_secondary)}
                ${S("text muted",n.text_muted)}
                ${n.border_active?S("border active",{fg:n.border_active}):""}
            </div>
        </div>
    `}function Oe(t,e){const s=P(t,e,"themes","Loading themes...");k.getThemes().then(n=>{const i=(n.themes||[]).sort((o,r)=>o.active&&!r.active?-1:!o.active&&r.active?1:(o.name||"").localeCompare(r.name||""));s.listContainer&&(i.length===0?s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No themes found.</div>':(s.listContainer.innerHTML=`
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                            Preview the available themes from the connected Thinkt API.
                        </p>
                    `,i.forEach((o,r)=>{const c=document.createElement("div");c.style.marginBottom="0.75rem";const a=document.createElement("div");a.className="list-item",a.style.cursor="pointer",a.style.background="var(--bg-color)",a.style.borderRadius="6px",a.style.border="1px solid var(--border-color)",a.innerHTML=`
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${o.name||"Unnamed"}
                                    ${o.active?'<span class="badge success">Active</span>':""}
                                    ${o.embedded?'<span class="badge">Built-in</span>':""}
                                </div>
                                ${o.description?`<div class="list-item-meta">${o.description}</div>`:""}
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">
                                <span class="toggle-icon">▼</span>
                            </div>
                        `;const l=document.createElement("div");l.id=`theme-preview-${r}`,l.style.display="none",l.style.marginTop="0.5rem";let u=!1;a.addEventListener("click",()=>{const p=l.style.display==="none";l.style.display=p?"block":"none",a.querySelector(".toggle-icon").textContent=p?"▲":"▼",p&&!u&&o.colors&&(Re(l,o.colors,o.name||"Unnamed"),u=!0)}),c.appendChild(a),c.appendChild(l),s.listContainer.appendChild(c),o.active&&a.click()}))),s.jsonContainer&&U(s.jsonContainer,{data:n,filename:"themes",url:"/api/v1/themes"})}).catch(n=>{s.setError(`Failed to load themes: ${n.message}`)})}const Y=document.getElementById("app");if(Y){let t=function(o){if(!s||!n)return;const r=document.getElementById("header-controls");switch(r&&(r.innerHTML=""),e.forEach(c=>{var a;c.classList.remove("active"),c.getAttribute("data-view")===o&&(c.classList.add("active"),s.textContent=((a=c.textContent)==null?void 0:a.trim())||o)}),n.innerHTML="",o){case"dashboard":Ue(n);break;case"projects":je(n,r);break;case"sources":Ae(n,r);break;case"apps":Be(n,r);break;case"themes":Oe(n,r);break;default:n.innerHTML=`<div class="error">View "${o}" not implemented yet</div>`}};Y.innerHTML=`
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
  `;const e=document.querySelectorAll(".nav-item"),s=document.getElementById("view-title"),n=document.getElementById("view-container"),i=document.getElementById("theme-toggle");localStorage.getItem("theme")==="light"&&document.body.classList.add("light-mode"),i==null||i.addEventListener("click",()=>{document.body.classList.toggle("light-mode");const o=document.body.classList.contains("light-mode");localStorage.setItem("theme",o?"light":"dark")}),e.forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-view");r&&t(r)})}),document.addEventListener("navigate",o=>{t(o.detail)}),t("dashboard")}
