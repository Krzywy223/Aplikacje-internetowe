class Todo {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 0;
        this.loadTasks();
        this.draw();
    }

    addTask(taskName, taskDate) {
        const today = new Date().toISOString().split('T')[0];
        if (taskName.length >= 3 && taskName.length <= 255 && (taskDate === "" || taskDate >= today)) {
            const task = {
                id: `task-${this.taskIdCounter++}`,
                name: taskName,
                date: taskDate || "no date"
            };
            this.tasks.push(task);
            this.saveTasks();
            this.draw();
        }
    }

    editTaskName(taskId, newTaskName) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && newTaskName.length >= 3 && newTaskName.length <= 255) {
            task.name = newTaskName;
            this.saveTasks();
            this.draw();
        }
    }

    editTaskDate(taskId, newTaskDate) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.date = newTaskDate >= new Date().toISOString().split('T')[0] ? newTaskDate : "no date";
            this.saveTasks();
            this.draw();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.draw();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasks = savedTasks;
        this.taskIdCounter = this.tasks.length ? Math.max(...this.tasks.map(task => parseInt(task.id.split('-')[1]))) + 1 : 0;
    }

    draw() {
        const ul = document.getElementById("taskList");
        ul.innerHTML = '';

        this.tasks.forEach(task => {
            const li = document.createElement("li");
            li.id = task.id;

            const taskSpan = document.createElement("span");
            taskSpan.className = "task-name collapsed";
            taskSpan.textContent = task.name;
            taskSpan.onclick = () => {
                taskSpan.classList.toggle('collapsed');
                taskSpan.classList.toggle('expanded');
                this.startEditingTaskName(taskSpan, task.id);
            };

            const dateSpan = document.createElement("span");
            dateSpan.className = "task-date";
            dateSpan.textContent = task.date;
            dateSpan.onclick = () => this.startEditingTaskDate(dateSpan, task.id);

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => this.deleteTask(task.id);

            li.appendChild(taskSpan);
            li.appendChild(dateSpan);
            li.appendChild(deleteButton);
            ul.appendChild(li);
        });
    }

    startEditingTaskName(taskSpan, taskId) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskSpan.textContent;
        input.className = "task-edit-input";

        taskSpan.replaceWith(input);
        input.focus();

        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') this.editTaskName(taskId, input.value.trim());
        });
        input.addEventListener('blur', () => this.editTaskName(taskId, input.value.trim()));
    }

    startEditingTaskDate(dateSpan, taskId) {
        const input = document.createElement("input");
        input.type = "date";
        input.value = dateSpan.textContent;
        input.className = "task-edit-input";

        dateSpan.replaceWith(input);
        input.focus();

        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') this.editTaskDate(taskId, input.value);
        });
        input.addEventListener('blur', () => this.editTaskDate(taskId, input.value));
    }

    searchTasks(searchInput) {
        const lowerCaseInput = searchInput.toLowerCase();
        const tasks = document.querySelectorAll('#taskList li');

        tasks.forEach(task => {
            const taskNameSpan = task.querySelector('.task-name');
            const originalText = taskNameSpan.getAttribute('data-original-text') || taskNameSpan.textContent;

            taskNameSpan.innerHTML = originalText;

            if (lowerCaseInput) {
                const taskName = originalText.toLowerCase();
                if (taskName.includes(lowerCaseInput)) {
                    const regex = new RegExp(`(${lowerCaseInput})`, 'gi');
                    const highlightedText = originalText.replace(regex, '<span id="spanHighlight" class="highlight">$1</span>');
                    taskNameSpan.innerHTML = highlightedText;
                    task.style.display = '';
                } else {
                    task.style.display = 'none';
                }
            } else {
                task.style.display = '';
            }

            taskNameSpan.setAttribute('data-original-text', originalText);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const todoApp = new Todo();

    document.getElementById("addButton").onclick = () => {
        const taskName = document.getElementById("zadanie").value;
        const taskDate = document.getElementById("date").value;
        todoApp.addTask(taskName, taskDate);
    };

    document.getElementById("search").oninput = () => {
        const searchInput = document.getElementById("search").value;
        todoApp.searchTasks(searchInput);
    };
});
