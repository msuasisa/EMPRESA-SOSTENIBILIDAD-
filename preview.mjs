import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('./', import.meta.url));
const files = new Map([
  ['/index.html', 'text/html; charset=utf-8'],
  ['/proposito.html', 'text/html; charset=utf-8'],
  ['/proceso.html', 'text/html; charset=utf-8'],
  ['/ods-asg.html', 'text/html; charset=utf-8'],
  ['/riesgos.html', 'text/html; charset=utf-8'],
  ['/project.js', 'text/javascript; charset=utf-8'],
  ['/matrix.js', 'text/javascript; charset=utf-8'],
  ['/details.js', 'text/javascript; charset=utf-8'],
  ['/details.css', 'text/css; charset=utf-8'],
  ['/styles.css', 'text/css; charset=utf-8'],
  ['/app.js', 'text/javascript; charset=utf-8'],
  ['/presentation.css', 'text/css; charset=utf-8'],
  ['/presentation.js', 'text/javascript; charset=utf-8']
]);

http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const file = pathname === '/' ? '/index.html' : pathname;
    if (!files.has(file)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const content = await readFile(path.join(root, file.slice(1)));
    res.writeHead(200, {
      'Content-Type': files.get(file),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(4173, '127.0.0.1', () => {
  console.log('Local: http://127.0.0.1:4173');
});
