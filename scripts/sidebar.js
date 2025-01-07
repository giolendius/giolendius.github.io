let filters = document.getElementById("filters")
let btnOpenFilters = document.getElementById("btnOpenFilters");

function closeFilters() {
    filters.style.flexBasis = "0";
    btnOpenFilters.style.flexBasis ="4em";
}

function openFilters() {
    filters.style.flexBasis = "20%";
    btnOpenFilters.style.flexBasis ="0";
}