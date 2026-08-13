# Padrões de Documentação (Guardrails)

Este documento atua como um **Guardrail Passivo** para o projeto e-ACS-front. Ele estabelece as fronteiras do que deve ser documentado e como mantermos o Princípio da Fonte Única de Verdade (Single Source of Truth - SSOT).

## 1. Single Source of Truth (SSOT)
A pasta `docs/` é o **único local** onde a documentação do projeto vive.
- **Não** adicione guias detalhados no `README.md`. O `README.md` serve exclusivamente como índice e direcionador para a pasta `docs/`.
- **Não** mantenha documentos técnicos no Google Drive, Notion, Confluence ou ferramentas externas caso eles descrevam funcionamento de código, pois eles invariavelmente descolarão da versão atual (Information Drift).

## 2. A Estrutura da Pasta `docs/`
- `docs/architecture/`: Documente aqui as decisões técnicas, mudanças de fluxo de dados (como o sincronismo de território), ADRs (Architecture Decision Records) e Diagramas (usando MermaidJS).
- `docs/guides/`: Guias voltados para o desenvolvedor (como configurar o Mac/Windows, variáveis de ambiente, troubleshootings conhecidos).
- `docs/guardrails/`: Este diretório (regras e limites estabelecidos).
- `docs/handover/`: O material para onboarding de um novo membro da equipe, ensinando o "como fazer".

## 3. Information Drift (O que NÃO documentar)
- Evite explicar linha a linha do código na documentação (o código deve ser legível por si só).
- Se a interface do usuário for muito volátil, não tire screenshots fixas na documentação principal a menos que seja para o Guia de Onboarding (`docs/handover/`).

## 4. O Checklist do Pull Request (Active Guardrail)
É **estritamente proibido** aprovar um Pull Request (PR) que adicione ou altere uma regra de negócio complexa sem a devida atualização do respectivo arquivo `.md` na pasta `docs/`. O `.github/PULL_REQUEST_TEMPLATE.md` fará essa verificação.
