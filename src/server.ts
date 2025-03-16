import http from 'http';
import fs from 'fs';
import path from 'path';
import { CitizenController } from './controllers/CitizenController';
import { CitizenService } from './services/CitizenService';
import { CitizenRepository } from './repositories/CitizenRepository';
import { Router } from './routes/Router';

const repository = new CitizenRepository();
const service = new CitizenService(repository);
const controller = new CitizenController(service);
const router = new Router(controller);

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.url && !req.url.startsWith('/api')) {
    let filePath = path.join(process.cwd(), 'public', req.url === '/' ? 'index.html' : req.url);
    
    try {
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'text/javascript',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
        }[ext] || 'text/plain';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    } catch (error) {
      console.log(error)
    }
  }

  try {
    let body = '';
    if (req.method === 'POST') {
      await new Promise<void>((resolve, reject) => {
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => resolve());
        req.on('error', reject);
      });
    }

    await router.handleRequest(req, res, body);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Algo deu errado!' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});