// ── Countdown ────────────────────────────────────────────────
const weddingDate = new Date("2026-05-30T10:30:00");
const countdownUnits = {
  days:    document.getElementById("days"),
  hours:   document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  if (Object.values(countdownUnits).some((unit) => !unit)) return;

  const distance    = Math.max(0, weddingDate - new Date());
  const secondsTotal = Math.floor(distance / 1000);

  countdownUnits.days.textContent    = pad(Math.floor(secondsTotal / 86400));
  countdownUnits.hours.textContent   = pad(Math.floor((secondsTotal % 86400) / 3600));
  countdownUnits.minutes.textContent = pad(Math.floor((secondsTotal % 3600) / 60));
  countdownUnits.seconds.textContent = pad(secondsTotal % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── Scroll reveal ────────────────────────────────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ── RSVP Dialogs ─────────────────────────────────────────────
const dialogYes = document.getElementById("dialog-yes");
const dialogNo  = document.getElementById("dialog-no");

function openDialog(dialog) {
  dialog.classList.remove("closing");
  dialog.classList.add("open");

  // Re-trigger icon bounce animation on every open
  const icon = dialog.querySelector(".rsvp-dialog-icon");
  if (icon) {
    icon.style.animation = "none";
    // Force reflow so the browser registers the reset
    void icon.offsetWidth;
    icon.style.animation = "";
  }

  // Move focus to close button for accessibility
  const closeBtn = dialog.querySelector(".rsvp-dialog-close");
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeDialog(dialog) {
  dialog.classList.add("closing");
  // Wait for animation then hide
  dialog.addEventListener(
    "animationend",
    () => {
      dialog.classList.remove("open", "closing");
    },
    { once: true }
  );
}

// Button clicks
const [btnYes, btnNo] = document.querySelectorAll(".rsvp-actions button");

if (btnYes) {
  btnYes.addEventListener("click", () => {
    document.querySelectorAll(".rsvp-actions button").forEach((b) =>
      b.classList.toggle("selected", b === btnYes)
    );
    openDialog(dialogYes);
  });
}

if (btnNo) {
  btnNo.addEventListener("click", () => {
    document.querySelectorAll(".rsvp-actions button").forEach((b) =>
      b.classList.toggle("selected", b === btnNo)
    );
    openDialog(dialogNo);
  });
}

// Close buttons inside dialogs
document.querySelectorAll(".rsvp-dialog-close").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.close;
    const dialog = document.getElementById(id);
    if (dialog) closeDialog(dialog);
  });
});

// Click outside dialog box to close
[dialogYes, dialogNo].forEach((overlay) => {
  if (!overlay) return;
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDialog(overlay);
  });
});

// Escape key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    [dialogYes, dialogNo].forEach((d) => {
      if (d && d.classList.contains("open")) closeDialog(d);
    });
  }
});
