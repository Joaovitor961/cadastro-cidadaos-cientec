import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { Citizen } from '../models/Citizen';
import { ICitizenService } from './ICitizenService';
import { ICitizenRepository } from '../repositories/ICitizenRepository';

export class CitizenService implements ICitizenService {
  constructor(private repository: ICitizenRepository) {}

  validateCPF(cpf: string): boolean {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cpfValidator.isValid(cleanCpf);
  }

  async createCitizen(name: string, cpf: string): Promise<Citizen> {
    if (!name.trim()) {
      throw new Error('Nome é obrigatório');
    }

    // Remove caracteres especiais do CPF
    const cleanCpf = cpf.replace(/\D/g, '');

    if (!this.validateCPF(cleanCpf)) {
      throw new Error('CPF inválido');
    }

    const existingCitizen = await this.findByCPF(cleanCpf);
    if (existingCitizen) {
      throw new Error('CPF já cadastrado');
    }

    const citizen = new Citizen(name, cleanCpf);
    await this.repository.create(citizen);
    return citizen;
  }

  async findByCPF(cpf: string): Promise<Citizen | null> {
    const cleanCpf = cpf.replace(/\D/g, '');
    return this.repository.findByCPF(cleanCpf);
  }

  async findByName(name: string): Promise<Citizen[]> {
    return this.repository.findByName(name);
  }

  async getAllCitizens(): Promise<Citizen[]> {
    return this.repository.getAll();
  }
}