// ========================================
// Reservation Page JavaScript - Academia ABC
// ========================================

let allMasterclasses = [];
let filteredMasterclasses = [];
let cart = [];
const PRICE_PER_CLASS = 25000;
const PROMO_2_CLASSES = 40000;
const CLASSES_PER_PAGE = 6;
let currentPage = 1;
let currentTypeFilter = "all";
let currentSearchFilter = "";

document.addEventListener("DOMContentLoaded", function () {
  loadMasterclasses();
  setupCartHandlers();
  setupFilterHandlers();
  setupPaginationHandlers();
  setupModalHandlers();
});

// Load masterclasses from JSON
async function loadMasterclasses() {
  try {
    const response = await fetch("./public/recorded_classes.json");
    allMasterclasses = await response.json();
    filteredMasterclasses = [...allMasterclasses];
    displayPage();
  } catch (error) {
    console.error("Error loading masterclasses:", error);
  }
}

// Display masterclasses in the grid
function displayMasterclasses(masterclasses) {
  const container = document.getElementById("masterclasses-container");

  container.innerHTML = masterclasses
    .map(
      (masterclass) => `
        <div class="masterclass-card" data-id="${masterclass.id}" data-type="${
        masterclass.tipo
      }">
            <div class="masterclass-header">
                <div class="masterclass-type">
                    <span class="type-badge ${masterclass.tipo.toLowerCase()}">${
        masterclass.tipo
      }</span>
                </div>
                <h3>${masterclass.titulo}</h3>
            </div>
            <div class="masterclass-content">
                <div class="masterclass-topics">
                    ${masterclass.temas
                      .map(
                        (tema) => `
                        <span class="topic-badge">${tema}</span>
                    `
                      )
                      .join("")}
                </div>
                <div class="masterclass-footer">
                    <div class="professor-info">
                        <h4>${masterclass.profesor.nombre}</h4>
                        <a href="https://instagram.com/${
                          masterclass.profesor.instagram
                        }" target="_blank" class="instagram">
                            <i class="fab fa-instagram"></i> @${
                              masterclass.profesor.instagram
                            }
                        </a>
                    </div>
                    <button class="add-to-cart-btn ${
                      cart.includes(masterclass.id) ? "in-cart" : ""
                    }" onclick="toggleCart(${masterclass.id})">
                        ${cart.includes(masterclass.id) ? "Quitar" : "Agregar"}
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Setup filter handlers
function setupFilterHandlers() {
  const typeFilter = document.getElementById("typeFilter");
  const searchFilter = document.getElementById("searchFilter");

  typeFilter.addEventListener("change", function () {
    currentTypeFilter = this.value;
    applyFilters();
  });

  searchFilter.addEventListener("input", function () {
    currentSearchFilter = this.value.toLowerCase().trim();
    applyFilters();
  });
}

// Apply all filters
function applyFilters() {
  filteredMasterclasses = allMasterclasses.filter((masterclass) => {
    // Filter by type
    const typeMatch =
      currentTypeFilter === "all" || masterclass.tipo === currentTypeFilter;

    // Filter by search term
    let searchMatch = true;
    if (currentSearchFilter) {
      const searchTerm = currentSearchFilter;
      const titulo = masterclass.titulo.toLowerCase();
      const temas = masterclass.temas.join(" ").toLowerCase();
      const profesorNombre = masterclass.profesor.nombre.toLowerCase();
      const profesorInstagram = masterclass.profesor.instagram.toLowerCase();

      searchMatch =
        titulo.includes(searchTerm) ||
        temas.includes(searchTerm) ||
        profesorNombre.includes(searchTerm) ||
        profesorInstagram.includes(searchTerm);
    }

    return typeMatch && searchMatch;
  });

  currentPage = 1;
  displayPage();
}

// Setup cart handlers
function setupCartHandlers() {
  const clearCartBtn = document.getElementById("clear-cart");

  clearCartBtn.addEventListener("click", function () {
    cart = [];
    updateCartDisplay();
    displayPage();
  });
}

// Toggle item in cart
function toggleCart(classId) {
  const index = cart.indexOf(classId);

  if (index > -1) {
    cart.splice(index, 1);
  } else {
    cart.push(classId);
  }

  updateCartDisplay();
  displayPage();
}

// Update cart display
function updateCartDisplay() {
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartCount.textContent = cart.length;

  const total = calculateTotal();
  cartTotal.textContent = `$${total.toLocaleString()}`;

  // Show/hide checkout button
  if (cart.length > 0) {
    checkoutBtn.style.display = "flex";
  } else {
    checkoutBtn.style.display = "none";
  }
}

// Calculate total with promotions
function calculateTotal() {
  const count = cart.length;

  if (count === 0) return 0;
  if (count === 1) return PRICE_PER_CLASS;

  // Calculate total: every 2 classes get $10,000 discount
  const subtotal = count * PRICE_PER_CLASS;
  const pairsOfClasses = Math.floor(count / 2);
  const discount = pairsOfClasses * 10000;

  return subtotal - discount;
}

// Update form display (removed - using modal only)

// Setup form submission (removed - using modal only)

// Setup pagination handlers
function setupPaginationHandlers() {
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");

  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayPage();
    }
  });

  nextBtn.addEventListener("click", function () {
    const totalPages = Math.ceil(
      filteredMasterclasses.length / CLASSES_PER_PAGE
    );
    if (currentPage < totalPages) {
      currentPage++;
      displayPage();
    }
  });
}

// Display current page
function displayPage() {
  const startIndex = (currentPage - 1) * CLASSES_PER_PAGE;
  const endIndex = startIndex + CLASSES_PER_PAGE;
  const pageClasses = filteredMasterclasses.slice(startIndex, endIndex);

  displayMasterclasses(pageClasses);
  updatePaginationControls();
}

// Update pagination controls
function updatePaginationControls() {
  const totalPages = Math.ceil(filteredMasterclasses.length / CLASSES_PER_PAGE);
  const paginationContainer = document.getElementById("pagination-container");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const currentPageSpan = document.getElementById("current-page");
  const totalPagesSpan = document.getElementById("total-pages");

  // Show/hide pagination based on number of classes
  if (totalPages > 1) {
    paginationContainer.style.display = "block";
  } else {
    paginationContainer.style.display = "none";
    return;
  }

  // Update page numbers
  currentPageSpan.textContent = currentPage;
  totalPagesSpan.textContent = totalPages;

  // Update button states
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Setup modal handlers
function setupModalHandlers() {
  const checkoutBtn = document.getElementById("checkout-btn");
  const modal = document.getElementById("checkout-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalForm = document.getElementById("modal-form");

  // Open modal
  checkoutBtn.addEventListener("click", function () {
    updateModalContent();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  // Close modal
  const closeModal = function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    modalForm.reset();
  };

  modalCloseBtn.addEventListener("click", closeModal);

  // Close modal on overlay click
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle form submission
  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleModalFormSubmission();
  });
}

// Update modal content with cart data
function updateModalContent() {
  const modalSelectedClasses = document.getElementById(
    "modal-selected-classes"
  );
  const modalSummaryCount = document.getElementById("modal-summary-count");
  const modalSummarySubtotal = document.getElementById(
    "modal-summary-subtotal"
  );
  const modalSummaryTotal = document.getElementById("modal-summary-total");
  const modalDiscountLine = document.getElementById("modal-discount-line");
  const modalSummaryDiscount = document.getElementById(
    "modal-summary-discount"
  );

  // Show selected classes
  const selectedClasses = cart
    .map((id) => {
      const masterclass = allMasterclasses.find((m) => m.id === id);
      return `<div class="modal-selected-class">
      <span>${masterclass.titulo}</span>
      <span>$${PRICE_PER_CLASS.toLocaleString()}</span>
    </div>`;
    })
    .join("");

  modalSelectedClasses.innerHTML = selectedClasses;

  // Calculate prices
  const count = cart.length;
  const subtotal = count * PRICE_PER_CLASS;
  const total = calculateTotal();
  const discount = subtotal - total;

  modalSummaryCount.textContent = count;
  modalSummarySubtotal.textContent = `$${subtotal.toLocaleString()}`;
  modalSummaryTotal.textContent = `$${total.toLocaleString()}`;

  if (discount > 0) {
    modalDiscountLine.style.display = "block";
    modalSummaryDiscount.textContent = `-$${discount.toLocaleString()}`;
  } else {
    modalDiscountLine.style.display = "none";
  }
}

// Handle modal form submission
async function handleModalFormSubmission() {
  const formData = new FormData(document.getElementById("modal-form"));

  // Get reCAPTCHA response
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    alert("Por favor completa la verificación reCAPTCHA");
    return;
  }

  const data = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    selectedClasses: cart,
  };

  // Validate required fields
  if (!data.fullName || !data.email || !data.phone) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  if (cart.length === 0) {
    alert("Por favor selecciona al menos una clase");
    return;
  }

  // Build JSON payload for API
  const apiData = {
    api_key: "C3AB8FF13720E8AD9047DD39466B3C8974E592C2FA383D4A3960714CAEF0C4F2",
    contact_type: "masterclass",
    "g-recaptcha-response": recaptchaResponse,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    selectedClasses: data.selectedClasses.join(","),
  };

  // Show processing state
  const confirmBtn = document.getElementById("modal-confirm-btn");
  const originalText = confirmBtn.innerHTML;
  confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  confirmBtn.disabled = true;

  try {
    const formData = new FormData();
    Object.keys(apiData).forEach(key => {
      formData.append(key, apiData[key]);
    });

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyxeQvXCm12DdeF9KxFswM2mll-Ow800bdOIQI1o_Fpm1pyAhHRecRD3oEZbSlZkTYayw/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      // Close modal
      document.getElementById("checkout-modal").style.display = "none";
      document.body.style.overflow = "auto";

      // Show success message
      showCheckoutSuccessMessage(data);

      // Reset everything
      resetCartState();
    } else {
      throw new Error("Error en el envío");
    }
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Hubo un error al procesar la reserva. Por favor intenta nuevamente."
    );
  } finally {
    // Reset button
    confirmBtn.innerHTML = originalText;
    confirmBtn.disabled = false;
  }
}

// Show checkout success message
function showCheckoutSuccessMessage(data) {
  const message = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; text-align: center; margin: 1rem;">
        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--warm-gold); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">¡Reserva Recibida!</h3>
        <p style="margin-bottom: 1rem;">
          Gracias ${data.fullName}, hemos recibido tu reserva para ${
    data.classCount
  } clase${data.classCount > 1 ? "s" : ""}.
        </p>
        <p style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--primary-blue);">
          <strong>Total: $${data.total.toLocaleString()}</strong>
        </p>
        <p style="margin-bottom: 1.5rem;">
          En la brevedad te enviaremos un email con las instrucciones de pago a <strong>${
            data.email
          }</strong>.
        </p>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: var(--warm-gold); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 30px; cursor: pointer;">
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", message);
}

// Reset cart state
function resetCartState() {
  cart = [];
  updateCartDisplay();
  displayPage();
  document.getElementById("modal-form").reset();
  if (typeof grecaptcha !== "undefined") {
    grecaptcha.reset();
  }
}

// Handle form submission
function handleFormSubmission() {
  const form = document.querySelector(".reservation-form-fields");
  const formData = new FormData(form);

  const data = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    selectedClasses: cart,
  };

  // Validate required fields
  if (!validateForm(data)) {
    return;
  }

  // Process the reservation
  processReservation(data);
}

// Validate form data
function validateForm(data) {
  const required = ["fullName", "email", "phone"];

  for (let field of required) {
    if (!data[field]) {
      alert(`Por favor completa el campo: ${getFieldLabel(field)}`);
      return false;
    }
  }

  if (cart.length === 0) {
    alert("Por favor selecciona al menos una clase");
    return false;
  }

  return true;
}

// Get field label for validation messages
function getFieldLabel(field) {
  const labels = {
    fullName: "Nombre Completo",
    email: "Email",
    phone: "Teléfono",
    pricingOption: "Modalidad de Pago",
    paymentMethod: "Método de Pago",
  };
  return labels[field] || field;
}

// Process reservation
function processReservation(data) {
  // Show loading state
  const submitButton = document.querySelector(".form-actions button");
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  submitButton.disabled = true;

  // Simulate API call (replace with actual implementation)
  setTimeout(() => {
    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;

    // Show success message
    showSuccessMessage(data);

    // In a real implementation, you would:
    // 1. Send data to your backend API
    // 2. Process payment
    // 3. Send confirmation emails
    // 4. Update database

    console.log("Reservation data:", data);
  }, 2000);
}

// Show success message
function showSuccessMessage(data) {
  const classesText = data.selectedClasses.join(", ");
  const message = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; text-align: center; margin: 1rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--warm-gold); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">¡Reserva Exitosa!</h3>
                <p style="margin-bottom: 1rem;">
                    Gracias ${data.fullName}, hemos recibido tu reserva para ${
    data.classCount
  } clase${data.classCount > 1 ? "s" : ""}:
                </p>
                <p style="margin-bottom: 1rem; font-weight: bold;">
                    ${classesText}
                </p>
                <p style="margin-bottom: 1rem; font-size: 1.2rem; color: var(--primary-blue);">
                    <strong>Total a transferir: $${data.total.toLocaleString()}</strong>
                </p>
                <p style="margin-bottom: 1.5rem;">
                    Te enviaremos los datos de pago y confirmación a ${
                      data.email
                    }.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: var(--warm-gold); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 30px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", message);
}

// Smooth scroll to form when CTA is clicked
document.addEventListener("click", function (e) {
  if (e.target.matches('a[href="#reservar"]')) {
    e.preventDefault();
    document.getElementById("reservar").scrollIntoView({
      behavior: "smooth",
    });
  }
});

// Add animation on scroll
function addScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  // Observe elements for animation
  document
    .querySelectorAll(".pricing-card, .masterclass-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease";
      observer.observe(el);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", addScrollAnimations);
