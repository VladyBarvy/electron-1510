//const { ipcRenderer } = require('electron');

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

async function fetchAndDisplayUsers() {
  await loadUsers(); // Вызываем функцию для загрузки пользователей
}

// Обработчик для кнопки добавления пользователя
document.getElementById('addUserButton').addEventListener('click', addUser);

// Обработчик для кнопки извлечения пользователей
document.getElementById('fetchUsersButton').addEventListener('click', fetchAndDisplayUsers);


loadUsers();  // Загружаем пользователей при старте
populatePorts();  // извлечение и отображение доступных COM-портов



