const welcomeScreen = document.querySelector("#welcomeScreen");
const birthdayPage = document.querySelector("#birthdayPage");
const openSurpriseButton = document.querySelector("#openSurpriseButton");
const candleButton = document.querySelector("#candleButton");
const candleWrap = document.querySelector(".candle-wrap");
const candleHint = document.querySelector("#candleHint");
const wishReveal = document.querySelector("#wishReveal");
const replayButton = document.querySelector("#replayButton");
const openLetterButton = document.querySelector("#openLetterButton");
const closeLetterButton = document.querySelector("#closeLetterButton");
const letterBackdrop = document.querySelector("#letterBackdrop");
const celebrationLayer = document.querySelector("#celebrationLayer");
const announcement = document.querySelector("#announcement");

let hasBlownOutCandle = false;
let previousFocus = null;

openSurpriseButton.addEventListener("click", () => {
  welcomeScreen.classList.add("is-leaving");
  birthdayPage.classList.add("is-visible");
  birthdayPage.setAttribute("aria-hidden", "false");

  window.setTimeout(() => {
    welcomeScreen.hidden = true;
    candleButton.focus({ preventScroll: true });
  }, 700);
});

function createConfetti() {
  const colors = ["#f28db3", "#ffd166", "#ffffff", "#cf5b89", "#f7b8cf", "#d9a7bd"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 110; i += 1) {
    const piece = document.createElement("span");
    const isCircle = Math.random() > 0.68;
    piece.className = `confetti-piece${isCircle ? " circle" : ""}`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--fall-duration", `${2.6 + Math.random() * 2.2}s`);
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.setProperty("--spin", `${Math.random() * 1000 - 500}deg`);
    piece.style.animationDelay = `${Math.random() * 0.9}s`;
    fragment.appendChild(piece);
  }

  celebrationLayer.appendChild(fragment);
  window.setTimeout(() => {
    celebrationLayer.querySelectorAll(".confetti-piece").forEach((piece) => piece.remove());
  }, 6500);
}

function createFloatingHearts() {
  const hearts = ["♥", "♡", "❤", "💕"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 25; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${1 + Math.random() * 1.3}rem`;
    heart.style.setProperty("--heart-duration", `${3 + Math.random() * 2.5}s`);
    heart.style.setProperty("--heart-drift", `${Math.random() * 130 - 65}px`);
    heart.style.animationDelay = `${Math.random() * 1.2}s`;
    fragment.appendChild(heart);
  }

  celebrationLayer.appendChild(fragment);
  window.setTimeout(() => {
    celebrationLayer.querySelectorAll(".floating-heart").forEach((heart) => heart.remove());
  }, 7000);
}

function blowOutCandle() {
  if (hasBlownOutCandle) return;

  hasBlownOutCandle = true;
  candleWrap.classList.add("is-out");
  candleButton.setAttribute("aria-label", "The birthday candle is out");
  candleButton.disabled = true;
  candleHint.textContent = "Wish made! Now let the birthday magic begin. ✨";
  announcement.textContent = "The candle is out. Happy birthday!";

  createConfetti();
  createFloatingHearts();

  window.setTimeout(() => {
    wishReveal.hidden = false;
    replayButton.hidden = false;
    wishReveal.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 650);
}

candleButton.addEventListener("click", blowOutCandle);

function openLetter() {
  previousFocus = document.activeElement;
  letterBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  closeLetterButton.focus();
}

function closeLetter() {
  letterBackdrop.hidden = true;
  document.body.style.overflow = "";
  if (previousFocus instanceof HTMLElement) previousFocus.focus();
}

openLetterButton.addEventListener("click", openLetter);
closeLetterButton.addEventListener("click", closeLetter);

letterBackdrop.addEventListener("click", (event) => {
  if (event.target === letterBackdrop) closeLetter();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !letterBackdrop.hidden) closeLetter();
});

replayButton.addEventListener("click", () => {
  hasBlownOutCandle = false;
  candleWrap.classList.remove("is-out");
  candleButton.disabled = false;
  candleButton.setAttribute("aria-label", "Blow out the birthday candle");
  candleHint.innerHTML = '<span class="hint-sparkle" aria-hidden="true">✧</span>Close your eyes, make a wish, and tap the candle<span class="hint-sparkle" aria-hidden="true">✧</span>';
  wishReveal.hidden = true;
  replayButton.hidden = true;
  celebrationLayer.replaceChildren();
  candleButton.focus();
});
