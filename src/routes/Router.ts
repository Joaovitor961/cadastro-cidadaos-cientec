import { IncomingMessage, ServerResponse } from 'http';
import { CitizenController } from '../controllers/CitizenController';
import { Logger } from '../utils/Logger';
import { URL } from 'url';

export class Router {
  constructor(private citizenController: CitizenController) {}

  async handleRequest(req: IncomingMessage, res: ServerResponse, body: string): Promise<void> {
    Logger.request(req.method || 'UNKNOWN', req.url || '/');

    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = url.pathname;

    const request = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: body ? JSON.parse(body) : {},
      query: Object.fromEntries(url.searchParams)
    };
    
    const response = {
      status(code: number) {
        res.statusCode = code;
        return this;
      },
      json(data: any) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      }
    };

    if (pathname === '/api/citizens') {
      switch (req.method) {
        case 'POST':
          await this.citizenController.create(request, response);
          break;
        case 'GET':
          const { cpf, name } = request.query;

          if (cpf) {
            await this.citizenController.findByCPF(request, response);
          } else if (name) {
            await this.citizenController.findByName(request, response);
          } else {
            await this.citizenController.getAll(request, response);
          }
          break;
        case 'DELETE':
          await this.citizenController.deleteByCPF(request, response);  
          break;
        
        case 'PUT':
          await this.citizenController.updateByCPF(request, response);  
          break;

        default:
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Método não permitido' }));
          break;
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
  }
}