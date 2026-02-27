const Filters = {
    apply(filter, tasks) {
        if (filter === "completed") return tasks.filter(t => t.completed);
        if (filter === "pending") return tasks.filter(t => !t.completed);
        return tasks;
    }
};