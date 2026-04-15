// ─── WORM MAN — Earth's Least Mighty Hero ───

const QUICK_PROMPTS = [
  "Tell me about your glory days",
  "What's Worm-Fu?",
  "How's the movie deal going?",
  "Tell me about Bird Guy",
  "Give me life advice",
  "What's it like in county?",
];

const root = document.getElementById("root");
let expanded = false;
let messages = [];
let loading = false;
let streamingText = "";
let showSettings = false;
let ollamaRunning = false;
let availableModels = [];
let currentModel = "wormman:14b";
let gpuLoaded = false;

function formatMarkdown(text) {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="md-code-block"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<div class="md-h3">$1</div>')
    .replace(/^## (.+)$/gm, '<div class="md-h2">$1</div>')
    .replace(/^# (.+)$/gm, '<div class="md-h1">$1</div>')
    .replace(/^[-*] (.+)$/gm, '<div class="md-li">$1</div>')
    .replace(/^\d+\. (.+)$/gm, '<div class="md-li">$&</div>')
    .replace(/\n{2,}/g, '<div class="md-break"></div>')
    .replace(/\n/g, "<br/>");
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function checkOllama() {
  try {
    const status = await window.groverAPI.ollamaStatus();
    ollamaRunning = status.running;
    availableModels = status.models || [];
    gpuLoaded = availableModels.length > 0;
  } catch {
    ollamaRunning = false;
    availableModels = [];
  }
}

async function init() {
  await checkOllama();
  const model = await window.groverAPI.getModel();
  if (model) currentModel = model;
  const history = await window.groverAPI.loadChatHistory();
  if (history && history.length) messages = history;

  window.groverAPI.onExpandChange((exp) => {
    expanded = exp;
    render();
    if (exp) setTimeout(() => document.querySelector(".chat-input")?.focus(), 50);
  });

  window.groverAPI.onChatToken((token) => {
    streamingText += token;
    renderStreamingMessage();
  });

  render();
}

function persistMessages() {
  window.groverAPI.saveChatHistory(messages);
}

async function sendMessage(text) {
  if (!text.trim() || loading) return;
  if (!ollamaRunning) { await checkOllama(); render(); return; }

  const userMsg = { id: `msg_${Date.now()}_u`, role: "user", text: text.trim(), timestamp: Date.now() };
  messages.push(userMsg);
  persistMessages();
  loading = true;
  streamingText = "";
  render();

  try {
    const chatPayload = messages.map(m => ({ role: m.role, text: m.text }));
    const resp = await window.groverAPI.chat(chatPayload);

    const assistantMsg = {
      id: `msg_${Date.now()}_a`,
      role: "assistant",
      text: resp.error ? `Error: ${resp.error}` : (resp.result || streamingText || "*slurp* ...nothing came out. Typical."),
      timestamp: Date.now(),
    };
    messages.push(assistantMsg);
    persistMessages();
    gpuLoaded = true;
  } catch (err) {
    messages.push({ id: `msg_${Date.now()}_e`, role: "assistant", text: `*slurp* Something broke in Worm Man's head: ${err.message}`, timestamp: Date.now() });
    persistMessages();
  } finally {
    loading = false;
    streamingText = "";
    render();
  }
}

async function unloadGPU() {
  await window.groverAPI.ollamaUnload(currentModel);
  gpuLoaded = false;
  render();
}

function renderStreamingMessage() {
  const el = document.getElementById("streaming-bubble");
  if (el) el.innerHTML = formatMarkdown(streamingText);
  const chatEnd = document.getElementById("chat-end");
  if (chatEnd) chatEnd.scrollIntoView({ behavior: "smooth" });
}

function render() {
  if (!expanded) {
    root.innerHTML = `
      <div class="widget-shell collapsed-clickable" id="collapsed-shell">
        <div class="header">
          <div class="header-brand">
            <span class="logo">🪱</span>
            <div>
              <div class="title">WORM MAN</div>
              <div class="subtitle">Earth's Least Mighty Hero</div>
            </div>
          </div>
          <span class="status-badge ${ollamaRunning ? 'status-badge--on' : 'status-badge--off'}">
            ${ollamaRunning ? 'ON' : 'OFF'}
          </span>
          <button class="header-btn" id="btn-close" title="Close">&#10005;</button>
        </div>
      </div>
    `;
    document.getElementById("collapsed-shell").addEventListener("click", (e) => {
      if (e.target.id === "btn-close") return;
      window.groverAPI.toggleCollapse();
    });
    document.getElementById("btn-close").addEventListener("click", (e) => {
      e.stopPropagation();
      window.groverAPI.close();
    });
    return;
  }

  // Expanded
  const messagesHtml = messages.length === 0
    ? `<div class="welcome">
        <div class="welcome-logo">WORM MAN</div>
        <div class="welcome-sub">You just got WORMED.</div>
        <div class="welcome-status ${ollamaRunning ? 'welcome-status--ok' : 'welcome-status--err'}">
          ${ollamaRunning ? `Brain loaded — ${currentModel}` : 'Ollama not running — start it first'}
        </div>
        <div class="quick-prompts">
          ${QUICK_PROMPTS.map(q => `<button class="quick-btn" data-prompt="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}
        </div>
      </div>`
    : `<div class="messages">
        ${messages.map(m => `
          <div class="message message--${m.role}">
            <div class="message-label">${m.role === "user" ? "YOU" : "WORM MAN"}</div>
            <div class="message-bubble">${formatMarkdown(m.text)}</div>
            <div class="message-time">${formatTime(m.timestamp)}</div>
          </div>
        `).join("")}
        ${loading ? `
          <div class="message message--assistant">
            <div class="message-label">WORM MAN</div>
            <div class="message-bubble" id="streaming-bubble">
              ${streamingText ? formatMarkdown(streamingText) : '<span class="thinking-dots"><span></span><span></span><span></span></span>'}
            </div>
          </div>
        ` : ""}
        <div id="chat-end"></div>
      </div>`;

  const settingsHtml = showSettings ? `
    <div class="settings-panel">
      <div class="settings-section">
        <div class="settings-label">BRAIN</div>
        <select class="model-select" id="model-select">
          ${availableModels.map(m => `<option value="${m}" ${m === currentModel ? "selected" : ""}>${m}</option>`).join("")}
          ${!availableModels.includes(currentModel) ? `<option value="${currentModel}" selected>${currentModel}</option>` : ""}
        </select>
      </div>
      <div class="settings-section">
        <div class="settings-label">GPU STATUS</div>
        <div style="font-size:10px;color:var(--text-secondary)">
          ${gpuLoaded ? "Brain loaded in VRAM" : "Brain not loaded"}
        </div>
      </div>
    </div>
  ` : "";

  root.innerHTML = `
    <div class="widget-shell">
      <div class="header">
        <div class="header-brand" id="brand-collapse" style="cursor:pointer">
          <span class="logo">🪱</span>
          <div>
            <div class="title">WORM MAN</div>
            <div class="subtitle">Earth's Least Mighty Hero</div>
          </div>
        </div>
        <span class="status-badge ${ollamaRunning ? 'status-badge--on' : 'status-badge--off'}">
          ${ollamaRunning ? 'ON' : 'OFF'}
        </span>
        <button class="header-btn" id="btn-settings" title="Settings">&#9881;</button>
        <button class="header-btn" id="btn-close-exp" title="Close">&#10005;</button>
      </div>

      <div class="controls-bar">
        ${gpuLoaded
          ? `<button class="ctrl-btn ctrl-btn--danger gpu-toggle" id="btn-gpu-off" title="Unload brain from GPU">&#9632; STOP GPU</button>`
          : `<button class="ctrl-btn gpu-toggle" id="btn-gpu-off" disabled style="opacity:0.3" title="Brain not loaded">&#9632; GPU OFF</button>`
        }
        <button class="ctrl-btn ctrl-btn--accent" id="btn-model-label">&#9889; ${currentModel.split(":")[0]}</button>
        <div style="flex:1"></div>
        ${messages.length > 0 ? '<button class="ctrl-btn" id="btn-clear" title="Wipe memory">&#128465; Wipe</button>' : ""}
      </div>

      ${settingsHtml}

      <div class="chat-area">${messagesHtml}</div>

      <div class="input-area">
        ${messages.length > 0 ? '<button class="clear-btn" id="btn-clear2" title="Wipe memory">&#10005;</button>' : ""}
        <textarea class="chat-input" id="chat-input" placeholder="Talk to Worm Man..." rows="1" ${loading ? "disabled" : ""}></textarea>
        <button class="send-btn" id="btn-send" ${loading ? "disabled" : ""}>&#8594;</button>
      </div>
    </div>
  `;

  // Wire events
  document.getElementById("brand-collapse").addEventListener("click", () => {
    showSettings = false;
    window.groverAPI.toggleCollapse();
  });
  document.getElementById("btn-settings").addEventListener("click", (e) => {
    e.stopPropagation();
    showSettings = !showSettings;
    render();
  });
  document.getElementById("btn-close-exp").addEventListener("click", (e) => {
    e.stopPropagation();
    window.groverAPI.close();
  });

  const gpuBtn = document.getElementById("btn-gpu-off");
  if (gpuBtn && gpuLoaded) gpuBtn.addEventListener("click", unloadGPU);

  const modelLabel = document.getElementById("btn-model-label");
  if (modelLabel) modelLabel.addEventListener("click", () => { showSettings = !showSettings; render(); });

  const clearBtn = document.getElementById("btn-clear");
  if (clearBtn) clearBtn.addEventListener("click", () => { messages = []; persistMessages(); render(); });
  const clearBtn2 = document.getElementById("btn-clear2");
  if (clearBtn2) clearBtn2.addEventListener("click", () => { messages = []; persistMessages(); render(); });

  const modelSelect = document.getElementById("model-select");
  if (modelSelect) {
    modelSelect.addEventListener("change", async () => {
      currentModel = modelSelect.value;
      await window.groverAPI.setModel(currentModel);
      render();
    });
  }

  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("btn-send");
  if (chatInput) {
    chatInput.focus();
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(chatInput.value);
      }
    });
  }
  if (sendBtn) sendBtn.addEventListener("click", () => sendMessage(chatInput?.value || ""));

  document.querySelectorAll(".quick-btn").forEach(btn => {
    btn.addEventListener("click", () => sendMessage(btn.dataset.prompt));
  });

  const chatEnd = document.getElementById("chat-end");
  if (chatEnd) chatEnd.scrollIntoView({ behavior: "smooth" });
}

init();
