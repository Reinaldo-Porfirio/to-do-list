// 1. Seleção dos Elementos HTML
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Seleção dos Botões de Filtro
const filterAllBtn = document.getElementById('filterAll');
const filterPendingBtn = document.getElementById('filterPending');
const filterCompletedBtn = document.getElementById('filterCompleted');

// Variável de estado para o filtro ativo
let currentFilter = 'all'; // Pode ser 'all', 'pending', ou 'completed'

// =======================================================
// A. FUNÇÕES ESSENCIAIS DE PERSISTÊNCIA E FILTRO
// =======================================================

// 1. CARREGAR TAREFAS (Inalterada)
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// 2. SALVAR TAREFAS (Inalterada)
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 3. FUNÇÃO PARA FILTRAR AS TAREFAS ANTES DE RENDERIZAR
function getFilteredTasks(filter) {
    const tasks = getTasks();
    if (filter === 'pending') {
        return tasks.filter(task => !task.completed);
    }
    if (filter === 'completed') {
        return tasks.filter(task => task.completed);
    }
    return tasks; // 'all'
}

// =======================================================
// B. FUNÇÕES DE MANIPULAÇÃO DA INTERFACE (DOM)
// =======================================================

// 4. ADICIONAR NOVA TAREFA (Com Prioridade e Notas)
function addTask() {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Por favor, digite uma tarefa válida.');
        return;
    }

    // Estrutura de tarefa atualizada
    const newTask = { 
        text: text, 
        completed: false,
        priority: 'low', // Padrão: baixa
        notes: ''        // Padrão: vazio
    };

    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    taskInput.value = '';
    renderTasks();
}

// 5. RENDERIZAR TAREFAS (Atualizado com Prioridade e Detalhes)
function renderTasks() {
    taskList.innerHTML = '';
    
    // Pega APENAS as tarefas filtradas
    const tasksToDisplay = getFilteredTasks(currentFilter); 

    if (tasksToDisplay.length === 0 && getTasks().length > 0) {
        taskList.innerHTML = `<p class="no-tasks">Nenhuma tarefa ${currentFilter === 'pending' ? 'pendente' : 'concluída'} para mostrar.</p>`;
        return;
    } else if (getTasks().length === 0) {
         taskList.innerHTML = `<p class="no-tasks">Nenhuma tarefa adicionada ainda.</p>`;
         return;
    }

    tasksToDisplay.forEach((task, index) => {
        // Encontra o índice original no array 'tasks' (necessário após o filtro)
        const originalIndex = getTasks().findIndex(t => t.text === task.text && t.priority === task.priority);

        // --- ITEM PRINCIPAL (li) ---
        const listItem = document.createElement('li');
        listItem.classList.add(`priority-${task.priority}`); // Adiciona classe de prioridade
        if (task.completed) {
            listItem.classList.add('completed');
        }

        // --- CONTEÚDO PRINCIPAL (div) ---
        const mainContent = document.createElement('div');
        mainContent.classList.add('task-main-content');

        // Quadrado de Prioridade (Visual)
        const prioritySquare = document.createElement('div');
        prioritySquare.classList.add('priority-square');
        prioritySquare.title = `Prioridade: ${task.priority.toUpperCase()}`;

        // Texto da Tarefa
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        
        // Botões de Ação
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');
        
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Desfazer' : 'Concluir';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => toggleTaskCompletion(originalIndex));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(originalIndex));
        
        actionButtons.appendChild(completeBtn);
        actionButtons.appendChild(deleteBtn);

        mainContent.appendChild(prioritySquare);
        mainContent.appendChild(taskText);
        
        // --- DETALHES EXPANSÍVEIS (div.details) ---
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('task-details');
        
        const arrow = document.createElement('span');
        arrow.textContent = '▼';
        arrow.classList.add('toggle-arrow');
        arrow.addEventListener('click', () => toggleDetails(detailsContainer, arrow)); // Função de expansão

        // Adiciona a seta ao mainContent
        mainContent.appendChild(arrow);
        mainContent.appendChild(actionButtons); // Adiciona botões de ação

        // Conteúdo da expansão (prioridade, notas e edição)
        detailsContainer.innerHTML = `
            <div class="priority-selector">
                <label>Prioridade:</label>
                <select onchange="updateTaskPriority(${originalIndex}, this.value)">
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Baixa (Verde)</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Média (Amarela)</option>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Alta (Vermelha)</option>
                </select>
            </div>
            <label for="notes-${originalIndex}">Observações:</label>
            <textarea id="notes-${originalIndex}" 
                      onchange="updateTaskNotes(${originalIndex}, this.value)" 
                      placeholder="Adicione observações aqui...">${task.notes}</textarea>
        `;
        
        // Monta o item final
        listItem.appendChild(mainContent);
        listItem.appendChild(detailsContainer);

        taskList.appendChild(listItem);
    });
}

// 6. FUNÇÃO DE EXPANDIR/RECOLHER DETALHES
function toggleDetails(detailsElement, arrowElement) {
    detailsElement.classList.toggle('expanded');
    // Altera a seta de ▼ para ▲
    arrowElement.textContent = detailsElement.classList.contains('expanded') ? '▲' : '▼';
}


// C. FUNÇÕES DE LÓGICA DE DADOS (Atualizadas para Prioridade/Notas)

// 7. ATUALIZAR PRIORIDADE
function updateTaskPriority(index, newPriority) {
    const tasks = getTasks();
    tasks[index].priority = newPriority;
    saveTasks(tasks);
    renderTasks(); // Renderiza novamente para atualizar a cor do quadrado
}

// 8. ATUALIZAR NOTAS
function updateTaskNotes(index, newNotes) {
    const tasks = getTasks();
    tasks[index].notes = newNotes;
    saveTasks(tasks);
    // Não precisa de render, mas salva o dado imediatamente
}

// 9. FUNÇÃO DE FILTRAGEM
function setFilter(filter) {
    currentFilter = filter;
    
    // Atualiza a classe 'active' nos botões de filtro
    filterAllBtn.classList.remove('active');
    filterPendingBtn.classList.remove('active');
    filterCompletedBtn.classList.remove('active');

    if (filter === 'all') filterAllBtn.classList.add('active');
    else if (filter === 'pending') filterPendingBtn.classList.add('active');
    else if (filter === 'completed') filterCompletedBtn.classList.add('active');

    renderTasks(); // Renderiza a lista com o novo filtro
}

// 10. TOGGLE E DELETE (Inalteradas)
function toggleTaskCompletion(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}


// =======================================================
// D. EVENT LISTENERS E INICIALIZAÇÃO
// =======================================================

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Eventos dos Botões de Filtro
filterAllBtn.addEventListener('click', () => setFilter('all'));
filterPendingBtn.addEventListener('click', () => setFilter('pending'));
filterCompletedBtn.addEventListener('click', () => setFilter('completed'));

// Carrega as tarefas salvas quando a página é aberta
renderTasks();