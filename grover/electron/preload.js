const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("groverAPI", {
  chat: (messages) => ipcRenderer.invoke("chat", messages),
  toggleCollapse: () => ipcRenderer.invoke("toggle-collapse"),
  close: () => ipcRenderer.invoke("widget-close"),
  ollamaStatus: () => ipcRenderer.invoke("ollama-status"),
  ollamaUnload: (model) => ipcRenderer.invoke("ollama-unload", model),
  getModel: () => ipcRenderer.invoke("get-model"),
  setModel: (model) => ipcRenderer.invoke("set-model", model),
  loadChatHistory: () => ipcRenderer.invoke("load-chat-history"),
  saveChatHistory: (msgs) => ipcRenderer.invoke("save-chat-history", msgs),
  onExpandChange: (cb) => ipcRenderer.on("expand-changed", (_e, v) => cb(v)),
  onChatToken: (cb) => ipcRenderer.on("chat-token", (_e, token) => cb(token)),
});
