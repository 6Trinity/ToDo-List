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

    function addTask() {
        const taskText = taskInput.value.trim();
  
        if (taskText === '') {
            alert('Введите текст задачи!');
            return;
        }

        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `<span>${taskText}</span>`;

        taskList.appendChild(taskElement);

        setTimeout(() => {
            taskElement.classList.add('show');
        }, 10);

        taskInput.value = '';
        taskList.scrollTop = taskList.scrollHeight;
    }

    addButton.addEventListener('click', addTask);
  
});