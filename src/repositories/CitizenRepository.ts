import { ICitizenRepository } from './ICitizenRepository';
import { MySQLCitizenRepository } from './MySQLCitizenRepository';
import { Citizen } from '../models/Citizen';

export class CitizenRepository implements ICitizenRepository {
    private repository: ICitizenRepository;

    constructor() {
        this.repository = new MySQLCitizenRepository();
    }

    async create(citizen: Citizen): Promise<void> {
        return this.repository.create(citizen);
    }

    async findByCPF(cpf: string): Promise<Citizen | null> {
        return this.repository.findByCPF(cpf);
    }

    async findByName(name: string): Promise<Citizen[]> {
        return this.repository.findByName(name);
    }

    async getAll(): Promise<Citizen[]> {
        return this.repository.getAll();
    }
}