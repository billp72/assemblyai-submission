(()=>{"use strict";const e={cache:"no-store"};let t="";"undefined"!=typeof navigator&&navigator.userAgent&&(t+=navigator.userAgent);const s={sdk:{name:"JavaScript",version:"4.8.0"}};"undefined"!=typeof process&&(process.versions.node&&-1===t.indexOf("Node")&&(s.runtime_env={name:"Node",version:process.versions.node}),process.versions.bun&&-1===t.indexOf("Bun")&&(s.runtime_env={name:"Bun",version:process.versions.bun})),"undefined"!=typeof Deno&&process.versions.bun&&-1===t.indexOf("Deno")&&(s.runtime_env={name:"Deno",version:Deno.version.deno});class r{constructor(e){var r;this.params=e,!1===e.userAgent?this.userAgent=void 0:this.userAgent=(r=e.userAgent||{},t+(!1===r?"":" AssemblyAI/1.0 ("+Object.entries({...s,...r}).map((([e,t])=>t?`${e}=${t.name}/${t.version}`:"")).join(" ")+")"))}async fetch(t,s){s={...e,...s};let r={Authorization:this.params.apiKey,"Content-Type":"application/json"};e?.headers&&(r={...r,...e.headers}),s?.headers&&(r={...r,...s.headers}),this.userAgent&&(r["User-Agent"]=this.userAgent,"undefined"!=typeof window&&"chrome"in window&&(r["AssemblyAI-Agent"]=this.userAgent)),s.headers=r,t.startsWith("http")||(t=this.params.baseUrl+t);const n=await fetch(t,s);if(n.status>=400){let e;const t=await n.text();if(t){try{e=JSON.parse(t)}catch{}if(e?.error)throw new Error(e.error);throw new Error(t)}throw new Error(`HTTP Error: ${n.status} ${n.statusText}`)}return n}async fetchJson(e,t){return(await this.fetch(e,t)).json()}}class n extends r{summary(e){return this.fetchJson("/lemur/v3/generate/summary",{method:"POST",body:JSON.stringify(e)})}questionAnswer(e){return this.fetchJson("/lemur/v3/generate/question-answer",{method:"POST",body:JSON.stringify(e)})}actionItems(e){return this.fetchJson("/lemur/v3/generate/action-items",{method:"POST",body:JSON.stringify(e)})}task(e){return this.fetchJson("/lemur/v3/generate/task",{method:"POST",body:JSON.stringify(e)})}getResponse(e){return this.fetchJson(`/lemur/v3/${e}`)}purgeRequestData(e){return this.fetchJson(`/lemur/v3/${e}`,{method:"DELETE"})}}const{WritableStream:i}="undefined"!=typeof window?window:"undefined"!=typeof global?global:globalThis,a=WebSocket??global?.WebSocket??window?.WebSocket??self?.WebSocket,o=(e,t)=>t?new a(e,t):new a(e),c=4e3,l=4001,d=4002,h=4003,p=4004,u=4008,m=4010,f=4029,g=4030,y=4031,w=4032,b=4033,S=4034,k=4100,v=4101,T=4102,A=4103,x=1013,J=4104,O={[c]:"Sample rate must be a positive integer",[l]:"Not Authorized",[d]:"Insufficient funds",[h]:"This feature is paid-only and requires you to add a credit card. Please visit https://app.assemblyai.com/ to add a credit card to your account.",[p]:"Session ID does not exist",[u]:"Session has expired",[m]:"Session is closed",[f]:"Rate limited",[g]:"Unique session violation",[y]:"Session Timeout",[w]:"Audio too short",[b]:"Audio too long",[S]:"Audio too small to transcode",[k]:"Bad JSON",[v]:"Bad schema",[T]:"Too many streams",[A]:"This session has been reconnected. This WebSocket is no longer valid.",[x]:"Reconnect attempts exhausted",[J]:"Could not parse word boost parameter"};class U extends Error{}const E='{"terminate_session":true}';class _{constructor(e){if(this.listeners={},this.realtimeUrl=e.realtimeUrl??"wss://api.assemblyai.com/v2/realtime/ws",this.sampleRate=e.sampleRate??16e3,this.wordBoost=e.wordBoost,this.encoding=e.encoding,this.endUtteranceSilenceThreshold=e.endUtteranceSilenceThreshold,this.disablePartialTranscripts=e.disablePartialTranscripts,"token"in e&&e.token&&(this.token=e.token),"apiKey"in e&&e.apiKey&&(this.apiKey=e.apiKey),!this.token&&!this.apiKey)throw new Error("API key or temporary token is required.")}connectionUrl(){const e=new URL(this.realtimeUrl);if("wss:"!==e.protocol)throw new Error("Invalid protocol, must be wss");const t=new URLSearchParams;return this.token&&t.set("token",this.token),t.set("sample_rate",this.sampleRate.toString()),this.wordBoost&&this.wordBoost.length>0&&t.set("word_boost",JSON.stringify(this.wordBoost)),this.encoding&&t.set("encoding",this.encoding),t.set("enable_extra_session_information","true"),this.disablePartialTranscripts&&t.set("disable_partial_transcripts",this.disablePartialTranscripts.toString()),e.search=t.toString(),e}on(e,t){this.listeners[e]=t}connect(){return new Promise((e=>{if(this.socket)throw new Error("Already connected");const t=this.connectionUrl();this.token?this.socket=o(t.toString()):(console.warn("API key authentication is not supported for the RealtimeTranscriber in browser environment. Use temporary token authentication instead.\nLearn more at https://github.com/AssemblyAI/assemblyai-node-sdk/blob/main/docs/compat.md#browser-compatibility."),this.socket=o(t.toString(),{headers:{Authorization:this.apiKey}})),this.socket.binaryType="arraybuffer",this.socket.onopen=()=>{void 0!==this.endUtteranceSilenceThreshold&&null!==this.endUtteranceSilenceThreshold&&this.configureEndUtteranceSilenceThreshold(this.endUtteranceSilenceThreshold)},this.socket.onclose=({code:e,reason:t})=>{t||e in O&&(t=O[e]),this.listeners.close?.(e,t)},this.socket.onerror=e=>{e.error?this.listeners.error?.(e.error):this.listeners.error?.(new Error(e.message))},this.socket.onmessage=({data:t})=>{const s=JSON.parse(t.toString());if("error"in s)this.listeners.error?.(new U(s.error));else switch(s.message_type){case"SessionBegins":{const t={sessionId:s.session_id,expiresAt:new Date(s.expires_at)};e(t),this.listeners.open?.(t);break}case"PartialTranscript":s.created=new Date(s.created),this.listeners.transcript?.(s),this.listeners["transcript.partial"]?.(s);break;case"FinalTranscript":s.created=new Date(s.created),this.listeners.transcript?.(s),this.listeners["transcript.final"]?.(s);break;case"SessionInformation":this.listeners.session_information?.(s);break;case"SessionTerminated":this.sessionTerminatedResolve?.()}}}))}sendAudio(e){this.send(e)}stream(){return new i({write:e=>{this.sendAudio(e)}})}forceEndUtterance(){this.send('{"force_end_utterance":true}')}configureEndUtteranceSilenceThreshold(e){this.send(`{"end_utterance_silence_threshold":${e}}`)}send(e){if(!this.socket||this.socket.readyState!==this.socket.OPEN)throw new Error("Socket is not open for communication");this.socket.send(e)}async close(e=!0){if(this.socket){if(this.socket.readyState===this.socket.OPEN)if(e){const e=new Promise((e=>{this.sessionTerminatedResolve=e}));this.socket.send(E),await e}else this.socket.send(E);this.socket?.removeAllListeners&&this.socket.removeAllListeners(),this.socket.close()}this.listeners={},this.socket=void 0}}class P extends r{constructor(e){super(e),this.rtFactoryParams=e}createService(e){return this.transcriber(e)}transcriber(e){const t={...e};return t.token||t.apiKey||(t.apiKey=this.rtFactoryParams.apiKey),new _(t)}async createTemporaryToken(e){return(await this.fetchJson("/v2/realtime/token",{method:"POST",body:JSON.stringify(e)})).token}}function $(e){return e.startsWith("http")||e.startsWith("https")||e.startsWith("data:")?null:e.startsWith("file://")?e.substring(7):e.startsWith("file:")?e.substring(5):e}class N extends r{constructor(e,t){super(e),this.files=t}async transcribe(e,t){const s=await this.submit(e);return await this.waitUntilReady(s.id,t)}async submit(e){let t,s;if("audio"in e){const{audio:r,...n}=e;if("string"==typeof r){const e=$(r);t=null!==e?await this.files.upload(e):r.startsWith("data:")?await this.files.upload(r):r}else t=await this.files.upload(r);s={...n,audio_url:t}}else s=e;return await this.fetchJson("/v2/transcript",{method:"POST",body:JSON.stringify(s)})}async create(e,t){const s=$(e.audio_url);if(null!==s){const t=await this.files.upload(s);e.audio_url=t}const r=await this.fetchJson("/v2/transcript",{method:"POST",body:JSON.stringify(e)});return t?.poll??1?await this.waitUntilReady(r.id,t):r}async waitUntilReady(e,t){const s=t?.pollingInterval??3e3,r=t?.pollingTimeout??-1,n=Date.now();for(;;){const t=await this.get(e);if("completed"===t.status||"error"===t.status)return t;if(r>0&&Date.now()-n>r)throw new Error("Polling timeout");await new Promise((e=>setTimeout(e,s)))}}get(e){return this.fetchJson(`/v2/transcript/${e}`)}async list(e){let t="/v2/transcript";"string"==typeof e?t=e:e&&(t=`${t}?${new URLSearchParams(Object.keys(e).map((t=>[t,e[t]?.toString()||""])))}`);const s=await this.fetchJson(t);for(const e of s.transcripts)e.created=new Date(e.created),e.completed&&(e.completed=new Date(e.completed));return s}delete(e){return this.fetchJson(`/v2/transcript/${e}`,{method:"DELETE"})}wordSearch(e,t){const s=new URLSearchParams({words:t.join(",")});return this.fetchJson(`/v2/transcript/${e}/word-search?${s.toString()}`)}sentences(e){return this.fetchJson(`/v2/transcript/${e}/sentences`)}paragraphs(e){return this.fetchJson(`/v2/transcript/${e}/paragraphs`)}async subtitles(e,t="srt",s){let r=`/v2/transcript/${e}/${t}`;if(s){const e=new URLSearchParams;e.set("chars_per_caption",s.toString()),r+=`?${e.toString()}`}const n=await this.fetch(r);return await n.text()}redactions(e){return this.redactedAudio(e)}redactedAudio(e){return this.fetchJson(`/v2/transcript/${e}/redacted-audio`)}async redactedAudioFile(e){const{redacted_audio_url:t,status:s}=await this.redactedAudio(e);if("redacted_audio_ready"!==s)throw new Error(`Redacted audio status is ${s}`);const r=await fetch(t);if(!r.ok)throw new Error(`Failed to fetch redacted audio: ${r.statusText}`);return{arrayBuffer:r.arrayBuffer.bind(r),blob:r.blob.bind(r),body:r.body,bodyUsed:r.bodyUsed}}}class I extends r{async upload(e){let t;return t="string"==typeof e?e.startsWith("data:")?function(e){const t=e.split(","),s=t[0].match(/:(.*?);/)[1],r=atob(t[1]);let n=r.length;const i=new Uint8Array(n);for(;n--;)i[n]=r.charCodeAt(n);return new Blob([i],{type:s})}(e):await async function(){throw new Error("Interacting with the file system is not supported in this environment.")}():e,(await this.fetchJson("/v2/upload",{method:"POST",body:t,headers:{"Content-Type":"application/octet-stream"},duplex:"half"})).upload_url}}const C=new class{constructor(e){e.baseUrl=e.baseUrl||"https://api.assemblyai.com",e.baseUrl&&e.baseUrl.endsWith("/")&&(e.baseUrl=e.baseUrl.slice(0,-1)),this.files=new I(e),this.transcripts=new N(e,this.files),this.lemur=new n(e),this.realtime=new P(e)}}({apiKey:"6410a0f10abd474d9c98d6e2b0439e99"}),R={audio:"https://assembly.ai/wildfires.mp3",speaker_labels:!0};let B,D=localStorage.getItem("transcript");const L=document.getElementById("text"),W=document.createElement("div"),K=document.createElement("div");W.setAttribute("aria-label","loading spinner"),W.setAttribute("tabindex","1"),K.setAttribute("tabindex","1"),K.classList.add("loader"),W.classList.add("outterLoader");let j=localStorage.getItem("current_page");W.appendChild(K),L.appendChild(W);const q=document.getElementById("btn"),H=document.createElement("span"),F=document.createElement("button");H.style.backgroundColor="#DCDCDC",H.style.padding="12px 15px 15px 15px",H.style.fontSize="20px",H.textContent=j?`page ${j}`:"page 1",H.setAttribute("tabindex","2"),F.setAttribute("tabindex","2"),F.setAttribute("aria-label","next page button"),F.style.width="80px",F.style.height="50px",F.style.backgroundColor="#6082B6",F.style.border="2px solid #7393B3",F.style.color="white";let z=j?parseInt(j):1;F.addEventListener("click",(()=>{let e,t=localStorage.getItem("pages");if(t){let s=JSON.parse(t);e={start:s.finish,finish:s.finish+8}}else e={start:8,finish:16};let s=JSON.parse(localStorage.getItem("transcript"));s.length>e.start?(localStorage.setItem("pages",JSON.stringify(e)),L.innerHTML="",L.appendChild(W)):(localStorage.setItem("pages",JSON.stringify({start:0,finish:8})),L.innerHTML="",L.appendChild(W)),z++;const r=s.length<e.start?z=1:z;H.textContent=`page ${r}`,M(z)}));let G=document.createTextNode("NEXT");async function M(e=0){B||(B=await C.transcripts.transcribe(R)),"error"===B.status&&(console.error(`Transcription failed: ${B.error}`),process.exit(1));let t=JSON.parse(D);if(t?.length>0||B?.utterances?.length>0){localStorage.setItem("transcript",JSON.stringify(B.utterances));let s=t||B.utterances,r="";L.removeChild(W);let n="",i=0;const a=await(async e=>{let t=localStorage.getItem("pages"),s=t?JSON.parse(t):{start:0,finish:8};return[...e].slice(s.start,s.finish)})(s);localStorage.setItem("clipped",JSON.stringify(a));for(let t of a){let s=e||1;n="A"===t.speaker?"Host":"Guest",r+=`<div aria-label="conversation text"><p tabindex="1" style=${"A"===t.speaker?"color:#808080;":"color:#7393B3;"}>\n          ${"Guest"===n?'<a tabindex="1" style="color:black;" href=https://fierce-everglades-96194-97a0bfd171b5.herokuapp.com/focuspage?paragraph='+i+"&page="+s+">Guest</a>:":'<span style="color:black">Host</span>:'}\n            ${t.text}\n        </p></div>`,i+=1}L.innerHTML=r,0===e&&(q.appendChild(F),q.appendChild(H))}}F.appendChild(G),M()})();