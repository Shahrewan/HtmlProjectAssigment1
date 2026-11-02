/* Keep the concept notes in the visitor's saved portfolio color theme. */
(function () {
  "use strict";
  let theme = null;
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") theme = saved;
  } catch (error) { /* Storage may be restricted. */ }
  if (!theme) theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#101311" : "#f4f5ef";
})();
