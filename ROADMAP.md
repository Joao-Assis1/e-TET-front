# Roadmap: e-ACS-front

Este roadmap contém as melhorias técnicas planejadas para a aplicação mobile/front-end do agente comunitário de saúde.
Essas tarefas também estão registradas como *Issues* no GitHub para acompanhamento e desenvolvimento futuro.

## 1. Evolução do Offline-First (Background Sync)
- **Descrição:** Implementar a API de *Background Sync* do Service Worker (Vite PWA).
- **Objetivo:** Fazer com que as sincronizações pendentes ocorram automaticamente no plano de fundo assim que o tablet detectar uma conexão com a internet, sem a necessidade do ACS clicar ativamente em "Sincronizar".

## 2. Resolução Visual de Conflitos (Merge UI)
- **Descrição:** Evoluir a tela de `SyncInconsistenciesView.vue`.
- **Objetivo:** Quando houver conflito de concorrência (ex: outro tablet atualizou o dado), exibir uma tela de comparação "Lado a Lado" para o usuário escolher manualmente qual versão (Local vs Servidor) deve prevalecer de forma granular.

## 3. Migração para TypeScript
- **Descrição:** Migrar progressivamente os componentes de `<script setup>` para `<script setup lang="ts">`.
- **Objetivo:** Adicionar tipagem estática às Stores (Pinia) e aos payloads de requisição da API para prevenir bugs de refatoração, documentando melhor o formato esperado das entidades (Individual, Household, Family).

## 4. Testes End-to-End (E2E) com Playwright
- **Descrição:** Implementar suítes de teste de integração front-end utilizando Playwright.
- **Objetivo:** Simular o fluxo completo de um ACS (Login -> Criar Cidadão Offline -> Religação de Rede -> Sincronização) para garantir que nenhuma nova funcionalidade quebre o fluxo vital da aplicação.
