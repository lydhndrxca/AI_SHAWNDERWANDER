const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let menuWindow = null;
let vizWindow = null;
let songConfig = null;

function createMenuWindow() {
  menuWindow = new BrowserWindow({
    width: 800,
    height: 700,
    resizable: false,
    frame: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  menuWindow.setMenu(null);
  pipeConsoleLogs(menuWindow, 'MENU');
  menuWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  menuWindow.on('closed', () => {
    menuWindow = null;
  });
}

function pipeConsoleLogs(win, label) {
  win.webContents.on('console-message', (_e, level, message) => {
    const tag = ['LOG', 'WARN', 'ERROR'][level] || 'LOG';
    console.log(`[${label} ${tag}] ${message}`);
  });
}

function createVisualizerWindow() {
  vizWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  vizWindow.setMenu(null);
  pipeConsoleLogs(vizWindow, 'VIZ');

  vizWindow.loadFile(path.join(__dirname, 'renderer', 'visualizer.html'));

  vizWindow.once('ready-to-show', () => {
    vizWindow.show();
    if (menuWindow) menuWindow.hide();
  });

  vizWindow.on('closed', () => {
    vizWindow = null;
  });
}

app.whenReady().then(createMenuWindow);

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('start-visualizer', (_e, config) => {
  songConfig = config || null;
  if (!vizWindow) createVisualizerWindow();
});

ipcMain.handle('get-song-config', () => {
  return songConfig;
});

ipcMain.on('stop-visualizer', () => {
  if (vizWindow) {
    vizWindow.close();
    vizWindow = null;
  }
  if (menuWindow) {
    menuWindow.show();
  } else {
    createMenuWindow();
  }
});

ipcMain.on('quit-app', () => {
  app.quit();
});
