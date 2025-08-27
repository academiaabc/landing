/* ========================================
   Main JavaScript - Academia ABC
   ======================================== */

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initSmoothScrolling();
  initScrollAnimations();
  initHeaderScroll();
  initMobileMenu();
  initBackToTop();
  initProgramModal();
  initReglamentoModal();
  initBannerModal();
});

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        // Get header height dynamically
        const header = document.querySelector(".header");
        let headerHeight = header ? header.offsetHeight : 0;

        // Add some extra padding for better visual spacing
        let offset = headerHeight + 20;

        // Responsive offset adjustments
        if (window.innerWidth <= 480) {
          offset = headerHeight + 15;
        } else if (window.innerWidth <= 768) {
          offset = headerHeight + 18;
        }

        const targetPosition = target.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Fade in animations on scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
}

// Header background change on scroll
function initHeaderScroll() {
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      this.classList.toggle("active");
    });

    // Close menu when clicking on links (including CTA button)
    document
      .querySelectorAll(".nav-link, .nav-menu .cta-button")
      .forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("active");
          navToggle.classList.remove("active");
        });
      });

    // Close menu when clicking outside or on overlay
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav") && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });

    // Close menu when clicking on overlay (::before pseudo-element)
    navMenu.addEventListener("click", function (e) {
      if (e.target === navMenu) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });

    // Close menu when pressing ESC key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }
}

// Back to Top functionality
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");

  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  const toggleBackToTop = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    if (scrollTop > windowHeight * 0.5) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Event listeners
  window.addEventListener("scroll", debounce(toggleBackToTop, 100));
  backToTopBtn.addEventListener("click", scrollToTop);

  // Initial check
  toggleBackToTop();
}

// Form handling (if needed in future)
function initFormHandling() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Add your form handling logic here
      console.log("Form submitted:", new FormData(form));
    });
  });
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimization for scroll events
const debouncedScrollHandler = debounce(() => {
  // Any additional scroll handling can go here
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Loading state management
function showLoading(element) {
  element.classList.add("loading");
}

function hideLoading(element) {
  element.classList.remove("loading");
}

// Course Program Modal functionality
let courseProgramData = [];
let currentLevelIndex = 0;

function initProgramModal() {
  const verProgramaBtn = document.getElementById("ver-programa-btn");
  const modal = document.getElementById("programa-modal");
  const closeBtn = document.getElementById("modal-close");
  const prevLevelBtn = document.getElementById("prev-level");
  const nextLevelBtn = document.getElementById("next-level");
  const currentYearSpan = document.getElementById("current-year");

  if (!verProgramaBtn || !modal) return;

  // Set current year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Open modal
  verProgramaBtn.addEventListener("click", async function () {
    try {
      // Simulate fetch - read from JSON file
      const response = await fetch("./public/course-program.json");
      courseProgramData = await response.json();
      currentLevelIndex = 0;

      renderCurrentLevel();
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error loading course program:", error);
      alert("Error al cargar el programa del curso");
    }
  });

  // Close modal
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  closeBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });

  // Navigation buttons
  prevLevelBtn.addEventListener("click", function () {
    if (currentLevelIndex > 0) {
      currentLevelIndex--;
      renderCurrentLevel();
    }
  });

  nextLevelBtn.addEventListener("click", function () {
    if (currentLevelIndex < courseProgramData.length - 1) {
      currentLevelIndex++;
      renderCurrentLevel();
    }
  });
}

function renderCurrentLevel() {
  if (!courseProgramData || courseProgramData.length === 0) return;

  const currentLevel = courseProgramData[currentLevelIndex];
  const levelTitle = document.getElementById("level-title");
  const modulesTbody = document.getElementById("modules-tbody");
  const levelIndicator = document.getElementById("current-level-indicator");
  const prevBtn = document.getElementById("prev-level");
  const nextBtn = document.getElementById("next-level");

  // Update level title
  if (levelTitle) {
    levelTitle.textContent = `NIVEL ${currentLevel.level}: ${currentLevel.title}`;
  }

  // Update level indicator
  if (levelIndicator) {
    levelIndicator.textContent = `Nivel ${currentLevelIndex + 1} de ${
      courseProgramData.length
    }`;
  }

  // Update navigation buttons
  if (prevBtn) {
    prevBtn.disabled = currentLevelIndex === 0;
  }
  if (nextBtn) {
    nextBtn.disabled = currentLevelIndex === courseProgramData.length - 1;
  }

  // Render modules table
  if (modulesTbody) {
    modulesTbody.innerHTML = "";

    currentLevel.modules.forEach((module) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="module-label">${module.label || "-"}</td>
        <td class="module-title">${module.title}</td>
      `;
      modulesTbody.appendChild(row);
    });
  }
}

// Reglamento Modal functionality
function initReglamentoModal() {
  const verReglamentoBtn = document.getElementById("ver-reglamento-btn");
  const modal = document.getElementById("reglamento-modal");
  const closeBtn = document.getElementById("reglamento-modal-close");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!verReglamentoBtn || !modal) return;

  // Open modal
  verReglamentoBtn.addEventListener("click", function () {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  // Close modal
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  closeBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });

  // Tab functionality
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      tabBtns.forEach((tab) => tab.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      this.classList.add("active");
      const targetContent = document.getElementById(targetTab + "-tab");
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

function renderSeminarCard(data) {
  const wrapper = document.createElement("div");
  wrapper.className = "card";

  wrapper.innerHTML = `
    <div class="card-header">
      <div class="title">${data.titulo}</div>
    </div>
    <div class="card-content">
      <div>
        <div class="section-title">Temas a tratar</div>
        <div class="badges">
          ${data.temas.map((t) => `<span class="badge">${t}</span>`).join("")}
        </div>
      </div>
      <div class="professor">
        <div class="avatar">
          <div class="avatar-initials">${initials(data.profesor.nombre)}</div>
        </div>
        <div class="professor-info">
          <p>${data.profesor.nombre}</p>
          <a href="https://instagram.com/${
            data.profesor.instagram
          }" target="_blank">@${data.profesor.instagram}</a>
        </div>
      </div>
    </div>
  `;
  return wrapper;
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function renderSeminars(data) {
  const container = document.getElementById("seminars-container");
  if (!container) {
    console.error("Element with ID 'seminars-container' not found");
    return;
  }
  container.innerHTML = "";
  data.forEach((seminar) => {
    const card = renderSeminarCard(seminar);
    container.appendChild(card);
  });

  // Initialize carousel after cards are rendered
  initCarousel(data.length);
}

// Carousel functionality
let currentSlide = 0;
let totalSlides = 0;
let cardsPerView = 1;

function initCarousel(totalCards) {
  totalSlides = totalCards;

  // Calculate cards per view based on screen size
  updateCardsPerView();

  // Create indicators
  createCarouselIndicators();

  // Add event listeners
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => moveSlide(-1));
    nextBtn.addEventListener("click", () => moveSlide(1));
  }

  // Update carousel state
  updateCarousel();

  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      updateCardsPerView();
      updateCarousel();
    }, 250)
  );
}

function updateCardsPerView() {
  const width = window.innerWidth;
  if (width >= 1200) {
    cardsPerView = Math.min(3, totalSlides);
  } else if (width >= 768) {
    cardsPerView = Math.min(2, totalSlides);
  } else {
    cardsPerView = 1;
  }

  // Adjust current slide if necessary
  const maxSlide = Math.max(0, totalSlides - cardsPerView);
  if (currentSlide > maxSlide) {
    currentSlide = maxSlide;
  }
}

function createCarouselIndicators() {
  const indicatorsContainer = document.getElementById("carousel-indicators");
  if (!indicatorsContainer) return;

  indicatorsContainer.innerHTML = "";

  const totalIndicators = Math.max(1, totalSlides - cardsPerView + 1);

  for (let i = 0; i < totalIndicators; i++) {
    const indicator = document.createElement("button");
    indicator.className = "carousel-indicator";
    indicator.addEventListener("click", () => goToSlide(i));
    indicatorsContainer.appendChild(indicator);
  }
}

function moveSlide(direction) {
  const maxSlide = Math.max(0, totalSlides - cardsPerView);
  currentSlide = Math.max(0, Math.min(maxSlide, currentSlide + direction));
  updateCarousel();
}

function goToSlide(slideIndex) {
  const maxSlide = Math.max(0, totalSlides - cardsPerView);
  currentSlide = Math.max(0, Math.min(maxSlide, slideIndex));
  updateCarousel();
}

function updateCarousel() {
  const carousel = document.getElementById("seminars-container");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const indicators = document.querySelectorAll(".carousel-indicator");

  if (!carousel) return;

  // Calculate card width including gap
  const cardWidth = 380; // min-width of card
  const gap = 32; // 2rem gap
  const totalWidth = cardWidth + gap;

  // Apply transform
  const translateX = -(currentSlide * totalWidth);
  carousel.style.transform = `translateX(${translateX}px)`;

  // Update button states
  if (prevBtn) {
    prevBtn.disabled = currentSlide === 0;
  }

  if (nextBtn) {
    const maxSlide = Math.max(0, totalSlides - cardsPerView);
    nextBtn.disabled = currentSlide >= maxSlide;
  }

  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentSlide);
  });
}

// Simula fetch de datos
document.addEventListener("DOMContentLoaded", () => {
  // Only load seminars if the container exists (index.html)
  if (document.getElementById("seminars-container")) {
    fetch("./public/recorded_classes.json")
      .then((res) => res.json())
      .then((data) => {
        renderSeminars(data);
      })
      .catch((err) => console.error("Error cargando JSON", err));
  }
});

// Form validation and submission functions
function validateForm() {
  const companyField = document.getElementById("company");
  if (companyField.value !== "") {
    return false;
  }
  return true;
}

async function handleContactFormSubmit(event) {
  event.preventDefault();

  // Validate spam protection
  if (!validateForm()) {
    return false;
  }

  // Get reCAPTCHA response
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    alert("Por favor completa la verificación reCAPTCHA");
    return false;
  }

  // Get form data
  const form = event.target;
  const formData = new FormData(form);

  // Build JSON payload
  const data = {
    api_key: "C3AB8FF13720E8AD9047DD39466B3C8974E592C2FA383D4A3960714CAEF0C4F2",
    contact_type: "contacto",
    "g-recaptcha-response": recaptchaResponse,
    email: formData.get("email"),
    fullname: formData.get("fullname"),
    whatsapp: formData.get("whatsapp"),
    location: formData.get("location"),
    occupation: formData.get("occupation"),
    how_found: formData.get("how_found"),
    contact_times: formData.get("contact_times"),
  };

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitBtn.disabled = true;

  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxFuX1b4_ccMbLQdV3fQMoOAjZF8bx3_VscWKUB_UwdejYf7n491KmDEVK8LoSmzW1XMA/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      // Show success message
      alert("¡Mensaje enviado exitosamente! Te contactaremos pronto.");
      form.reset();
      grecaptcha.reset();
    } else {
      throw new Error("Error en el envío");
    }
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Hubo un error al enviar el formulario. Por favor intenta nuevamente."
    );
  } finally {
    // Restore button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }

  return false;
}

// Banner Modal functionality
function initBannerModal() {
  const modal = document.getElementById("banner-modal");
  const closeBtn = document.getElementById("banner-modal-close");
  const bannerImage = document.querySelector(".banner-image");

  if (!modal) return;

  const currentDate = new Date();
  const expirationDate = new Date(2025, 8, 8);

  if (currentDate < expirationDate) {
    setTimeout(() => {
      showBannerModal();
    }, 1000);
  }

  // Close modal function
  function closeBannerModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";

    // Hide modal after animation completes
    setTimeout(() => {
      modal.style.display = "none";
    }, 400);
  }

  // Show modal function
  function showBannerModal() {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Add show class for animation
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  }

  // Close button event
  if (closeBtn) {
    closeBtn.addEventListener("click", closeBannerModal);
  }

  // Click on image to go to form (same as info button)
  if (bannerImage) {
    bannerImage.addEventListener("click", function () {
      window.open(
        "https://docs.google.com/forms/d/1HhfngYJWTir6zYP5C81m5VNgpnaWjL-Jgxf-kjF_mTM/preview",
        "_blank"
      );
    });
  }

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeBannerModal();
    }
  });

  // Close modal with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeBannerModal();
    }
  });
}

// Export functions for external use
window.AcademiaABC = {
  showLoading,
  hideLoading,
  initSmoothScrolling,
  initScrollAnimations,
  initHeaderScroll,
  initMobileMenu,
  initBackToTop,
  initCarousel,
  moveSlide,
  goToSlide,
  updateCarousel,
  validateForm,
  handleContactFormSubmit,
};
