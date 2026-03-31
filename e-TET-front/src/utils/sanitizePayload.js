/**
 * Sanitize Payload Utilities for e-TET API
 *
 * A API usa whitelist: true + forbidNonWhitelisted: true.
 * Campos extras geram erro 400. Estas funções constroem objetos
 * contendo APENAS as propriedades exigidas pela API.
 */

// ---------- Family payload (para POST /sync/family → campo "family") ----------

const FAMILY_WHITELIST = [
  'numero_prontuario',
  'renda_familiar',
  'numero_membros',
  'reside_desde',
  'saneamento_inadequado',
  'household_id',
]

export function sanitizeFamilyPayload(raw) {
  const clean = {}

  for (const key of FAMILY_WHITELIST) {
    if (raw[key] !== undefined) {
      clean[key] = raw[key]
    }
  }

  // Tipagem estrita
  clean.renda_familiar = Number(clean.renda_familiar) || 0
  clean.numero_membros = parseInt(clean.numero_membros, 10) || 1
  clean.saneamento_inadequado = clean.saneamento_inadequado === true

  // Data ISO YYYY-MM-DD
  if (clean.reside_desde) {
    clean.reside_desde = formatDateISO(clean.reside_desde)
  }

  return clean
}

// ---------- Individual payload (para POST /sync/family → dentro de "individuals[]") ----------

// Campos aceitos pelo SyncIndividualDto (sem family_id — inferido pela API no sync)
const SYNC_INDIVIDUAL_WHITELIST = [
  'id',
  'is_responsavel',
  'possui_cartao_sus',
  'cartao_sus',
  'cpf',
  'nome_completo',
  'nome_social',
  'data_nascimento',
  'sexo',
  'raca_cor',
  'nacionalidade',
  'desempregado',
  'analfabeto',
  'telefone_celular',
  'email',
  'nome_mae_desconhecido',
  'nome_mae',
  'nome_pai_desconhecido',
  'nome_pai',
  'possui_deficiencia',
  'deficiencias',
  'gestante',
  'maternidade_referencia',
  'situacao_peso',
  'fumante',
  'uso_alcool',
  'uso_outras_drogas',
  'hipertensao_arterial',
  'diabetes',
  'teve_avc_derrame',
  'teve_infarto',
  'doenca_cardiaca',
  'doencas_cardiacas_quais',
  'problemas_rins',
  'problemas_rins_quais',
  'doenca_respiratoria',
  'doencas_respiratorias_quais',
  'tuberculose',
  'hanseniase',
  'teve_cancer',
  'doenca_mental_psiquiatrica',
  'acamado',
  'domiciliado',
  'usa_plantas_medicinais',
]

// Campos que DEVEM ser booleanos estritos (true/false)
const BOOLEAN_FIELDS = [
  'is_responsavel',
  'possui_cartao_sus',
  'desempregado',
  'analfabeto',
  'nome_mae_desconhecido',
  'nome_pai_desconhecido',
  'possui_deficiencia',
  'gestante',
  'fumante',
  'uso_alcool',
  'uso_outras_drogas',
  'hipertensao_arterial',
  'diabetes',
  'teve_avc_derrame',
  'teve_infarto',
  'doenca_cardiaca',
  'problemas_rins',
  'doenca_respiratoria',
  'tuberculose',
  'hanseniase',
  'teve_cancer',
  'doenca_mental_psiquiatrica',
  'acamado',
  'domiciliado',
  'usa_plantas_medicinais',
]

// Enums exatos aceitos pela API
const VALID_SEXO = ['Masculino', 'Feminino']
const VALID_RACA_COR = ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena']
const VALID_NACIONALIDADE = ['Brasileira', 'Naturalizado', 'Estrangeiro']
const VALID_SITUACAO_PESO = ['Adequado', 'Abaixo', 'Acima']

export function sanitizeIndividualPayload(raw, { forSync = true } = {}) {
  const whitelist = forSync ? SYNC_INDIVIDUAL_WHITELIST : [...SYNC_INDIVIDUAL_WHITELIST, 'family_id']
  const clean = {}

  // 1. Copiar apenas campos da whitelist
  for (const key of whitelist) {
    if (raw[key] !== undefined) {
      clean[key] = raw[key]
    }
  }

  // 2. Converter todos os booleanos para true/false estrito
  for (const key of BOOLEAN_FIELDS) {
    if (key in clean) {
      clean[key] = clean[key] === true
    }
  }

  // 3. Data ISO YYYY-MM-DD
  if (clean.data_nascimento) {
    clean.data_nascimento = formatDateISO(clean.data_nascimento)
  }

  // 4. Validar enums (case-sensitive)
  if (clean.sexo && !VALID_SEXO.includes(clean.sexo)) {
    console.warn(`[sanitize] Valor inválido para sexo: "${clean.sexo}". Valores aceitos: ${VALID_SEXO.join(', ')}`)
  }
  if (clean.raca_cor && !VALID_RACA_COR.includes(clean.raca_cor)) {
    console.warn(`[sanitize] Valor inválido para raca_cor: "${clean.raca_cor}". Valores aceitos: ${VALID_RACA_COR.join(', ')}`)
  }
  if (clean.nacionalidade && !VALID_NACIONALIDADE.includes(clean.nacionalidade)) {
    console.warn(`[sanitize] Valor inválido para nacionalidade: "${clean.nacionalidade}". Valores aceitos: ${VALID_NACIONALIDADE.join(', ')}`)
  }
  if (clean.situacao_peso && !VALID_SITUACAO_PESO.includes(clean.situacao_peso)) {
    console.warn(`[sanitize] Valor inválido para situacao_peso: "${clean.situacao_peso}". Valores aceitos: ${VALID_SITUACAO_PESO.join(', ')}`)
  }

  // 5. Campos condicionais — deficiências
  if (clean.possui_deficiencia === false) {
    delete clean.deficiencias
  } else if (clean.possui_deficiencia === true) {
    clean.deficiencias = Array.isArray(clean.deficiencias) && clean.deficiencias.length > 0
      ? clean.deficiencias
      : ['Outra']
  }

  // 6. Campos condicionais — cartão SUS
  if (clean.possui_cartao_sus === false) {
    delete clean.cartao_sus
  }

  // 7. Campos condicionais — gestante (só se sexo === 'Feminino')
  if (clean.sexo !== 'Feminino') {
    delete clean.gestante
    delete clean.maternidade_referencia
  } else if (clean.gestante === false) {
    delete clean.maternidade_referencia
  }

  // 8. Campos condicionais — doenças com detalhamento
  if (clean.doenca_cardiaca === false) {
    delete clean.doencas_cardiacas_quais
  }
  if (clean.problemas_rins === false) {
    delete clean.problemas_rins_quais
  }
  if (clean.doenca_respiratoria === false) {
    delete clean.doencas_respiratorias_quais
  }

  // 9. Remover strings vazias opcionais para evitar validação desnecessária
  const optionalStrings = ['nome_social', 'telefone_celular', 'email', 'nome_pai', 'cpf']
  for (const key of optionalStrings) {
    if (clean[key] === '' || clean[key] === null || clean[key] === undefined) {
      delete clean[key]
    }
  }

  return clean
}

// ---------- Helpers ----------

function formatDateISO(dateValue) {
  if (!dateValue) return undefined
  // Se já está em formato YYYY-MM-DD, retornar como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue
  // Tentar parse e formatar
  const d = new Date(dateValue)
  if (isNaN(d.getTime())) return dateValue
  return d.toISOString().split('T')[0]
}
