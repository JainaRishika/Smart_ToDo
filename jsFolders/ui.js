const UI = {

    /* ===============================
       RENDER TASKS
    =============================== */
    renderTasks(tasks) {
        const list = document.getElementById("taskList");
        list.innerHTML = "";

        tasks.forEach((task, index) => {
            const li = this.createTaskElement(task, index); // pass index for stagger
            list.appendChild(li);
        });

        this.updateCounter(tasks);
        Analytics.update(tasks);
    },

    /* ===============================
       CREATE SINGLE TASK ELEMENT
    =============================== */
    createTaskElement(task, index) {
        const li = document.createElement("li");

        /* 🔥 STAGGER ANIMATION */
        li.style.animationDelay = `${index * 80}ms`;

        /* Core attributes */
        li.dataset.id = task.id;
        li.draggable = true;
        li.classList.add(`priority-${task.priority}`);

        if (task.completed) {
            li.classList.add("completed");
        }

        /* ===== LEFT SECTION ===== */
        const leftDiv = document.createElement("div");
        leftDiv.className = "task-info";

        const title = document.createElement("strong");
        title.textContent = task.text;

        const date = document.createElement("small");
        date.textContent = task.dueDate ? ` (${task.dueDate})` : " (No date)";

        const priorityBadge = document.createElement("span");
        priorityBadge.className = "priority-badge";
        priorityBadge.textContent = task.priority.toUpperCase();

        leftDiv.appendChild(title);
        leftDiv.appendChild(date);
        leftDiv.appendChild(priorityBadge);

        /* ===== RIGHT SECTION ===== */
        const rightDiv = document.createElement("div");
        rightDiv.className = "task-actions";

        const editBtn = this.createButton("✎", "edit-btn", () => {
            App.editTask(task.id);
        });

        const completeBtn = this.createButton("✔", "complete-btn", () => {
            App.toggleComplete(task.id);
        });

        const deleteBtn = this.createButton("✖", "delete-btn", () => {
            App.deleteTask(task.id);
        });

        rightDiv.appendChild(editBtn);
        rightDiv.appendChild(completeBtn);
        rightDiv.appendChild(deleteBtn);

        /* ===== APPEND EVERYTHING ===== */
        li.appendChild(leftDiv);
        li.appendChild(rightDiv);

        return li;
    },

    /* ===============================
       BUTTON CREATOR
    =============================== */
    createButton(text, className, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.className = className;
        button.addEventListener("click", onClick);
        return button;
    },

    /* ===============================
       UPDATE COUNTER
    =============================== */
    updateCounter(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById("taskCounter").textContent =
            `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
    }

};