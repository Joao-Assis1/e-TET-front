# 🤝 Guia do Desenvolvedor (Handover) - e-ACS

Bem-vindo ao projeto **e-ACS-front**! Este documento foi criado para facilitar a sua entrada no código e detalhar o estado exato da implementação atual.

## 1. O que já está implementado?
A arquitetura base (Offline-First) e as principais telas do Agente Comunitário de Saúde (ACS) já estão construídas na pasta `src/views`:
- **Autenticação:** `LoginView.vue`.
- **Domicílios:** `HouseholdListView.vue`, `HouseholdFormView.vue`, `HouseholdDetailView.vue`.
- **Famílias & Indivíduos:** `FamilyListView.vue`, `PersonListView.vue`, `IndividualFormView.vue`, `IndividualDetailView.vue`.
- **Visitas:** `FamilyVisitView.vue`, `IndividualVisitView.vue`, `VisitHistoryView.vue`.
- **Sincronização:** Toda a lógica de UI de sincronização, incluindo a resolução de conflitos temporais via `SyncInconsistenciesView.vue`.

## 2. Padrões de Código e Arquitetura Local
- **Gerenciamento de Estado (Pinia):** A pasta `src/stores` contém toda a lógica de dados persistentes. Como o aplicativo deve funcionar offline em zonas rurais, as requisições não vão direto para o Axios, mas sim para as stores locais.
- **Identificadores (UUID):** Para evitar problemas de IDs em lote offline, os IDs são gerados no cliente (híbrido) antes de serem submetidos para o banco (Neon).
- **Roteamento:** As rotas estão configuradas em `src/router/`.

## 3. Débitos Técnicos e Próximos Passos
Se você está assumindo o projeto agora, suas prioridades imediatas devem ser:
1. **Migração TS:** Alguns arquivos ainda estão em `.js` ou `.vue` sem `<script setup lang="ts">`. A migração progressiva está em andamento.
2. **Background Sync Worker:** O fluxo de "Pull/Push" atual depende do clique do usuário na tela de Sync. A próxima etapa de melhoria do UX é mover esse envio para um Service Worker (PWA Background Sync) em segundo plano.
3. **Testes E2E:** Adicionar scripts Playwright na pasta `/e2e` para validar o fluxo crítico offline completo (Login -> Cadastrar Off -> Reconectar -> Sync).
