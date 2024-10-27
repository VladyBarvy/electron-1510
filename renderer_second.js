// renderer.js
// renderer.js
const { ipcRenderer } = require('electron');
const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

document.getElementById('load-button').addEventListener('click', async () => {
    //const filePaths = await ipcRenderer.invoke('dialog:openFile');

    const result1 = await ipcRenderer.invoke('dialog:openFile');

    // Проверка на корректность возвращаемого значения
    if (Array.isArray(result1) && result1.length > 0) {
        //const filePath = filePaths[0]; // Получаем первый путь к файлу
        const filePath = result1.filePaths[0];
        try {
            const workbook = XLSX.readFile(filePath); // Здесь может быть ошибка
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            const table = document.getElementById('data-table');
            table.innerHTML = ''; // Очистить таблицу

            // Добавление заголовков
            const headerRow = table.insertRow();
            data[0].forEach(cell => {
                const th = document.createElement('th');
                th.innerText = cell;
                headerRow.appendChild(th);
            });

            // Добавление данных
            for (let i = 1; i < data.length; i++) {
                const tr = table.insertRow();
                data[i].forEach(cell => {
                    const td = document.createElement('td');
                    td.innerText = cell;
                    tr.appendChild(td);
                });
            }

            // Добавление данных в SQLite
            const db = new sqlite3.Database('./second__database.db');

            // Формируем запрос на создание таблицы
            const columnDefs = data[0].map((col, index) => {
                return `column${index + 1} TEXT`; // Название столбца column1, column2 и т.д.
            }).join(', ');

            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS data (${columnDefs})`); // Создаем таблицу

                const stmt = db.prepare(`INSERT INTO data VALUES (${data[0].map(() => '?').join(', ')})`);

                // Вставка данных
                for (let i = 1; i < data.length; i++) {
                    stmt.run(data[i]);
                }

                stmt.finalize();
            });
            
            db.close();
        } catch (error) {
            console.error("Ошибка при чтении Excel файла:", error);
        }
    } else {
        console.error("Не выбран файл или файл некорректен.");
    }
});
