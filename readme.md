## 💡 Sobre o Projeto

Este é um Gerenciador de Tarefas desenvolvido com foco em persistência de dados e experiência do usuário (UX). Ele vai além da funcionalidade básica de adicionar/remover, demonstrando habilidades em manipulação complexa do DOM, gerenciamento de estado e arquitetura de dados (JSON).

**O que este projeto demonstra:**

* **Persistência de Dados:** Uso do **`localStorage`** para salvar tarefas, filtros e estados, garantindo que os dados permaneçam após o fechamento do navegador.
* **Gerenciamento de Estado:** Capacidade de atualizar a interface e o array de dados de forma síncrona (CRUD).
* **Filtros Dinâmicos:** Implementação de filtros (`Todas`, `Pendentes`, `Concluídas`) que reagem em tempo real à interação do usuário.

## ✨ Funcionalidades Especiais (Diferenciais)

1.  **Prioridade Visual:** Cada tarefa pode ser classificada como Alta (🔴), Média (🟡) ou Baixa (🟢) importância, refletida visualmente com um quadrado colorido.
2.  **Observações Expansíveis:** Um ícone de seta (▼) permite expandir a tarefa, revelando um campo de texto (`<textarea>`) para adicionar **notas e observações** detalhadas.
3.  **Edição Rápida:** O seletor de prioridade e o campo de notas permitem a **atualização** instantânea dos dados da tarefa.
4.  **Design Responsivo:** O layout é totalmente adaptável a telas de **celulares e tablets** (demonstrado pelo uso de Media Queries e Flexbox/Grid).

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| **HTML5 (Semântico)** | Estrutura da página e elementos de lista. |
| **CSS3** | Estilização, responsividade (`@media queries`), e animações. |

| **JavaScript (ES6+)** | Lógica de programação, manipulação do DOM e gerenciamento de dados no `localStorage`. |
