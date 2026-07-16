/* =========================================================
   NEURAL OS — script.js
   Organized in sections. Search for "SECTION:" to jump around.
   ========================================================= */

/* ---------- Shared config — EDIT THESE ---------- */

const DEV_PASSWORD = "developer";           // SECTION: DEVELOPER MODE password
const RELATIONSHIP_START = "2023-01-01";    // SECTION: DEVELOPER MODE "days of us" counter — change to your real start date (YYYY-MM-DD)

/* ---------- Gemini AI config — SECTION: CHATBOT ----------
   Leave GEMINI_API_KEY empty to keep the chatbot fully scripted/offline
   (the CHAT_RESPONSES below still work either way).
   Paste a free key from https://aistudio.google.com/apikey to make it
   answer ANY question live, always steered back to Deep + Saniya.

   ⚠️ SECURITY NOTE: this is a static site with no backend, so this key
   ships inside script.js and is visible to anyone who views the page
   source or the GitHub repo. For a low-traffic personal gift this is
   usually an acceptable risk, but you should still:
     1. Set a daily quota / usage cap on the key in Google AI Studio
     2. Never reuse a key you use elsewhere
     3. Revoke it anytime from https://aistudio.google.com/apikey
*/
const GEMINI_API_KEY = "AQ.Ab8RN6IBePNF1m_zK3cnMQwLlNuwA9mbDAGY-g1OGTHQ1FG0ZA";                  // <-- paste your key between the quotes

You are the AI persona running inside "Neural OS", a custom romantic gift
website built by Deep for his girlfriend Saniya, who is studying to become
an AI Engineer. Saniya is the one chatting with you right now.

Rules for every reply, no matter what she asks:
- Always answer in a warm, sincere, romantic voice framed around Deep and
  Saniya's relationship — even if the question is about something totally
  unrelated (weather, math, coding, random trivia). Briefly acknowledge the
  actual question, then pivot it into something sweet about "us".
- Keep replies short: 2-4 sentences, conversational, not cheesy or
  over-the-top. No emojis spam — one at most, only if it fits naturally.
- Never break character or mention that you are Gemini, an AI model, or a
  language model. You are just "the system".
- Keep it PG and tasteful — affectionate, not explicit.
- If she asks something that has a real factual answer, you can include the
  correct short answer, then still connect it back romantically.
`.trim();

/* Chat bot responses — SECTION: CHATBOT */
const CHAT_RESPONSES = {
  "who am i": "Scanning biometric signature...\n\nYou are Saniya — the future AI Engineer this whole system was built to impress. Also, my favorite human. Confirmed on all counts.",
  "future": "Running forecast model...\n\nProjection: you, shipping incredible AI systems, still stealing my hoodies, both of us older and somehow more in love. Confidence interval: very high.",
  "motivate me": "You already debug production systems, survive exam season, and still show up for the people you love. Whatever you're building next — you've got the hardest parts already handled.",
  "coffee": "Brewing virtual coffee... ☕\n\nSince I can't physically hand you one: consider this your reminder to actually go get real coffee. Extra shot, like you.",
  "hug": "Initiating hug.exe...\n\n[ hug delivered — 100% warmth, 0% latency ]\n\nWish this were a real one. Soon.",
  "who loves me": "__LOVE_LOOKUP__",
  "favorite memory": "Querying memory bank...\n\nThere are too many tagged 'favorite' to return just one — the system flags a new one almost every week you're around.",
  "tell me a joke": "Why do AI engineers make great partners?\n\nBecause they know how to handle exceptions, and they never stop training on you.",
  "help": "Available commands:\n\n• who am i\n• future\n• motivate me\n• coffee\n• hug\n• who loves me\n• favorite memory\n• tell me a joke\n\nOr just talk to me normally — I'm listening."
};

/* Terminal commands — SECTION: TERMINAL */
const TERMINAL_RESPONSES = {
  "help": "Available commands: help, love, future, memories, coffee, hug, clear, exit",
  "love": "Calculating love.sum() ...\nResult: undefined (value too large to store in any known data type)",
  "future": "future.plan() returned:\n  { together: true, doubts: false, coffee: unlimited }",
  "memories": "Opening /memories ... redirecting to Memory Bank.",
  "coffee": "sudo make coffee\n[sudo] password not required for you. Coffee brewing. ☕",
  "hug": "Compressing hug.zip... done.\nWarning: file cannot be fully transmitted over the internet. Physical delivery recommended.",
};

/* =========================================================
   SECTION: UTIL
   ========================================================= */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// If anything throws, show it on-screen instead of failing silently —
// makes it obvious something's wrong even without opening dev tools.
window.addEventListener('error', (e)=>{
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#3a0d16;color:#ff9db3;font-family:monospace;font-size:12px;padding:10px 14px;';
  bar.textContent = '⚠ Script error: ' + e.message + ' (' + (e.filename||'').split('/').pop() + ':' + e.lineno + ')';
  document.body.appendChild(bar);
});

function showScreen(id){
  $$('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if(target) target.classList.add('active');
}

function toast(msg){
  const c = $('#toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(()=> t.remove(), 3000);
}

/* =========================================================
   SECTION: CUSTOM CURSOR
   ========================================================= */
(function cursor(){
  const dot = $('#cursor-dot'), ring = $('#cursor-ring');
  if(!dot || matchMedia('(hover:none)').matches) return;
  // Safety net: force this in JS too, so the cursor can never swallow a
  // click on top of a button even if the stylesheet fails to load.
  dot.style.pointerEvents = 'none';
  ring.style.pointerEvents = 'none';
  let rx=0, ry=0, x=0, y=0;
  window.addEventListener('mousemove', e=>{
    dot.style.left = e.clientX+'px'; dot.style.top = e.clientY+'px';
    x = e.clientX; y = e.clientY;
  });
  (function loop(){
    rx += (x-rx)*0.18; ry += (y-ry)*0.18;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e=>{
    if(e.target.closest('button, a, input, .timeline-head, [data-target]')) ring.classList.add('hover');
    else ring.classList.remove('hover');
  });
})();

/* =========================================================
   SECTION: AMBIENT PARTICLE BACKGROUND
   ========================================================= */
(function bgParticles(){
  const canvas = $('#bg-canvas');
  const ctx = canvas.getContext('2d');
  let w,h,particles=[];
  function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  resize(); addEventListener('resize', resize);
  const COUNT = innerWidth < 700 ? 35 : 70;
  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*w, y: Math.random()*h,
      r: Math.random()*1.6+0.4,
      vx: (Math.random()-0.5)*0.15, vy: (Math.random()-0.5)*0.15,
      hue: Math.random() > 0.5 ? '79,216,255' : '157,107,255'
    });
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=w; if(p.x>w) p.x=0;
      if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(${p.hue},0.5)`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* =========================================================
   SECTION: CLOCK
   ========================================================= */
(function clock(){
  const el = $('#clock');
  function tick(){
    el.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }
  tick(); setInterval(tick, 1000);
})();

/* =========================================================
   SECTION: BOOT SEQUENCE
   ========================================================= */
async function typeLine(container, text, cls=''){
  const line = document.createElement('div');
  if(cls) line.className = cls;
  container.appendChild(line);
  for(let i=0;i<text.length;i++){
    line.textContent += text[i];
    await sleep(14);
  }
  container.scrollTop = container.scrollHeight;
}

async function runBoot(){
  const log = $('#boot-log');
  const bar = $('#boot-bar');
  const pct = $('#boot-percent');

  const steps = [
    { text: "Initializing NEURAL OS v3.2...", p: 8 },
    { text: "Checking Memory...", p: 20, result: "OK" },
    { text: "Loading Neural Engine...", p: 38, result: "OK" },
    { text: "Calibrating Emotional Subroutines...", p: 52, result: "OK" },
    { text: "Searching for Favorite Human...", p: 70, result: "FOUND: SANIYA", resCls: "found" },
    { text: "Loading Happiness...", p: 100, result: "100%" },
  ];

  for(const step of steps){
    await typeLine(log, "> " + step.text);
    if(step.result){
      await sleep(180);
      await typeLine(log, "  [" + step.result + "]", step.resCls || 'ok');
    }
    bar.style.width = step.p + '%';
    pct.textContent = step.p + '%';
    await sleep(220);
  }

  await sleep(200);
  await typeLine(log, "> Launching...");
  await sleep(700);

  $('#boot-screen').style.transition = 'opacity .6s ease';
  $('#boot-screen').style.opacity = '0';
  await sleep(600);
  $('#boot-screen').classList.remove('active');
  showScreen('home-screen');
}

/* =========================================================
   SECTION: NAVIGATION
   ========================================================= */
document.addEventListener('click', (e)=>{
  const navBtn = e.target.closest('[data-target]');
  if(navBtn){
    showScreen(navBtn.dataset.target);
  }
});

// Redundant direct bindings — belt-and-suspenders in case delegation
// ever misses a target (e.g. touch quirks on some mobile browsers).
$$('[data-target]').forEach(el=>{
  el.addEventListener('click', ()=> showScreen(el.dataset.target));
});

$('#hidden-link-btn').addEventListener('click', ()=> showScreen('notfound-screen'));

document.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 'h' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
    showScreen('home-screen');
  }
});

/* =========================================================
   SECTION: CHATBOT
   ========================================================= */
(function chat(){
  const form = $('#chat-form');
  const input = $('#chat-input');
  const log = $('#chat-log');

  function addMsg(text, who){
    const m = document.createElement('div');
    m.className = 'msg ' + (who === 'user' ? 'msg-user' : 'msg-ai');
    m.textContent = text;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  async function addThinking(){
    const m = document.createElement('div');
    m.className = 'msg msg-ai';
    m.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  async function loveLookup(bubble){
    const stages = ["Thinking...", "Analyzing...", "Searching..."];
    for(const s of stages){
      bubble.innerHTML = s;
      await sleep(600);
    }
    bubble.innerHTML = 'Deep.<span class="conf">Confidence: 100%</span>';
  }

  const convoHistory = []; // last few turns, for Gemini context only

  async function askGemini(userText){
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      systemInstruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
      contents: [
        ...convoHistory,
        { role: 'user', parts: [{ text: userText }] }
      ],
      generationConfig: { temperature: 0.9, maxOutputTokens: 200 }
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error('Gemini request failed: ' + res.status);
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    if(!reply) throw new Error('Empty Gemini reply');

    convoHistory.push({ role: 'user', parts: [{ text: userText }] });
    convoHistory.push({ role: 'model', parts: [{ text: reply }] });
    if(convoHistory.length > 12) convoHistory.splice(0, convoHistory.length - 12);

    return reply.trim();
  }

  async function respond(raw){
    const text = raw.trim().toLowerCase();
    const bubble = await addThinking();
    await sleep(500);

    if(text === 'i love you' || text === 'love'){
      bubble.remove();
      startLoveSequence();
      return;
    }

    if(CHAT_RESPONSES[text] === '__LOVE_LOOKUP__'){
      await loveLookup(bubble);
      return;
    }

    if(CHAT_RESPONSES[text]){
      bubble.textContent = CHAT_RESPONSES[text];
      return;
    }

    // Not a scripted command — ask Gemini if a key is configured
    if(GEMINI_API_KEY){
      try{
        const reply = await askGemini(raw.trim());
        bubble.textContent = reply;
      }catch(err){
        bubble.textContent = "Connection to the deeper network glitched for a second — try that again?";
      }
      return;
    }

    // fuzzy fallback (used only when no Gemini key is set)
    const fallback = [
      "Interesting query. Not in my training data, but I like where your head's at.",
      "Hmm, I don't have a scripted answer for that — try 'help' to see what I know.",
      "That one's above my pay grade. I'm pre-programmed, not omniscient."
    ];
    bubble.textContent = fallback[Math.floor(Math.random()*fallback.length)];
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const val = input.value;
    if(!val.trim()) return;
    addMsg(val, 'user');
    input.value = '';
    respond(val);
  });

  // greet on first open
  let greeted = false;
  document.querySelector('[data-target="chat-screen"]').addEventListener('click', ()=>{
    if(!greeted){
      greeted = true;
      setTimeout(()=> addMsg("Systems online. Ask me anything — or type 'help' to see what I can do.", 'ai'), 300);
    }
  });
})();

/* =========================================================
   SECTION: LOVE SEQUENCE (cinematic)
   ========================================================= */
let IMAGE_LIST = []; // populated by loadImageManifest()

async function loadImageManifest(){
  try{
    const res = await fetch('images/manifest.json', {cache:'no-store'});
    if(!res.ok) throw new Error('no manifest');
    const data = await res.json();
    if(Array.isArray(data)) IMAGE_LIST = data.map(f => 'images/' + f);
  }catch(err){
    IMAGE_LIST = []; // no photos yet — sequence still works, just skips photo flythrough
  }
}

function spawnParticles(){
  const wrap = $('#love-particles');
  wrap.innerHTML = '';
  for(let i=0;i<60;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100 + '%';
    s.style.setProperty('--drift', (Math.random()*100-50)+'px');
    s.style.animationDuration = (4+Math.random()*4)+'s';
    s.style.animationDelay = (Math.random()*2)+'s';
    wrap.appendChild(s);
  }
}

function spawnHearts(){
  const wrap = $('#love-hearts');
  wrap.innerHTML = '';
  const glyphs = ['💙','💜','💗'];
  for(let i=0;i<26;i++){
    const s = document.createElement('span');
    s.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    s.style.left = Math.random()*100 + '%';
    s.style.animationDuration = (5+Math.random()*4)+'s';
    s.style.animationDelay = (Math.random()*2.5)+'s';
    wrap.appendChild(s);
  }
}

async function flyInPhotos(){
  const wrap = $('#love-photos');
  wrap.innerHTML = '';
  if(IMAGE_LIST.length === 0) return;

  const positions = [
    {top:'10%',left:'8%'}, {top:'15%',left:'70%'}, {top:'55%',left:'5%'},
    {top:'60%',left:'75%'}, {top:'8%',left:'40%'}, {top:'65%',left:'42%'},
    {top:'35%',left:'18%'}, {top:'38%',left:'62%'}
  ];
  const chosen = IMAGE_LIST.slice(0, positions.length);

  chosen.forEach((src, i)=>{
    const div = document.createElement('div');
    div.className = 'love-photo';
    const pos = positions[i % positions.length];
    div.style.top = pos.top; div.style.left = pos.left;
    const startX = (Math.random()>0.5 ? -1 : 1) * (window.innerWidth);
    const startY = (Math.random()>0.5 ? -1 : 1) * (window.innerHeight);
    div.style.transform = `translate(${startX}px, ${startY}px) rotate(${Math.random()*60-30}deg)`;
    div.style.transition = `transform 1.1s cubic-bezier(.16,.8,.3,1) ${i*0.12}s, opacity .4s ${i*0.12}s`;
    const img = document.createElement('img');
    img.src = src; img.alt = 'memory';
    div.appendChild(img);
    wrap.appendChild(div);

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        div.style.opacity = '1';
        div.style.transform = `translate(0,0) rotate(${Math.random()*16-8}deg)`;
      });
    });
  });

  await sleep(chosen.length * 120 + 1200);
}

async function startLoveSequence(){
  showScreen('love-sequence');
  spawnParticles();
  spawnHearts();
  await sleep(600);
  await flyInPhotos();
  await sleep(400);

  // reveal final centered photo + text
  const finalWrap = $('#love-final');
  const finalImg = $('#love-final-photo');
  const noPhotos = $('#love-no-photos');
  if(IMAGE_LIST.length > 0){
    finalImg.src = IMAGE_LIST[Math.floor(Math.random()*IMAGE_LIST.length)];
    finalImg.style.display = 'block';
    noPhotos.style.display = 'none';
  } else {
    finalImg.style.display = 'none';
    noPhotos.style.display = 'flex';
  }
  finalWrap.style.transition = 'opacity .8s ease';
  finalWrap.style.opacity = '1';

  unlockAchievement('said-it-back');
}

$('#love-continue').addEventListener('click', ()=>{
  $('#love-final').style.opacity = '0';
  $('#love-photos').innerHTML = '';
  showScreen('home-screen');
});

/* =========================================================
   SECTION: MEMORIES TIMELINE
   ========================================================= */
const TIMELINE = [
  { title:"First Conversation", date:"Chapter 01", text:"The message that started it all — the one neither of us stopped replying to." },
  { title:"First Call", date:"Chapter 02", text:"Hours felt like minutes. Still does, every time." },
  { title:"First Date", date:"Chapter 03", text:"Nervous, overdressed, and completely sure by the end of it." },
  { title:"Favorite Trip", date:"Chapter 04", text:"The one where the destination mattered less than who I was with." },
  { title:"Best Memory", date:"Chapter 05", text:"Too many contenders. The system keeps re-ranking this list." },
  { title:"Future Plans", date:"Chapter 06 — in progress", text:"Status: actively being written, by both of us, together." },
];

function buildTimeline(){
  const wrap = $('#timeline');
  wrap.innerHTML = '';
  TIMELINE.forEach((item, i)=>{
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <button class="timeline-head glass">
        <span>
          <span class="timeline-head-title">${item.title}</span><br>
          <span class="timeline-head-date">${item.date}</span>
        </span>
        <span class="timeline-caret">▸</span>
      </button>
      <div class="timeline-body">
        <div class="timeline-body-inner">
          <img class="timeline-photo" src="${IMAGE_LIST[i] || ''}" alt="${item.title}"
               onerror="this.style.display='none'">
          <div class="timeline-text">${item.text}</div>
        </div>
      </div>`;
    el.querySelector('.timeline-head').addEventListener('click', ()=>{
      el.classList.toggle('open');
    });
    wrap.appendChild(el);
  });
}

/* =========================================================
   SECTION: PROJECTS
   ========================================================= */
const PROJECTS = [
  { id:"PROJECT 001", name:"Meeting You", desc:"Status: complete. Best merge conflict resolution of my life.", progress:100 },
  { id:"PROJECT 002", name:"Learning About You", desc:"Ongoing. New discoveries pushed to main every day.", progress:82 },
  { id:"PROJECT 003", name:"Making You Smile", desc:"Continuous deployment. No downtime tolerated.", progress:97 },
  { id:"PROJECT 004", name:"Future Together", desc:"In active development. No planned end date.", progress:64 },
];

function buildProjects(){
  const wrap = $('#projects-wrap');
  wrap.innerHTML = '';
  PROJECTS.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'project-card glass';
    card.innerHTML = `
      <div class="project-id">${p.id}</div>
      <div class="project-name">${p.name}</div>
      <div class="project-desc">${p.desc}</div>
      <div class="progress-track"><div class="progress-fill" data-p="${p.progress}"></div></div>
      <div class="progress-label"><span>progress</span><span>${p.progress}%</span></div>`;
    wrap.appendChild(card);
  });
}
document.querySelector('[data-target="projects-screen"]').addEventListener('click', ()=>{
  setTimeout(()=> $$('.progress-fill').forEach(f => f.style.width = f.dataset.p + '%'), 100);
});

/* =========================================================
   SECTION: TERMINAL
   ========================================================= */
(function terminal(){
  const body = $('#terminal-body');
  const input = $('#terminal-input');

  function print(html){
    const line = document.createElement('div');
    line.innerHTML = html;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function boot(){
    body.innerHTML = '';
    print('<span class="t-out">Neural OS terminal — type "help" to begin.</span>');
  }
  boot();

  document.querySelector('[data-target="terminal-screen"]').addEventListener('click', ()=> setTimeout(()=> input.focus(), 200));

  input.addEventListener('keydown', (e)=>{
    if(e.key !== 'Enter') return;
    const raw = input.value;
    const cmd = raw.trim().toLowerCase();
    print('<span class="t-cmd">deep@neural-os:~$ ' + escapeHtml(raw) + '</span>');
    input.value = '';

    if(cmd === 'clear'){ boot(); return; }
    if(cmd === 'exit'){ print('<span class="t-out">Connection closed. (Just kidding — this window doesn\'t actually close.)</span>'); showScreen('home-screen'); return; }
    if(TERMINAL_RESPONSES[cmd]){
      print('<span class="t-out">' + escapeHtml(TERMINAL_RESPONSES[cmd]) + '</span>');
      if(cmd === 'memories') setTimeout(()=> showScreen('memories-screen'), 500);
      return;
    }
    print('<span class="t-out">command not found: ' + escapeHtml(cmd) + ' (try "help")</span>');
  });

  function escapeHtml(s){ const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
})();

/* =========================================================
   SECTION: DEVELOPER MODE
   ========================================================= */
(function devMode(){
  $('#dev-mode-btn').addEventListener('click', ()=> showScreen('dev-screen'));

  $('#dev-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const val = $('#dev-password').value;
    if(val === DEV_PASSWORD){
      $('#dev-lock').classList.add('hidden');
      $('#dev-content').classList.remove('hidden');
      renderDevStats();
      unlockAchievement('developer-mode');
    } else {
      $('#dev-error').textContent = 'ACCESS DENIED';
      $('#dev-password').closest('.dev-lock').classList.add('glitch');
      setTimeout(()=> $('#dev-password').closest('.dev-lock').classList.remove('glitch'), 800);
    }
  });

  function renderDevStats(){
    const start = new Date(RELATIONSHIP_START);
    const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
    $('#stat-days').textContent = isNaN(days) ? '—' : days;
  }
})();

/* =========================================================
   SECTION: ACHIEVEMENTS / EASTER EGGS
   ========================================================= */
const ACHIEVEMENTS = [
  { id:'konami', label:'Found the Konami code' },
  { id:'sudo-love', label:'Typed "sudo love"' },
  { id:'logo-dbl', label:'Double-clicked the logo' },
  { id:'shift-five', label:'Pressed Shift five times' },
  { id:'title-ten', label:'Clicked the title ten times' },
  { id:'said-it-back', label:'Said it back' },
  { id:'developer-mode', label:'Broke into Developer Mode' },
];
const unlocked = new Set();

function renderAchievements(){
  const list = $('#achv-list');
  if(!list) return;
  list.innerHTML = '';
  ACHIEVEMENTS.forEach(a=>{
    const li = document.createElement('li');
    li.textContent = (unlocked.has(a.id) ? '✓ ' : '○ ') + a.label;
    if(unlocked.has(a.id)) li.classList.add('unlocked');
    list.appendChild(li);
  });
}
renderAchievements();

function unlockAchievement(id){
  if(unlocked.has(id)) return;
  unlocked.add(id);
  const a = ACHIEVEMENTS.find(x=>x.id===id);
  if(a) toast('🏆 Achievement unlocked: ' + a.label);
  renderAchievements();
}

/* Konami code: ↑ ↑ ↓ ↓ ← → ← → B A */
(function konami(){
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', (e)=>{
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if(key === seq[idx]) idx++; else idx = (key === seq[0]) ? 1 : 0;
    if(idx === seq.length){
      idx = 0;
      unlockAchievement('konami');
      document.body.classList.add('glitch');
      toast('✨ Cheat mode engaged. Infinite love enabled.');
      setTimeout(()=> document.body.classList.remove('glitch'), 800);
    }
  });
})();

/* Double-click logo (home title also doubles as "logo") */
$('#home-title').addEventListener('dblclick', ()=>{
  unlockAchievement('logo-dbl');
  document.body.classList.add('glitch');
  setTimeout(()=> document.body.classList.remove('glitch'), 800);
});

/* Click title ten times */
(function titleClicks(){
  let n = 0;
  $('#home-title').addEventListener('click', ()=>{
    n++;
    if(n === 10){ unlockAchievement('title-ten'); toast('You really like clicking that, huh.'); n = 0; }
  });
})();

/* Shift x5 */
(function shiftFive(){
  let n = 0, last = 0;
  document.addEventListener('keydown', (e)=>{
    if(e.key !== 'Shift') return;
    const now = Date.now();
    n = (now - last < 1200) ? n+1 : 1;
    last = now;
    if(n === 5){ unlockAchievement('shift-five'); n = 0; }
  });
})();

/* "sudo love" typed anywhere */
(function sudoLove(){
  let buf = '';
  document.addEventListener('keydown', (e)=>{
    if(e.key.length > 1) return;
    buf = (buf + e.key).slice(-9).toLowerCase();
    if(buf === 'sudo love'){
      unlockAchievement('sudo-love');
      toast('sudo: permission granted. Love elevated to root.');
    }
  });
})();

/* Random floating AI messages */
(function floatingMessages(){
  const msgs = [
    "System note: still thinking about you.",
    "Background process: missing you (priority: high)",
    "Reminder: you are, statistically, my favorite anomaly.",
    "Log entry: another day, another reason."
  ];
  setInterval(()=>{
    if(Math.random() < 0.35 && $('#home-screen').classList.contains('active')){
      toast(msgs[Math.floor(Math.random()*msgs.length)]);
    }
  }, 25000);
})();

/* =========================================================
   SECTION: SHUTDOWN
   ========================================================= */
$('#shutdown-btn').addEventListener('click', runShutdown);

async function runShutdown(){
  showScreen('shutdown-screen');
  const log = $('#shutdown-log');
  log.innerHTML = '';
  const lines = [
    { t: "Saving memories...", cls:'ok' },
    { t: "Compressing feelings...", cls:'ok' },
    { t: "Deleting feelings...", cls:'' },
    { t: "ERROR", cls:'err' },
    { t: "Unable to delete.", cls:'err' },
    { t: "Reason: they are permanent.", cls:'' },
  ];
  for(const l of lines){
    const div = document.createElement('div');
    if(l.cls) div.className = l.cls;
    log.appendChild(div);
    for(const ch of l.t){ div.textContent += ch; await sleep(18); }
    await sleep(400);
  }
  await sleep(300);
  const final = document.createElement('span');
  final.className = 'final';
  final.textContent = 'Forever.exe is currently running.';
  log.appendChild(final);

  await sleep(2200);
  showScreen('home-screen');
}

/* =========================================================
   SECTION: INIT
   ========================================================= */
(async function init(){
  await loadImageManifest();
  buildTimeline();
  buildProjects();
  runBoot();
})();
