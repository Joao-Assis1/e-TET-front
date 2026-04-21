import { describe, it, expect } from 'vitest'
import { sanitizeIndividualPayload, sanitizeHouseholdPayload } from './sanitizePayload'

describe('sanitizePayload.js (Unit Tests)', () => {
  it('deve remover caracteres especiais de CPF e CNS', () => {
    const raw = {
      cpf: '123.456.789-00',
      cartao_sus: '123 4567 8901 2345',
      nome_completo: 'Joao Silva'
    }
    const clean = sanitizeIndividualPayload(raw)
    expect(clean.cpf).toBe('12345678900')
    expect(clean.cartao_sus).toBe('123456789012345')
  })

  it('deve remover mascara de CEP e telefones de domicilio', () => {
    const raw = {
      cep: '12345-678',
      telefone_contato: '(11) 98888-7777',
      logradouro: 'Rua das Flores'
    }
    const clean = sanitizeHouseholdPayload(raw)
    expect(clean.cep).toBe('12345678')
    expect(clean.telefone_contato).toBe('11988887777')
  })

  it('deve injetar metadados de auditoria se presentes', () => {
    const raw = {
      logradouro: 'Rua A',
      createdBy: '12345678900',
      updatedAt: '2026-04-20T20:00:00Z'
    }
    const clean = sanitizeHouseholdPayload(raw)
    expect(clean.createdBy).toBe('12345678900')
    expect(clean.updatedAt).toBe('2026-04-20T20:00:00Z')
  })
})
