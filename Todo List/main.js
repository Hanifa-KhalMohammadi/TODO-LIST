$(document).ready(function () {
    let selectedDay = null;
    const tasksKey = "weeklyTasks";
    let tasks = JSON.parse(localStorage.getItem(tasksKey)) || {};

    function saveTasks() {
        localStorage.setItem(tasksKey, JSON.stringify(tasks));
    }

    function loadTasks(day) {
        $('#tasksList').empty();
        if (!tasks[day]) tasks[day] = [];

        tasks[day].forEach((task, index) => {
            const taskItem = $(`
                <li class="taskItem">
                    <div>
                        <button class="completeBtn">${task.completed ? "✔️" : "☐"}</button>
                        <span contenteditable="false">${task.text}</span>
                    </div>
                    <div>
                        <button class="editBtn">🖊</button>
                        <button class="deleteBtn">🗙</button>
                    </div>
                </li>
            `);

            const taskTextElement = taskItem.find("span");

            if (task.completed) {
                taskTextElement.css("text-decoration", "line-through");
            }

            taskItem.find(".completeBtn").click(function () {
                const currentText = taskTextElement.text(); 
                tasks[day][index].text = currentText;
                tasks[day][index].completed = !tasks[day][index].completed;
                saveTasks();
                loadTasks(day);
            });

            taskItem.find(".editBtn").click(function () {
                const isEditable = taskTextElement.attr("contenteditable") === "true";
                if (isEditable) {
                    taskTextElement.attr("contenteditable", "false");
                    tasks[day][index].text = taskTextElement.text();
                    saveTasks();
                } else {
                    taskTextElement.attr("contenteditable", "true").focus();
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(taskTextElement[0]);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });

            taskTextElement.on("blur", function () {
                if (taskTextElement.attr("contenteditable") === "true") {
                    taskTextElement.attr("contenteditable", "false");
                    tasks[day][index].text = taskTextElement.text();
                    saveTasks();
                }
            });

            taskItem.find(".deleteBtn").click(function () {
                const currentText = taskTextElement.text(); 
                tasks[day][index].text = currentText;
                tasks[day].splice(index, 1);
                saveTasks();
                loadTasks(day);
            });

            $('#tasksList').append(taskItem);
        });
    }

    function selectDay(dayButton) {
        $('.days').css("background-color", "var(--primary)");
        dayButton.css("background-color", "var(--secondary)");
        selectedDay = dayButton.text();
        $('#selectDay').text(selectedDay);
        loadTasks(selectedDay);
    }

    $('.days').click(function () {
        selectDay($(this));
    });

    function addTask() {
        const input = $('#inputTask');
        const taskText = input.val().trim();
        if (!selectedDay) {
            alert("Please select a day.");
            return;
        }
        if (taskText === "") return;

        if (!tasks[selectedDay]) tasks[selectedDay] = [];
        tasks[selectedDay].push({ text: taskText, completed: false });
        saveTasks();
        input.val('');
        loadTasks(selectedDay);
    }

    $('#addTask').click(addTask);

    $('#inputTask').keypress(function (e) {
        if (e.which === 13) addTask();
    });

    $('.days').first().click();
});

