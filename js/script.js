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
