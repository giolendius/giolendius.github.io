// ____________________________________
//         BUTTON BACK ON TOP
// ____________________________________

const backToTopBtn = document.getElementById("backToTop");
const targetDiv = document.getElementById("mainContent");
// Show button when scrolled down
window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
// Scroll to top on click
backToTopBtn.addEventListener("click", () => {
    targetDiv.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ____________________________________
//     adjust height of the table
// ____________________________________
function setMainMinHeight() {
    const sidebar = document.querySelector("#sidebarWrapper > div");
    const main = document.getElementById("mainContent");
    console.log(sidebar.offsetHeight)
    if (sidebar && main) {
        main.style.minHeight = sidebar.offsetHeight + 50 + "px";
    }
}

setMainMinHeight();