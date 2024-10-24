# electron-1510

```
# Run the app
npm start
```

```
# Build app
npm run package
```







-----------------------------------------------------------------------------------

#Работа с Excel-файлом

1) установить библиотеку xlsx
```
npm install xlsx
```

2) создать кнопку в html-файле
```
<button id="upload-btn">Загрузить Excel файл</button>
<input type="file" id="file-input" style="display: none;" />
```

3) добавить обработчик событий в файле renderer.js
```
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
```

4) что происходит в этом случае:
  - Когда вы нажимаете кнопку, скрытое поле для загрузки файла (file-input) активируется.
  - Когда файл выбран, используется FileReader для чтения содержимого файла.
  - С помощью библиотеки xlsx файл преобразуется в формат JSON, который затем присваивается массиву datamass.
  -----------------------------------------------------------------------------------
  