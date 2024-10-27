const { ipcRenderer } = require('electron');
const sqlite3 = require('sqlite3').verbose();
/*
async function populatePorts() {
  try {
    const ports = await ipcRenderer.invoke('get-com-ports');
    const select = document.getElementById('comPorts');

    // Очистка предыдущих элементов
    select.innerHTML = '';

    ports.forEach(port => {
      const option = document.createElement('option');
      option.value = port.path;
      option.textContent = port.path;
      select.appendChild(option);
    });

    if (ports.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'Нет доступных портов';
      select.appendChild(option);
    }
  } catch (error) {
    console.error('Error populating ports:', error);
  }
}
*/




async function addUser() {
  const name = document.getElementById('nameInput').value;
  await ipcRenderer.invoke('add-user', name);
  loadUsers();
}

async function loadUsers() {
  const users = await ipcRenderer.invoke('get-users');
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  console.log(userList);

  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user.name;
    userList.appendChild(li);
  });
}

async function deleteUser() {
  const name = document.getElementById('deleteInput').value;
  const result = await ipcRenderer.invoke('delete-user', name);
  if (result > 0) {
    alert(`Пользователь "${name}" удалён.`);
  } else {
    alert(`Пользователь "${name}" не найден.`);
  }
  loadUsers(); // Обновляем список пользователей
}




async function fetchAndDisplayUsers() {
  await loadUsers(); // Вызываем функцию для загрузки пользователей
}

// Обработчик для кнопки добавления пользователя
document.getElementById('addUserButton').addEventListener('click', addUser);

// Обработчик для кнопки извлечения пользователей
document.getElementById('fetchUsersButton').addEventListener('click', fetchAndDisplayUsers);

// Обработчик для кнопки удаления пользователей
document.getElementById('deleteUserButton').addEventListener('click', deleteUser);



loadUsers();  // Загружаем пользователей при старте
//populatePorts();  // извлечение и отображение доступных COM-портов








//////////////////////////////////////////////////////////////////////////////////////////////////////////

//открытие второго окна
//const { ipcRenderer } = require('electron');

document.getElementById('open-second-window').addEventListener('click', () => {
  ipcRenderer.send('open-second-window');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////

// загрузка Excel-файла    Этот код рабочий, но зарезервирован
// const { remote } = require('electron');
// const XLSX = require('xlsx');

// document.getElementById('upload-btn').addEventListener('click', () => {
//   document.getElementById('file-input').click();
// });

// document.getElementById('file-input').addEventListener('change', (event) => {
//   const file = event.target.files[0];

//   if (file) {
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });

//       // Предположим, что вы хотите получить данные из первого листа
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//       // Присваиваем данные массиву datamass
//       const datamass = json;
//       console.log(datamass);
//     };

//     reader.readAsArrayBuffer(file);
//   }
// });
//////////////////////////////////////////////////////////////////////////////////////////////////////////













//////////////////////////////////////////////////////////////////////////////////////////////////////////

// альтернатива загрузки excel-файла
//const { ipcRenderer } = require('electron');
let datamass_global = {};
document.getElementById('loadExcel').addEventListener('click', async () => {
  const data = await ipcRenderer.invoke('dialog:openFile');
  if (data) {
    //console.log(typeof(data)); // Ваш массив данных
    datamass_global = data; // Присваиваем данные объекту
    createDatabaseSecond(data);
    updateTable(data);
  }
});



function updateTable(data) {
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');

  // Очищаем предыдущие данные
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  // Создаем заголовки таблицы
  const headers = Object.keys(data[0]);
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    tableHeader.appendChild(th);
  });

  // Добавляем строки данных
  data.forEach(row => {
    const tr = document.createElement('tr');
    headers.forEach(header => {
      const td = document.createElement('td');
      td.textContent = row[header];
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////








function createDatabaseSecond(data) {
  db3 = new sqlite3.Database('special_database.db', (err) => {
    if (err) {
      console.error('Ошибка при подключении к базе данных:', err.message);
    } else {

      const columnDefs = data[0].map((col, index) => {
        return `column${index + 1} TEXT NOT NULL`; // Название столбца column1, column2 и т.д.
      }).join(', ');


      db3.run(`CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ${columnDefs}
      )`); // Создаем таблицу


      // db3.serialize(() => {
      //   const stmt = db3.prepare(`INSERT INTO data VALUES (${data[0].map(() => '?').join(', ')})`);
      //   for (let i = 1; i < data.length; i++) {  // Вставка данных
      //     stmt.run(data[i]);
      //   }
      //   stmt.finalize();
      // });
      // db3.close();
    }
  });
}
