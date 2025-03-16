import { Citizen } from '../models/Citizen';

export interface ICitizenRepository {
  create(citizen: Citizen): Promise<void>;
  findByCPF(cpf: string): Promise<Citizen | null>;
  findByName(name: string): Promise<Citizen[]>;
  updateByCPF(name: string,cpf: string): Promise<void>;
  deleteByCPF(cpf: string): Promise<void>;
  getAll(): Promise<Citizen[]>;
}