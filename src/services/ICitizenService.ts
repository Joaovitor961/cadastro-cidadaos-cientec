import { Citizen } from '../models/Citizen';

export interface ICitizenService {
  validateCPF(cpf: string): boolean;
  createCitizen(name: string, cpf: string): Promise<Citizen>;
  findByCPF(cpf: string): Promise<Citizen | null>;
  findByName(name: string): Promise<Citizen[]>;
  updateByCPF(name: string,cpf: string): Promise<void>;
  deleteByCPF(cpf: string): Promise<void>;
  getAllCitizens(): Promise<Citizen[]>;
}