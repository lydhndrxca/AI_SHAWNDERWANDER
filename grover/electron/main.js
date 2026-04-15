const { app, BrowserWindow, ipcMain, Menu, screen } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");

const COLLAPSED_W = 380;
const COLLAPSED_H = 52;
const EXPANDED_W = 440;
const EXPANDED_H = 620;

const OLLAMA_HOST = "127.0.0.1";
const OLLAMA_PORT = 11434;
const DEFAULT_MODEL = "wormman:14b";

let mainWindow = null;
let isExpanded = false;
let animating = false;

const userDataPath = app.getPath("userData");
const posFile = path.join(userDataPath, "wormman-position.json");
const settingsFile = path.join(userDataPath, "wormman-settings.json");
const historyFile = path.join(userDataPath, "wormman-chat-history.json");

function loadSettings() {
  try { return JSON.parse(fs.readFileSync(settingsFile, "utf8")); }
  catch { return {}; }
}
function saveSettings(patch) {
  const merged = { ...loadSettings(), ...patch };
  try { fs.writeFileSync(settingsFile, JSON.stringify(merged, null, 2), "utf8"); }
  catch {}
}

function loadChatHistory() {
  try { return JSON.parse(fs.readFileSync(historyFile, "utf8")); }
  catch { return []; }
}
function saveChatHistory(messages) {
  try { fs.writeFileSync(historyFile, JSON.stringify(messages), "utf8"); }
  catch {}
}

function loadPosition() {
  try { return JSON.parse(fs.readFileSync(posFile, "utf8")); }
  catch { return null; }
}
function savePosition() {
  if (!mainWindow) return;
  const [x] = mainWindow.getPosition();
  try { fs.writeFileSync(posFile, JSON.stringify({ x }), "utf8"); }
  catch {}
}

function taskbarY(h) {
  const display = screen.getPrimaryDisplay();
  const wa = display.workArea;
  return wa.y + wa.height - h;
}

function defaultPosition() {
  const display = screen.getPrimaryDisplay();
  const { width } = display.workAreaSize;
  return { x: Math.round((width - COLLAPSED_W) / 2), y: taskbarY(COLLAPSED_H) };
}

function animateResize(fromW, fromH, toW, toH, durationMs, cb) {
  if (animating || !mainWindow) { cb?.(); return; }
  animating = true;
  const steps = 6;
  const interval = durationMs / steps;
  let step = 0;
  const [startX] = mainWindow.getPosition();
  const tick = () => {
    step++;
    const t = step / steps;
    const ease = t * (2 - t);
    const w = Math.round(fromW + (toW - fromW) * ease);
    const h = Math.round(fromH + (toH - fromH) * ease);
    if (mainWindow) mainWindow.setBounds({ x: startX, y: taskbarY(h), width: w, height: h });
    if (step < steps) setTimeout(tick, interval);
    else { animating = false; cb?.(); }
  };
  setTimeout(tick, interval);
}

function toggleExpand() {
  if (!mainWindow || animating) return isExpanded;
  if (isExpanded) {
    isExpanded = false;
    animateResize(EXPANDED_W, EXPANDED_H, COLLAPSED_W, COLLAPSED_H, 60, () => {
      mainWindow?.webContents.send("expand-changed", false);
    });
  } else {
    isExpanded = true;
    animateResize(COLLAPSED_W, COLLAPSED_H, EXPANDED_W, EXPANDED_H, 80, () => {
      mainWindow?.webContents.send("expand-changed", true);
    });
  }
  return isExpanded;
}

function createWindow() {
  const saved = loadPosition();
  const def = defaultPosition();
  const x = saved?.x ?? def.x;

  mainWindow = new BrowserWindow({
    width: COLLAPSED_W,
    height: COLLAPSED_H,
    x,
    y: taskbarY(COLLAPSED_H),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "src", "index.html"));

  mainWindow.webContents.on("context-menu", () => {
    Menu.buildFromTemplate([{ label: "Close Worm Man", click: () => mainWindow?.close() }]).popup({ window: mainWindow });
  });

  mainWindow.on("blur", () => {
    if (!mainWindow || animating || !isExpanded) return;
    isExpanded = false;
    animateResize(EXPANDED_W, EXPANDED_H, COLLAPSED_W, COLLAPSED_H, 60, () => {
      mainWindow?.webContents.send("expand-changed", false);
    });
  });

  mainWindow.on("will-move", (event, newBounds) => {
    event.preventDefault();
    const h = isExpanded ? EXPANDED_H : COLLAPSED_H;
    const w = isExpanded ? EXPANDED_W : COLLAPSED_W;
    mainWindow.setBounds({ x: newBounds.x, y: taskbarY(h), width: w, height: h });
    savePosition();
  });

  mainWindow.on("closed", () => { mainWindow = null; });
}

function getModel() {
  return loadSettings().model || DEFAULT_MODEL;
}

// ─── Ollama streaming chat ───
function ollamaChat(messages, model, onToken) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model,
      messages,
      stream: true,
    });

    const req = http.request({
      hostname: OLLAMA_HOST, port: OLLAMA_PORT,
      path: "/api/chat", method: "POST",
      headers: { "Content-Type": "application/json" },
    }, (res) => {
      let fullText = "";
      res.on("data", (chunk) => {
        const lines = chunk.toString().split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              fullText += json.message.content;
              onToken(json.message.content);
            }
            if (json.done) {
              resolve(fullText);
            }
          } catch {}
        }
      });
      res.on("end", () => resolve(fullText));
      res.on("error", reject);
    });
    req.on("error", (e) => reject(new Error(`Ollama not reachable: ${e.message}`)));
    req.setTimeout(120000, () => { req.destroy(); reject(new Error("Request timed out")); });
    req.write(body);
    req.end();
  });
}

// ─── IPC handlers ───
ipcMain.handle("toggle-collapse", () => toggleExpand());
ipcMain.handle("widget-close", () => { if (mainWindow) mainWindow.close(); });

ipcMain.handle("ollama-status", async () => {
  return new Promise((resolve) => {
    const req = http.get(`http://${OLLAMA_HOST}:${OLLAMA_PORT}/api/tags`, (res) => {
      let body = "";
      res.on("data", (d) => body += d);
      res.on("end", () => {
        try {
          const data = JSON.parse(body);
          const models = (data.models || []).map(m => m.name);
          resolve({ running: true, models });
        } catch { resolve({ running: true, models: [] }); }
      });
    });
    req.on("error", () => resolve({ running: false, models: [] }));
    req.setTimeout(2000, () => { req.destroy(); resolve({ running: false, models: [] }); });
  });
});

ipcMain.handle("ollama-unload", async (_, modelName) => {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ model: modelName || getModel(), keep_alive: 0 });
    const req = http.request({
      hostname: OLLAMA_HOST, port: OLLAMA_PORT,
      path: "/api/generate", method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) },
    }, (res) => {
      let body = "";
      res.on("data", (d) => body += d);
      res.on("end", () => resolve({ ok: true }));
    });
    req.on("error", (e) => resolve({ ok: false, error: e.message }));
    req.write(payload);
    req.end();
  });
});

let currentAbort = null;

// Character prompt baked into wormman:* Modelfiles — no system message needed.
// Only inject a system prompt for non-wormman models as a fallback.
ipcMain.handle("chat", async (_e, messages) => {
  const model = getModel();
  const isWormmanModel = model.startsWith("wormman:");

  const ollamaMessages = isWormmanModel
    ? messages.map(m => ({ role: m.role, content: m.text }))
    : [
        { role: "system", content: "You are Worm Man, Earth's Least Mighty Hero. Stay in character. Be funny, unhinged, and never break character." },
        ...messages.map(m => ({ role: m.role, content: m.text })),
      ];

  try {
    const result = await ollamaChat(ollamaMessages, model, (token) => {
      mainWindow?.webContents.send("chat-token", token);
    });
    return { result };
  } catch (err) {
    return { error: err.message || String(err) };
  }
});

ipcMain.handle("get-model", () => getModel());
ipcMain.handle("set-model", (_e, model) => {
  saveSettings({ model: (model || DEFAULT_MODEL).trim() });
  return (model || DEFAULT_MODEL).trim();
});
ipcMain.handle("load-chat-history", () => loadChatHistory());
ipcMain.handle("save-chat-history", (_e, msgs) => { saveChatHistory(msgs); return true; });

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
