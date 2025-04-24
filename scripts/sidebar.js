let SidebarisHidden = false;

function toggleSidebar() {
    const sidebarWrapper = document.getElementById("sidebarWrapper");
    // const mainContent = document.getElementById("mainContent");
    const toggleBtn = document.getElementById("sidebar-toggle");
    const buttonwrap = document.getElementById("buttonwrap");

    sidebarWrapper.classList.toggle('collapsed');
    buttonwrap.classList.toggle("left-60");
    if (SidebarisHidden) {
        // When showing, rotate
        toggleBtn.classList.add("rotate-180");  // arrow pointing right
    } else {
        // Hide sidebar
        toggleBtn.classList.remove("rotate-180");  // arrow pointing left
    }

    SidebarisHidden = !SidebarisHidden;
}

