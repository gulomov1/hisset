// Relay — hamma loyiha uchun bitta manzil. Loyihani PROJECT ajratadi, va u
// registrdagi nom bilan aynan bir xil bo'lishi shart. Mos kelmasa relay
// PROJECT_NOT_FOUND qaytaradi va lead hech qayerga tushmaydi.
// Ikkalasini ham /sheets to'ldiradi; qo'lda yozilmaydi.
const RELAY_ENDPOINT = "{{RELAY_ENDPOINT}}";
const PROJECT_KEY = "{{PROJECT_KEY}}";

async function sendFormData() {
  const status = document.getElementById("orderStatus");
  const description = document.getElementById("orderDescription");
  try {
  const formDataRaw = localStorage.getItem("formData");
  if (!formDataRaw) {
    if (status) status.textContent = "Buyurtma topilmadi";
    if (description) description.textContent = "Kolleksiyaga qaytib, buyurtma formasini toʻldiring.";
    return;
  }

  const formDataObj = JSON.parse(formDataRaw);
  if (status) status.textContent = "Buyurtma yuborilmoqda";
  if (description) description.textContent = "Iltimos, bir oz kuting.";
  if (!RELAY_ENDPOINT.startsWith("https://") || PROJECT_KEY.startsWith("{{")) {
    throw new Error("Order destination is not configured");
  }

  // Ustun nomlari loyihaning o'z jadvalidagi sarlavha bilan aynan mos
  // kelishi kerak. Mos kelmasa relay qatorni yozmaydi va reject qaytaradi.
  // "Royhatdan o'tgan vaqti" ataylab yuborilmaydi — uni relay Toshkent
  // vaqtida o'zi qo'yadi.
  const formData = new FormData();
  formData.append("project", PROJECT_KEY);
  formData.append("Ism", formDataObj.Ism || "");
  formData.append("Telefon raqam", formDataObj.TelefonRaqam || "");

  // Familiya faqat dizaynda alohida maydon bo'lganda yuboriladi. Bo'sh bo'lsa
  // ham qo'shib yuborilsa, jadvalda "Familiya" ustuni yo'q loyihada butun
  // lead INVALID_FIELDS bilan rad etilardi — standart forma esa ikki maydonli.
  if (formDataObj.Familiya) {
    formData.append("Familiya", formDataObj.Familiya);
  }

    const response = await fetch(RELAY_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    // HTTP 200 yetarli emas. Apps Script rad etganda ham 200 qaytaradi va
    // javob ichida { ok: false } bo'ladi — faqat response.ok ga qarash
    // aynan shu loyihada leadlarni jimgina yo'qotgan xato.
    if (!response.ok) throw new Error("HTTP " + response.status);

    const result = await response.json();
    if (!result.ok) throw new Error(result.code + ": " + result.message);

    localStorage.removeItem("formData");
    if (status) status.textContent = "Buyurtmangiz qabul qilindi";
    if (description) description.textContent = "Rahmat! Buyurtma tafsilotlarini aniqlashtirish uchun siz bilan bogʻlanamiz.";
  } catch (error) {
    // localStorage ataylab tozalanmaydi: ma'lumot brauzerda qoladi va
    // sahifa yangilanganda qayta yuborishga urinadi.
    console.error("Lead yuborilmadi:", error);
    if (status) status.textContent = "Buyurtma yuborilmadi";
    if (description) description.textContent = "Iltimos, qaytadan urinib koʻring.";
    const errorEl = document.getElementById("errorMessage");
    if (errorEl) errorEl.style.display = "block";
  }
}

window.onload = sendFormData;
