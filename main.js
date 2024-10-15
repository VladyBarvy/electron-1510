const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const { ipcMain } = require('electron');


let win;
let secondWin;



function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  win.on('closed', () => {
    win = null;
  });




  // Обработчик для открытия второго окна
ipcMain.on('open-second-window', (event) => {
  createSecondWindow();
});

// Обработчик для закрытия второго окна
ipcMain.on('close-second-window', (event) => {
  if (secondWin) {
    secondWin.close();
  }
});

}










function createSecondWindow() {
  secondWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  secondWin.loadFile('second.html');

  secondWin.on('closed', () => {
    secondWin = null;
  });
}










app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
