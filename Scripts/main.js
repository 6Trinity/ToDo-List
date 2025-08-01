document.addEventListener('DOMContentLoaded', function() {

    const databox = document.getElementById('time-date-today');

    function updateDate() {
        const today = new Date();
        const weekdays = ['Sunday ', 'Monday', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday '];
        const dayName = weekdays[today.getDay()];
        const options = { day: 'numeric', month: 'long'};

        databox.textContent = `${dayName + today.toLocaleDateString('en-EN', options)}`;
    }

    updateDate();
    setInterval(updateDate, 86400000);

    const taskInput = document.getElementById('input-task-add');
    const addButton = document.getElementById('button-task-add');
    const taskList = document.getElementById('tasklist');
    const taskcolum = document.getElementById('alltask');

    loadTasks();

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            const taskElement = createTaskElement(task.text);
             if (task.dablclick) {
                taskElement.classList.add('dablclick');
            }
        });
        taskcolum.textContent = document.querySelectorAll('.task:not(.dablclick)').length;
    }

    function createTaskElement(taskText) {
        const taskElement = document.createElement('article');
        taskElement.className = 'task';
        taskElement.innerHTML = `<button class="button-task button-task-comp"><img src="IMG/Icon/check_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
        <span class="task-text">${taskText}</span>
        <input type="text" class="input-task-edit" value="${taskText}" style="display: none;">
        <button class="button-task button-task-delete"><img src="IMG/Icon/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
        <button class="button-task button-task-edit"><img src="IMG/Icon/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>`;

        const textSpan = taskElement.querySelector('.task-text');
        const editInput = taskElement.querySelector('.input-task-edit');
        const editBtn = taskElement.querySelector('.button-task-edit');
        const comBtn = taskElement.querySelector('.button-task-comp');
  
        taskList.appendChild(taskElement);

        function toggleTaskCompletion(task) {
            task.classList.toggle('dablclick');
            saveTasksToStorage();
        }

        taskElement.addEventListener('dblclick', () => toggleTaskCompletion(taskElement));
        comBtn.addEventListener('click', () => toggleTaskCompletion(taskElement));
  
        taskElement.querySelector('.button-task-delete').addEventListener('click', () => {
            taskElement.classList.add('fade-out');
            taskElement.addEventListener('animationend', () => {
            taskElement.remove();
            saveTasksToStorage();
        }, { once: true });
        });

        editBtn.addEventListener('click', () => {
            textSpan.style.display = 'none';
            editInput.style.display = 'block';
            editInput.focus();
        });

        editInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') saveEdit();
        });

        editInput.addEventListener('blur', saveEdit);

        function saveEdit() {
            textSpan.textContent = editInput.value;
            textSpan.style.display = 'block';
            editInput.style.display = 'none';
            saveTasksToStorage();
        }

        taskList.scrollTop = taskList.scrollHeight;
        return taskElement;
    }
 
    function saveTasksToStorage() {
        const tasks = Array.from(document.querySelectorAll('.task')).map(task => ({
            text: task.querySelector('span').textContent,
            dablclick: task.classList.contains('dablclick')
        }));
        taskcolum.textContent = document.querySelectorAll('.task:not(.dablclick)').length;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }  

    addButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            createTaskElement(taskText);
            saveTasksToStorage();

            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });
});