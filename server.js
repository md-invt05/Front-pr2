const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;

  // Если пользователь открыл корень сайта, грузим index.html
  if (filePath === './') {
    filePath = './public/index.html';
  } else {
    filePath = './public' + req.url;
  }

  // Определяем MIME-тип файла по его расширению
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Читаем файл с диска и отправляем ответ
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Файл не найден: отправляем 404.html
        fs.readFile('./public/404.html', (err404, content404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content404, 'utf-8');
        });
      } else {
        // Другая ошибка
        res.writeHead(500);
        res.end(`Ошибка сервера: ${error.code}\n`);
      }
    } else {
      // Файл найден, отправляем пользователю
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
