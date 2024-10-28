let taskIdCounter = 0;

function addTaskToList(taskName, taskDate, taskId) {
    var ul = document.getElementById("taskList");
    var li = document.createElement("li");
    li.id = taskId || `task-${taskIdCounter++}`;

    var taskSpan = document.createElement("span");
    taskSpan.className = "task-name collapsed";
    taskSpan.appendChild(document.createTextNode(taskName));

    taskSpan.onclick = function() {
        
        if (taskSpan.classList.contains('collapsed')) {
            taskSpan.classList.remove('collapsed');
            taskSpan.classList.add('expanded');
        } else {
            taskSpan.classList.remove('expanded');
            taskSpan.classList.add('collapsed');
        }
        editTaskName(taskSpan, li.id);
    };

    var dateSpan = document.createElement("span");
    dateSpan.className = "task-date";
    dateSpan.appendChild(document.createTextNode(taskDate || "no date"));

    dateSpan.onclick = function() {
        editTaskDate(dateSpan);
    };

    // Create delete button
    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.onclick = function() {
        ul.removeChild(li);
        saveTasks();
    };

    li.appendChild(taskSpan);
    li.appendChild(dateSpan);
    li.appendChild(deleteButton);
    ul.appendChild(li);
}

function editTaskName(taskSpan, taskId) {
    var input = document.createElement("input");
    input.type = "text";
    input.value = taskSpan.textContent;
    input.className = "task-edit-input";

    taskSpan.replaceWith(input);
    input.focus();

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveEditedTaskName(input, taskSpan, taskId);
        }
    });
    input.addEventListener('blur', function() {
        saveEditedTaskName(input, taskSpan, taskId);
    });
}

function editTaskDate(dateSpan) {
    var input = document.createElement("input");
    input.type = "date";
    input.value = dateSpan.textContent;
    input.className = "task-edit-input";

    dateSpan.replaceWith(input);
    input.focus();

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveEditedTaskDate(input, dateSpan);
        }
    });
    input.addEventListener('blur', function() {
        saveEditedTaskDate(input, dateSpan);
    });
}

function saveEditedTaskDate(input, dateSpan) {
    var newTaskDate = input.value.trim();

    if (newTaskDate === "") {
        dateSpan.textContent = "no date";
    } else if (newTaskDate >= new Date().toISOString().split('T')[0]) {
        dateSpan.textContent = newTaskDate;
    }

    input.replaceWith(dateSpan);
    saveTasks();
}

function saveEditedTaskName(input, taskSpan, taskId) {
    var newTaskName = input.value.trim();

    if (newTaskName.length >= 3 && newTaskName.length <= 255) {
        taskSpan.textContent = newTaskName;
    }

    input.replaceWith(taskSpan);
    saveTasks();
}

function add() {
    var taskName = document.getElementById("zadanie").value;
    var date = document.getElementById("date").value;
    var today = new Date().toISOString().split('T')[0];

    if (taskName.length >= 3 && taskName.length <= 255 && (date === "" || date >= today)) {
        addTaskToList(taskName, date);
        saveTasks();
    }
}

function saveTasks() {
    var tasks = [];
    document.querySelectorAll('#taskList li').forEach(function(task) {
        var taskName = task.querySelector('.task-name').textContent;
        var taskDate = task.querySelector('.task-date').textContent;
        tasks.push({ id: task.id, name: taskName, date: taskDate });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Tasks saved:", tasks);
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var ul = document.getElementById("taskList");
    ul.innerHTML = '';
    console.log("Loading tasks:", tasks);

    tasks.forEach(function(task) {
        addTaskToList(task.name, task.date, task.id);
    });
}

document.addEventListener('DOMContentLoaded', loadTasks);


function searchTasks() {
    var searchInput = document.getElementById("search").value.toLowerCase();
    var tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(function(task) {
        var taskNameSpan = task.querySelector('.task-name');
        var originalText = taskNameSpan.getAttribute('data-original-text') || taskNameSpan.textContent;

        taskNameSpan.innerHTML = originalText;

        if (searchInput) {
            var taskName = originalText.toLowerCase();

            if (taskName.includes(searchInput)) {
                var regex = new RegExp(`(${searchInput})`, 'gi');
                var highlightedText = originalText.replace(regex, '<span id="spanHighlight" class="highlight">$1</span>');
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
