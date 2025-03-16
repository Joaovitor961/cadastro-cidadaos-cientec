import { ICitizenService } from '../services/ICitizenService';

interface Request {
  body: any;
  query: any;
}

interface Response {
  status(code: number): Response;
  json(data: any): void;
}

export class CitizenController {
  constructor(private service: ICitizenService) {}

  async create(req: Request, res: Response) {
    try {
      const { name, cpf } = req.body;
      
      if (!name || !cpf) {
        return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
      }

      const citizen = await this.service.createCitizen(name, cpf);
      res.status(201).json(citizen);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async findByCPF(req: Request, res: Response) {
    try {
      const cpf = req.query.cpf as string;

      const citizen = await this.service.findByCPF(cpf);
      
      if (!citizen) {
        return res.status(404).json({ error: 'Cidadão não encontrado' });
      }
      
      res.json(citizen);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findByName(req: Request, res: Response) {
    try {
      const name = req.query.name as string;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const citizens = await this.service.findByName(name);
      res.json(citizens);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const citizens = await this.service.getAllCitizens();
      res.json(citizens);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}