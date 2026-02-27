const Shortcuts = {

    init() {
        document.addEventListener("keydown", (e) => {

            // ENTER → Add Task
            if (e.key === "Enter" && document.activeElement.id === "taskInput") {
                App.addTask();
            }

            // CTRL + D → Toggle Theme
            if (e.ctrlKey && e.key.toLowerCase() === "d") {
                e.preventDefault();
                Theme.toggle();
            }

            // CTRL + SHIFT + C → Clear All
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
                e.preventDefault();
                App.clearAll();
            }

            // "/" → Focus Search (if you add search later)
            if (e.key === "/") {
                e.preventDefault();
                document.getElementById("taskInput").focus();
            }

        });
    }

};