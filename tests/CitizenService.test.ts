import { ICitizenRepository } from '../src/repositories/ICitizenRepository';
import { Citizen } from '../src/models/Citizen';
import { CitizenService } from '../src/services/CitizenService';

class MockCitizenRepository implements ICitizenRepository {
  private citizens: Citizen[] = [];

  async create(citizen: Citizen): Promise<void> {
    this.citizens.push(citizen);
  }

  async findByCPF(cpf: string): Promise<Citizen | null> {
    const citizen = this.citizens.find(c => c.cpf === cpf);
    return citizen || null;
  }

  async findByName(name: string): Promise<Citizen[]> {
    return this.citizens.filter(c => 
      c.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async updateByCPF(name: string, cpf: string): Promise<void> {
    const citizen = this.citizens.find(c => c.cpf === cpf);
    if(citizen)
      citizen.name = name;
  }

  async deleteByCPF(cpf: string): Promise<void> {
    const formattedCPF = cpf.replace(/\D/g, ''); 
    const index = this.citizens.findIndex(c => c.cpf === formattedCPF);
    if (index !== -1) {
        this.citizens.splice(index, 1);
    }
}

  async getAll(): Promise<Citizen[]> {
    return [...this.citizens];
  }
}

describe('CitizenService', () => {
  let service: CitizenService;
  let repository: ICitizenRepository;

  beforeEach(() => {
    repository = new MockCitizenRepository();
    service = new CitizenService(repository);
  });

  describe('validateCPF', () => {
    it('should validate a correct CPF', () => {
      expect(service.validateCPF('529.982.247-25')).toBe(true);
    });

    it('should invalidate an incorrect CPF', () => {
      expect(service.validateCPF('111.111.111-11')).toBe(false);
    });
  });

  describe('createCitizen', () => {
    it('should create a citizen with valid data', async () => {
      const citizen = await service.createCitizen('João Silva', '529.982.247-25');
      expect(citizen.name).toBe('João Silva');
      expect(citizen.cpf).toBe('52998224725');
    });

    it('should throw error for empty name', async () => {
      await expect(service.createCitizen('', '529.982.247-25'))
        .rejects
        .toThrow('Nome é obrigatório');
    });

    it('should throw error for invalid CPF', async () => {
      await expect(service.createCitizen('João Silva', '111.111.111-11'))
        .rejects
        .toThrow('CPF inválido');
    });

    it('should throw error for duplicate CPF', async () => {
      await service.createCitizen('João Silva', '529.982.247-25');
      await expect(service.createCitizen('Maria Silva', '529.982.247-25'))
        .rejects
        .toThrow('CPF já cadastrado');
    });
  });

  describe('findByCPF', () => {
    it('should find citizen by CPF', async () => {
      await service.createCitizen('João Silva', '529.982.247-25');
      const found = await service.findByCPF('529.982.247-25');
      expect(found).toBeDefined();
      expect(found?.name).toBe('João Silva');
    });

    it('should return null for non-existent CPF', async () => {
      const found = await service.findByCPF('529.982.247-25');
      expect(found).toBeNull();
    });
  });

  describe('findByName', () => {
    beforeEach(async () => {
      await service.createCitizen('João Silva', '529.982.247-25');
      await service.createCitizen('Maria Silva', '987.654.321-00');
    });

    it('should find citizens by name', async () => {
      const found = await service.findByName('Silva');
      expect(found.length).toBe(2);
    });

    it('should find citizens by partial name', async () => {
      const found = await service.findByName('João');
      expect(found.length).toBe(1);
      expect(found[0].name).toBe('João Silva');
    });

    it('should return empty array when no matches', async () => {
      const found = await service.findByName('Pedro');
      expect(found.length).toBe(0);
    });
  });

  describe('updateByCPF', () => {
    beforeEach(async () => {
      await service.createCitizen('João Silva', '529.982.247-25');
    });
  
    it('should update citizen name by CPF', async () => {
      await service.updateByCPF('João Carlos', '529.982.247-25');
      const updated = await service.findByCPF('529.982.247-25');
      expect(updated).toBeDefined();
      expect(updated?.name).toBe('João Carlos');
    });
  
    it('should not throw error for non-existent CPF', async () => {
      await expect(service.updateByCPF('Pedro Souza', '987.654.321-00')).resolves.not.toThrow();
      const found = await service.findByCPF('987.654.321-00');
      expect(found).toBeNull();
    });
  });

  describe('deleteByCPF', () => {
    beforeEach(async () => {
      await service.createCitizen('João Silva', '529.982.247-25');
    });
  
    it('should delete citizen by CPF', async () => {
      await service.deleteByCPF('529.982.247-25');
      const deleted = await service.findByCPF('529.982.247-25');
      expect(deleted).toBeNull();
    });
  
    it('should not throw error for non-existent CPF', async () => {
      await expect(service.deleteByCPF('987.654.321-00')).resolves.not.toThrow();
      const found = await service.findByCPF('987.654.321-00');
      expect(found).toBeNull();
    });
  });
});