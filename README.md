# 📱 e-ACS: Coleta de Dados em Campo

Aplicativo mobile/front-end construído para os Agentes Comunitários de Saúde (ACS). Utilizado em tablets e smartphones, permite o cadastramento e acompanhamento contínuo de **Domicílios, Famílias e Cidadãos**, coletando determinantes sociais e de saúde (hipertensão, diabetes, gestação, etc.) diretamente no território.

## 🚀 Arquitetura e Estratégia
*   **Offline-First:** O aplicativo possui armazenamento robusto local e fila de requisições, garantindo que o agente possa atuar em áreas remotas e sincronizar os dados com o motor central (e-TET-api) apenas quando possuir conexão.
*   **Integração:** Conecta-se de forma bidirecional com a API, preservando UUIDs gerados no dispositivo e resolvendo colisões temporais (Pull/Push Sync).

## 🛠️ Tecnologias Principais
*   **Framework:** Vue 3 + Vite
*   **State Management:** Pinia (com persistência offline)
*   **Linguagem:** JavaScript / TypeScript (em migração)

## 📦 Instalação e Execução

Pré-requisitos: Node.js (v18+)

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Gerar a build de produção
npm run build
```

## 📚 Documentação Complementar
Você pode conferir detalhes arquiteturais mais específicos na pasta `docs/`:
- [Roadmap de Funcionalidades](docs/ROADMAP.md)
- [Relatório de Testes de Sincronização (Neon)](docs/TEST_REPORT_SYNC_NEON.md)
- [Descobertas e Notas Técnicas (Findings)](docs/findings.md)
- [Plano de Sync Território v2](docs/sync-territory-v2.md)
- [Tarefas Front-End](docs/task_plan.md)
