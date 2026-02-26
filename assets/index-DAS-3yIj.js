var F=Object.defineProperty;var G=(t,e,n)=>e in t?F(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var h=(t,e,n)=>G(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();class v extends Error{constructor(n,s,i,o){super(n);h(this,"line");h(this,"source");h(this,"rawContent");this.line=s,this.source=i,this.rawContent=o,this.name="ParseError"}}function K(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"system":return"system";case"progress":return"progress";case"summary":return"summary";case"file-history-snapshot":return"checkpoint";case"queue-operation":return"system";default:return"system"}}function Z(t){if(typeof t=="string")return{type:"text",text:t};if(typeof t!="object"||t===null)return null;const e=t;switch(e.type){case"text":return{type:"text",text:e.text??""};case"thinking":return{type:"thinking",thinking:e.thinking??"",signature:e.signature};case"tool_use":return{type:"tool_use",toolUseId:e.id??"",toolName:e.name??"",toolInput:e.input??{}};case"tool_result":return{type:"tool_result",toolUseId:e.tool_use_id??"",toolResult:typeof e.content=="string"?e.content:JSON.stringify(e.content??""),isError:e.is_error===!0};case"image":return e.source?{type:"image",mediaType:e.source.media_type??"image/png",mediaData:e.source.data??""}:null;case"document":return e.source?{type:"document",mediaType:e.source.media_type??"application/pdf",mediaData:e.source.data??""}:null;default:return"text"in e&&typeof e.text=="string"?{type:"text",text:e.text}:null}}function Y(t){if(!(t!=null&&t.usage))return;const e=t.usage;return{inputTokens:e.input_tokens??0,outputTokens:e.output_tokens??0,cacheCreationInputTokens:e.cache_creation_input_tokens,cacheReadInputTokens:e.cache_read_input_tokens}}function L(t,e="claude"){var c;const n=K(t.type),s=[];let i;if(t.message){const a=t.message.content;if(typeof a=="string")i=a,s.push({type:"text",text:a});else if(Array.isArray(a)){for(const d of a){const p=Z(d);p&&s.push(p)}const l=s.filter(d=>d.type==="text");l.length>0&&(i=l.map(d=>d.text).join(`
`))}}t.type==="summary"&&t.summary&&(i=t.summary,s.length===0&&s.push({type:"text",text:t.summary}));let o;t.timestamp?o=new Date(t.timestamp):o=new Date;const r={uuid:t.uuid??`entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,parentUuid:t.parentUuid??void 0,role:n,timestamp:o,source:e,contentBlocks:s,text:i,model:(c=t.message)==null?void 0:c.model,usage:Y(t.message),gitBranch:t.gitBranch,cwd:t.cwd,isCheckpoint:t.type==="file-history-snapshot",isSidechain:t.isSidechain,metadata:{}};return t.sessionId&&(r.metadata.sessionId=t.sessionId),t.version&&(r.metadata.version=t.version),t.agentId&&(r.metadata.agentId=t.agentId),t.error&&(r.metadata.error=t.error),t.isApiErrorMessage&&(r.metadata.isApiErrorMessage=t.isApiErrorMessage),t.stopReason&&(r.metadata.stopReason=t.stopReason),t.requestId&&(r.metadata.requestId=t.requestId),t.permissionMode&&(r.metadata.permissionMode=t.permissionMode),t.thinkingMetadata&&(r.metadata.thinkingMetadata=t.thinkingMetadata),t.status&&(r.metadata.progressStatus=t.status),Object.keys(r.metadata).length===0&&delete r.metadata,r}function Q(t,e){const n=[];let s=0;const i=t.split(`
`);for(let o=0;o<i.length;o++){const r=i[o].trim();if(r)try{const c=JSON.parse(r);n.push(c)}catch{{s++;continue}}}return{entries:n,skipped:s}}function X(t){if(typeof t!="string")return!1;const e=t.trim().split(`
`)[0];if(!e)return!1;try{const n=JSON.parse(e);return typeof n=="object"&&n!==null&&"type"in n&&["user","assistant","system","progress","file-history-snapshot","summary","queue-operation"].includes(n.type)}catch{return!1}}function j(t,e){var I,E;const n=t.filter(u=>u.role==="user"||u.role==="assistant"),s=n[0]??t[0],i=n[n.length-1]??t[t.length-1];let o;if(s&&i){const u=s.timestamp.getTime(),w=i.timestamp.getTime();!isNaN(u)&&!isNaN(w)&&w>u&&(o=w-u)}const r=t.find(u=>u.role==="assistant"&&u.model),c=r==null?void 0:r.model,a={inputTokens:0,outputTokens:0,cacheCreationInputTokens:0,cacheReadInputTokens:0};for(const u of t)u.usage&&(a.inputTokens+=u.usage.inputTokens??0,a.outputTokens+=u.usage.outputTokens??0,a.cacheCreationInputTokens+=u.usage.cacheCreationInputTokens??0,a.cacheReadInputTokens+=u.usage.cacheReadInputTokens??0);const l=(I=s==null?void 0:s.metadata)==null?void 0:I.sessionId,d=t.find(u=>u.role==="user"),p=(E=d==null?void 0:d.text)==null?void 0:E.slice(0,200),f=t.filter(u=>u.role==="summary"&&u.text),q=f.length>0?f[f.length-1].text:void 0;let T=e??"Claude Code Session";return l?T=`Session ${l.slice(0,8)}...`:p&&(T=p.slice(0,50)+(p.length>50?"...":"")),{id:l??`session-${Date.now()}`,title:T,source:"claude",entryCount:t.length,createdAt:s==null?void 0:s.timestamp,modifiedAt:i==null?void 0:i.timestamp,model:c,gitBranch:s==null?void 0:s.gitBranch,projectPath:s==null?void 0:s.cwd,durationMs:o,totalUsage:a,firstPrompt:p,summary:q}}function ee(t){return{source:"claude",canParse(e){return X(e)},parse(e,n){if(typeof e!="string")throw new v("Claude parser expects string content",void 0,"claude");const{entries:s,skipped:i}=Q(e),o=s.map(a=>L(a,"claude")),r=j(o,n),c=[];return i>0&&c.push(`Skipped ${i} invalid JSON line(s)`),{session:{meta:r,entries:o},warnings:c.length>0?c:void 0,skippedCount:i>0?i:void 0}},parseMetadata(e,n){if(typeof e!="string")throw new v("Claude parser expects string content",void 0,"claude");const s=e.split(`
`).filter(c=>c.trim()),i=[...s.slice(0,50),...s.slice(-10)],o=[];for(const c of i)try{const a=JSON.parse(c);o.push(L(a,"claude"))}catch{}const r=j(o,n);return r.entryCount=s.length,r}}}const te=ee();function ne(t){if(typeof t!="string")return!1;try{const e=t.split(`
`);for(const n of e){const s=n.trim();if(!s)continue;const i=JSON.parse(s);return typeof i=="object"&&i!==null&&typeof i.role=="string"&&!("uuid"in i)&&!("type"in i)?["user","assistant","tool","system","_checkpoint","_usage"].includes(i.role):!1}return!1}catch{return!1}}function se(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"tool":return"tool";case"system":return"system";case"_checkpoint":return"checkpoint";case"_usage":return"system";default:return"system"}}function M(t){if(t==null)return null;if(typeof t=="string")return{type:"text",text:t};if(typeof t!="object")return null;const e=t;switch(e.type){case"text":return{type:"text",text:e.text??""};case"thinking":case"think":return{type:"thinking",thinking:e.thinking??e.think??"",signature:e.signature};case"tool_result":{let s="";return typeof e.content=="string"?s=e.content:Array.isArray(e.content)&&(s=e.content.filter(i=>typeof i=="object"&&i!==null).map(i=>i.text??"").filter(Boolean).join("")),{type:"tool_result",toolUseId:e.tool_use_id??"",toolResult:s,isError:e.is_error??!1}}default:return"text"in e&&typeof e.text=="string"?{type:"text",text:e.text}:null}}function ie(t,e){const n=t.role;if(!n||n==="_usage")return null;const s={uuid:`L${e}`,role:se(n),timestamp:t.timestamp?new Date(t.timestamp*1e3):new Date,source:"kimi",contentBlocks:[],metadata:{}};if(n==="_checkpoint")return s.isCheckpoint=!0,s;switch(n){case"user":if(typeof t.content=="string")s.text=t.content,s.contentBlocks=[{type:"text",text:t.content}];else if(Array.isArray(t.content)){const i=t.content.map(M).filter(o=>o!==null);s.contentBlocks=i,s.text=P(i)}break;case"assistant":if(Array.isArray(t.content)){const i=t.content.map(M).filter(o=>o!==null);s.contentBlocks=i,s.text=P(i)}if(Array.isArray(t.tool_calls))for(const i of t.tool_calls){let o="",r={};if(i.function){if(o=i.function.name,i.function.arguments)try{r=JSON.parse(i.function.arguments)}catch{r=i.function.arguments}}else o=i.name??"",r=i.input??{};s.contentBlocks.push({type:"tool_use",toolUseId:i.id,toolName:o,toolInput:r})}break;case"tool":{let i="";typeof t.content=="string"?i=t.content:Array.isArray(t.content)&&(i=t.content.filter(o=>typeof o=="object"&&o!==null).map(o=>o.text??"").filter(Boolean).join("")),s.contentBlocks=[{type:"tool_result",toolUseId:t.tool_call_id??"",toolResult:i,isError:!1}];break}case"system":typeof t.content=="string"&&(s.text=t.content,s.contentBlocks=[{type:"text",text:t.content}]);break}return t.usage&&(s.usage={inputTokens:t.usage.input_tokens??0,outputTokens:t.usage.output_tokens??0}),s}function P(t){return t.filter(e=>e.type==="text").map(e=>e.text).filter(Boolean).join(`
`)}function U(t,e={}){const{skipInvalidLines:n=!0}=e,s=t.split(`
`),i=[];let o=0,r=0;for(const c of s){const a=c.trim();if(a){r++;try{const l=JSON.parse(a),d=ie(l,r);d&&i.push(d)}catch(l){if(n)o++;else throw new v(`Invalid JSON on line ${r}: ${l instanceof Error?l.message:String(l)}`)}}}return{entries:i,skipped:o}}function A(t){const e={id:`kimi-${Date.now()}`,title:"Kimi Session",source:"kimi",entryCount:t.length},n=t.find(r=>r.role==="user");n!=null&&n.text&&(e.firstPrompt=n.text.length>50?n.text.slice(0,50)+"...":n.text);const s=t.filter(r=>r.timestamp);if(s.length>=2){const r=s[0].timestamp,c=s[s.length-1].timestamp;e.durationMs=c.getTime()-r.getTime()}let i=0,o=0;for(const r of t)r.usage&&(i+=r.usage.inputTokens,o+=r.usage.outputTokens);return(i>0||o>0)&&(e.totalUsage={inputTokens:i,outputTokens:o}),e}function oe(t={}){return{source:"kimi",canParse(e){return ne(e)},parse(e){if(typeof e!="string")throw new v("Kimi parser expects string content");const{entries:n,skipped:s}=U(e,t),r={session:{meta:A(n),entries:n},warnings:[],skippedCount:s};return s>0&&r.warnings.push(`Skipped ${s} invalid JSON line(s)`),r},parseMetadata(e){if(typeof e!="string")throw new v("Kimi parser expects string content");const{entries:n}=U(e,{...t,skipInvalidLines:!0});return A(n)}}}const re=oe();function ae(t){if(typeof t!="string")return!1;try{const e=JSON.parse(t);return typeof e=="object"&&e!==null&&"sessionId"in e&&Array.isArray(e.messages)}catch{return!1}}function B(t){try{const e=JSON.parse(t),n=[];for(const i of e.messages){const o=i.timestamp?new Date(i.timestamp):new Date;if(i.type==="user")n.push({uuid:i.id??`msg-${Date.now()}-${Math.random()}`,role:"user",source:"gemini",timestamp:o,text:i.content,contentBlocks:i.content?[{type:"text",text:i.content}]:[]});else if(i.type==="gemini"){const r=[];if(i.thoughts)for(const a of i.thoughts)r.push({type:"thinking",thinking:`[${a.subject}] ${a.description}`});if(i.content&&r.push({type:"text",text:i.content}),i.toolCalls)for(const a of i.toolCalls)r.push({type:"tool_use",toolUseId:a.id,toolName:a.name,toolInput:a.args});const c=i.tokens?{inputTokens:i.tokens.input,outputTokens:i.tokens.output,thinkingTokens:i.tokens.thoughts,serverToolUse:i.tokens.tool}:void 0;if(n.push({uuid:i.id??`msg-${Date.now()}-${Math.random()}`,role:"assistant",source:"gemini",timestamp:o,model:i.model,usage:c,contentBlocks:r,text:i.content}),i.toolCalls){for(const a of i.toolCalls)if(a.result)for(const l of a.result){let d="";const p=l.functionResponse.response;if(p&&"output"in p){const f=p.output;d=typeof f=="string"?f:JSON.stringify(f)}else d=JSON.stringify(p);n.push({uuid:l.functionResponse.id??`res-${Date.now()}-${Math.random()}`,role:"tool",source:"gemini",timestamp:o,contentBlocks:[{type:"tool_result",toolUseId:a.id,toolResult:d,isError:!1}]})}}}}return{session:{meta:ce(e,n),entries:n}}}catch(e){throw new v(`Failed to parse Gemini JSON: ${e instanceof Error?e.message:String(e)}`,void 0,"gemini")}}function ce(t,e){const n=e.find(c=>c.role==="user"),s=n==null?void 0:n.text;let i=0,o=0;for(const c of e)c.usage&&(i+=c.usage.inputTokens,o+=c.usage.outputTokens);const r=t.startTime&&t.lastUpdated?new Date(t.lastUpdated).getTime()-new Date(t.startTime).getTime():void 0;return{id:t.sessionId,source:"gemini",title:s?s.slice(0,50)+(s.length>50?"...":""):"Gemini Session",entryCount:e.length,createdAt:t.startTime?new Date(t.startTime):void 0,modifiedAt:t.lastUpdated?new Date(t.lastUpdated):void 0,durationMs:r,totalUsage:{inputTokens:i,outputTokens:o},firstPrompt:s==null?void 0:s.slice(0,200)}}function le(t){return{source:"gemini",canParse(e){return ae(e)},parse(e){if(typeof e!="string")throw new v("Gemini parser expects string content");return B(e)},parseMetadata(e){if(typeof e!="string")throw new v("Gemini parser expects string content");return B(e).session.meta}}}const de=le();class ue{constructor(){h(this,"parsers",new Map);this.register(te),this.register(re),this.register(de)}register(e){this.parsers.set(e.source,e)}unregister(e){this.parsers.delete(e)}get(e){return this.parsers.get(e)}getSources(){return[...this.parsers.keys()]}canParse(e){for(const n of this.parsers.values())if(n.canParse(e))return!0;return!1}detect(e){for(const n of this.parsers.values())if(n.canParse(e))return n}parse(e,n){const s=this.detect(e);if(!s)throw new v("No parser found for content format");return s.parse(e,n)}parseMetadata(e,n){const s=this.detect(e);if(!s)throw new v("No parser found for content format");return s.parseMetadata?s.parseMetadata(e,n):s.parse(e,n).session.meta}}new ue;class R extends Error{constructor(n,s,i){super(n);h(this,"statusCode");h(this,"response");this.statusCode=s,this.response=i,this.name="ThinktAPIError"}}class O extends Error{constructor(n,s){super(n);h(this,"originalError");this.originalError=s,this.name="ThinktNetworkError"}}const me={baseUrl:"http://localhost:8784",apiVersion:"/api/v1",timeout:3e4};function m(t,e,n,s){let i=`${t}${e}${n}`;if(s&&Object.keys(s).length>0){const o=new URLSearchParams;for(const[c,a]of Object.entries(s))a!=null&&o.append(c,String(a));const r=o.toString();r&&(i+=`?${r}`)}return i}class pe{constructor(e){h(this,"config");this.config={...me,...e}}setConfig(e){this.config={...this.config,...e}}getConfig(){return{...this.config}}async fetchWithTimeout(e,n={},s){const i=new AbortController,o=setTimeout(()=>i.abort(),this.config.timeout),r=s?AbortSignal.any([i.signal,s]):i.signal,c=this.config.fetch??fetch;try{const a={};this.config.token&&(a.Authorization=`Bearer ${this.config.token}`);const l=await c(e,{...n,signal:r,headers:{Accept:"application/json",...a,...n.headers}});if(clearTimeout(o),!l.ok){let d;try{d=await l.json()}catch{}throw new R((d==null?void 0:d.message)||`HTTP ${l.status}: ${l.statusText}`,l.status,d)}return await l.json()}catch(a){throw clearTimeout(o),a instanceof R?a:a instanceof Error&&a.name==="AbortError"?s!=null&&s.aborted?a:new O(`Request timeout after ${this.config.timeout}ms`,a):new O(a instanceof Error?a.message:"Network error",a)}}async getSources(){const e=m(this.config.baseUrl,this.config.apiVersion,"/sources");return(await this.fetchWithTimeout(e)).sources??[]}async getProjects(e,n){const s=m(this.config.baseUrl,this.config.apiVersion,"/projects",{source:e,include_deleted:n!=null&&n.includeDeleted?"true":void 0});return(await this.fetchWithTimeout(s,{},n==null?void 0:n.signal)).projects??[]}async getSessions(e,n,s){const i=encodeURIComponent(e),o=n==null?void 0:n.trim().toLowerCase(),r=o?`/projects/${encodeURIComponent(o)}/${i}/sessions`:`/projects/${i}/sessions`,c=m(this.config.baseUrl,this.config.apiVersion,r);return(await this.fetchWithTimeout(c,{},s)).sessions??[]}async getSession(e,n){const s=encodeURIComponent(e),i=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}`,{limit:n==null?void 0:n.limit,offset:n==null?void 0:n.offset}),o=await this.fetchWithTimeout(i,{},n==null?void 0:n.signal);return{meta:o.meta,entries:o.entries??[],total:o.total??0,has_more:o.has_more??!1}}async getSessionMetadata(e,n){const s=encodeURIComponent(e),i={limit:n==null?void 0:n.limit,offset:n==null?void 0:n.offset,sort_by:n==null?void 0:n.sortBy};n!=null&&n.excludeRoles&&n.excludeRoles.length>0&&(i.exclude_roles=n.excludeRoles.join(",")),(n==null?void 0:n.summaryOnly)!==void 0&&(i.summary_only=n.summaryOnly?"true":"false");const o=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}/metadata`,i);return await this.fetchWithTimeout(o)}async openIn(e,n){const s=m(this.config.baseUrl,this.config.apiVersion,"/open-in"),i=await this.fetchWithTimeout(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({app:e,path:n})});if(i.error)throw new Error(i.error)}async getOpenInApps(){const e=m(this.config.baseUrl,this.config.apiVersion,"/open-in/apps");return(await this.fetchWithTimeout(e)).apps??[]}async search(e){const n={q:e.query,project:e.project,source:e.source,limit:e.limit,limit_per_session:e.limitPerSession};e.caseSensitive&&(n.case_sensitive="true"),e.regex&&(n.regex="true");const s=m(this.config.baseUrl,this.config.apiVersion,"/search",n);return await this.fetchWithTimeout(s,{},e.signal)}async semanticSearch(e){const n={q:e.query,project:e.project,source:e.source,limit:e.limit,max_distance:e.maxDistance};e.diversity&&(n.diversity="true");const s=m(this.config.baseUrl,this.config.apiVersion,"/semantic-search",n);return await this.fetchWithTimeout(s,{},e.signal)}async getResumeCommand(e){const n=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${n}/resume`);return await this.fetchWithTimeout(s)}async execResumeSession(e){const n=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/sessions/${n}/resume`);return await this.fetchWithTimeout(s,{method:"POST"})}async getIndexerHealth(){const e=m(this.config.baseUrl,this.config.apiVersion,"/indexer/health");return await this.fetchWithTimeout(e)}async getIndexerStatus(){const e=m(this.config.baseUrl,this.config.apiVersion,"/indexer/status");return await this.fetchWithTimeout(e)}async getStats(){const e=m(this.config.baseUrl,this.config.apiVersion,"/stats");return await this.fetchWithTimeout(e)}async getTeams(){const e=m(this.config.baseUrl,this.config.apiVersion,"/teams");return(await this.fetchWithTimeout(e)).teams??[]}async getTeam(e){const n=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/teams/${n}`);return await this.fetchWithTimeout(s)}async getTeamMemberMessages(e,n){const s=encodeURIComponent(e),i=encodeURIComponent(n),o=m(this.config.baseUrl,this.config.apiVersion,`/teams/${s}/members/${i}/messages`);return(await this.fetchWithTimeout(o)).messages??[]}async getTeamTasks(e){const n=encodeURIComponent(e),s=m(this.config.baseUrl,this.config.apiVersion,`/teams/${n}/tasks`);return(await this.fetchWithTimeout(s)).tasks??[]}async getThemes(){const e=m(this.config.baseUrl,this.config.apiVersion,"/themes");return await this.fetchWithTimeout(e)}async*streamSessionEntries(e,n=100,s){let i=0,o=!0;for(;o;){const r=await this.getSession(e,{limit:n,offset:i,signal:s});for(const c of r.entries)yield c;if(o=r.has_more,i+=r.entries.length,r.entries.length===0)break}}async getAllSessionEntries(e,n=100,s){const i=[];for await(const o of this.streamSessionEntries(e,n,s))i.push(o);return i}}function C(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}function fe(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"tool":return"tool";case"system":return"system";case"summary":return"summary";case"progress":return"progress";case"checkpoint":return"checkpoint";default:return"assistant"}}function ge(t){switch(t.type??"text"){case"text":return{type:"text",text:t.text??""};case"thinking":return{type:"thinking",thinking:t.thinking??"",signature:t.signature};case"tool_use":return{type:"tool_use",toolUseId:t.tool_use_id??"",toolName:t.tool_name??"unknown",toolInput:t.tool_input??{}};case"tool_result":return{type:"tool_result",toolUseId:t.tool_use_id??"",toolResult:t.tool_result??"",isError:t.is_error??!1};case"image":return{type:"image",mediaType:t.media_type??"image/png",mediaData:t.media_data??""};case"document":return{type:"document",mediaType:t.media_type??"application/pdf",mediaData:t.media_data??"",filename:void 0};default:return{type:"text",text:t.text??""}}}function he(t){return{id:t.id??"",name:t.name??"",path:t.path??"",displayPath:t.display_path,sessionCount:t.session_count??0,lastModified:t.last_modified?new Date(t.last_modified):void 0,source:C(t.source),workspaceId:t.workspace_id,sourceBasePath:t.source_base_path,pathExists:t.path_exists??!0}}function N(t){return{id:t.id??"unknown",projectPath:t.project_path,fullPath:t.full_path,firstPrompt:t.first_prompt,summary:t.summary,entryCount:t.entry_count??0,fileSize:t.file_size,createdAt:t.created_at?new Date(t.created_at):void 0,modifiedAt:t.modified_at?new Date(t.modified_at):void 0,gitBranch:t.git_branch,model:t.model,source:C(t.source),workspaceId:t.workspace_id,chunkCount:t.chunk_count,title:t.first_prompt?t.first_prompt.slice(0,60)+(t.first_prompt.length>60?"...":""):t.id??"Untitled Session"}}function D(t){var s;const e=((s=t.content_blocks)==null?void 0:s.map(ge))??[],n={};return t.metadata&&Object.assign(n,t.metadata),t.workspace_id&&(n.workspaceId=t.workspace_id),{uuid:t.uuid??`entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,parentUuid:t.parent_uuid??void 0,role:fe(t.role),timestamp:t.timestamp?new Date(t.timestamp):new Date,source:C(t.source),contentBlocks:e,text:t.text??e.filter(i=>i.type==="text").map(i=>i.text).join(`
`),model:t.model,usage:t.usage?{inputTokens:t.usage.input_tokens??0,outputTokens:t.usage.output_tokens??0,cacheCreationInputTokens:t.usage.cache_creation_input_tokens,cacheReadInputTokens:t.usage.cache_read_input_tokens}:void 0,gitBranch:t.git_branch,cwd:t.cwd,isCheckpoint:t.is_checkpoint??!1,isSidechain:t.is_sidechain??!1,agentId:t.agent_id,sourceAgentId:t.source_agent_id,metadata:Object.keys(n).length>0?n:void 0}}function ye(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}class ve{constructor(e){h(this,"_api");this._api=new pe(e)}get api(){return this._api}setConfig(e){this._api.setConfig(e)}getConfig(){return this._api.getConfig()}async getSources(){return this._api.getSources()}async getProjects(e,n){return(await this._api.getProjects(e,n)).map(he)}async getSessions(e,n,s){return(await this._api.getSessions(e,n,s)).map(N)}async getSession(e,n){const s=await this._api.getSession(e,n);return{meta:N(s.meta),entries:s.entries.map(D),total:s.total,hasMore:s.has_more}}async getSessionMetadata(e,n){const s=await this._api.getSessionMetadata(e,n),i=s.meta;return{meta:{id:(i==null?void 0:i.id)??"unknown",fullPath:i==null?void 0:i.path,entryCount:s.total_entries??0,createdAt:i!=null&&i.created_at?new Date(i.created_at):void 0,modifiedAt:i!=null&&i.modified_at?new Date(i.modified_at):void 0,gitBranch:i==null?void 0:i.git_branch,model:i==null?void 0:i.model,source:ye(i==null?void 0:i.source),title:(i==null?void 0:i.id)??"Session Metadata"},description:s.description,roleCounts:s.role_counts??{},entrySummary:(s.entry_summary??[]).map(r=>({index:r.index,role:r.role,timestamp:r.timestamp,contentLength:r.content_length,hasThinking:r.has_thinking,hasToolUse:r.has_tool_use,hasToolResult:r.has_tool_result,preview:r.preview})),totalEntries:s.total_entries??0,totalContentBytes:s.total_content_bytes??0,returnedSummaries:s.returned_summaries??0}}async openIn(e,n){return this._api.openIn(e,n)}async getOpenInApps(){return this._api.getOpenInApps()}async search(e){return this._api.search(e)}async semanticSearch(e){return this._api.semanticSearch(e)}async getResumeCommand(e){return this._api.getResumeCommand(e)}async execResumeSession(e){return this._api.execResumeSession(e)}async getIndexerHealth(){return this._api.getIndexerHealth()}async getIndexerStatus(){return this._api.getIndexerStatus()}async getStats(){return this._api.getStats()}async getTeams(){return this._api.getTeams()}async getTeam(e){return this._api.getTeam(e)}async getTeamMemberMessages(e,n){return this._api.getTeamMemberMessages(e,n)}async getTeamTasks(e){return this._api.getTeamTasks(e)}async getThemes(){return this._api.getThemes()}async*streamSessionEntries(e,n,s){for await(const i of this._api.streamSessionEntries(e,n,s))yield D(i)}async getAllSessionEntries(e,n,s){const i=[];for await(const o of this.streamSessionEntries(e,n,s))i.push(o);return i}}let S=null;function be(){return S||(S=new ve),S}const y=be();function xe(){const t=window.location.hash;if(!t)return;const n=new URLSearchParams(t.slice(1)).get("token")??void 0;return n&&window.history.replaceState(null,"",window.location.pathname),n}const z=xe();y.setConfig({baseUrl:"",...z?{token:z}:{}});function ke(t,e){const n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(n),i=document.createElement("a");i.href=s,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(s)}function _e(t){return t=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(e){let n="json-number";return/^"/.test(e)?/:$/.test(e)?n="json-key":n="json-string":/true|false/.test(e)?n="json-boolean":/null/.test(e)&&(n="json-null"),'<span class="'+n+'">'+e+"</span>"})}async function V(t){try{return await navigator.clipboard.writeText(t),!0}catch(e){return console.error("Failed to copy to clipboard",e),!1}}function W(t){const e=t.toLowerCase();return["claude","kimi","gemini","codex","copilot","qwen"].includes(e)?`color: var(--source-${e}-color); background: var(--source-${e}-bg); border: 1px solid var(--source-${e}-color);`:"color: var(--text-secondary); background: var(--border-color);"}function _(t,e,n,s="Loading..."){t.innerHTML=`
        <div class="panel">
            <div id="${n}-rendered" class="tab-content active">
                <div id="${n}-list" class="loading">${s}</div>
            </div>
            <div id="${n}-raw" class="tab-content">
                <div id="${n}-json-container"></div>
            </div>
        </div>
    `;const i=`
        <div class="tabs-header">
            <button class="tab-btn active" data-target="${n}-rendered">Rendered</button>
            <button class="tab-btn" data-target="${n}-raw">Raw JSON</button>
        </div>
    `;if(e)e.innerHTML=i;else{const l=document.createElement("div");l.style.cssText="display: flex; justify-content: flex-end; margin-bottom: 1rem;",l.innerHTML=i,t.insertBefore(l,t.firstChild)}const o=document.getElementById(`${n}-list`),r=document.getElementById(`${n}-json-container`),c=(e||t).querySelectorAll(".tab-btn"),a=t.querySelectorAll(".tab-content");return c.forEach(l=>{l.addEventListener("click",d=>{const p=d.target.getAttribute("data-target");c.forEach(f=>f.classList.remove("active")),d.target.classList.add("active"),a.forEach(f=>{f.classList.remove("active"),f.id===p&&f.classList.add("active")})})}),{listContainer:o,jsonContainer:r,setError:l=>{o&&(o.innerHTML=`<div class="error">${l}</div>`),r&&(r.innerHTML=`<div class="error">${l}</div>`)}}}function $(t,e){const n=e.filename.replace(/[^a-zA-Z0-9]/g,"-");t.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="${e.url}" target="_blank" rel="noopener" style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; color: var(--accent-color); text-decoration: none; opacity: 0.9;" title="Open raw data in new tab">${e.url??""}</a>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                <button class="btn btn-sm" id="btn-copy-${n}">📋 Copy API Response</button>
                <button class="btn btn-sm" id="btn-download-${n}">⬇️ Download JSON</button>
            </div>
        </div>
        <div class="json-view" style="flex: 1; width: 100%; overflow: auto;">${_e(JSON.stringify(e.data,null,2))}</div>
    `;const s=document.getElementById(`btn-copy-${n}`);s&&s.addEventListener("click",async()=>{const o=await V(JSON.stringify(e.data,null,2)),r=s.textContent;s.textContent=o?"✅ Copied!":"❌ Failed",setTimeout(()=>{s.textContent=r},2e3)});const i=document.getElementById(`btn-download-${n}`);i&&i.addEventListener("click",()=>{ke(`${n}.json`,e.data)})}function $e(t,e){const n=_(t,e,"projects","Loading projects...");Promise.all([y.getProjects(),y.getOpenInApps().catch(()=>[])]).then(([s,i])=>{n.listContainer&&(s.length===0?n.listContainer.innerHTML='<div style="color: var(--text-secondary);">No projects found.</div>':(n.listContainer.innerHTML=s.map((o,r)=>{const c=o.source?W(o.source):"",a=`open-in-${r}`,l=`copy-${r}`;return`
                        <div class="list-item">
                            <div style="flex: 1;">
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${o.name||"Unnamed Project"}
                                    ${o.source?`<span class="badge" style="${c}">${o.source}</span>`:""}
                                </div>
                                <div class="list-item-meta" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                    <span style="font-family: 'IBM Plex Mono', monospace;">${o.id}</span>
                                    <button id="${l}" class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.4rem; font-size: 0.7rem;" title="Copy path">📋</button>
                                </div>
                            </div>
                            ${i.length>0?`
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <select id="${a}" class="input" style="width: auto; padding: 0.3rem 0.5rem; font-size: 0.8rem;">
                                        <option value="">Open in...</option>
                                        ${i.filter(d=>d.enabled!==!1).map(d=>`<option value="${d.id}">${d.name}</option>`).join("")}
                                    </select>
                                </div>
                            `:""}
                        </div>
                    `}).join(""),s.forEach((o,r)=>{const c=document.getElementById(`copy-${r}`);c&&c.addEventListener("click",async()=>{const l=await V(o.id),d=c.textContent;c.textContent=l?"✅":"❌",setTimeout(()=>{c&&(c.textContent=d)},2e3)});const a=document.getElementById(`open-in-${r}`);a&&a.addEventListener("change",async()=>{const l=a.value;if(l)try{a.disabled=!0,await y.openIn(l,o.id)}catch(d){console.error("Failed to open in app:",d),alert(`Failed to open: ${d.message||"Unknown error"}`)}finally{a.value="",a.disabled=!1}})}))),n.jsonContainer&&$(n.jsonContainer,{data:s,filename:"projects",url:"/api/v1/projects"})}).catch(s=>{n.setError(`Failed to load projects: ${s.message}`)})}function Te(t,e){const n=_(t,e,"sources","Loading sources...");y.getSources().then(s=>{n.listContainer&&(s.length===0?n.listContainer.innerHTML='<div style="color: var(--text-secondary);">No sources found.</div>':n.listContainer.innerHTML=s.map(i=>{const o=W(i.name||"");return`
                        <div class="list-item">
                            <div>
                                <div class="list-item-title">
                                    ${i.name}
                                </div>
                                <div class="list-item-meta">
                                    Source: <span class="badge" style="${o}">${i.name}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                ${i.can_resume?'<span class="badge" title="This source supports continuous conversation history">Resumable</span>':""}
                                <div class="source-status online">Online</div>
                            </div>
                        </div>
                    `}).join("")),n.jsonContainer&&$(n.jsonContainer,{data:s,filename:"sources",url:"/api/v1/sources"})}).catch(s=>{n.setError(`Failed to load sources: ${s.message}`)})}function k(t){return t===void 0?"—":t.toLocaleString()}function we(t){if(t===void 0)return"—";if(t<60)return`${t}s`;const e=Math.floor(t/3600),n=Math.floor(t%3600/60);return e>0?`${e}h ${n}m`:`${n}m`}function x(t,e,n,s){return`
        <div style="flex: 1; min-width: 150px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 500;">
                <span style="font-size: 1.1rem;">${t}</span> ${e}
            </div>
            <div style="font-size: 1.5rem; font-weight: 600; color: var(--text-primary); font-family: 'Inter', sans-serif;">${n}</div>
            ${s?`<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${s}</div>`:""}
        </div>
    `}function H(t,e){if(t===void 0||e===void 0||e===0)return"";const n=Math.min(100,Math.round(t/e*100));return`
        <div style="margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                <span>${k(t)} / ${k(e)}</span>
                <span>${n}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: 999px; overflow: hidden;">
                <div style="width: ${n}%; height: 100%; background: var(--accent-color); border-radius: 999px;"></div>
            </div>
        </div>
    `}function Se(t,e){t.innerHTML=`
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
  `;const n=document.getElementById("dashboard-connection"),s=document.getElementById("dashboard-stats"),i=document.getElementById("dashboard-indexer");y.getSources().then(()=>{n&&(n.classList.remove("loading"),n.innerHTML='<span class="source-status online">Online</span>')}).catch(o=>{n&&(n.classList.remove("loading"),n.innerHTML=`<span class="source-status offline" title="${o.message}">Offline</span>`)}),y.getStats().then(o=>{if(!s)return;const r=Object.entries(o.tool_usage||{}).sort(([,c],[,a])=>a-c).slice(0,10);s.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${x("💬","Sessions",k(o.total_sessions))}
                    ${x("📁","Projects",k(o.total_projects))}
                    ${x("📝","Entries",k(o.total_entries))}
                    ${x("🪙","Total Tokens",k(o.total_tokens))}
                </div>
                ${r.length>0?`
                    <div style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Top Tools Used</div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${r.map(([c,a])=>{const l=r[0][1],d=Math.round(a/l*100);return`
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace; min-width: 180px; color: var(--text-primary);">${c}</div>
                                    <div style="flex: 1; background: var(--border-color); border-radius: 999px; height: 8px; overflow: hidden;">
                                        <div style="background: var(--accent-color); width: ${d}%; height: 100%; border-radius: 999px;"></div>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary); min-width: 50px; text-align: right;">${k(a)}</div>
                                </div>
                            `}).join("")}
                    </div>
                `:""}
            `}).catch(o=>{s&&(s.innerHTML=`<div class="error">Failed to load stats: ${o.message}</div>`)}),y.getIndexerStatus().then(o=>{if(!i)return;const r=o.running?"var(--success-color)":"var(--text-secondary)",c=o.sync_progress,a=o.embed_progress;i.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${x("🧠","Model",o.model||"—",o.model_dim?`${o.model_dim}d`:void 0)}
                    ${x("⏱","Uptime",we(o.uptime_seconds))}
                    ${x("📡","Watching",o.watching?"Yes":"No")}
                    ${x("⚙️","State","",`<span style="color: ${r}; font-size: 0.9rem; font-weight: 600;">${o.state||(o.running?"Running":"Idle")}</span>`)}
                </div>

                ${c?`
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Sync Progress</div>
                        ${c.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${c.message}</div>`:""}
                        ${H(c.done,c.total)}
                        ${c.project_name?`<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">Project: ${c.project_name}</div>`:""}
                    </div>
                `:""}

                ${a?`
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Embedding Progress</div>
                        ${a.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${a.message}</div>`:""}
                        ${H(a.done,a.total)}
                    </div>
                `:""}

                ${!c&&!a?'<div style="color: var(--text-secondary); font-size: 0.875rem;">No active sync or embedding in progress.</div>':""}
            `}).catch(o=>{i&&(i.innerHTML=`<div style="color: var(--text-secondary);">Indexer status unavailable: ${o.message}</div>`)})}function Ce(t,e){const n=_(t,e,"apps","Loading apps...");y.getOpenInApps().then(s=>{n.listContainer&&(s.length===0?n.listContainer.innerHTML='<div style="color: var(--text-secondary);">No allowed apps found.</div>':n.listContainer.innerHTML=s.map(i=>`
                        <div class="list-item">
                            <div>
                                <div class="list-item-title">${i.name}</div>
                            </div>
                        </div>
                    `).join("")),n.jsonContainer&&$(n.jsonContainer,{data:s,filename:"allowed-apps",url:"/api/v1/open-in/apps"})}).catch(s=>{n.setError(`Failed to load apps: ${s.message}`)})}function g(t){if(!t)return"";const e=[];return t.fg&&e.push(`color: ${t.fg}`),t.bg&&e.push(`background: ${t.bg}`),e.join("; ")}function b(t,e,n){const s=(e==null?void 0:e.fg)||n||"var(--text-secondary)",i=(e==null?void 0:e.bg)||"transparent";return`
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <div style="width: 20px; height: 20px; border-radius: 4px; background: ${s}; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;" title="${s}"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${t}</span>
            ${i!=="transparent"?`<div style="width: 20px; height: 20px; border-radius: 4px; background: ${i}; border: 1px solid rgba(255,255,255,0.1);" title="bg: ${i}"></div>`:""}
        </div>
    `}function Ie(t,e,n){var i,o;const s=e;t.innerHTML=`
        <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;">
            
            <!-- Preview Header -->
            <div style="padding: 0.5rem 0.75rem; background: ${s.border_active||"var(--border-color)"}20; border-bottom: 2px solid ${s.border_active||"var(--border-color)"}; font-size: 0.75rem; color: var(--text-secondary);">
                Preview: ${n} ${s.accent?`<span style="color:${s.accent};">●</span>`:""}
            </div>

            <!-- Simulated conversation -->
            <div style="padding: 0.75rem; background: #0d0d0d; display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- User turn -->
                <div style="${g(s.user_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; border-left: 3px solid ${s.accent||"#aaa"};">
                    <div style="${g(s.user_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        USER
                    </div>
                    <div style="${g(s.text_primary)};">Hello, can you help me?</div>
                </div>

                <!-- Assistant thinking indicator -->
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin: 0.25rem 0;">
                    <div style="${g(s.thinking_label)}; font-size: 0.7rem;">&lt;thinking&gt;</div>
                </div>

                <!-- Tool call -->
                <div style="${g({bg:((i=s.tool_label)==null?void 0:i.bg)||"#1a1a1a"})}; border: 1px dotted ${((o=s.tool_label)==null?void 0:o.fg)||"#444"}; padding: 0.5rem; border-radius: 4px;">
                    <span style="${g(s.tool_label)}; font-size: 0.75rem;">⚙️ runCode(python)</span>
                </div>

                <!-- Assistant turn -->
                <div style="${g(s.assistant_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; margin-top: 0.25rem;">
                    <div style="${g(s.assistant_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        ASSISTANT
                    </div>
                    <div style="${g(s.text_primary)};">
                        I ran the code. The result is <span style="${g(s.text_secondary)};">42</span>.
                    </div>
                    <div style="${g(s.text_muted)}; font-size: 0.75rem; margin-top: 0.25rem;">
                        (Took 0.3s)
                    </div>
                </div>
            </div>

            <!-- Color Swatches Grid -->
            <div style="padding: 0.75rem; border-top: 1px solid var(--border-color); display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1.5rem;">
                ${s.accent?b("accent",{fg:s.accent}):""}
                ${b("user",s.user_label)}
                ${b("assistant",s.assistant_label)}
                ${b("tool",s.tool_label)}
                ${b("thinking",s.thinking_label)}
                ${b("text primary",s.text_primary)}
                ${b("text secondary",s.text_secondary)}
                ${b("text muted",s.text_muted)}
                ${s.border_active?b("border active",{fg:s.border_active}):""}
            </div>
        </div>
    `}function Ee(t,e){const n=_(t,e,"themes","Loading themes...");y.getThemes().then(s=>{const i=(s.themes||[]).sort((o,r)=>o.active&&!r.active?-1:!o.active&&r.active?1:(o.name||"").localeCompare(r.name||""));n.listContainer&&(i.length===0?n.listContainer.innerHTML='<div style="color: var(--text-secondary);">No themes found.</div>':(n.listContainer.innerHTML=`
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
                        `;const l=document.createElement("div");l.id=`theme-preview-${r}`,l.style.display="none",l.style.marginTop="0.5rem";let d=!1;a.addEventListener("click",()=>{const p=l.style.display==="none";l.style.display=p?"block":"none",a.querySelector(".toggle-icon").textContent=p?"▲":"▼",p&&!d&&o.colors&&(Ie(l,o.colors,o.name||"Unnamed"),d=!0)}),c.appendChild(a),c.appendChild(l),n.listContainer.appendChild(c),o.active&&a.click()}))),n.jsonContainer&&$(n.jsonContainer,{data:s,filename:"themes",url:"/api/v1/themes"})}).catch(s=>{n.setError(`Failed to load themes: ${s.message}`)})}const J=document.getElementById("app");if(J){let t=function(o){if(!n||!s)return;const r=document.getElementById("header-controls");switch(r&&(r.innerHTML=""),e.forEach(c=>{var a;c.classList.remove("active"),c.getAttribute("data-view")===o&&(c.classList.add("active"),n.textContent=((a=c.textContent)==null?void 0:a.trim())||o)}),s.innerHTML="",o){case"dashboard":Se(s);break;case"projects":$e(s,r);break;case"sources":Te(s,r);break;case"apps":Ce(s,r);break;case"themes":Ee(s,r);break;default:s.innerHTML=`<div class="error">View "${o}" not implemented yet</div>`}};J.innerHTML=`
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
  `;const e=document.querySelectorAll(".nav-item"),n=document.getElementById("view-title"),s=document.getElementById("view-container"),i=document.getElementById("theme-toggle");localStorage.getItem("theme")==="light"&&document.body.classList.add("light-mode"),i==null||i.addEventListener("click",()=>{document.body.classList.toggle("light-mode");const o=document.body.classList.contains("light-mode");localStorage.setItem("theme",o?"light":"dark")}),e.forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-view");r&&t(r)})}),document.addEventListener("navigate",o=>{t(o.detail)}),t("dashboard")}
