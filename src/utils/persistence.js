/**
 * Utilitário para persistência de dados no IndexedDB via Dexie.
 * Evolução do antigo persistence.js que usava localStorage.
 */
import { db } from '../services/localDb';

const METADATA_PREFIX = 'meta_';

export const persistence = {
  /**
   * Salva dados genéricos (não entidades) no localStorage (ex: usuário, configurações).
   * Mantemos localStorage para dados pequenos e síncronos de inicialização.
   */
  save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`${METADATA_PREFIX}${key}`, serialized);
    } catch (err) {
      console.error(`Erro ao salvar ${key} no localStorage:`, err);
    }
  },

  /**
   * Carrega dados genéricos do localStorage.
   */
  load(key) {
    try {
      const data = localStorage.getItem(`${METADATA_PREFIX}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Erro ao carregar ${key} do localStorage:`, err);
      return null;
    }
  },

  /**
   * Limpa todos os dados (LocalStorage e IndexedDB).
   */
  async clearAll() {
    // Limpa localStorage da aplicação
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(METADATA_PREFIX) || key.startsWith('etet_')) {
        localStorage.removeItem(key);
      }
    });

    // Limpa IndexedDB
    await db.clearAll();
  }
};
