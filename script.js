/* Oukal Haarstudio – Interactions */

document.addEventListener("DOMContentLoaded", () => {
  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll state
  const header = document.getElementById("header");
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  const navLinks = nav.querySelectorAll(".nav__link, .btn--nav");

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // Contact form (demo – no backend)
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name || !email) {
      form.name.focus();
      return;
    }

    // Visual feedback only
    form.querySelectorAll("input, select, textarea, button").forEach((el) => {
      el.disabled = true;
    });

    setTimeout(() => {
      success.hidden = false;
      form.reset();
      form.querySelectorAll("input, select, textarea, button").forEach((el) => {
        el.disabled = false;
      });

      // Hide success after a while
      setTimeout(() => {
        success.hidden = true;
      }, 6000);
    }, 600);
  });

  // Simple modal for Impressum / Datenschutz links
  const modal = document.getElementById("impressum");
  document.querySelectorAll('a[href="#impressum"], a[href="#datenschutz"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", () => {
      modal.hidden = true;
      document.body.style.overflow = "";
    });
  });

  // Close modal on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      modal.hidden = true;
      document.body.style.overflow = "";
    }
  });
});
