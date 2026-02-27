var se=Object.defineProperty;var ne=(t,e,s)=>e in t?se(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var S=(t,e,s)=>ne(t,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();class w extends Error{constructor(s,n,i,r){super(s);S(this,"line");S(this,"source");S(this,"rawContent");this.line=n,this.source=i,this.rawContent=r,this.name="ParseError"}}function ie(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"system":return"system";case"progress":return"progress";case"summary":return"summary";case"file-history-snapshot":return"checkpoint";case"queue-operation":return"system";default:return"system"}}function oe(t){if(typeof t=="string")return{type:"text",text:t};if(typeof t!="object"||t===null)return null;const e=t;switch(e.type){case"text":return{type:"text",text:e.text??""};case"thinking":return{type:"thinking",thinking:e.thinking??"",signature:e.signature};case"tool_use":return{type:"tool_use",toolUseId:e.id??"",toolName:e.name??"",toolInput:e.input??{}};case"tool_result":return{type:"tool_result",toolUseId:e.tool_use_id??"",toolResult:typeof e.content=="string"?e.content:JSON.stringify(e.content??""),isError:e.is_error===!0};case"image":return e.source?{type:"image",mediaType:e.source.media_type??"image/png",mediaData:e.source.data??""}:null;case"document":return e.source?{type:"document",mediaType:e.source.media_type??"application/pdf",mediaData:e.source.data??""}:null;default:return"text"in e&&typeof e.text=="string"?{type:"text",text:e.text}:null}}function re(t){if(!(t!=null&&t.usage))return;const e=t.usage;return{inputTokens:e.input_tokens??0,outputTokens:e.output_tokens??0,cacheCreationInputTokens:e.cache_creation_input_tokens,cacheReadInputTokens:e.cache_read_input_tokens}}function N(t,e="claude"){var l;const s=ie(t.type),n=[];let i;if(t.message){const a=t.message.content;if(typeof a=="string")i=a,n.push({type:"text",text:a});else if(Array.isArray(a)){for(const d of a){const m=oe(d);m&&n.push(m)}const c=n.filter(d=>d.type==="text");c.length>0&&(i=c.map(d=>d.text).join(`
`))}}t.type==="summary"&&t.summary&&(i=t.summary,n.length===0&&n.push({type:"text",text:t.summary}));let r;t.timestamp?r=new Date(t.timestamp):r=new Date;const o={uuid:t.uuid??`entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,parentUuid:t.parentUuid??void 0,role:s,timestamp:r,source:e,contentBlocks:n,text:i,model:(l=t.message)==null?void 0:l.model,usage:re(t.message),gitBranch:t.gitBranch,cwd:t.cwd,isCheckpoint:t.type==="file-history-snapshot",isSidechain:t.isSidechain,metadata:{}};return t.sessionId&&(o.metadata.sessionId=t.sessionId),t.version&&(o.metadata.version=t.version),t.agentId&&(o.metadata.agentId=t.agentId),t.error&&(o.metadata.error=t.error),t.isApiErrorMessage&&(o.metadata.isApiErrorMessage=t.isApiErrorMessage),t.stopReason&&(o.metadata.stopReason=t.stopReason),t.requestId&&(o.metadata.requestId=t.requestId),t.permissionMode&&(o.metadata.permissionMode=t.permissionMode),t.thinkingMetadata&&(o.metadata.thinkingMetadata=t.thinkingMetadata),t.status&&(o.metadata.progressStatus=t.status),Object.keys(o.metadata).length===0&&delete o.metadata,o}function ae(t,e){const s=[];let n=0;const i=t.split(`
`);for(let r=0;r<i.length;r++){const o=i[r].trim();if(o)try{const l=JSON.parse(o);s.push(l)}catch{{n++;continue}}}return{entries:s,skipped:n}}function ce(t){if(typeof t!="string")return!1;const e=t.trim().split(`
`)[0];if(!e)return!1;try{const s=JSON.parse(e);return typeof s=="object"&&s!==null&&"type"in s&&["user","assistant","system","progress","file-history-snapshot","summary","queue-operation"].includes(s.type)}catch{return!1}}function D(t,e){var v,y;const s=t.filter(u=>u.role==="user"||u.role==="assistant"),n=s[0]??t[0],i=s[s.length-1]??t[t.length-1];let r;if(n&&i){const u=n.timestamp.getTime(),b=i.timestamp.getTime();!isNaN(u)&&!isNaN(b)&&b>u&&(r=b-u)}const o=t.find(u=>u.role==="assistant"&&u.model),l=o==null?void 0:o.model,a={inputTokens:0,outputTokens:0,cacheCreationInputTokens:0,cacheReadInputTokens:0};for(const u of t)u.usage&&(a.inputTokens+=u.usage.inputTokens??0,a.outputTokens+=u.usage.outputTokens??0,a.cacheCreationInputTokens+=u.usage.cacheCreationInputTokens??0,a.cacheReadInputTokens+=u.usage.cacheReadInputTokens??0);const c=(v=n==null?void 0:n.metadata)==null?void 0:v.sessionId,d=t.find(u=>u.role==="user"),m=(y=d==null?void 0:d.text)==null?void 0:y.slice(0,200),f=t.filter(u=>u.role==="summary"&&u.text),h=f.length>0?f[f.length-1].text:void 0;let p=e??"Claude Code Session";return c?p=`Session ${c.slice(0,8)}...`:m&&(p=m.slice(0,50)+(m.length>50?"...":"")),{id:c??`session-${Date.now()}`,title:p,source:"claude",entryCount:t.length,createdAt:n==null?void 0:n.timestamp,modifiedAt:i==null?void 0:i.timestamp,model:l,gitBranch:n==null?void 0:n.gitBranch,projectPath:n==null?void 0:n.cwd,durationMs:r,totalUsage:a,firstPrompt:m,summary:h}}function le(t){return{source:"claude",canParse(e){return ce(e)},parse(e,s){if(typeof e!="string")throw new w("Claude parser expects string content",void 0,"claude");const{entries:n,skipped:i}=ae(e),r=n.map(a=>N(a,"claude")),o=D(r,s),l=[];return i>0&&l.push(`Skipped ${i} invalid JSON line(s)`),{session:{meta:o,entries:r},warnings:l.length>0?l:void 0,skippedCount:i>0?i:void 0}},parseMetadata(e,s){if(typeof e!="string")throw new w("Claude parser expects string content",void 0,"claude");const n=e.split(`
`).filter(l=>l.trim()),i=[...n.slice(0,50),...n.slice(-10)],r=[];for(const l of i)try{const a=JSON.parse(l);r.push(N(a,"claude"))}catch{}const o=D(r,s);return o.entryCount=n.length,o}}}const de=le();function ue(t){if(typeof t!="string")return!1;try{const e=t.split(`
`);for(const s of e){const n=s.trim();if(!n)continue;const i=JSON.parse(n);return typeof i=="object"&&i!==null&&typeof i.role=="string"&&!("uuid"in i)&&!("type"in i)?["user","assistant","tool","system","_checkpoint","_usage"].includes(i.role):!1}return!1}catch{return!1}}function me(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"tool":return"tool";case"system":return"system";case"_checkpoint":return"checkpoint";case"_usage":return"system";default:return"system"}}function H(t){if(t==null)return null;if(typeof t=="string")return{type:"text",text:t};if(typeof t!="object")return null;const e=t;switch(e.type){case"text":return{type:"text",text:e.text??""};case"thinking":case"think":return{type:"thinking",thinking:e.thinking??e.think??"",signature:e.signature};case"tool_result":{let n="";return typeof e.content=="string"?n=e.content:Array.isArray(e.content)&&(n=e.content.filter(i=>typeof i=="object"&&i!==null).map(i=>i.text??"").filter(Boolean).join("")),{type:"tool_result",toolUseId:e.tool_use_id??"",toolResult:n,isError:e.is_error??!1}}default:return"text"in e&&typeof e.text=="string"?{type:"text",text:e.text}:null}}function pe(t,e){const s=t.role;if(!s||s==="_usage")return null;const n={uuid:`L${e}`,role:me(s),timestamp:t.timestamp?new Date(t.timestamp*1e3):new Date,source:"kimi",contentBlocks:[],metadata:{}};if(s==="_checkpoint")return n.isCheckpoint=!0,n;switch(s){case"user":if(typeof t.content=="string")n.text=t.content,n.contentBlocks=[{type:"text",text:t.content}];else if(Array.isArray(t.content)){const i=t.content.map(H).filter(r=>r!==null);n.contentBlocks=i,n.text=z(i)}break;case"assistant":if(Array.isArray(t.content)){const i=t.content.map(H).filter(r=>r!==null);n.contentBlocks=i,n.text=z(i)}if(Array.isArray(t.tool_calls))for(const i of t.tool_calls){let r="",o={};if(i.function){if(r=i.function.name,i.function.arguments)try{o=JSON.parse(i.function.arguments)}catch{o=i.function.arguments}}else r=i.name??"",o=i.input??{};n.contentBlocks.push({type:"tool_use",toolUseId:i.id,toolName:r,toolInput:o})}break;case"tool":{let i="";typeof t.content=="string"?i=t.content:Array.isArray(t.content)&&(i=t.content.filter(r=>typeof r=="object"&&r!==null).map(r=>r.text??"").filter(Boolean).join("")),n.contentBlocks=[{type:"tool_result",toolUseId:t.tool_call_id??"",toolResult:i,isError:!1}];break}case"system":typeof t.content=="string"&&(n.text=t.content,n.contentBlocks=[{type:"text",text:t.content}]);break}return t.usage&&(n.usage={inputTokens:t.usage.input_tokens??0,outputTokens:t.usage.output_tokens??0}),n}function z(t){return t.filter(e=>e.type==="text").map(e=>e.text).filter(Boolean).join(`
`)}function J(t,e={}){const{skipInvalidLines:s=!0}=e,n=t.split(`
`),i=[];let r=0,o=0;for(const l of n){const a=l.trim();if(a){o++;try{const c=JSON.parse(a),d=pe(c,o);d&&i.push(d)}catch(c){if(s)r++;else throw new w(`Invalid JSON on line ${o}: ${c instanceof Error?c.message:String(c)}`)}}}return{entries:i,skipped:r}}function V(t){const e={id:`kimi-${Date.now()}`,title:"Kimi Session",source:"kimi",entryCount:t.length},s=t.find(o=>o.role==="user");s!=null&&s.text&&(e.firstPrompt=s.text.length>50?s.text.slice(0,50)+"...":s.text);const n=t.filter(o=>o.timestamp);if(n.length>=2){const o=n[0].timestamp,l=n[n.length-1].timestamp;e.durationMs=l.getTime()-o.getTime()}let i=0,r=0;for(const o of t)o.usage&&(i+=o.usage.inputTokens,r+=o.usage.outputTokens);return(i>0||r>0)&&(e.totalUsage={inputTokens:i,outputTokens:r}),e}function fe(t={}){return{source:"kimi",canParse(e){return ue(e)},parse(e){if(typeof e!="string")throw new w("Kimi parser expects string content");const{entries:s,skipped:n}=J(e,t),o={session:{meta:V(s),entries:s},warnings:[],skippedCount:n};return n>0&&o.warnings.push(`Skipped ${n} invalid JSON line(s)`),o},parseMetadata(e){if(typeof e!="string")throw new w("Kimi parser expects string content");const{entries:s}=J(e,{...t,skipInvalidLines:!0});return V(s)}}}const ge=fe();function he(t){if(typeof t!="string")return!1;try{const e=JSON.parse(t);return typeof e=="object"&&e!==null&&"sessionId"in e&&Array.isArray(e.messages)}catch{return!1}}function W(t){try{const e=JSON.parse(t),s=[];for(const i of e.messages){const r=i.timestamp?new Date(i.timestamp):new Date;if(i.type==="user")s.push({uuid:i.id??`msg-${Date.now()}-${Math.random()}`,role:"user",source:"gemini",timestamp:r,text:i.content,contentBlocks:i.content?[{type:"text",text:i.content}]:[]});else if(i.type==="gemini"){const o=[];if(i.thoughts)for(const a of i.thoughts)o.push({type:"thinking",thinking:`[${a.subject}] ${a.description}`});if(i.content&&o.push({type:"text",text:i.content}),i.toolCalls)for(const a of i.toolCalls)o.push({type:"tool_use",toolUseId:a.id,toolName:a.name,toolInput:a.args});const l=i.tokens?{inputTokens:i.tokens.input,outputTokens:i.tokens.output,thinkingTokens:i.tokens.thoughts,serverToolUse:i.tokens.tool}:void 0;if(s.push({uuid:i.id??`msg-${Date.now()}-${Math.random()}`,role:"assistant",source:"gemini",timestamp:r,model:i.model,usage:l,contentBlocks:o,text:i.content}),i.toolCalls){for(const a of i.toolCalls)if(a.result)for(const c of a.result){let d="";const m=c.functionResponse.response;if(m&&"output"in m){const f=m.output;d=typeof f=="string"?f:JSON.stringify(f)}else d=JSON.stringify(m);s.push({uuid:c.functionResponse.id??`res-${Date.now()}-${Math.random()}`,role:"tool",source:"gemini",timestamp:r,contentBlocks:[{type:"tool_result",toolUseId:a.id,toolResult:d,isError:!1}]})}}}}return{session:{meta:ye(e,s),entries:s}}}catch(e){throw new w(`Failed to parse Gemini JSON: ${e instanceof Error?e.message:String(e)}`,void 0,"gemini")}}function ye(t,e){const s=e.find(l=>l.role==="user"),n=s==null?void 0:s.text;let i=0,r=0;for(const l of e)l.usage&&(i+=l.usage.inputTokens,r+=l.usage.outputTokens);const o=t.startTime&&t.lastUpdated?new Date(t.lastUpdated).getTime()-new Date(t.startTime).getTime():void 0;return{id:t.sessionId,source:"gemini",title:n?n.slice(0,50)+(n.length>50?"...":""):"Gemini Session",entryCount:e.length,createdAt:t.startTime?new Date(t.startTime):void 0,modifiedAt:t.lastUpdated?new Date(t.lastUpdated):void 0,durationMs:o,totalUsage:{inputTokens:i,outputTokens:r},firstPrompt:n==null?void 0:n.slice(0,200)}}function ve(t){return{source:"gemini",canParse(e){return he(e)},parse(e){if(typeof e!="string")throw new w("Gemini parser expects string content");return W(e)},parseMetadata(e){if(typeof e!="string")throw new w("Gemini parser expects string content");return W(e).session.meta}}}const be=ve();class xe{constructor(){S(this,"parsers",new Map);this.register(de),this.register(ge),this.register(be)}register(e){this.parsers.set(e.source,e)}unregister(e){this.parsers.delete(e)}get(e){return this.parsers.get(e)}getSources(){return[...this.parsers.keys()]}canParse(e){for(const s of this.parsers.values())if(s.canParse(e))return!0;return!1}detect(e){for(const s of this.parsers.values())if(s.canParse(e))return s}parse(e,s){const n=this.detect(e);if(!n)throw new w("No parser found for content format");return n.parse(e,s)}parseMetadata(e,s){const n=this.detect(e);if(!n)throw new w("No parser found for content format");return n.parseMetadata?n.parseMetadata(e,s):n.parse(e,s).session.meta}}new xe;class q extends Error{constructor(s,n,i){super(s);S(this,"statusCode");S(this,"response");this.statusCode=n,this.response=i,this.name="ThinktAPIError"}}class F extends Error{constructor(s,n){super(s);S(this,"originalError");this.originalError=n,this.name="ThinktNetworkError"}}const ke={baseUrl:"http://localhost:8784",apiVersion:"/api/v1",timeout:3e4};function g(t,e,s,n){let i=`${t}${e}${s}`;if(n&&Object.keys(n).length>0){const r=new URLSearchParams;for(const[l,a]of Object.entries(n))a!=null&&r.append(l,String(a));const o=r.toString();o&&(i+=`?${o}`)}return i}class $e{constructor(e){S(this,"config");this.config={...ke,...e}}setConfig(e){this.config={...this.config,...e}}getConfig(){return{...this.config}}async fetchWithTimeout(e,s={},n){const i=new AbortController,r=setTimeout(()=>i.abort(),this.config.timeout),o=n?AbortSignal.any([i.signal,n]):i.signal,l=this.config.fetch??fetch;try{const a={};this.config.token&&(a.Authorization=`Bearer ${this.config.token}`);const c=await l(e,{...s,signal:o,headers:{Accept:"application/json",...a,...s.headers}});if(clearTimeout(r),!c.ok){let d;try{d=await c.json()}catch{}throw new q((d==null?void 0:d.message)||`HTTP ${c.status}: ${c.statusText}`,c.status,d)}return await c.json()}catch(a){throw clearTimeout(r),a instanceof q?a:a instanceof Error&&a.name==="AbortError"?n!=null&&n.aborted?a:new F(`Request timeout after ${this.config.timeout}ms`,a):new F(a instanceof Error?a.message:"Network error",a)}}async getSources(){const e=g(this.config.baseUrl,this.config.apiVersion,"/sources");return(await this.fetchWithTimeout(e)).sources??[]}async getProjects(e,s){const n=g(this.config.baseUrl,this.config.apiVersion,"/projects",{source:e,include_deleted:s!=null&&s.includeDeleted?"true":void 0});return(await this.fetchWithTimeout(n,{},s==null?void 0:s.signal)).projects??[]}async getSessions(e,s,n){const i=encodeURIComponent(e),r=s==null?void 0:s.trim().toLowerCase(),o=r?`/projects/${encodeURIComponent(r)}/${i}/sessions`:`/projects/${i}/sessions`,l=g(this.config.baseUrl,this.config.apiVersion,o);return(await this.fetchWithTimeout(l,{},n)).sessions??[]}async getSession(e,s){const n=encodeURIComponent(e),i=g(this.config.baseUrl,this.config.apiVersion,`/sessions/${n}`,{limit:s==null?void 0:s.limit,offset:s==null?void 0:s.offset}),r=await this.fetchWithTimeout(i,{},s==null?void 0:s.signal);return{meta:r.meta,entries:r.entries??[],total:r.total??0,has_more:r.has_more??!1}}async getSessionMetadata(e,s){const n=encodeURIComponent(e),i={limit:s==null?void 0:s.limit,offset:s==null?void 0:s.offset,sort_by:s==null?void 0:s.sortBy};s!=null&&s.excludeRoles&&s.excludeRoles.length>0&&(i.exclude_roles=s.excludeRoles.join(",")),(s==null?void 0:s.summaryOnly)!==void 0&&(i.summary_only=s.summaryOnly?"true":"false");const r=g(this.config.baseUrl,this.config.apiVersion,`/sessions/${n}/metadata`,i);return await this.fetchWithTimeout(r)}async openIn(e,s){const n=g(this.config.baseUrl,this.config.apiVersion,"/open-in"),i=await this.fetchWithTimeout(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({app:e,path:s})});if(i.error)throw new Error(i.error)}async getOpenInApps(){const e=g(this.config.baseUrl,this.config.apiVersion,"/open-in/apps");return await this.fetchWithTimeout(e)}async search(e){const s={q:e.query,project:e.project,source:e.source,limit:e.limit,limit_per_session:e.limitPerSession};e.caseSensitive&&(s.case_sensitive="true"),e.regex&&(s.regex="true");const n=g(this.config.baseUrl,this.config.apiVersion,"/search",s);return await this.fetchWithTimeout(n,{},e.signal)}async semanticSearch(e){const s={q:e.query,project:e.project,source:e.source,limit:e.limit,max_distance:e.maxDistance};e.diversity&&(s.diversity="true");const n=g(this.config.baseUrl,this.config.apiVersion,"/semantic-search",s);return await this.fetchWithTimeout(n,{},e.signal)}async getResumeCommand(e){const s=encodeURIComponent(e),n=g(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}/resume`);return await this.fetchWithTimeout(n)}async execResumeSession(e){const s=encodeURIComponent(e),n=g(this.config.baseUrl,this.config.apiVersion,`/sessions/${s}/resume`);return await this.fetchWithTimeout(n,{method:"POST"})}async getIndexerHealth(){const e=g(this.config.baseUrl,this.config.apiVersion,"/indexer/health");return await this.fetchWithTimeout(e)}async getIndexerStatus(){const e=g(this.config.baseUrl,this.config.apiVersion,"/indexer/status");return await this.fetchWithTimeout(e)}async getInfo(){const e=g(this.config.baseUrl,this.config.apiVersion,"/info");return await this.fetchWithTimeout(e)}async getStats(){const e=g(this.config.baseUrl,this.config.apiVersion,"/stats");return await this.fetchWithTimeout(e)}async getTeams(){const e=g(this.config.baseUrl,this.config.apiVersion,"/teams");return(await this.fetchWithTimeout(e)).teams??[]}async getTeam(e){const s=encodeURIComponent(e),n=g(this.config.baseUrl,this.config.apiVersion,`/teams/${s}`);return await this.fetchWithTimeout(n)}async getTeamMemberMessages(e,s){const n=encodeURIComponent(e),i=encodeURIComponent(s),r=g(this.config.baseUrl,this.config.apiVersion,`/teams/${n}/members/${i}/messages`);return(await this.fetchWithTimeout(r)).messages??[]}async getTeamTasks(e){const s=encodeURIComponent(e),n=g(this.config.baseUrl,this.config.apiVersion,`/teams/${s}/tasks`);return(await this.fetchWithTimeout(n)).tasks??[]}async getThemes(){const e=g(this.config.baseUrl,this.config.apiVersion,"/themes");return await this.fetchWithTimeout(e)}async*streamSessionEntries(e,s=100,n){let i=0,r=!0;for(;r;){const o=await this.getSession(e,{limit:s,offset:i,signal:n});for(const l of o.entries)yield l;if(r=o.has_more,i+=o.entries.length,o.entries.length===0)break}}async getAllSessionEntries(e,s=100,n){const i=[];for await(const r of this.streamSessionEntries(e,s,n))i.push(r);return i}}function O(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}function _e(t){switch(t){case"user":return"user";case"assistant":return"assistant";case"tool":return"tool";case"system":return"system";case"summary":return"summary";case"progress":return"progress";case"checkpoint":return"checkpoint";default:return"assistant"}}function Te(t){switch(t.type??"text"){case"text":return{type:"text",text:t.text??""};case"thinking":return{type:"thinking",thinking:t.thinking??"",signature:t.signature};case"tool_use":return{type:"tool_use",toolUseId:t.tool_use_id??"",toolName:t.tool_name??"unknown",toolInput:t.tool_input??{}};case"tool_result":return{type:"tool_result",toolUseId:t.tool_use_id??"",toolResult:t.tool_result??"",isError:t.is_error??!1};case"image":return{type:"image",mediaType:t.media_type??"image/png",mediaData:t.media_data??""};case"document":return{type:"document",mediaType:t.media_type??"application/pdf",mediaData:t.media_data??"",filename:void 0};default:return{type:"text",text:t.text??""}}}function Se(t){return{id:t.id??"",name:t.name??"",path:t.path??"",displayPath:t.display_path,sessionCount:t.session_count??0,lastModified:t.last_modified?new Date(t.last_modified):void 0,source:O(t.source),workspaceId:t.workspace_id,sourceBasePath:t.source_base_path,pathExists:t.path_exists??!0}}function G(t){return{id:t.id??"unknown",projectPath:t.project_path,fullPath:t.full_path,firstPrompt:t.first_prompt,summary:t.summary,entryCount:t.entry_count??0,fileSize:t.file_size,createdAt:t.created_at?new Date(t.created_at):void 0,modifiedAt:t.modified_at?new Date(t.modified_at):void 0,gitBranch:t.git_branch,model:t.model,source:O(t.source),workspaceId:t.workspace_id,chunkCount:t.chunk_count,title:t.first_prompt?t.first_prompt.slice(0,60)+(t.first_prompt.length>60?"...":""):t.id??"Untitled Session"}}function K(t){var n;const e=((n=t.content_blocks)==null?void 0:n.map(Te))??[],s={};return t.metadata&&Object.assign(s,t.metadata),t.workspace_id&&(s.workspaceId=t.workspace_id),{uuid:t.uuid??`entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,parentUuid:t.parent_uuid??void 0,role:_e(t.role),timestamp:t.timestamp?new Date(t.timestamp):new Date,source:O(t.source),contentBlocks:e,text:t.text??e.filter(i=>i.type==="text").map(i=>i.text).join(`
`),model:t.model,usage:t.usage?{inputTokens:t.usage.input_tokens??0,outputTokens:t.usage.output_tokens??0,cacheCreationInputTokens:t.usage.cache_creation_input_tokens,cacheReadInputTokens:t.usage.cache_read_input_tokens}:void 0,gitBranch:t.git_branch,cwd:t.cwd,isCheckpoint:t.is_checkpoint??!1,isSidechain:t.is_sidechain??!1,agentId:t.agent_id,sourceAgentId:t.source_agent_id,metadata:Object.keys(s).length>0?s:void 0}}function we(t){return t==="thinkt"?"thinkt":t==="codex"?"codex":t==="copilot"?"copilot":t==="kimi"?"kimi":t==="gemini"?"gemini":t==="qwen"?"qwen":"claude"}class Ce{constructor(e){S(this,"_api");this._api=new $e(e)}get api(){return this._api}setConfig(e){this._api.setConfig(e)}getConfig(){return this._api.getConfig()}async getSources(){return this._api.getSources()}async getProjects(e,s){return(await this._api.getProjects(e,s)).map(Se)}async getSessions(e,s,n){return(await this._api.getSessions(e,s,n)).map(G)}async getSession(e,s){const n=await this._api.getSession(e,s);return{meta:G(n.meta),entries:n.entries.map(K),total:n.total,hasMore:n.has_more}}async getSessionMetadata(e,s){const n=await this._api.getSessionMetadata(e,s),i=n.meta;return{meta:{id:(i==null?void 0:i.id)??"unknown",fullPath:i==null?void 0:i.path,entryCount:n.total_entries??0,createdAt:i!=null&&i.created_at?new Date(i.created_at):void 0,modifiedAt:i!=null&&i.modified_at?new Date(i.modified_at):void 0,gitBranch:i==null?void 0:i.git_branch,model:i==null?void 0:i.model,source:we(i==null?void 0:i.source),title:(i==null?void 0:i.id)??"Session Metadata"},description:n.description,roleCounts:n.role_counts??{},entrySummary:(n.entry_summary??[]).map(o=>({index:o.index,role:o.role,timestamp:o.timestamp,contentLength:o.content_length,hasThinking:o.has_thinking,hasToolUse:o.has_tool_use,hasToolResult:o.has_tool_result,preview:o.preview})),totalEntries:n.total_entries??0,totalContentBytes:n.total_content_bytes??0,returnedSummaries:n.returned_summaries??0}}async openIn(e,s){return this._api.openIn(e,s)}async getOpenInApps(){return this._api.getOpenInApps()}async search(e){return this._api.search(e)}async semanticSearch(e){return this._api.semanticSearch(e)}async getResumeCommand(e){return this._api.getResumeCommand(e)}async execResumeSession(e){return this._api.execResumeSession(e)}async getIndexerHealth(){return this._api.getIndexerHealth()}async getIndexerStatus(){return this._api.getIndexerStatus()}async getInfo(){return this._api.getInfo()}async getStats(){return this._api.getStats()}async getTeams(){return this._api.getTeams()}async getTeam(e){return this._api.getTeam(e)}async getTeamMemberMessages(e,s){return this._api.getTeamMemberMessages(e,s)}async getTeamTasks(e){return this._api.getTeamTasks(e)}async getThemes(){return this._api.getThemes()}async*streamSessionEntries(e,s,n){for await(const i of this._api.streamSessionEntries(e,s,n))yield K(i)}async getAllSessionEntries(e,s,n){const i=[];for await(const r of this.streamSessionEntries(e,s,n))i.push(r);return i}}let R=null;function Ie(){return R||(R=new Ce),R}const k=Ie();function Me(){const t=window.location.hash;if(!t)return;const s=new URLSearchParams(t.slice(1)).get("token")??void 0;return s&&window.history.replaceState(null,"",window.location.pathname),s}const Z=Me();k.setConfig({baseUrl:"",...Z?{token:Z}:{}});function Ee(t,e){const s=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(s),i=document.createElement("a");i.href=n,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)}function Le(t){return t=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,function(e){let s="json-number";return/^"/.test(e)?/:$/.test(e)?s="json-key":s="json-string":/true|false/.test(e)?s="json-boolean":/null/.test(e)&&(s="json-null"),'<span class="'+s+'">'+e+"</span>"})}async function X(t){try{return await navigator.clipboard.writeText(t),!0}catch(e){return console.error("Failed to copy to clipboard",e),!1}}function ee(t){const e=t.toLowerCase();return["claude","kimi","gemini","codex","copilot","qwen"].includes(e)?`color: var(--source-${e}-color); background: var(--source-${e}-bg); border: 1px solid var(--source-${e}-color);`:"color: var(--text-secondary); background: var(--border-color);"}function B(t,e,s,n="Loading..."){t.innerHTML=`
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
    `;if(e)e.innerHTML=i;else{const c=document.createElement("div");c.style.cssText="display: flex; justify-content: flex-end; margin-bottom: 1rem;",c.innerHTML=i,t.insertBefore(c,t.firstChild)}const r=document.getElementById(`${s}-list`),o=document.getElementById(`${s}-json-container`),l=(e||t).querySelectorAll(".tab-btn"),a=t.querySelectorAll(".tab-content");return l.forEach(c=>{c.addEventListener("click",d=>{const m=d.target.getAttribute("data-target");l.forEach(f=>f.classList.remove("active")),d.target.classList.add("active"),a.forEach(f=>{f.classList.remove("active"),f.id===m&&f.classList.add("active")})})}),{listContainer:r,jsonContainer:o,setError:c=>{r&&(r.innerHTML=`<div class="error">${c}</div>`),o&&(o.innerHTML=`<div class="error">${c}</div>`)}}}function U(t,e){const s=e.filename.replace(/[^a-zA-Z0-9]/g,"-");t.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="${e.url}" target="_blank" rel="noopener" style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; color: var(--accent-color); text-decoration: none; opacity: 0.9;" title="Open raw data in new tab">${e.url??""}</a>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                <button class="btn btn-sm" id="btn-copy-${s}">📋 Copy API Response</button>
                <button class="btn btn-sm" id="btn-download-${s}">⬇️ Download JSON</button>
            </div>
        </div>
        <div class="json-view" style="flex: 1; width: 100%; overflow: auto;">${Le(JSON.stringify(e.data,null,2))}</div>
    `;const n=document.getElementById(`btn-copy-${s}`);n&&n.addEventListener("click",async()=>{const r=await X(JSON.stringify(e.data,null,2)),o=n.textContent;n.textContent=r?"✅ Copied!":"❌ Failed",setTimeout(()=>{n.textContent=o},2e3)});const i=document.getElementById(`btn-download-${s}`);i&&i.addEventListener("click",()=>{Ee(`${s}.json`,e.data)})}function je(t){const e=new Map;for(const s of t){const n=s.displayPath||s.path||s.id||"",i=`${s.name||""}\0${n}`,r=s.lastModified?new Date(s.lastModified).getTime():0,o=e.get(i);o?(s.source&&!o.sources.includes(s.source)&&o.sources.push(s.source),r>0&&(o.lastModifiedMin=o.lastModifiedMin===0?r:Math.min(o.lastModifiedMin,r),o.lastModifiedMax=Math.max(o.lastModifiedMax,r))):e.set(i,{name:s.name||"",id:s.id||"",path:n,sources:s.source?[s.source]:[],lastModifiedMin:r,lastModifiedMax:r})}return Array.from(e.values())}function Pe(t,e){const s=B(t,e,"projects","Loading projects...");if(e){const r=document.createElement("div");r.className="sort-controls",r.innerHTML=`
            <div class="sort-group">
                <button class="sort-btn" data-sort-field="name" title="Sort by name">Name</button>
                <button class="sort-btn active" data-sort-field="time" title="Sort by time">Time</button>
            </div>
            <button class="sort-btn sort-dir-btn" data-sort-dir="desc" title="Toggle sort direction">↓</button>
        `,e.insertBefore(r,e.firstChild)}let n="time",i="desc";Promise.all([k.getProjects(),k.getOpenInApps().catch(()=>({apps:[]})),k.getSources().catch(()=>[])]).then(([r,o,l])=>{const a=je(r),c=o.apps||[],d=new Set;for(const h of l)if(h.can_resume||h.canResume){const p=h.name||h.id||"";p&&d.add(p)}function m(h){const p=[...h];return p.sort((v,y)=>{let u;if(n==="name")u=v.name.localeCompare(y.name,void 0,{sensitivity:"base"});else{const b=i==="asc"?v.lastModifiedMin:v.lastModifiedMax,$=i==="asc"?y.lastModifiedMin:y.lastModifiedMax;u=b-$}return i==="asc"?u:-u}),p}function f(){if(!s.listContainer)return;const h=m(a);if(h.length===0){s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No projects found.</div>';return}s.listContainer.innerHTML=h.map((p,v)=>{const y=`copy-${v}`,u=`open-in-${v}`,b=p.sources.map(x=>`<span class="badge" style="${ee(x)}">${x}</span>`).join(""),$=p.lastModifiedMax,M=$>0?new Date($).toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"}):"",E=p.sources.filter(x=>d.has(x)),P=E.length>0?"<option disabled>──────────</option>"+E.map(x=>`<option value="resume:${x}">Resume (${x})</option>`).join(""):"",j=c.filter(x=>x.enabled!==!1),A=j.length>0||E.length>0;return`
                    <div class="list-item">
                        <div style="flex: 1;">
                            <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                ${p.name||"Unnamed Project"}
                                ${b}
                            </div>
                            <div class="list-item-meta" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                <span style="font-family: 'IBM Plex Mono', monospace;">${p.path}</span>
                                <button id="${y}" class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.4rem; font-size: 0.7rem;" title="Copy path">📋</button>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            ${M?`<span style="opacity: 0.5; font-size: 0.75rem; white-space: nowrap;">${M}</span>`:""}
                            ${A?`
                                <select id="${u}" class="input">
                                    <option value="">Open in...</option>
                                    ${j.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}
                                    ${P}
                                </select>
                            `:""}
                        </div>
                    </div>
                `}).join(""),h.forEach((p,v)=>{const y=document.getElementById(`copy-${v}`);y&&y.addEventListener("click",async()=>{const b=await X(p.path),$=y.textContent;y.textContent=b?"✅":"❌",setTimeout(()=>{y&&(y.textContent=$)},2e3)});const u=document.getElementById(`open-in-${v}`);u&&u.addEventListener("change",async()=>{const b=u.value;if(b)try{if(u.disabled=!0,b.startsWith("resume:")){const $=b.slice(7),M=await k.getSessions(p.id,$);if(M.length===0){alert(`No sessions found for ${$} in this project.`);return}M.sort((j,A)=>{const x=j.modifiedAt?new Date(j.modifiedAt).getTime():0;return(A.modifiedAt?new Date(A.modifiedAt).getTime():0)-x});const E=M[0],P=E.fullPath||E.full_path||"";if(!P){alert("Could not determine session path for resume.");return}await k.execResumeSession(P)}else await k.openIn(b,p.path)}catch($){console.error("Action failed:",$),alert(`Failed: ${$.message||"Unknown error"}`)}finally{u.value="",u.disabled=!1}})})}if(e){const h=e.querySelectorAll("[data-sort-field]"),p=e.querySelector("[data-sort-dir]");h.forEach(v=>{v.addEventListener("click",()=>{n=v.getAttribute("data-sort-field"),h.forEach(y=>y.classList.remove("active")),v.classList.add("active"),f()})}),p&&p.addEventListener("click",()=>{i=i==="asc"?"desc":"asc",p.textContent=i==="asc"?"↑":"↓",p.setAttribute("data-sort-dir",i),f()})}f(),s.jsonContainer&&U(s.jsonContainer,{data:r,filename:"projects",url:"/api/v1/projects"})}).catch(r=>{s.setError(`Failed to load projects: ${r.message}`)})}function Ae(t,e){const s=B(t,e,"sources","Loading sources...");k.getSources().then(n=>{s.listContainer&&(n.length===0?s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No sources found.</div>':s.listContainer.innerHTML=n.map(i=>`
                        <div class="list-item">
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span class="badge" style="${ee(i.name||"")}">${i.name}</span>
                                </div>
                                <div class="list-item-meta">${i.base_path||""}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                ${i.can_resume?'<span class="badge" title="This source supports continuous conversation history">Resumable</span>':""}
                                <div class="source-status online">Online</div>
                            </div>
                        </div>
                    `).join("")),s.jsonContainer&&U(s.jsonContainer,{data:n,filename:"sources",url:"/api/v1/sources"})}).catch(n=>{s.setError(`Failed to load sources: ${n.message}`)})}function I(t){return t===void 0?"—":t.toLocaleString()}function Y(t){if(t===void 0)return"—";if(t<60)return`${t}s`;const e=Math.floor(t/3600),s=Math.floor(t%3600/60);return e>0?`${e}h ${s}m`:`${s}m`}function _(t,e,s,n,i="1"){return`
        <div style="flex: ${i}; min-width: 150px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 500;">
                <span style="font-size: 1.1rem;">${t}</span> ${e}
            </div>
            <div style="font-size: 1.5rem; font-weight: 600; color: var(--text-primary); font-family: 'Inter', sans-serif;">${s}</div>
            ${n?`<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${n}</div>`:""}
        </div>
    `}function L(t,e,s){if(e===void 0||s===void 0||s<=0)return"";const n=Math.min(100,Math.round(e/s*100));return`
        <div style="margin-top: 0.75rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                <span style="font-weight: 500;">${t}</span>
                <span>${I(e)} / ${I(s)} &nbsp; ${n}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: 999px; overflow: hidden;">
                <div style="width: ${n}%; height: 100%; background: var(--accent-color); border-radius: 999px;"></div>
            </div>
        </div>
    `}function Be(t,e){t.innerHTML=`
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

    <!-- Server Info -->
    <div class="panel">
      <h2><span class="icon">🖥️</span> Server Information</h2>
      <div id="dashboard-server-info" class="loading">Loading server info…</div>
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
  `;const s=document.getElementById("dashboard-connection"),n=document.getElementById("dashboard-stats"),i=document.getElementById("dashboard-server-info"),r=document.getElementById("dashboard-indexer");k.getSources().then(()=>{s&&(s.classList.remove("loading"),s.innerHTML='<span class="source-status online">Online</span>')}).catch(o=>{s&&(s.classList.remove("loading"),s.innerHTML=`<span class="source-status offline" title="${o.message}">Offline</span>`)}),k.getStats().then(o=>{if(!n)return;const l=(o.top_tools||[]).sort((a,c)=>(c.count||0)-(a.count||0)).slice(0,10);n.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${_("💬","Sessions",I(o.total_sessions))}
                    ${_("📁","Projects",I(o.total_projects))}
                    ${_("📝","Entries",I(o.total_entries))}
                    ${_("🪙","Total Tokens",I(o.total_tokens))}
                </div>
                ${l.length>0?`
                    <div style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Top Tools Used</div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${l.map((a,c)=>{const d=l[0].count||1,m=Math.round((a.count||0)/d*100);return`
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace; min-width: 180px; color: var(--text-primary);">${a.name}</div>
                                    <div style="flex: 1; background: var(--border-color); border-radius: 999px; height: 8px; overflow: hidden;">
                                        <div style="background: var(--accent-color); width: ${m}%; height: 100%; border-radius: 999px;"></div>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary); min-width: 50px; text-align: right;">${I(a.count)}</div>
                                </div>
                            `}).join("")}
                    </div>
                `:""}
            `}).catch(o=>{n&&(n.innerHTML=`<div class="error">Failed to load stats: ${o.message}</div>`)}),k.getInfo().then(o=>{i&&(i.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${_("🏷️","Version",o.version||"—",o.revision?`<span style="font-family: 'IBM Plex Mono', monospace;">${o.revision.substring(0,7)}</span>`:void 0,"2")}
                    ${_("⏱","Uptime",Y(o.uptime_seconds))}
                    ${_("🔑","Auth",o.authenticated?"Enabled":"Disabled")}
                    ${_("⚙️","PID",o.pid||"—")}
                </div>
            `)}).catch(o=>{i&&(i.innerHTML=`<div style="color: var(--text-secondary);">Server info unavailable: ${o.message}</div>`)}),k.getIndexerStatus().then(o=>{if(!r)return;const l=o.running?"var(--success-color)":"var(--text-secondary)",a=o.sync_progress,c=o.embed_progress,d=L("Projects",a==null?void 0:a.project,a==null?void 0:a.project_total),m=L("Sessions",a==null?void 0:a.done,a==null?void 0:a.total),f=L("Sessions",c==null?void 0:c.done,c==null?void 0:c.total),h=L("Chunks",c==null?void 0:c.chunks_done,c==null?void 0:c.chunks_total);r.innerHTML=`
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    ${_("🧠","Model",o.model||"—",o.model_dim?`${o.model_dim}d`:void 0,"2")}
                    ${_("⏱","Uptime",Y(o.uptime_seconds))}
                    ${_("📡","Watching",o.watching?"Yes":"No")}
                    ${_("⚙️","State","",`<span style="color: ${l}; font-size: 0.9rem; font-weight: 600;">${o.state||(o.running?"Running":"Idle")}</span>`)}
                </div>

                ${a?`
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Sync Progress</div>
                        ${a.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${a.message}</div>`:""}
                        ${d||m?`${d}${m}`:L("Sessions",a.done,a.total)}
                        ${a.project_name?`<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Project: ${a.project_name}</div>`:""}
                    </div>
                `:""}

                ${c?`
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Embedding Progress</div>
                        ${c.message?`<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${c.message}</div>`:""}
                        ${f||h?`${f}${h}`:L("Sessions",c.done,c.total)}
                    </div>
                `:""}

                ${!a&&!c?'<div style="color: var(--text-secondary); font-size: 0.875rem;">No active sync or embedding in progress.</div>':""}
            `}).catch(o=>{r&&(r.innerHTML=`<div style="color: var(--text-secondary);">Indexer status unavailable: ${o.message}</div>`)})}function Ue(t,e){const s=B(t,e,"apps","Loading apps...");k.getOpenInApps().then(n=>{const i=n.apps||[],r=n.default_terminal;if(s.listContainer)if(i.length===0){s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No apps configured.</div>';return}else s.listContainer.innerHTML=i.map(o=>{const l=[];if(o.terminal){const a=o.id===r;l.push('<span class="badge" style="background: rgba(20, 184, 166, 0.12); border: 1px solid rgba(20, 184, 166, 0.35); color: #2dd4bf;" title="Terminal App">terminal</span>'),a&&l.push('<span class="badge" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24;" title="Default Terminal">★ default</span>')}return`
                        <div class="list-item">
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${o.name}
                                    ${l.join("")}
                                </div>
                                <div class="list-item-meta">${o.id} · ${o.enabled!==!1?"enabled":"disabled"}</div>
                            </div>
                        </div>
                    `}).join("");s.jsonContainer&&U(s.jsonContainer,{data:n,filename:"allowed-apps",url:"/api/v1/open-in/apps"})}).catch(n=>{s.setError(`Failed to load apps: ${n.message}`)})}function T(t){if(!t)return"";const e=[];return t.fg&&e.push(`color: ${t.fg}`),t.bg&&e.push(`background: ${t.bg}`),e.join("; ")}function C(t,e,s){const n=(e==null?void 0:e.fg)||s||"var(--text-secondary)",i=(e==null?void 0:e.bg)||"transparent";return`
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <div style="width: 20px; height: 20px; border-radius: 4px; background: ${n}; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;" title="${n}"></div>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${t}</span>
            ${i!=="transparent"?`<div style="width: 20px; height: 20px; border-radius: 4px; background: ${i}; border: 1px solid rgba(255,255,255,0.1);" title="bg: ${i}"></div>`:""}
        </div>
    `}function Re(t,e,s){var i,r;const n=e;t.innerHTML=`
        <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;">
            
            <!-- Preview Header -->
            <div style="padding: 0.5rem 0.75rem; background: ${n.border_active||"var(--border-color)"}20; border-bottom: 2px solid ${n.border_active||"var(--border-color)"}; font-size: 0.75rem; color: var(--text-secondary);">
                Preview: ${s} ${n.accent?`<span style="color:${n.accent};">●</span>`:""}
            </div>

            <!-- Simulated conversation -->
            <div style="padding: 0.75rem; background: #0d0d0d; display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- User turn -->
                <div style="${T(n.user_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; border-left: 3px solid ${n.accent||"#aaa"};">
                    <div style="${T(n.user_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        USER
                    </div>
                    <div style="${T(n.text_primary)};">Hello, can you help me?</div>
                </div>

                <!-- Assistant thinking indicator -->
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin: 0.25rem 0;">
                    <div style="${T(n.thinking_label)}; font-size: 0.7rem;">&lt;thinking&gt;</div>
                </div>

                <!-- Tool call -->
                <div style="${T({bg:((i=n.tool_label)==null?void 0:i.bg)||"#1a1a1a"})}; border: 1px dotted ${((r=n.tool_label)==null?void 0:r.fg)||"#444"}; padding: 0.5rem; border-radius: 4px;">
                    <span style="${T(n.tool_label)}; font-size: 0.75rem;">⚙️ runCode(python)</span>
                </div>

                <!-- Assistant turn -->
                <div style="${T(n.assistant_block)}; padding: 0.5rem 0.75rem; border-radius: 6px; margin-top: 0.25rem;">
                    <div style="${T(n.assistant_label)}; font-size: 0.7rem; margin-bottom: 0.25rem; font-weight: 600;">
                        ASSISTANT
                    </div>
                    <div style="${T(n.text_primary)};">
                        I ran the code. The result is <span style="${T(n.text_secondary)};">42</span>.
                    </div>
                    <div style="${T(n.text_muted)}; font-size: 0.75rem; margin-top: 0.25rem;">
                        (Took 0.3s)
                    </div>
                </div>
            </div>

            <!-- Color Swatches Grid -->
            <div style="padding: 0.75rem; border-top: 1px solid var(--border-color); display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1.5rem;">
                ${n.accent?C("accent",{fg:n.accent}):""}
                ${C("user",n.user_label)}
                ${C("assistant",n.assistant_label)}
                ${C("tool",n.tool_label)}
                ${C("thinking",n.thinking_label)}
                ${C("text primary",n.text_primary)}
                ${C("text secondary",n.text_secondary)}
                ${C("text muted",n.text_muted)}
                ${n.border_active?C("border active",{fg:n.border_active}):""}
            </div>
        </div>
    `}function Oe(t,e){const s=B(t,e,"themes","Loading themes...");k.getThemes().then(n=>{const i=(n.themes||[]).sort((r,o)=>r.active&&!o.active?-1:!r.active&&o.active?1:(r.name||"").localeCompare(o.name||""));s.listContainer&&(i.length===0?s.listContainer.innerHTML='<div style="color: var(--text-secondary);">No themes found.</div>':(s.listContainer.innerHTML=`
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                            Preview the available themes from the connected Thinkt API.
                        </p>
                    `,i.forEach((r,o)=>{const l=document.createElement("div");l.style.marginBottom="0.75rem";const a=document.createElement("div");a.className="list-item",a.style.cursor="pointer",a.style.background="var(--bg-color)",a.style.borderRadius="6px",a.style.border="1px solid var(--border-color)",a.innerHTML=`
                            <div>
                                <div class="list-item-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${r.name||"Unnamed"}
                                    ${r.active?'<span class="badge success">Active</span>':""}
                                    ${r.embedded?'<span class="badge">Built-in</span>':""}
                                </div>
                                ${r.description?`<div class="list-item-meta">${r.description}</div>`:""}
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">
                                <span class="toggle-icon">▼</span>
                            </div>
                        `;const c=document.createElement("div");c.id=`theme-preview-${o}`,c.style.display="none",c.style.marginTop="0.5rem";let d=!1;a.addEventListener("click",()=>{const m=c.style.display==="none";c.style.display=m?"block":"none",a.querySelector(".toggle-icon").textContent=m?"▲":"▼",m&&!d&&r.colors&&(Re(c,r.colors,r.name||"Unnamed"),d=!0)}),l.appendChild(a),l.appendChild(c),s.listContainer.appendChild(l),r.active&&a.click()}))),s.jsonContainer&&U(s.jsonContainer,{data:n,filename:"themes",url:"/api/v1/themes"})}).catch(n=>{s.setError(`Failed to load themes: ${n.message}`)})}const Q=document.getElementById("app");if(Q){let t=function(r){if(!s||!n)return;const o=document.getElementById("header-controls");switch(o&&(o.innerHTML=""),e.forEach(l=>{var a;l.classList.remove("active"),l.getAttribute("data-view")===r&&(l.classList.add("active"),s.textContent=((a=l.textContent)==null?void 0:a.trim())||r)}),n.innerHTML="",r){case"dashboard":Be(n);break;case"projects":Pe(n,o);break;case"sources":Ae(n,o);break;case"apps":Ue(n,o);break;case"themes":Oe(n,o);break;default:n.innerHTML=`<div class="error">View "${r}" not implemented yet</div>`}};Q.innerHTML=`
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
  `;const e=document.querySelectorAll(".nav-item"),s=document.getElementById("view-title"),n=document.getElementById("view-container"),i=document.getElementById("theme-toggle");localStorage.getItem("theme")==="light"&&document.body.classList.add("light-mode"),i==null||i.addEventListener("click",()=>{document.body.classList.toggle("light-mode");const r=document.body.classList.contains("light-mode");localStorage.setItem("theme",r?"light":"dark")}),e.forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-view");o&&t(o)})}),document.addEventListener("navigate",r=>{t(r.detail)}),t("dashboard")}
