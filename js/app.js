document.addEventListener("DOMContentLoaded", function () {
  const e = document.querySelectorAll(".registerBtn"),
    t = document.getElementById("registrationModal"),
    n = document.getElementById("closeModalBtn"),
    o = document.querySelector(".homeModalOverlay"),
    d = document.getElementById("registrationForm"),
    l = document.getElementById("name"),
    a = document.getElementById("nameError"),
    c = document.getElementById("phone"),
    i = document.getElementById("phoneError"),
    u = document.getElementById("surname"),
    w = document.getElementById("surnameError"),
    r = document.getElementById("submitBtn");

  const E = window.phoneFormatter;

  let p = !1,
    g = 0;

  function f() {
    t &&
      ((p = !0),
      (g = window.scrollY),
      (t.style.display = "block"),
      (document.body.style.overflow = "hidden"),
      (a.style.display = "none"),
      w && (w.style.display = "none"),
      (i.style.display = "none"));
  }

  function v() {
    t &&
      p &&
      ((p = !1),
      (t.style.display = "none"),
      (document.body.style.overflow = ""),
      (document.body.style.position = ""),
      (document.body.style.top = ""),
      window.scrollTo(0, g));
  }

  e.forEach((e) => e.addEventListener("click", f));
  n && n.addEventListener("click", v);
  o && o.addEventListener("click", v);

  d.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!E) {
      console.error("phoneFormatter is not initialized. Check formatter.js load order and p/g variables.");
      i.style.display = "block";
      return;
    }

    const t = l.value.trim(),
      n = c.value.trim(),
      b = u ? u.value.trim() : "";

    let o = !1;

    if (t) a.style.display = "none";
    else (a.style.display = "block"), (o = !0);

    // Familiya maydoni har dizaynda chizilmagan. Bor bo'lsa majburiy, yo'q
    // bo'lsa o'tkazib yuboriladi — aks holda usiz sahifalarda forma umuman
    // yuborilmay qolardi, xatosiz. Bu #timer bilan bir xil qoida.
    if (u) {
      if (b) w.style.display = "none";
      else (w.style.display = "block"), (o = !0);
    }

    if (E.validate(n)) i.style.display = "none";
    else (i.style.display = "block"), (o = !0);

    if (o) return;

    r.textContent = "YUBORILMOQDA...";
    r.disabled = !0;

    // Sana ataylab yuborilmaydi — uni relay Toshkent vaqtida o'zi qo'yadi.
    // Tashrifchining qurilma soati noto'g'ri yoki boshqa mintaqada bo'lishi
    // mumkin, va o'sha vaqt jadvalga o'sha holicha tushardi.
    const payload = {
      Ism: t,
      Familiya: b,
      TelefonRaqam: E.getCurrentCode() + " " + n,
    };

    localStorage.setItem("formData", JSON.stringify(payload));
    window.location.href = "/thankYou.html";

    r.textContent = "DAVOM ETISH";
    r.disabled = !1;
    l.value = "";
    c.value = "";
    u && (u.value = "");
    v();
  });
});

const timerEl = document.getElementById("timer");

if (timerEl) {
  // Start from the value already in the markup, never from a second one
  // hard-coded here. A build in this family shipped 01:02 in the HTML while the
  // JS began at 02:00, so the number visibly jumped a second after load.
  const [mm, ss] = timerEl.textContent.trim().split(":");
  let time = (Number(mm) || 0) * 60 + (Number(ss) || 0);

  // And do not tick during the Speed Index trace window. Measured on an earlier
  // project: identical builds scored 1.6s and 7.8s, the only difference being
  // whether the countdown ran while the page was traced — a page that never
  // stops changing reads to the tool as a page that never finished loading.
  // The first paint already shows the right time, so delaying costs nothing.
  setTimeout(() => {
    const interval = setInterval(() => {
      if (time <= 0) {
        clearInterval(interval);
        return;
      }

      time--;

      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

      timerEl.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
    }, 1000);
  }, 8000);
}
