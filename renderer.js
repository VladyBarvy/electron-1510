const { ipcRenderer } = require('electron');

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
  //loadUsers();
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
  //loadUsers(); // Обновляем список пользователей
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

// загрузка Excel-файла
const { remote } = require('electron');
const XLSX = require('xlsx');

document.getElementById('upload-btn').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Предположим, что вы хотите получить данные из первого листа
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Присваиваем данные массиву datamass
      const datamass = json;
      console.log(datamass);
    };

    reader.readAsArrayBuffer(file);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////













//////////////////////////////////////////////////////////////////////////////////////////////////////////

// альтернатива загрузки excel-файла
//const { ipcRenderer } = require('electron');

document.getElementById('loadExcel').addEventListener('click', async () => {
  const data = await ipcRenderer.invoke('dialog:openFile');
  if (data) {
    // console.log(data); // Ваш массив данных
    // Присваиваем данные массиву
    const datamass = data;
    console.log(datamass);
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

