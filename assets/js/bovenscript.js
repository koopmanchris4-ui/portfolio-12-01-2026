  const theme = localStorage.getItem("theme") || "light";
        if (theme === "dark") {
            document.documentElement.dataset.theme = "dark";
            document.documentElement.style.backgroundColor = "black";
        }