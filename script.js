// PULSE Dashboard JavaScript

function loadIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

const demoRevenue = [12000, 19000, 15000, 28000, 22000, 35000, 30000, 42000, 38000, 48000, 44000, 58000];
const revenueCanvas = document.getElementById("revenueChart");
const revenueChart = new Chart(revenueCanvas, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Revenue",
      data: demoRevenue,
      borderColor: "#635bff",
      backgroundColor: context => {
        const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, "rgba(99, 91, 255, 0.22)");
        gradient.addColorStop(1, "rgba(99, 91, 255, 0.01)");
        return gradient;
      },
      borderWidth: 2.5,
      fill: true,
      tension: 0.38,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#635bff",
      pointHoverBorderColor: "#ffffff",
      pointHoverBorderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#172033",
        titleFont: { family: "Inter", size: 11, weight: "600" },
        bodyFont: { family: "Inter", size: 11 },
        padding: 11,
        displayColors: false,
        callbacks: {
          label: context => ` $${context.parsed.y.toLocaleString("en-US")}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "rgba(140, 150, 170, 0.13)", drawTicks: false },
        ticks: {
          color: "#8992a5",
          padding: 10,
          maxTicksLimit: 5,
          callback: value => `$${Number(value) / 1000}k`
        }
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { color: "#8992a5", maxRotation: 0, autoSkipPadding: 14 }
      }
    }
  }
});

const trafficChart = new Chart(document.getElementById("trafficChart"), {
  type: "doughnut",
  data: {
    labels: ["Direct", "Social", "Search"],
    datasets: [{
      data: [40, 35, 25],
      backgroundColor: ["#635bff", "#39a0ed", "#ffad62"],
      borderColor: "#ffffff",
      borderWidth: 3,
      hoverOffset: 6
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#172033",
        titleFont: { family: "Inter", size: 11, weight: "600" },
        bodyFont: { family: "Inter", size: 11 },
        padding: 10,
        callbacks: { label: context => ` ${context.label}: ${context.parsed}%` }
      }
    }
  }
});

const themeBtn = document.getElementById("themeBtn");
const settingsThemeBtn = document.getElementById("settingsThemeBtn");
function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeBtn.innerHTML = isDark
    ? '<i data-lucide="sun"></i>'
    : '<i data-lucide="moon"></i>';
  settingsThemeBtn.setAttribute("aria-checked", String(isDark));
  localStorage.setItem("pulse-theme", isDark ? "dark" : "light");
  loadIcons();
}

themeBtn.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark"));
});
settingsThemeBtn.addEventListener("click", () => {
  setTheme(settingsThemeBtn.getAttribute("aria-checked") !== "true");
});
if (localStorage.getItem("pulse-theme") === "dark") {
  setTheme(true);
}

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const transactionBody = document.getElementById("transactionBody");
const emptyMessage = document.getElementById("emptyMessage");

function filterTransactions() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;
  const rows = transactionBody.querySelectorAll("tr");
  let visibleCount = 0;

  rows.forEach(row => {
    const matchesSearch = row.textContent.toLowerCase().includes(searchTerm);
    const rowStatus = row.querySelector(".status").textContent.toLowerCase();
    const matchesStatus = selectedStatus === "all" || rowStatus === selectedStatus;
    const isVisible = matchesSearch && matchesStatus;
    row.hidden = !isVisible;
    if (isVisible) visibleCount++;
  });

  emptyMessage.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterTransactions);
statusFilter.addEventListener("change", filterTransactions);

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  overlay.classList.toggle("show", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});
overlay.addEventListener("click", closeSidebar);

const dashboard = document.querySelector(".dashboard");
const overviewElements = dashboard.querySelectorAll(":scope > .section-heading, :scope > .stats-grid, :scope > .charts-grid, :scope > .orders-panel");
const pages = {
  customers: document.getElementById("customersPage"),
  products: document.getElementById("productsPage"),
  settings: document.getElementById("settingsPage"),
  help: document.getElementById("helpPage")
};
const pageHeadings = {
  overview: ["Dashboard Overview", "Monitor your business performance at a glance."],
  analytics: ["Analytics", "Explore your revenue and traffic performance."],
  transactions: ["Transactions", "Review and filter your latest sample transactions."],
  customers: ["Customers", "Understand your customer base at a glance."],
  products: ["Products", "Review your fictional product catalog."],
  settings: ["Settings", "Personalize your dashboard experience."],
  help: ["Help Center", "Guidance for exploring the PULSE demo."]
};
const navLinks = document.querySelectorAll(".nav-link");
function navigateTo(page, shouldScroll) {
  const isOverviewView = page === "overview" || page === "analytics" || page === "transactions";
  overviewElements.forEach(element => { element.hidden = !isOverviewView; });
  Object.entries(pages).forEach(([name, element]) => { element.hidden = name !== page; });
  navLinks.forEach(link => {
    const isActive = link.dataset.page === page;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const heading = pageHeadings[page] || pageHeadings.overview;
  document.querySelector(".topbar h1").textContent = heading[0];
  document.querySelector(".subtitle").textContent = heading[1];
  history.replaceState(null, "", `#${page === "help" ? "help-center" : page}`);
  closeSidebar();
  if (shouldScroll) {
    const target = page === "analytics" ? document.querySelector(".charts-grid")
      : page === "transactions" ? document.querySelector(".orders-panel")
        : dashboard;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  loadIcons();
}

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    navigateTo(link.dataset.page, link.dataset.page === "analytics" || link.dataset.page === "transactions");
  });
});

const dateFilter = document.getElementById("dateFilter");
dateFilter.addEventListener("change", () => {
  const factor = Number(dateFilter.value) === 7 ? 0.25 : Number(dateFilter.value) === 90 ? 1.8 : 1;
  revenueChart.data.datasets[0].data = demoRevenue.map(value => Math.round(value * factor));
  revenueChart.update();
});

document.getElementById("viewAllBtn").addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "all";
  filterTransactions();
});

const notificationBtn = document.getElementById("notificationBtn");
const profileBtn = document.getElementById("profileBtn");
const notificationMenu = document.getElementById("notificationMenu");
const profileMenu = document.getElementById("profileMenu");
function togglePopover(button, popover, otherButton, otherPopover) {
  const isOpening = popover.hidden;
  popover.hidden = !isOpening;
  button.setAttribute("aria-expanded", String(isOpening));
  otherPopover.hidden = true;
  otherButton.setAttribute("aria-expanded", "false");
}
notificationBtn.addEventListener("click", () => togglePopover(notificationBtn, notificationMenu, profileBtn, profileMenu));
profileBtn.addEventListener("click", () => togglePopover(profileBtn, profileMenu, notificationBtn, notificationMenu));
document.getElementById("settingsNotificationBtn").addEventListener("click", event => {
  event.stopPropagation();
  notificationMenu.hidden = false;
  notificationBtn.setAttribute("aria-expanded", "true");
  notificationMenu.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
document.addEventListener("click", event => {
  if (!event.target.closest(".top-actions")) {
    notificationMenu.hidden = true;
    profileMenu.hidden = true;
    notificationBtn.setAttribute("aria-expanded", "false");
    profileBtn.setAttribute("aria-expanded", "false");
  }
});

const hashPage = window.location.hash.slice(1);
const initialPage = hashPage === "customers" || hashPage === "products" || hashPage === "settings"
  ? hashPage
  : hashPage === "help-center" ? "help"
    : hashPage === "analytics" || hashPage === "transactions" ? hashPage : "overview";
navigateTo(initialPage, false);
loadIcons();
console.log("PULSE Dashboard initialized successfully!");
