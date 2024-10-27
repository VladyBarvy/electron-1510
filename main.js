//const { app, BrowserWindow } = require('electron/main')
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const SerialPort = require('serialport');
//const path = require('node:path')
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');


let win;
let secondWin;
let db;



function createDatabase() {
  db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
      console.error('Ошибка при подключении к базе данных:', err.message);
    } else {
      db.run(`CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL
          )`);
    }
  });
}









// // Добавление данных в SQLite
// const db3 = new sqlite3.Database('./special_database.db');

// // Формируем запрос на создание таблицы
// const columnDefs = data[0].map((col, index) => {
//     return `column${index + 1} TEXT`; // Название столбца column1, column2 и т.д.
// }).join(', ');

// db3.serialize(() => {
//     db3.run(`CREATE TABLE IF NOT EXISTS data (${columnDefs})`); // Создаем таблицу

//     const stmt = db3.prepare(`INSERT INTO data VALUES (${data[0].map(() => '?').join(', ')})`);

//     // Вставка данных
//     for (let i = 1; i < data.length; i++) {
//         stmt.run(data[i]);
//     }

//     stmt.finalize();
// });






















const dbPath = path.join(__dirname, 'database.db');
















function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      preload: __dirname + '/renderer.js',
    }
  })

  win.loadFile('index.html')


  // // Здесь вы можете открыть порт
  //   const port = new SerialPort({
  //     path: 'COM3', // Укажите ваш COM-порт
  //     baudRate: 9600 // Укажите скорость передачи данных
  // });

  // // Чтение данных из порта
  //   port.on('data', (data) => {
  //     console.log('Данные получены: ' + data);
  //     // Здесь можно отправить данные в renderer процесс
  //     win.webContents.send('serial-data', data.toString());
  // });





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







// SerialPort.list((err, ports) => {
//   ports.forEach(port => {
//      if (port.comName === 'COM4') {
//         const serialPort = new SerialPort(port.comName, {
//            baudRate: 9600
//         });

//         serialPort.on('data', data => {
//            // Обрабатываем полученные данные
//         });
//      }
//   });
// });






// альтернативный код загрузки данных из Excel-файла
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] }
    ],
  });

  if (result.canceled) {
    return;
  } else {
    const filePath = result.filePaths[0];
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return data; // Возвращаем данные
  }






});















// ----------------------------------------------------------------------------------- MAIN CODE
// ipcMain.handle('get-com-ports', async () => {
//   const ports = await SerialPort.list(); // Это должно работать
//   return ports;
// });


ipcMain.handle('get-com-ports', async () => {
  try {
    const ports = await SerialPort.list();
    console.log('Available COM ports:', ports); // Отладочный вывод
    return ports;
  } catch (error) {
    console.error('Error listing ports:', error); // Вывод ошибки
    return [];
  }
});










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
  createDatabase();
  createWindow();

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








ipcMain.handle('add-user', (event, name) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO users (name) VALUES (?)`, [name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
});

ipcMain.handle('get-users', () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('delete-user', (event, name) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM users WHERE name = ?`, [name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes); // Возвращает количество удалённых строк
      }
    });
  });
});










// Обработка открытия диалогового окна для выбора файла
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(secondWin, {
      properties: ['openFile'],
      filters: [
          { name: 'Excel Files', extensions: ['xlsx'] }
      ]
  });
  return result.filePaths;
});







