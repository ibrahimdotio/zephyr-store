import { cards } from "./cards.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const dialog = document.querySelector("#inspector");
let activeIndex = 0;
let returnFocus;
let inspectionController;
let effectsEnabled = true;

/** Native pointer input drives Simon Goellner's original CSS foil variables. */
function createCard(card, { inspection = false, eager = false } = {}) {
  const root = document.createElement("div");
  root.className = `card interactive is-resting ${card.type}${inspection ? " is-inspection" : ""}`;
  root.dataset.rarity = card.effect;
  root.dataset.subtypes = card.subtypes;
  root.dataset.supertype = "pokémon";
  root.dataset.trainerGallery = "false";
  root.innerHTML = `<div class="card__translater"><button class="card__rotator" type="button" aria-label="${inspection ? "Incliner" : "Examiner"} ${card.name}"><img class="card__back" src="./assets/cards/back.jpg" alt="Dos de la carte Pokémon" width="660" height="921" draggable="false"><div class="card__front"><img src="${card.image}" alt="${card.name}, ${card.set}, ${card.number}" width="734" height="1024" loading="${eager ? "eager" : "lazy"}" decoding="async" draggable="false"><div class="card__shine"></div><div class="card__glare"></div></div></button></div>`;
  const button = root.querySelector("button");
  const frontImage = root.querySelector(".card__front img");
  frontImage.addEventListener(
    "error",
    () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = `${card.name} — illustration indisponible. Rechargez la page pour réessayer.`;
      root.append(fallback);
    },
    { once: true },
  );
  let raf = 0;
  let resetTimer = 0;
  let flipTimer = 0;
  let start;
  let dragged = false;
  let current = { x: 50, y: 50, opacity: 0 };
  let target = { ...current };
  function paint() {
    const dx = current.x - 50;
    const dy = current.y - 50;
    const vars = {
      "--pointer-x": `${current.x}%`,
      "--pointer-y": `${current.y}%`,
      "--rotate-x": `${reducedMotion.matches ? 0 : -dx / 3.5}deg`,
      "--rotate-y": `${reducedMotion.matches ? 0 : dy / 3.5}deg`,
      "--background-x": `${37 + current.x * 0.26}%`,
      "--background-y": `${33 + current.y * 0.34}%`,
      "--pointer-from-center": Math.min(1, Math.hypot(dx, dy) / 50),
      "--pointer-from-top": current.y / 100,
      "--pointer-from-left": current.x / 100,
      "--card-opacity": current.opacity,
    };
    for (const [key, value] of Object.entries(vars))
      root.style.setProperty(key, String(value));
  }
  function step() {
    let unsettled = false;
    for (const key of Object.keys(current)) {
      const delta = target[key] - current[key];
      current[key] += delta * 0.17;
      if (Math.abs(delta) > 0.015) unsettled = true;
      else current[key] = target[key];
    }
    paint();
    raf = unsettled && root.isConnected ? requestAnimationFrame(step) : 0;
  }
  function move(x, y, opacity = 1) {
    target = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      opacity,
    };
    if (!raf) raf = requestAnimationFrame(step);
  }
  function reset() {
    clearTimeout(resetTimer);
    root.classList.remove("is-interacting");
    root.classList.add("is-resting");
    move(50, 50, 0);
  }
  function flip() {
    root.classList.add("is-flipping");
    root.classList.toggle("is-flipped");
    reset();
    clearTimeout(flipTimer);
    flipTimer = setTimeout(() => root.classList.remove("is-flipping"), 650);
  }
  function preview() {
    root.classList.remove("is-resting");
    move(22, 26, 0.8);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(reset, 1600);
  }
  button.addEventListener("pointerdown", (event) => {
    start = { x: event.clientX, y: event.clientY };
    dragged = false;
    if (inspection) button.setPointerCapture(event.pointerId);
  });
  button.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" && !inspection) return;
    clearTimeout(resetTimer);
    if (
      start &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 7
    )
      dragged = true;
    const bounds = root.getBoundingClientRect();
    root.classList.add("is-interacting");
    root.classList.remove("is-resting");
    move(
      ((event.clientX - bounds.left) / bounds.width) * 100,
      ((event.clientY - bounds.top) / bounds.height) * 100,
    );
  });
  button.addEventListener("pointerup", (event) => {
    start = undefined;
    if (button.hasPointerCapture(event.pointerId))
      button.releasePointerCapture(event.pointerId);
    if (event.pointerType === "touch") resetTimer = setTimeout(reset, 600);
  });
  button.addEventListener("pointercancel", () => {
    start = undefined;
    dragged = true;
    reset();
  });
  button.addEventListener("pointerleave", reset);
  button.addEventListener("blur", reset);
  button.addEventListener("focus", () => {
    if (button.matches(":focus-visible")) preview();
  });
  button.addEventListener("click", () => {
    if (dragged) {
      dragged = false;
      return;
    }
    if (!inspection) openInspector(cards.indexOf(card));
  });
  button.addEventListener("keydown", (event) => {
    if (!inspection) return;
    const deltas = {
      ArrowLeft: [-12, 0],
      ArrowRight: [12, 0],
      ArrowUp: [0, -12],
      ArrowDown: [0, 12],
    };
    if (deltas[event.key]) {
      event.preventDefault();
      const [x, y] = deltas[event.key];
      move(target.x + x, target.y + y);
    }
    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      flipInspection();
    }
    if (event.key === "Home") {
      event.preventDefault();
      resetInspection();
    }
  });
  return {
    root,
    reset,
    flip,
    preview,
    dispose() {
      cancelAnimationFrame(raf);
      clearTimeout(resetTimer);
      clearTimeout(flipTimer);
    },
  };
}

const hero = createCard(cards[0], { eager: true });
document.querySelector("#hero-card").append(hero.root);
if (!reducedMotion.matches) {
  const image = hero.root.querySelector(".card__front img");
  if (image.complete) hero.preview();
  else image.addEventListener("load", hero.preview, { once: true });
}
document
  .querySelector("#inspect-hero")
  .addEventListener("click", () => openInspector(0));

const grid = document.querySelector("#card-grid");
cards.forEach((card, index) => {
  const article = document.createElement("article");
  article.className = "product";
  article.innerHTML = `<div class="product-surface"><span class="product-index">${String(index + 1).padStart(2, "0")}</span><span class="expand-indicator" aria-hidden="true">↗</span></div><div class="product-info"><p class="product-set">${card.set}</p><div class="product-heading"><h3>${card.name}</h3><span class="product-number">${card.number}</span></div><div class="product-bottom"><span class="finish-badge">${card.finish}</span><button class="product-inspect" aria-label="Examiner la carte ${card.name}">Voir la carte <span aria-hidden="true">↗</span></button></div></div>`;
  article.querySelector(".product-surface").append(createCard(card).root);
  article
    .querySelector(".product-inspect")
    .addEventListener("click", () => openInspector(index));
  grid.append(article);
});

function renderInspector() {
  const card = cards[activeIndex];
  inspectionController?.dispose();
  inspectionController = createCard(card, { inspection: true, eager: true });
  document
    .querySelector("#inspector-card")
    .replaceChildren(inspectionController.root);
  const values = {
    "inspector-title": card.name,
    "inspector-set": card.set.toUpperCase(),
    "inspector-finish": card.finish,
    "inspector-tagline": card.tagline,
    "inspector-description": card.description,
    "inspector-number": card.number,
    "inspector-series": card.set,
    "inspector-position": `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`,
  };
  for (const [id, value] of Object.entries(values))
    document.getElementById(id).textContent = value;
  document.querySelector("#flip-card").textContent = "↻ Retourner";
  document.querySelector("#flip-card").setAttribute("aria-pressed", "false");
  document.querySelector("#inspector-hint").textContent = window.matchMedia(
    "(pointer: coarse)",
  ).matches
    ? "Faites glisser votre doigt sur la carte pour explorer ses reflets."
    : "Survolez la carte pour explorer ses reflets.";
}
function openInspector(index) {
  activeIndex = index;
  returnFocus = document.activeElement;
  hero.reset();
  renderInspector();
  dialog.showModal();
  document.querySelector("#close-inspector").focus({ preventScroll: true });
}
function closeInspector() {
  dialog.close();
}
function flipInspection() {
  inspectionController.flip();
  const flipped = inspectionController.root.classList.contains("is-flipped");
  document.querySelector("#flip-card").textContent = flipped
    ? "↻ Voir le recto"
    : "↻ Retourner";
  document
    .querySelector("#flip-card")
    .setAttribute("aria-pressed", String(flipped));
}
function resetInspection() {
  if (inspectionController.root.classList.contains("is-flipped"))
    flipInspection();
  inspectionController.reset();
}
document
  .querySelector("#close-inspector")
  .addEventListener("click", closeInspector);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      closeInspector();
  }
});
dialog.addEventListener("close", () => {
  inspectionController?.dispose();
  document.querySelector("#inspector-card").replaceChildren();
  returnFocus?.focus({ preventScroll: true });
});
document.querySelector("#flip-card").addEventListener("click", flipInspection);
document
  .querySelector("#reset-card")
  .addEventListener("click", resetInspection);
document.querySelector("#previous-card").addEventListener("click", () => {
  activeIndex = (activeIndex - 1 + cards.length) % cards.length;
  renderInspector();
});
document.querySelector("#next-card").addEventListener("click", () => {
  activeIndex = (activeIndex + 1) % cards.length;
  renderInspector();
});
document.querySelector("#effects-toggle").addEventListener("click", (event) => {
  effectsEnabled = !effectsEnabled;
  document.body.classList.toggle("effects-off", !effectsEnabled);
  event.currentTarget.setAttribute("aria-pressed", String(effectsEnabled));
  document.querySelector("#effects-status").textContent = effectsEnabled
    ? "activés"
    : "désactivés";
});
