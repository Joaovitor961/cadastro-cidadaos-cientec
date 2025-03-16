import { Citizen } from '../models/Citizen';

export interface ICitizenService {
  validateCPF(cpf: string): boolean;
  createCitizen(name: string, cpf: string): Promise<Citizen>;
  findByCPF(cpf: string): Promise<Citizen | null>;
  findByName(name: string): Promise<Citizen[]>;
  getAllCitizens(): Promise<Citizen[]>;
}