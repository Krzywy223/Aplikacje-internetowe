function add() {
    var ul = document.getElementById("taskList");
    var date = document.getElementById("date").value;
    var li = document.createElement("li");
    var taskName = document.getElementById("zadanie").value;

    var taskSpan = document.createElement("span");
    taskSpan.className = "task-name";
    taskSpan.appendChild(document.createTextNode(taskName));

    var dateSpan = document.createElement("span");
    dateSpan.className = "task-date";

    if (date) {
        var dateParts = date.split("-");
        var formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
        dateSpan.appendChild(document.createTextNode(formattedDate));
    } else {
        dateSpan.appendChild(document.createTextNode("no date"));
    }

    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.onclick = function() {
        ul.removeChild(li);
    };

    var today = new Date().toISOString().split('T')[0];
    if (taskName.length >= 3 && taskName.length <= 255 && (date === "" || date >= today)) {
        li.appendChild(taskSpan);
        li.appendChild(dateSpan);
        li.appendChild(deleteButton);
        ul.appendChild(li);
    }
}