const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = document.querySelector("#themeLabel");
const footerYear = document.querySelector("#footerYear");
const footerTime = document.querySelector("#footerTime");
const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore storage failures and keep the in-page theme interactive.
  }
}

const storedTheme = getStoredTheme();
let currentTheme = root.dataset.theme || storedTheme || (systemTheme.matches ? "dark" : "light");

function updateThemeLabel() {
  const useLightMode = currentTheme === "dark";

  themeLabel.textContent = useLightMode ? "Light" : "Dark";
  themeToggle.setAttribute(
    "aria-label",
    useLightMode ? "Switch to light mode" : "Switch to dark mode",
  );
}

function applyTheme(theme) {
  currentTheme = theme === "dark" ? "dark" : "light";
  root.dataset.theme = currentTheme;
  metaThemeColor.setAttribute("content", currentTheme === "dark" ? "#08090b" : "#f7f7f9");
  updateThemeLabel();
}

function updateFooterClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  footerYear.textContent = new Intl.DateTimeFormat("en", { year: "numeric" }).format(now);
  footerTime.textContent = time;
  footerTime.setAttribute("datetime", now.toISOString());
}

themeToggle.addEventListener("click", () => {
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  setStoredTheme(nextTheme);
  applyTheme(nextTheme);
});

systemTheme.addEventListener("change", (event) => {
  if (!getStoredTheme()) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

applyTheme(currentTheme);
updateFooterClock();
setInterval(updateFooterClock, 1000);
