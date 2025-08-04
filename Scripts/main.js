document.addEventListener('DOMContentLoaded', function() {

    const databox = document.getElementById('time-date-today');
    const taskInput = document.getElementById('input-task-add');
    const addButton = document.getElementById('button-task-add');
    const taskList = document.getElementById('tasklist');
    const taskcolum = document.getElementById('alltask');
    const scrollThreshold = 1;

    updateDate();
    setInterval(updateDate, 86400000);
    loadTasks();

    function updateDate() {
        const today = new Date();
        const weekdays = ['Sunday ', 'Monday', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday '];
        const dayName = weekdays[today.getDay()];
        const options = { day: 'numeric', month: 'long'};

        databox.textContent = `${dayName + " " +  today.toLocaleDateString('en-EN', options)}`;
    }

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
        <button class="button-task button-task-edit"><img src="IMG/Icon/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
        <button class="button-task button-task-delete"><img src="IMG/Icon/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
        `;

        taskList.appendChild(taskElement);

        const textSpan = taskElement.querySelector('.task-text');
        const edittextarea = taskElement.querySelector('.textarea-task-edit');
        const editBtn = taskElement.querySelector('.button-task-edit');
        const comBtn = taskElement.querySelector('.button-task-comp');
        const delBtn = taskElement.querySelector('.button-task-delete');

        function toggleTaskCompletion(task) {
            task.classList.toggle('dablclick');
            saveTasksToStorage();
        }

        function saveEdit() {
            textSpan.textContent = edittextarea.value;
            textSpan.style.display = 'block';
            edittextarea.style.display = 'none';
            saveTasksToStorage();

        }

        function autoResizeTextarea(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight - 4) + 'px';
        }

        function toggleEditMode(enable) {
            const length = edittextarea.value.length;
            if (enable) {
                textSpan.style.display = 'none';
                edittextarea.setSelectionRange(length, length);
                edittextarea.style.display = 'block';
                edittextarea.focus();
                autoResizeTextarea(edittextarea);
                toggleFullsize(true);
        
            } else {
                textSpan.style.display = 'block';
                edittextarea.style.display = 'none';
                textSpan.textContent = edittextarea.value;
                saveTasksToStorage();
            }
        }


        function checkTruncation(textSpan) {
            return textSpan.offsetWidth < textSpan.scrollWidth;
        }

        function toggleFullsize(enable) {
            if (enable) {
                textSpan.classList.add('fullsize');
                editBtn.classList.add('fullsize');
                delBtn.classList.add('fullsize');
                comBtn.classList.add('fullsize');
            } else {
                textSpan.classList.remove('fullsize');
                editBtn.classList.remove('fullsize');
                delBtn.classList.remove('fullsize');
                comBtn.classList.remove('fullsize');
            }
        }

        textSpan.addEventListener('click',() => {
            const truncated  = checkTruncation(textSpan);
            if(textSpan.classList.contains('fullsize')){
                toggleFullsize(false);
            }else if(truncated){
                toggleFullsize(true);
            }else return;
        })

        editBtn.addEventListener('click', () =>{
            if(textSpan.style.display = 'none'){
                toggleEditMode(true);
            }
            else{
                toggleEditMode();
            }
        })



        delBtn.addEventListener('click', () => {
            taskElement.classList.add('fade-out');
            taskElement.addEventListener('animationend', () => {
                taskElement.remove();
                saveTasksToStorage();
            }, { once: true });
        });

        comBtn.addEventListener('click', () => toggleTaskCompletion(taskElement));

        edittextarea.addEventListener('input', () => autoResizeTextarea(edittextarea));
        edittextarea.addEventListener('blur', saveEdit);

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

    taskList.addEventListener('scroll', function() {
        if (this.scrollTop > scrollThreshold) {
            taskList.classList.add('scrolled');
        } else {
            taskList.classList.remove('scrolled');
        }
    });

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