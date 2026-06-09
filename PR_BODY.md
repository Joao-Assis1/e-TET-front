# Implementação de Edge Cases Críticos

Este Pull Request engloba as resoluções de problemas apontados durante o planejamento do projeto:

- **Paginação:** Adicionado Infinite Scroll na tela de famílias para evitar travamento da UI com alto volume de dados (`FamilyListView`).
- **Tratamento de Erros:** Criação da `uiStore` e do `GlobalSnackbar` para exibir notificações ao usuário em caso de erros que falhavam silenciosamente.
- **Sincronização:** Tratamento visual para retorno de conflitos de concorrência na sincronização (Offline-first) na tela `SyncInconsistenciesView`.
- **Navegação:** Adicionado um Fallback na lógica de "Voltar" de todas as telas, protegendo contra erros quando o histórico do navegador for vazio (ex: reload manual da página).
- **Docker:** Adição do `.dockerignore` e `Dockerfile`.
- **Roadmap:** Adição do `ROADMAP.md` para futuros alunos.
