const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startVisualizer: () => ipcRenderer.send('start-visualizer'),
  stopVisualizer: () => ipcRenderer.send('stop-visualizer'),
  quitApp: () => ipcRenderer.send('quit-app'),
});
