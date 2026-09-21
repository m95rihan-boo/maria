/* Maria Haarstudio — lightweight interactions, no dependencies */
document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "436766881201";
  const header = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const nav = document.getElementById("mainNav");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 18);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menü öffnen");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuButton.classList.toggle("active", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -45px" });
    revealItems.forEach((item) => observer.observe(item));
  }

  const availability = document.querySelector(".card-hours");
  if (availability) {
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const isWeekday = day >= 1 && day <= 5;
    const isSaturday = day === 6;
    const isOpen = (isWeekday && minutes >= 540 && minutes < 1140) || (isSaturday && minutes >= 540 && minutes < 1020);
    const label = availability.querySelector("small");
    const time = availability.querySelector("strong");
    const dot = availability.querySelector(".live-dot");
    label.textContent = isOpen ? "JETZT GEÖFFNET" : "ÖFFNUNGSZEITEN";
    time.textContent = isSaturday ? "09:00 – 17:00" : day === 0 ? "Montag ab 09:00" : "09:00 – 19:00";
    dot.classList.toggle("is-closed", !isOpen);
  }

  const bookingForm = document.getElementById("bookingForm");
  const serviceField = document.getElementById("service");
  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      serviceField.value = button.dataset.service;
      document.getElementById("termin").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      setTimeout(() => document.getElementById("name").focus({ preventScroll: true }), reducedMotion ? 0 : 650);
    });
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);
    const dayValue = data.get("day");
    let formattedDay = "flexibel";
    if (dayValue) {
      const date = new Date(`${dayValue}T12:00:00`);
      formattedDay = new Intl.DateTimeFormat("de-AT", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
    }
    const message = [
      "Hallo Maria Haarstudio,",
      "ich möchte gerne einen Termin anfragen.",
      "",
      `Name: ${data.get("name")}`,
      `Leistung: ${data.get("service")}`,
      `Wunschtag: ${formattedDay}`,
      `Uhrzeit: ${data.get("time") || "flexibel"}`,
      data.get("note") ? `Wunsch / Hinweis: ${data.get("note")}` : "",
      "",
      "Vielen Dank!"
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });

  document.querySelectorAll("[data-dialog]").forEach((button) => {
    button.addEventListener("click", () => document.getElementById(button.dataset.dialog).showModal());
  });
  document.querySelectorAll(".legal-dialog").forEach((dialog) => {
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) dialog.close();
    });
  });

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!reducedMotion && finePointer) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
});
