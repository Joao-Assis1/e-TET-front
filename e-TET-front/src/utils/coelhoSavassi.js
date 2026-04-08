/**
 * Cálculo de Classificação de Risco Familiar (Escala de Coelho e Savassi)
 * Adaptado para os critérios e-SUS APS
 */

export function calculateFamilyRisk(family, household) {
  let r = 0

  // Saneamento Inadequado (Family) = 3 pontos
  if (family && family.saneamento_inadequado) {
    r += 3
  }

  // Fatores Individuais (Cidadãos)
  if (family && Array.isArray(family.individuals)) {
    for (const ind of family.individuals) {
      // No Frontend, o data object bruto enviado está em ind._healthObject se foi mapeado,
      // ou devemos olhar as strings em ind.healthConditions
      const _hc = ind._healthObject || {}
      
      if (_hc.acamado_domiciliado) r += 3
      if (ind.possui_deficiencia) r += 3

      if (_hc.uso_alcool || _hc.uso_outras_drogas || _hc.fumante) r += 2
      
      // Desemprego
      if (ind.situacao_mercado_trabalho === 'Desempregado' || ind.situacao_mercado_trabalho === 'Asalariado sem carteira assinada') {
        // Adaptando pro backend, conta 2
        r += 2
      } else if (ind.situacao_mercado_trabalho === 'Desempregado') {
        // Garantindo consistencia estrita se for apenas Desempregado
        r += 2
      } // Pra ficar 100% igual ao backend:
      
      // Condições etárias
      if (ind.data_nascimento) {
        const birthStr = String(ind.data_nascimento)
        let birth
        if (birthStr.includes('/')) {
          const parts = birthStr.split('/')
          if (parts.length === 3) birth = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`)
        } else {
          birth = new Date(birthStr)
        }

        if (birth && !isNaN(birth.getTime())) {
          const ageMonths = (new Date() - birth) / (1000 * 60 * 60 * 24 * 30.44)
          const ageYears = Math.abs(new Date(Date.now() - birth.getTime()).getUTCFullYear() - 1970)
          
          if (ageMonths < 6) r += 1
          if (ageYears > 70) r += 1
        }
      }
      
      if (_hc.hipertensao_arterial) r += 1
      if (_hc.diabetes) r += 1
    }
  }

  // Determinar Faixa de Risco igual ao Backend
  if (r >= 9) {
    return {
      label: 'R3',
      color: 'red-darken-2',
      icon: 'mdi-alert-octagon',
      score: r,
      description: 'Risco Máximo',
    }
  } else if (r >= 7) {
    return {
      label: 'R2',
      color: 'orange-darken-2',
      icon: 'mdi-alert',
      score: r,
      description: 'Risco Médio',
    }
  } else if (r >= 5) {
    return {
      label: 'R1',
      color: 'blue',
      icon: 'mdi-alert-circle-outline',
      score: r,
      description: 'Risco Menor',
    }
  } else {
    return {
      label: 'R0',
      color: 'blue-grey',
      icon: 'mdi-shield-check',
      score: r,
      description: 'Sem Risco',
    }
  }
}
