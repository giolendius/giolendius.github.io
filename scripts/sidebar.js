let SidebarisHidden = false;

function toggleSidebar() {
    const sidebarWrapper = document.getElementById("sidebarWrapper");
    const toggleBtn = document.getElementById("sidebar-toggle");
    const buttonwrap = document.getElementById("buttonwrap");

    sidebarWrapper.classList.toggle('collapsed');
    buttonwrap.classList.toggle("left-60");
    // toggleBtn.classList.toggle("ml-60");
    if (SidebarisHidden) {
        // When showing, rotate
        toggleBtn.classList.add("rotate-180");  // arrow pointing right
    } else {
        // Hide sidebar
        toggleBtn.classList.remove("rotate-180");  // arrow pointing left
    }

    SidebarisHidden = !SidebarisHidden;
}



const backToTopBtn = document.getElementById("backToTop");

  // Show button when scrolled down
  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  // Scroll to top on click
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });