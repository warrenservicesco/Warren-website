
/*
 * WARREN Services — shared website JavaScript
 *
 * No visitor information is stored in browser storage.
 * Forms must be connected to a real submission service
 * before they can accept and deliver submissions.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (menuToggle && navigation) {
    const closeMenu = () => {
      navigation.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      navigation.classList.toggle("is-open", !isOpen);
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Current year in the footer
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // Form safety: do not pretend an unconfigured form was submitted.
  document.querySelectorAll("form[data-status]").forEach((form) => {
    const status = document.getElementById(form.dataset.status);

    form.addEventListener("submit", (event) => {
      if (form.dataset.configured !== "true") {
        event.preventDefault();

        if (status) {
          status.textContent =
            "This form is not connected to a submission service yet. " +
            "Your information has not been sent. Please use the published " +
            "business contact details instead.";
          status.dataset.state = "error";
          status.setAttribute("role", "alert");
        }
      }
    });
  });

  // Mark client-side validation failures accessibly.
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("invalid", (event) => {
      const field = event.target;

      if (field instanceof HTMLElement) {
        field.setAttribute("aria-invalid", "true");
      }
    }, true);

    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => {
        if (field instanceof HTMLElement && field.validity.valid) {
          field.removeAttribute("aria-invalid");
        }
      });
    });
  });
});
