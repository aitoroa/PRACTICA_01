let burger = document.querySelector(".burger > i");
let menu_opt = document.querySelector(".menu");

burger.addEventListener("click", function () {
  burger.classList.toggle("fa-bars");
  burger.classList.toggle("fa-times");
  menu_opt.classList.toggle("menu-show");
});

const headerEl = document.querySelector("header");

function handleScroll() {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollY <= 0 || scrollY >= maxScroll - 5) {
    headerEl.classList.remove("is-scrolled");
  } else {
    headerEl.classList.add("is-scrolled");
  }
}

document.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

(function () {
  let slideIndex = 1;
  let autoSlide;
  const slides = document.querySelectorAll("#artistas .mySlides");
  const dots = document.querySelectorAll("#artistas .dot");
  const prev = document.querySelector("#artistas .prev");
  const next = document.querySelector("#artistas .next");

  if (!slides.length) return;

  function showSlide(n) {
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    slides.forEach((s) => (s.style.display = "none"));
    dots.forEach((d) => d.classList.remove("active"));

    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add("fade");
    dots[slideIndex - 1].classList.add("active");
  }

  function nextPrevSlide(step) {
    showSlide((slideIndex += step));
  }
  function currentDotSlide(i) {
    showSlide((slideIndex = i + 1));
  }

  function startAutoSlide() {
    autoSlide = setInterval(() => nextPrevSlide(1), 3000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  showSlide(slideIndex);
  startAutoSlide();

  next?.addEventListener("click", () => {
    stopAutoSlide();
    nextPrevSlide(1);
    startAutoSlide();
  });
  prev?.addEventListener("click", () => {
    stopAutoSlide();
    nextPrevSlide(-1);
    startAutoSlide();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoSlide();
      currentDotSlide(i);
      startAutoSlide();
    });
  });

  const container = document.querySelector("#artistas .slideshow-container");
  container?.addEventListener("mouseenter", stopAutoSlide);
  container?.addEventListener("mouseleave", startAutoSlide);
})();

(function () {
  const form = document.getElementById("ticketsForm");
  if (!form) return;

  const ticketRadios = form.querySelectorAll('input[name="ticketType"]');
  const qtyInput = form.querySelector("#qty");
  const dayRow = form.querySelector("#dayRow");
  const extras = [
    form.querySelector("#extraMerch"),
    form.querySelector("#extraFastlane"),
  ];
  const subtotalEl = form.querySelector("#subtotal");
  const taxEl = form.querySelector("#tax");
  const totalEl = form.querySelector("#total");
  const terms = form.querySelector("#terms");
  const buyBtn = form.querySelector("#buyBtn");
  const feedback = form.querySelector("#feedback");

  const IVA = 0.21;

  function getSelectedTicket() {
    const r = [...ticketRadios].find((r) => r.checked);
    const price = Number(r?.dataset.price || 0);
    const type = r?.value || "sencilla";
    return { price, type };
  }

  function getExtrasTotal() {
    return extras.reduce(
      (sum, el) => sum + (el?.checked ? Number(el.dataset.price || 0) : 0),
      0
    );
  }

  function formatEUR(n) {
    return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  }

  function toggleDayRow() {
    const { type } = getSelectedTicket();
    dayRow.style.display = type === "sencilla" ? "grid" : "none";
  }

  function recalc() {
    const { price } = getSelectedTicket();
    const qty = Math.max(1, Math.min(10, Number(qtyInput.value || 1)));
    qtyInput.value = qty;

    const extrasTotal = getExtrasTotal();
    const base = (price + extrasTotal) * qty;
    const tax = base * IVA;
    const total = base + tax;

    subtotalEl.textContent = formatEUR(base);
    taxEl.textContent = formatEUR(tax);
    totalEl.textContent = formatEUR(total);

    buyBtn.disabled = !terms.checked;
  }

  ticketRadios.forEach((r) =>
    r.addEventListener("change", () => {
      toggleDayRow();
      recalc();
    })
  );
  qtyInput.addEventListener("input", recalc);
  extras.forEach((e) => e?.addEventListener("change", recalc));
  terms.addEventListener("change", () => {
    buyBtn.disabled = !terms.checked;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (buyBtn.disabled) return;
    feedback.hidden = false;
    feedback.textContent = "¡Gracias! Hemos registrado tu solicitud.";
  });

  toggleDayRow();
  recalc();
})();

(function () {
  const minusBtn = document.getElementById("minusBtn");
  const plusBtn = document.getElementById("plusBtn");
  const qtyInput = document.getElementById("qty");

  if (!minusBtn || !plusBtn || !qtyInput) return;

  minusBtn.addEventListener("click", () => {
    let current = Number(qtyInput.value);
    if (current > Number(qtyInput.min)) {
      qtyInput.value = current - 1;
      qtyInput.dispatchEvent(new Event("input"));
    }
  });

  plusBtn.addEventListener("click", () => {
    let current = Number(qtyInput.value);
    if (current < Number(qtyInput.max)) {
      qtyInput.value = current + 1;
      qtyInput.dispatchEvent(new Event("input"));
    }
  });
})();

(function () {
  const modal = document.querySelector("#modalWindow");
  const buyBtn = document.querySelector("#buyBtn");
  const closeX = modal?.querySelector(".close");
  const closeMain = modal?.querySelector("#closeModal");

  if (!modal || !buyBtn) return;

  function openModalWindow() {
    modal.classList.add("show-modal");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModalWindow() {
    modal.classList.remove("show-modal");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  buyBtn.addEventListener("click", (e) => {
    if (buyBtn.hasAttribute("disabled")) return;
  });

  const form = document.getElementById("ticketsForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (buyBtn.disabled) return;
      openModalWindow();
    });
  }

  closeX?.addEventListener("click", closeModalWindow);
  closeMain?.addEventListener("click", closeModalWindow);

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModalWindow();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show-modal")) {
      closeModalWindow();
    }
  });
})();

(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.value)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }

    alert("¡Gracias por tu mensaje! Nos pondremos en contacto pronto.");
    form.reset();

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
