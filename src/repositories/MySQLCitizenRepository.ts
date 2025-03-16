import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Citizen } from '../models/Citizen';
import { ICitizenRepository } from './ICitizenRepository';
import pool from '../database/connection';

export class MySQLCitizenRepository implements ICitizenRepository {
  async create(citizen: Citizen): Promise<void> {
    try {
      await pool.execute<ResultSetHeader>(
        'INSERT INTO citizens (name, cpf) VALUES (?, ?)',
        [citizen.name, citizen.cpf]
      );
    } catch (error) {
      console.error('Error creating citizen in database:', error);
      throw new Error('Erro ao cadastrar cidadão no banco de dados');
    }
  }

  async findByCPF(cpf: string): Promise<Citizen | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT name, cpf FROM citizens WHERE cpf = ?',
        [cpf.replace(/\D/g, '')]
      );

      if (rows.length === 0) {
        return null;
      }

      const citizen = rows[0] as { name: string; cpf: string };
      return new Citizen(citizen.name, citizen.cpf);
    } catch (error) {
      console.error('Error finding citizen by CPF in database:', error);
      throw new Error('Erro ao buscar cidadão por CPF no banco de dados');
    }
  }

  async findByName(name: string): Promise<Citizen[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT name, cpf FROM citizens WHERE name LIKE ?',
        [`%${name}%`]
      );

      return rows.map(row => new Citizen(row.name, row.cpf));
    } catch (error) {
      console.error('Error finding citizens by name in database:', error);
      throw new Error('Erro ao buscar cidadãos por nome no banco de dados');
    }
  }

  async getAll(): Promise<Citizen[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT name, cpf FROM citizens'
      );

      return rows.map(row => new Citizen(row.name, row.cpf));
    } catch (error) {
      console.error('Error getting all citizens from database:', error);
      throw new Error('Erro ao buscar todos os cidadãos do banco de dados');
    }
  }
}