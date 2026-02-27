const Analytics = {

    update(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const highPriority = tasks.filter(t => t.priority === "High").length;

        const overdue = tasks.filter(t => {
            if (!t.dueDate || t.completed) return false;
            return new Date(t.dueDate) < new Date().setHours(0,0,0,0);
        }).length;

        const completionRate = total === 0 
            ? 0 
            : Math.round((completed / total) * 100);

        document.getElementById("analyticsPanel").innerHTML = `
            📊 Completion Rate: <strong>${completionRate}%</strong> |
            🔥 High Priority: <strong>${highPriority}</strong> |
            ⏳ Overdue: <strong>${overdue}</strong> |
            📌 Pending: <strong>${pending}</strong>
        `;
    }

};