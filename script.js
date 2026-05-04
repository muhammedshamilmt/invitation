const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll(".rsvp-actions button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".rsvp-actions button").forEach((item) => {
      item.classList.toggle("selected", item === button);
    });
  });
});
