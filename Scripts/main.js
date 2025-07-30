document.addEventListener('DOMContentLoaded', function() {

    const databox = document.getElementById('Section-task-add-calendar');

    function updateDate() {
        const today = new Date();
        const weekdays = ['Sunday ', 'Monday', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday '];
        const dayName = weekdays[today.getDay()];
        const options = { day: 'numeric', month: 'long'};

        databox.textContent = `${dayName + today.toLocaleDateString('en-EN', options)}`;
    }

    updateDate();
    setInterval(updateDate, 86400000);

    const taskInput = document.getElementById('input-task');
    const addButton = document.getElementById('button-task-add');
    const taskList = document.getElementById('Section-task-scroll-content');

    const taskcolum = document.getElementById('Section-task-add-task');

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
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `<button class="btn-complete"><img src="IMG/Icon/check_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
        <span class="task-text">${taskText}</span>
        <input type="text" class="task-edit" value="${taskText}" style="display: none;">
        <button class="delete-btn"><img src="IMG/Icon/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
        <button class="btn-edit"><img src="IMG/Icon/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>`;

        const textSpan = taskElement.querySelector('.task-text');
        const editInput = taskElement.querySelector('.task-edit');
        const editBtn = taskElement.querySelector('.btn-edit');
        const comBtn = taskElement.querySelector('.btn-complete');
  
        taskList.appendChild(taskElement);

        function toggleTaskCompletion(task) {
            task.classList.toggle('dablclick');
            saveTasksToStorage();
        }

        taskElement.addEventListener('dblclick', () => toggleTaskCompletion(taskElement));
        comBtn.addEventListener('click', () => toggleTaskCompletion(taskElement));
  
        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            taskElement.remove();
            saveTasksToStorage();
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

        setTimeout(() => {
            taskElement.classList.add('show');
        }, 10);

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