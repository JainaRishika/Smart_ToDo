const Auth = {

    login() {
        const username = document.getElementById("username").value.trim();
        if (!username) return;

        localStorage.setItem("smartUser", username);
        window.location.href = "dashboard.html";
    },

    logout() {
        localStorage.removeItem("smartUser");
        window.location.href = "index.html";
    },

    checkAuth() {
        const user = localStorage.getItem("smartUser");
        if (!user) {
            window.location.href = "index.html";
        }
    },

    getUser() {
        return localStorage.getItem("smartUser");
    }
};