import Dexie from 'dexie';

export class LocalDatabase extends Dexie {
  constructor() {
    super('eAcsLocalDb');
    
    // Definição do Schema
    // ++id indica auto-incremento (para IDs locais se necessário)
    // id é o UUID vindo do backend ou gerado localmente
    this.version(1).stores({
      households: 'id, logradouro, bairro, syncStatus, createdBy',
      families: 'id, household_id, numero_prontuario, syncStatus, createdBy',
      individuals: 'id, family_id, household_id, cpf, cartao_sus, syncStatus, createdBy',
      visits: 'id, household_id, family_id, individual_id, data_visita, syncStatus, createdBy'
    });
  }

  /**
   * Limpa todos os dados do banco local.
   */
  async clearAll() {
    await Promise.all([
      this.households.clear(),
      this.families.clear(),
      this.individuals.clear(),
      this.visits.clear()
    ]);
  }
}

export const db = new LocalDatabase();
