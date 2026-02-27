const App = {
    tasks: [],

    /* ===============================
       INIT
    =============================== */
    init() {
        this.tasks = Storage.getTasks();
        UI.renderTasks(this.tasks);

        document.getElementById("addBtn")
            .addEventListener("click", () => this.addTask());

        Theme.init();

        document.getElementById("themeToggle")
        .addEventListener("click", () => Theme.toggle());

        document.getElementById("clearAll")
            .addEventListener("click", () => this.clearAll());

        document.querySelectorAll(".filters button").forEach(btn => {
            btn.addEventListener("click", () => {
                const filtered = Filters.apply(btn.dataset.filter, this.tasks);
                UI.renderTasks(filtered);
                this.enableDragAndDrop();
            });
        });

        Shortcuts.init();
        this.enableDragAndDrop();
    },

    /* ===============================
       ADD TASK
    =============================== */
    addTask() {
        const text = document.getElementById("taskInput").value.trim();
        const dueDate = document.getElementById("dueDate").value;
        const priority = document.getElementById("priority").value;

        if (!text) return;

        const task = {
            id: Date.now(),
            text,
            dueDate,
            priority,
            completed: false
        };

        this.tasks.push(task);
        this.saveAndRender();
        document.getElementById("taskInput").value = "";
    },

    /* ===============================
       TOGGLE COMPLETE
    =============================== */
    toggleComplete(id) {
    id = Number(id);

    this.tasks = this.tasks.map(task => {
        if (task.id === id) {
            const updatedTask = {
                ...task,
                completed: !task.completed
            };

            // 🎉 Launch confetti only when becoming completed
            if (updatedTask.completed) {
                this.launchConfetti();
            }

            return updatedTask;
        }
        return task;
    });

    Storage.saveTasks(this.tasks);
    UI.renderTasks(this.tasks);
    },

    /* ===============================
       DELETE TASK
    =============================== */
    deleteTask(id) {
        const taskElement = document.querySelector(`li[data-id="${id}"]`);

        if (taskElement) {
            taskElement.classList.add("fade-out");

            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.saveAndRender();
            }, 300);
        }
    },

    /* ===============================
       EDIT TASK
    =============================== */
    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        const newText = prompt("Edit task:", task.text);

        if (!newText || newText.trim() === "") return;

        task.text = newText.trim();
        this.saveAndRender();
    },

    /* ===============================
       CLEAR ALL
    =============================== */
    clearAll() {
        if (!confirm("Delete all tasks?")) return;

        this.tasks = [];
        this.saveAndRender();
    },

    /* ===============================
       DRAG & DROP
    =============================== */
    enableDragAndDrop() {
        const list = document.getElementById("taskList");
        let draggedItem = null;

        list.addEventListener("dragstart", e => {
            if (e.target.tagName === "LI") {
                draggedItem = e.target;
                e.target.classList.add("dragging");
            }
        });

        list.addEventListener("dragend", e => {
            if (draggedItem) {
                draggedItem.classList.remove("dragging");
                draggedItem = null;
                this.updateOrder();
            }
        });

        list.addEventListener("dragover", e => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(list, e.clientY);

            if (draggedItem) {
                if (afterElement == null) {
                    list.appendChild(draggedItem);
                } else {
                    list.insertBefore(draggedItem, afterElement);
                }
            }
        });
    },

    getDragAfterElement(container, y) {
        const draggableElements = [
            ...container.querySelectorAll("li:not(.dragging)")
        ];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    updateOrder() {
        const ids = [...document.querySelectorAll("#taskList li")]
            .map(li => Number(li.dataset.id));

        this.tasks.sort((a, b) =>
            ids.indexOf(a.id) - ids.indexOf(b.id)
        );

        Storage.saveTasks(this.tasks);
    },

    /* ===============================
       CONFETTI
    =============================== */
    

    launchConfetti() {
        const duration = 1500;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 6,
                spread: 80,
                origin: { y: 0.6 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    },

    /* ===============================
       THEME
    =============================== */
    toggleTheme() {
        document.body.classList.toggle("dark");
    },

    /* ===============================
       HELPER
    =============================== */
    saveAndRender() {
        Storage.saveTasks(this.tasks);
        UI.renderTasks(this.tasks);
        this.enableDragAndDrop();
    }
};

document.addEventListener("DOMContentLoaded", () => App.init());