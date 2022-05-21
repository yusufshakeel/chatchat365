'use strict';

const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

// global variable to prevent it from getting garbage collected.
let mainWindow;
const isDevEnv = process.env.CHATCHAT365_ENV === 'dev';

function createWindow() {
  const windowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  const maxDimension = isDevEnv ? {} : { maxWidth: 1000, maxHeight: 900 };

  mainWindow = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 600,
    minHeight: 400,
    ...maxDimension,
    backgroundColor: '#fff',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  // for dev work
  isDevEnv && mainWindow.webContents.openDevTools();

  windowState.manage(mainWindow);

  mainWindow.loadFile(__dirname + '/../static/app.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

// Quit the app when all windows are closed. Not for macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When app icon is clicked and app is running then recreate BrowserWindow (macOS)
app.on('activate', async () => {
  if (!mainWindow) {
    createWindow();
  }
});
