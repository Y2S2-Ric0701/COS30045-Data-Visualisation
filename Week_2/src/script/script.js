document.addEventListener("DOMContentLoaded", () => {
  const currentPage = document.body.dataset.page;

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === currentPage) {
      link.classList.add("active");
      if (link.closest("nav")) link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
      const destination = link.getAttribute("href");
      if (destination) window.location.assign(destination);
    });
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
});