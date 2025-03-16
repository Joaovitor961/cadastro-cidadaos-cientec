import { Citizen } from '../models/Citizen';

export interface ICitizenRepository {
  create(citizen: Citizen): Promise<void>;
  findByCPF(cpf: string): Promise<Citizen | null>;
  findByName(name: string): Promise<Citizen[]>;
  getAll(): Promise<Citizen[]>;
}