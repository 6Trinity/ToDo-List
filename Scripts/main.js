document.addEventListener('DOMContentLoaded', function() {

    const databox = document.getElementById('time-date-today');
    const scrollThreshold = 1;

    function updateDate() {
        const today = new Date();
        const weekdays = ['Sunday ', 'Monday', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday '];
        const dayName = weekdays[today.getDay()];
        const options = { day: 'numeric', month: 'long'};

        databox.textContent = `${dayName + " " +  today.toLocaleDateString('en-EN', options)}`;
    }

    updateDate();
    setInterval(updateDate, 86400000);

    const taskInput = document.getElementById('input-task-add');
    const addButton = document.getElementById('button-task-add');
    const taskList = document.getElementById('tasklist');
    const taskcolum = document.getElementById('alltask');

    taskList.addEventListener('scroll', function() {
        if (this.scrollTop > scrollThreshold) {
            taskList.classList.add('scrolled');
        } else {
            taskList.classList.remove('scrolled');
        }
    });

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
        taskElement.innerHTML = `
            <button class="button-task button-task-comp"><img src="IMG/Icon/check_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
            <span class="task-text">${taskText}</span>
            <textarea class="textarea-task-edit" style="display: none">${taskText}</textarea>
            <button class="button-task button-task-delete"><img src="IMG/Icon/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
            <button class="button-task button-task-edit"><img src="IMG/Icon/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>`;

        const textSpan = taskElement.querySelector('.task-text');
        const edittextarea = taskElement.querySelector('.textarea-task-edit');
        const editBtn = taskElement.querySelector('.button-task-edit');
        const comBtn = taskElement.querySelector('.button-task-comp');
        const delBtn = taskElement.querySelector('.button-task-delete');
  
        taskList.appendChild(taskElement);

        function toggleTaskCompletion(task) {
            task.classList.toggle('dablclick');
            saveTasksToStorage();
        }

        const isTextTruncated = textSpan.scrollHeight > textSpan.clientHeight;

        function fullsizing() {

            textSpan.classList.toggle('fullsize'); 
            editBtn.classList.toggle('fullsize'); 
            comBtn.classList.toggle('fullsize'); 
            delBtn.classList.toggle('fullsize'); 
        }

        textSpan.addEventListener('click', () => fullsizing());

        comBtn.addEventListener('click', () => toggleTaskCompletion(taskElement));
  
        delBtn.addEventListener('click', () => {
            taskElement.classList.add('fade-out');
            taskElement.addEventListener('animationend', () => {
                taskElement.remove();
                saveTasksToStorage();
            }, { once: true });
        });

        function autoResizeTextarea(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }

        edittextarea.addEventListener('input', () => autoResizeTextarea(edittextarea));

        editBtn.addEventListener('click', () => {
            textSpan.style.display = 'none';
            edittextarea.style.display = 'flex';
            edittextarea.focus();
            autoResizeTextarea(edittextarea);
        });

        edittextarea.addEventListener('blur', saveEdit);

        function saveEdit() {
            textSpan.textContent = edittextarea.value;
            textSpan.style.display = 'block';
            edittextarea.style.display = 'none';
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