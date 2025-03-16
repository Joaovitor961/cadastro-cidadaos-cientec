import { ICitizen } from '../types/Citizen';

export class Citizen implements ICitizen {
  constructor(
    private _name: string,
    private _cpf: string
  ) {}

  get name(): string {
    return this._name;
  }

  get cpf(): string {
    return this._cpf;
  }

  toJSON(): ICitizen {
    return {
      name: this._name,
      cpf: this._cpf
    };
  }
}