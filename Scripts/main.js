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

    loadTasks();

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(taskText => {
            createTaskElement(taskText);
        });
    }

    function createTaskElement(taskText) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `<span>${taskText}</span>
        <button class="delete-btn"><img src="IMG/Icon/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>
        <button class="btn-edit"><img src="IMG/Icon/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"></button>`;
  
        taskList.appendChild(taskElement);
  
        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            taskElement.remove();
            saveTasksToStorage();
        });

        setTimeout(() => {
                taskElement.classList.add('show');
        }, 10);
        taskList.scrollTop = taskList.scrollHeight;
    }

    
    function saveTasksToStorage() {
        const tasks = Array.from(document.querySelectorAll('.task span')).map(span => span.textContent);
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