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
