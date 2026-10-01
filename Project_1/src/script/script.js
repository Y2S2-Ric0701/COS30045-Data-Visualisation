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

  const insightItems = document.querySelectorAll(".insight-item");
  insightItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      insightItems.forEach((other) => {
        if (other !== item) other.removeAttribute("open");
      });
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
});