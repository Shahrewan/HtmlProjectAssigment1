(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  // Feature 1: mobile navigation open/close, including Escape and link activation.
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navAnchors = Array.from(document.querySelectorAll(".nav-link"));

  function closeMenu() {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      navLinks.classList.toggle("is-open", isOpen);
    });
    navAnchors.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  // Feature 2: persistent monochrome theme toggle.
  const themeToggle = document.getElementById("theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    }
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#191919" : "#f5f5f5");
  }
  try {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
  } catch (error) {
    // Theme switching remains functional if local storage is unavailable.
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      try { window.localStorage.setItem("portfolio-theme", nextTheme); } catch (error) {}
    });
  }

  // Feature 3: oversized decorative carousel. Rotates while idle; controls allow manual pause.
  const slides = Array.from(document.querySelectorAll(".showcase-slide"));
  const slideDots = Array.from(document.querySelectorAll("[data-slide-to]"));
  const slideCurrent = document.getElementById("slide-current");
  const slideStatus = document.getElementById("slide-status");
  const slideCategory = document.getElementById("slide-category");
  const slideTitle = document.getElementById("slide-title");
  const showcase = document.querySelector(".showcase");
  const showcaseControls = document.querySelector(".showcase-controls");
  const autoplayToggle = document.getElementById("carousel-play-toggle");
  const slideDuration = 2000;
  let currentSlide = 0;
  let carouselTimer = null;
  let userPaused = false;
  let projectPreviewOpen = false;
  let pointerOverControls = false;
  let focusWithinControls = false;
  const slideNames = [
    "Card Game Design",
    "Illustration Commissions",
    "Mascot & Emblem Design",
    "Hand-Animated Stinger",
    "Portfolio Website Design",
    "Museum Database (MariaDB)"
  ];
  const slideCategories = [
    "01 / CARD GAME",
    "02 / DIGITAL ART",
    "03 / GRAPHIC DESIGN",
    "04 / 2D ANIMATION",
    "05 / WEB DESIGN",
    "06 / DATABASE"
  ];

  function showSlide(index, announce = false) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentSlide;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    slideDots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentSlide;
      dot.classList.toggle("active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (slideCurrent) slideCurrent.textContent = String(currentSlide + 1).padStart(2, "0");
    if (slideTitle) slideTitle.textContent = slideNames[currentSlide];
    if (slideCategory) slideCategory.textContent = slideCategories[currentSlide];
    if (slideStatus) {
      slideStatus.setAttribute("aria-live", announce ? "polite" : "off");
      slideStatus.textContent = `Slide ${currentSlide + 1} of ${slides.length}: ${slideNames[currentSlide]}`;
    }
  }

  function stopCarousel() {
    window.clearInterval(carouselTimer);
    carouselTimer = null;
  }

  function startCarousel() {
    stopCarousel();
    if (!reduceMotion && !userPaused && !pointerOverControls && !focusWithinControls &&
        !document.hidden && !projectPreviewOpen && slides.length > 1) {
      carouselTimer = window.setInterval(() => showSlide(currentSlide + 1), slideDuration);
    }
  }

  document.querySelectorAll("[data-slide-step]").forEach((button) => {
    button.addEventListener("click", (event) => {
      showSlide(currentSlide + Number(button.dataset.slideStep), true);
      if (event.detail > 0) button.blur(); // Pointer clicks should not leave focus holding autoplay off.
      startCarousel();
    });
  });
  slideDots.forEach((dot) => {
    dot.addEventListener("click", (event) => {
      showSlide(Number(dot.dataset.slideTo), true);
      if (event.detail > 0) dot.blur();
      startCarousel();
    });
  });

  if (autoplayToggle && showcase) {
    autoplayToggle.addEventListener("click", (event) => {
      userPaused = !userPaused;
      showcase.classList.toggle("is-paused", userPaused);
      autoplayToggle.setAttribute("aria-label", userPaused ? "Resume automatic slide rotation" : "Pause automatic slide rotation");
      autoplayToggle.title = userPaused ? "Play slideshow" : "Pause slideshow";
      if (event.detail > 0) autoplayToggle.blur();
      startCarousel();
    });
  }

  if (showcaseControls) {
    showcaseControls.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerOverControls = true;
      stopCarousel();
    });
    showcaseControls.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerOverControls = false;
      startCarousel();
    });
    showcaseControls.addEventListener("focusin", () => {
      focusWithinControls = true;
      stopCarousel();
    });
    showcaseControls.addEventListener("focusout", (event) => {
      if (!showcaseControls.contains(event.relatedTarget)) {
        focusWithinControls = false;
        startCarousel();
      }
    });
  }
  document.addEventListener("visibilitychange", startCarousel);
  showSlide(0);
  startCarousel();

  // Show a soft visual fallback if artwork isn't included with this HTML/CSS/JS bundle.
  document.querySelectorAll(".showcase-slide img, .project-image img").forEach((img) => {
    function handleMissingImage() {
      img.hidden = true;
      const projectImage = img.closest(".project-image");
      if (projectImage) projectImage.classList.add("is-missing-image");
    }
    img.addEventListener("error", handleMissingImage);
    if (img.complete && img.naturalWidth === 0) handleMissingImage();
  });

  // Feature 4: update the active navigation item as page sections enter view.
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Feature 5: category filters for the six portfolio projects.
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const projectCards = Array.from(document.querySelectorAll(".project-card[data-category]"));
  const projectCount = document.getElementById("project-count");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      projectCards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      if (projectCount) projectCount.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? "" : "s"}`;
    });
  });


  // Feature 6: full-resolution project lightbox, with a built-in no-JS link fallback.
  const lightbox = document.getElementById("project-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxType = document.getElementById("lightbox-type");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDescription = document.getElementById("lightbox-description");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxOriginal = document.getElementById("lightbox-original");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  let activeProject = null;
  let lightboxInvoker = null;

  function visibleProjects() {
    return projectCards.filter((card) => !card.hidden);
  }

  function renderProject(card) {
    if (!card || !lightboxImage) return;
    const thumbnail = card.querySelector(".project-image img");
    const link = card.querySelector(".project-open");
    if (!thumbnail || !link) return;
    activeProject = card;
    // Use the original assets, not a stretched thumbnail. GIF files animate normally.
    const originalSource = link.getAttribute("href");
    lightboxImage.src = originalSource;
    lightboxImage.alt = thumbnail.alt;
    lightboxType.textContent = card.querySelector(".project-type").textContent;
    lightboxTitle.textContent = card.querySelector("h3").textContent;
    lightboxDescription.textContent = card.querySelector(".project-description").textContent;
    lightboxOriginal.href = originalSource;
    const visible = visibleProjects();
    const index = visible.indexOf(card);
    lightboxCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
    lightboxPrev.disabled = lightboxNext.disabled = visible.length <= 1;
  }

  function stepProject(direction) {
    if (!activeProject) return;
    const visible = visibleProjects();
    if (visible.length < 2) return;
    const index = visible.indexOf(activeProject);
    renderProject(visible[(index + direction + visible.length) % visible.length]);
  }

  if (lightbox && typeof lightbox.showModal === "function") {
    document.querySelectorAll(".project-open").forEach((link) => {
      link.addEventListener("click", (event) => {
        // Modifier-click can still open the original image in a new tab.
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        const card = link.closest(".project-card");
        if (!card) return;
        event.preventDefault();
        lightboxInvoker = link;
        renderProject(card);
        lightbox.showModal();
        projectPreviewOpen = true;
        document.body.classList.add("dialog-open");
        stopCarousel();
        lightboxClose.focus();
      });
    });

    lightboxClose.addEventListener("click", () => lightbox.close());
    lightboxPrev.addEventListener("click", () => stepProject(-1));
    lightboxNext.addEventListener("click", () => stepProject(1));

    // Clicking on the dark backdrop also dismisses the viewer.
    lightbox.addEventListener("click", (event) => {
      if (event.target !== lightbox) return;
      const rect = lightbox.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right ||
                      event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) lightbox.close();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); stepProject(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); stepProject(1); }
      // Native <dialog> handles Escape and keeps keyboard focus inside the modal.
    });

    lightbox.addEventListener("close", () => {
      projectPreviewOpen = false;
      document.body.classList.remove("dialog-open");
      lightboxImage.removeAttribute("src"); // Stop decoding large artwork / playing GIFs.
      activeProject = null;
      startCarousel();
      if (lightboxInvoker && lightboxInvoker.isConnected) lightboxInvoker.focus({ preventScroll: true });
    });
  }

  // Feature 7: reveal content on scroll; all content remains visible as fallback.
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduceMotion) {
    root.classList.add("js-reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Feature 8: copy the contact email address.
  const emailAddress = "102457@unimas.siswa.my";
  const copyButton = document.getElementById("copy-email");
  const copyStatus = document.getElementById("copy-status");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          const temporaryInput = document.createElement("textarea");
          temporaryInput.value = emailAddress;
          temporaryInput.setAttribute("readonly", "");
          temporaryInput.style.position = "fixed";
          temporaryInput.style.opacity = "0";
          document.body.appendChild(temporaryInput);
          temporaryInput.select();
          const copied = document.execCommand("copy");
          temporaryInput.remove();
          if (!copied) throw new Error("Clipboard unavailable");
        }
        if (copyStatus) copyStatus.textContent = "Copied";
        showToast("Email address copied.");
      } catch (error) {
        if (copyStatus) copyStatus.textContent = "Copy unavailable";
        showToast("Copy unavailable. Please select the email address manually.");
      }
    });
  }

  // Footer year.
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
