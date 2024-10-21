let taskIdCounter = 0;

function addTaskToList(taskName, taskDate, taskId) {
    var ul = document.getElementById("taskList");
    var li = document.createElement("li");
    li.id = taskId || `task-${taskIdCounter++}`;

    var taskSpan = document.createElement("span");
    taskSpan.className = "task-name collapsed";  // Start with collapsed class
    taskSpan.appendChild(document.createTextNode(taskName));

    taskSpan.onclick = function() {
        // Toggle between expanded and collapsed on click
        if (taskSpan.classList.contains('collapsed')) {
            taskSpan.classList.remove('collapsed');
            taskSpan.classList.add('expanded');
        } else {
            taskSpan.classList.remove('expanded');
            taskSpan.classList.add('collapsed');
        }
        editTaskName(taskSpan, li.id); // Enable editing
    };

    // Create task date span
    var dateSpan = document.createElement("span");
    dateSpan.className = "task-date";
    dateSpan.appendChild(document.createTextNode(taskDate || "no date"));

    dateSpan.onclick = function() {
        editTaskDate(dateSpan);
    }

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
    }
    else if (newTaskDate >= new Date().toISOString().split('T')[0]) {
        dateSpan.textContent = newTaskDate;
    }

    input.replaceWith(dateSpan);
    saveTasks();

}

function saveEditedTaskName(input, taskSpan, taskId) {
    var newTaskName = input.value.trim();

    // Validate the new task name length (between 3 and 255 characters)
    if (newTaskName.length >= 3 && newTaskName.length <= 255) {
        taskSpan.textContent = newTaskName;
    }

    // Replace the input back with the updated span
    input.replaceWith(taskSpan);

    // Save changes to local storage
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
    console.log("Tasks saved:", tasks); // Debugging statement
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var ul = document.getElementById("taskList");
    ul.innerHTML = ''; // Clear the existing list
    console.log("Loading tasks:", tasks); // Debugging statement

    tasks.forEach(function(task) {
        addTaskToList(task.name, task.date, task.id);
    });
}

document.addEventListener('DOMContentLoaded', loadTasks);
